---
name: create-release
description: Cut a new release of the RustVikingsRCON extension — bump the version, verify the production build, package dist/ into a versioned zip in releases/, then commit, tag, push, and publish a GitHub Release. Use when the user asks to "create a release", "cut a release", "publish a new version", or "release the extension".
---

# Create Release

Produces a full release of the RustVikingsRCON browser extension. Follow these steps in order. **Stop and report to the user if any step fails** — do not push or tag a broken build.

## 0. Preconditions

- Working tree must be clean (`git status --porcelain` empty) before starting, aside from changes the user explicitly wants in the release. If it's dirty, stop and ask.
- Must be on the `main` branch (or confirm with the user if not).
- `7z` is used for packaging (there is no `zip` binary on this machine). `gh` is used for the GitHub Release.

## 1. Determine and bump the version

The version lives in **two** files that must stay in sync:
- `package.json` (the `"version"` field)
- `src/manifest.json` (the `"version"` field)

Ask the user for the bump type if they didn't say: **patch**, **minor**, or **major** (or an explicit version). Compute the new version from the current `package.json` version using semver rules.

Edit both files to the new version. Verify the tag `v<new-version>` does **not** already exist:

```bash
git tag | grep -x "v<new-version>" && echo "TAG EXISTS — abort" || echo "ok"
```

If the tag exists, stop and tell the user to pick a different version.

## 2. Verify the build

```bash
npx tsc --noEmit
npm run build
```

Both must succeed. `npm run build` emits webpack bundle-size warnings — those are expected and are **not** failures. Confirm the `dist/` folder was populated (`dist/manifest.json`, `dist/main.js`, `dist/worker.js`, etc.). If typecheck or build fails, stop and report.

## 3. Package dist/ into a versioned zip

Zip the **contents** of `dist/` (files at the archive root, no `dist/` prefix — the extension must load directly). Name it `better-battlemetrics-tools-v<new-version>.zip` and place it in `releases/`:

```bash
mkdir -p releases
rm -f releases/better-battlemetrics-tools-v<new-version>.zip
( cd dist && 7z a -tzip ../releases/better-battlemetrics-tools-v<new-version>.zip . )
```

Confirm the archive was created and lists the extension files at the root:

```bash
7z l releases/better-battlemetrics-tools-v<new-version>.zip
```

## 4. Commit, tag, and push

Stage the version bumps, commit, create an annotated tag, and push both the commit and the tag. **Do not commit the zip** — `.gitignore` ignores `*.zip`; the archive is distributed as the GitHub Release asset only (step 5), not tracked in the repo:

```bash
git add package.json src/manifest.json
git commit -m "Release v<new-version>"
git tag -a "v<new-version>" -m "Release v<new-version>"
git push origin main
git push origin "v<new-version>"
```

End the commit message body with the standard co-author trailer:

```
Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>
```

## 5. Publish the GitHub Release

The zip is **not** in git — it ships here, as the Release asset:

```bash
gh release create "v<new-version>" \
  releases/better-battlemetrics-tools-v<new-version>.zip \
  --title "v<new-version>" \
  --generate-notes
```

`--generate-notes` auto-builds release notes from merged PRs/commits since the last tag. If `gh` is not authenticated (`gh auth status` fails, e.g. a stale/invalid `GH_TOKEN` giving `401 Bad credentials`), stop after the push and tell the user the tag is pushed and the zip is ready at `releases/…`, but they need to authenticate `gh` (or upload the zip via the GitHub Releases UI) to publish. The command can be re-run once auth is fixed.

## 6. Report

Summarize what was released: the new version, the zip path, the tag, and the GitHub Release URL (from `gh`'s output).
