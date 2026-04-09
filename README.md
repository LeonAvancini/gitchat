# gitchat

A conversational interface for exploring a GitHub profile and its contribution activity. All data is mocked — the focus is on design quality and interaction, not API integration.

## Running it

```bash
nvm use          # switches to the Node version pinned in .nvmrc
npm install
npm run dev
```

Opens at `http://localhost:5173` (or next available port). `npm run build` for production.

## Code quality

The project uses **ESLint** for static analysis and **Prettier** for formatting.

```bash
npm run lint           # check for lint issues
npm run lint:fix       # auto-fix what ESLint can
npm run format:check   # verify formatting
npm run format         # auto-format all files
```

## Stack

React, TypeScript, Vite, SCSS Modules, Zustand, Framer Motion, ESLint, Prettier.

## Extending the project

The codebase is set up so another engineer can pick it up and move quickly.

**Components** live in `src/components/`, one folder per feature (`Profile/`, `Heatmap/`, `RepoStack/`, `Conversation/`). Each folder contains the component, its SCSS module, and a barrel `index.ts`. Adding a new section means creating a new folder that follows the same pattern.

**Design tokens** in `src/styles/tokens/` (colors, typography, spacing, breakpoints) are the single source of truth for visual decisions. New components should pull from these instead of hardcoding values.

**Data and logic** are separated from the UI. Mock data lives in `src/data/`, business logic (stats, response generation, commentary) in `src/lib/`. Swapping mocks for real API calls means replacing the data layer — components don't need to change.

**State** is managed with Zustand in two small stores (`lib/store.ts` for chat, `lib/layoutStore.ts` for layout). Adding a new interaction (e.g. clicking a new UI element to trigger a chat response) follows a repeatable pattern: add an action to the store, write the response logic in `lib/`, wire it up from the component.

**AI-assisted workflow.** The `.cursor/rules/` directory contains context files that AI editors (like Cursor) pick up automatically. They document the architecture, component patterns, token system, and store conventions — so AI suggestions stay consistent with how the project was built. Worth reading even without an AI editor, since they double as concise internal docs.

## How it works

The left side is an editorial layout — big serif name, contribution heatmap, repo bars. The right side is a conversation column where you can ask about the profile's activity.

## Decisions I made

- **Editorial over dashboard.** I went with a magazine-spread feel instead of a typical card-based layout. Large typography, whitespace, and asymmetry are intentional.
- **SCSS tokens.** I wanted an explicit design system with color, typography, and spacing tokens that could scale.
- **Heatmap as a visual centerpiece.** It's not just a widget — it uses an earthy color palette, staggered animation on load, and click interactions that feed into the chat.
- **Two tones for narration.** Heatmap clicks are witty and playful. Repo clicks are informative. Keeps each interaction feeling distinct.
- **Zustand for state.** Lightweight, no boilerplate. The chat store handles messages, typing/thinking states, and narration actions.
- **Seeded randomness for contributions.** The heatmap looks organic but is deterministic — same data on every refresh, with realistic patterns like seasonal variation and weekend dips.

## Tradeoffs

- No real API calls — everything is mocked, but the data layer is separated cleanly for easy swapping.
- No tests — I prioritized design and polish within the time constraint. The stats engine and response logic would be first in line.
- Fonts are loaded from Google Fonts via CSS. In production I'd self-host them.
- Long conversations on mobile make the page tall since the chat flows inline rather than in a constrained box.


## What I'd improve with more time

- Dark mode (the token system is already set up for it)
- Full keyboard and screen reader support for the heatmap and repo bars
- A richer mobile experience — possibly a slide-up conversation drawer instead of the current stacked layout
- Smarter chat responses, possibly backed by something more flexible than pattern matching
- Unit tests for the stats engine and contribution generator
- Persist chat history so conversations survive page refreshes, with an explicit "end conversation" action that lets users close a session while keeping the transcript available on return

## Details worth noticing

### Chat panel

- **Movable left/right.** The chat can be repositioned to either side of the layout. When it's on the right, a tooltip hints at what it does; when it's on the left, the tooltip is omitted — if you moved it there, you already know.
- **Side preference persisted.** The chosen side is saved to `localStorage`, so users who prefer their reading space on a particular side don't have to toggle every visit.
- **Intro message on first load.** The chat opens with a short introduction explaining what it's for and how to interact with it, so no one lands on a blank conversation.
- **Color-coded participants.** Each participant has a distinct name color and a left-side accent bar, making it easy to tell responses from questions at a glance.

### Mobile behavior

- **Chat at the bottom.** On smaller screens the chat stacks below the profile content. When a heatmap day or repo is clicked, the view auto-scrolls to the chat response so the user doesn't have to scroll down manually.
- **No nested scroll on mobile.** The chat flows as part of the page instead of being its own scrollable box, so swiping always scrolls the page. The input bar stays pinned at the bottom so it's always reachable.

### Heatmap & repo interactions

- **Heatmap day click.** Clicking a day cell generates a playful, mocked comment based on how many commits happened that day — light-hearted narration, not raw data.
- **Repo click.** Clicking a repo produces a more formal summary, giving the user a quick overview of what the repository is about.

### Heatmap legend

- Below the heatmap there's a small caption explaining the color scale, paired with a gradient bar for quick visual reference, so users understand what lighter and darker cells mean.


## Project reflection

This project was a mix of design decisions, iteration, and figuring out the problem itself.

I did rely quite a bit on AI during development, mainly to move faster and explore different directions. That said, it wasn’t a “generate and ship” process. I was constantly reviewing, tweaking, and sometimes rewriting what came out of it. The final decisions, both on the design and the code, were always mine.

A big chunk of the time actually went into understanding the exercise properly and setting a strong initial direction. I spent quite a while crafting the first prompt (what I think of as the “base” or “critical” prompt), trying to be as clear and intentional as possible so the project wouldn’t fall into generic patterns.

After that, most of the work became about polishing — adjusting layouts, refining interactions, and making small behavioral decisions that make the UI feel more intentional. That part ended up taking more time than the initial build itself.

Overall, I used AI as a tool to speed things up, but the process was still very hands-on in terms of decision-making, direction, and final quality.