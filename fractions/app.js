const $ = (selector) => document.querySelector(selector);
const inputs = ['#numeratorOne', '#denominatorOne', '#numeratorTwo', '#denominatorTwo'].map($);
let quizQuestion;
let score = 0;
let quizDifficulty = 'easy';

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

function pizzaSvg(numerator, denominator, label, topping = 'pepperoni', pepperoniCount = null) {
  const filled = Math.min(Math.abs(numerator), denominator);
  const slices = Array.from({ length: denominator }, (_, index) =>
    `<path d="${wedgePath(index, denominator)}" class="${index < filled ? (topping === 'cheese' ? 'cheese-slice' : 'filled-slice') : 'empty-slice'} slice-line"/>`).join('');
  const pepperoni = topping === 'pepperoni' ? Array.from({ length: pepperoniCount ?? filled }, (_, index) => {
    const angle = ((index + .5) / denominator) * Math.PI * 2 - Math.PI / 2;
    return `<circle cx="${50 + 25 * Math.cos(angle)}" cy="${50 + 25 * Math.sin(angle)}" r="3.6" class="pepperoni"/>`;
  }).join('') : '';
  return `<svg viewBox="0 0 100 100" class="pizza-svg" role="img" aria-label="${label}">${slices}<circle cx="50" cy="50" r="43" class="crust"/>${pepperoni}</svg>`;
}

function combinedPizzaSvg(firstSlices, secondSlices, denominator, label) {
  const filled = Math.min(firstSlices + secondSlices, denominator);
  const slices = Array.from({ length: denominator }, (_, index) => {
    const topping = index < firstSlices ? 'pepperoni-slice' : index < filled ? 'cheese-slice' : 'empty-slice';
    return `<path d="${wedgePath(index, denominator)}" class="${topping} slice-line"/>`;
  }).join('');
  const pepperoni = Array.from({ length: Math.min(firstSlices, denominator) }, (_, index) => {
    const angle = ((index + .5) / denominator) * Math.PI * 2 - Math.PI / 2;
    return `<circle cx="${50 + 25 * Math.cos(angle)}" cy="${50 + 25 * Math.sin(angle)}" r="3.6" class="pepperoni"/>`;
  }).join('');
  return `<svg viewBox="0 0 100 100" class="pizza-svg" role="img" aria-label="${label}">${slices}<circle cx="50" cy="50" r="43" class="crust"/>${pepperoni}</svg>`;
}

function renderPizza(container, numerator, denominator, label, topping = 'pepperoni') {
  container.innerHTML = pizzaSvg(numerator, denominator, label || `${numerator} out of ${denominator} slices`, topping);
}

function valuePair(one = true) {
  return { numerator: Number($(one ? '#numeratorOne' : '#numeratorTwo').value), denominator: Number($(one ? '#denominatorOne' : '#denominatorTwo').value) };
}

function renderExplore() {
  const a = valuePair(); const b = valuePair(false);
  const operator = document.querySelector('[name=operator]:checked').value;
  const { unsimplified, simplest: result } = calculateParts(a, b, operator);
  renderPizza($('#pizzaOne'), a.numerator, a.denominator, `${a.numerator} out of ${a.denominator} pepperoni slices`, 'pepperoni');
  renderPizza($('#pizzaTwo'), b.numerator, b.denominator, `${b.numerator} out of ${b.denominator} cheese slices`, 'cheese');
  $('#answerTitle').textContent = `${a.numerator}/${a.denominator} ${operator} ${b.numerator}/${b.denominator} = ${unsimplified.numerator}/${unsimplified.denominator} = ${result.numerator}/${result.denominator}`;
  const firstContribution = a.numerator * (unsimplified.denominator / a.denominator);
  const secondContribution = operator === '+'
    ? b.numerator * (unsimplified.denominator / b.denominator)
    : 0;
  const amount = Math.abs(unsimplified.numerator);
  const wholes = Math.floor(amount / unsimplified.denominator);
  const remainder = amount % unsimplified.denominator;
  const pizzaCount = wholes + (remainder ? 1 : 0);
  let pizzas = Array.from({ length: pizzaCount }, (_, index) => {
    const capacity = index < wholes ? unsimplified.denominator : remainder;
    const previousCapacity = index * unsimplified.denominator;
    const pepperoniSlices = Math.min(Math.max(firstContribution - previousCapacity, 0), capacity);
    const cheeseSlices = Math.min(Math.max(secondContribution - Math.max(previousCapacity - firstContribution, 0), 0), capacity - pepperoniSlices);
    return `<div class="pizza-stage">${combinedPizzaSvg(pepperoniSlices, cheeseSlices, unsimplified.denominator, 'combined pizza with pepperoni and cheese')}</div>`;
  }).join('');
  if (!amount) pizzas = `<div class="pizza-stage">${pizzaSvg(0, 1, 'zero pizza slices', 'cheese')}</div>`;
  $('#resultPizzas').innerHTML = `${result.numerator < 0 ? '<span class="negative-sign">−</span>' : ''}${pizzas}`;
  $('#answerHint').textContent = gcd(Math.abs(result.numerator), result.denominator) === 1 ? 'This answer is in its simplest form!' : '';
}

function randomQuestion() {
  let denominatorA;
  let denominatorB;
  if (quizDifficulty === 'easy') {
    denominatorA = 2 + Math.floor(Math.random() * 7);
    denominatorB = denominatorA;
  } else if (quizDifficulty === 'medium') {
    const denominators = [2, 4, 6, 8];
    denominatorA = denominators[Math.floor(Math.random() * denominators.length)];
    do {
      denominatorB = denominators[Math.floor(Math.random() * denominators.length)];
    } while (denominatorB === denominatorA);
  } else {
    denominatorA = 2 + Math.floor(Math.random() * 7);
    denominatorB = 2 + Math.floor(Math.random() * 7);
  }
  const a = { numerator: 1 + Math.floor(Math.random() * denominatorA), denominator: denominatorA };
  const b = { numerator: 1 + Math.floor(Math.random() * denominatorB), denominator: denominatorB };
  let operator = Math.random() < .5 ? '+' : '−';
  if (operator === '−' && a.numerator / a.denominator < b.numerator / b.denominator) [a.numerator, b.numerator, a.denominator, b.denominator] = [b.numerator, a.numerator, b.denominator, a.denominator];
  quizQuestion = { a, b, operator, answer: calculate(a, b, operator === '−' ? '−' : '+') };
  renderPizza($('#quizPizzaOne'), a.numerator, a.denominator, `${a.numerator} out of ${a.denominator} pepperoni slices`, 'pepperoni');
  renderPizza($('#quizPizzaTwo'), b.numerator, b.denominator, `${b.numerator} out of ${b.denominator} cheese slices`, 'cheese');
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
document.querySelectorAll('.difficulty-button').forEach((button) => button.addEventListener('click', () => {
  document.querySelectorAll('.difficulty-button').forEach((item) => {
    const active = item === button;
    item.classList.toggle('active', active);
    item.setAttribute('aria-pressed', active);
  });
  quizDifficulty = button.dataset.difficulty;
  randomQuestion();
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
