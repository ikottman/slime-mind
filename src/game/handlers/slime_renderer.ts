import * as PIXI from 'pixi.js';
import redSlime from '../assets/red_slime.png';
import blueSlime from '../assets/blue_slime.png';
import { bus, SPRITE_SIZE, APP } from "../../ui/store";
import { EVENT_KEY, LAYERS, AddSlimeEvent, ChangeHpEvent } from '../schema';

export class SlimeRenderer {
  // keyed by unique id
  sprites: Map<number, PIXI.Container>; // TODO: put in store and use for all sprites?

  constructor() {
    this.sprites = new Map();
    bus.subscribe(EVENT_KEY.ADD_SLIME, this.addSlime.bind(this));
    bus.subscribe(EVENT_KEY.CHANGE_HP, this.updateHpBar.bind(this));
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

  private updateHpBar(event: ChangeHpEvent): void {
    const { id, ratio } = event;
    const sprite = this.sprites.get(id);
    if (!sprite) {
      return;
    }

    let bar = sprite.getChildByName('hpBar') as PIXI.Graphics;
    if (bar) {
      bar.destroy();
    }
    bar = new PIXI.Graphics();
    bar.name = 'hpBar';
    sprite.addChild(bar);
    // put the  bar under the pawn
    bar.zIndex = LAYERS.HPBAR;
    sprite.sortChildren();
    // render an arc relative to how much health they have left
    bar.lineStyle(3.5, 0x00ff00);
    const halfPi = 3 * Math.PI / 2;
    bar.arc(sprite.width / 2, sprite.height / 2, sprite.width / 1.8, halfPi - Math.PI * ratio, halfPi + Math.PI * ratio);
  }
}