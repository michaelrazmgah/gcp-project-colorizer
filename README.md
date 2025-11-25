# GCP Project Colorizer

A Chrome extension that customizes the Google Cloud Platform Console banner background color based on the active project ID. Perfect for teams managing multiple GCP projects - quickly identify which project you're working in by the banner color!

## Features

- 🎨 Map project IDs to specific banner colors
- 🔄 Automatically applies colors when switching projects
- ⚡ Easy-to-use popup interface for managing color rules
- 🚀 Real-time updates without page reload

## Installation

### From Chrome Web Store
[GCP Project Colorizer](https://chromewebstore.google.com/detail/gcp-project-colorizer/pfdogcijcoieaoaehmfgoiolndpkonel)

### Manual Installation (Developer Mode)

1. Clone this repository or download as ZIP
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" (toggle in the top right)
4. Click "Load unpacked"
5. Select the extension directory

## Usage

1. Click the extension icon in your Chrome toolbar
2. Enter a Project ID (e.g., `production`, `staging`)
3. Select a color using the color picker
4. Click "Save Rule"
5. Navigate to the GCP Console - the banner will automatically change color when you switch to that project

## How It Works

The extension uses a content script that:
- Monitors the GCP Console page for project changes
- Reads the active project ID from the page DOM
- Applies the user-configured banner color based on the project ID
- Stores color mappings locally using Chrome's storage API

## Privacy

This extension does not collect, transmit, or store any user data on external servers. All project-to-color mappings are stored locally on your device. See [privacy-policy.html](privacy-policy.html) for more details.

## Permissions

- **Storage**: Used to store project-to-color mappings locally

The extension uses a content script that runs on GCP Console pages to read the project ID and apply banner colors. This is declared in the manifest and does not require additional host permissions.

## Development

### Project Structure

```
├── manifest.json      # Extension configuration
├── popup.html         # Settings UI
├── popup.js           # Settings logic
├── content.js         # Main script that applies colors
├── icon*.png          # Extension icons
└── privacy-policy.html # Privacy policy
```

### Building

To create a distribution ZIP file:

```bash
zip -r gcp-project-colorizer.zip manifest.json popup.html popup.js content.js icon*.png
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Issues

If you encounter any issues or have feature requests, please open an issue on GitHub.

