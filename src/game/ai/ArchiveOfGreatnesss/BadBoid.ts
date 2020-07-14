// @ts-nocheck
export class BadBoid {
  private playerId;
  private gameMap = [];
  private configuration;
  private turn;
  private boid;
  private nearbyPlants;
  private nearbyEnemies;
  private nearbyCells;

  static displayName = 'Bad Boid';
  constructor(playerId) {
    this.playerId = playerId;
  }

  // [min, max]
  private randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  // select random from list, undefined if list is empty
  private pick(list) {
    return list[this.randomInt(0, list.length - 1)];
  }

  private neighbors(x, y) {
    return [[-1, 0], [0, -1], [0, 1], [1, 0]]
      .map(pt => [x + pt[0], y + pt[1]])
      .filter(pt => this.gameMap[pt[0]] !== undefined && this.gameMap[pt[0]][pt[1]] !== undefined) // remove out of bounds
      .map(pt => this.gameMap[pt[0]][pt[1]] ?? pt); // return either the pawn or coords to an empty cell
  }

  // TODO: boid
  private move() {
    const [x, y] = this.pick(this.nearbyCells);
    console.log(this.boid.id, this.boid.x, this.boid.y, x, y);
    return {
      action: 'MOVE',
      x,
      y
    }
  }

  private setState(gameMap, id, configuration, turn) {
    this.gameMap = gameMap;
    this.configuration = configuration;
    this.turn = turn;
    // my pawns
    this.flock = [];
    for (let i = 0; i < gameMap.length; i++) {
      for (let j = 0; j < gameMap.length; j++) {
        if (gameMap[i][j] && gameMap[i][j].owner === this.playerId) {
          this.flock.push(gameMap[i][j]);
        }
      }
    }
    this.boid = this.flock.find(b => b.id === id);

    // possible targets
    const neighbors = this.neighbors(this.boid.x, this.boid.y);
    this.nearbyPlants = neighbors.filter(p => p && p.type === 'PLANT');
    this.nearbyBoids = neighbors.filter(p => p && p.type === 'SLIME' && p.owner === this.playerId);
    this.nearbyEnemies = neighbors.filter(p => p && p.type === 'SLIME' && p.owner !== this.playerId);

    // possible moves
    this.nearbyCells = neighbors.filter(n => Array.isArray(n));
  }

  private attack() {
    const target = this.pick(this.nearbyEnemies);
    return {
      action: 'BITE',
      x: target.x,
      y: target.y
    };
  }

  private eat() {
    const target = this.pick(this.nearbyPlants);
    return {
      action: 'BITE',
      x: target.x,
      y: target.y
    };
  }

  private shouldSplit() {
    const desiredFlockSize = 6;
    return this.boid.level >= this.configuration.slime.minSplitLevel && this.nearbyCells.length && this.flock.length < desiredFlockSize;
  }

  takeAction(gameMap, id, configuration, turn) {
    this.setState(gameMap, id, configuration, turn);

    if (this.nearbyEnemies.length) {
      return this.attack();
    }

    if (this.nearbyPlants.length) {
      return this.eat();
    }

    if (this.shouldSplit()) {
      return { action: 'SPLIT' };
    }

    if (this.nearbyCells.length) {
      return this.move();
    }

    return { action: 'NOTHING' };
  }
}