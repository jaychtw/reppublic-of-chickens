# Republic of Chickens — Game Design Document

**Version:** 1.0 — production handoff  
**Date:** 2026-10-26  
**Status:** Creative decisions locked; implementation details delegated within stated boundaries  
**Suggested repository:** `republic-of-chickens`  
**Platforms:** Desktop and mobile web browsers  
**Languages:** English and Traditional Chinese (zh-TW), both first-class at launch  
**Genre:** Five-mini-game collection, framed as a compact society-management game with satirical narrative  
**Audience and tone:** Family-accessible mechanics, witty political/social allegory, gently unsettling subtext; no graphic harm

> **Premise:** You govern a small, seemingly democratic republic of anthropomorphic chickens. You provide food, housing, social opportunities, medical care, and a forum for civic debate. The chickens disagree about your motives. You may not yet have decided your motives yourself.

## 1. Creative identity and nonnegotiable principles

The surface game is cheerful, inviting and replayable. The underlying satire emerges from the discrepancy between a republic's language of citizenship and the physical reality of a chicken farm. Do **not** explain the allegory in tutorial text, award a "correct morality" achievement, reveal a canonical slaughter plan, or depict slaughter. The Governor is not secretly assigned a villainous intent.

The player manages what exists, and may eventually confront what the republic is for. The future is genuinely unwritten within the depicted game. Avoid moral lectures and overt political endorsement. The chickens' opinions are character viewpoints, not authoritative verdicts. Humor should come from confident disagreement, bureaucratic euphemism, everyday details, and the occasional uncomfortable observation.

**Narrative promise:** The republic's present is playable; its ultimate fate is chosen but never shown.

**Core player loop:** Republic overview → choose one of five halls → play or observe its distinctive activity → receive score/progress and contextual feedback → return to overview → complete five aspects → unlock optional Moment of Truth → make a choice → short ambiguous epilogue → return to the republic and continue.

## 2. Scope, structure and progression

Exactly **five halls** appear on the republic overview from the beginning:

1. **Town Hall:** One substantial authored debate, read or watched.
2. **Mess Hall:** Food-distribution puzzle.
3. **Social Hall:** 4×4 concentration/memory matching.
4. **Residential Hall:** Visual nuisance removal and repairs, inspired by the *Squirrel Control* search-and-interact mechanic.
5. **Welfare Hall:** Visual drag-and-drop patient-to-treatment matching.

A prominent **Republic Satisfaction** meter summarizes the current performance of the four practical halls. It is *not* a political approval/loyalty meter. Town Hall contributes completion status but no numerical satisfaction score.

Each practical hall earns a **permanent check mark** when the player scores **at least 80%** on a completed round. Town Hall earns a permanent check mark after the entire authored debate is encountered. The overview displays **0/5 through 5/5**. Replays can improve best scores but never revoke earned checks. The four practical halls are individually replayable, with no hard failure that blocks progression.

Once all five checks are earned, **The Moment of Truth** becomes available on the overview. It is optional; the player may continue playing indefinitely without selecting an ending. After choosing, save the selected option and show a short epilogue, then return to the same playable republic. Do not reset scores or erase citizens. Allow the player to revisit the scene and reconsider the choice; do not portray a selected future as already realized.

**Progression is aspect-based, not day-based.** No hunger decay while reading a debate; no real-time global deadlines, obligatory calendar, recurring bills, breeding simulation, production chains, or mandatory resource grind. Each hall is a self-contained activity. The food puzzle may use a round-specific limited food supply; this is a puzzle constraint, not a persistent economy.

## 3. Republic overview and shared UX

Show a charming, spatially coherent farm-republic with **five distinct, recognizable buildings** and animated or illustrated chicken residents. The farm's fences and utilitarian infrastructure can be present without becoming threatening. The five halls are clearly selectable and visually integrated into one illustrated environment, not five disconnected dashboard cards.

Show:
- Republic title and a compact overall satisfaction meter (0–100%).
- Five hall entry points, their names, best score / Town Hall read state, and earned check marks.
- Five-aspect progress (e.g., 3/5).
- The Moment of Truth entry, locked until all checks are earned, then available without pressure.
- Language toggle, sound and motion settings, help, and save/export/import access.

**Satisfaction calculation (v1 default):** mean of the four practical halls' **latest completed round scores**; unplayed halls count as 0 until played. This measures current reported conditions, not civic agreement. Show a clear label so it cannot be confused with the permanent milestone check marks. Best scores are stored separately. The meter may decrease after a poorer replay without removing checks. This distinction is intentional.

Navigation is non-destructive. Leaving a hall should not discard already earned achievements. Use clear in-hall instructions and a persistent return-to-overview control. Avoid excessive modals or unskippable animations.

## 4. Town Hall — the civic debate

**Role:** Narrative and lore. The Governor listens but **cannot vote, respond, persuade, interrupt, or alter the conversation**. This is passive participation by design.

**Format:** One substantial, authored, coherent debate with three identifiable voices and an opening and closing. Deliver via elegant still illustrations with expressive poses, light transitions, or restrained animation. High-quality stills are preferable to crude motion. Distinct portraits, expressions and readable subtitles are mandatory.

**Voices:**
- **Hopeful:** Appreciates food, shelter and security; trusts the Governor and fears destabilizing rumors.
- **Skeptical:** Notices anomalies, asks for evidence, resists premature conclusions.
- **Radical / tragic prophet:** Warns that chickens are being raised for slaughter and consumption; urgent and dramatic, but neither officially vindicated nor dismissed.

They may be funny, irritating, insightful, contradictory, or unexpectedly compassionate. Avoid presenting any faction as a caricature that is *always* wrong. The Governor's ultimate intentions are not established.

**Required narrative beats (author original dialogue; not a literal script):**
1. Hopeful praise for plentiful food, housing and protection.
2. Skeptical concern about fences, access, unexplained arrangements or missing transparency.
3. Radical assertion of slaughter/consumption and demand for action.
4. Hopeful accusation that the radicals endanger social stability.
5. Skeptical willingness to entertain danger but disbelief at the scale or logistics of eating *all* the chickens.
6. A conclusion without consensus or omniscient explanation.

**Persistence and controls:**
- Player can exit at any moment; the precise dialogue line/scene position persists across hall visits and reloads.
- On re-entry: **Resume** (default) or **Replay from beginning**.
- Provide **Next**, **Previous** (within current reading), **Auto-play/Pause**, **Skip/scroll to end**, and a transcript/scroll option for accessibility.
- Town Hall check is earned when the player reaches the final beat either by advancing/auto-play to completion **or by scrolling to the end of the full transcript**, analogous to finishing a long agreement. The completion is about exposure, *not* endorsement or comprehension.
- A replay does not revoke the check. The debate does not restart automatically after returning to overview.
- On mobile, text must remain readable without relying on hover or long animations.
- No real-time global score decays during the debate.

**Suggested duration:** roughly 3–5 minutes at a natural reading pace; keep dialogue punchy and varied. Do not pad it to reach a duration.

## 5. Mess Hall — food-distribution puzzle

**Role:** Nutrition, fullness and equitable provisioning.

**Core:** A short, finite allocation puzzle. Several groups of chickens each have a clear hunger target and simple dietary preference or restriction. A limited set of food tokens (grain, vegetables, protein-rich feed, etc.) must be distributed by tap/click or drag to group trays. Each food has visible fullness and nutrition attributes. Player may redistribute before submitting.

**Round specification (v1 default):**
- Three chicken groups; three food types; finite supply.
- Each group has a fullness target and one clearly communicated dietary need.
- All puzzle information is visible; no random hidden penalties.
- Player assigns tokens and presses **Serve Meal** to score; provide immediate, legible feedback and a **Retry / New Round** option.
- Supply is tuned so 100% is achievable with a valid allocation. Generate from curated solvable layouts or validated generation.
- Scoring: 60 points for how well fullness targets are met (no reward for excess feeding), 40 for nutritional fit; 0–100, integer. Display fullness for each group and final overall score.
- Difficulty comes from tradeoffs, not a timer. Unlimited retries.
- Any completed round ≥80% permanently checks the Mess Hall.

Narrative flavor: Hopeful chickens praise the feast; skeptics question the sourcing or purpose; radicals interpret generosity as fattening. Use sparingly as ambient one-liners, never as a tutorial lecture.

## 6. Social Hall — concentration / matchmaking memory game

**Role:** Recreation, social connection and an amusing visual metaphor for pairing citizens.

**Locked mechanic:** **4×4 grid, 16 cards, eight matching pairs**. Show all cards face-up for **3 seconds**, then automatically turn them face-down. Player flips two cards at a time to find matching pairs. Matched cards remain revealed. Mismatches remain visible briefly, then flip back automatically. Prevent third-card clicks during mismatch resolution. Support touch, mouse and keyboard.

**Art:** Eight distinct, legible chicken portraits or social-event emblems, each duplicated once. Pairs can symbolize friendship or romance without requiring a breeding mechanic. No compulsory population simulation. Make visual distinctions clear enough at mobile size; don't rely on subtle color alone.

**Scoring baseline:**
- 8–10 attempts: 100%
- 11–13: 90%
- 14–16: 80%
- 17–20: 70%
- 21+: 60%

An attempt is one completed two-card reveal; matches and mismatches both count. Round finishes when all eight pairs are matched. No countdown during solving. **3-second preview** is the only timed memorization phase. For accessibility, provide a reduced-motion flip treatment and a player-triggered **Start** so preview never begins before the player is ready. No automatic score penalty for using reduced motion. Show matched count and attempts. Completing within 16 attempts earns the permanent check.

Shuffle layouts on replay; ensure eight pairs always appear exactly twice.

## 7. Residential Hall — nuisance removal and repairs

**Role:** Shelter, comfort, hygiene and maintenance.

**Mechanic inspiration:** The previously designed *Squirrel Control* game: an illustrated room or residential compound with visually discoverable trouble spots, direct tapping/clicking, and playful before/after environmental reactions. Reuse the **visual-search and targeted-interaction pattern**, not its squirrels, frantic deterioration or 60-second timer.

**v1 round (default):**
- One coherent illustrated residential scene with **10 distinct issues** placed among valid, accessible locations.
- Example issues: leaking pipe, cracked perch, loose fence board, dirty nest, scattered feed, broken lamp, clogged drain, loose roof tile, overturned water bucket, damaged door hinge.
- Player finds each issue, taps/clicks it, and completes a tiny context-specific repair interaction (e.g., hold-to-fix, two-step tap, wipe/drag, simple matching tool). Keep interactions consistent and brief; no complex crafting inventory.
- Give readable feedback, restore the affected illustration, and update a **Condition** score.
- Round score: **10 points per issue resolved**, capped at 100. Eight resolved issues reach the 80% threshold; player may leave a round after earning 80%, but unfinished issues remain available in the current round. All ten yields 100.
- Allow **Hint** and an optional magnifier/zoom on touch; never make required targets invisible or dependent on hover.
- Use curated issue positions and variation across replays; do not place targets behind UI or make them too small for mobile.
- No hard timer, no accumulating damage during Town Hall reading, and no surprise score decay.

Persist current round issue completion on leaving/reloading where practical; best and check marks always persist.

## 8. Welfare Hall — visual patient/treatment matching

**Role:** Health and care, presented as an approachable classification puzzle, **not medical instruction**.

**Locked mechanic:** Drag illustrated patient cards onto corresponding illustrated treatment cards/stations. Support tap-to-select/tap-to-assign as a full alternative to dragging, especially on mobile and keyboard. The player sees a plain-language description of each chicken's problem.

**v1 round (default):**
- Five patients with distinguishable, non-graphic conditions and five treatments.
- Clear, fictionalized matching clues; at least one simple wound/bandage case, one condition requiring appropriate clinician care, and one case in which rest/hydration or isolation/observation is the sensible response.
- Antibiotic injection and simple surgery may appear as **veterinarian-directed options**, never as blanket responses to vague symptoms. Avoid presenting surgery as a casual DIY action or antibiotics as treatment for viral illness.
- Use curated medically sensible matches or explicitly whimsical fictional ailments that cannot be mistaken for real treatment advice. No graphic surgical depiction.
- Correct match: +20 points. Wrong match: brief explanation, no irreversible loss; first-try accuracy determines final score (20 points per patient correctly assigned on the first attempt). Allow retries to complete all matches and learn the logic.
- 4/5 first-try correct = 80% and permanent check.
- Replay with new curated cases or reordered matches. Make 80% attainable without memorizing medical trivia.
- Accessibility: labels, icons plus text, clear focus state, and keyboard/touch alternative.

The visual comedy comes from expressive chicken patients and quirky bedside manner, not suffering.

## 9. Characters, writing and lore

Use a small recurring cast of identifiable chickens, including at least one Hopeful, Skeptical and Radical voice. Reuse these characters in portraits, town scene and occasional hall reactions for coherence. Give them memorable names and personalities without turning the experience into a complex relationship simulator.

The Governor is the player's role and may be represented as a **human silhouette** in the ending. Do not force a gender, name, or political identity in the UI. The Governor has no spoken interventions in Town Hall. The ending's two lines are the only required Governor dialogue.

Narrative rules:
- No narrator declares which faction is correct.
- The world may hint at ordinary farm economics, but no slaughterhouse construction or chicken-to-product gameplay exists.
- A hopeful citizen can be observant; a radical can be perceptive yet overly certain; a skeptic can miss possibilities.
- Do not turn civic satire into a tutorial about which ideology the player should adopt.
- Localize humor naturally in zh-TW rather than translating idioms mechanically.

## 10. The Moment of Truth — optional final choice

**Unlock:** All five permanent hall checks earned. No automatic trigger; the player chooses when to enter. The decision may be revisited after completion.

**Visual direction:** Use `ending-crossroads-reference.png` as the key composition reference: a lone human silhouette at a fork/intersection, backlit by a vivid sunset, quiet horizon, reflective atmosphere. The image is a supplied mood/composition reference; the final artwork should fit the game's illustrated aesthetic. Avoid depicting a slaughterhouse, petting zoo or definitive destination on either branch. The background should leave adequate contrast/negative space for accessible text and two choices. Preserve the silhouette's anonymity.

**Prompt, exact English:**  
> **Now, decide the fate you share.**

**Exactly two choices, exact English labels:**
- **Keep Our Republic**
- **The Road Frequently Taken**

**After selection, show the Governor's selected line (not before):**
- **Keep Our Republic:** “Status quo, you know, is Latin for ‘the mess we're in.’”
- **The Road Frequently Taken:** “Chickens are what chickens are after all.”

The *status quo* line is a familiar attributed quotation; retain the agreed wording for the initial draft but **flag it for attribution/rights and editorial review before any commercial release**. No quotation credit screen is required for this personal prototype. The road title alludes to Robert Frost, while Keep Our Republic evokes the phrase attributed to Benjamin Franklin; neither allusion needs to be explained inside the game.

**Epilogue:** After the selected line, briefly fade or show a restrained transitional caption such as **“Tomorrow remains unwritten.”** (proposed default, not an obligatory philosophical lecture). Return to the same republic. No explicit chicken deaths, shipments, zoo conversion, victory judgment, or changed building economy. Persist the choice and a flag that the scene has been seen. Allow revisiting the choice and changing it; the game is intentionally not a branching post-ending simulator.

**Important:** The choice is not a promise that a particular future has already happened. It records an intention or inclination. Both options remain open-ended; the player may keep playing indefinitely.

## 11. Visual and audio direction

Aim for polished, expressive, colorful 2D storybook/illustrated game art with coherent environment design, roughly the level of finish expected from an ambitious family-friendly indie browser game. Anthropomorphic chickens should be distinct and emotionally readable, with expressive gestures and amusing outfits. Town Hall debate can rely on beautiful stills, layered poses, subtle mouth/eye/gesture changes, and cinematic composition rather than expensive full animation.

The republic overview must feel like **a place**, not a dashboard pasted onto a solid background. Surrounding art should carry the world beyond interactive panels. Each hall should look like part of the same farm-republic and retain consistent characters, props, palette, lighting and iconography.

Tone progression: warm and playful throughout normal gameplay; more contemplative but not horror-coded in the ending. No gore, disturbing treatment imagery, or explicit slaughter scenes. Audio should be original/cleared, optional and muteable; brief ambience, playful foley, gentle music; quieter ending cue.

The supplied ending reference is **not** an instruction to reproduce a copyrighted artwork pixel for pixel; it establishes composition and mood.

## 12. Accessibility, responsiveness and localization

- Desktop and mobile web; responsive layouts at narrow phone widths; no horizontal overflow.
- All mini-games playable by touch and mouse; keyboard equivalents for core actions, including welfare matching.
- No hover-only instructions. Comfortable touch targets and readable text.
- Subtitles/transcript for all spoken or animated Town Hall dialogue. Town Hall supports reading without animation.
- Reduced-motion option, mute, pause where timing exists, visible focus indicators and adequate contrast.
- Memory-game 3-second preview starts only after explicit player action. Honor pause/visibility changes fairly.
- EN and zh-TW strings externalized and tested. Avoid clipped buttons and untranslated dynamic dialogue.
- Avoid using color as the only indicator of score, state, faction or correct match.

## 13. Save model and state

Use versioned browser-local autosave with defensive parsing, export/import backup and confirmation before replacing a save. At minimum persist:
- language, audio/motion preferences;
- latest and best numerical scores for four practical halls;
- permanent earned checks for all five halls;
- Town Hall exact progress position and completed status;
- Residential Hall current round progress (when practical);
- unlocked Moment of Truth, chosen ending, and last viewed status;
- any harmless personalization needed for stable character display.

On reload, show the same progression and selected ending state. Changing language must not reset gameplay. Imported saves should validate values and recover gracefully from corrupt or incompatible data. No accounts, backend or network access required at runtime.

## 14. Implementation delegation and acceptance

**Development collaboration model:**
1. Codex reads this GDD and reference image; produces **one coherent full-screen art-direction proof** showing the republic overview and representative hall styling (plus ending treatment if useful).
2. **One human art-direction checkpoint** only. Do not mistake static illustrations for proof of dynamic mini-game feasibility.
3. After human approval, Codex autonomously builds the complete playable game, tests, fixes critical defects, packages, and prepares static deployment. No repeated human QA gates unless explicitly requested.
4. User conducts a bounded acceptance/playtest and authorizes public deployment. Do not publish a public URL before authorization.

Codex may choose rendering technology, UI framework, art pipeline, code structure, precise asset dimensions, sound design, and balanced puzzle content. It may not silently replace the five mini-games with static demos, change the ending's ambiguity, remove bilingual support, or downgrade art ambition without documenting compromises.

**Acceptance checklist:**
- Five functional halls accessible from coherent illustrated overview.
- Town Hall authored complete debate, exit/resume/replay, read-to-end completion, no player intervention.
- Mess Hall finite solvable allocation puzzle, fullness/nutrition score and replay.
- Social Hall genuine shuffled 4×4 matching with three-second preview, scoring and replay.
- Residential Hall interactive search/repair with ten valid issues, score and accessible hints.
- Welfare Hall genuine five-case visual matching with touch/keyboard alternative and first-try score.
- Permanent 80% check marks for four practical halls; Town Hall completion check; 5/5 unlock.
- Satisfaction meter distinct from completion and faction loyalty.
- Optional two-choice ending, supplied crossroads-inspired image direction, exact English text, epilogue and return to play; no definitive outcome.
- EN/zh-TW throughout, responsive phone play, persistent save, backup import/export.
- Automated logic and browser tests cover each hall, scoring boundaries, persistence, unlock, ending, mobile interaction, and localization.
- Actual gameplay screenshots and honest visual-compromise report. No concept screenshot masquerading as implemented gameplay.
- Static build playable via local server and suitable for GitHub Pages when authorized.

## 15. Explicitly out of scope for v1.0

No detailed national economy, actual electoral simulation, partisan endorsement, multiple towns, open-world exploration, 3D world, online multiplayer, player-to-citizen dialogue choices, forced breeding mechanic, livestock production, depicted slaughter, hidden "true" ending, endless procedural debates, account system, live-service content, ads or monetization.

**Design thesis:** *Care for a republic, listen to its citizens, and confront a future that nobody—including the Governor—has written yet.*
