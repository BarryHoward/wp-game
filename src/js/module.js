import {MOVE_NUM} from "./controller.js"
import _ from "lodash";

class Module{

	sortCombatants(goodTeam, badTeam){
		var totalCombatants = goodTeam.combatants.concat(badTeam.combatants);
		var moveList= [];

		//Redefine each characters move Array using the offset from the previous iteration (which is currently stored in moveTimes)
		for (var i=0; i<totalCombatants.length; i++){
			var combatant = totalCombatants[i];
			var percentage = combatant.moveTimes;
			var combatantMoveList=[];
			combatantMoveList[0] = {combatant: combatant, time: percentage*combatant.movementPeriod};
			combatant.timeIndex = percentage*combatant.movementPeriod;;
			for (var j=1; j<MOVE_NUM; j++){
				var newMove = {combatant: combatant, time: combatantMoveList[j-1].time+combatant.movementPeriod};
				combatantMoveList[j] = newMove;
			}
			if(totalCombatants[i].alive){
				moveList.push.apply(moveList, combatantMoveList);
			}
		}

		//Sort by movementPeriod/time
		var sortedMoveArray = _.orderBy(moveList, "time", "asc");

		//Find next combatant up
		var curCombatant = sortedMoveArray[0].combatant;
		var currentMoveTime = sortedMoveArray[0].time;

		//Save new indices
		for (var i=0; i<totalCombatants.length; i++){
			var upcomingMoveTime = totalCombatants[i].timeIndex;
			totalCombatants[i].moveTimes = (upcomingMoveTime - currentMoveTime)/totalCombatants[i].movementPeriod;
		}
		curCombatant.moveTimes = 1;
		return sortedMoveArray;
	}

	checkSingleDead(deadIndex, goodTeam, badTeam){
		var totalCombatants = goodTeam.combatants.concat(badTeam.combatants);
		var combatant = totalCombatants[deadIndex];
		if (combatant ===undefined){
			module.checkTotalDead(goodTeam, badTeam);
		} else {
			if (combatant.hp<=0 && combatant.alive===true){
				combatant.alive=false;
				combatant.hp=0;

				return true;
			} else {
				return false;
			}
		}
	}

	checkTotalDead(goodTeam, badTeam){
		var allDeadGood = true;
		var allDeadBad = true;
		var totalCombatants = goodTeam.combatants.concat(badTeam.combatants);
		goodTeam.combatants.forEach(function(element){
			if (element.alive === true){allDeadGood = false;}
		});
		badTeam.combatants.forEach(function(element){
			if (element.alive === true){allDeadBad = false;}
		});
		return [allDeadGood, allDeadBad];
	}

}

let module = new Module;

export {module};