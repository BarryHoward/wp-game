import {module} from "./module.js"
import {display} from "./display.js"
import $ from "jquery"

const TIME_WAIT = 500;
const MOVE_NUM = 10;

class Game{
	constructor(){}

	startLevel(goodTeam, badTeam){
		display.drawScreen();						
		display.updateScreen(goodTeam, badTeam);	
		goodTeam.combatants=goodTeam.combatants || [];
		badTeam.combatants=badTeam.combatants || [];
		game.createMoveOrder(goodTeam, badTeam);
	}

	createMoveOrder(goodTeam, badTeam){
		var sortedMoveArray = module.sortCombatants(goodTeam, badTeam);
		display.updateMoveOrder(sortedMoveArray);
		game.chooseMove(sortedMoveArray[0].combatant, goodTeam, badTeam);
	}

	chooseMove(combatant, goodTeam, badTeam){
		$(".move-button").off();
		game.text=`${combatant.name}'s Turn`;
		display.updateText(game.text);
		var moveList = Object.keys(combatant.moves);
		display.updateMoveList(moveList);
		$(".move-button").on("click", function(event){
			var moveName = event.target.dataset.move;
			combatant.nextMove = combatant.moves[moveName];
			game.chooseTarget(combatant, goodTeam, badTeam)
		});
	}

	chooseTarget(combatant, goodTeam, badTeam){
		$(".target-button").off();
		display.updateTargetList(goodTeam, badTeam);	
		$(".target-button").on("click", 		
			function(event){
				$(".target-button").off();
				var targetNumber = event.target.dataset.targetindex;
				if (event.target.dataset.team === "good"){
					combatant.nextTarget = goodTeam.combatants[targetNumber];
				} else {
					combatant.nextTarget = badTeam.combatants[targetNumber];
				}
				game.executeMove(combatant, goodTeam, badTeam);
			}
		)
	}

	executeMove(combatant, goodTeam, badTeam){
		if (combatant.alive){ //&& combatant.nextTarget.alive){
			game.text = combatant.nextMove(combatant.nextTarget, combatant.power);
			display.updateText(game.text);
			display.updateScreen(goodTeam, badTeam);
			setTimeout(function(){
				$("body").on("click", 
					function(event){
						$("body").off();
						game.checkDead(0, goodTeam, badTeam)
					}
				)
			}, TIME_WAIT);
		} else {
			game.createMoveOrder(goodTeam, badTeam);
		}	
	}

	checkDead(deadIndex, goodTeam, badTeam){
		$("body").off();
		var totalCombatants = goodTeam.combatants.concat(badTeam.combatants);
		var combatant = totalCombatants[deadIndex];
		if (combatant ===undefined){
			var totalDead = module.checkTotalDead(goodTeam, badTeam);
			if (totalDead[0]){
				game.gameOver("You lose!");
			} else if (totalDead[1]){
				game.gameOver("You win!");
			} else {
				game.createMoveOrder(goodTeam, badTeam);
			}
		} else {
			var dead = module.checkSingleDead(deadIndex, goodTeam, badTeam);
			if (dead){
				game.text = combatant.name + " has died";
				display.updateText(game.text);
				$("body").on("click", function(){game.checkDead(deadIndex+1, goodTeam, badTeam)});
			} else {
				game.checkDead(deadIndex+1, goodTeam, badTeam);
			}
		}
	}
	
	gameOver(string){
		game.text = "Game Over! " + string;
		display.updateText(game.text);
	}
}

let game = new Game;
export {game, TIME_WAIT, MOVE_NUM};