import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
	try {
		const cookieStore = await cookies();
		const token = cookieStore.get("auth_token")?.value;
		if (!token) return NextResponse.json({ user: null }, { status: 200 });
		const base = process.env.NEXT_PUBLIC_API_BASE_URL || "https://node-eemi.vercel.app";
		const res = await fetch(`${base}/api/auth/me`, {
			headers: { Authorization: `Bearer ${token}` },
			cache: "no-store",
		});
		if (!res.ok) return NextResponse.json({ user: null }, { status: 200 });
		const data = await res.json().catch(() => ({}));
		return NextResponse.json(data, { status: 200 });
	} catch {
		return NextResponse.json({ user: null }, { status: 200 });
	}
}


