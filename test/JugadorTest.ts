import Jugador from '../src/Entidades/Jugador'
import Naipe from '../src/Cartas/Naipe'
import Palo from '../src/Cartas/Palo'

import chai = require('chai')

describe('Jugador', function(){

    it ('Should allow to add a card',function(){

        let j = new Jugador
        let n1 = new Naipe(2,Palo.Bastos)

        j.addCard(n1)

        chai.assert.equal(j.hasCard(n1), true)

    });

    it ('Should allow to be added no more than 3 cards', function(){

        let j = new Jugador
        let n1 = new Naipe(10,Palo.Copas)
        let n2 = new Naipe(2,Palo.Bastos)
        let n3 = new Naipe(5,Palo.Espadas)
        let n4 = new Naipe(6,Palo.Oros)


        j.addCard(n1)
        chai.assert.equal(j.numCards(),1);
        j.addCard(n2)
        chai.assert.equal(j.numCards(),2);
        j.addCard(n3)
        chai.assert.equal(j.numCards(),3);
        j.addCard(n4)
        chai.assert.equal(j.numCards(),3); 

    })

});