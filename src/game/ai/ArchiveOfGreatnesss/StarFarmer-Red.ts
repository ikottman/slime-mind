// This is Red's first AI code it will move towards the nearest non-friendly object and attempt to eat it
// Code started 07/06/2020
/** This AI code will be called for each slime on the players team. Each time the code is called it will call the "takeAction" method.
 * When "takeAction" method is called the game code will supply the slime's ID and a game map matrix which is a copy of the active gameboard
 * during the given turn.
 *
 * This AI will use a sited A* to find and eat trees. Then it will split into a minimum number of slimes and collect as much xp as
 * possible. At the end of the game then it will try and combine as many kings as possible then attack enemies.
*/

export class StarFarmer {              // This line defines the user submited code, the name can be changed freely
  playerId;                     // Do not edit - This is the player ID randomly chosen from 1 or 2
  gameMap = [];                 // Do not edit - This is the game map passed to the player's code
  configuration;                // Do not edit - This is the configuration details for the current match passed to the player's code
  turn;                         // Do not edit - This is the current turn passed to the player's code
  static displayName = "Star Farmer";
  constructor(playerId) {       // Do not edit - This method is called when the player code is called, it will asign the player ID
    this.playerId = playerId;
  }

  // Generatea a random number in the given range, inclusive [min, max]
  randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  // find all surrounding cells from given location
  checkSurroundings(x, y) {
    const options = [[-1, 0], [0, -1], [0, 1], [1, 0]];
    const validOptions = options.filter(pt => !this.outOfBounds(x + pt[0], y + pt[1]))
    let neighbors = [];
    let emptyNeighbors = [];
    for (let i  = 0; i < validOptions.length; i++){
      const opX = x+validOptions[i][0];
      const opY = y+validOptions[i][1];
      if(this.gameMap[opX][opY]){
          neighbors.push(this.gameMap[opX][opY]);
      } else{
          emptyNeighbors.push(this.gameMap[opX][opY]);
      }
    }
    return [neighbors, emptyNeighbors]
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
  retraceSteps(current_square){
    let square_return = current_square;

    while (current_square['parent'] !== 'Start'){
      square_return = current_square;
      current_square = current_square['parent'];
    }
    return square_return
  }

  // Retrun the direction to move to the target
  a_star(pawn, target){

    //possible_squares.forEach(ps => console.log(JSON.stringify(ps, null, 2));
    //console.log('starting point =',pawn.x, pawn.y)
    //console.log('target =',target)

    //Tweak these to limit calculation time
    const max_iterations=10;
    const max_steps = 5;
    let iterations = 0;

    // Create lists to hold squares to be checked, and list to hold previously checked squares and relevant parameters
    // TODO figure out how to clean out these values, they seem to have data after inital setup :(
    const possible_squares = [];
    const checked_squares =[];

    //Add starting square to list to be checked
    possible_squares[0]={
      x: pawn.x,
      y: pawn.y,
      distance: (pawn.x-target.x)**2+(pawn.y-target.y)**2,
      cost:0,
      score: 0,
      parent: 'Start',
    };

    possible_squares[0]['score'] = possible_squares[0]['distance']+possible_squares[0]['cost']

    let current_score = possible_squares[0]['score'];
    let current_distance = possible_squares[0]['distance'];

    const dx = [0, 1, 0, -1];
    const dy = [1, 0, -1, 0];

    // While there are still squares to check
    while(possible_squares.length>0){

      iterations++
      //console.log('Iteration =',iterations)

      // Grab the first square of the possilbe list
      let current_square = possible_squares[0];
      let current_index = 0;
      current_score = current_square['score']
      current_distance = current_square['distance']

      // Check the possible list for a square with a lower score
      for(let i = 0; i < possible_squares.length; i++){
        if (possible_squares[i]['score'] < current_score){
          current_square = possible_squares[i];
          current_index = i;
          current_score = current_square['score'];
          current_distance = current_square['distance'];
        }
      }

      //console.log('distance to target =',current_distance)

      // Check if the current square has a distance of 0
      if(current_distance <= 1){
        let square_return = this.retraceSteps(current_square)
        return [square_return['x'], square_return['y']]
      }

      // Pop current off open list, add to closed list
      possible_squares.splice(current_index,1);
      checked_squares.push(current_square);

      // If the current_square is the target square then return the first command to get to it
      if (target.x == current_square['x'] && target.y == current_square['y']){
        let square_return = this.retraceSteps(current_square)
        return [square_return['x'], square_return['y']]
      }

      // If the cost of the current square is over the max_steps exit
      if (current_square['cost'] > max_steps){
        let square_return = this.retraceSteps(current_square)
        return [square_return['x'], square_return['y']]
      }

      // Cycle through near by squares for possible children
      let children = [];
      let child;

      for(let i = 0; i < dx.length; i++){
        let opX = current_square['x']+dx[i];
        let opY = current_square['y']+dy[i];

        if (!this.outOfBounds(opX, opY)){
          if(!this.gameMap[opX][opY]){
            child={
              x: opX,
              y: opY,
              distance: (opX-target.x)**2 + (opY-target.y)**2,
              cost: current_square['cost']+1,
              score: 0,
              parent: current_square,
            };

            child['score'] = child['distance']+child['cost'];
            children.push(child)
          }
        }
      }

      // Loop through children
      for(let i = 0; i < children.length; i++){

        // Child is on the closed list
        for(let j = 0; j < checked_squares.length; j++){
          if (
            children[i]['x'] === checked_squares[j]['x'] &&
            children[i]['y'] === checked_squares[j]['y']
            ){
            continue
          }
        }

        // Child is already in the open list
        for(let j = 0; j < possible_squares.length; j++){
          if(
            children[i]['x'] === possible_squares[j]['x'] &&
            children[i]['y'] === possible_squares[j]['y'] &&
            children[i]['score'] > current_square['score']
            ){
            continue
          }
        }
        // Add the child to the open list
        possible_squares.push(children[i])
      }

      // Check if the current path has taken more than the maximum number of iterations
      if(iterations > max_iterations){
        let square_return = this.retraceSteps(current_square)
        return [square_return['x'], square_return['y']]
      }

      // Check if the current path is longer than the max number of steps
      if(current_square['cost'] > max_steps){
        let square_return = this.retraceSteps(current_square)
        return [square_return['x'], square_return['y']]
      }
    }
  }

  /** This is the primary movment method it will take the active pawn
    * and target location and return the proper move command. */
  move(pawn,target) {
    //Find the step that follows the fastest un-obstructed path
    const [x, y] = this.a_star(pawn,target);
    //console.log('Astar return =', x, y)
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

  // Returns an array of all pawns on the gameMap
  findPawns(){
    const allPawns=[]
    for (let i = 0; i < this.gameMap.length; i++) {
      for (let j = 0; j < this.gameMap[0].length; j++) {
        if (this.gameMap[i][j]) {
          allPawns.push(this.gameMap[i][j]);
        }
      }
    }
    return (allPawns)
  }

  findFood(activePawn,enemyPawns,allPlants){   // Return the closest plant or slime enemy slime
    let target;
    let targetDistance = 10000000;

    for (let i = 0; i < allPlants.length; i++){
      const distance = (allPlants[i].x-activePawn.x)**2 + (allPlants[i].y-activePawn.y)**2;
      if (distance < targetDistance && allPlants.length > 8){
        targetDistance = distance;
        target = allPlants[i];
      }
    }

    for (let i = 0; i < enemyPawns.length; i++){
      const distance = (enemyPawns[i].x-activePawn.x)**2 + (enemyPawns[i].y-activePawn.y)**2;
      if (distance*2 < targetDistance){
        targetDistance = distance;
        target = enemyPawns[i];
      }
    }

    return target
  }

  findMergeable(activePawn,myPawns){ // Find and return the nearest freindly slime of approipriate conditions
    console.log('in find merge')
    // remove active pawn from myPawns list
    const otherPawns = myPawns.filter(pawn => pawn.id !== activePawn.id)

    console.log(otherPawns)

    let target;
    let targetDistance = 10000000;

    target = otherPawns[0];

    for (let i = 0; i < otherPawns.length; i++){
      const distance = (otherPawns[i].x-activePawn.x)**2 + (otherPawns[i].y-activePawn.y)**2;
      if (
        distance < targetDistance &&
        otherPawns[i].level <= 10
        ){
        targetDistance = distance;
        target = otherPawns[i];
      }
    }

    return target
  }


  // This is the method for the player code that the game code will call, all player code actions must come from this method to be useable in game
  takeAction(gameMap, id, configuration, turn) {         // Do not edit - Game code will pass the current slime pawn's id and a game map matrix
    this.gameMap = gameMap;         // Loads the current game map for this turn
    // This is a custom section of code that is not required for this to be a valid player AI

    // Create arrays for each type of pawn
    const allPawns = this.findPawns();
    const myPawns = allPawns.filter(pawn => pawn.owner === this.playerId);
    const enemyPawns = allPawns.filter(pawn => pawn.owner !== this.playerId && pawn.type === 'SLIME');
    const allPlants = allPawns.filter(pawn => pawn.owner !== this.playerId && pawn.type === 'PLANT');
    // Look at the active pawn and its immedieate surroundings
    const activePawn = myPawns.find(p => p.id === id);              // Defines the slimes with the active turn as "pawn"
    let neighbors = [];   // Define an array of all objects around this slime
    let emptyNeighbors = [];
    [neighbors, emptyNeighbors] = this.checkSurroundings(activePawn.x,activePawn.y);
    //console.log('neighbors')
    //console.log(neighbors)
    const biteableNeighbors =
    neighbors
    .filter(pawn => !(pawn.owner === this.playerId))              // Find nearby pawns without the same player ID
    .filter(pawn => !(pawn.type === 'ROCK'));                     // Remove rocks from this list
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
    } else if(turn <= 400 && allPlants.length > 15){
      if (activePawn.level >= 4 && myPawns.length < 6 && allPlants.length >= 10) {       // If this pawn is over lvl 4 attempt to split
        return {
          action: 'SPLIT'
        }
      } else {
        const target = this.findFood(activePawn,enemyPawns,allPlants)       // Move this pawn using the move method defined above
        return this.move(activePawn,target);
      }
    } else {
        if(myPawns.length > 1 && activePawn.level <= 10){
          const target = this.findMergeable(activePawn,myPawns)
          if((target.x-activePawn.x)**2+(target.y-activePawn.y)**2 > 1){
            return this.move(activePawn,target);
          } else {
            return{
              action: 'MERGE'
            }
          }
        } else {
          const target = this.findFood(activePawn,enemyPawns,allPlants)       // Move this pawn using the move method defined above
          return this.move(activePawn,target);
        }
    }






  }
}