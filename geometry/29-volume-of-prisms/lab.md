# Lab: Volume of Rectangular Prisms

## Main idea

Volume counts unit cubes filling a solid. Multiply length × width × height for a rectangular prism. Each horizontal layer contains length × width cubes, and height tells you how many layers fill the prism.

## Learning goal

Build layers of cubes, calculate volume, and predict how changing dimensions changes volume.

## Run the simulation

Open [the interactive web app](./index.html) in your browser. You can also open this folder's `index.html` directly from your file manager. No installation, packages, or server are needed.

## Directions

1. Start with length 4, width 3, and height 2. Predict the volume before checking the calculation.
2. Move **Layers filled** to 0, then click **Build layer by layer**. Each layer contains 12 cubes. Watch the filled count increase to 24. Use **Pause building** to stop, or **Fill prism** to show all layers.
3. Click **Swap length & width**. Explain why the volume stays the same.
4. Predict what happens when you double the height. Click **Double height** and compare the result with your prediction.
5. Use the dimension sliders to build two different prisms with volume 24 cubic units. Can you use different heights?
6. Click **Reset exploration** to return to 4 × 3 × 2.

Length and width range from 1 to 10 units; height ranges from 1 to 20 units. Doubling is available when the height is at most 10. Changing a dimension fills the prism so you can compare full volumes; use the layers slider to look inside again.

The dashed outline marks the full prism. The newest filled layer is gold and earlier layers are teal. Some cubes are hidden behind others in the 3D view; each complete layer still contains length × width cubes. The model scales to fit, so use the dimension labels when comparing sizes.

## Think about it

- Why does swapping length and width keep the volume the same?
- Why does doubling height double volume?
- What happens to volume if you double all three dimensions?
- How are square units for base area different from cubic units for volume?

## Success check

Predict the volume of a prism with length 5, width 3, and height 4. Explain how many cubes are in one layer and how many layers you need. Check your prediction in the app.

Expected result: 15 cubes per layer × 4 layers = 60 cubic units.

## Optional terminal version

The original simulation is still available with Node.js:

```bash
node app.js 4 3 2
```

The inputs are length, width, and height. Use positive whole numbers.
