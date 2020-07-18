// @ts-nocheck
// author: ikottman
export class EatNSeek {
  playerId;
  gameMap = [];
  configuration;
  turn;
  boid;
  nearbyPlants;
  nearbyEnemies;
  nearbyCells;
  flock;
  enemies;
  plants;
  target;
  pawns;

  static displayName = "Eat n' Seek";
  constructor(playerId) {
    this.playerId = playerId;
  }

  pt(x, y) {
    return {x, y};
  }

  // [min, max]
  randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  // select random from list, undefined if list is empty
  pick(list) {
    return list[this.randomInt(0, list.length - 1)];
  }

  // sort by property
  sort(list, key, ascending = true) {
    const flip = ascending ? 1 : -1;
    return list.concat().sort((a, b) => (a[key] - b[key]) * flip);
  }

  // manhattan distance between pawn or pt
  distance(source, target) {
    return Math.abs(target.x - source.x) + Math.abs(target.y - source.y);
  }

  neighbors(x, y) {
    return [this.pt(-1, 0), this.pt(0, -1), this.pt(0, 1), this.pt(1, 0)]
      .map(cell => this.pt(x + cell.x, y + cell.y))
      .filter(cell => this.gameMap[cell.x] !== undefined && this.gameMap[cell.x][cell.y] !== undefined) // remove out of bounds
      .map(cell => this.gameMap[cell.x][cell.y] || cell); // return either the pawn or coords to an empty cell
  }

  setState(gameMap, id, configuration, turn) {
    this.gameMap = gameMap;
    this.configuration = configuration;
    this.turn = turn;
    this.pawns = this.gameMap.flatMap(p => p).filter(p => p!== null);
    this.flock = this.pawns.filter(p => p.type === 'SLIME' && p.owner === this.playerId);
    this.enemies = this.pawns.filter(p => p.type === 'SLIME' && p.owner !== this.playerId);
    this.plants = this.pawns.filter(p => p.type === 'PLANT');
    this.boid = this.flock.find(b => b.id === id);

    // possible targets
    const neighbors = this.neighbors(this.boid.x, this.boid.y);
    this.nearbyPlants = neighbors.filter(p => p.type === 'PLANT');
    this.nearbyBoids = neighbors.filter(p => p.type === 'SLIME' && p.owner === this.playerId);
    this.nearbyEnemies = neighbors.filter(p => p.type === 'SLIME' && p.owner !== this.playerId);

    // possible moves
    this.nearbyCells = neighbors.filter(cell => cell.type === undefined);

    this.findTarget();
  }

  eating() {
    return this.flock.every(s => s.level < 8);
  }

  findEnemy() {
    // find enemy with highest xp
    return this.enemies.sort((a, b) => b.xp - a.xp)[0];
  }

  findPlant() {
    // closest plant
    return this.closestTo(this.plants, this.boid);
  }

  findTarget() {
    // retain target between rounds until it's gone
    const currentTarget = this.pawns.find(p => this.target && p.id === this.target.id);
    if (currentTarget) {
      // update target's position
      this.target = currentTarget;
      return;
    }

    if (this.eating()) {
      this.target = this.findPlant();
    } else {
      this.target = this.findEnemy();
    }
  }

  attack() {
    // attack weakest first
    const target = this.sort(this.nearbyEnemies, 'hp')[0];
    return {
      action: 'BITE',
      x: target.x,
      y: target.y
    };
  }

  eat() {
    // attack weakest first
    const target = this.sort(this.nearbyPlants, 'hp')[0];
    return {
      action: 'BITE',
      x: target.x,
      y: target.y
    };
  }

  shouldSplit() {
    const desiredFlockSize = 6;
    return this.boid.level >= this.configuration.slime.minSplitLevel && this.nearbyCells.length && this.flock.length < desiredFlockSize;
  }

  closestTo(options, target) {
    return options.sort((a, b) => this.distance(a, target) - this.distance(b, target))[0];
  }

  move() {
    const {x, y} = this.closestTo(this.nearbyCells, this.target);

    return {
      action: 'MOVE',
      x,
      y
    }
  }

  debug() {
    console.group(`turn: ${this.turn}`)
    console.debug(`id: ${this.boid.id}`)
    console.debug(`nearbyCells: ${JSON.stringify(this.nearbyCells, null, 2)}`)
    console.debug(`nearbyPlants: ${JSON.stringify(this.nearbyPlants, null, 2)}`)
    console.debug(`nearbyEnemies: ${JSON.stringify(this.nearbyEnemies, null, 2)}`)
    console.debug(`target: ${JSON.stringify(this.target, null, 2)}`)
    console.groupEnd(`turn: ${this.turn}`)
  }

  takeAction(gameMap, id, configuration, turn) {
    this.setState(gameMap, id, configuration, turn);
    // this.debug();
    if (this.nearbyEnemies.length) {
      return this.attack();
    }

    // level up
    if (this.eating()) {
      if (this.nearbyPlants.length) {
        return this.eat();
      }
      if (this.nearbyCells.length) {
        return this.move();
      }
    }

    // seek and destroy
    if (this.nearbyCells.length) {
      return this.move();
    }
    if (this.nearbyPlants.length) {
      return this.eat();
    }

    return { action: 'NOTHING'};
  }
}