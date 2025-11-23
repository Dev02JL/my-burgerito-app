"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { JSX } from "react";
import { MessageCircle, X, SendHorizontal } from "lucide-react";

type ChatMessage = {
	id: string;
	user: string;
	text: string;
	ts: number;
	system?: boolean;
	channel?: "general" | "support";
};

function useLocalName(): string {
	const [name, setName] = useState<string>("");
	useEffect(() => {
		try {
			const saved = localStorage.getItem("chat.name");
			if (saved) {
				setName(saved);
				return;
			}
			const n = `Invité-${Math.floor(Math.random() * 9999)}`;
			localStorage.setItem("chat.name", n);
			setName(n);
		} catch {
			setName(`Invité-${Math.floor(Math.random() * 9999)}`);
		}
	}, []);
	return name;
}

export default function ChatSupport(): JSX.Element {
	const [open, setOpen] = useState(false);
	const [connected, setConnected] = useState(false);
	const [messages, setMessages] = useState<ChatMessage[]>([]);
	const [input, setInput] = useState("");
	const [channel, setChannel] = useState<"general" | "support">("support");
	const wsRef = useRef<WebSocket | null>(null);
	const initedRef = useRef<boolean>(false);
	const name = useLocalName();
	const listRef = useRef<HTMLDivElement>(null);
	const inputRef = useRef<HTMLInputElement>(null);
	const isOnline =
		Boolean(wsRef.current && wsRef.current.readyState !== WebSocket.CLOSED) ||
		messages.length > 0 ||
		connected;

	const url = useMemo(() => {
		if (typeof window === "undefined") return "";
		const proto = window.location.protocol === "https:" ? "wss" : "ws";
		return `${proto}://${window.location.host}/api/socket`;
	}, []);

	const ensureSocket = useCallback(async (): Promise<WebSocket | null> => {
		try {
			if (!initedRef.current) {
				await fetch("/api/socket").catch(() => {});
				initedRef.current = true;
			}
			if (wsRef.current && (wsRef.current.readyState === WebSocket.OPEN || wsRef.current.readyState === WebSocket.CONNECTING)) {
				return wsRef.current;
			}
			const ws = new WebSocket(url);
			wsRef.current = ws;
			ws.addEventListener("open", () => setConnected(true));
			ws.addEventListener("error", () => {});
			ws.addEventListener("close", () => {
				setConnected(false);
				wsRef.current = null;
			});
			ws.addEventListener("message", (ev) => {
				try {
					const data = JSON.parse(String(ev.data)) as Partial<ChatMessage>;
					setConnected(true);
					setMessages((prev) => [
						...prev,
						{
							id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
							user: data.system ? "Système" : data.user ?? "Utilisateur",
							text: data.text ?? "",
							ts: typeof data.ts === "number" ? data.ts : Date.now(),
							system: Boolean(data.system),
							channel: (data.channel as "general" | "support") ?? "support",
						},
					]);
				} catch {
					// ignore malformed
				}
			});
			return ws;
		} catch {
			setConnected(false);
			return null;
		}
	}, [url]);

useEffect(() => {
	if (!open) return;
	requestAnimationFrame(() => inputRef.current?.focus());
	void ensureSocket();
}, [open, ensureSocket]);

	useEffect(() => {
		if (!listRef.current) return;
		listRef.current.scrollTop = listRef.current.scrollHeight;
	}, [messages, open]);

	const send = useCallback(() => {
		const text = input.trim();
		if (!text) return;
		const payload = { user: name || "Invité", text, channel };
		const sendVia = (sock: WebSocket) => {
			try {
				sock.send(JSON.stringify(payload));
				setInput("");
			} catch {}
		};
		const sock = wsRef.current;
		if (sock && sock.readyState === WebSocket.OPEN) {
			sendVia(sock);
			return;
		}
		void (async () => {
			const s = sock ?? (await ensureSocket());
			if (!s) return;
			if (s.readyState === WebSocket.OPEN) {
				sendVia(s);
			} else {
				const onOpen = () => {
					sendVia(s);
					s.removeEventListener("open", onOpen);
				};
				s.addEventListener("open", onOpen);
			}
		})();
	}, [input, name, channel, ensureSocket]);

	return (
		<>
			{/* Bouton flottant */}
			<button
				type="button"
				onClick={() => setOpen((v) => !v)}
				className="fixed bottom-4 right-4 h-12 w-12 rounded-full btn-accent shadow-xl flex items-center justify-center"
				aria-label="Ouvrir le chat de support"
			>
				<MessageCircle size={20} />
			</button>

			{/* Fenêtre de chat */}
			{open ? (
				<div className="fixed bottom-20 right-4 w-[320px] sm:w-[360px] rounded-[12px] bg-[#111] border border-white/10 shadow-2xl overflow-hidden z-50">
					<div className="flex items-center justify-between px-3 py-2 border-b border-white/10">
						<div className="text-sm">
							<div className="font-semibold">Support Burgerito</div>
							<div className="text-white/60">{isOnline ? "En ligne" : "Hors ligne"}</div>
						</div>
						<button type="button" className="h-8 w-8 rounded-md bg-white/10 hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-[var(--color-ring)]" onClick={() => setOpen(false)} aria-label="Fermer la fenêtre de chat">
							<X size={16} className="mx-auto" />
						</button>
					</div>

					<div className="px-3 py-2 border-b border-white/10 flex items-center gap-2">
						<label className="text-xs text-white/70" htmlFor="chat-channel">Canal</label>
						<select
							id="chat-channel"
							value={channel}
							onChange={(e) => setChannel(e.target.value as "general" | "support")}
							className="h-8 rounded-md bg-white/10 px-2 text-xs focus:outline-none focus:ring-2 focus:ring-[var(--color-ring)]"
						>
							<option value="support">Support</option>
							<option value="general">Général</option>
						</select>
					</div>

					<div ref={listRef} className="h-[260px] overflow-y-auto p-3 flex flex-col gap-2" role="log" aria-live="polite" aria-relevant="additions">
						{messages.length === 0 ? (
							<div className="text-sm text-white/60">Démarrez la conversation…</div>
						) : (
							messages.map((m) => (
								<div key={m.id} className="text-sm">
									<span className="text-white/60">{new Date(m.ts).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}</span>{" "}
									<span className="font-semibold">{m.user}</span>{" "}
									<span className="text-white/70">[{m.channel}]</span>
									<div className={m.system ? "text-white/60" : ""}>{m.text}</div>
								</div>
							))
						)}
					</div>

					<div className="p-3 flex items-center gap-2">
						<input
							ref={inputRef}
							value={input}
							onChange={(e) => setInput(e.target.value)}
							onKeyDown={(e) => {
								if (e.key === "Enter") send();
							}}
							placeholder="Votre message…"
							aria-label="Saisir votre message"
							className="flex-1 h-10 rounded-md bg-white/10 px-3 text-sm outline-none focus:ring-2 focus:ring-[var(--color-ring)]"
						/>
						<button
							type="button"
							onClick={send}
							disabled={!input.trim()}
							className={`h-10 w-10 rounded-md inline-flex items-center justify-center btn-accent ${
								!input.trim()
									? "opacity-60 pointer-events-none"
									: ""
							}`}
							aria-label="Envoyer"
						>
							<SendHorizontal size={18} />
						</button>
					</div>
				</div>
			) : null}
		</>
	);
}


