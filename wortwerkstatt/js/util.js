// util.js — pure helpers with no app knowledge beyond the shape of a
// progress record.

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

// Chapter status from the stored counters. A chapter counts as solid
// after three rounds finished without a single wrong answer, so the
// label means something; a round with mistakes still counts as
// practice.
export function statusOf(progress) {
  if (!progress || !progress.rounds) return "neu";
  return progress.clean >= 3 ? "sitzt" : "geuebt";
}

// A rule is only solid once every one of its chapters is, including the
// writing chapter. Anything less than that, but more than nothing, is
// practised.
export function topicStatus(topic, chapters) {
  const states = topic.chapters.map((chapter) => statusOf(chapters[chapter.id]));
  if (states.every((s) => s === "sitzt")) return "sitzt";
  if (states.some((s) => s !== "neu")) return "geuebt";
  return "neu";
}
