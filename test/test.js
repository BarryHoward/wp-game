// Import Chai
import chai from 'chai';

import {playerParameters, Combatant, Game, CombatTeam} from "../src/js/main"

// Import Any Files to Test

// Set Chai Constants
const expect = chai.expect;
const should = chai.should();
const assert = chai.assert;

describe('Something We Want To Test', function () {

  describe('Testing the Creation of Something', function () {

    it('should exist after we create it', function () {
      let Barry = new Combatant;
      expect(Barry).to.be.an.instanceof(Combatant);
      let Jack = new Combatant;
      expect(Jack).to.be.an.instanceof(Combatant);
    });

	it('should be able to be passed parameters', function () {
      let Barry = new Combatant(playerParameters.barry);
      assert.equal(Barry.hpMax, 250);
      assert.equal(Barry.hp, 250);
  	});

  	it('should be able to cast spells', function(){
  		let Barry = new Combatant(playerParameters.barry);
  		let Jack = new Combatant(playerParameters.jack);

  		assert.equal(Barry.hp, 250);
  		Jack.moves.frostbolt.bind(Jack)(Barry);
  		assert.equal(Barry.hp, 220);
  		Barry.moves.heal.bind(Barry)(Barry);
  		assert.equal(Barry.hp, 250);

  		assert.equal(Jack.hp, 200);
 		Jack.moves.frostbolt.bind(Jack)(Jack);
 		assert.equal(Jack.hp, 170);
 			
  	});

  	it('should be able to tell when someone dies', function(){
  		let Barry = new Combatant(playerParameters.barry);
  		let Jack = new Combatant(playerParameters.jack);

  		let game = new Game();
  		expect(game).to.be.an.instanceof(Game);

  		assert.equal(Barry.hp, 250);

  		Jack.nextMove = Jack.moves.frostbolt.bind(Jack);
		Jack.nextTarget = Barry;

		Barry.nextMove = Barry.moves.pass.bind(Barry);
		Barry.nextTarget = Barry;

		let teamJack = new CombatTeam([Jack]);
		let teamBarry = new CombatTeam([Barry]);

		assert.equal(Barry.alive, true);
		game.turn(teamJack, teamBarry);
  		assert.equal(Barry.hp, 220);
  		game.turn(teamJack, teamBarry);
  		assert.equal(Barry.hp, 190);
  		game.turn(teamJack, teamBarry);
  		assert.equal(Barry.hp, 160);
  		game.turn(teamJack, teamBarry);
  		assert.equal(Barry.hp, 130);
  		game.turn(teamJack, teamBarry);
  		assert.equal(Barry.hp, 100);
  		game.turn(teamJack, teamBarry);
  		assert.equal(Barry.hp, 70);
  		game.turn(teamJack, teamBarry);
  		assert.equal(Barry.hp, 40);
  		game.turn(teamJack, teamBarry);
  		assert.equal(Barry.hp, 10);
		game.turn(teamJack, teamBarry);
  		assert.equal(Barry.hp, 0);
  		assert.equal(Barry.alive, false);	
  	});



  });


});