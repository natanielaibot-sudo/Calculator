// Simple calculator logic (no eval(): every step is calculated explicitly).

const currentEl = document.getElementById("current");
const historyEl = document.getElementById("history");

let current = "0";      // number being typed (as text)
let previous = null;    // first number of the operation
let operator = null;    // + − × ÷
let justEvaluated = false;

function format(value) {
  // Trim floating point noise like 0.1 + 0.2 = 0.30000000000000004
  return String(parseFloat(Number(value).toPrecision(12)));
}

function updateDisplay() {
  currentEl.textContent = current;
  historyEl.textContent = operator ? `${previous} ${operator}` : "";
}

function inputNumber(digit) {
  if (current === "Error" || justEvaluated) {
    current = "0";
    justEvaluated = false;
  }
  if (digit === "." && current.includes(".")) return;
  current = current === "0" && digit !== "." ? digit : current + digit;
}

function calculate(a, b, op) {
  a = Number(a);
  b = Number(b);
  switch (op) {
    case "+": return a + b;
    case "−": return a - b;
    case "×": return a * b;
    case "÷": return b === 0 ? "Error" : a / b;
  }
}

function chooseOperator(op) {
  if (current === "Error") return;
  if (operator && !justEvaluated) {
    // Chain operations: 2 + 3 + 4
    const result = calculate(previous, current, operator);
    current = result === "Error" ? "Error" : format(result);
    if (current === "Error") { operator = null; previous = null; return; }
  }
  previous = current;
  operator = op;
  justEvaluated = true;   // next digit starts a new number
}

function evaluate() {
  if (!operator || current === "Error") return;
  const result = calculate(previous, current, operator);
  historyEl.textContent = `${previous} ${operator} ${current} =`;
  current = result === "Error" ? "Error" : format(result);
  previous = null;
  operator = null;
  justEvaluated = true;
}

function clearAll() {
  current = "0";
  previous = null;
  operator = null;
  justEvaluated = false;
}

function deleteLast() {
  if (current === "Error" || justEvaluated) return;
  current = current.length > 1 ? current.slice(0, -1) : "0";
}

function percent() {
  if (current === "Error") return;
  current = format(Number(current) / 100);
}

// Button clicks
document.querySelector(".keys").addEventListener("click", (e) => {
  const btn = e.target.closest("button");
  if (!btn) return;

  if (btn.dataset.num !== undefined) inputNumber(btn.dataset.num);
  else if (btn.dataset.op) { chooseOperator(btn.dataset.op); updateDisplay(); return; }
  else if (btn.dataset.action === "equals") { evaluate(); currentEl.textContent = current; return; }
  else if (btn.dataset.action === "clear") clearAll();
  else if (btn.dataset.action === "delete") deleteLast();
  else if (btn.dataset.action === "percent") percent();

  updateDisplay();
});

// Keyboard support
document.addEventListener("keydown", (e) => {
  const opMap = { "+": "+", "-": "−", "*": "×", "/": "÷" };
  if (/^[0-9.]$/.test(e.key)) { inputNumber(e.key); updateDisplay(); }
  else if (opMap[e.key]) { e.preventDefault(); chooseOperator(opMap[e.key]); updateDisplay(); }
  else if (e.key === "Enter" || e.key === "=") { e.preventDefault(); evaluate(); currentEl.textContent = current; }
  else if (e.key === "Backspace") { deleteLast(); updateDisplay(); }
  else if (e.key === "Escape") { clearAll(); updateDisplay(); }
  else if (e.key === "%") { percent(); updateDisplay(); }
});

updateDisplay();
