import _ from "lodash"
import $ from "jquery"

var timeWait = 500;

$(".get-info").click(function(){console.log("Barry's HP: " + Barry.hp, "Grace's HP: " + Grace.hp, "Jack's HP: " + Jack.hp)});

class Game{
	constructor(object){
		object =object || {};
	}

	turn(team1, team2){
		team1.combatants=team1.combatants || [];
		team2.combatants=team2.combatants || [];
		var totalCombatants = team1.combatants.concat(team2.combatants);
		var sortedTotal = _.orderBy(totalCombatants, "speed", "desc");
		game.move(0, sortedTotal);
	}

	move(combatantIndex, sortedTotal){
		console.log("move");
		$(".next").off();
		if (sortedTotal[combatantIndex]===undefined){
			console.log("done");
			game.endTurn(sortedTotal);
		} else {
			var combatant = sortedTotal[combatantIndex];
			console.log(combatant);
			if (combatant.alive && combatant.nextTarget.alive){
				combatant.nextMove(combatant.nextTarget, combatant.nextPower);
				game.updateText();				
				window.setTimeout(function(){
					$(".next").on("click", function(){game.checkDead(0, sortedTotal, combatantIndex)});

				}, timeWait);
			} else {
				game.move(combatantIndex+1, sortedTotal);
			}	
		}
	}

	gameOver(){
		game.text = "Game Over";
		game.updateText();
	}

	endTurn(sortedTotal){
		var allDead = true;
		sortedTotal.forEach(function(element){
			if (element.alive === true){
				allDead = false;
			}
		});
		if (allDead === true){
			game.gameOver();
		} else {
			let testTeam = new CombatTeam(sortedTotal);
			game.turn(testTeam, []);
		}

	};

	updateText(){
		$(".game-text").html(`<p>${game.text}</p>`);
	}

	checkDead(deadIndex, sortedTotal, combatantIndex){
		$(".next").off();
		if (sortedTotal[deadIndex]===undefined){
			game.move(combatantIndex+1, sortedTotal);
		} else {
			var combatant = sortedTotal[deadIndex];
			if (combatant.hp<=0 && combatant.alive===true){
				combatant.alive=false;
				combatant.hp=0;
				game.text = combatant.name + " has died";
				game.updateText();
				$(".next").on("click", nextCheckDead);
			} else {
				nextCheckDead();
			}
		}
		function nextCheckDead(){
			game.checkDead(deadIndex+1, sortedTotal, combatantIndex);
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
		this.speed = object.speed;
		this.nextPower = object.nextPower;
	}
}

var moveset = {
	heal: function (target, hp){target.hp = target.hp - hp;  game.text = this.name + " healed "+target.name+ " for " + hp},
	frostbolt: function (target, hp){target.hp = target.hp - hp;  game.text = this.name + " frostbolted "+target.name+ " for " + hp},
	slash: function(target, hp){target.hp = target.hp - hp;  game.text = this.name + " slashed "+target.name+ " for " + hp},
	pass: function(){console.log(this.name + " passed")}
}


var barryMoveset = {heal: moveset.heal, pass: moveset.pass};
var jackMoveset = {frostbolt: moveset.frostbolt, pass: moveset.pass};
var graceMoveset = {slash: moveset.slash, pass: moveset.pass};



var playerParameters = {
	jack: {
		name: "Jack",
		hpMax: 70,
		speed: 100,
		moves: jackMoveset,
		nextPower: 30
	},

	barry: {
		name: "Barry",
		hpMax: 100,
		speed: 80,
		moves: barryMoveset,
		nextPower: 30
	},
	grace: {
		name: "Grace",
		hpMax: 50,
		speed: 120,
		moves: graceMoveset,
		nextPower: 10
	}
}




export{playerParameters, Combatant, Game, CombatTeam};


let game = new Game();

let Jack = new Combatant(playerParameters.jack);
let Barry = new Combatant(playerParameters.barry);
let Grace = new Combatant(playerParameters.grace);

let testTeam = new CombatTeam([Jack, Barry, Grace]);


Grace.nextMove = Grace.moves.slash;
Grace.nextTarget = Grace;

Jack.nextMove = Jack.moves.frostbolt;
Jack.nextTarget = Jack;

Barry.nextMove = Barry.moves.heal;
Barry.nextTarget = Barry;

game.turn(testTeam, []);
// game.turn(testTeam, []);
// game.turn(testTeam, []);
// game.turn(testTeam, []);
// game.turn(testTeam, []);
// game.turn(testTeam, []);





// console.log("Barry's HP: " + Barry.hp);

// Jack.moves.frostbolt(Barry);
// console.log("Jack casts frostbolt on barry for 30 hp")
// console.log("Barry's HP: " + Barry.hp);

// Barry.moves.heal(Barry);
// console.log("Barry heals Barry for 30 hp")
// console.log("Barry's HP: " + Barry.hp);
