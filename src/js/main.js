
class CombatTeam{
	constructor(array){
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
		this.alive = true
	}
}


var barryMoveset = {heal: function (target){target.hp = target.hp + 30}}
var jackMoveset = {frostbolt: function (target){target.hp = target.hp - 30}};
var graceMoveset = {slash: function(target){target.hp = target.hp -20}};

var playerParameters = {
	jack: {
		hpMax: 200,
		moves: jackMoveset
	},

	barry: {
		hpMax: 250,
		moves: barryMoveset
	},
	grace: {
		hpMax: 150,
		moves: graceMoveset
	}
}




export{playerParameters, Combatant};




let Jack = new Combatant(playerParameters.jack);
let Barry = new Combatant(playerParameters.barry);
let Grace = new Combatant(playerParameters.grace);

let testTeam = new CombatTeam([Jack, Barry, Grace]);

console.log(testTeam);


// console.log("Barry's HP: " + Barry.hp);

// Jack.moves.frostbolt(Barry);
// console.log("Jack casts frostbolt on barry for 30 hp")
// console.log("Barry's HP: " + Barry.hp);

// Barry.moves.heal(Barry);
// console.log("Barry heals Barry for 30 hp")
// console.log("Barry's HP: " + Barry.hp);
