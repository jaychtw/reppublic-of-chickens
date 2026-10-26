# v1.0 validation

The production build passes TypeScript checking and Vite compilation. The logic/content suite passes **29/29** checks. The browser runs pass **22/22** checks: 20 game checks plus two independent static-subpath checks. No tests were skipped, disabled, marked expected-failure or retried.

Tests ran against the built game using system Chromium, with desktop Chrome emulation at 1440×1000 and Pixel 5 phone emulation at 393×851. Narrow 320px layouts are also checked. Browser emulation does not establish physical-device or Safari/Firefox coverage.

| Area | Verified behavior |
| --- | --- |
| Complete game | Full journeys in both English and Traditional Chinese on both desktop and phone; all five real activities, five checks, optional unlock, both choices, return to play and poorer replay without revoked checks |
| Town Hall | 42 bilingual exchanges, final transcript scroll completion, exact saved line, exit/reload/resume, replay, previous, auto-play/pause and explicit scroll-to-end |
| Mess Hall | Finite inventory, return/redistribution, three curated 100% solutions, separate fullness/nutrition weighting, new-round layout and rejected impossible allocations |
| Social Hall | Eight identities exactly twice, genuine shuffled 4×4 grid, player-triggered preview, three active seconds, pause and tab-visibility handling, automatic mismatch resolution, blocked third reveal, attempt counting and all scoring boundaries |
| Residential Hall | Two-step targeted repairs, eight-repair milestone, ongoing progress across reload, remaining issues still playable, unfinished condition separate from completed-round satisfaction, ten-repair maximum |
| Welfare Hall | Correct and wrong assignments with localized patient-specific explanations, first-try scoring, mouse drag, phone tap alternative and keyboard-only completion |
| Persistence | Versioned JSON round-trip, latest/best and permanent checks, both ending choices, preferences, precise debate position, corrupt/unavailable storage handling |
| Backup | Real downloaded JSON export, invalid-file rejection, confirmation before replacement, cancellation without data loss and restored progress/language |
| Localization | All externalized UI keys covered in EN/zh-TW; all dialogue, case clues and repair content bilingual; correct title override; both-language end-to-end play |
| Accessibility | Axe WCAG 2 A/AA and 2.1 AA checks on overview and all five halls, in desktop and phone contexts, with no reported violations; keyboard controls and reduced motion exercised |
| Layout | No document-level horizontal overflow in all five halls at phone and 320px widths; intentional repair-scene zoom stays inside its own scroll container |
| Static hosting | Locally served build works under `/reppublic-of-chickens/`; assets and fonts load, hash-route reloads work, and no missing-resource responses occur |
| Runtime networking | Overview and all halls work while external destinations are blocked; runtime assets and fonts are local |
| Dependency audit | `npm audit --audit-level=low`: zero reported vulnerabilities after updating Vite |

Initial validation found an invalid ARIA label on generic progress spans, which was fixed by assigning the appropriate image role. Test-only issues were also corrected: ambiguous Chinese return-button queries and an advancing test clock. The final runs above completed without failures.

Machine-readable browser outcomes are recorded in [qa-summary.json](qa-summary.json). Gameplay screenshots and a genuine earned unlock are captured separately by the reproducible screenshot script.

## Scope of the evidence

This is bounded v1.0 validation, not a claim of exhaustive browser/device coverage, professional translation review or accessibility certification. See [release limitations](VISUAL-AND-RELEASE-NOTES.md). Packaging and local-launch checks are recorded in the same machine summary once the release ZIP is built. CI is prepared but its remote execution is not represented as locally verified evidence.
