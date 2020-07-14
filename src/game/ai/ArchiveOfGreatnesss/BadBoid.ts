// @ts-nocheck
class pt {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}
export class BadBoid {
  private playerId;
  private gameMap = [];
  private configuration;
  private turn;
  private boid;
  private nearbyPlants;
  private nearbyEnemies;
  private nearbyCells;
  private flock;
  private enemies;

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

  // manhattan distance between pawn or pt
  private distance(source, target) {
    return Math.abs(target.x - source.x) + Math.abs(target.y - source.y);
  }

  private neighbors(x, y) {
    return [new pt(-1, 0), new pt(0, -1), new pt(0, 1), new pt(1, 0)]
      .map(cell => new pt(x + cell.x, y + cell.y))
      .filter(cell => this.gameMap[cell.x] !== undefined && this.gameMap[cell.x][cell.y] !== undefined) // remove out of bounds
      .map(cell => this.gameMap[cell.x][cell.y] || cell); // return either the pawn or coords to an empty cell
  }

  private setState(gameMap, id, configuration, turn) {
    this.gameMap = gameMap;
    this.configuration = configuration;
    this.turn = turn;
    this.flock = [];
    this.enemies = [];
    for (let i = 0; i < gameMap.length; i++) {
      for (let j = 0; j < gameMap.length; j++) {
        if (gameMap[i][j] && gameMap[i][j].owner === this.playerId) {
          this.flock.push(gameMap[i][j]);
        } else if (gameMap[i][j] && gameMap[i][j].owner !== this.playerId) {
          this.enemies.push(gameMap[i][j])
        }
      }
    }
    this.boid = this.flock.find(b => b.id === id);
    this.flock = this.flock.filter(b => b.id !== id); // remove me from flock

    // possible targets
    const neighbors = this.neighbors(this.boid.x, this.boid.y);

    this.nearbyPlants = neighbors.filter(p => p.type === 'PLANT');
    this.nearbyBoids = neighbors.filter(p => p.type === 'SLIME' && p.owner === this.playerId);
    this.nearbyEnemies = neighbors.filter(p => p.type === 'SLIME' && p.owner !== this.playerId);

    // possible moves
    this.nearbyCells = neighbors.filter(cell => cell instanceof pt);
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

  private centerOfFlock() {
    // average cell in the flock
    const totalPoint = this.flock.reduce((acc, boid) => {
      return new pt(acc.x + boid.x, acc.y + boid.y);
    }, new pt(0, 0));
    return new pt(Math.floor(totalPoint.x / this.flock.length), Math.floor(totalPoint.y / this.flock.length));
  }

  private pointNearestTarget(options, target) {
    // naively find the point that is closest to the target
    return options.sort((a, b) => this.distance(a, target) - this.distance(b, target))[0];
  }

  private tooCloseToOtherBoid(point) {
    const minCellsApart = 3;
    return this.flock.some(b => this.distance(b, point) <= minCellsApart);
  }

  // boid movement
  private move() {
    let point = this.pointNearestTarget(this.nearbyCells, this.centerOfFlock());

    // avoid other boids
    if (this.tooCloseToOtherBoid(point)) {
      const nearestEnemy = this.pointNearestTarget(this.enemies, this.boid);
      point = this.pointNearestTarget(this.nearbyCells, nearestEnemy);
    }

    return {
      action: 'MOVE',
      x: point.x,
      y: point.y
    }
  }

  debug() {
    console.group();
    console.debug(`turn: ${this.turn}`)
    console.debug(`id: ${this.boid.id}`)
    console.debug(`nearbyCells: ${this.nearbyCells}`)
    console.debug(`nearbyPlants: ${this.nearbyPlants}`)
    console.debug(`nearbyEnemies: ${this.nearbyEnemies}`)
    console.groupEnd();
  }

  takeAction(gameMap, id, configuration, turn) {
    this.setState(gameMap, id, configuration, turn);
    //this.debug();
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

    return { action: 'NOTHING'};
  }
}