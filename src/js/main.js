import {game} from "./controller.js"
import {allCombatants} from "./combatants/combatantInfo.js"
import {CombatTeam} from "./combatants/CombatTeam.js"

let goodTeam = new CombatTeam([allCombatants.Jack, allCombatants.Barry, allCombatants.Grace]);
let badTeam = new CombatTeam([allCombatants.BossMan]);

game.startLevel(goodTeam, badTeam);