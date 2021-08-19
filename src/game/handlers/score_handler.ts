import { scoresStore } from '../../ui/store';
import { map } from '../../ui/store';
import { Slime } from "../models/slime";

export class ScoreHandler {

  constructor() {
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

    score = Number( score.toPrecision(4) )

    return score;
  }

  updateScores() {
    const oneSlimes = map.pawns.filter(p => p && p.owner === 1) as Array<Slime>;
    const twoSlimes = map.pawns.filter(p => p && p.owner === 2) as Array<Slime>;
    const oneScore = this.calculateScore(oneSlimes);
    const twoScore =  this.calculateScore(twoSlimes);
    scoresStore.update(_ => [oneScore, twoScore]);
  }
}