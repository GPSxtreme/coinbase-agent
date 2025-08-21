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
DEBUG=false
OPEN_ROUTER_KEY=your_openrouter_key
LLM_MODEL=gpt-4.1-mini

# Required for AgentKit / CDP
# Get these 2 from: https://portal.cdp.coinbase.com/projects/api-keys
CDP_API_KEY_ID=...
CDP_API_KEY_SECRET=...

WALLET_PRIVATE_KEY=0x...
# get it from: https://zerion.io/api
ZERION_API_KEY=...
```

3. Run

Run the predefined set of agent prompts `src/index.ts`

```bash
pnpm dev
```

Have a full on conversation using the adk cli (requires [adk-cli]("https://adk.iqai.com/docs/framework/get-started/cli") package installed )

```bash
# Spins up chat interface on cli
adk run
# (or)
# Opens up web interface to chat with the agent
adk web
```

### Included tools (via AgentKit)

- `defillamaActionProvider` (Querying defi llama platform for coin data & details)
- `pythActionProvider` (Retrieves price data from Pyth price feed)
- `walletActionProvider` (getting wallet details & enables native token transfer)
- `erc20ActionProvider` (enables transfer & get balance of erc20 token)
- `x402ActionProvider` (enables http requests)
- `zerionActionProvider` (provides portfolio overview & fungible token positions, requires API key)

These are automatically adapted into ADK tools; you can add or remove providers in `src/agents/coinbase/tools/agentkit.ts`. Check for more [providers]("https://github.com/coinbase/agentkit/blob/main/typescript/agentkit/README.md#action-providers") on the AgentKit repo if needed.

### Project layout

```bash
src/
  env.ts                      # env + model selection (OpenRouter optional)
  index.ts                    # simple demo prompt
  agents/coinbase/
    agent.ts                  # ADK agent wiring
    tools/
      agentkit.ts            # AgentKit + providers setup & MCP → ADK tool adapter
```


### References

- [IQAI ADK (adk-ts)](https://adk.iqai.com)
- [Coinbase AgentKit](https://docs.cdp.coinbase.com/agent-kit)

### License

MIT
