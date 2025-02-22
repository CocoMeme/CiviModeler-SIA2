# file: ../../frontend/src/components/Banner.jsx

## Goal
Modify the `Banner.jsx` component to replace the existing GIF display with a **3D model viewer**. The new component should:

- Load and display a `.obj` or `.glb` file.
- Allow user interaction to **rotate, move, or tilt** the model along the **X, Y, and Z axes**.
- Use the file source `/images/Homepage.obj` or `/images/Homepage.glb`.

## Requirements
- Use **React Three Fiber** (or an alternative Three.js-based library) for rendering.
- Implement **basic orbit controls** for interaction.
- Ensure the model **scales responsively** within the layout.
- Write clean and modular code by **creating new files as needed**.

## Target Code to Modify
Replace the following section in `Banner.jsx`:

```jsx
{/* Existing static GIF */}
<div className="w-full md:w-2/3 flex justify-center items-center -mt-40">
    <img
        src="/images/Homepage.gif"
        alt="Sci-Fi Visual"
        className="w-full h-auto"
    />
</div>
