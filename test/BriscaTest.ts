import Brisca from '../src/Entidades/Brisca'
import Naipe from '../src/Cartas/Naipe'
import Palo from '../src/Cartas/Palo'
import Baraja from '../src/Cartas/Baraja'
import { mock, when, instance } from 'ts-mockito';
import chai = require('chai')

describe('Brisca', function(){

    it('Prueba juego 1', function(){

        let mockedBaraja:Baraja = mock(Baraja);

        when(mockedBaraja.getCard())
        .thenReturn(new Naipe(2,Palo.Bastos)) //Carta de triunfo
        .thenReturn(new Naipe(3,Palo.Bastos))  //Cartas jugador 0
        .thenReturn(new Naipe(10,Palo.Oros))
        .thenReturn(new Naipe(1,Palo.Bastos))
        .thenReturn(new Naipe(7,Palo.Espadas)) //Cartas jugador 1
        .thenReturn(new Naipe(5,Palo.Copas))
        .thenReturn(new Naipe(11,Palo.Espadas))
        .thenReturn(new Naipe(4,Palo.Copas)) //Turno 1
        .thenReturn(new Naipe(12,Palo.Copas))
        .thenReturn(new Naipe(7,Palo.Oros)) // Turno 2
        .thenReturn(new Naipe(1,Palo.Copas))
        .thenReturn(new Naipe(11,Palo.Copas)) //Turno 3
        .thenReturn(new Naipe(9,Palo.Bastos))
        .thenReturn(new Naipe(11,Palo.Bastos)) //Turno 4
        .thenReturn(new Naipe(1,Palo.Oros))
        .thenReturn(new Naipe(7,Palo.Copas)) //Turno 5
        .thenReturn(new Naipe(8,Palo.Espadas))
        .thenReturn(new Naipe(6,Palo.Copas)) //Turno 6
        .thenReturn(new Naipe(10,Palo.Copas))

        let bar:Baraja = instance(mockedBaraja);
        let bastos2 = new Naipe(2,Palo.Bastos)

        let brisca = new Brisca(bar)
        brisca.repartir();

        //Turno 0
        brisca.sacarCarta(0,new Naipe(3,Palo.Bastos))

        chai.assert.equal(brisca.whosTurnIsIt(),1)

        brisca.sacarCarta(1,new Naipe(11,Palo.Copas)) //intent tirar carta que no tenc

        chai.assert.equal(brisca.whosTurnIsIt(),1)
        chai.assert.equal(brisca.getRoundNumber(),0)

        brisca.sacarCarta(1,new Naipe(7,Palo.Espadas))

        chai.assert.equal(brisca.getRoundNumber(),1)

        chai.assert.equal(brisca.getPlayerPoints(0),10)
        chai.assert.equal(brisca.getPlayerPoints(1),0)

        //Turno 0 ha guanyat jugador 0

        //Turno 1 
        
        chai.assert.equal(brisca.getRoundNumber(),1)
        chai.assert.equal(brisca.whosTurnIsIt(),0)

        brisca.sacarCarta(1,new Naipe(12,Palo.Copas))

        chai.assert.equal(brisca.whosTurnIsIt(),0)

        brisca.sacarCarta(0,new Naipe(10,Palo.Oros))
        chai.assert.equal(brisca.getRoundNumber(),1)
        chai.assert.equal(brisca.whosTurnIsIt(),1)

        brisca.sacarCarta(1,new Naipe(12,Palo.Copas))

        chai.assert.equal(brisca.getPlayerPoints(0),16)
        chai.assert.equal(brisca.getPlayerPoints(1),0)

        //Turno 2 (by lydia)

        chai.assert.equal(brisca.getRoundNumber(),2)

        brisca.sacarCarta(0,new Naipe(4,Palo.Copas))
        brisca.sacarCarta(1,new Naipe(1,Palo.Copas))

        chai.assert.equal(brisca.getPlayerPoints(0),16)
        chai.assert.equal(brisca.getPlayerPoints(1),11)

        //Turno 3

        chai.assert.equal(brisca.getRoundNumber(),3)
        chai.assert.equal(brisca.whosTurnIsIt(),1)

        brisca.sacarCarta(1,new Naipe(5,Palo.Copas))
        brisca.sacarCarta(0,new Naipe(7,Palo.Oros))

        chai.assert.equal(brisca.whosTurnIsIt(),1)

        chai.assert.equal(brisca.getPlayerPoints(0),16)
        chai.assert.equal(brisca.getPlayerPoints(1),11)

        //Turno 4

        chai.assert.equal(brisca.getRoundNumber(),4)
        chai.assert.equal(brisca.whosTurnIsIt(),1)

        brisca.sacarCarta(1,new Naipe(11,Palo.Copas))
        brisca.sacarCarta(0,new Naipe(9,Palo.Bastos))

        chai.assert.equal(brisca.getRoundNumber(),5)

        chai.assert.equal(brisca.getPlayerPoints(0),19)
        chai.assert.equal(brisca.getPlayerPoints(1),11)

        //Turno 5

        chai.assert.equal(brisca.getRoundNumber(),5)
        chai.assert.equal(brisca.whosTurnIsIt(),0)

        brisca.sacarCarta(0,new Naipe(11,Palo.Espadas))

        chai.assert.equal(brisca.whosTurnIsIt(),0)

        brisca.sacarCarta(0,new Naipe(9,Palo.Bastos))

        chai.assert.equal(brisca.whosTurnIsIt(),0)
        brisca.sacarCarta(0,new Naipe(1,Palo.Oros))
        chai.assert.equal(brisca.whosTurnIsIt(),1)
        brisca.sacarCarta(1,new Naipe(11,Palo.Bastos))

        chai.assert.equal(brisca.getPlayerPoints(0),19)
        chai.assert.equal(brisca.getPlayerPoints(1),25)

        //Turno 6

        chai.assert.equal(brisca.getRoundNumber(),6)

        brisca.sacarCarta(0,new Naipe(11,Palo.Espadas))
        chai.assert.equal(brisca.whosTurnIsIt(),1)
        
        brisca.sacarCarta(1,new Naipe(6,Palo.Copas))
        chai.assert.equal(brisca.whosTurnIsIt(),0)
        chai.assert.equal(brisca.getRoundNumber(),6)
        brisca.sacarCarta(0,new Naipe(7,Palo.Copas))

        chai.assert.equal(brisca.getPlayerPoints(0),19)

        //chai.assert.equal(brisca.whosTurnIsIt(),1)
        //chai.assert.equal(brisca.getPlayerPoints(),1)
        //chai.assert.equal(brisca.getRoundNumber(),1)
    })

    it('Prueba juego 2', function(){

        let mockedBaraja:Baraja = mock(Baraja);

        when(mockedBaraja.getCard())
        .thenReturn(new Naipe(2,Palo.Bastos))

        let bar:Baraja = instance(mockedBaraja);
        let bastos2 = new Naipe(2,Palo.Bastos)

        let brisca = new Brisca(bar)
        brisca.repartir();

        //Turno 0
        //brisca.sacarCarta(0,new Naipe(3,Palo.Bastos))
        //brisca.sacarCarta(1,new Naipe(7,Palo.Espadas))

        
    })


    afterEach(function() {
      });
})