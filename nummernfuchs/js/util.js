// util.js — pure helpers: number parsing, chunking, international form.

// Parses raw user input ("640 132") into chunks. Spaces define the
// groups; without spaces the number is auto-chunked. Returns
// { chunks, digits } or { error } with a STRINGS error key suffix.
export function parseNumberInput(raw, type) {
  const cleaned = String(raw || "").trim().replace(/\s+/g, " ");
  if (!cleaned) return { error: "errNumberEmpty" };
  if (!/^[\d ]+$/.test(cleaned)) return { error: "errNumberInvalid" };
  let chunks = cleaned.split(" ").filter(Boolean);
  const digits = chunks.join("");
  if (digits.length < 3) return { error: "errNumberShort" };
  if (digits.length > 16) return { error: "errNumberLong" };
  if (chunks.length === 1) chunks = autoChunk(digits, type);
  if (chunks.some((c) => c.length > 5)) return { error: "errChunkLong" };
  return { chunks, digits };
}

// Auto-grouping when the user typed no spaces: Swiss phone layout for
// 10 digits, otherwise groups of three with a 2+2 tail so no group of
// one digit ever appears (640132 -> 640 132, 79640 -> 796 40).
export function autoChunk(digits, type) {
  if (type === "phone" && digits.length === 10) {
    return [digits.slice(0, 3), digits.slice(3, 6), digits.slice(6, 8), digits.slice(8, 10)];
  }
  const chunks = [];
  let rest = digits;
  while (rest.length > 0) {
    if (rest.length === 4) {
      chunks.push(rest.slice(0, 2), rest.slice(2));
      rest = "";
    } else if (rest.length <= 3) {
      chunks.push(rest);
      rest = "";
    } else {
      chunks.push(rest.slice(0, 3));
      rest = rest.slice(3);
    }
  }
  return chunks;
}

// International form of a phone entry: leading zero of the first chunk
// dropped, country code prefixed ("079 640 13 21" -> +41 79 640 13 21).
export function intlChunks(entry) {
  const first = entry.chunks[0].replace(/^0/, "");
  const rest = entry.chunks.slice(1);
  const parts = first ? [first, ...rest] : rest;
  return ["+" + (entry.cc || "41"), ...parts];
}

export function statusOf(completions) {
  if (!completions) return "neu";
  return completions >= 3 ? "sitzt" : "geuebt";
}

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
