# add-subtract notes

- Accent family: sage (recorded in the PRODUCT.md app registry). Do not change it.
- Single-file app: all CSS and JS live inline in index.html. The only local asset is favicon.svg, which carries the `?v=N` cache buster.
- The answer input implements the known-length input pattern from PRODUCT.md. Never add a confirm button to it and never add auto-advance timers.
- The progression layer (XP, levels, medals, difficulty proposal) follows GAMIFICATION.md. Medal checks are pure functions of the stats object; never add event flags. Rewards render only in the post-task block, never during input.
- Hints (`plusHint` and `minusHint`) are pure functions of the two operands. They answer four questions in order, listed in PRD.md: close to the first number, close to a whole ten, do the ones cross a ten, otherwise tens before ones. Keep that order intact; changing it changes what a child is taught.
- Every hint returns a `rule` id naming the branch that produced it. It is not rendered, it keeps the tests and the PRD table honest.
- Four rules hold for every branch: the steps are arithmetically true, exactly the last step stays open with "?", no step starts from a pointless zero, and at most three steps. The hint never writes out the solved task. When you touch a branch, re-check the whole table in PRD.md, including custom ranges up to 1000.
- A hint is free. It never costs XP and never blocks a medal. It only keeps the task out of the clean-run streak behind the difficulty proposal.
- "Alles zurücksetzen" belongs in the home footer with its confirm, per PRODUCT.md. It clears `add-subtract.stats` and keeps `add-subtract.settings`.
- PRD.md in this folder is the single source of truth for behavior. Update it in the same change as any behavior change, and keep the e2e suite in tests/ passing.
