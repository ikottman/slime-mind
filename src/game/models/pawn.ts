import * as PIXI from "pixi.js";
import { SPRITE_SIZE, APP, hoveredPawnStore } from "../../ui/store";
import { PAWN_TYPE, LAYERS } from "../schema";

export class Pawn {
  id: number;
  x: number;
  y: number;
  owner: number;
  // provided by extending classes like Slime
  type!: PAWN_TYPE;
  sprite!: PIXI.Container;

  constructor(owner: number, x: number, y: number) {
    this.id = PIXI.utils.uid();
    this.owner = owner;
    this.x = x;
    this.y = y;
  }

  /**
   * show details of the pawn when it's hovered over
   */
  private handleMouseHover(): void {
    // allow listening for events like onmouseover
    this.sprite.interactive = true;
    this.sprite.on("mouseover", _ => {
      hoveredPawnStore.update(pawn => pawn = this.json());
    });
    this.sprite.on("mouseout", _ => {
      hoveredPawnStore.update(_ => ({}));
    });
  }

  move(x: number, y: number) {
    this.x = x;
    this.y = y;
    this.sprite.x = x * SPRITE_SIZE;
    this.sprite.y = y * SPRITE_SIZE;
  }

  addSprite(sprite: PIXI.Sprite) {
    this.sprite = sprite;
    this.sprite.height = SPRITE_SIZE;
    this.sprite.width = SPRITE_SIZE;
    this.sprite.zIndex = LAYERS.PAWN;
    this.handleMouseHover();
    APP.stage.addChild(this.sprite);
    // update sprite's location
    this.move(this.x, this.y);
  }

  // take damage and return true if this killed the pawn
  takeDamage(damage: number): boolean {
    return false;
  }

  json(): any {
    throw Error('Classes extending Pawn must implement a json method');
  }
}