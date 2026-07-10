# Champions to Showdown OCR

Convert Pokemon Champions team detail screenshots into Showdown format text.

Live site: https://ppoiuy.github.io/champions-to-showdown-ocr/

Updated for Regulation M-B. New regulations may bring new Pokemon, moves, abilities, and forms.

## Usage

1. Open the site.
2. Take your screenshots:
   - From the Pokemon Champions home page: **Train** → **Replica Teams** → **Share Your Battle Teams** → choose a team → **View Details**
   - Screenshot the **Moves & More** tab
   - Screenshot the **Stats** tab
3. Upload both screenshots.
4. Enter your AI API key at the bottom of the site.
   - Google Gemini currently has a free model available, with limited uses per day. You can easily create an API key for free with a Google account.
5. Click **Import screenshots**.
6. Review the results in the Team Editor and fix any OCR mistakes.
7. Copy the generated Showdown format text from the export panel.

## API Key

An API key from a supported AI provider is required. Google Gemini has a free tier; OpenAI and Claude are paid.

| Provider | Model | Cost |
|---|---|---|
| Google Gemini | `gemini-2.5-flash` | Free tier available |
| OpenAI | `gpt-5.6-luna` | Paid (untested) |
| Claude | `claude-sonnet-5` | Paid (untested) |

- [Google Gemini](https://aistudio.google.com/app/api-keys) — free tier available
- [OpenAI](https://platform.openai.com/api-keys) — paid
- [Claude](https://platform.claude.com/settings/keys) — paid

The app persists your key locally when **Save key** is enabled.

If you run out of free Gemini tokens, use a different Google account for a fresh key.

> **Nature detection**: Free Gemini (`gemini-2.5-flash`) has limited spatial reasoning and often misidentifies which stat has the red/blue arrow, producing incorrect natures. GPT and Claude may be much more reliable, however both are untested. Always double-check team details, especially natures, in the Team Editor.

## Toggles

- **Moveset + ability check** (default: on) — filters move and ability dropdowns, and validates each Pokemon's learnset against Showdown data
- **Auto-format Mega** (default: off) — rewrites species to Mega form and swaps to the Mega Form's ability when a Mega Stone item is detected
- **Fuzzy match** (default: on) — corrects close OCR misspellings against the Showdown dataset using Levenshtein distance
- **AI form lookup** (default: off, unreliable) — asks the AI to identify the Pokemon sprite and return the correct form name
- **Custom form match** (default: on) — applies rule-based form corrections for specific Pokemon

## Warnings

- OCR can make mistakes. Always review the extracted data before using it.
- Nature detection is unreliable on free Gemini. GPT and Claude may produce better results (untested).
- AI form lookup is unreliable — the AI often misidentifies sprites or returns the wrong form suffix.
- The tool uses Pokemon Showdown data for validation. Pokemon Champions may have a different legal move/item pool.
- Stat points are capped at 32 per stat and 66 total based on Pokemon Champions rules.
- The moveset + ability check requires loading ~3MB of learnset data the first time it is enabled.

The following forms cannot be automatically detected by Custom form match because they require visual sprite, type, or stat inspection. They must be set manually in the Team Editor:

Basculegion-F, Maushold-Four, Gourgeist-Large, Gourgeist-Small, Gourgeist-Super, Polteageist-Antique, Sinistcha-Masterpiece, Tauros-Paldea-Combat, Vivillon-Fancy, Vivillon-Pokeball

## Privacy

- Your API key is stored in your browser's local storage when saved.
- Screenshots are sent to the selected AI provider for OCR processing.
- No data is stored on any server.

## Validation

The app shows warnings for invalid species, items, abilities, moves, natures, or stat point totals. Validation uses Pokemon Showdown data as a baseline.
