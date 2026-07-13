### v1.0.3 — 2026-07-13

-   **New: Risk badge** — an at-a-glance **Low / Medium / High** risk indicator on the player-profile panel, with a breakdown popover.
-   **New: configurable risk weights** in the options page, so you can tune what drives the score.
-   **New: identifier enrichment and visit-history signals** feeding the risk assessment.
-   Refinements to the player panel, banner and options UI.
-   Cleanup: removed leftover debug `console.log`s; catch-block failures now log via `console.error`. Fixed the stale repository URL in `package.json`.

> Note: activity sparklines were held back from this release (still in development).

---

<!-- The entry below is upstream extension-template boilerplate, not app history. -->

### v2.0.0

-   Bump `version` field in `package.json` to `2.0.0`
-   Upgrade `react` + `react-dom` to version `17.x`
-   Upgrade Storybook to version `6.4`
-   Upgrade `webpack` to `5.x`
-   Storybook stories written in Component Story Format
-   Add Tailwind@3.x with CSS modules
-   Removed Bootstrap and SCSS
-   Add `CONTRIBUTING.md`
-   Add `CHANGELOG.md`
-   Add `CODE_OF_CONDUCT.md`
-   Add `.github/PULL_REQUEST_TEMPLATE.md`
-   Add `.github/ISSUE_TEMPLATE.md`
-   Simplify Storybook tooling
-   Updated placeholder icon for extension
-   Verified support for Microsoft Edge
-   Updated `README.md` screenshots
-   Add `.vscode` directory with workplace settings and recommended extensions
