# Pokemon Champions Showdown Format Screenshot OCR

Convert Pokemon Champions team detail screenshots into Pokemon Showdown import text.

Live site: https://ppoiuy.github.io/pokemon-champions-showdown-format-screenshot-ocr/

This tool is intended for quickly sharing or saving teams from Pokemon Champions, especially when using tools like the Pokemon Showdown damage calculator.

## Usage

1. Open the site.
2. Take screenshots of each Pokemon in your team:
   - From the Pokemon Champions home page: **Train** → **Replica Teams** → **Share Your Battle Teams** → choose a team → **View Details**
   - Take a screenshot of the **Moves & More** tab.
   - Take a screenshot of the **Stats** tab.
3. Upload the `Moves & More` screenshot.
4. Upload the `Stats` screenshot.
5. Enter your Gemini API key.
6. Click `Import screenshots`.
7. Review and manually fix any extracted fields if needed.
8. Copy the generated Pokemon Showdown paste from the export panel.

## Gemini API Key

A Gemini API key is required to use this tool.

Get a free API key from Google AI Studio:

https://aistudio.google.com/app/apikey

The app includes a `Save key` option that stores the key in your browser's local storage.

## Privacy

- Screenshots are processed in your browser.
- If Gemini OCR is used, screenshot crops are sent directly from your browser to Google's Gemini API.
- The Gemini API key is only saved locally in your browser when `Save key` is enabled.
- There is no project backend server.

## Validation

The app shows warnings for fields that look invalid or unknown.

Current validation uses Pokemon Showdown data as a baseline for Pokemon, move, item, and ability names. If Pokemon Champions has a different legal list, this may need a Champions-specific dataset later.

## Current Limitations

- OCR can make mistakes, so manual review is recommended.
- The screenshot layout is currently tuned for the standard team detail screens.
- Move validation currently checks move existence, not full per-Pokemon learnset legality.
