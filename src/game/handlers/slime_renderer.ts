import * as PIXI from 'pixi.js';
import redSlime from '../assets/red_slime.png';
import blueSlime from '../assets/blue_slime.png';
import { bus, SPRITE_SIZE, APP } from "../../ui/store";
import { EVENT_KEY, LAYERS, AddSlimeEvent } from '../schema';

export class SlimeRenderer {
  // keyed by unique id
  sprites: Map<number, PIXI.Container>; // TODO: put in store and use for all sprites?

  constructor() {
    this.sprites = new Map();
    bus.subscribe(EVENT_KEY.ADD_SLIME, this.addSlime.bind(this));
  }

  private addSlime(event: AddSlimeEvent) {
    const { owner, id, x, y } = event;

    const sprite = owner === 1 ? PIXI.Sprite.from(redSlime) : PIXI.Sprite.from(blueSlime);
    sprite.zIndex = LAYERS.PAWN;
    sprite.height = SPRITE_SIZE;
    sprite.width = SPRITE_SIZE;

    // add a container so we have a layer behind the pawn
    const container = new PIXI.Container();
    container.addChild(sprite);
    container.x = x * SPRITE_SIZE;
    container.y = y * SPRITE_SIZE;
    container.height = SPRITE_SIZE;
    container.width = SPRITE_SIZE;
    container.zIndex = LAYERS.PAWN;

    // TODO: handle mouseover, probably need global store of pawns so I can grab their json by the id

    this.sprites.set(id, container);

    APP.stage.addChild(container);
  }
}