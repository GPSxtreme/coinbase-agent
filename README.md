# Coinbase Agent

A tiny proof‑of‑concept that wires Coinbase AgentKit into the IQAI ADK (adk-ts) using the Model Context Protocol (MCP). AgentKit providers are exposed as MCP SDK tools, then adapted into ADK tools so your ADK agent can call on-chain actions through Coinbase.

## How it works

- **AgentKit → MCP**: AgentKit's MCP package exposes its action providers as MCP tools plus a handler.
- **MCP → ADK**: Those MCP tools are converted to ADK `BaseTool`s and attached to an `AgentBuilder`.
- **Model**: Uses OpenRouter if `OPEN_ROUTER_KEY` is set; otherwise falls back to the model string configured in `LLM_MODEL`.

### Quick start

1. Install

```bash
pnpm install
```

2. Configure environment
Create a `.env` with the essentials:

```bash
# Optional
DEBUG=false
OPEN_ROUTER_KEY=your_openrouter_key
LLM_MODEL=gpt-4.1-mini

# Required for AgentKit / CDP
CDP_API_KEY_ID=...
CDP_API_KEY_SECRET=...
CDP_WALLET_SECRET=...
# Defaults to "fraxtal" if not set
NETWORK_ID=fraxtal

# Optional: if not set, a throwaway key is generated at runtime
PRIVATE_KEY=0x...
```

3. Run

```bash
pnpm dev
# or
pnpm build && pnpm start
```

The sample entry (`src/index.ts`) asks the agent: "Convert 100 USD to EUR." This is just a placeholder & i would rather recommend using the `adk cli` or `adk web` for better testing environment 👍.

### Included tools (via AgentKit)

- `wethActionProvider`
- `pythActionProvider`
- `walletActionProvider`
- `erc20ActionProvider`
- `cdpApiActionProvider`

These are automatically adapted into ADK tools; you can add or remove providers in `src/agents/coinbase/tools/agentkit.ts`. Check for more providers on the AgentKit repo if needed.

### Project layout

```
src/
  env.ts                      # env + model selection (OpenRouter optional)
  index.ts                    # simple demo prompt
  agents/coinbase/
    agent.ts                  # ADK agent wiring
    tools/
      agentkit.ts            # AgentKit + providers setup
      index.ts               # MCP → ADK tool adapter
```

### Notes

- This is a PoC: minimal glue code aimed at clarity, not completeness.
- Keep your CDP keys and any `PRIVATE_KEY` safe. A generated key is not persisted.

### References

- [IQAI ADK (adk-ts)](https://adk.iqai.com)
- [Coinbase AgentKit](https://docs.cdp.coinbase.com/agent-kit)

### License

MIT
