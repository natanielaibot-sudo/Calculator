# CLAUDE.md

Guidance for Claude Code when working in this repository.

## Project overview

A responsive calculator built with plain HTML, CSS and JavaScript. It is a beginner portfolio project, so the code should stay simple, readable and easy for the owner to explain in an interview.

## Rules

- Keep it vanilla: no frameworks, no build step, no npm dependencies.
- Never use `eval()` or `new Function()`. All calculations go through the `calculate()` function.
- Prefer small, clear functions and comments that explain why, not what.
- Explain changes in plain language. The owner is a new CS graduate learning to build a portfolio.
- Make small, focused commits with clear messages (for example `Add square root button`).
- Do not add large amounts of code the owner cannot understand. Suggest and explain first.

## Files

| File | Purpose |
|------|---------|
| `index.html` | Page structure: display (`#history`, `#current`) and the keypad grid |
| `style.css` | Styling: CSS variables in `:root`, dark mode via `prefers-color-scheme`, 4-column grid keypad |
| `script.js` | All calculator logic, button handling and keyboard support |
| `README.md` | Public project description for GitHub |

## How to run

Open `index.html` in a browser. There is nothing to install or build. To serve it locally, run `python3 -m http.server` in this folder.

## Code architecture (`script.js`)

State variables:
- `current`: the number being typed, stored as a string (can be `"Error"`)
- `previous`: the first operand of the pending operation
- `operator`: one of `+`, `−`, `×`, `÷`, or `null`
- `justEvaluated`: when `true`, the next digit starts a new number

Functions:
- `format(value)` trims floating point noise (so 0.1 + 0.2 shows 0.3)
- `updateDisplay()` writes `current` and the history line to the DOM
- `inputNumber(digit)` handles digits and the decimal point
- `calculate(a, b, op)` does the arithmetic and returns `"Error"` for division by zero
- `chooseOperator(op)` stores the operator and chains operations (2 + 3 + 4)
- `evaluate()` computes the result when `=` is pressed
- `clearAll()`, `deleteLast()`, `percent()` handle AC, DEL and %

Input handling:
- Buttons use event delegation on `.keys` and read `data-num`, `data-op` or `data-action`
- Keyboard: 0-9 and `.`, `+ - * /`, Enter or `=`, Backspace, Escape, `%`

Note: the operator symbols are the Unicode characters `−`, `×`, `÷`. The keyboard map converts `-`, `*`, `/` to them. Keep the HTML `data-op` values and the `switch` in `calculate()` consistent.

## Conventions

- Colors are CSS variables defined in `:root` and overridden in the dark mode media query. Add new colors there, not inline.
- Buttons are styled by class: `.fn` (AC, DEL, %), `.op` (operators), `.eq` (equals), `.zero` (spans two columns).
- Use `const` and `let`, double quotes, and 2-space indentation.

## Manual test checklist

There is no automated test suite. After any change, check:
- `2 + 3 =` gives `5`
- `0.1 + 0.2 =` gives `0.3`
- `2 + 3 + 4 =` gives `9` (chaining)
- `5 ÷ 0 =` shows `Error`, then a new digit starts fresh
- `50 %` gives `0.5`
- DEL removes the last digit and never leaves an empty display
- Typing a second `.` in one number does nothing
- Keyboard input matches the buttons
- Layout works on a narrow phone screen and in dark mode

## Ideas for future work

- Calculation history list
- Square root and power buttons
- Theme toggle button
- Unit tests for `calculate()` and `format()` (would require moving logic into a testable module)
- Deploy with GitHub Pages (Settings, Pages, branch `main`)
