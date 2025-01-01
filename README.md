# WordPress MCP Server

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![smithery badge](https://smithery.ai/badge/wordpress-server)](https://smithery.ai/server/wordpress-server)

A Model Context Protocol (MCP) server that enables AI assistants to interact with WordPress sites through the WordPress REST API. This server provides tools for managing WordPress content programmatically, including creating, retrieving, and updating posts.

## Features

- Create new WordPress posts with customizable titles, content, and status
- Retrieve WordPress posts with pagination support
- Update existing posts with new content or status
- Secure authentication using WordPress application passwords
- Error handling and detailed response messages

## Prerequisites

- Node.js v18 or higher
- A WordPress site with REST API enabled
- WordPress application password for authentication

## Installation

### Installing via Smithery

To install WordPress Server for Claude Desktop automatically via [Smithery](https://smithery.ai/server/wordpress-server):

```bash
npx -y @smithery/cli install wordpress-server --client claude
```

### Manual Installation
1. Clone this repository:
```bash
git clone https://github.com/stefans71/wordpress-mcp-server.git
cd wordpress-server
```

2. Install dependencies:
```bash
npm install
```

3. Build the server:
```bash
npm run build
```

## WordPress Configuration

Before using the server, you need to set up your WordPress site:

1. Ensure your WordPress site has REST API enabled (enabled by default in WordPress 4.7+)
2. Create an application password:
   - Log in to your WordPress admin panel
   - Go to Users → Profile
   - Scroll down to "Application Passwords"
   - Enter a name for the application (e.g., "MCP Server")
   - Click "Add New Application Password"
   - Copy the generated password (you won't be able to see it again)

## MCP Configuration

Add the server to your MCP settings file (usually located at `~/AppData/Roaming/Code/User/globalStorage/saoudrizwan.claude-dev/settings/cline_mcp_settings.json`):

```json
{
  "mcpServers": {
    "wordpress": {
      "command": "node",
      "args": ["path/to/wordpress-server/build/index.js"]
    }
  }
}
```

## Available Tools

### 1. create_post

Creates a new WordPress post.

**Parameters:**
- `siteUrl` (required): Your WordPress site URL
- `username` (required): WordPress username
- `password` (required): WordPress application password
- `title` (required): Post title
- `content` (required): Post content
- `status` (optional): Post status ('draft', 'publish', or 'private', defaults to 'draft')

**Example:**
```json
{
  "tool": "create_post",
  "siteUrl": "https://example.com",
  "username": "admin",
  "password": "xxxx xxxx xxxx xxxx",
  "title": "My First Post",
  "content": "Hello, world!",
  "status": "draft"
}
```

### 2. get_posts

Retrieves WordPress posts with pagination.

**Parameters:**
- `siteUrl` (required): Your WordPress site URL
- `username` (required): WordPress username
- `password` (required): WordPress application password
- `perPage` (optional): Number of posts per page (default: 10)
- `page` (optional): Page number (default: 1)

**Example:**
```json
{
  "tool": "get_posts",
  "siteUrl": "https://example.com",
  "username": "admin",
  "password": "xxxx xxxx xxxx xxxx",
  "perPage": 5,
  "page": 1
}
```

### 3. update_post

Updates an existing WordPress post.

**Parameters:**
- `siteUrl` (required): Your WordPress site URL
- `username` (required): WordPress username
- `password` (required): WordPress application password
- `postId` (required): ID of the post to update
- `title` (optional): New post title
- `content` (optional): New post content
- `status` (optional): New post status ('draft', 'publish', or 'private')

**Example:**
```json
{
  "tool": "update_post",
  "siteUrl": "https://example.com",
  "username": "admin",
  "password": "xxxx xxxx xxxx xxxx",
  "postId": 123,
  "title": "Updated Title",
  "content": "Updated content",
  "status": "publish"
}
```

## Response Format

All tools return responses in the following format:

### Success Response
```json
{
  "success": true,
  "data": {
    // WordPress API response data
  }
}
```

### Error Response
```json
{
  "success": false,
  "error": "Error message here"
}
```

## Error Handling

The server handles various types of errors:

- Invalid request format
- Missing required parameters
- WordPress API errors
- Authentication failures
- Network issues

Each error response includes a descriptive message to help diagnose the issue.

## Security Considerations

- Always use HTTPS URLs for your WordPress site
- Use application passwords instead of your main WordPress password
- Keep your application passwords secure and don't share them
- Consider using WordPress roles and capabilities to limit access
- Regularly rotate application passwords

## Development

To contribute to the development:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests (when available)
5. Submit a pull request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request. By contributing to this project, you agree to abide by its terms.
