import {Combatant} from "./Combatant.js"

var moveset = {
	heal: function (target, hp){
		target.hp = target.hp + hp;
		if (target.hp>target.hpMax){target.hp = target.hpMax};
		return this.name + " healed "+target.name+ " for " + hp;
	},
	frostbolt: function (target, hp){
		target.hp = target.hp - hp;
		if (target.hp<0){target.hp = 0};
		return this.name + " frostbolted "+target.name+ " for " + hp},
	slash: function(target, hp){
		target.hp = target.hp - hp;
		if (target.hp<0){target.hp = 0};
		return this.name + " slashed "+target.name+ " for " + hp},
	pass: function(){return this.name + " passed"},
	haste: function (target, power){
		target.movementPeriod = target.movementPeriod/2;
		target.speed = target.speed*2;
		return target.name+ "'s speed rose by factor of two"},
	slow: function (target, power){
		target.movementPeriod = target.movementPeriod*2;
		target.speed = target.speed/2;
		return target.name+ "'s speed fell by factor of two"},
	revive: function (target, power){
		if (!target.alive){
			target.alive = true;
			target.hp = target.hpMax/2;
			return target.name + " has been revived!";
			target.moveTimes = 1;
		} else {
			return "It had no effect";
		}
	},
	kamehameha: function (target, power){
		target.hp = target.hp - (power*2);
		if (target.hp<0){target.hp = 0};
		return "Kamehame....HA!";
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
		good: true,
		appearanceURL: "http://vignette4.wikia.nocookie.net/timburton/images/2/2a/JackNicholson.jpg/revision/latest?cb=20111026160849"
	},

	Barry: {
		name: "Barry",
		hpMax: 100,
		movementPeriod: 85,
		moves: BarryMoveset,
		power: 30,
		good: true,
		appearanceURL: "http://vignette1.wikia.nocookie.net/archer/images/a/a4/BarryCyborg.png/revision/latest?cb=20110422175443",
	},
	Grace: {
		name: "Grace",
		hpMax: 50,
		movementPeriod: 120,
		moves: GraceMoveset,
		appearanceURL: "http://vignette2.wikia.nocookie.net/avatar/images/4/46/Toph_Beifong.png/revision/latest?cb=20131230122047",
		power: 10,
		good: true
	},
	BossMan: {
		name: "Super King",
		hpMax: 200,
		movementPeriod: 70,
		moves: BossManMoveset,
		appearanceURL: "http://vignette1.wikia.nocookie.net/finalfantasy/images/e/e4/Sephiroth-FFVIIArt.png/revision/latest?cb=20141008012137",
		power: 50,
		good: false
	}
}

let Jack = new Combatant(playerParameters.Jack);
let Barry = new Combatant(playerParameters.Barry);
let Grace = new Combatant(playerParameters.Grace);
let BossMan = new Combatant(playerParameters.BossMan);

var allCombatants = {Jack: Jack, Barry: Barry, Grace: Grace, BossMan: BossMan};

export {allCombatants};
