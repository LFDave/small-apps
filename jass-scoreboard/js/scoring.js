// scoring.js — score validation, totals, win check, chalk-mark decomposition

/**
 * Validate a round score. Returns an error message (German) or null if valid.
 */
function validatePoints(value) {
  if (!Number.isInteger(value)) return "Punkte müssen eine ganze Zahl sein.";
  if (value < 1) return "Punkte müssen grösser als 0 sein.";
  if (value > 500) return "Maximal 500 Punkte pro Eintrag.";
  return null;
}

/**
 * Totals are always derived from the entry list, never edited directly.
 */
function computeTotals(entries) {
  const totals = { A: 0, B: 0 };
  for (const e of entries) {
    if (totals[e.teamId] !== undefined && Number.isFinite(e.points)) {
      totals[e.teamId] += e.points;
    }
  }
  return totals;
}

/**
 * A team wins when its total EXCEEDS the target score (strictly greater).
 */
function findWinner(totals, targetScore) {
  for (const id of ["A", "B"]) {
    if (totals[id] > targetScore) return id;
  }
  return null;
}

/**
 * Decompose a running total into classic Schieber chalk notation:
 * hundreds on the top bar, fifties on the diagonal, twenties on the
 * bottom bar, remainder written as a number. The board is always kept
 * in canonical form — five twenties are automatically "exchanged" for
 * a hundred, exactly like a tidy chalk writer would do.
 */
function decompose(total) {
  const hundreds = Math.floor(total / 100);
  let rest = total % 100;
  const fifties = Math.floor(rest / 50);
  rest %= 50;
  const twenties = Math.floor(rest / 20);
  rest %= 20;
  return { hundreds, fifties, twenties, remainder: rest };
}

export { validatePoints, computeTotals, findWinner, decompose };
