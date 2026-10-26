# v1.0 visual and release notes

Stage A was approved by the user at commit `35c4298`. The game title in Traditional Chinese is **雞窩共和國**. Original GDD and handoff files remain unchanged.

## Implemented scope

Five functional activities share the illustrated republic and recurring citizen portraits. Town Hall contains 42 bilingual authored exchanges with all six required narrative beats, precise resume, replay, previous/next, auto-play/pause and a scrollable transcript. There is no player intervention in its argument.

The Mess Hall has three curated, finite, solvable allocations; Social Hall has exactly eight shuffled pairs and a player-triggered three-second preview; Residential Hall has ten independent objects with two-step repairs and persistent condition; Welfare Hall has five clue-based cases with dragging, tapping and keyboard alternatives. The care puzzle neither recommends casual surgery nor uses antibiotics as a default treatment.

Four practical-hall checks are permanent at 80%; the Town Hall check records reaching the end, not agreement. Satisfaction uses the four latest completed practical scores. Residential progress remains unfinished until eight repairs are reached or the player explicitly records the current condition; the remaining repairs stay available after earning a check. Resetting a repair round leaves the latest completed score and permanent check intact.

The optional crossroads presents the GDD's exact English prompt and two choices. Governor dialogue appears only after a choice. A brief caption and return control lead back to the unchanged, playable republic. Reconsidering an ending updates the saved intention without enacting a future.

## Significant visual compromises

1. **Illustration with live overlays:** the overview and residential architecture are painted backgrounds with separately rendered, accessible building entrances and repair objects. They are not fully layered scenery or simulated citizens. The overview's distant residents are painted into the environment.
2. **Portrait performance:** eight original illustrated citizens are used throughout. The three debaters each have one expressive painted pose; active-speaker emphasis and restrained transitions replace a larger expression library, lip sync and character animation. The debate is text-led, without recorded voice acting.
3. **Activity surfaces:** food tokens and care symbols are vector illustrations with the shared palette, simpler than the painted architecture. Repairs use a separate twenty-sprite painted atlas, with an independent broken and fixed state for every issue. The Mess and Welfare activities use accessible parchment/tray/card layouts rather than fully painted interior scenes.
4. **Mobile composition:** the overview fits to width with compact entrance plaques. Hall activities stack on narrow screens. Residential Hall offers an optional internally pannable zoom and a complete issue list; normal page content does not overflow horizontally. There is no separate phone-specific painted map.
5. **Audio:** optional original synthesized confirmation chimes are provided; there is no ambient score or full foley library.

These are implementation limits, not replacements for the five playable mechanics. Screenshots in `docs/screenshots/` are captured from the functioning build. The Stage A sheet remains a concept benchmark, not a gameplay screenshot.

## Runtime and release limits

- Static single-player browser game; browser-local v1 save, defensive parsing and confirmed JSON import/export. No accounts or cloud sync. Different ports, domains or browsers have separate save stores.
- English and Traditional Chinese are fully authored and externalized. Localization has automated coverage and functional testing; a separate professional linguistic review has not been performed.
- Desktop and phone-emulated Chromium are tested. Physical Android/iOS devices, Safari, Firefox and assistive-technology sessions are not claimed as tested.
- Accessibility automation is a useful check, not a claim of universal accessibility certification.
- Raster artwork makes the release larger than a vector-only game. All fonts and images ship locally; no external request is needed at runtime when served from the local package.
- Opening the build through `file://` is unsupported; use an HTTP server.
- No public deployment is enabled or performed. GitHub Pages instructions are prepared for later explicit authorization.
- Before any commercial release, complete the quotation review recorded in the GDD and third-party notices.
