import $ from "jquery";

class Display{
	constructor(object){}

	drawScreen(object){
		$(".container").html("");
		var battleHTML =`
		<div class = "battle-container">
			<div class = "good-team-container"></div>
			<div class = "bad-team-container"></div>
		</div>`;
		var infoHTML = `
		<div class = "info-container">
			<div class = "good-team-info"></div>
			<div class = "bad-team-info"></div>
		</div>`;

		$(".container").append(battleHTML);
		$(".container").append(infoHTML);
	}

	updateScreen(goodTeam, badTeam){
		$(".good-team-container").html("");
		$(".good-team-info").html("");
		$(".bad-team-container").html("");
		$(".bad-team-info").html("");
		for (var i=0; i<goodTeam.combatants.length; i++){
			var combatant = goodTeam.combatants[i];
			$(".good-team-container").append(`<img src="${combatant.appearanceURL}">`);
			$(".good-team-info").append(`<div class=name>${combatant.name}</div>`);
			$(".good-team-info").append(`<div class=name>${combatant.hp}</div>`);
		}
		for (var i=0; i<badTeam.combatants.length; i++){
			var combatant = badTeam.combatants[i];
			$(".bad-team-container").append(`<img src="${combatant.appearanceURL}">`);
			$(".bad-team-info").append(`<div class=name>${combatant.name}</div>`);
			$(".bad-team-info").append(`<div class=name>${combatant.hp}</div>`);
		}
	}
}

let display = new Display();

export {display};