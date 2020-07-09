// This is Red's first AI code it will move towards the nearest non-friendly object and attempt to eat it

// Code started 07/06/2020
/** This AI code will be called for each slime on the players team. Each time the code is called it will call the "takeAction" method.
 * When "takeAction" method is called the game code will supply the slime's ID and a game map matrix which is a copy of the active gameboard 
 * during the given turn. 
*/

class RedV1SimpleMove {         // This line defines the user submited code, the name can be changed freely
  playerId;                     // Do not edit - This is the player ID randomly chosen from 1 or 2
  gameMap = [];                 // Do not edit - This is the game map passed to the player's code
  constructor(playerId) {       // Do not edit - This method is called when the player code is called, it will asign the player ID
    this.playerId = playerId;
  }

  // Generatea a random number in the given range, inclusive [min, max]
  randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  // find all empty cells surrounding the given location
  emptyNeighbors(x, y) {
    const options = [[-1, 0], [0, -1], [0, 1], [1, 0]];
    return options
      .filter(pt => !this.invalidMove(x + pt[0], y + pt[1]))
      .map(pt => [x + pt[0], y + pt[1]]);
  }

  // find all surrounding cells from given location
  neighbors(x, y) {
    const options = [[-1, 0], [0, -1], [0, 1], [1, 0]];
    return options
      .filter(pt => !this.outOfBounds(x + pt[0], y + pt[1]))
      .map(pt => this.gameMap[x + pt[0]][y + pt[1]])
      .filter(pawn => pawn !== null);
  }

  // determine if the given location is out of bounds or occupide
  invalidMove(x, y) {
    return this.outOfBounds(x, y) || this.gameMap[x][y];
  }

  // determine if the given location if out of bounds of the game map
  outOfBounds(x, y) {
    return x < 0 || y < 0 || x >= 25 || y >= 25;
  }

  // This movement code randomly selects a delta x and delta y then checks if the corresponding cell is a valid move location
    // random x, y both in range [-1, 1]
  
    randomMove() {
    const x = this.randomInt(-1, 1);
    const y = this.randomInt(-1, 1);
    return [x, y];
  }

  moveToo(pawn,target) {
    // check first the x then the y direction for a valid move towards the target
    let xDelta;
    let yDelta;
    if(Math.abs(pawn.x-target.x)>0){
      yDelta = 0;
      if(pawn.x-target.x > 0){
        xDelta = -1;
      } else {
        xDelta = 1;
      }
    }else {
      xDelta = 0;
      if(pawn.y-target.y > 0){
        yDelta = -1;
      } else {
        yDelta = 1;
      }
    }
    let [x, y] = [pawn.x, pawn.y];
    x = pawn.x + xDelta;
    y = pawn.y + yDelta;

    return [x, y];
  }

  findPawns(){
    const allPawns=[]
    for (let i = 0; i < this.gameMap.length; i++) {
      for (let j = 0; j < this.gameMap[0].length; j++) {
        if (this.gameMap[i][j] && this.gameMap[i][j].owner) {
          allPawns.push(this.gameMap[i][j]);
        }
      }
    }
    return (allPawns)
  }

  findTarget(enemyPawns,allPlants){   // Return the closest plant or slime
    let target;
    let targetDistance = 100000;
    for (let i = 0; i < enemyPawns.length; i++){
      const distance = enemyPawns[i].x + enemyPawns[i].y;
      if (distance < targetDistance){
        targetDistance = enemyPawns[i].x + enemyPawns[i].y;
        target = enemyPawns[i];
      }
    }
    for (let i = 0; i < allPlants.length; i++){
      const distance = allPlants[i].x + allPlants[i].y;
      if (distance < targetDistance){
        targetDistance = allPlants[i].x + allPlants[i].y;
        target = allPlants[i];
      }
    }
    return target
  }

  move(pawn,target) {
    const [x, y] = this.moveToo(pawn,target);
    let action = 'MOVE';
    if (this.invalidMove(x, y)) {
      action = 'NOTHING';
    }

    return {
      action,
      x,
      y
    }
  }

  // This is the method for the player code that the game code will call, all player code actions must come from this method to be useable in game
  takeAction(gameMap, id) {         // Do not edit - Game code will pass the current slime pawn's id and a game map matrix
    this.gameMap = gameMap;         // Loads the current game map for this turn
    // This is a custom section of code that is not required for this to be a valid player AI

    // Create arrays for each type of pawn
    const allPawns = this.findPawns();
    const myPawns = allPawns.filter(pawn => pawn.owner === this.playerId);
    const enemyPawns = allPawns.filter(pawn => pawn.owner !== this.playerId && pawn.type === 'SLIME');
    const allPlants = allPawns.filter(pawn => pawn.owner !== this.playerId && pawn.type === 'PLANT');
    // Look at the active pawn and its immedieate surroundings
    const activePawn = myPawns.find(p => p.id === id);              // Defines the slimes with the active turn as "pawn"
    const neighbors = this.neighbors(activePawn.x, activePawn.y);   // Define an array of all objects around this slime
    const biteableNeighbors = neighbors.filter(pawn => pawn.owner !== this.playerId);   // Find nearby objects that have different playerID values
    const friendlyNeighbors = neighbors.filter(pawn => pawn.owner === this.playerId);   // Find nearby objects that have the same playerID value
    
    // Decision Tree
    /**This AI uses a basic move sideways then up/down motion. It will first bite surrounding plants or enemy slimes. Then it will
     * move to the nearest plant or enemy slime. If a slimes level reaches 4 it will split. */
    if (biteableNeighbors.length > 0) {                     // If there are any neighbors near by bite a random one
      const target = biteableNeighbors[this.randomInt(0, biteableNeighbors.length - 1)];
      return {
        action: 'BITE',
        x: target.x,
        y: target.y
      }
    } else if (activePawn.level >= 4) {                     // If this pawn is over lvl 4 attempt to split
      return {
        action: 'SPLIT'
      }
    } else { 
      const target = this.findTarget(enemyPawns,allPlants)       // Move this pawn using the .move method defined above
      return this.move(activePawn,target);
    }
  }
}