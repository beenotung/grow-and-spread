# grow-and-spread

Visual simulation of growing grass and spreading fire.

Demo: https://grow-and-spread.surge.sh

## Get Started
```bash
npm install # or pnpm install
npm start
```

## Controls
- Press F11 to enter full-screen mode
- Press F12 to open developer console
  - assign integer value to variable `pixel` to change pixel size, e.g. `pixel = 4`
  - assign integer value to variable `batch` to change update speed, e.g. `batch = 5000`
- Change the parameters in `function tick()` in [index.ts](src/index.ts) to explore the effects of different rules
