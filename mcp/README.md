# MiniNova MCP server

An [MCP](https://modelcontextprotocol.io) server that lets an LLM (Claude Code, Claude Desktop…)
design sounds on the MiniNova: describe the sound you want, the LLM sets the synth's parameters,
you play it and tell it what to change.

It talks MIDI to the synth directly from Node.js, and reuses the web editor's parameter definitions
(`src/mininova.js`), patch decoding (`src/redux/patch.js`) and help texts (`src/help.js`).

## Tools

| Tool | What it does |
|---|---|
| `list_parameters` | Lists the sections, or the parameters of one section with their values and help |
| `get_patch` | Reads the current sound from the synth |
| `set_parameters` | Sets several parameters at once; the synth plays the new sound right away |
| `init_patch` | Resets to a plain sawtooth through an open filter, to start from scratch |

Changes go to the synth's edit buffer, like with the web editor: save the patch on the synth to keep it.
The web editor doesn't see these changes until it reloads the patch.

## Setup

The MiniNova must be connected over USB (on Linux, see the udev rule in the main README).
Then build the server:

```sh
yarn install
yarn mcp:build
```

Register it in Claude Code, from the project directory:

```sh
claude mcp add mininova -- node "$PWD/mcp/dist/server.js"
```

Or in Claude Desktop, in `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "mininova": {
      "command": "node",
      "args": ["/absolute/path/to/mininova-web-editor/mcp/dist/server.js"]
    }
  }
}
```

The server uses the first MIDI port whose name contains "mininova". To use another one, set the
`MININOVA_MIDI_PORT` environment variable to part of its name.

## Example

> Make me a warm, slowly evolving pad, with a bit of shimmer on top.
