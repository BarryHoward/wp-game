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
		this.good = object.good;
		this.aiBehavior = object.aiBehavior;
	}
}

export{Combatant}