import * as PIXI from 'pixi.js';
import { APP, turn, bus } from '../../ui/store';
import { Pawn } from '../models/pawn';
import { LAYERS, EVENT_KEY } from '../schema';

interface RenderedText {
  text: PIXI.Text,
  turnAdded: number
};

export class TextHandler {
  texts: Array<RenderedText>;

  constructor() {
    this.texts = [];
    bus.subscribe(EVENT_KEY.SPLIT, this.handleSplit.bind(this));
  }

  private clearOldTexts() {
    // stop rendering old texts
    this.texts.filter(text => turn - text.turnAdded >= 5).forEach(text => text.text.destroy());
    // stop tracking texts we destroyed
    this.texts = this.texts.filter(text => turn - text.turnAdded < 5);
  }

  private handleSplit(target: Pawn) {
    this.addText('SPLIT', target, '#941651');
  }

  clearAllTexts() {
    this.texts.forEach(text => text.text.destroy());
    this.texts = [];
  }

  addText(text: string, target: Pawn, color: string) {
    const style = new PIXI.TextStyle({
      fill: color
    });
    const renderedText = new PIXI.Text(text, style);
    renderedText.x = target.sprite.x;
    renderedText.y = target.sprite.y;
    renderedText.zIndex = LAYERS.TEXT;
    APP.stage.addChild(renderedText);
    this.texts.push({
      text: renderedText,
      turnAdded: turn,
    })
  }

  takeTurn() {
    this.clearOldTexts();
  }
}