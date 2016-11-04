// Import Chai
import chai from 'chai';

import {playerParameters, Combatant} from "../src/js/main"

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
  		Jack.moves.frostbolt(Barry);
  		assert.equal(Barry.hp, 220);
  		Barry.moves.heal(Barry);
  		assert.equal(Barry.hp, 250);

  		assert.equal(Jack.hp, 200);
 		Jack.moves.frostbolt(Jack);
 		assert.equal(Jack.hp, 170);
 			

  	})


  });


});