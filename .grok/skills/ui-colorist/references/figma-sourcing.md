# Sourcing palettes from Figma (MCP)

Tools (Figma MCP server): `whoami`, `create_new_file`, `create_session`,
`get_libraries`, `search_design_system`, `get_variable_defs`, `use_figma`.

## Steps

1. `whoami` → plan key. If the user gave a Figma URL, use its fileKey;
   otherwise create a scratch design file in drafts (`create_new_file`, load
   the `figma-create-new-file` skill first) — the search tools need a file for
   context.
2. `create_session` with that fileKey; pass the sessionId on every call.
3. `get_libraries` → lists subscribed libraries **and** community UI kits /
   org libraries available to add. Note each library's key and name — those
   are your candidate sources (Material 3, Apple iOS/iPadOS kits, Simple
   Design System, shadcn-style kits, etc.).
4. `search_design_system` — ONE batched call, one intent per query, e.g.
   - variable: `primary`, `background`, `surface`, `success`, `warning`,
     `error`, `on primary`
   - style: `color`, `green`, `gold`
   Scope with `includeLibraryKeys` when a library looks promising.
   Results include library name + variable/style name + resolved values.
5. For a promising library, run a second scoped search for the roles you are
   still missing. Don't spray synonyms — inspect results first.
6. Record for each candidate: library name, key, variable names, hex values,
   light/dark mode.

## Mapping

Map Figma names to roles: `surface`/`background` → canvas & surfaces,
`on-surface`/`text/primary` → fg, `on-surface-variant`/`text/secondary` →
muted, `outline`/`border` → line, `primary`/`brand` → op, `on-primary` →
on-op, `success`/`positive` → live, `warning` → warn, `error`/`danger` →
danger.

## Writing back (optional, ask-free when the user asked for Figma work)

Load `figma-use` before `use_figma`. Create a "Palette" page with one swatch
frame per role (name, hex, contrast ratio vs canvas) and a local variable
collection `Color` with the same token names as `@theme`.
