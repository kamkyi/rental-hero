# AGENTS.md

This repository uses a strict UI spacing and radius system. All agents must follow these rules when creating or editing UI.

## Core UI rules

- Use design tokens from `constants/theme.ts` for spacing and radii.
- Do not introduce raw `padding`, `margin`, `gap`, or `borderRadius` values unless there is a documented exception in the same change.
- Preferred spacing scale: `spacing.xxs`, `spacing.xs`, `spacing.sm`, `spacing.md`, `spacing.lg`, `spacing.xl`, `spacing.xxl`.
- Preferred radius scale: `radius.xs`, `radius.sm`, `radius.md`, `radius.lg`, `radius.card`, `radius.control`, `radius.panel`, `radius.sheet`, `radius.pill`.

## Layout rules

- Design mobile first.
- On phones, major surfaces should read as full-width cards or bottom sheets, not narrow centered dialogs.
- Keep phone edge padding at `spacing.md` unless a tighter surface specifically requires `spacing.sm`.
- Use multi-column option grids only when the screen width clearly supports them. On phones, stacked full-width options are preferred for filters and forms.
- Keep tap targets comfortable. Interactive controls should generally use `spacing.sm` to `spacing.md` internal padding and avoid cramped icon buttons.

## Consistency rules

- Reuse existing shared components before creating new UI primitives.
- If a component needs a new spacing or radius value repeatedly, add a token in `constants/theme.ts` first, then use it.
- When touching an existing screen, normalize nearby spacing and radii to the token system instead of adding more one-off numbers.
- Avoid mixing several unrelated corner radii in the same surface group. A screen section should usually use one dominant radius family.

## Review checklist

- Check the UI on a narrow mobile width first.
- Confirm modal, filter, and drawer surfaces align to the mobile layout rules above.
- Confirm new or edited code uses theme tokens instead of hard-coded spacing and radius values.
