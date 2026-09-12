# Lab: Perpendicular Lines

## Main idea

**Perpendicular lines intersect at a right angle: 90°.** Think of the corner of a square or the crossing of the horizontal and vertical axes on a graph.

```text
             |
             |
    ---------+---------
             |
             |
```

There are four angles around the intersection. If one is 90°, the adjacent angle must also be 90° because together they form a straight angle: `180° - 90° = 90°`. The same reasoning applies all the way around, so all four angles are right angles.

The lines can be tilted and still be perpendicular. What matters is the angle between them, not whether one looks horizontal on the page.

## Learning goal

Use the slopes of two lines to decide whether they are perpendicular, and find a slope perpendicular to a given slope.

## First, what is slope?

**Slope measures how much a line rises or falls as you move to the right.**

```text
slope = vertical change / horizontal change = rise / run
```

- A slope of `2` means move right 1 unit and up 2 units.
- A slope of `-0.5`, or `-1/2`, means move right 2 units and down 1 unit.
- A positive slope rises to the right; a negative slope falls to the right.

Slope describes a line's direction, not its position. Moving a line up or down without tilting it leaves its slope unchanged.

## The perpendicular-slope rule

For two lines with finite slopes, **the lines are perpendicular exactly when their slopes multiply to -1**:

```text
first slope × second slope = -1
```

Equivalently, the perpendicular slope is the **negative reciprocal** of the original nonzero slope. To find it:

1. Write the slope as a fraction.
2. Flip the numerator and denominator.
3. Change the sign.

For example:

```text
Original slope:       2 = 2/1
Flip the fraction:        1/2
Change the sign:        -1/2 = -0.5
Check:             2 × (-0.5) = -1
```

Another example: the negative reciprocal of `-3/4` is `4/3`. Their product is `-12/12 = -1`.

### Why do we flip the fraction and change the sign?

Imagine a step along a line with slope `2`: right 1 and up 2. Turn that step clockwise by 90°. The new step goes right 2 and down 1, so its slope is `-1/2`.

A quarter-turn swaps the horizontal and vertical amounts and reverses one direction. That is why the fraction flips and its sign changes.

### Special case: horizontal and vertical lines

A horizontal line has slope `0`. A vertical line has an **undefined slope**, because its horizontal change is zero and division by zero is undefined.

Horizontal and vertical lines are perpendicular to each other, but you cannot check them by multiplying two numerical slopes. In the webapp, select **Vertical line** to explore this case. Its equation becomes `x = c`, and the position control changes `c` rather than a vertical intercept.

## Slope and intercept define a line together

A slope alone does **not** specify a unique line. For a nonvertical line, use:

```text
y = mx + b
```

Here `m` is the slope, and `b` is the vertical intercept: the line passes through `(0, b)`.

For example, `y = 2x` and `y = 2x + 3` have the same slope but different positions. They are distinct parallel lines. Changing `b` moves a line up or down without changing its direction.

The original console exercise used only slopes because slopes are enough to test perpendicularity. It did not assume any intercepts. The graph starts with both intercepts at zero so the lines meet at the origin, but you can change either intercept.

## Open the interactive graph

Open [index.html](./index.html) in your web browser. The app runs locally without Node.js, packages, or a build step. If your editor shows HTML source, use your file manager to open the file in a browser.

Alternatively, from the repository root, start a local server:

```bash
python3 -m http.server 8000
```

Then visit <http://localhost:8000/geometry/08-perpendicular-lines/>. Stop the server with Ctrl+C when finished.

### Controls and graph

- **Line A** is solid blue; **Line B** is dashed orange.
- Change **Slope m** with the slider or number field to tilt a line.
- Change **Intercept b** to move a line up or down. The colored dot marks `(0, b)`.
- Select **Vertical line** for `x = c`. The slope control is disabled, and the position dot marks `(c, 0)`.
- The black dot marks the intersection. A small square marks a right angle when the lines are perpendicular.
- Below the graph, read the smaller angle, slope product (when defined), and intersection coordinates.

Both axes show −10 to 10 with equal spacing, so angles are displayed without distortion. If an intersection falls outside that window, its coordinates still appear below the graph. Equal slopes give parallel lines when their intercepts differ, or the same line when their intercepts match.

Use values between −10 and 10. Enter fractions as decimals, such as `-0.5` for `-1/2`. The perpendicularity check allows a tiny rounding tolerance; displayed measurements are rounded to six decimal places.

## Guided experiments

1. Choose **Through the origin**. The equations are `y = 2x` and `y = -0.5x`. Their slope product is −1, and they meet at `(0, 0)` at 90°.
2. Change only Line A's intercept to `3`. Its equation is now `y = 2x + 3`. The intersection moves, but the angle remains 90°.
3. Choose **Different intercepts**. Now the lines are `y = 2x + 3` and `y = -0.5x + 8`. They meet at `(2, 7)`, still at 90°. Check the point: `2(2) + 3 = 7` and `-0.5(2) + 8 = 7`.
4. Change Line B's slope to `-2`. The product is now −4. Opposite signs alone do not make lines perpendicular.
5. Choose **Parallel**. The slopes match, but the intercepts differ. Then give both lines the same intercept: they overlap and the app reports **Same line**.
6. Choose **Horizontal + vertical**. A horizontal line `y = 2` and a vertical line `x = -3` meet at `(-3, 2)` at 90°. Move either line using its position control and watch the angle stay fixed.

## Try it yourself

1. Find a slope perpendicular to `5`. Predict the product, then check with the simulation.
2. Find a slope perpendicular to `-4`. Check your answer.
3. A student says slopes `3` and `-3` are perpendicular because their signs differ. Use multiplication to explain the mistake, then give the correct perpendicular slope for `3`.
4. Draw two perpendicular lines. Rotate your paper. Did their angle change?

### Answers and explanations

1. `-1/5 = -0.2`, because `5 × (-0.2) = -1`. Set the slopes to `5` and `-0.2`.
2. `1/4 = 0.25`, because `-4 × 0.25 = -1`. Set the slopes to `-4` and `0.25`.
3. `3 × (-3) = -9`, so those slopes are not perpendicular. The correct slope is `-1/3`. If testing it, set the slopes to `3` and `-0.3333333333333333`; a short approximation such as `-0.33` is too far from the exact value for this program's check.
4. No. Rotating the paper changes how the drawing is oriented, but the angle between the lines stays 90°.

## Success check

You are ready to move on when you can explain what perpendicular means, find the negative reciprocal of a nonzero slope, and predict the simulation's result before running it. You should also be able to explain why horizontal and vertical lines require a separate rule.
