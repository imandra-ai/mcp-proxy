#!/usr/bin/env node

import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { headers } from "./auth.js";

if (!process.env.REMOTE_URL && !process.env.IMANDRA_MCP_SERVER) {
  throw new Error(
    "Please set the IMANDRA_MCP_SERVER environment variable (or REMOTE_URL). " +
    "Try using `code_logician` or `reasoners` to get started."
  );
}

const url =
  process.env.REMOTE_URL ||
  `https://api.imandra.ai/v1beta1/tools/mcp/${process.env.IMANDRA_MCP_SERVER}`;

const remote = new StreamableHTTPClientTransport(new URL(url), {
  requestInit: { headers },
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
