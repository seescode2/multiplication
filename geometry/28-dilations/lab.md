# Lab: Dilations

## Main idea

A dilation grows or shrinks a figure from a center C. For a point P and scale factor k, its image is **P′ = C + k(P − C)**. When C is the origin, this simplifies to multiplying both coordinates by k.

## Learning goal

Predict a dilated point, compare its distance from the center, and explain how a dilation changes a triangle's side lengths and area.

## Run the simulation

Open [the interactive web app](./index.html) in your browser. You can also open this folder's `index.html` directly from your file manager. No installation, packages, or server are needed.

## Directions

1. Start with P = (3, 2), center C = (0, 0), and scale factor 2. Predict P′, then compare your prediction with the graph and coordinate readout.
2. Click **½×**. What happens to the coordinates and the distance from C?
3. Click **1×**. Explain why this factor leaves every point unchanged.
4. Select **Triangle PQR**. Compare the side-length and area readouts at 2× and ½×. Does doubling a length also double the area?
5. Move the slider to 0. Where do all the points go? Then try **−1×** and explain the position of the image relative to C.
6. Change C to (1, 1) and return to 2×. Predict the image of P = (3, 2) using P′ = C + k(P − C).
7. Drag P or C on the grid to explore more examples. You can also use the labeled coordinate inputs. Coordinates range from −5 to 5 in steps of ½; the slider ranges from −3 to 3. The graph automatically adjusts its scale to keep all points visible.

## Think about it

- Distances from C and side lengths scale by |k|. Areas scale by k². Why are these factors different?
- For nonzero k, corresponding angles stay equal. What happens when k = 0?
- Why does a point at the center stay fixed for every scale factor?
- When the center is not the origin, why can't you simply multiply P's coordinates by k?

## Success check

With P = (3, 2), C = (1, 1), and k = 2, predict P′ before checking the app. Explain why its distance from C doubles. Then predict the factor for triangle area.

Expected result: P′ = (5, 3); distances double and area is multiplied by 4.

## Optional terminal version

The original point-only simulation is still available with Node.js:

```bash
node app.js 3 2 2
```

The inputs are x, y, and k; the terminal version uses the origin as the center. Use positive scale factors for its closer/farther description, or use the web app to explore zero and negative factors.
