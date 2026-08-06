import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  try {
    const { username, password } = await req.json();

    const expectedUser = process.env.ADMIN_USER || "admin";
    const expectedPass = process.env.ADMIN_PASS || "B@oph@m021991";

    if (username === expectedUser && password === expectedPass) {
      const cookieStore = await cookies();
      const sessionToken = Buffer.from(`${username}:${Date.now()}`).toString("base64");

      cookieStore.set("luoi_admin_session", sessionToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 30, // 30 days session
      });

      return NextResponse.json({ success: true, message: "Đăng nhập thành công" });
    }

    return NextResponse.json({ success: false, error: "Tên đăng nhập hoặc mật khẩu không đúng!" }, { status: 401 });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message || "Lỗi đăng nhập" }, { status: 500 });
  }
}
