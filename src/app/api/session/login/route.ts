import { NextResponse } from "next/server";

export async function POST(req: Request) {
	try {
		const base = process.env.NEXT_PUBLIC_API_BASE_URL || "https://node-eemi.vercel.app";
		const body = await req.json().catch(() => ({}));
		const res = await fetch(`${base}/api/auth/login`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(body),
			cache: "no-store",
		});
		const data = await res.json().catch(() => ({}));
		if (!res.ok) {
			return NextResponse.json({ message: data?.message || "Login failed" }, { status: res.status });
		}
		const token = data?.token as string | undefined;
		if (!token) return NextResponse.json({ message: "Missing token" }, { status: 500 });
		const response = NextResponse.json({ ok: true });
		response.cookies.set("auth_token", token, {
			httpOnly: true,
			secure: true,
			sameSite: "lax",
			path: "/",
			maxAge: 60 * 60 * 24 * 7, // 7 jours
		});
		return response;
	} catch (e) {
		return NextResponse.json({ message: "Unexpected error" }, { status: 500 });
	}
}


