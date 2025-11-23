import type { NextApiRequest, NextApiResponse } from "next";
import { WebSocketServer, type WebSocket } from "ws";

export const config = {
	api: {
		bodyParser: false,
	},
};

type ServerWithWSS = NextApiResponse["socket"] & {
	server: {
		wss?: WebSocketServer;
		on: (event: "upgrade", cb: (req: any, socket: any, head: any) => void) => void;
	};
};

function setupWSS(res: NextApiResponse) {
	const srv = res.socket as ServerWithWSS;
	if (srv.server.wss) return srv.server.wss;

	const wss = new WebSocketServer({ noServer: true });

	srv.server.on("upgrade", (req: any, socket: any, head: any) => {
		if (req.url !== "/api/socket") return;
		wss.handleUpgrade(req, socket, head, (ws) => {
			wss.emit("connection", ws, req);
		});
	});

	wss.on("connection", (ws: WebSocket) => {
		try {
			ws.send(JSON.stringify({ system: true, text: "Connecté au support Burgerito.", ts: Date.now() }));
		} catch {}

		ws.on("message", (raw: Buffer) => {
			let payload: unknown;
			try {
				payload = JSON.parse(raw.toString("utf8"));
			} catch {
				payload = { text: raw.toString("utf8") };
			}
			const msg = JSON.stringify({ ...((payload ?? {}) as object), ts: Date.now() });
			wss.clients.forEach((client) => {
				try {
					if ((client as WebSocket).readyState === 1) (client as WebSocket).send(msg);
				} catch {}
			});
		});
	});

	srv.server.wss = wss;
	return wss;
}

export default function handler(_req: NextApiRequest, res: NextApiResponse) {
	setupWSS(res);
	res.status(200).end("ok");
}


