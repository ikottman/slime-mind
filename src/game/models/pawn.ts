import * as PIXI from "pixi.js";
import { hoveredPawnIdStore, hoveredPawnStore, bus } from "../../ui/store";
import { PAWN_TYPE, EVENT_KEY } from "../schema";

export class Pawn {
  id: number;
  x: number;
  y: number;
  owner: number;
  // provided by extending classes like Slime
  type!: PAWN_TYPE;
  sprite?: PIXI.Container;

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
    if (this.sprite) {
      this.sprite.interactive = true;
      this.sprite?.on("mouseover", () => {
        hoveredPawnIdStore.update(() => this.id);
        hoveredPawnStore.update(() => this.json());
      });
      this.sprite.on("mouseout", () => {
        hoveredPawnIdStore.update(() => 0);
        hoveredPawnStore.update(() => ({}));
      });
    }
  }

  move(x: number, y: number) {
    bus.emit(EVENT_KEY.MOVE, { pawn: this, x, y });
    this.x = x;
    this.y = y;
  }

  // take damage and return true if this killed the pawn
  takeDamage(damage: number) {
    return false;
  }

  json(): any {
    throw Error('Classes extending Pawn must implement a json method');
  }
}