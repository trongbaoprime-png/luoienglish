import { NextRequest, NextResponse } from "next/server";
import { RepositoryFactory } from "@/repositories/RepositoryFactory";
import {
  verifyServerAccountSession,
  authorizeChildAccess,
  ServerAuthError,
} from "@/services/auth/serverAuth";
import { EnglishLevel, SchoolGrade } from "@/types/student";
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

/**
 * GET /api/children/[childId] — Get child profile if owned by authenticated parent
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ childId: string }> }
) {
  try {
    const { childId } = await params;
    const verifiedAccount = await verifyServerAccountSession(req);
    const parentUid = verifiedAccount.uid;

    const childRepo = RepositoryFactory.getChildRepository();
    const authResult = await authorizeChildAccess(parentUid, childId, childRepo);

    if (!authResult.authorized) {
      return NextResponse.json(
        { success: false, message: authResult.error },
        { status: authResult.statusCode }
      );
    }

    return NextResponse.json({
      success: true,
      data: authResult.child,
    });
  } catch (err: unknown) {
    if (err instanceof ServerAuthError) {
      return NextResponse.json(
        { success: false, message: err.message },
        { status: err.statusCode }
      );
    }
    const msg = err instanceof Error ? err.message : "Lỗi truy xuất hồ sơ học sinh.";
    return NextResponse.json({ success: false, message: msg }, { status: 500 });
  }
}

/**
 * PUT /api/children/[childId] — Update child profile if owned by authenticated parent
 */
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ childId: string }> }
) {
  try {
    const { childId } = await params;
    const verifiedAccount = await verifyServerAccountSession(req);
    const parentUid = verifiedAccount.uid;

    const childRepo = RepositoryFactory.getChildRepository();
    const authResult = await authorizeChildAccess(parentUid, childId, childRepo);

    if (!authResult.authorized) {
      return NextResponse.json(
        { success: false, message: authResult.error },
        { status: authResult.statusCode }
      );
    }

    const body = await req.json().catch(() => ({}));
    const {
      nickname,
      displayName,
      avatarKey,
      schoolGrade,
      englishLevel,
      interests,
      preferences,
      dailyGoalMinutes,
    } = body;

    const updates: Record<string, unknown> = {};

    if (displayName || nickname) {
      const childName = (displayName || nickname).trim();
      if (childName.length < 2 || childName.length > 30) {
        return NextResponse.json(
          { success: false, message: "Tên hiển thị của bé phải từ 2 đến 30 ký tự." },
          { status: 400 }
        );
      }
      updates.nickname = childName;
      updates.displayName = childName;
    }

    if (avatarKey !== undefined) {
      if (!ALLOWED_AVATARS.includes(avatarKey)) {
        return NextResponse.json(
          { success: false, message: "Ảnh đại diện linh vật Chú Lười không hợp lệ." },
          { status: 400 }
        );
      }
      updates.avatarKey = avatarKey;
    }

    if (schoolGrade !== undefined) {
      if (typeof schoolGrade !== "number" || schoolGrade < 0 || schoolGrade > 12) {
        return NextResponse.json(
          { success: false, message: "Khối lớp học không hợp lệ." },
          { status: 400 }
        );
      }
      updates.schoolGrade = schoolGrade as SchoolGrade;
    }

    if (englishLevel !== undefined) {
      if (!ALLOWED_LEVELS.includes(englishLevel)) {
        return NextResponse.json(
          { success: false, message: "Trình độ tiếng Anh không hợp lệ." },
          { status: 400 }
        );
      }
      updates.englishLevel = englishLevel as EnglishLevel;
    }

    if (interests !== undefined && Array.isArray(interests)) {
      updates.interests = interests.slice(0, 10);
    }

    if (preferences !== undefined) {
      const themeId: ThemeId = ALLOWED_THEMES.includes(preferences?.themeId)
        ? preferences.themeId
        : "cozy";

      updates.preferences = {
        themeId,
        soundEffectsEnabled: preferences?.soundEffectsEnabled ?? true,
        backgroundMusicEnabled: preferences?.backgroundMusicEnabled ?? true,
      };
      updates.themePreference = themeId;
    }

    if (dailyGoalMinutes !== undefined) {
      updates.dailyGoalMinutes = Math.min(Math.max(Number(dailyGoalMinutes) || 15, 5), 60);
    }

    // SEC-AUTH-007: parentUid and id are strictly immutable
    delete (updates as { parentUid?: unknown }).parentUid;
    delete (updates as { id?: unknown }).id;

    const updated = await childRepo.update(childId, updates);

    return NextResponse.json({
      success: true,
      message: "Cập nhật hồ sơ học sinh thành công.",
      data: updated,
    });
  } catch (err: unknown) {
    if (err instanceof ServerAuthError) {
      return NextResponse.json(
        { success: false, message: err.message },
        { status: err.statusCode }
      );
    }
    const msg = err instanceof Error ? err.message : "Lỗi cập nhật hồ sơ học sinh.";
    return NextResponse.json({ success: false, message: msg }, { status: 500 });
  }
}

/**
 * DELETE /api/children/[childId] — Delete child profile if owned by authenticated parent
 */
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ childId: string }> }
) {
  try {
    const { childId } = await params;
    const verifiedAccount = await verifyServerAccountSession(req);
    const parentUid = verifiedAccount.uid;

    const childRepo = RepositoryFactory.getChildRepository();
    const authResult = await authorizeChildAccess(parentUid, childId, childRepo);

    if (!authResult.authorized) {
      return NextResponse.json(
        { success: false, message: authResult.error },
        { status: authResult.statusCode }
      );
    }

    await childRepo.delete(childId);

    return NextResponse.json({
      success: true,
      message: "Đã xóa hồ sơ học sinh thành công.",
      deletedChildId: childId,
    });
  } catch (err: unknown) {
    if (err instanceof ServerAuthError) {
      return NextResponse.json(
        { success: false, message: err.message },
        { status: err.statusCode }
      );
    }
    const msg = err instanceof Error ? err.message : "Lỗi xóa hồ sơ học sinh.";
    return NextResponse.json({ success: false, message: msg }, { status: 500 });
  }
}
