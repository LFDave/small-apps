// util.js — pure helpers with no app knowledge.

export function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  }[c]));
}

// Topic status from the stored counters. A topic counts as solid after
// three rounds finished without a single wrong answer, so the label
// means something; a round with mistakes still counts as practice.
export function statusOf(progress) {
  if (!progress || !progress.rounds) return "neu";
  return progress.clean >= 3 ? "sitzt" : "geuebt";
}
