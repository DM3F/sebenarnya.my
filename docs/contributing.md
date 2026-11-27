# Contributing to the design system

How the website, the CMS and the extension ask for something the design system does not
have yet: a component, a variant, a token, an animation, a library. Kept short on purpose,
so asking is faster than working around it.

**Owner:** `endahbyu`. Changes to `design-system/`, the design docs and the lint need the
owner's review (`.github/CODEOWNERS`).

---

## The one rule

**A product never changes the design system from inside its own repo.** No editing files in
`node_modules/@sebenarnya/design-system`, no CSS that restyles a component, no colours or sizes
of its own, no UI library installed on the side (shadcn/ui, Radix, MUI, Chakra, another icon
set). `sebenarnya-lint-ds` in CI catches most of this; review catches the rest.

## Need something? Pick the path

1. **It already exists.** Check `/design-system/` on the website and the component table in
   [`design-system-rules.md`](design-system-rules.md) § 3. Most needs are a variant or a prop away.
2. **Only one product needs it** (a CMS article editor, an extension onboarding step): build it
   **in that product**, composed from design-system components and tokens only. Lint must pass.
   Give it a plain name and keep it in one folder, so it is easy to move later.
3. **A second product needs it too**, or it needs a **new token** or a **new variant** of a
   design-system component: it moves into the design system. Open a
   [design system request](../.github/ISSUE_TEMPLATE/design-system-request.yml), or a pull
   request to `design-system/` if you already built it in step 2.

This is the **"used twice" rule**: build locally first, promote on the second use. Nothing waits
for the design system the first time.

## Review time

The owner answers a request or reviews a pull request within **2 working days**. If that passes
and you are blocked, build it in your product (path 2) with a comment
`// TODO(design-system): <issue link>` and carry on. Promote it when the review lands.

## Common cases

| You want | Do |
|---|---|
| A shadcn/ui component we lack (Combobox, DatePicker, Calendar…) | **Do not `npx shadcn add` in a product.** Ask for it (path 3). The owner ports it the way the current components were built: shadcn's API and accessibility as reference, our tokens and native elements underneath. If it truly needs Radix, that is decided once, in the design system. |
| An animation | With the motion tokens (`--duration-*`, `--ease-*`, `design.md` § 6 MOTION): go ahead, and honour `prefers-reduced-motion`. A new kind of motion (page transitions in the CMS, a motion library such as Framer Motion): ask first, so the three products move alike. |
| A colour, size, radius or shadow that is not a token | Ask for a **semantic token** (path 3): name it by role (`--color-warning`), never by value. Lint rejects the raw value meanwhile. |
| A different look for an existing component | Ask for a **variant** (path 3). A product class may position a component (margin, grid, width); it never restyles it. |
| An icon | Any [Lucide](https://lucide.dev/icons) icon, through `<Icon>`. No request needed. |
| A one-off exception (a third-party widget, a print style) | `/* ds-allow: <reason> */` on the same line, and say why in the pull request. |

## Changing the design system (owner, or anyone in a pull request)

In `DM3F/sebenarnya.my`:

1. Change at the right tier (`design-system-rules.md` § 1): a primitive for the whole brand, a
   semantic token for a role everywhere, a component knob for one component, a new class that
   only reassigns knobs for a variant.
2. Show it on `/design-system/` (new component, variant or token in its section).
3. Update [`design-system-rules.md`](design-system-rules.md) if a token or component API
   changed, and [`design.md`](design.md) if the look or feel changed.
4. Add an entry to [`design-system/CHANGELOG.md`](../design-system/CHANGELOG.md) and bump
   `"version"` in `design-system/package.json`:
   - **patch** (0.1.0 → 0.1.1): a fix, no API change
   - **minor** (0.1.0 → 0.2.0): a new component, variant, prop or token
   - **major** (0.x → 1.0, 1.x → 2.0): a token or prop removed or renamed, or a visible change
     products must check
5. `npm run lint:ds` and `npm run build` pass, and the website looks the same where it should.
6. Merge to `main`, then **Actions → Release design system package → Run workflow** (branch `main`).
7. Tell the products: the new install URL and the changelog entry.

## Updating a product

Change the version in the install URL (`ds-vX.Y.Z/sebenarnya-design-system-X.Y.Z.tgz`),
`npm install`, read the changelog entry, run `npm run lint:ds`, look at a few screens.
A major version lists what to change.

## Every few months

The owner looks at what came in: requests, `ds-allow` exceptions, `TODO(design-system)` comments
in the products. Many requests for the same thing mean a gap; many exceptions mean a rule that
does not fit. Adjust the system or the rule, not the products one by one.
