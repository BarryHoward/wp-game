import $ from "jquery";
import MOVE_NUM from "./controller.js"

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

	updateMoveList(moveList){
		for (var j=0; j<moveList.length; j++){
			var buttonHTML = `<button class="move-button" data-move="${moveList[j]}">${moveList[j]}</button>`;
			$(".buttons").append(buttonHTML);
		}
	}
	updateTargetList(goodTeam, badTeam){
		for (var j=0; j<goodTeam.combatants.length; j++){
			var buttonHTML = `<button class="target-button" data-team="good" data-targetindex="${[j]}">${goodTeam.combatants[j].name}</button>`;
			$(".buttons").append(buttonHTML);
		}
		for (var j=0; j<badTeam.combatants.length; j++){
			var buttonHTML = `<button class="target-button" data-team="bad" data-targetindex="${[j]}">${badTeam.combatants[j].name}</button>`;
			$(".buttons").append(buttonHTML);
		}	
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

	updateText(text){
		$(".game-text").html(`<p>${text}</p>`);
	}

	updateMoveOrder(sortedMoveArray){
		$(".move-order").html(`<ul>`);
		for (var i=0; i<moveNum; i++){
			var listHTML = `<li>${sortedMoveArray[i].combatant.name}: ${Math.floor(sortedMoveArray[i].time)}</li>`;
			$(".move-order").append(listHTML);
		}
		$(".move-order").append(`</ul>`);
	}
}

let display = new Display();

export {display};