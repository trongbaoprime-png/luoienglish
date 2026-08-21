import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { RepositoryFactory } from "@/repositories/RepositoryFactory";
import {
  verifyServerAccountSession,
  ServerAuthError,
} from "@/services/auth/serverAuth";
import { ChildProfile, EnglishLevel, SchoolGrade } from "@/types/student";
import { ThemeId } from "@/types/theme";

const ALLOWED_AVATARS = [
  "avatar_sloth_cozy",
  "avatar_sloth_explorer",
  "avatar_sloth_artist",
  "avatar_sloth_hero",
  "avatar_sloth_scholar",
  "avatar_sloth_sporty",
];

const ALLOWED_LEVELS: EnglishLevel[] = ["Pre-A1", "A1", "A1+", "A2", "B1", "B2"];
const ALLOWED_THEMES: ThemeId[] = ["cozy", "explorer"];
const MAX_CHILDREN_PER_PARENT = 5;

/**
 * GET /api/children — List all active child profiles owned by authenticated parent
 */
export async function GET(req: NextRequest) {
  try {
    const verifiedAccount = await verifyServerAccountSession(req);
    const parentUid = verifiedAccount.uid;

    const childRepo = RepositoryFactory.getChildRepository();
    const children = await childRepo.findByParentUid(parentUid, false);

    return NextResponse.json({
      success: true,
      data: children,
    });
  } catch (err: unknown) {
    if (err instanceof ServerAuthError) {
      return NextResponse.json(
        { success: false, message: err.message },
        { status: err.statusCode }
      );
    }
    const msg = err instanceof Error ? err.message : "Lỗi truy xuất danh sách học sinh.";
    return NextResponse.json({ success: false, message: msg }, { status: 500 });
  }
}

/**
 * POST /api/children — Create a new child profile for authenticated parent
 */
export async function POST(req: NextRequest) {
  try {
    const verifiedAccount = await verifyServerAccountSession(req);
    const parentUid = verifiedAccount.uid;

    const childRepo = RepositoryFactory.getChildRepository();

    // 1. Enforce Max Children Limit
    const currentCount = await childRepo.countByParentUid(parentUid);
    if (currentCount >= MAX_CHILDREN_PER_PARENT) {
      return NextResponse.json(
        {
          success: false,
          message: `Tài khoản đã đạt giới hạn tối đa ${MAX_CHILDREN_PER_PARENT} hồ sơ học sinh.`,
        },
        { status: 400 }
      );
    }

    const body = await req.json().catch(() => ({}));
    const {
      nickname,
      displayName,
      avatarKey = "avatar_sloth_cozy",
      schoolGrade = 1,
      englishLevel = "A1",
      interests = [],
      preferences = { themeId: "cozy" },
      dailyGoalMinutes = 15,
    } = body;

    const childName = (displayName || nickname || "").trim();

    // 2. Input Validation
    if (!childName || childName.length < 2 || childName.length > 30) {
      return NextResponse.json(
        { success: false, message: "Tên hiển thị của bé phải từ 2 đến 30 ký tự." },
        { status: 400 }
      );
    }

    if (!ALLOWED_AVATARS.includes(avatarKey)) {
      return NextResponse.json(
        { success: false, message: "Ảnh đại diện linh vật Chú Lười không hợp lệ." },
        { status: 400 }
      );
    }

    if (typeof schoolGrade !== "number" || schoolGrade < 0 || schoolGrade > 12) {
      return NextResponse.json(
        { success: false, message: "Khối lớp học không hợp lệ (0 = Mầm non, 1–12 = Lớp 1–12)." },
        { status: 400 }
      );
    }

    if (!ALLOWED_LEVELS.includes(englishLevel)) {
      return NextResponse.json(
        { success: false, message: "Trình độ tiếng Anh không hợp lệ." },
        { status: 400 }
      );
    }

    const themeId: ThemeId = ALLOWED_THEMES.includes(preferences?.themeId)
      ? preferences.themeId
      : "cozy";

    const dailyMinutes = Math.min(Math.max(Number(dailyGoalMinutes) || 15, 5), 60);

    const childId = `child_${crypto.randomBytes(8).toString("hex")}`;
    const now = new Date().toISOString();

    const newChild: ChildProfile = {
      id: childId,
      parentUid, // SEC-AUTH-001: Server-derived, never trusted from client
      nickname: childName,
      displayName: childName,
      avatarKey,
      schoolGrade: schoolGrade as SchoolGrade,
      englishLevel: englishLevel as EnglishLevel,
      interests: Array.isArray(interests) ? interests.slice(0, 10) : [],
      preferences: {
        themeId,
        soundEffectsEnabled: preferences?.soundEffectsEnabled ?? true,
        backgroundMusicEnabled: preferences?.backgroundMusicEnabled ?? true,
      },
      themePreference: themeId,
      dailyGoalMinutes: dailyMinutes,
      totalStudyTimeMinutes: 0,
      streakDays: 0,
      lastActiveDate: now.split("T")[0]!,
      isArchived: false,
      createdAt: now,
      updatedAt: now,
    };

    const created = await childRepo.create(newChild);

    return NextResponse.json(
      {
        success: true,
        message: "Tạo hồ sơ học sinh thành công.",
        data: created,
      },
      { status: 201 }
    );
  } catch (err: unknown) {
    if (err instanceof ServerAuthError) {
      return NextResponse.json(
        { success: false, message: err.message },
        { status: err.statusCode }
      );
    }
    const msg = err instanceof Error ? err.message : "Lỗi tạo hồ sơ học sinh.";
    return NextResponse.json({ success: false, message: msg }, { status: 500 });
  }
}
