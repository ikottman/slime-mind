import { scoresStore, APP } from '../../ui/store';
import { Map } from '../models/map';
import { Slime } from "../models/slime";
import { Fireworks } from '../../ui/fireworks';

export class ScoreHandler {
  private map: Map;
  
  constructor(map: Map) {
    this.map = map;
  }

  private calculateScore(slimes: Array<Slime>) {
    const scorePerLevel = [
      0.2,
      0.4,
      1.6,
      5.2,
      13.7,
      29.9,
      57.7,
      101.7,
      167.0,
      259.7,
      386.7,
      555.3,
    ]

    let score = 0;

    for(let i = 0; i <slimes.length; i++){
      score = score + scorePerLevel[slimes[i].level-1]
    }

    score = Number( score.toPrecision(2) )

    return score; 
  }

  updateScores() {
    const oneSlimes = this.map.pawns.filter(p => p && p.owner === 1) as Array<Slime>;
    const twoSlimes = this.map.pawns.filter(p => p && p.owner === 2) as Array<Slime>;
    const oneScore = this.calculateScore(oneSlimes);
    const twoScore =  this.calculateScore(twoSlimes);
    scoresStore.update(_ => [oneScore, twoScore]);
  }

  win() {
    new Fireworks(APP).start();
  }
}