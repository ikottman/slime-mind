import * as PIXI from "pixi.js";
import { SPRITE_SIZE, APP, hoveredPawnIdStore, hoveredPawnStore } from "../../ui/store";
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
    this.sprite.on("mouseover", () => {
      hoveredPawnIdStore.update(() => this.id);
      hoveredPawnStore.update(() => this.json());
    });
    this.sprite.on("mouseout", () => {
      hoveredPawnIdStore.update(() => 0);
      hoveredPawnStore.update(() => ({}));
    });
  }

  move(x: number, y: number) {
    this.x = x;
    this.y = y;
    this.sprite.x = x * SPRITE_SIZE;
    this.sprite.y = y * SPRITE_SIZE;
  }

  addSprite(sprite: PIXI.Sprite) {
    sprite.zIndex = LAYERS.PAWN;
    sprite.height = SPRITE_SIZE;
    sprite.width = SPRITE_SIZE;
    // add a container so we have a layer behind the pawn
    const spriteContainer = new PIXI.Container();
    spriteContainer.addChild(sprite);
    this.sprite = spriteContainer;
    this.sprite.height = SPRITE_SIZE;
    this.sprite.width = SPRITE_SIZE;
    this.sprite.zIndex = LAYERS.PAWN;
    this.handleMouseHover();
    // update sprite's location
    this.move(this.x, this.y);
    APP.stage.addChild(this.sprite);
  }

  // take damage and return true if this killed the pawn
  takeDamage(damage: number): boolean {
    return false;
  }

  json(): any {
    throw Error('Classes extending Pawn must implement a json method');
  }
}