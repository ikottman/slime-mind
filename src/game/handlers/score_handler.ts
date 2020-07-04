import { scoresStore } from '../../ui/store';
import { Map } from '../models/map';
import { Slime } from "../models/slime";

export class ScoreHandler {
  private map: Map;
  
  constructor(map: Map) {
    this.map = map;
  }

  private calculateScore(slimes: Array<Slime>) {
    return slimes.reduce((score, slime) => {
      // TODO: replace with logic from https://github.com/ikottman/slime_ai/wiki/Welcome-to-Slime-Mind!#victory-conditions
      return score + slime.xp; 
    }, 0);
  }

  updateScores() {
    const oneSlimes = this.map.pawns.filter(p => p && p.owner === 1) as Array<Slime>;
    const twoSlimes = this.map.pawns.filter(p => p && p.owner === 2) as Array<Slime>;
    const oneScore = this.calculateScore(oneSlimes);
    const twoScore =  this.calculateScore(twoSlimes);
    scoresStore.update(_ => [oneScore, twoScore]);
  }
}