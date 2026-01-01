# Markdown Renderer Chrome Extension

A Chrome browser extension that automatically renders local and remote markdown files (`.md`) in a beautiful, readable format.

## Features

- 🎨 Automatically renders `.md` files with GitHub-flavored styling
- 📁 Works with both local files (`file://`) and remote URLs (`http://`, `https://`)
- 🚀 Lightweight and fast
- ✨ Clean, readable interface inspired by GitHub's markdown styling
- 📝 Supports standard markdown features:
  - Headers
  - Lists (ordered and unordered)
  - Code blocks with syntax preservation
  - Tables
  - Links and images
  - Blockquotes
  - Bold, italic, and strikethrough text
  - Horizontal rules

## Installation

### From Source (Developer Mode)

1. Download or clone this repository
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" using the toggle in the top-right corner
4. Click "Load unpacked"
5. Select the `markdown-renderer-extension` directory
6. The extension is now installed and active!

## Usage

Once installed, the extension works automatically:

1. **For remote files**: Simply navigate to any URL ending with `.md`
   - Example: `https://raw.githubusercontent.com/user/repo/main/README.md`
   
2. **For local files**: Open any local `.md` file in Chrome
   - Use `File > Open File` or drag-and-drop a `.md` file into Chrome
   - Make sure to allow file access in the extension settings:
     - Go to `chrome://extensions/`
     - Find "Markdown Renderer"
     - Enable "Allow access to file URLs"

The extension will automatically detect markdown files and render them with beautiful formatting.

## Technical Details

- **Manifest Version**: 3 (latest Chrome extension format)
- **Markdown Parser**: marked.js
- **Styling**: GitHub-flavored markdown CSS
- **Permissions**: 
  - `<all_urls>` - To render markdown from any website
  - `storage` - For future settings storage

## Supported File Types

The extension activates for:
- URLs ending with `.md` extension
- Content served with `text/plain` or `text/markdown` content type

## Styling

The rendered markdown uses a clean, GitHub-inspired theme with:
- Responsive design (mobile-friendly)
- Proper syntax highlighting preservation for code blocks
- Table formatting
- Accessible color scheme

## Development

The extension consists of:
- `manifest.json` - Extension configuration
- `content.js` - Main script that detects and renders markdown
- `markdown.css` - Styling for rendered content
- `marked.min.js` - Markdown parsing library
- Icon files (16x16, 48x48, 128x128 pixels)

## Privacy

This extension:
- Runs entirely in your browser (client-side)
- Does not collect or transmit any data
- Does not require any external API calls
- Only activates on markdown files

## License

This extension is part of the small-apps repository. See the main LICENSE file for details.

## Troubleshooting

**Issue**: Local files don't render
- **Solution**: Make sure "Allow access to file URLs" is enabled in chrome://extensions/

**Issue**: Remote files don't render
- **Solution**: Check that the URL ends with `.md` and returns plain text content

**Issue**: Markdown not rendering properly
- **Solution**: Try refreshing the page (Ctrl+R or Cmd+R)
