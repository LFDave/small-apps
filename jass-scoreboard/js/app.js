// app.js — application bootstrap

import { initState } from "./state.js?v=3";
import { loadState } from "./storage.js?v=3";
import { bindUI } from "./ui.js?v=3";
import { render } from "./renderer.js?v=3";

function bootstrap() {
  initState(loadState());
  bindUI();
  render();
}

document.addEventListener("DOMContentLoaded", bootstrap);
