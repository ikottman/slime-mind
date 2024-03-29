
// author: ikottman
export class EatNSeek {
  playerId;
  gameMap = [];
  configuration;
  turn;
  boid;
  nearbyBoids;
  nearbyPlants;
  nearbyEnemies;
  nearbyCells;
  flock;
  enemies;
  plants;
  target;
  pawns;
  targets;

  static displayName = "Eat n' Seek";
  static author = 'ikottman';
  constructor(playerId) {
    this.playerId = playerId;
  }

  pt(x, y) {
    return {x, y};
  }

  Node(point, distance) {
    const id = this.nodeId(point);
    const {x, y} = point;
    const pawn = point.type ? point : undefined;
    return {id, x, y, pawn, distance, previous: undefined };
  }

  flattenMap() {
    const flat = [];
    for (let i = 0; i < this.gameMap.length; i++) {
      for (let j = 0; j < this.gameMap.length; j++) {
        const current = this.gameMap[i][j];
        flat.push(current ? current : this.pt(i, j));
      }
    }
    return flat;
  }

  nodeId(point) {
    return `${point.x},${point.y}`;
  }

  usePathfinding(target) {
    const cellsAroundTarget = this.neighbors(target).filter(cell => cell.owner !== this.playerId && cell.type !== 'ROCK');
    return this.nearbyCells.length > 1 && // only pathfind if there's multiple choices
           this.distance(this.boid, this.target) <= 10 && // avoid long searches by being naive for far targets
           cellsAroundTarget.length > 0; // if the target is surrounded by rocks or allies, don't pathfind
  }

  // returns point to move to on the shortest path to target
  // or null if it exceeds the max search depth
  pathToTarget(source, target) {
    const nodes = this.flattenMap()
    .filter(cell => cell.owner !== this.playerId && cell.type !== 'ROCK')
    .map(cell => this.Node(cell, Infinity));
    nodes.unshift(this.Node(source, 0)); // a distance of 0 guarantees we'll start the search from the source
    let current;

    const targetId = this.nodeId(target);
    const sourceId = nodes[0].id;
    // until we've seen all cells
    while (nodes.length > 0) {
      // find closest one
      nodes.sort((a, b) => a.distance - b.distance);
      current = nodes.shift();

      // once we find the target we know we have at least one path
      if (current.id === targetId) {
        break;
      }

      // figure out how far each neighbor is from the source
      this.neighborCells(current).forEach(neighbor => {
        const neighborNode = nodes.find(n => n.id === this.nodeId(neighbor));
        if (!neighborNode) {
          // skip nodes we've seen before
          return;
        }

        let cost = current.distance + 1; // all neighbors are 1 away
        cost = cost + this.distance(neighbor, target); // penalize looking at nodes that are far from the target
        cost = neighbor.pawn ? cost + neighbor.pawn.hp : cost; // penalize occupied cells
        if (cost < neighborNode.distance) {
          neighborNode.distance = cost;
          neighborNode.previous = current;
        }
      });
    }

    // walk backwards from target until we find the first step in the shortest path
    while (current.previous !== undefined && current.previous.id !== sourceId) {
      current = current.previous
    }
    return current;
  }

  // [min, max]
  randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
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

  // return point or pawn that is one cardinal direction away from the given point
  neighbors(point) {
    // return either the pawn or coords to an empty cell
    return this.neighborCells(point).map(cell => this.gameMap[cell.x][cell.y] || cell);
  }

  neighborCells(point) {
    return [this.pt(-1, 0), this.pt(0, -1), this.pt(0, 1), this.pt(1, 0)]
      .map(cell => this.pt(point.x + cell.x, point.y + cell.y))
      .filter(cell => this.gameMap[cell.x] !== undefined && this.gameMap[cell.x][cell.y] !== undefined); // remove out of bounds
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
    const neighbors = this.neighbors(this.boid);
    this.nearbyPlants = neighbors.filter(p => p.type === 'PLANT');
    this.nearbyBoids = neighbors.filter(p => p.type === 'SLIME' && p.owner === this.playerId);
    this.nearbyEnemies = neighbors.filter(p => p.type === 'SLIME' && p.owner !== this.playerId);
    this.findTarget();

    // possible moves
    this.nearbyCells = neighbors.filter(cell => cell.type === undefined);
  }

  eating() {
    return this.flock.every(s => s.level < 8) && this.plants.length;
  }

  findEnemy() {
    // find enemy with highest xp
    //return this.enemies.sort((a, b) => b.xp - a.xp)[0];
    // find enemy with lowest hp
    return this.enemies.sort((a, b) => a.hp - b.hp)[0];
  }

  findPlant() {
    // closest plant
    return this.closestTo(this.plants, this.boid);
  }

  findTarget() {
    const retainTarget = false; // turned off for now
    // retain target between rounds until it's gone
    const currentTarget = this.pawns.find(p => this.target && p.id === this.target.id);

    if (currentTarget && retainTarget) {
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

  closestTo(options, target) {
    return options.sort((a, b) => this.distance(a, target) - this.distance(b, target))[0];
  }

  validMove(path) {
    // if staying still is the closest option then don't move.
    // NOTE: this is an optimization, it is important for the naive pathfinding so we don't get stuck
    // vibrating left and right when our path is blocked, but it reduces the effectiveness of our real
    // pathfinding since we will never take paths that require backtracking.
    return path && !path.pawn && !(this.boid.x === path.x && this.boid.y === path.y);
  }

  move() {
    let path;
    // default to naive pathfinding if the pathToTarget fails or its too far
    if (this.usePathfinding(this.target)) {
      path = this.pathToTarget(this.boid, this.target);
    } else {
      // include ourselves to make sure moving is actually closer
      path = this.closestTo([this.pt(this.boid.x, this.boid.y), ...this.nearbyCells], this.target);
    }

    // if we want to stay in our current spot or pathfinding fail
    if (!this.validMove(path)) {
      return { action: 'NOTHING' };
    }

    return {
      action: 'MOVE',
      x: path.x,
      y: path.y,
    };
  }

  debug() {
    console.group(`turn: ${this.turn}`);
    console.debug(`id: ${this.boid.id}`);
    console.debug(`nearbyCells: ${JSON.stringify(this.nearbyCells, null, 2)}`);
    console.debug(`nearbyPlants: ${JSON.stringify(this.nearbyPlants, null, 2)}`);
    console.debug(`nearbyEnemies: ${JSON.stringify(this.nearbyEnemies, null, 2)}`);
    console.debug(`target: ${JSON.stringify(this.target, null, 2)}`);
    console.groupEnd();
  }

  takeAction(gameMap, id, configuration, turn) {
    this.setState(gameMap, id, configuration, turn);
    // this.debug();
    if (this.nearbyEnemies.length) {
      return this.attack();
    }

    // leveling up
    if (this.nearbyPlants.length) {
      return this.eat();
    }
    if (this.nearbyCells.length) {
      return this.move();
    }

    return { action: 'NOTHING'};
  }
}