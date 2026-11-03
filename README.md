# MiniNova Web Editor

Control your **Novation MiniNova** synthesizer from your web browser.

**Try it: <https://dr4venfr.github.io/mininova-web-editor/>**

This is a Linux-friendly alternative to Novation's official MiniNova Editor VST plugin. It lets you
reach every synth parameter from one screen, so you don't have to dig through the hardware menus.

> **Fork notice:** this project is a fork of
> [nclavaud/mininova-web-editor](https://github.com/nclavaud/mininova-web-editor), created by
> [Nicolas Clavaud](https://github.com/nclavaud), with contributions from Nikolaus Gradwohl. Credit for the
> original editor goes to them. This fork adds an MCP server for sound design with an LLM, a
> Voice page, a CC/NRPN chart, built-in help, and automatic deployment to GitHub Pages.

## Features

- **All parameters in one place**, organised in tabs that follow the signal path: Oscillators,
  Filters, Envelopes, LFOs, Effects, Voice, Arp, Vocoder, Mod Matrix and Tweaks.
- **Live control:** every change goes straight to the synth over MIDI (CC/NRPN).
- **Load patch:** read the current sound from the synth into the editor.
- **Randomize** every control, and **lock** the ones you want to keep.
- **Help:** short explanations for each parameter, with links to the
  [MiniNova user guide](./public/docs/mininova-user-guide-v1.01-en.pdf) and the
  [CC/NRPN chart](./public/docs/mininova-cc-nprn-chart.pdf).
- **Connection over Web MIDI**, or over direct USB in browsers that support WebUSB.
- **Sound design with an LLM** through the [MCP server](./mcp/README.md).

## Requirements

- A Novation MiniNova connected over USB (or through a MIDI interface).
- A browser that supports the Web MIDI API (see the
  [list of compatible browsers](https://developer.mozilla.org/en-US/docs/Web/API/MIDIAccess#browser_compatibility)).

### Linux: udev rule

On Linux, the system blocks USB access to the MiniNova unless a udev rule allows it. Install the rule
shipped with this project, then reload the rules:

```sh
sudo cp linux/99-novation.rules /etc/udev/rules.d/
sudo udevadm control --reload-rules && sudo udevadm trigger
```

The rule gives access to members of the `audio` group. If your user isn't in that group, add it
with `sudo usermod -aG audio $USER` and log in again.

## Designing sounds with an LLM

The [MCP server](./mcp/README.md) lets an LLM such as Claude set up the synth from a description of
the sound you want, for example *"a warm, slowly evolving pad with a bit of shimmer on top"*.
See [mcp/README.md](./mcp/README.md) for setup.

## Development

Requires Node.js 22.12 or later and Yarn.

```sh
yarn install
yarn dev
```

Then open <http://localhost:3000/mininova-web-editor/>. The page reloads as you edit the code.

| Command | What it does |
|---|---|
| `yarn dev` | Runs the app in development mode with [Vite](https://vite.dev) |
| `yarn test` | Runs the test suite once with [Vitest](https://vitest.dev) (`yarn test:watch` for watch mode) |
| `yarn lint` | Lints the code with ESLint |
| `yarn build` | Type-checks the code and builds the app for production into `dist/` |
| `yarn preview` | Serves the production build locally |
| `yarn mcp:build` | Builds the MCP server into `mcp/dist/` |

### Deployment

Every push to `main` runs lint, tests and the build, then deploys to GitHub Pages
(see [.github/workflows/deploy.yml](./.github/workflows/deploy.yml)).

## Credits

- Original project: [nclavaud/mininova-web-editor](https://github.com/nclavaud/mininova-web-editor)
  by Nicolas Clavaud, with contributions from Nikolaus Gradwohl.
- MiniNova is a trademark of Novation / Focusrite. This project has no affiliation with Novation.
  The user guide and the CC/NRPN chart in `public/docs/` are Novation documents.
