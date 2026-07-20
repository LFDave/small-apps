// app.js — application bootstrap

import { initState } from "./state.js?v=4";
import { loadState } from "./storage.js?v=4";
import { bindUI } from "./ui.js?v=4";
import { render } from "./renderer.js?v=4";

function bootstrap() {
  initState(loadState());
  bindUI();
  render();
}

document.addEventListener("DOMContentLoaded", bootstrap);
