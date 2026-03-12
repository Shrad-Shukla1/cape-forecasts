# CHC Crop Yield Forecasts - GitHub Pages Site

A dynamic, configurable website for displaying CHC's Africa regional crop yield forecasts. Update the forecast date and all images automatically sync across the entire site.

## Features

✨ **Dynamic Configuration** - Change forecast month/year in one place
🌍 **Multi-Region Support** - East Africa, Southern Africa, West Africa (extensible)
📊 **Responsive Design** - Mobile-friendly interface with smooth animations
🎨 **Professional Styling** - Clean, modern UI with tab navigation
⚡ **Fast Loading** - Lazy-loaded images for optimal performance

## Quick Start

### 1. Create a GitHub Repository

```bash
# Create new repo in your GitHub account
# Name it: chc-forecasts (or similar)
# Clone it locally
git clone https://github.com/sshukla1/chc-forecasts.git
cd chc-forecasts
```

### 2. Copy Files to Repository

Copy all files from this directory:
- `index.html`
- `config.json`
- `style.css`
- `script.js`
- `README.md`

### 3. Enable GitHub Pages

1. Go to your repository on GitHub
2. Click **Settings** → **Pages**
3. Under "Build and deployment", select:
   - Source: **Deploy from a branch**
   - Branch: **main** (or your default branch)
   - Folder: **/ (root)**
4. Click **Save**
5. Your site will be available at: `https://sshukla1.github.io/chc-forecasts`

### 4. Verify It Works

Visit `https://sshukla1.github.io/chc-forecasts` - you should see the website with sample forecast data.

---

## How to Update Forecasts

### Update Month/Year (All Regions)

Edit `config.json` and update these fields at the top:

```json
"lastUpdated": "2026-03-11",
"forecastPeriod": "February 2026",
"month": "February",
"year": 2026,
```

**That's it!** All images will automatically update if they follow the standard URL pattern.

### Update Image Links (If URL Pattern Changes)

If the base URL structure changes, update the image paths in `config.json`.

For each region, the `imageBase` and `imagePaths` work together to form complete URLs:

```
Full URL = imageBase + imagePath
```

**Example for East Africa:**
```json
"imageBase": "https://data.chc.ucsb.edu/experimental/CAPE/viewer/figures/regional",
"imagePaths": {
  "absolute": "/2026/east_africa/Deyr/February/Sorghum/GB/without_masked/East_Africa_2026_Sorghum_yield_forecasts.png",
  ...
}
```

If the month changes from February → March, and you want URLs to auto-update:
1. Update `month` and `year` in the root config
2. Update the path `"/2026/east_africa/Deyr/February/Sorghum/GB/..."` to use the new month

**To make it fully dynamic**, you could modify `script.js` to replace month/year in URLs (advanced - see section below).

---

## Advanced: Auto-Replace Month/Year in URLs

To make the site truly dynamic (auto-update image URLs when you change the month/year), modify the image paths in `config.json` to use placeholders:

```json
"imagePaths": {
  "absolute": "/2026/east_africa/Deyr/{{MONTH}}/Sorghum/GB/without_masked/East_Africa_2026_Sorghum_yield_forecasts.png",
}
```

Then update `script.js` to replace `{{MONTH}}` and `{{YEAR}}`:

```javascript
function replaceUrlPlaceholders(url) {
    return url
        .replace(/{{MONTH}}/g, config.month)
        .replace(/{{YEAR}}/g, config.year);
}
```

Call this function when constructing image URLs:
```javascript
const fullUrl = replaceUrlPlaceholders(region.imageBase + region.imagePaths.key);
```

---

## Config.json Structure

### Main Fields

```json
{
  "lastUpdated": "2026-03-11",          // Release date
  "forecastPeriod": "February 2026",     // Human-readable forecast period
  "month": "February",                   // Month name
  "year": 2026,                          // Year
  "contact": {                           // Contact information
    "name1": "Shrad Shukla",
    "email1": "sshukla@ucsb.edu",
    "name2": "Frank Davenport",
    "email2": "frank_davenport@ucsb.edu"
  },
  "regions": [...]                       // Array of region objects
}
```

### Region Object Structure

```json
{
  "id": "east-africa",                   // Unique ID for tab switching
  "name": "East Africa",                 // Display name
  "crop": "Sorghum",                     // Crop type
  "season": "Short/Deyr season",         // Growing season
  "countries": ["Somalia"],              // List of countries
  "summary": "...",                      // HTML-enabled summary text
  "caveats": [                           // Array of caveat strings
    "Crop yield forecasts are masked...",
    "..."
  ],
  "imageBase": "https://data.chc.ucsb.edu/...",  // Base URL
  "imagePaths": {                        // Maps of image paths
    "absolute": "/2026/...",
    "anomaly2018": "/2026/...",
    "skill": "/2026/...",
    ...
  }
}
```

---

## Adding a New Region

To add a new region (e.g., complete West Africa forecast):

1. Add a new region object to `config.json` → `regions` array
2. Follow the structure above
3. Update all required `imagePaths`
4. The new region will automatically appear in the tab navigation

**Example:**
```json
{
  "id": "west-africa",
  "name": "West Africa",
  "crop": "Millet",
  "season": "Main season",
  "countries": ["Niger", "Mali", "Senegal"],
  "summary": "...",
  "caveats": [...],
  "imageBase": "https://data.chc.ucsb.edu/experimental/CAPE/viewer/figures/regional",
  "imagePaths": {
    "absolute": "/2026/west_africa/Main/February/Millet/GB/...",
    ...
  }
}
```

---

## Deployment Workflow

### For Monthly Updates

```bash
# 1. Edit config.json with new month/year
# 2. Push changes to GitHub
git add config.json
git commit -m "Update forecast to March 2026"
git push origin main

# 3. Site updates automatically in ~30 seconds
# 4. Verify at https://sshukla1.github.io/chc-forecasts
```

### For Image URL Changes

If the URL structure changes substantially:

1. Update the image paths in `config.json`
2. Test locally if possible
3. Commit and push to GitHub
4. Site will update automatically

---

## Customization

### Change Color Scheme

Edit `style.css` - find the color variables and update:
```css
/* Main theme color */
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
color: #667eea;
```

### Add More Tabs

Add regions to `config.json` - tabs are generated automatically.

### Modify Layout

Edit `index.html` structure and `style.css` for responsive design adjustments.

### Add More Predictors

Add to `cape_predictors` array in `config.json`:
```json
"cape_predictors": [
  {
    "name": "NEW_PREDICTOR",
    "description": "Description here",
    "sign": "+"
  },
  ...
]
```

---

## Troubleshooting

### Images Not Loading
- Check URL paths in `config.json`
- Verify image URLs work in browser directly
- Check browser console for errors (F12)

### Site Not Updating After Push
- Wait 30-60 seconds for GitHub Pages to rebuild
- Hard refresh browser (Ctrl+Shift+R or Cmd+Shift+R)
- Check GitHub Actions tab in repository for build errors

### Responsive Design Issues
- Test on mobile devices or use browser dev tools
- CSS media queries are in `style.css`

---

## File Structure

```
chc-forecasts/
├── index.html          # Main HTML template
├── config.json         # Configuration (edit this for updates)
├── style.css          # Styling
├── script.js          # JavaScript logic
├── README.md          # This file
└── .gitignore         # (optional) Ignore node_modules, etc.
```

---

## Technical Details

- **Frontend Framework**: Vanilla JavaScript (no dependencies)
- **Hosting**: GitHub Pages (free)
- **Data Source**: URLs from data.chc.ucsb.edu
- **Browser Support**: All modern browsers (Chrome, Firefox, Safari, Edge)

---

## Support & Contact

For questions about the forecasts themselves, contact:
- Shrad Shukla: sshukla@ucsb.edu
- Frank Davenport: frank_davenport@ucsb.edu

For website issues, consult this README or check GitHub Issues.

---

## License

This website template is created for CHC's forecasting project. Ensure you have permission to display forecast data.

---

**Last Updated**: 2026-03-11
