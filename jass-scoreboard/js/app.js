// app.js — application bootstrap

import { initState } from "./state.js?v=5";
import { loadState } from "./storage.js?v=5";
import { bindUI } from "./ui.js?v=5";
import { render } from "./renderer.js?v=5";

function bootstrap() {
  initState(loadState());
  bindUI();
  render();
}

document.addEventListener("DOMContentLoaded", bootstrap);
