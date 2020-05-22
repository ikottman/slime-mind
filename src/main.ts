import * as PIXI from "pixi.js";

import rabbitImage from "./assets/rabbit.png";
import Sprite from './models/sprite';

const SIZE = 360;
const app = new PIXI.Application({
    width: SIZE,
    height: SIZE,
    backgroundColor: 0x1099bb,
    resolution: 1,
});
document.body.appendChild(app.view);

const pixelSize = SIZE / 10;
const bunny = new Sprite(rabbitImage, pixelSize);
const container = new PIXI.Container();
container.x = 0;
container.y = 0;
app.stage.addChild(container);
container.addChild(bunny.sprite);

let flip = false;
app.ticker.add(() => {
    if (bunny.x == 10) {
        flip = true;
    } else if (bunny.x == 0) {
        flip = false;
    }
    if (bunny.x > 0 && flip ) {
        bunny.move(bunny.x - 1, bunny.y);
    } else if (bunny.x < 10) {
        bunny.move(bunny.x + 1, bunny.y);
    }
});
