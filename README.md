# mcp-proxy

A basic proxy for remote [Model Context Protocol (MCP)](https://modelcontextprotocol.io/introduction) servers, designed to make the [Streamable HTTP](https://modelcontextprotocol.io/specification/2025-03-26/basic/transports#streamable-http) transport usable by a broader set of clients by offering a [stdio](https://modelcontextprotocol.io/specification/2025-03-26/basic/transports#stdio) facade.

This is currently specialised to the Imandra Universe MCP servers (with first-class support for Imandra Universe authentication), but would be easy to generalise.

## Usage

Recommended usage is via `npx`, which is included with `npm`. Similar functionality is available in other JavaScript toolchains (e.g. `bunx`, `yarn dlx`).

```bash
npx -y github:imandra-ai/mcp-proxy
```

### Configuration

Configuration is possible via environment variables, typically specified in an `env` field in your MCP server configuration file.

- `IMANDRA_API_KEY` - your Imandra API key, available from [Imandra Universe](https://universe.imandra.ai/user/api-keys).
- `IMANDRA_MCP_SERVER` - name/ID of the Imandra Universe MCP server to use (e.g. `reasoners`).
- `REMOTE_URL` - the URL of your remote MCP server (e.g. for a dev or local deployment). If not specified, defaults to `https://api.imandra.ai/v1beta1/tools/mcp/${IMANDRA_MCP_SERVER}`.

### Example Cursor/Windsurf configuration

```json
{
  "mcpServers": {
    "imandra-universe/reasoners": {
      "command": "npx",
      "env": {
        "IMANDRA_API_KEY": "my_api_key",
        "IMANDRA_MCP_SERVER": "reasoners"
      },
      "args": [
        "-y",
        "git@github.com:imandra-ai/mcp-proxy"
      ]
    }
  }
}
```