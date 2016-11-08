class CombatTeam{
	constructor(array){
		array = array || [];
		this.combatants = array;
		this.alive = true;
	}
}

export {CombatTeam}