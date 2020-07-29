<style>
div {
  margin: 5px;
}

pre {
  font-family: Menlo, Monaco, 'Courier New', monospace;
}

a:link{color:inherit}
a:active{color:inherit}
a:visited{color:inherit}
a:hover{color:inherit}
</style>

<div>
  <h1>Table of Contents</h1>
  <ul>
    <li><a href="#Introduction">Introduction</a></li>
    <li><a href="#Mechanics">Game Mechanics</a></li>
    <li><a href="#Actions">Actions</a></li>
    <li><a href="#Configuration">Configuration</a></li>
  </ul>
  <h1 id='Introduction'><a href='#Introduction'>Introduction</h1>
  <p>
    We made this game to allow us to write and test AI programs. Writers can use the example code to explore making their own AI. As a writer's code advances they should submit it to be tested against other AI. Eventually tournaments will be run between all submissions.
  </p>
  <p>
    The game starts with a randomly generated map. Every turn all slimes take a single action, determined by each AI. The game runs for 1000 turns or until one team loses all of its slimes. At the end of the game the team with the highest score wins.
  </p>
  <p>
    The current game is still being balanced and many of the parameters will likely be changed. Changes will be made in an attempt to balance the system but not destroy certain strategies. If someone figures out a way to win no matter what, through complex AI or an out of the box strategy then good for them.
  </p>

  <h1 id='Mechanics'><a href='#Mechanics'>Game Mechanics</a></h1>

  <h2 id='Turn Order'><a href='#Turn Order'>Turn Order</a></h2>
  <p>
    Player AIs control each individual slime from their team every turn. Each game piece takes one action per turn.
  </p>
  <ul>
    <li>Rocks go first and do nothing.</li>
    <li>Plants go second and follow the steps outlined in <a href="#Game Pieces">Game Pieces</a>.</li>
    <li>Slimes alternate between each team until all slimes have gone.</li>
  </ul>

  <h2 id="Game Pieces"><a href='#Game Pieces'>Game Pieces</a></h2>
  <p>
    There are three types of game piece in this game.
  </p>

  <h3 id='Rocks'><a href='#Rocks'>Rocks</a></h3>
  <p>
    Rocks are only meant to get in the way. They do not move. All rocks have the following attirubtes:
  </p>
  <pre>
{`
  {
    id 1, // unique identifier for this game piece
    x: 0, // column the game piece is in
    y: 0, // row the game piece is in
    type: 'ROCK',
    owner: -1, // owner of this game piece. -1 is reserved for rocks and plants, 1 is player one and 2 is player two
    hp: 90, // current health points. If 0 the game piece dies
    maxHp: 100 // max health this game piece can have at its current level
  }
  `}
  </pre>

  <h3 id='Plants'><a href='#Plants'>Plants</a></h3>
  <p>
    Plants are the food source for the slimes. All plants have the following attributes:
  </p>
  <pre>
{`
  {
    id 1, // unique identifier for this game piece
    x: 0, // column the game piece is in
    y: 0, // row the game piece is in
    type: 'PLANT',
    owner: -1, // owner of this game piece. -1 is reserved for rocks and plants, 1 is player one and 2 is player two
    hp: 20, // current health points. If 0 the game piece dies
    level: 4, // used to calculate the attack and maximum health of the slime
    maxLevel: 12, // max level this game piece can reach
    maxHp: 23 // max health this game piece can have at its current level
  }
  `}
  </pre>
  <p>
    Plants are placed at the beginning of the game at level 1 with a set amount of hp. Every round the plant has a % chance to level up, which increases maxHp and regains some lost hp. Once a plant reaches its maxLevel it will gain the ability to spread seeds. Every round a max level plant has a % chance to spread a seed to one of the 8 squares surrounding it. Successful seeding plants a new level 1 plant in the target square. Plants at maximum level will change color.
  </p>

  <h3 id='Slimes'><a href='#Slimes'>Slimes</a></h3>
  <p>
    Slimes are the game pieces controlled by the submitted AI code and will be used to determine which AI wins a game. Each slime has the following attributes:
  </p>
  <pre>
  {`
  {
    id 1, // unique identifier for this game piece
    x: 0, // column the game piece is in
    y: 0, // row the game piece is in
    type: 'SLIME',
    owner: 1, // owner of this game piece. -1 is reserved for rocks and plants, 1 is player one and 2 is player two
    xp: 23, // current experience. Used to calculate level
    hp: 20, // current health points. If 0 the game piece dies
    level: 4, // used to calculate the attack and maximum health of the slime
    maxLevel: 12, // max level this game piece can reach
    maxHp: 23, // max health this game piece can have at its current level
    attack: 10, // amount of health an opponent loses when this slime bites it
  }
  `}
  </pre>
  <p>
    Slimes are placed at the beginning of the game at level 1. A slime's attack and maxHp increase as they level up. The table below shows the minimum xp for a slime to become each level and the other attributes for that level.
  </p>
  <pre>
xp	level	attack	maxHp
1	1	3	11
2	2	4	13
6	3	7	18
15	4	10	23
33	5	13	31
62	6	16	40
106	7	20	50
169	8	24	61
254	9	29	75
368	10	33	89
513	11	38	105
695	12	43	122
  </pre>
  <p>
    Every turn each slime is given a round to take a single action determined by the submitted AI. Invalid actions and exceptions are ignored, skipping that slime's round. Valid actions are applied immediately, before the next slime's round begins. Note that the game state given to the AI is immutable, so changes are not reflected in the game engine.
  </p>

  <h2 id='Victory'><a href='#Victory'>Victory Conditions</a></h2>
  <p>
    The game will continue until turn 1000 or until one team has 0 slimes. Scores for each team are calculated based on the remaining slimes. This score calculation is based solely on the slimes level not on its total xp. The table below shows a simplified level to score ratio.
  </p>
  <pre>
level	points
1	0.2
2	0.4
3	1.6
4	5.2
5	13.7
6	29.9
7	57.7
8	101.7
9	167.0
10	259.7
11	386.7
12	555.3
  </pre>
  <p>
    The team with the most total points at the end of the game wins.
  </p>

  <h1 id='Actions'><a href='#Actions'>Actions</a></h1>
  <p>
    A Slime can take one of 5 actions each turn: MOVE, BITE, SPLIT, MERGE, or NOTHING.
  </p>

  <h3 id='Move'><a href='#Move'>Move</a></h3>
  <p>
    Move the slime to a nearby cell.
  </p>
  <pre>
  {`
  {
    action: 'MOVE',
    x: 1,
    y: 2
  }
  `}
  </pre>
  <p>
    If the target cell is occupied by another game piece or if the cell is outside of the movement range of the slime then the slime does nothing for its round. A slime can only move a distance of one cell in a cardinal direction (UP, DOWN, LEFT, RIGHT).
  </p>

  <h3 id='Bite'><a href='#Bite'>Bite</a></h3>
  <p>
    Bite a nearby cell.
  </p>
  <pre>
  {`
  {
    action: 'BITE',
    x: 1,
    y: 2
  }
  `}
  </pre>
  <p>
    If there is not a valid game piece in the target cell or if the target cell is outside the slime's attack range then the slime will do nothing for its round. If there is a game piece in the target cell then that game piece will have its hp reduced by the biting slime's attack. If the target was valie the slime gains 1 xp and 1 hp. A slime can only bite a distance of one cell in a cardinal direction (UP, DOWN, LEFT, RIGHT).
  </p>

  <h3 id='Split'><a href='#Split'>Split</a></h3>
  <p>
    Sacrifice xp to split this slime into two.
  </p>
  <pre>
  {`
  {
    action: 'SPLIT'
  }
  `}
  </pre>
  <p>
    To split a slime must be at or above the "Min Level to Split" defined in the game settings. Splitting creates a new slime in a random empty adjacent square. The xp of the original slime is divided by 4 (rounding down) and given to each slime. Both slimes will have one quarter of the original slimes xp and retain the same percentage of health.
  </p>

  <h3 id='Merge'><a href='#Merge'>Merge</a></h3>
  <p>
    Merge two slimes together into one more powerful slime.
  </p>
  <pre>
  {`
  {
    action: 'MERGE'
  }
  `}
  </pre>
  <p>
    This sets a slime as ready to merge. If an adjacent friendly slime is ready to merge it will be destroyed and the initiating slime will gain its xp. At the end of each turn all slimes are set to no longer ready to merge, so you must coordinate merging within a single turn.
  </p>

  <h3 id='Nothing'><a href='#Nothing'>Nothing</a></h3>
  <p>
    A slime can skip its round by taking the NOTHING action.
  </p>
  <pre>
  {`
  {
    action: 'NOTHING'
  }
  `}
  </pre>

  <h1 id="Configuration"><a href='#Configuration'>Game Configuration</a></h1>
  <p>
    On the Game Tab, in the far left column the following settings can be changed between each match.
  </p>

  <h3 id='Player AIs'><a href='#Player AIs'>Player AIs</a></h3>
  <p>
    You can select the AI for player one (red) and player two (blue). The AI you write in the code tab will be included in this list, along with some AI from the game's creators.
  </p>

  <h3 id='Plant Configuration'><a href='#Plant Configuration'>Plant Configuration</a></h3>
  <ul>
    <li>Initial plants: This will determine the number of plants to be placed before the beginning of the match. (These plants are placed randomly with a maximum of 10k attempts).</li>
    <li>Chance to Seed(%): Once a plant has reached max level it will have a chance each turn to randomly place a level 1 plant in one of the adjacent cells. The chance for a plant to successfully seed an empty adjacent cell is set here.</li>
    <li>Chance to Level(%): Each turn a plant that is lower than the maximum plant level will have a chance to level up 1 level. The percent chance for a plant to level up is set here.</li>
    <li>Max Level: This is the maximum level a plant can reach. Once a plant has reached its maximum level it has a chance to seed near by cells each turn. The higher the maximum level the slower the plants will spread but the stronger the plants will become.</li>
  </ul>

  <h3 id='Slime Configuration'><a href='#Slime Configuration'>Slime Configuration</a></h3>
  <ul>
    <li>Initial Slimes: This will determine the number of slimes to be placed before the beginning of the match on each edge of the map. (These slimes are placed randomly on one of the far sides of the map, then an opponent slime is mirrored to the other side).</li>
    <li>Min Level to Split: This will set the minimum level that a slime will be allowed to split. (A good AI will use this configuration setting for its split actions instead of hard coded values).</li>
  </ul>

  <h3 id='Rock Configuration'><a href='#Rock Configuration'>Rock Configuration</a></h3>
  <ul>
    <li>Initial Rocks: This will determine the number of rocks to be placed before the beginning of the match. (These rocks are placed randomly with a maximum of 10k attempts).</li>
    <li>Max HP: This will set the maximum HP of rocks. (This setting will likely be hard coded above 150 hp at some point).</li>
  </ul>
</div>