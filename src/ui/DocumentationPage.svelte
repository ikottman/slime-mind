<style>
div {
  margin: 5px;
}
</style>

<div>
  <h1>Introduction</h1>
  <p>
    We made this game to allow us to write and test AI programs. Writers can use the example code to explore making their own AI. As a writer's code advances they should submit it to be tested against other AI. Eventually tournaments will be run between all submissions.
  </p>
  <p>
    The current game is still being balanced and many of the parameters will likely be changed. Changes will be made in an attempt to balance the system but not destroy certain strategies. If someone figures out a way to win no matter what, through complex AI or an out of the box strategy then good for them.
  </p>

  <h1>How the game is played</h1>
  <p>
    This game is played in the browser and begins once the play button is hit. The game starts with a map laid out in a random process determined by the gamed configuration settings. Then each team of slimes takes alternating rounds following their teams AI. A slime can move, bite, merge, or split within given limitations. The game will run for 1000 turns or until one team loses all of its slimes. At the end of the game the team with the highest score wins.
  </p>

  <p>
    The game starts when the play button is hit, but can be paused or reset by clicking the corresponding buttons. The speed a game plays is adjusted by using the game speed slider.
  </p>

  <h1>Game Configuration</h1>
  <p>
    On the Game Tab, in the far left column the following settings can be changed between each match.
  </p>

  <h3>Player AIs</h3>
  <p>
    You can select the AI for player one (red) and player two (blue). The AI you write in the code tab will be included in this list, along with some AI from the game's creators.
  </p>

  <h3>Plant Configuration</h3>
  <ul>
    <li>Initial plants: This will determine the number of plants to be placed before the beginning of the match. (These plants are placed randomly with a maximum of 10k attempts).</li>
    <li>Chance to Seed(%): Once a plant has reached max level it will have a chance each turn to randomly place a level 1 plant in one of the adjacent cells. The chance for a plant to successfully seed an empty adjacent cell is set here.</li>
    <li>Chance to Level(%): Each turn a plant that is lower than the maximum plant level will have a chance to level up 1 level. The percent chance for a plant to level up is set here.</li>
    <li>Max Level: This is the maximum level a plant can reach. Once a plant has reached its maximum level it has a chance to seed near by cells each turn. The higher the maximum level the slower the plants will spread but the stronger the plants will become.</li>
  </ul>

  <h3>Slime Configuration</h3>
  <ul>
    <li>Initial Slimes: This will determine the number of slimes to be placed before the beginning of the match on each edge of the map. (These slimes are placed randomly on one of the far sides of the map, then an opponent slime is mirrored to the other side).</li>
    <li>Min Level to Split: This will set the minimum level that a slime will be allowed to split. (A good AI will use this configuration setting for its split commands instead of hard coded values).</li>
  </ul>

  <h3>Rock Configuration</h3>
  <ul>
    <li>Initial Rocks: This will determine the number of rocks to be placed before the beginning of the match. (These rocks are placed randomly with a maximum of 10k attempts).</li>
    <li>Max HP: This will set the maximum HP of rocks. (This setting will likely be hard coded above 150 hp at some point).</li>
  </ul>

  <h2>Players Code</h2>

  <h1>Game Mechanics</h1>

  <h2>Turns</h2>
  <p>
    Player AIs control each individual slime from their team every turn. Each game piece takes one action per turn.
  </p>
  <ul>
    <li>Rocks go first and do nothing.</li>
    <li>Plants go second and follow the steps outlined in <a href="#Game Pieces">Game Pieces</a>.</li>
    <li>Slimes alternate between each team until all slimes have gone.</li>
  </ul>

  <h2 id="Game Pieces">Game Pieces</h2>
  <p>
    There are three types of game piece in this game. All of them are given the following attributes:
  </p>
  <pre>
x - This is the column index of the game piece (starting from 0)
y - This is the row index of the game piece (starting from 0)
  </pre>

  <h3>Rocks</h3>
  <p>
    Rocks are only meant to get in the way. They are placed at the beginning of the game and cannot be moved or destroyed.
  </p>

  <h3>Plants</h3>
  <p>
    Plants are the food source for the slimes. All plants have the following attributes:
  </p>
  <pre>
max_level - This is the highest level a plant can reach.
level - Used to calculate the maximum health of the plant.
max_hp - This is the most health a plant can have.
current_hp - This is the current health of a plant.
  </pre>
  <p>
    Plants are placed at the beginning of the game at level 1 with a set amount of health. Every round the plant has a % chance to level up, which increases maximum health and regains some lost health. Once a plant reaches its maximum level it will gain the ability to spread seeds. Every round a max level plant has a % chance to spread a seed to one of the 8 squares surrounding it. Successful seeding plants a new level 1 plant in the target square. Plants at maximum level will change color in the visualizer.
  </p>

  <h3>Slimes</h3>
  <p>
    Slimes are the gamepieces controlled by the submitted AI code and will be used to determine which AI wins a game. Each slime has the following attributes:
  </p>
  <pre>
xp - Used to calculate the level of a slime.
max_level - This is the highest level a slime can reach.
level - Used to calculate the attack and maximum health of the slime.
maximum_hp - This is the most health a slime can have.
current_hp - This is the current health of a slime.
attack - This is the amount of health a slime or plant will lose when this slime bites it.
  </pre>
  <p>
    Slimes are placed at the beginning of the game at level 1. A slime's attack and maximum HP increase as they level up. The table below shows the minimum XP for a slime to become each level and the other attributes for that level.
  </p>
  <pre>
xp	level	attack	max_hp
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
    Every turn each slime is given a round to take a single action determined by the submitted AI. Invalid commands, errors, and AI that exceed a set timeout are ignored, skipping that slime's round. Valid commands are applied immediately, before the next slime's round begins. Note that the game state given to the AI is immutable, so changes are not reflected in the game engine.
  </p>

  <h1>Commands</h1>
  <p>
    There are only 4 acceptable commands that a slime can accept. They are:
  </p>
  <pre>
[MOVE, X, Y]
[BITE, X, Y]
SPLIT
MERGE
  </pre>

  <h3>Move Command</h3>
  <p>
    The move command:
  </p>
  <pre>
  [MOVE, X, Y]
  </pre>
  <p>
    Move commands attempt to move the slime to the given (X,Y) cell on the map. If the target cell is occupied by another gamepiece or if the cell is outside of the movement range of the slime then the command will fail. A slime can only move a distance of one cell in a cardinal direction (UP, DOWN, LEFT, RIGHT).
  </p>

  <h3>Bite Commands</h3>
  <p>
    The bite command:
  </p>
  <pre>
    [BITE, X, Y]
  </pre>
  <p>
    Bite commands attempt to attack nearby gamepieces in a particular (X,Y) cell on the map. If there is not a valid gamepiece in the target cell or if the target cell is outside the slime's attack range then the slime will do nothing for its round. If there is a gamepiece in the target cell then that gamepiece will have its `current_health` reduced by the biting slime's `attack`. If the biting slime attacks an enemy slime or plant the attacking slime will also have its `current_hp` increased by 1 and its `xp` increased by 1.
  </p>

  <h3>Split Command</h3>
  <p>
    The split command available to slimes is:
  </p>
  <pre>
  SPLIT
  </pre>
  <p>
    To split a slime must be at a level higher than the "Minimum Split Level" defined in the game settings. Splitting creates a new level slime in a random empty adjacent square. The `xp` of the splitting slime is divided by 4 (rounding down) and given to each slime.
  </p>

  <h3>Merge Commands</h3>
  <p>
    The merge command available to slimes is:
  </p>
  <pre>
    MERGE
  </pre>
  <p>
    This sets a slime as ready to merge. If an adjacent friendly slime is ready to merge it will be destroyed and the initiating slime will gain its `xp`. Every turn all slimes are set to no longer ready to merge, so you must coordinate merging within a single turn.
  </p>

  <h1>Victory conditions</h1>
  <p>
    The game will continue until turn 1000 or until one team has 0 slimes. Scores for each team are calculated based on the remaining slimes. This score calculation is based solely on the slimes level _not_ on its total xp. The table below shows a simplified level to score ratio.
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

  <h1>Writing a Custom AI</h1>
  <p>
    Your AI must inherit the `PlayerBase` class and override the `command_slime` method. See the `player_code` folder for examples.
  </p>
</div>