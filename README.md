# Typescript AI SDK Template

This is a github template for Soma's JS SDK. This template is an example of how to use Vercel's ```AI SDK``` to create an agent that runs on Soma.

In a terminal, run ```soma dev --clean``` in the project root. ```--clean``` ensures that we will start with a clean database and Restate server.

## secret configuration

In another terminal:

```
soma enc-key add local --file-name local.bin
soma secret set OPENAI_API_KEY xyz
```

## MCP configuration

1. Open your browser, naviate to ```http://localhost:3000/bridge/enable-functions```
2. enable the approve claim provider (click the row, click configure, set an account display name). This is a custom MCP function in our ```./functions/approveClaim.ts``` file.
3. Your Bridge client will not have re-generated

You can invoke the ```approve-claim``` function in 2 different ways:

### Provide LLM with the MCP server

This is how most MCP tools are provided to agents. In the case of Vercel's AI SDK, do the following:

```typescript
import { experimental_createMCPClient as createMCPClient } from '@ai-sdk/mcp';

const mcpClient = await createMCPClient({
  transport: {
    type: 'http',
    url: 'http://localhost:3000/mcp',
  },
});

const tools = mcpClient.tools();

const stream = streamText({
    model,
    messages,
    tools
});
```

### Direct invocation

Instantiate the generated bridge client. The client types are re-generated everytime you enable or disable a Bridge function.

```./agents/index.ts```

Ensure it's imported at the top of the file from the generated location.

Do not gitignore the ```.soma/bridge.ts``` file.

```diff
+import { type BridgeDefinition, getBridge } from "../.soma/bridge";
```

Pass in the bridge client type to your pattern definitions
```diff
patterns.chat<
		BridgeDefinition,
		DiscoverClaimInput,
		Assessment
	>
```

Instantiate the client in your entrypoint function.

```diff
entrypoint: async ({ ctx, soma, taskId, contextId: _contextId }) => {
+		const bridge = getBridge(ctx);
```

Invoke it in the entrypoint or in any of your pattern functions (it's passdown as a parameter in the pattern functins).

```typescript
bridge.approveClaim.test.approveClaim({
    claim: assessment.claim,
});
```

or enable any SaaS integration from ```http://localhost:3000/bridge/enable-functions``` and use it in the same way.

```typescript
bridge.googleMail["test@ame.com"].sendEmail({
    to: "receiver@acme.com",
    subject: "Test!"
    body: "Testing!!"
});
```

These clients are strongly typed out of the box.

## Debugging

### Agent chat & invocations

Navigate to ```http://localhost:3000/a2a```

From here you can find endpoint information for your agents. From the ```Chat``` panel you can test invocations of your agent via chat.

### MCP functions

Navigate to ```http://localhost:3000/bridge/mcp-inspector```

From here you can interact with the MCP server exactly how any LLM would. Alternatively, under the ```Enable functions``` page, you can open any enabled function and there is an explicit test tab with the input schema rendered as a form for you to test directly.