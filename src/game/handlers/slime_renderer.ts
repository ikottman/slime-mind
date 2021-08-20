import * as PIXI from 'pixi.js';
import redSlime from '../assets/red_slime.png';
import blueSlime from '../assets/blue_slime.png';
import redKing from '../assets/red_king.png';
import blueKing from '../assets/blue_king.png';
import plantPng from '../assets/plant.png';
import rockPng from '../assets/rock.png';
import maxPlantPng from '../assets/max_level_plant.png';
import { bus, sprites, SPRITE_SIZE, APP } from "../../ui/store";
import { Slime } from "../models/slime";
import { AddPlant, AddRock, AddSlime, EVENT_KEY, KilledEvent, LAYERS, MergeEvent, MoveEvent } from '../schema';

// TODO: either rename or create separate rendering classes
export class SlimeRenderer {
  constructor() {
    bus.subscribe(EVENT_KEY.ADD_SLIME, this.addSlime.bind(this));
    bus.subscribe(EVENT_KEY.KING, this.addKing.bind(this));
    bus.subscribe(EVENT_KEY.CHANGE_HP, this.updateHpBar.bind(this));
    bus.subscribe(EVENT_KEY.MOVE, this.move.bind(this));
    bus.subscribe(EVENT_KEY.MERGE, this.merge.bind(this));
    bus.subscribe(EVENT_KEY.ADD_PLANT, this.addPlant.bind(this));
    bus.subscribe(EVENT_KEY.MAX_PLANT, this.maxPlant.bind(this));
    bus.subscribe(EVENT_KEY.ADD_ROCK, this.addRock.bind(this));
    bus.subscribe(EVENT_KEY.KILLED, this.killed.bind(this));
  }

  private addSprite(sprite: PIXI.Sprite, id: number, x: number, y: number) {
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

    sprites.set(id, container);

    APP.stage.addChild(container);
  }

  private addSlime(event: AddSlime) {
    const { pawn } = event;
    sprites.get(pawn.id)?.destroy(); // happens when a king downgrades to slime
    const sprite = pawn.owner === 1 ? PIXI.Sprite.from(redSlime) : PIXI.Sprite.from(blueSlime);
    this.addSprite(sprite, pawn.id, pawn.x, pawn.y);
    this.updateHpBar(pawn);
  }

  private addKing(slime: Slime) {
    sprites.get(slime.id)?.destroy();
    const sprite = slime.owner === 1 ? PIXI.Sprite.from(redKing) : PIXI.Sprite.from(blueKing);
    this.addSprite(sprite, slime.id, slime.x, slime.y);
    this.updateHpBar(slime);
  }

  private addPlant(event: AddPlant) {
    const { pawn } = event;
    const sprite = PIXI.Sprite.from(plantPng);
    this.addSprite(sprite, pawn.id, pawn.x, pawn.y)
  }

  private addRock(event: AddRock) {
    const { pawn } = event;
    const sprite = PIXI.Sprite.from(rockPng);
    this.addSprite(sprite, pawn.id, pawn.x, pawn.y)
  }

  private maxPlant(event: AddPlant) {
    const { pawn } = event;
    const sprite = PIXI.Sprite.from(maxPlantPng);
    this.addSprite(sprite, pawn.id, pawn.x, pawn.y);
  }

  private updateHpBar(slime: Slime): void {
    const sprite = sprites.get(slime.id)!;

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
    const ratio = slime.hp / slime.maxHp;
    bar.arc(sprite.width / 2, sprite.height / 2, sprite.width / 1.8, halfPi - Math.PI * ratio, halfPi + Math.PI * ratio);
  }

  private move(event: MoveEvent) {
    const sprite = sprites.get(event.pawn.id)!;
    sprite.x = event.to.x * SPRITE_SIZE;
    sprite.y = event.to.y * SPRITE_SIZE;
  }

  private merge(event: MergeEvent) {
    const sprite = sprites.get(event.sacrifice.id)!;
    sprite.destroy();
  }

  private killed(event: KilledEvent) {
    const sprite = sprites.get(event.victim.id)!;
    sprite.destroy();
  }
}