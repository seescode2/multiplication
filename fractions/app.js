const $ = (selector) => document.querySelector(selector);
const inputs = ['#numeratorOne', '#denominatorOne', '#numeratorTwo', '#denominatorTwo'].map($);
let quizQuestion;
let score = 0;

function clampInput(input) {
  const minimum = Number(input.min);
  const maximum = Number(input.max);
  const value = Number(input.value);
  if (!Number.isFinite(value)) input.value = minimum;
  else input.value = Math.min(maximum, Math.max(minimum, Math.round(value)));
}

function gcd(a, b) {
  a = Math.abs(a); b = Math.abs(b);
  while (b) [a, b] = [b, a % b];
  return a || 1;
}

function simplify(numerator, denominator) {
  const divisor = gcd(numerator, denominator);
  return { numerator: numerator / divisor, denominator: denominator / divisor };
}

function calculateParts(a, b, operator) {
  const denominator = (a.denominator * b.denominator) / gcd(a.denominator, b.denominator);
  const firstNumerator = a.numerator * (denominator / a.denominator);
  const secondNumerator = b.numerator * (denominator / b.denominator);
  const numerator = operator === '+'
    ? firstNumerator + secondNumerator
    : firstNumerator - secondNumerator;
  const unsimplified = { numerator, denominator };
  return { unsimplified, simplest: simplify(numerator, denominator) };
}

function calculate(a, b, operator) {
  return calculateParts(a, b, operator).simplest;
}

function wedgePath(index, total) {
  if (total === 1) return 'M 50 50 m -42 0 a 42 42 0 1 0 84 0 a 42 42 0 1 0 -84 0';
  const start = (index / total) * Math.PI * 2 - Math.PI / 2;
  const end = ((index + 1) / total) * Math.PI * 2 - Math.PI / 2;
  const point = (angle) => `${50 + 42 * Math.cos(angle)} ${50 + 42 * Math.sin(angle)}`;
  return `M 50 50 L ${point(start)} A 42 42 0 0 1 ${point(end)} Z`;
}

function pizzaSvg(numerator, denominator, label) {
  const filled = Math.min(Math.abs(numerator), denominator);
  const slices = Array.from({ length: denominator }, (_, index) =>
    `<path d="${wedgePath(index, denominator)}" class="${index < filled ? 'filled-slice' : 'empty-slice'} slice-line"/>`).join('');
  const pepperoni = Array.from({ length: filled }, (_, index) => {
    const angle = ((index + .5) / denominator) * Math.PI * 2 - Math.PI / 2;
    return `<circle cx="${50 + 25 * Math.cos(angle)}" cy="${50 + 25 * Math.sin(angle)}" r="3.6" class="pepperoni"/>`;
  }).join('');
  return `<svg viewBox="0 0 100 100" class="pizza-svg" role="img" aria-label="${label}">${slices}<circle cx="50" cy="50" r="43" class="crust"/>${pepperoni}</svg>`;
}

function renderPizza(container, numerator, denominator, label) {
  container.innerHTML = pizzaSvg(numerator, denominator, label || `${numerator} out of ${denominator} slices`);
}

function valuePair(one = true) {
  return { numerator: Number($(one ? '#numeratorOne' : '#numeratorTwo').value), denominator: Number($(one ? '#denominatorOne' : '#denominatorTwo').value) };
}

function renderExplore() {
  const a = valuePair(); const b = valuePair(false);
  const operator = document.querySelector('[name=operator]:checked').value;
  const { unsimplified, simplest: result } = calculateParts(a, b, operator);
  renderPizza($('#pizzaOne'), a.numerator, a.denominator);
  renderPizza($('#pizzaTwo'), b.numerator, b.denominator);
  $('#answerTitle').textContent = `${a.numerator}/${a.denominator} ${operator} ${b.numerator}/${b.denominator} = ${unsimplified.numerator}/${unsimplified.denominator} = ${result.numerator}/${result.denominator}`;
  const amount = Math.abs(result.numerator);
  const wholes = Math.floor(amount / result.denominator);
  const remainder = amount % result.denominator;
  let pizzas = Array.from({ length: wholes }, () => `<div class="pizza-stage">${pizzaSvg(result.denominator, result.denominator, 'one whole pizza')}</div>`).join('');
  if (remainder) pizzas += `<div class="pizza-stage">${pizzaSvg(remainder, result.denominator, `${remainder} out of ${result.denominator} slices`)}</div>`;
  if (!amount) pizzas = `<div class="pizza-stage">${pizzaSvg(0, 1, 'zero pizza slices')}</div>`;
  $('#resultPizzas').innerHTML = `${result.numerator < 0 ? '<span class="negative-sign">−</span>' : ''}${pizzas}`;
  $('#answerHint').textContent = gcd(Math.abs(result.numerator), result.denominator) === 1 ? 'This answer is in its simplest form!' : '';
}

function randomQuestion() {
  const denominatorA = 2 + Math.floor(Math.random() * 7);
  const denominatorB = 2 + Math.floor(Math.random() * 7);
  const a = { numerator: 1 + Math.floor(Math.random() * denominatorA), denominator: denominatorA };
  const b = { numerator: 1 + Math.floor(Math.random() * denominatorB), denominator: denominatorB };
  let operator = Math.random() < .5 ? '+' : '−';
  if (operator === '−' && a.numerator / a.denominator < b.numerator / b.denominator) [a.numerator, b.numerator, a.denominator, b.denominator] = [b.numerator, a.numerator, b.denominator, a.denominator];
  quizQuestion = { a, b, operator, answer: calculate(a, b, operator === '−' ? '−' : '+') };
  renderPizza($('#quizPizzaOne'), a.numerator, a.denominator);
  renderPizza($('#quizPizzaTwo'), b.numerator, b.denominator);
  $('#quizFractionOne').textContent = `${a.numerator}/${a.denominator}`;
  $('#quizFractionTwo').textContent = `${b.numerator}/${b.denominator}`;
  $('#quizOperator').textContent = operator;
  $('#quizNumerator').value = ''; $('#quizDenominator').value = '';
  $('#quizFeedback').textContent = ''; $('#quizFeedback').className = 'feedback';
  $('#nextQuestion').classList.add('hidden');
  $('#quizForm').classList.remove('hidden');
  $('#quizNumerator').focus();
}

inputs.forEach((input) => input.addEventListener('input', () => { clampInput(input); renderExplore(); }));
document.querySelectorAll('[name=operator]').forEach((input) => input.addEventListener('change', renderExplore));
document.querySelectorAll('.mode-button').forEach((button) => button.addEventListener('click', () => {
  document.querySelectorAll('.mode-button').forEach((item) => { const active = item === button; item.classList.toggle('active', active); item.setAttribute('aria-pressed', active); });
  const quiz = button.dataset.mode === 'quiz';
  $('#exploreMode').classList.toggle('hidden', quiz); $('#quizMode').classList.toggle('hidden', !quiz);
  $('#pageTitle').textContent = quiz ? 'Put your fraction skills to the test!' : 'Build fractions with pizza!';
  $('#pageIntro').textContent = quiz ? 'Look at the pizzas, solve the problem, and simplify your answer.' : 'Change the slices, choose an operation, and watch the answer appear.';
  if (quiz) randomQuestion();
}));
$('#quizForm').addEventListener('submit', (event) => {
  event.preventDefault();
  const user = simplify(Number($('#quizNumerator').value), Number($('#quizDenominator').value));
  const correct = user.numerator === quizQuestion.answer.numerator && user.denominator === quizQuestion.answer.denominator;
  $('#quizFeedback').textContent = correct ? '🎉 You got it! Great fraction thinking!' : `Almost! The simplest answer is ${quizQuestion.answer.numerator}/${quizQuestion.answer.denominator}.`;
  $('#quizFeedback').className = `feedback ${correct ? 'correct' : 'incorrect'}`;
  if (correct) { score += 1; $('#scoreValue').textContent = score; }
  $('#quizForm').classList.add('hidden'); $('#nextQuestion').classList.remove('hidden');
});
$('#nextQuestion').addEventListener('click', randomQuestion);
renderExplore();
