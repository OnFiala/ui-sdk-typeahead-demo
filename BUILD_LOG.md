# Build log

Date: 2026-11-13. Packages: `@ui-sdk/react@0.1.0-beta.1` and `@ui-sdk/core@0.1.0-beta.1` (the `latest` and `beta` dist-tags on npm). React 19.2, Vite 7, TypeScript 5.9. Node v22.23.4, npm 10.9.9.

The installed docs were the source of truth (`node_modules/@ui-sdk/react/docs/llms.txt`, then `docs/components/combobox.md`). The live page at https://ui-sdk.dev/docs/react/components/combobox matched that file for composition, keyboard, and ARIA. No APIs were taken from memory.

## Agent did

- Installed the UI SDK skill with `npx skills add vercel-labs/ui --skill ui-sdk`. Exit 0. `skills@1.8.1` cloned `vercel-labs/ui`, selected the `ui-sdk` skill, and copied it to `.agents/skills/ui-sdk`. The skill's security summary rated it safe / low risk. The skill was followed: use the shipped Combobox, do not hand-roll `role="listbox"`, read the installed docs, theme `web.css` tokens, and test with Vitest plus the agent bridge.
- Scaffolded a Vite + React + TypeScript app and installed `@ui-sdk/react` and `@ui-sdk/core`.
- Built one controlled Combobox: 32 Czech cities, filter-as-you-type, empty state, clear button, trigger, selected-city summary. Parts used, all from `@ui-sdk/react/combobox`: `Combobox`, `ComboboxLabel`, `ComboboxInput`, `ComboboxTrigger`, `ComboboxClear`, `ComboboxContent`, `ComboboxStatus`, `ComboboxEmpty`, `ComboboxList`, `ComboboxItem`, `ComboboxItemText`, `ComboboxItemIndicator`. `items` is passed so filtering and the agent bridge see the whole collection, and the list renders from `state.items`. `autoHighlight="always"`. `loop={false}`.
- Imported `@ui-sdk/core/web.css` and set `--ui-*` tokens. Declared `@layer ui-sdk` first so app rules win.
- Connected `createAgent` / `registerTools` from `@ui-sdk/react/agent` in the browser entry.
- Tests in `src/CityCombobox.test.tsx`: arrow highlight, Enter, Escape, Home/End caret, accent-insensitive filter, keyword filter, empty state, and an agent `snapshot` / `query` / `setValue` test. jsdom stubs from the skill's testing page are in `src/test/setup.ts`, with `__UI_SDK_STRICT__`.
- `npm test` exit 0 (4 tests). `npm run build` (`tsc -b && vite build`) exit 0.
- GitHub Actions workflow `.github/workflows/gh-pages.yml` builds on push to `cursor/ui-sdk-typeahead-demo-5d62` and publishes `dist` with `peaceiris/actions-gh-pages@v4`. Vite `base` is `/ui-sdk-typeahead-demo/`.
- Opened the preview in Chrome and drove it with the keyboard: click, ArrowDown, Escape, `zzzz`, `ceske` then Enter, Home/End, and the clear button. That pass ran on the build just before the footer was moved into the card. Behavior did not depend on that move. Fonts resolved to Fraunces and Outfit. `docs/screenshot.png` is a later headless capture of the rebuilt page: popup open, Brno highlighted. Painted contrast is below.

## What worked the first time

- Skill install.
- The documented Combobox composition. No missing export from `@ui-sdk/react/combobox` for the parts above. `createComboboxController` exists but was not needed.
- ARIA from the component, without setting roles by hand. A headless check after ArrowDown reported `role="combobox"`, `aria-autocomplete="list"`, `aria-expanded="true"`, `aria-controls` pointing at an element with `role="listbox"`, and `aria-activedescendant="…-option-brno"` on the highlighted option. The list's `aria-labelledby` matches the input's, so the list is named "City". The trigger is out of tab order (`tabindex="-1"`) and named "Show cities". The clear button is named "Clear city".
- Filtering. `ceske` shows České Budějovice and hides Česká Lípa and Praha. `carlsbad` shows Karlovy Vary through the keyword. `zzzz` shows "No cities match that search." and no options.
- ArrowDown / ArrowUp move `aria-activedescendant` while focus stays on the input. Enter writes the label and closes. Escape closes and keeps the selected label.
- Home and End, once the assertion matched the docs (see below), passed on the first run of that test: the caret moves, the list stays open, the highlight does not jump.
- `web.css` chevron on the trigger when the trigger has no SVG. The clear button got its own SVG, which is what the docs do.

## Where the beta SDK, docs, or tooling tripped things up

### The prompt's primitives are not the current public API

The task named `createPopup`, `createSelection`, and `createTypeahead` as the likely building blocks. The installed skill table says "search a list and choose one or several" is Combobox, and "don't hand-roll" a listbox. The combobox page's "Build your own" section starts from `combobox` in `@ui-sdk/core/combobox` plus `createParts` from `@ui-sdk/react/primitive`. It does not tell you to assemble `createPopup`, `createSelection`, and `createTypeahead`.

`createListbox` (public, documented in `listbox-behavior.d.ts`) is the highlight/filter behavior the combobox is built on. Its `keydown` JSDoc says arrows, PageUp, and PageDown always move the highlight, and Home, End, and typeahead characters do that only when focus is real. The combobox keeps DOM focus in the input and uses `aria-activedescendant` (virtual focus). The combobox keyboard table lists typing, arrows, Enter, Escape, and chip keys. It does not list Home or End.

That matches the WAI-ARIA APG editable combobox with list autocomplete: while the popup is open, Home and End move the editing cursor. They do not jump to the first or last option. There is no controller method that moves the highlight to first or last (`createComboboxController` can open, close, focus, and set value or query).

This was not overridden. The on-page legend says Home and End move the text cursor. A test locks that in.

### ARIA that did not need a hand-written fix

No gap turned up for combobox / listbox / option, `aria-expanded`, `aria-controls`, `aria-autocomplete="list"`, `aria-activedescendant`, or the label association. Icon-only trigger and clear buttons need an `aria-label`. The combobox docs examples do the same. That is following the docs, not patching a missing role.

Passing `name="city"` makes the package render a visually hidden `<input data-slot="combobox-form-input">` with an inline `style` (clip, 1px, absolute). That style is in the SDK output, not in this app. The skill says app code should not use inline styles for state. Left as-is.

### npm could not install the skill's Vitest 4 setup

`npm install` with `vitest@^4` failed immediately:

```text
TypeError: Cannot read properties of null (reading 'edgesOut')
```

npm 10.9.9, while building the ideal tree for `node_modules/vitest`. The same crash happened with `--omit=dev` while Vitest was still listed, because the tree walk still entered it. Removing Vitest made `npm install` exit 0. `vitest@3.2.4` plus Testing Library and jsdom then installed (exit 0).

`npm audit` on that tree reports critical advisories in `vitest` and `tinypool` (dev-only; not in `dist`). They were not "fixed" with `npm audit fix --force`. Vitest 4, which might pull a patched tree, could not be installed with this npm.

### Docs and types that were easy to misuse

- `as const satisfies City[]` made `Map.get` accept only the city-id union. `tsc -b` exit 2. Dropping `as const` fixed it. That was the data file, not the SDK.
- Clicking the input opens the list. With `autoHighlight="always"`, the first item (Praha) is already highlighted, so the next ArrowDown lands on Brno. The first keyboard test expected ArrowDown itself to land on Praha. Exit 1, then the test was split into "click highlights Praha" and "ArrowDown moves to Brno". The component was doing what the combobox page says.
- `getByText("South Moravian")` failed because that string is only part of the selected-city paragraph. The value had been set. The assertion now reads the region's text.

### `web.css` and Vite

`web.css` says builds that rewrite `light-dark()`, including Vite, read `--lightningcss-light` and `--lightningcss-dark`, and without them every color is invalid. Tokens here are plain sRGB and `color-scheme: light`, so the demo does not depend on that rewrite.

Defaults that fail the skill's contrast bar on this cream surface, measured as painted colors in headless Chrome unless noted:

| Pair | Ratio | Note |
| --- | --- | --- |
| Default `--ui-border` `#d4cdc0` on `#f7f4ee` | 1.44:1 | Calculated, not used |
| Painted popup border `#8c8274` on `#f7f4ee` | 3.44:1 | Token override |
| Painted input border `#16382c` while focused | 11.69:1 | `--ui-ring-border` |
| Hint / lede `#4e463c` on `#f7f4ee` | 8.44:1 | `--ui-muted-foreground` |
| Highlighted option text on `#16382c` | 11.58:1 | `data-highlighted` fill, not the default muted tint |
| Region line on the highlighted row | 10.29:1 | Separate color, because muted-foreground on the green fill would fail |

The default highlight is only `background: var(--ui-muted)`. The default focus ring token is a light gray. Both were overridden. `--available-height` does not inherit (documented). `max-height` is set on `[data-slot="combobox-content"]` itself, with a 20rem cap.

### Layout the screenshot caught

The first browser screenshot showed the open list covering the footer, with "Built" and "char" peeking out to the left of the popup because the footer was wider than the input the popup is anchored to. The credit line was moved inside the card, which shares the input's inset, and the screenshot was taken again. That was app layout, not an SDK bug.

## Needed a manual fix or workaround

| Item | What happened |
| --- | --- |
| Vitest 4 | npm arborist crash. Pinned Vitest 3.2.4 instead of the skill's unversioned `vitest`. |
| City id types | Removed `as const` so `Map.get(string)` typechecks. |
| Keyboard test | Click-to-open plus `autoHighlight="always"` means the first ArrowDown is the second row. |
| Contrast | Overrode `--ui-border`, `--ui-ring`, `--ui-ring-border`, and `[data-highlighted]` because the `web.css` defaults are too faint on this surface. |
| Footer vs popup | Moved the credit into the card after the screenshot showed clipped footer text. |
| Home / End as first/last option | Not implemented. Documented and tested as caret movement. |

## Not resolved

- Home and End do not move the highlight to the first or last option. The installed combobox docs, `createListbox`'s virtual-focus rule, and the APG editable combobox example all leave those keys to the text field. No public controller method was found that moves only the highlight. Overriding it in an `onKeyDown` would fight the component.
- Vitest 4 and a clean `npm audit` of the test toolchain. The published site does not ship Vitest.
- Whether GitHub Actions actually updated `gh-pages` is recorded in the PR notes after the push, not in this file's first draft. The workflow file is in the repo either way.

## Commands

| Command | Exit |
| --- | --- |
| `npx skills add vercel-labs/ui --skill ui-sdk` | 0 |
| `npm install` with Vitest 4 in `devDependencies` | 1 (`edgesOut`) |
| `npm install` without Vitest, then Testing Library, jsdom, and `vitest@3.2.4` | 0 |
| `npx tsc -b --pretty false` before the `as const` fix | 2 |
| `npx vitest run` before the keyboard/text assertions were corrected | 1 (2 failed, 2 passed) |
| `npm test` | 0 |
| `npm run build` | 0 |
