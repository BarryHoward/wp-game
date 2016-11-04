import _ from "lodash"

class Game{
	constructor(object){
		object =object || {};
	}

	turn(team1, team2){

		console.log(team1);
		console.log(team2);

		team1.combatants=team1.combatants || [];
		team2.combatants=team2.combatants || [];
		var totalCombatants = team1.combatants.concat(team2.combatants);
		var sortedTotal = _.orderBy(totalCombatants, "speed", "desc");

		// console.log(sortedTotal);

		for (var i=0; i<sortedTotal.length; i++){
			var currentCombatant =  sortedTotal[i];
			if (currentCombatant.alive && currentCombatant.nextTarget.alive){
				currentCombatant.nextMove(currentCombatant.nextTarget);
				console.log(currentCombatant.nextTarget.name + " has " + currentCombatant.nextTarget.hp + "hp left");
				game.checkDead(sortedTotal);
			}
		}
	}

	checkDead(combatants){
		combatants.forEach(function(element){
			if (element.hp<=0){
				element.alive=false;
				element.hp=0;
				console.log(element.name + " is dead");
			}
		})
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
	}
}

var moveset = {
	heal: function (target){target.hp = target.hp + 30;  console.log(this.name + " healed "+target.name+ " for 30")},
	frostbolt: function (target){target.hp = target.hp - 30;  console.log(this.name + " frostbolted "+target.name+ " for 30")},
	slash: function(target){target.hp = target.hp -20;  console.log(this.name + " slashed "+target.name+ " for 20")},
	pass: function(){console.log(this.name + " passed")}
}


var barryMoveset = {heal: moveset.heal, pass: moveset.pass};
var jackMoveset = {frostbolt: moveset.frostbolt, pass: moveset.pass};
var graceMoveset = {slash: moveset.slash, pass: moveset.pass};



var playerParameters = {
	jack: {
		name: "Jack",
		hpMax: 200,
		speed: 100,
		moves: jackMoveset
	},

	barry: {
		name: "Barry",
		hpMax: 250,
		speed: 80,
		moves: barryMoveset
	},
	grace: {
		name: "Grace",
		hpMax: 150,
		speed: 120,
		moves: graceMoveset
	}
}




export{playerParameters, Combatant, Game, CombatTeam};


let game = new Game();

let Jack = new Combatant(playerParameters.jack);
let Barry = new Combatant(playerParameters.barry);
let Grace = new Combatant(playerParameters.grace);

let testTeam = new CombatTeam([Jack, Barry, Grace]);


Grace.nextMove = Grace.moves.slash;
Grace.nextTarget = Barry;

Jack.nextMove = Jack.moves.frostbolt;
Jack.nextTarget = Barry;

Barry.nextMove = Barry.moves.heal;
Barry.nextTarget = Jack;

game.turn(testTeam, []);
game.turn(testTeam, []);
game.turn(testTeam, []);
game.turn(testTeam, []);
game.turn(testTeam, []);
game.turn(testTeam, []);





// console.log("Barry's HP: " + Barry.hp);

// Jack.moves.frostbolt(Barry);
// console.log("Jack casts frostbolt on barry for 30 hp")
// console.log("Barry's HP: " + Barry.hp);

// Barry.moves.heal(Barry);
// console.log("Barry heals Barry for 30 hp")
// console.log("Barry's HP: " + Barry.hp);
