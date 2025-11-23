import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PROTECTED = [/^\/panier/, /^\/commande(\/.*)?$/, /^\/profile(\/.*)?$/];

export function middleware(req: NextRequest) {
	const pathname = req.nextUrl.pathname;
	const isProtected = PROTECTED.some((re) => re.test(pathname));
	if (!isProtected) return NextResponse.next();
	const token = req.cookies.get("auth_token")?.value;
	if (token) return NextResponse.next();
	const url = req.nextUrl.clone();
	url.pathname = "/connexion";
	url.searchParams.set("redirect", pathname);
	return NextResponse.redirect(url);
}

export const config = {
	matcher: ["/((?!_next|api/session|api/socket|api/order-status|public).*)"],
};


