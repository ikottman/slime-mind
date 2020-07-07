import * as PIXI from 'pixi.js';
import { APP, turn } from '../../ui/store';
import { Pawn } from '../models/pawn';

interface RenderedText {
  text: PIXI.Text,
  turnAdded: number
};

export class TextHandler {
  texts: Array<RenderedText>;
  constructor() {
    this.texts = [];
  }

  private clearOldTexts() {
    // stop rendering old texts
    this.texts.filter(text => turn - text.turnAdded >= 5).forEach(text => text.text.destroy());
    // stop tracking texts we destroyed
    this.texts = this.texts.filter(text => turn - text.turnAdded < 5);
  }

  addText(text: string, target: Pawn) {
    const renderedText = new PIXI.Text(text);
    renderedText.x = target.sprite.x;
    renderedText.y = target.sprite.y;
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