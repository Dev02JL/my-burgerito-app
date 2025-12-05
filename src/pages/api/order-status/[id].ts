import type { NextApiRequest, NextApiResponse } from 'next';

export const config = {
  api: {
    bodyParser: false,
  },
};

type Step = { key: 'preparation' | 'cuisson' | 'prete' | 'livree'; delayMs: number; label: string };

const STEPS: Step[] = [
  { key: 'preparation', delayMs: 0, label: 'En préparation' },
  { key: 'cuisson', delayMs: 2500, label: 'En cuisson' },
  { key: 'prete', delayMs: 2500, label: 'Prête à être livrée' },
  { key: 'livree', delayMs: 2500, label: 'Livrée' },
];

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache, no-transform',
    Connection: 'keep-alive',
  });

  let closed = false;
  req.on('close', () => {
    closed = true;
    try {
      res.end();
    } catch {}
  });

  function send(data: unknown) {
    if (closed) return;
    res.write(`data: ${JSON.stringify(data)}\n\n`);
  }

  let totalDelay = 0;
  STEPS.forEach((step, idx) => {
    totalDelay += step.delayMs;
    setTimeout(() => {
      send({ state: step.key, label: step.label, index: idx, ts: Date.now() });
      if (idx === STEPS.length - 1) {
        setTimeout(() => {
          try {
            res.end();
          } catch {}
        }, 200);
      }
    }, totalDelay);
  });
}
