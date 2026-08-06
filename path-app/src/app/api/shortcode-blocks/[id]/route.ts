import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const block = await db.shortcodeBlock.findUnique({
      where: { id },
    });
    if (!block) {
      return NextResponse.json({ success: false, error: "Block không tồn tại" }, { status: 404 });
    }
    return NextResponse.json({ success: true, block });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Database error";
    return NextResponse.json({ success: false, error: errorMsg }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const body = await req.json();
    const { name, key, type, configJson } = body;

    const cleanKey = key
      ? key
          .toLowerCase()
          .trim()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .replace(/[^\w-]/g, "-")
          .replace(/-+/g, "-")
      : undefined;

    const updated = await db.shortcodeBlock.update({
      where: { id },
      data: {
        name,
        key: cleanKey,
        type,
        configJson: typeof configJson === "object" ? JSON.stringify(configJson) : configJson,
      },
    });

    return NextResponse.json({ success: true, block: updated });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Lỗi cập nhật Block";
    return NextResponse.json({ success: false, error: errorMsg }, { status: 400 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    await db.shortcodeBlock.delete({ where: { id } });
    return NextResponse.json({ success: true, message: "Đã xóa Block thành công" });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Lỗi xóa Block";
    return NextResponse.json({ success: false, error: errorMsg }, { status: 400 });
  }
}
