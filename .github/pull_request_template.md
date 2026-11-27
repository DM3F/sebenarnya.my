## What and why

<!-- One or two sentences. Link the issue if there is one. -->

## Design system checklist

<!-- Only if this pull request touches design-system/, the design docs or scripts/lint-ds.mjs. Delete otherwise. -->

- [ ] Changed at the right tier (primitive · semantic token · component knob · variant)
- [ ] Shown on `/design-system/`
- [ ] `docs/design-system-rules.md` (API) and `docs/design.md` (look and feel) updated if needed
- [ ] Entry in `design-system/CHANGELOG.md` and `"version"` bumped in `design-system/package.json`
- [ ] `npm run lint:ds` and `npm run build` pass
- [ ] Website looks the same where it should

After merge, release with **Actions → Release design system package → Run workflow**.
