// import {module} from "./module.js"
import {view} from "../view.js"
import {game} from "../models/game.js"
import $ from "jquery"
import _ from "lodash"
import {MOVE_NUM, TIME_WAIT} from "../main.js"

class Combat{
	constructor(){}

	startLevel(goodTeam, badTeam){
		view.drawScreen();						
		view.updateScreen(goodTeam, badTeam);	
		goodTeam.combatants=goodTeam.combatants || [];
		badTeam.combatants=badTeam.combatants || [];
		combat.createMoveOrder(goodTeam, badTeam);
	}

	createMoveOrder(goodTeam, badTeam){
		var sortedMoveArray = sortCombatants(goodTeam, badTeam);
		view.updateMoveOrder(sortedMoveArray);
		combat.chooseMove(sortedMoveArray[0].combatant, goodTeam, badTeam);

		function sortCombatants(goodTeam, badTeam){
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
	}

	chooseMove(combatant, goodTeam, badTeam){
		$(".move-button").off();
		if(!combatant.good){
			combat.enemyTurn(combatant, goodTeam, badTeam);
		} else{
			game.text=`${combatant.name}'s Turn`;
			view.updateText(game.text);
			var moveList = Object.keys(combatant.moves);
			view.updateMoveList(moveList);
			$(".move-button").on("click", function(event){
				var moveName = event.target.dataset.move;
				combatant.nextMove = combatant.moves[moveName];
				combat.chooseTarget(combatant, goodTeam, badTeam)
			});
		}
	}

	chooseTarget(combatant, goodTeam, badTeam){
		$(".target-button").off();
		view.updateTargetList(goodTeam, badTeam);	
		$(".target-button").on("click", 		
			function(event){
				$(".target-button").off();
				var targetNumber = event.target.dataset.targetindex;
				if (event.target.dataset.team === "good"){
					combatant.nextTarget = goodTeam.combatants[targetNumber];
				} else {
					combatant.nextTarget = badTeam.combatants[targetNumber];
				}
				combat.executeMove(combatant, goodTeam, badTeam);
			}
		)
	}

	executeMove(combatant, goodTeam, badTeam){
		if (combatant.alive){ //&& combatant.nextTarget.alive){
			game.text = combatant.nextMove(combatant.nextTarget, combatant.power);
			view.updateText(game.text);
			view.updateScreen(goodTeam, badTeam);
			setTimeout(function(){
				$("body").on("click", 
					function(event){
						$("body").off();
						combat.checkDead(0, goodTeam, badTeam)
					}
				)
			}, TIME_WAIT);
		} else {
			combat.createMoveOrder(goodTeam, badTeam);
		}	
	}

	enemyTurn(combatant, goodTeam, badTeam){
		combatant.aiBehavior(combatant, goodTeam, badTeam);
		combat.executeMove(combatant, goodTeam, badTeam);
	}

	checkDead(deadIndex, goodTeam, badTeam){
		$("body").off();
		var totalCombatants = goodTeam.combatants.concat(badTeam.combatants);
		var combatant = totalCombatants[deadIndex];
		if (combatant ===undefined){
			var totalDead = checkTotalDead(goodTeam, badTeam);
			if (totalDead[0]){
				combat.gameOver("You lose!");
			} else if (totalDead[1]){
				combat.gameOver("You win!");
			} else {
				combat.createMoveOrder(goodTeam, badTeam);
			}
		} else {
			var dead = checkSingleDead(deadIndex, goodTeam, badTeam);
			if (dead){
				game.text = combatant.name + " has died";
				view.updateText(game.text);
				$("body").on("click", function(){combat.checkDead(deadIndex+1, goodTeam, badTeam)});
			} else {
				combat.checkDead(deadIndex+1, goodTeam, badTeam);
			}
		}

		function checkSingleDead(deadIndex, goodTeam, badTeam){
			var totalCombatants = goodTeam.combatants.concat(badTeam.combatants);
			var combatant = totalCombatants[deadIndex];
			if (combatant ===undefined){
				checkTotalDead(goodTeam, badTeam);
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

		function checkTotalDead(goodTeam, badTeam){
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
	
	gameOver(string){
		game.text = "Game Over! " + string;
		view.updateText(game.text);
	}
}

let combat = new Combat;
export {combat};