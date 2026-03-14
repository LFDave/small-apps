// state.js — global state definition and mutations

const DEFAULT_STATE = {
  teams: [
    { id: "A", name: "Team A" },
    { id: "B", name: "Team B" }
  ],
  entries: [],
  totals: {
    A: 0,
    B: 0
  },
  targetScore: 2500,
  flipped: false,
  winner: null,
  gameFinished: false
};

let state = JSON.parse(JSON.stringify(DEFAULT_STATE));

function getState() {
  return state;
}

function setState(newState) {
  state = newState;
}

function resetState() {
  const preserved = {
    teams: state.teams.map(t => ({ ...t })),
    targetScore: state.targetScore,
    flipped: state.flipped
  };
  state = {
    ...JSON.parse(JSON.stringify(DEFAULT_STATE)),
    teams: preserved.teams,
    targetScore: preserved.targetScore,
    flipped: preserved.flipped
  };
}

function setTeamName(teamId, name) {
  const trimmed = name.trim();
  if (trimmed.length < 1 || trimmed.length > 30) return false;
  const team = state.teams.find(t => t.id === teamId);
  if (!team) return false;
  team.name = trimmed;
  return true;
}

function setTargetScore(value) {
  const n = parseInt(value, 10);
  if (isNaN(n) || n < 100 || n > 10000) return false;
  state.targetScore = n;
  return true;
}

function flipBoard() {
  state.flipped = !state.flipped;
}

export { getState, setState, resetState, setTeamName, setTargetScore, flipBoard };
