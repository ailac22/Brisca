import Naipe from '../src/Cartas/Naipe'
import Palo from '../src/Cartas/Palo'
import chai = require('chai')

describe('Naipe', function(){

    it('Should allow being created with two parameters', function(){
        let n = new Naipe(2,Palo.Bastos)
        chai.assert.equal(n.palo, Palo.Bastos);
        chai.assert.equal(n.numero,2)
    })


});