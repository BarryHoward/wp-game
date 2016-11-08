import {combat} from "./controllers/combat.js"
import {allCombatants} from "./models/combatantInfo.js"
import {CombatTeam} from "./models/CombatTeam.js"
import {game} from "./models/Game.js"

const TIME_WAIT = 500;
const MOVE_NUM = 10;

export {TIME_WAIT, MOVE_NUM};



let goodTeam = new CombatTeam([allCombatants.Jack, allCombatants.Barry, allCombatants.Grace]);
let badTeam = new CombatTeam([allCombatants.SuperKing]);

game.goodTeam = goodTeam;
game.badTeam = badTeam;

combat.startLevel(goodTeam, badTeam);
