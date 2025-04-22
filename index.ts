import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";

const url =
  process.env["REMOTE_URL"] ||
  `https://api.imandra.ai/v1beta1/tools/mcp/${
    process.env["IMANDRA_MCP_SERVER"] || "reasoners"
  }/`;

const remote = new StreamableHTTPClientTransport(new URL(url), {
  requestInit: {
    headers: { Authorization: `Bearer ${process.env["IMANDRA_API_KEY"]}` },
  },
});

let remoteClosed = false;
let localClosed = false;

const local = new StdioServerTransport();

// Propagate messages
local.onmessage = (msg) => remote.send(msg);
remote.onmessage = (msg) => local.send(msg);

// Log errors
local.onerror = (err) => console.error(err);
remote.onerror = (err) => console.error(err);

// Propagate close events
local.onclose = () => {
  if (!remoteClosed) {
    remoteClosed = true;
    remote.close();
  }
};
remote.onclose = () => {
  if (!localClosed) {
    localClosed = true;
    local.close();
  }
};

// Handle shutdown
process.on("SIGINT", () => {
  console.error("Shutting down");
  local.close();
});

// Start transports
console.error(`Connecting to ${url}`);
await remote.start();
console.error("Starting proxy MCP server");
await local.start();
