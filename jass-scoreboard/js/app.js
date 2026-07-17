// app.js — application bootstrap

import { initState } from "./state.js";
import { loadState } from "./storage.js";
import { bindUI } from "./ui.js";
import { render } from "./renderer.js";

function bootstrap() {
  initState(loadState());
  bindUI();
  render();
}

document.addEventListener("DOMContentLoaded", bootstrap);
