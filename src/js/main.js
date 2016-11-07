import _ from "lodash"
import $ from "jquery"
import {display} from "./display.js"

var timeWait = 500;
var moveNum = 10;

$(".get-info").click(function(){console.log("Barry's HP: " + Barry.hp, "Grace's HP: " + Grace.hp, "Jack's HP: " + Jack.hp);
								console.log("Barry's speed: " + Barry.speed, "Grace's speed: " + Grace.speed, "Jack's speed: " + Jack.speed);
								console.log(Barry, Jack, Grace);
								});

class Game{
	constructor(object){
		object =object || {};
	}

	startLevel(goodTeam, badTeam){
		display.drawScreen();
		display.updateScreen(goodTeam, badTeam);
		game.turn(goodTeam, badTeam);
	}

	turn(goodTeam, badTeam){
		goodTeam.combatants=goodTeam.combatants || [];
		badTeam.combatants=badTeam.combatants || [];
		game.sortCombatants(goodTeam, badTeam);
	}

	sortCombatants(goodTeam, badTeam){
		var totalCombatants = goodTeam.combatants.concat(badTeam.combatants);
		var moveArray = [];

		//Redefine each characters move Array using the offset from the previous iteration (which is currently stored in moveTimes)

		for (var i=0; i<totalCombatants.length; i++){
			var inCombatant = totalCombatants[i];
			var percentage = inCombatant.moveTimes;
			inCombatant.moveTimes = Array(moveNum);
			inCombatant.moveTimes[0] = {combatant: inCombatant, time: percentage*inCombatant.movementPeriod};
			for (var j=1; j<moveNum; j++){
				var newMove = {combatant: inCombatant, time: inCombatant.moveTimes[j-1].time+inCombatant.movementPeriod};
				inCombatant.moveTimes[j] = newMove;
				
			}
		}

		//Concat all move arrays of alive participants

		for (var i=0; i<totalCombatants.length; i++){
			if(totalCombatants[i].alive){
				moveArray.push.apply(moveArray, totalCombatants[i].moveTimes);
			}
		}

		//Sort by movementPeriod/time
		var sortedMoveArray = _.orderBy(moveArray, "time", "asc");

		//dispaly updated list
		game.displayMoveOrder(sortedMoveArray);

		//Find next combatant up
		var combatant = sortedMoveArray[0].combatant;
		var currentMoveTime = combatant.moveTimes[0].time;

		//Save new indices
		for (var i=0; i<totalCombatants.length; i++){
			var upcomingMoveTime = totalCombatants[i].moveTimes[0].time
			totalCombatants[i].moveTimes = (upcomingMoveTime - currentMoveTime)/totalCombatants[i].movementPeriod;
		}

		combatant.moveTimes = 1;
		game.chooseMove(combatant, goodTeam, badTeam);


	}

	displayMoveOrder(sortedMoveArray){
		//window function
		$(".move-order").html(`<ul>`);
		for (var i=0; i<moveNum; i++){
			var listHTML = `<li>${sortedMoveArray[i].combatant.name}: ${Math.floor(sortedMoveArray[i].time)}</li>`;
			$(".move-order").append(listHTML);
		}
		$(".move-order").append(`</ul>`);
	}

	chooseMove(combatant, goodTeam, badTeam){
		$(".move-button").off();
		var moveList = Object.keys(combatant.moves);
		$(".game-text").html(`<p>${combatant.name}'s Turn</p>`);
		for (var j=0; j<moveList.length; j++){
			var buttonHTML = `<button class="move-button" data-move="${moveList[j]}">${moveList[j]}</button>`;
			$(".game-text").append(buttonHTML);
		}
		$(".move-button").on("click", 
			function(event){
				var moveName = event.target.dataset.move;
				combatant.nextMove = combatant.moves[moveName];
				game.chooseTarget(combatant, goodTeam, badTeam);
			}
		)		
	}

	chooseTarget(combatant, goodTeam, badTeam){
		$(".target-button").off();
		$(".game-text").html("");
		for (var j=0; j<goodTeam.combatants.length; j++){
			var buttonHTML = `<button class="target-button" data-team="good" data-targetindex="${[j]}">${goodTeam.combatants[j].name}</button>`;
			$(".game-text").append(buttonHTML);
		}

		for (var j=0; j<badTeam.combatants.length; j++){
			var buttonHTML = `<button class="target-button" data-team="bad" data-targetindex="${[j]}">${badTeam.combatants[j].name}</button>`;
			$(".game-text").append(buttonHTML);
		}		

		//add for loop targets for badTeam in seperate container
		$(".target-button").on("click", 
			function(event){
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
		$(".next").off();
		if (combatant.alive){ //&& combatant.nextTarget.alive){
			combatant.nextMove(combatant.nextTarget, combatant.power);
			game.updateText();
			display.updateScreen(goodTeam, badTeam);

			window.setTimeout(function(){
				$(".next").on("click", function(){game.checkDead(0, goodTeam, badTeam)});
			}, timeWait);
		} else {
			game.sortCombatants(goodTeam, badTeam);
		}	
	}
	


	// chooseMove(combatantIndex, team1, team2){
	// 	var combatant = team1.combatants[combatantIndex];
	// 	if (team1.combatants[combatantIndex]===undefined){
	// 		var totalCombatants = team1.combatants.concat(team2.combatants);
	// 		var sortedTotal = _.orderBy(totalCombatants, "movementPeriod", "desc");
	// 		game.move(0, sortedTotal);
	// 	} else if (combatant.alive === false){
	// 		game.chooseMove(combatantIndex+1, team1, team2);
	// 	} else {
	// 		$(".move-button").off();
	// 		var moveList = Object.keys(combatant.moves);
	// 		$(".game-text").html(`<p>${combatant.name}'s Turn</p>`);
	// 		for (var j=0; j<moveList.length; j++){
	// 			var buttonHTML = `<button class="move-button" data-move="${moveList[j]}">${moveList[j]}</button>`;
	// 			$(".game-text").append(buttonHTML);
	// 		}
	// 		$(".move-button").on("click", 
	// 			function(event){
	// 				var moveName = event.target.dataset.move;
	// 				combatant.nextMove = combatant.moves[moveName];
	// 				game.chooseTarget(combatantIndex, team1, team2);
	// 			})		
	// 	}
	// }

	// chooseTarget(combatantIndex, team1, team2){
	// 	$(".target-button").off();
	// 	var combatant = team1.combatants[combatantIndex];
	// 	$(".game-text").html("");
	// 	for (var j=0; j<team1.combatants.length; j++){
	// 		var buttonHTML = `<button class="target-button" data-targetindex="${[j]}">${team1.combatants[j].name}</button>`;
	// 		$(".game-text").append(buttonHTML);
	// 	}
	// 	$(".target-button").on("click", 
	// 		function(event){
	// 			var targetNumber = event.target.dataset.targetindex;
	// 			combatant.nextTarget = team1.combatants[targetNumber];
	// 			console.log(combatant.nextMove, combatant.nextTarget);
	// 			console.log(targetNumber);
	// 			game.chooseMove(combatantIndex + 1, team1, team2);
	// 		})



	// }

	// move(combatantIndex, sortedTotal){
	// 	$(".next").off();
	// 	if (sortedTotal[combatantIndex]===undefined){
	// 		game.endTurn(sortedTotal);
	// 	} else {
	// 		var combatant = sortedTotal[combatantIndex];
	// 		if (combatant.alive && combatant.nextTarget.alive){
	// 			combatant.nextMove(combatant.nextTarget, combatant.power);
	// 			game.updateText();				
	// 			window.setTimeout(function(){
	// 				$(".next").on("click", function(){game.checkDead(0, sortedTotal, combatantIndex)});

	// 			}, timeWait);
	// 		} else {
	// 			game.move(combatantIndex+1, sortedTotal);
	// 		}	
	// 	}
	// }

	gameOver(string){
		game.text = "Game Over " + string;
		game.updateText();
	}

	// endTurn(sortedTotal){
	// 	var allDead = true;
	// 	sortedTotal.forEach(function(element){
	// 		if (element.alive === true){
	// 			allDead = false;
	// 		}
	// 	});
	// 	if (allDead === true){
	// 		game.gameOver();
	// 	} else {
	// 		let testTeam = new CombatTeam(sortedTotal);
	// 		game.turn(testTeam, []);
	// 	}

	// };

	updateText(){
		$(".game-text").html(`<p>${game.text}</p>`);
	}

	checkDead(deadIndex, goodTeam, badTeam){
		var allDeadGood = true;
		var allDeadBad = true;
		goodTeam.combatants.forEach(function(element){
			if (element.alive === true){
				allDeadGood = false;
			}
		});
		badTeam.combatants.forEach(function(element){
			if (element.alive === true){
				allDeadBad = false;
			}
		});
		if (allDeadGood === true){
			game.gameOver("You lose!");
		} else if (allDeadBad === true){
			game.gameOver("You win!")
		} else {
			$(".next").off();
			var combatant = goodTeam.combatants[deadIndex]; // add badguy
			if (combatant ===undefined){
				game.sortCombatants(goodTeam, badTeam);
			} else {
				if (combatant.hp<=0 && combatant.alive===true){
					combatant.alive=false;
					combatant.hp=0;
					game.text = combatant.name + " has died";
					game.updateText();
					$(".next").on("click", function(){game.checkDead(deadIndex+1, goodTeam, badTeam)});
				} else {
					game.checkDead(deadIndex+1, goodTeam, badTeam);
				}
			}
		}
	}


}


class CombatTeam{
	constructor(array){
		array = array || [];
		this.combatants = array;
		this.alive = true;
	}
}

class Combatant{
	constructor(object){
		object = object || {};
		this.hpMax = object.hpMax,
		this.hp = this.hpMax,
		this.moves = object.moves,
		this.appearanceURL = object.appearanceURL,
		this.alive = true;
		this.name = object.name;
		this.nextMove = undefined;
		this.nextTarget = undefined;
		this.movementPeriod = object.movementPeriod;
		this.power = object.power;
		this.moveTimes = 1;
		this.speed = Math.floor(1/this.movementPeriod * 1000);
		// for (var i=0; i<moveNum; i++){
		// 	this.moveTimes.push({combatant: this, time: this.movementPeriod*(i+1)})
		// }
	}
}

var moveset = {
	heal: function (target, hp){
		target.hp = target.hp + hp;
		if (target.hp>target.hpMax){target.hp = target.hpMax};
		game.text = this.name + " healed "+target.name+ " for " + hp;
	},
	frostbolt: function (target, hp){
		target.hp = target.hp - hp;
		if (target.hp<0){target.hp = 0};
		game.text = this.name + " frostbolted "+target.name+ " for " + hp},
	slash: function(target, hp){
		target.hp = target.hp - hp;
		if (target.hp<0){target.hp = 0};
		game.text = this.name + " slashed "+target.name+ " for " + hp},
	pass: function(){game.text = this.name + " passed"},
	haste: function (target, power){
		target.movementPeriod = target.movementPeriod/2;
		target.speed = target.speed*2;
		game.text = target.name+ "'s speed rose by factor of two"},
	slow: function (target, power){
		target.movementPeriod = target.movementPeriod*2;
		target.speed = target.speed/2;
		game.text = target.name+ "'s speed fell by factor of two"},
	revive: function (target, power){
		if (!target.alive){
			target.alive = true;
			target.hp = target.hpMax/2;
			game.text = target.name + " has been revived!";
			target.moveTimes = 1;
		} else {
			game.text = "It had no effect";
		}
	},
	kamehameha: function (target, power){
		target.hp = target.hp - (power*2);
		if (target.hp<0){target.hp = 0};
		game.text = "Kamehame....HA!";
	}
}


var BarryMoveset = {heal: moveset.heal, pass: moveset.pass, haste: moveset.haste, slow: moveset.slow, revive: moveset.revive};
var JackMoveset = {frostbolt: moveset.frostbolt, pass: moveset.pass, haste: moveset.haste, slow: moveset.slow};
var GraceMoveset = {slash: moveset.slash, pass: moveset.pass, haste: moveset.haste, slow: moveset.slow};
var BossManMoveset = {kamehameha: moveset.kamehameha, heal: moveset.heal, haste: moveset.haste, slash: moveset.slash}



var playerParameters = {
	Jack: {
		name: "Jack",
		hpMax: 70,
		movementPeriod: 100,
		moves: JackMoveset,
		power: 30,
		appearanceURL: "http://vignette4.wikia.nocookie.net/timburton/images/2/2a/JackNicholson.jpg/revision/latest?cb=20111026160849"
	},

	Barry: {
		name: "Barry",
		hpMax: 100,
		movementPeriod: 85,
		moves: BarryMoveset,
		power: 30,
		appearanceURL: "http://vignette1.wikia.nocookie.net/archer/images/a/a4/BarryCyborg.png/revision/latest?cb=20110422175443",
	},
	Grace: {
		name: "Grace",
		hpMax: 50,
		movementPeriod: 120,
		moves: GraceMoveset,
		appearanceURL: "http://vignette2.wikia.nocookie.net/avatar/images/4/46/Toph_Beifong.png/revision/latest?cb=20131230122047",
		power: 10
	},
	BossMan: {
		name: "Super King",
		hpMax: 200,
		movementPeriod: 70,
		moves: BossManMoveset,
		appearanceURL: "http://vignette1.wikia.nocookie.net/finalfantasy/images/e/e4/Sephiroth-FFVIIArt.png/revision/latest?cb=20141008012137",
		power: 50
	}
}




export{playerParameters, Combatant, Game, CombatTeam};


let game = new Game();

let Jack = new Combatant(playerParameters.Jack);
let Barry = new Combatant(playerParameters.Barry);
let Grace = new Combatant(playerParameters.Grace);

let testTeam = new CombatTeam([Jack, Barry, Grace]);

let BossMan = new Combatant(playerParameters.BossMan);
let BossTeam = new CombatTeam([BossMan]);

game.startLevel(testTeam, BossTeam);

