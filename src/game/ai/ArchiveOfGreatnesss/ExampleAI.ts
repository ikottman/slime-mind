// This code will attempt to outline the most basic player AI code that has all possible commands shown

// Code started 07/01/2020
/** This AI code will be called for each slime on the players team. Each time the code is called it will call the "takeAction" method.
 * When "takeAction" method is called the game code will supply the slime's ID and a map matrix which is a copy of the active gameboard 
 * during the given turn. 
*/

export class ExampleAI {  // This line defines the user submited code, the name can be changed freely
    playerId;             // Do not edit - This is the player ID randomly chosen from 1 or 2
    gameMap = [];         // Do not edit - This is the game map passed to the player's code
    configuration;        // Do not edit - This is the configuration details for the current match passed to the player's code
    turn;                 // Do not edit - This is the current turn passed to the player's code
    static displayName = 'Example AI'; // name to show on screen when fighting this AI
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
      return options.filter(pt => !this.invalidMove(x + pt[0], y + pt[1])).map(pt => [x + pt[0], y + pt[1]]);
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
        const movementOptions = [-1,1];
        const xOrY = this.randomInt(0, 1);
        let x = 0;
        let y = 0;
        if(xOrY === 1){
          x = movementOptions[this.randomInt(0, 1)];
          y = 0;
        } else{
          y = movementOptions[this.randomInt(0, 1)];
          x = 0;
        }
        return [x, y];
      }
  
    findValidMove(pawn) {
      // brute force finding a valid move with max attempts
      let [x, y] = [pawn.x, pawn.y];
      let tries = 0;
      do {
        let [xDelta, yDelta] = this.randomMove();
        x = pawn.x + xDelta;
        y = pawn.y + yDelta;
        tries++;
      }
      while (this.invalidMove(x, y) && tries < 100);
      return [x, y];
    }
  
    move(pawn) {
      const [x, y] = this.findValidMove(pawn);
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
    takeAction(gameMap, id, configuration, turn) {         // Do not edit - Game code will pass the current slime pawn's id and a game map matrix
      this.gameMap = gameMap;         // Loads the current game map for this turn
      
      // This is a custom section of code that is not required for this to be a valid player AI
      /** This code will loop through the map object and find all slimes with a player ID that matches the current playerID and when it finds a
      slime for the current player it will store a copy of that object in the myPawns array*/ 
      const myPawns = [];
      for (let i = 0; i < gameMap.length; i++) {
        for (let j = 0; j < gameMap.length; j++) {
          if (gameMap[i][j] && gameMap[i][j].owner === this.playerId) {
            myPawns.push(gameMap[i][j]);
          }
        }
      }
  
      const pawn = myPawns.find(p => p.id === id);        // Defines the slimes with the active turn as "pawn"
      const neighbors = this.neighbors(pawn.x, pawn.y);   // Define an array of all objects around this slime
      const biteableNeighbors = 
        neighbors
        .filter(pawn => !(pawn.owner === this.playerId))      // Find nearby pawns without the same player ID
      const friendlyNeighbors = neighbors.filter(pawn => pawn.owner === this.playerId);   // Find nearby objects that have the same playerID value
      if (friendlyNeighbors.length > 0) {                 // Merge with any nearby slimes
        return {
          action: 'MERGE'
        }
      } else if (biteableNeighbors.length > 0) {                  // If there are any neighbors near by bite a random one
        const target = biteableNeighbors[this.randomInt(0, neighbors.length - 1)];
        return {
          action: 'BITE',
          x: target.x,
          y: target.y
        }
      } else if (pawn.level >= 4) {                         // If this pawn is over lvl 4 attempt to split
        return {
          action: 'SPLIT'
        }
      } else {                                            // Move this pawn using the .move method defined above
        return this.move(pawn);
      }
    }
  }