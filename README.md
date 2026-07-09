# Pokemon Champions Showdown Format Screenshot OCR

Convert Pokemon Champions team detail screenshots into Pokemon Showdown import text.

Live site: https://ppoiuy.github.io/pokemon-champions-showdown-format-screenshot-ocr/

This tool is intended for quickly sharing or saving teams from Pokemon Champions, especially when using tools like the Pokemon Showdown damage calculator.

## Usage

1. Open the site.
2. Add the `Moves & More` screenshot.
3. Add the `Stats` screenshot.
4. Enter a Gemini API key for best OCR results, or continue with the built-in Tesseract fallback.
5. Click `Import screenshots`.
6. Review and manually fix any extracted fields if needed.
7. Copy the generated Pokemon Showdown paste from the export panel.

## Gemini API Key

Gemini OCR is recommended for better screenshot parsing accuracy.

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
- Tesseract OCR fallback is less accurate than Gemini.
- The screenshot layout is currently tuned for the standard team detail screens.
- Move validation currently checks move existence, not full per-Pokemon learnset legality.
