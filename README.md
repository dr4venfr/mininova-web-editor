This project is a Linux-friendly alternative to the official Mininova Editor VST plugin.
It allows you to control the Novation Mininova synth from your web browser, so you don't
have to deep dive into the hardware controls.

This application runs in any web browser that supports the Web MIDI API specification (see the
[list of compatible browsers](https://developer.mozilla.org/en-US/docs/Web/API/MIDIAccess#browser_compatibility)
).

## Prerequisites

On Linux, connecting to the Mininova through USB requires a udev rule, otherwise access to the device will be denied.

To do so, copy the content of [99-novation.rules](./linux/99-novation.rules) into directory `/etc/udev/rules.d/`.

## Development

Requires Node.js 22.12 or later. In the project directory, you can run:

### `yarn dev`

Runs the app in development mode with [Vite](https://vite.dev).<br />
Open [http://localhost:3000/mininova-web-editor/](http://localhost:3000/mininova-web-editor/) to view it in the browser.

The page will update as you make edits.

### `yarn test`

Runs the test suite once with [Vitest](https://vitest.dev). Use `yarn test:watch` for watch mode.

### `yarn lint`

Lints the code with ESLint.

### `yarn build`

Type-checks the code and builds the app for production into the `dist` folder.
