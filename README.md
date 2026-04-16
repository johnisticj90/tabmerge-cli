# tabmerge-cli

> CLI tool to merge and deduplicate browser bookmark exports from multiple formats

## Installation

```bash
npm install -g tabmerge-cli
```

## Usage

Merge multiple bookmark export files into a single deduplicated output:

```bash
tabmerge merge bookmarks-chrome.html bookmarks-firefox.json -o merged.html
```

### Options

| Flag | Description |
|------|-------------|
| `-o, --output <file>` | Output file path (default: `stdout`) |
| `-f, --format <type>` | Output format: `html`, `json`, `csv` (default: `html`) |
| `--no-dedup` | Skip deduplication step |
| `-v, --verbose` | Show merge summary |

### Supported Input Formats

- Chrome / Edge HTML export (`.html`)
- Firefox JSON export (`.json`)
- Safari bookmark plist (`.plist`)
- Generic Netscape bookmark format

### Example

```bash
# Merge three exports and output as JSON
tabmerge merge chrome.html firefox.json safari.plist -f json -o all-bookmarks.json

# Preview without writing to disk
tabmerge merge chrome.html firefox.json --dry-run
```

## License

MIT © tabmerge-cli contributors