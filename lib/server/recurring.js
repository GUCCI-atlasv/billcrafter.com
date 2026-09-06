// Schedule maths for recurring invoices, kept separate so it can be reasoned
// about (and reused by both the API and the cron runner).

export const FREQS = ["weekly", "monthly", "quarterly", "yearly"];

// Advance a date by one period. Month-based steps clamp to the last day of the
// target month, so a 31st-of-the-month schedule doesn't skip February.
export function nextRun(fromMs, freq) {
  const d = new Date(fromMs);
  if (freq === "weekly") { d.setUTCDate(d.getUTCDate() + 7); return d.getTime(); }

  const step = freq === "yearly" ? 12 : freq === "quarterly" ? 3 : 1;
  const day = d.getUTCDate();
  const target = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth() + step, 1, d.getUTCHours(), d.getUTCMinutes()));
  const lastDay = new Date(Date.UTC(target.getUTCFullYear(), target.getUTCMonth() + 1, 0)).getUTCDate();
  target.setUTCDate(Math.min(day, lastDay));
  return target.getTime();
}

// Roll a due schedule forward past any missed periods (e.g. after downtime),
// so one outage doesn't fire a burst of back-dated invoices.
export function catchUp(nextMs, freq, nowMs = Date.now()) {
  let n = nextMs;
  let guard = 0;
  while (n <= nowMs && guard++ < 200) n = nextRun(n, freq);
  return n;
}
