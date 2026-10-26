# Republic of Chickens — Stage A checkpoint

Status: art-direction proposal; awaiting one user approval before implementation.

English title: **Republic of Chickens**. Traditional Chinese title: **雞窩共和國**. The user's title override takes precedence over any title in the supplied documents. The supplied handoff is retained unchanged under `handoff/Republic_of_Chickens_Codex_Handoff_v1.0/`.

This checkpoint is an illustrated design proposal, not an implemented game or proof that its interactions work. No application implementation or public deployment is included in Stage A.

Proof artwork: [republic-of-chickens-stage-a.png](republic-of-chickens-stage-a.png), 1536 × 1024. The overview, three citizen portraits, all five activity studies and crossroads are combined into this single checkpoint.

The generated sheet's small decorative captions are placeholders, not approved narrative or localized UI. In particular, wording such as “a kinder tomorrow” will not be used to frame the ending or imply that either choice is morally preferred. The GDD's exact ending labels and its unresolved outcome remain authoritative. The miniature cards, repair details and treatment scenes establish appearance only; they do not validate the required game mechanics or accessible target sizes.

## Visual thesis

A republic built from a farm, painted with affection. Sun-warmed plaster, weathered timber, terracotta roofs, garden paths, patched domestic details and self-important civic notices make the setting cheerful and inhabited. The satire comes from earnest citizens and the tension between civic language and ordinary farm infrastructure. Fences are mundane, not menacing. No faction receives visual confirmation that its interpretation is correct.

The overview is one connected landscape. Paths, shared ground, vegetation, residents and common lighting unite five spatially recognizable buildings. Building entrances are future interaction targets, with accessible text alternatives; buildings are not dashboard cards.

Use textured gouache shapes, restrained ink detail, expressive feathered wing gestures and deliberate still compositions. Favor attractive still portraits over crude animation. The ending changes the light and pace without switching into horror.

## Palette and materials

| Role | Color | Application |
| --- | --- | --- |
| Parchment | `#F5E9CB` | Reading surfaces, plaster and quiet negative space |
| Butter | `#E5BB64` | Feathers, grain, warm highlights |
| Terracotta | `#B85D43` | Roofs, civic seals and warm accents |
| Sage | `#78856A` | Gardens, painted wood and clinic details |
| Teal | `#3F6869` | Doors, clothing and cool shade |
| Plum | `#735369` | Bramble's scarf and evening accents |
| Ink | `#302D35` | Primary text, contours and deep shadows |

Colors are proposed production tokens, not a claim that every sampled pixel in the concept sheet matches. Text will use measured contrast on quiet opaque surfaces. Shape, labels, symbols and posture carry meaning alongside color.

English display type may use a warm literary serif; body text needs a highly readable sans serif. Traditional Chinese needs a full zh-TW font such as Noto Sans TC, with a restrained Noto Serif TC display treatment where appropriate. Final fonts must be licensed, bundled for offline runtime and tested for coverage. Chinese layouts must be typeset intentionally, not reduced to fit English buttons.

## Recurring cast

Names and localized forms are proposed creative defaults; the voices and their narrative functions remain those in the GDD.

| Citizen | Voice | Silhouette and props | Performance |
| --- | --- | --- | --- |
| Marigold / 金盞 | Hopeful | Honey feathers, rounded comb, rust apron, rolled sleeves | Open gestures and practical warmth; notices details and values security; never a foolish loyalist |
| Quill / 羽筆 | Skeptical | Slate-speckled feathers, angular brow, blue waistcoat, small glasses, notebook | Studies evidence with a tilted head; can be funny, uncertain and wrong |
| Bramble / 荊棘 | Radical / tragic prophet | Lean russet rooster, jagged comb, plum scarf, worn satchel | Urgent wings and worried eyes; vulnerability alongside certainty; never a villain or omniscient truth-teller |

The same citizens recur in the overview, debate and occasional hall reactions. Production portrait variations should include neutral, amused, concerned and emphatic poses, retaining recognizable anatomy and clothes. The eight Social Hall pair faces need additional clear differences in silhouette and accessories, not merely recolors.

## Five halls

| Hall | Proposed zh-TW | Architecture / visual identity | Future interaction language |
| --- | --- | --- | --- |
| Town Hall | 公民議事廳 | Plaster civic house, bell turret, feather crest, curved wooden benches | Three expressive speakers, readable subtitle surface and transcript; passive listening only |
| Mess Hall | 伙食廳 | Ochre kitchen, striped awning, serving hatch, grain and vegetable crates | Tactile food tokens and three group trays; fullness and nutritional information visible together |
| Social Hall | 聯誼廳 | Sage festival pavilion, bunting, open gathering porch | Cloth tabletop and exactly 16 portrait cards in a 4×4 grid; decorative backs do not obscure identity when revealed |
| Residential Hall | 住宅廳 | Cozy nest houses, teal doors, laundry, exposed pipes and patched roof | One continuous searchable home scene; ten visible issues with repair states and generous touch targets |
| Welfare Hall | 照護廳 | Pale clinic, shaded porch, herbs, original leaf-and-feather care emblem | Five expressive patient cards and five treatments; dragging and complete tap/keyboard alternatives |

UI uses paper notices, modest wooden frames and ink symbols sparingly. Progress checks and latest-round satisfaction must remain visibly separate. Build any eventual UI text in HTML/canvas text layers, not into generated illustrations. Touch targets and keyboard focus take precedence over ornamental frame shapes.

## Crossroads

The supplied sunset image establishes backlight, anonymous human silhouette and reflective quiet. Reinterpret it with the republic's painterly materials. Two roads vanish into haze; neither contains a destination, promised consequence or moral verdict. Reserve a dark quiet text area without hiding the landscape.

Preserve the exact English prompt and two labels in the GDD. Show a Governor line only after selection. Both choices return to the same republic; the epilogue never confirms a future. The status-quo quotation requires attribution/rights and editorial review before commercial release, as specified in the handoff.

## Production boundary after approval

The approval sheet is a visual target. It must not be shipped as a single flattened substitute for the game. Produce reusable environment layers, building and repair states, independent portraits, cards, food tokens and treatment art. Put hit areas, state, translated text and controls in the actual renderer. Validate actual gameplay screenshots against this direction at desktop and phone widths.

The implementation remains a static browser game with no runtime accounts or backend. Preserve all five distinct activities, permanent 80% hall milestones, latest-round satisfaction, precise debate resume, versioned local save and backup, first-class EN/zh-TW, and the optional revisitable unresolved ending.

After this single approval: implement, run automated logic and browser tests, fix critical defects, conduct bounded visual and accessibility QA, and prepare release files. Provide actual gameplay evidence and disclose any visual compromises. No repeated art or QA approval gates are planned. Public deployment still requires the user's explicit authorization.

The user refers to the workflow established with Wonderlands. No Wonderlands project or separate workflow document is available in this workspace; the supplied GDD and the user's explicitly stated approval, autonomous implementation, testing and deployment boundaries define the actionable workflow here.

## Checkpoint decision

Approve or request changes to the cohesive world, character cast, five hall identities and illustrative finish as one art-direction checkpoint. Implementation begins only after approval.
