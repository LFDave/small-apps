# add-subtract notes

- Accent family: sage (recorded in the PRODUCT.md app registry). Do not change it.
- Single-file app: all CSS and JS live inline in index.html. The only local asset is favicon.svg, which carries the `?v=N` cache buster.
- The answer input implements the known-length input pattern from PRODUCT.md. Never add a confirm button to it and never add auto-advance timers.
- The progression layer (XP, levels, medals, difficulty proposal) follows GAMIFICATION.md. Medal checks are pure functions of the stats object; never add event flags. Rewards render only in the post-task block, never during input.
- PRD.md in this folder is the single source of truth for behavior. Update it in the same change as any behavior change, and keep the e2e suite in tests/ passing.
