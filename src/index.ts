import * as PIXI from "pixi.js";

import rabbitImage from "./assets/rabbit.png";
const SIZE = 360;
const app = new PIXI.Application({
    width: SIZE, height: SIZE, backgroundColor: 0x1099bb, resolution: window.devicePixelRatio || 1,
});
document.body.appendChild(app.view);

// create centered container
const container = new PIXI.Container();
container.x = SIZE / 2;
container.y = container.x;
app.stage.addChild(container);

// Create a new texture
const texture = PIXI.Texture.from(rabbitImage);

// create a grid
const pixelSize = SIZE / 10;
const grid = SIZE / pixelSize;
for (let i = 0; i < grid * grid; i++) {
    const bunny = new PIXI.Sprite(texture);
    bunny.anchor.set(0.5);
    bunny.x = (i % grid) * pixelSize;
    bunny.y = Math.floor(i / grid) * pixelSize;
    container.addChild(bunny);
}

// Center bunny sprite in local container coordinates
container.pivot.x = container.width / 2;
container.pivot.y = container.height / 2;

// Listen for animate update
app.ticker.add((delta) => {
    // rotate the container!
    // use delta to create frame-independent transform
    //container.rotation -= 0.01 * delta;
});
