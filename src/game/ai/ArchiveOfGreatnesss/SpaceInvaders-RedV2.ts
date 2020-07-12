// This is Red's first AI code it will move towards the nearest non-friendly object and attempt to eat it

// Code started 07/06/2020
/** This AI code will be called for each slime on the players team. Each time the code is called it will call the "takeAction" method.
 * When "takeAction" method is called the game code will supply the slime's ID and a game map matrix which is a copy of the active gameboard 
 * during the given turn. 
*/

export class SpaceInvaders {    // This line defines the user submited code, the name can be changed freely
  playerId;                     // Do not edit - This is the player ID randomly chosen from 1 or 2
  gameMap = [];                 // Do not edit - This is the game map passed to the player's code
  static displayName = 'Space Invaders V2'; // name to show on screen when fighting this AI
  moveDirection;
  constructor(playerId) {       // This method is called when the player code is called variables can be constructed here
    this.playerId = playerId;   // Do not edit
    this.moveDirection = {};
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

// Determine if the slime should be moving Space Invade style or return to the top, then return x,y of cell to move to
moveToo(activePawn) {
  let xDelta;
  let yDelta;

  const lastCol = this.gameMap.length-1;

  // check if the slime has a "moveDirection" value, if not assign one
  if (!(activePawn.id in this.moveDirection)){
      this.moveDirection[activePawn.id] = 'Space Invade';
  }
  //check if this slime is in the top row if it is set its move up to 0
  if (activePawn.y === 0){
      this.moveDirection[activePawn.id] = 'Space Invade';
  }
  // check if this slime should be going back to the top. If so move up or eat plants in the way
  if (activePawn.y === lastCol && activePawn.x === lastCol){
      this.moveDirection[activePawn.id] = 'Move Up';
  }

  // check if this slimes y corrdinate is even or odd. If its even move/eat right, if odd move/eat left
  if (activePawn.y%2 === 0){
      if(activePawn.x === lastCol){
          xDelta = 0;
          yDelta = 1;
      } else {
          xDelta = 1;
          yDelta = 0;
      }
  } else if(activePawn.x === 0){
      xDelta = 0;
      yDelta = 1;
  } else {
      xDelta = -1;
      yDelta = 0;
  }
     
  if (this.moveDirection[activePawn.id] === 'Move Up'){
      xDelta = 0;
      yDelta = -1;
  }
  
  const x = activePawn.x + xDelta;
  const y = activePawn.y + yDelta;

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

move(activePawn) {
  const [x, y] = this.moveToo(activePawn);
  let action = 'MOVE';
  if (this.gameMap[x][y]) {
    if(this.gameMap[x][y].owner === activePawn.owner){
      action = 'MERGE';
    } else {
      action = 'BITE';
    }
  } else if (this.outOfBounds(x, y)){
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
  const biteableNeighbors = neighbors.filter(pawn => !(pawn.owner === this.playerId));   // Find nearby slimes with a player ID of 2
  const friendlyNeighbors = neighbors.filter(pawn => pawn.owner === this.playerId);   // Find nearby objects that have the same playerID value
  
  // Decision Tree
  /**This AI will move to the left or right depending on if its y value is even or odd. Once it hits a wall it will move down and change
   * direction. It will only eat plants that are in its path but it will eat any near by enemys it can. */
  if (biteableNeighbors.length > 0) {                 // If there are any neighbors near by bite a random one
    const target = biteableNeighbors[this.randomInt(0, biteableNeighbors.length - 1)];
    return {
      action: 'BITE',
      x: target.x,
      y: target.y
    }
  } else if (activePawn.level >= 4 && myPawns.length < 15 && neighbors.length < 4) {// If this pawn is over lvl 4 attempt to split
      return {
        action: 'SPLIT'
      }
  }else {
    return this.move(activePawn);
  }
}
}