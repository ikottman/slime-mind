import * as PIXI from 'pixi.js';
import { APP, turn, bus, sprites } from '../../ui/store';
import { LAYERS, EVENT_KEY, MergeEvent, SplitEvent } from '../schema';

interface RenderedText {
  text: PIXI.Text,
  turnAdded: number
};

export class TextHandler {
  texts: Array<RenderedText>;

  constructor() {
    this.texts = [];
    bus.subscribe(EVENT_KEY.SPLIT, this.handleSplit.bind(this));
    bus.subscribe(EVENT_KEY.MERGE, this.handleMerge.bind(this));
    bus.subscribe(EVENT_KEY.END_TURN, this.clearOldTexts.bind(this));
    bus.subscribe(EVENT_KEY.END_GAME, this.clearAllTexts.bind(this));
    bus.subscribe(EVENT_KEY.RESET, this.clearAllTexts.bind(this));
  }

  private clearOldTexts() {
    // stop rendering old texts
    this.texts.filter(text => turn - text.turnAdded >= 5).forEach(text => text.text.destroy());
    // stop tracking texts we destroyed
    this.texts = this.texts.filter(text => turn - text.turnAdded < 5);
  }

  private handleSplit(event: SplitEvent) {
  this.addText('SPLIT', event.slime.id, '#941651');
  }

  private handleMerge(event: MergeEvent) {
    this.addText('MERGE', event.slime.id, '#72fa78');
  }

  private clearAllTexts() {
    this.texts.forEach(text => text.text.destroy());
    this.texts = [];
  }

  private addText(text: string, id: number, color: string) {
    const target = sprites.get(id)!;
    const style = new PIXI.TextStyle({
      fill: color
    });
    const renderedText = new PIXI.Text(text, style);
    renderedText.x = target.x;
    renderedText.y = target.y;
    renderedText.zIndex = LAYERS.TEXT;
    APP.stage.addChild(renderedText);
    this.texts.push({
      text: renderedText,
      turnAdded: turn,
    })
  }
}