import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
	try {
		const cookieStore = await cookies();
		const token = cookieStore.get("auth_token")?.value;
		if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
		const base = process.env.NEXT_PUBLIC_API_BASE_URL || "https://node-eemi.vercel.app";
		const body = await req.json().catch(() => ({}));
		const res = await fetch(`${base}/api/orders`, {
			method: "POST",
			headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
			body: JSON.stringify(body),
			cache: "no-store",
		});
		const data = await res.json().catch(() => ({}));
		return NextResponse.json(data, { status: res.status });
	} catch {
		return NextResponse.json({ message: "Unexpected error" }, { status: 500 });
	}
}


