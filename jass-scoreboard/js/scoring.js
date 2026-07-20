// scoring.js — score validation, totals, win check, chalk-mark decomposition

/**
 * Validate a round score. Negative values are corrections.
 * Returns an error message (German) or null if valid.
 */
function validatePoints(value) {
  if (!Number.isInteger(value)) return "Punkte müssen eine ganze Zahl sein.";
  if (value === 0) return "Punkte dürfen nicht 0 sein.";
  if (Math.abs(value) > 500) return "Maximal 500 Punkte pro Eintrag.";
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
 * Decompose a single round's points into chalk strokes:
 * hundreds on the top bar, fifties on the diagonal, twenties on the
 * bottom bar, rest below 20 as a number.
 */
function decomposeEntry(points) {
  const hundreds = Math.floor(points / 100);
  let rest = points % 100;
  const fifties = Math.floor(rest / 50);
  rest %= 50;
  const twenties = Math.floor(rest / 20);
  rest %= 20;
  return { hundreds, fifties, twenties, remainder: rest };
}

/**
 * The written rest number must never reach 20: whenever the
 * accumulated rest hits 20, a 20-mark is written on the bottom bar
 * and the number is rewritten with what's left.
 */
function carryRest(team) {
  while (team.remainder >= 20) {
    team.remainder -= 20;
    team.twenties += 1;
  }
}

/**
 * A correction (negative entry) wipes marks from the highest value
 * down: whole 100s first, then 50s, then 20s, as much as is needed;
 * what's left is taken off the rest number. If the rest would go
 * negative, the next-lowest available mark is wiped and the leftover
 * rewritten (as 20-marks + rest), like a chalk writer correcting the
 * board.
 */
function removeMarks(team, amount) {
  let need = amount;
  while (need >= 100 && team.hundreds > 0) { team.hundreds--; need -= 100; }
  while (need >= 50 && team.fifties > 0) { team.fifties--; need -= 50; }
  while (need >= 20 && team.twenties > 0) { team.twenties--; need -= 20; }
  team.remainder -= need;
  while (team.remainder < 0) {
    if (team.twenties > 0) { team.twenties--; team.remainder += 20; }
    else if (team.fifties > 0) { team.fifties--; team.remainder += 50; }
    else if (team.hundreds > 0) { team.hundreds--; team.remainder += 100; }
    else { team.remainder = 0; break; } // guarded by total validation
  }
  carryRest(team);
}

/**
 * Accumulate chalk marks over the whole entry sequence — real chalk
 * semantics: each round is written once and its strokes stay on the
 * board forever. Marks are NEVER converted between lines (no
 * exchanging five twenties for a hundred). Corrections (negative
 * entries) are the one sanctioned way marks get wiped besides undo.
 */
function computeMarks(entries) {
  const marks = {
    A: { hundreds: 0, fifties: 0, twenties: 0, remainder: 0 },
    B: { hundreds: 0, fifties: 0, twenties: 0, remainder: 0 }
  };
  for (const e of entries) {
    const team = marks[e.teamId];
    if (!team || !Number.isFinite(e.points)) continue;
    if (e.points < 0) {
      removeMarks(team, -e.points);
      continue;
    }
    const d = decomposeEntry(e.points);
    team.hundreds += d.hundreds;
    team.fifties += d.fifties;
    team.twenties += d.twenties;
    team.remainder += d.remainder;
    carryRest(team);
  }
  return marks;
}

export { validatePoints, computeTotals, findWinner, computeMarks };
