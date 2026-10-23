import { text } from "./rational";
import type { Problem } from "./problems";

export interface Story {
  title: string;
  question: string;
  variable: string;
  relationship: string;
  meaning: string;
  equationSignature: string;
}
export function storiesFor(p: Problem): Story[] {
  const { a, b, c, denominator = 1, variant } = p.params;
  const total = text(c),
    answer = text(p.solution);
  const make = (
    title: string,
    question: string,
    variable: string,
    relationship: string,
    meaning: string,
  ): Story => ({
    title,
    question,
    variable,
    relationship,
    meaning,
    equationSignature: p.signature,
  });
  if (p.family === "proportion" && a > 0) {
    return [
      make(
        "In the kitchen",
        `A recipe uses ${a} cups of flour for ${denominator} batches. At the same rate, how many cups make ${total} batches?`,
        "x is the cups of flour for the new batch count.",
        `${a}/${denominator} is cups per batch. x/${total} is the same rate for the new recipe.`,
        `Use ${answer} cups of flour.`,
      ),
      make(
        "On the move",
        `A cyclist travels ${a} kilometers in ${denominator} minutes. At the same speed, how far will they travel in ${total} minutes?`,
        "x is the new distance in kilometers.",
        `Distance divided by time is speed: ${a}/${denominator} = x/${total}.`,
        `The cyclist travels ${answer} kilometers.`,
      ),
      make(
        "At the store",
        `${denominator} meters of ribbon cost $${a}. At the same price per meter, what do ${total} meters cost?`,
        "x is the new cost in dollars.",
        `Both fractions are dollars per meter. The quantities are ${a} dollars for ${denominator} meters and x dollars for ${total} meters.`,
        `The ribbon costs ${answer} dollars.`,
      ),
    ];
  }
  if (
    p.solution.n > 0 &&
    a > 0 &&
    c.n > 0 &&
    p.family !== "proportion" &&
    !(p.family === "multiplication" && variant === "divide" && c.d !== 1)
  ) {
    const change = b >= 0 ? `a $${b} fee` : `a $${-b} discount`;
    if (p.family === "two-step")
      return [
        make(
          "A little shopping",
          `${a} identical notebooks with ${change} cost $${total}. How much does one notebook cost?`,
          "x is the price of one notebook in dollars.",
          `${a}x is the notebook cost. ${b >= 0 ? `Add ${b} for the fee` : `Subtract ${-b} for the discount`} to get ${total}.`,
          `Each notebook costs ${answer} dollars.`,
        ),
        make(
          "Making progress",
          `You earn $${a} per hour. ${b >= 0 ? `You already have $${b}` : `You start with $0 and repay a $${-b} loan from your earnings`}. After working, you have $${total}. How many hours did you work?`,
          "x is the number of hours worked.",
          `${a}x is the money earned. The ${b >= 0 ? "starting balance" : "loan repayment"} contributes ${b}, giving a final balance of ${total}.`,
          `You worked ${answer} hours.`,
        ),
        make(
          "A day out",
          `${a} tickets plus ${change} cost $${total}. What is the price of a ticket?`,
          "x is the price of one ticket in dollars.",
          `Multiply the ticket price by ${a}, then ${b >= 0 ? `add the ${b} fee` : `subtract the ${-b} discount`}. The result is ${total}.`,
          `Each ticket costs ${answer} dollars.`,
        ),
      ];
    if (p.family === "addition")
      return [
        make(
          "Your savings",
          `You have some money. After ${b >= 0 ? `receiving $${b}` : `spending $${-b}`}, you have $${total}. How much did you start with?`,
          "x is your starting balance in dollars.",
          `${b >= 0 ? `Adding ${b}` : `Subtracting ${-b}`} from x gives the final balance, ${total}.`,
          `You started with ${answer} dollars.`,
        ),
        make(
          "A temperature change",
          `The temperature ${b >= 0 ? `rises ${b}` : `falls ${-b}`} degrees to ${total}°C. What was it before?`,
          "x is the starting temperature in degrees Celsius.",
          `The signed change is ${b} degrees and the final reading is ${total}.`,
          `It was ${answer}°C.`,
        ),
        make(
          "A measuring tape",
          `A ribbon is ${b >= 0 ? `extended by ${b}` : `shortened by ${-b}`} centimeters and is now ${total} centimeters long. How long was it originally?`,
          "x is the original length in centimeters.",
          `The length changes by ${b} centimeters, giving a final length of ${total}.`,
          `It was ${answer} centimeters long.`,
        ),
      ];
    if (variant === "divide")
      return [
        make(
          "Sharing equally",
          `Some pencils are shared equally among ${a} students. Each receives ${total} pencils. How many pencils are there altogether?`,
          "x is the total number of pencils.",
          `Dividing the total x by ${a} students gives ${total} pencils per student.`,
          `There are ${answer} pencils.`,
        ),
        make(
          "Packing snacks",
          `A supply of snacks fills ${a} equal boxes with ${total} snacks each. How many snacks are in the supply?`,
          "x is the total number of snacks.",
          `x divided into ${a} equal groups gives ${total} in each group.`,
          `There are ${answer} snacks.`,
        ),
        make(
          "Splitting the cost",
          `${a} friends split a bill equally and each pays $${total}. What is the total bill?`,
          "x is the bill in dollars.",
          `The bill x divided by ${a} people equals ${total} dollars per person.`,
          `The bill is ${answer} dollars.`,
        ),
      ];
    return [
      make(
        "A little shopping",
        `${a} identical notebooks cost $${total}. How much does each notebook cost?`,
        "x is the price of one notebook in dollars.",
        `${a} notebooks multiplied by x dollars each gives ${total} dollars.`,
        `Each notebook costs ${answer} dollars.`,
      ),
      make(
        "Around the track",
        `${a} equal laps cover ${total} kilometers. How long is one lap?`,
        "x is the distance of one lap in kilometers.",
        `${a} laps times x kilometers per lap equals ${total} kilometers.`,
        `One lap is ${answer} kilometers.`,
      ),
      make(
        "Saving each week",
        `You save the same amount each week for ${a} weeks and save $${total} in total. How much do you save per week?`,
        "x is the amount saved per week in dollars.",
        `${a} weeks times x dollars per week equals ${total} dollars.`,
        `You save ${answer} dollars per week.`,
      ),
    ];
  }
  // Signed quantities belong in signed contexts, never negative item counts or prices.
  if (p.family === "proportion")
    return [
      make(
        "A changing temperature",
        `A temperature changes by ${a}°C in ${denominator} minutes at a constant rate. What signed change occurs in ${total} minutes?`,
        "x is a signed temperature change in degrees Celsius.",
        `${a}/${denominator} and x/${total} are the same signed change per minute.`,
        `The temperature changes by ${answer}°C.`,
      ),
      make(
        "Tracking an account",
        `An account changes by $${a} over ${denominator} days at a constant rate. What signed change occurs over ${total} days?`,
        "x is the signed change in dollars.",
        `Both ratios describe dollars of change per day. A negative amount is a loss.`,
        `The account changes by ${answer} dollars.`,
      ),
      make(
        "An elevator sensor",
        `An elevator changes height by ${a} meters in ${denominator} seconds at a constant speed. What signed change occurs in ${total} seconds?`,
        "x is the signed height change in meters.",
        `Both fractions give signed meters per second. Negative means downward.`,
        `The height changes by ${answer} meters.`,
      ),
    ];
  const instruction =
    p.family === "addition"
      ? `add ${b}`
      : p.family === "multiplication"
        ? `${variant === "divide" ? "divide by" : "multiply by"} ${a}`
        : `multiply by ${a}, then add ${b}`;
  return [
    make(
      "Sensor calibration",
      `A sensor takes a signed reading, then follows this rule: ${instruction}. Its calibrated reading is ${total}. What was the input?`,
      "x is the signed input reading.",
      `The calibration rule uses ${p.family === "addition" ? `a signed offset of ${b}` : `a ${p.family === "multiplication" && variant === "divide" ? "divisor" : "multiplier"} of ${a}${p.family === "two-step" ? ` and a signed offset of ${b}` : ""}`}. The output is ${total}.`,
      `The input reading is ${answer}.`,
    ),
    make(
      "A number machine",
      `A number machine follows this rule: ${instruction}. The output is ${total}. Which number went in?`,
      "x is the input number, which may be negative.",
      `Apply the stated operations to x in order to produce ${total}.`,
      `The input is ${answer}.`,
    ),
    make(
      "A game score",
      `A game transforms a signed score using this rule: ${instruction}. The new score is ${total}. What was the old score?`,
      "x is the original signed score.",
      `The scoring rule applies the same operations as the equation; negative scores are allowed. The result is ${total}.`,
      `The old score is ${answer}.`,
    ),
  ];
}
