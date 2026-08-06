# Playing Budget Calculator

A bilingual weekly playing-budget planner for Playing for Good.

## User flow

1. Enter weekly take-home pay.
2. Select the percentage of weekly pay reserved for playing.
3. See the resulting weekly playing budget.
4. Enter the number of games planned for the week.
5. See the recommended maximum amount per game.
6. Enter how many games have already been played.
7. See the used budget, remaining games, and remaining playing budget.

## Recommended percentage

The interface states that **4% of weekly pay is the recommended playing-budget amount**, while allowing the user to select another percentage from 1% to 15%.

## Calculation logic

```text
Weekly playing budget =
weekly pay × selected percentage

Recommended amount per game =
weekly playing budget ÷ games planned

Budget used so far =
recommended amount per game × games played

Budget remaining =
weekly playing budget − budget used so far
```

The tracking model assumes each completed game used the recommended equal amount.

## Languages

The calculator includes an English / Français toggle. All labels, results, messages, and warnings switch instantly without reloading the page.

## Technology

- HTML
- CSS
- Vanilla JavaScript
- No database
- No backend
- No Python runtime required

## Run locally

Open `index.html` in a browser, or run:

```bash
python -m http.server 8000
```

Then visit:

```text
http://localhost:8000
```

Python is only used as an optional local static-file server. The calculator itself runs in JavaScript.

## Publish on GitHub Pages

1. Create a public GitHub repository.
2. Push these files to the `main` branch.
3. Open **Settings → Pages**.
4. Select **Deploy from a branch**.
5. Select `main` and `/ (root)`.
6. Save.

## Embed in Wix

Add an **Embed Site** element in Wix and paste the GitHub Pages URL.

Start with:

- Width: 100%
- Height: about 950 px
- Mobile height: adjust after previewing

## Future tracking improvement

This version estimates money used based on the equal recommended amount per game.

A later version could add an **actual amount spent per game** field or transaction history, which would allow exact tracking when games have different entry prices.
