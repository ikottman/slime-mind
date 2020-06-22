import { scoresStore } from '../../ui/store';
import { Map } from '../models/map';
import { Sprite } from "../models/sprite";

export class ScoreHandler {
  private map: Map;
  
  constructor(map: Map) {
    this.map = map;
  }

  private calculateScore(slimes: Array<Sprite>) {
    return slimes.reduce((score, slime) => {
      // TODO: replace with logic from https://github.com/ikottman/slime_ai/wiki/Welcome-to-Slime-Mind!#victory-conditions
      return score + slime.id; 
    }, 0);
  }

  updateScores() {
    const oneSlimes = this.map.sprites.filter(p => p && p.owner === 1);
    const twoSlimes = this.map.sprites.filter(p => p && p.owner === 2);
    const oneScore = this.calculateScore(oneSlimes);
    const twoScore =  this.calculateScore(twoSlimes);
    scoresStore.update(_ => [oneScore, twoScore]);
  }
}