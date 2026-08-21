import crypto from "crypto";
import { IUserRepository } from "@/repositories/interfaces/IUserRepository";
import { PinRecord, PinVerificationResult } from "@/types/auth";
import { ParentModeSessionService } from "./ParentModeSessionService";

export class ParentalGateService {
  private userRepo: IUserRepository;
  private maxFailedAttempts = 5;
  private lockoutDurationMs = 5 * 60 * 1000; // 5 minutes
  private defaultIterations = 100000; // 100,000 iterations for PBKDF2-HMAC-SHA256

  constructor(userRepo: IUserRepository) {
    this.userRepo = userRepo;
  }

  /**
   * Generates a secure salt and hashes the PIN using PBKDF2 with metadata
   */
  private hashPin(pin: string, salt: string, iterations = this.defaultIterations): string {
    return crypto.pbkdf2Sync(pin, salt, iterations, 32, "sha256").toString("hex");
  }

  /**
   * Sets or updates parental PIN for a parent account with stateful security version increment
   */
  public async setPin(parentUid: string, pin: string): Promise<void> {
    if (!/^\d{4,6}$/.test(pin)) {
      throw new Error("Mã PIN phải từ 4 đến 6 chữ số.");
    }

    const currentRecord = await this.userRepo.getPinRecord(parentUid);
    const newSecurityVersion = (currentRecord?.securityVersion || 0) + 1;

    const salt = crypto.randomBytes(16).toString("hex");
    const pinHash = this.hashPin(pin, salt, this.defaultIterations);

    const record: PinRecord = {
      parentUid,
      pinHash,
      salt,
      version: 1,
      algo: "pbkdf2-sha256",
      iterations: this.defaultIterations,
      securityVersion: newSecurityVersion,
      failedAttempts: 0,
      updatedAt: new Date().toISOString(),
    };

    await this.userRepo.savePinRecord(record);
    await this.userRepo.update(parentUid, { isPinSet: true, securityVersion: newSecurityVersion });
  }

  /**
   * Verifies parental PIN with rate limiting, temporary lockout, and stateful session issuance
   */
  public async verifyPin(parentUid: string, inputPin: string): Promise<PinVerificationResult> {
    const record = await this.userRepo.getPinRecord(parentUid);

    if (!record || !record.pinHash) {
      return {
        success: false,
        isLocked: false,
        message: "Chưa thiết lập mã PIN phụ huynh.",
      };
    }

    const now = Date.now();

    // 1. Check if currently locked out
    if (record.lockedUntil) {
      const lockExpiry = new Date(record.lockedUntil).getTime();
      if (now < lockExpiry) {
        const remainingMinutes = Math.ceil((lockExpiry - now) / 60000);
        return {
          success: false,
          isLocked: true,
          lockedUntil: record.lockedUntil,
          attemptsRemaining: 0,
          message: `Tạm thời khóa do nhập sai nhiều lần. Vui lòng thử lại sau ${remainingMinutes} phút.`,
        };
      }
    }

    // 2. Compute hash with stored iteration count and compare in constant time
    const iterations = record.iterations || this.defaultIterations;
    const inputHash = this.hashPin(inputPin, record.salt, iterations);
    const isMatch = crypto.timingSafeEqual(
      Buffer.from(inputHash, "hex"),
      Buffer.from(record.pinHash, "hex")
    );

    if (isMatch) {
      // Reset failure counters on successful authentication
      await this.userRepo.savePinRecord({
        ...record,
        failedAttempts: 0,
        lockedUntil: undefined,
        updatedAt: new Date().toISOString(),
      });

      // Create a short-lived Parent Mode Session token (15 mins) tied to current securityVersion
      const { token } = ParentModeSessionService.createSession(
        parentUid,
        record.securityVersion || 1
      );

      return {
        success: true,
        isLocked: false,
        parentModeSessionToken: token,
        message: "Xác thực mã PIN phụ huynh thành công.",
      };
    }

    // 3. Handle incorrect PIN
    const failedAttempts = (record.failedAttempts || 0) + 1;
    let lockedUntil: string | undefined = undefined;
    let isLocked = false;

    if (failedAttempts >= this.maxFailedAttempts) {
      lockedUntil = new Date(now + this.lockoutDurationMs).toISOString();
      isLocked = true;
    }

    await this.userRepo.savePinRecord({
      ...record,
      failedAttempts,
      lockedUntil,
      updatedAt: new Date().toISOString(),
    });

    const attemptsRemaining = Math.max(0, this.maxFailedAttempts - failedAttempts);

    return {
      success: false,
      isLocked,
      lockedUntil,
      attemptsRemaining,
      message: isLocked
        ? `Nhập sai quá ${this.maxFailedAttempts} lần. Tính năng bị tạm khóa trong 5 phút.`
        : `Mã PIN không chính xác. Bạn còn ${attemptsRemaining} lần thử.`,
    };
  }

  /**
   * Resets parental PIN and increments securityVersion to immediately revoke any existing sessions
   */
  public async resetPin(parentUid: string): Promise<void> {
    const currentRecord = await this.userRepo.getPinRecord(parentUid);
    const newSecurityVersion = (currentRecord?.securityVersion || 0) + 1;

    await this.userRepo.savePinRecord({
      parentUid,
      pinHash: "",
      salt: "",
      version: 1,
      algo: "pbkdf2-sha256",
      iterations: this.defaultIterations,
      securityVersion: newSecurityVersion,
      failedAttempts: 0,
      updatedAt: new Date().toISOString(),
    });

    await this.userRepo.update(parentUid, { isPinSet: false, securityVersion: newSecurityVersion });
  }
}
