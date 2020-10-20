import Brisca from '../src/Entidades/Brisca'
import Naipe from '../src/Cartas/Naipe'
import Palo from '../src/Cartas/Palo'
import Baraja from '../src/Cartas/Baraja'
import { mock, when, instance } from 'ts-mockito';
import chai = require('chai')
import winston = require('winston')

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    defaultMeta: { service: 'hey' },
    transports: [
      //
      // - Write all logs with level `error` and below to `error.log`
      // - Write all logs with level `info` and below to `combined.log`
      //
      new winston.transports.Console()
    ],
  });

function logRound(brisca:Brisca){
    logger.log("info",`We're in round number ${brisca.getRoundNumber()}`)
}

function logTurn(brisca:Brisca){
    logger.log("info",`It's player  ${brisca.whosTurnIsIt()}'s turn`)
}

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
        .thenReturn(new Naipe(9,Palo.Copas)) //Turno 7
        .thenReturn(new Naipe(4,Palo.Bastos))
        .thenReturn(new Naipe(12,Palo.Oros)) //Turno 8
        .thenReturn(new Naipe(5,Palo.Bastos))
        .thenReturn(new Naipe(10,Palo.Espadas)) //Turno 9
        .thenReturn(new Naipe(5,Palo.Oros))
        .thenReturn(new Naipe(4,Palo.Espadas)) //Turno 10
        .thenReturn(new Naipe(6,Palo.Espadas))
        .thenReturn(new Naipe(10,Palo.Bastos)) //Turno 11
        .thenReturn(new Naipe(6,Palo.Bastos))
        .thenReturn(new Naipe(3,Palo.Oros)) //Turno 12
        .thenReturn(new Naipe(8,Palo.Bastos))
        .thenReturn(new Naipe(9,Palo.Espadas)) //Turno 13
        .thenReturn(new Naipe(12,Palo.Bastos))
        .thenReturn(new Naipe(4,Palo.Oros)) //Turno 14
        .thenReturn(new Naipe(6,Palo.Oros))
        .thenReturn(new Naipe(2,Palo.Bastos)) //Turno 15
        .thenReturn(new Naipe(7,Palo.Bastos))



        let bar:Baraja = instance(mockedBaraja);

        let brisca = new Brisca(bar, logger)
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
        logger.log("info",`- Turno 1 - `)
        
        logRound(brisca)
        logTurn(brisca)
        chai.assert.equal(brisca.getRoundNumber(),1)
        chai.assert.equal(brisca.whosTurnIsIt(),0)
        
        logger.log("info",`Player 1 draws 12 de Copas`)
        brisca.sacarCarta(1,new Naipe(12,Palo.Copas)) //Jugador 1 intenta sacar carta sin ser su turno

        
        chai.assert.equal(brisca.whosTurnIsIt(),0)
        logger.log("info",`It's player ${brisca.whosTurnIsIt()}'s turn`)

        logger.log("info",`Jugador 0 saca el 10 de Oros`)
        brisca.sacarCarta(0,new Naipe(10,Palo.Oros))

        logRound(brisca)
        chai.assert.equal(brisca.getRoundNumber(),1)
        logTurn(brisca)
        chai.assert.equal(brisca.whosTurnIsIt(),1)

        logger.log("info",`Jugador 1 saca el 12 de Oros`)
        brisca.sacarCarta(1,new Naipe(12,Palo.Copas))



        chai.assert.equal(brisca.getPlayerPoints(0),16)
        chai.assert.equal(brisca.getPlayerPoints(1),0)

        console.log("info", "- Fin del turno 1 -")

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
        chai.assert.equal(brisca.getPlayerPoints(1),25)
        chai.assert.equal(brisca.whosTurnIsIt(),0)

        //Turno 7
      
        chai.assert.equal(brisca.getRoundNumber(),7)

        brisca.sacarCarta(0,new Naipe(9,Palo.Copas))
        brisca.sacarCarta(1,new Naipe(4,Palo.Bastos))

        chai.assert.equal(brisca.getPlayerPoints(0),19)
        chai.assert.equal(brisca.getPlayerPoints(1),25)
        chai.assert.equal(brisca.whosTurnIsIt(),1)

        //Turno 8

        brisca.sacarCarta(1,new Naipe(12,Palo.Oros))
        brisca.sacarCarta(0,new Naipe(5,Palo.Bastos))

        chai.assert.equal(brisca.getRoundNumber(),9)
        chai.assert.equal(brisca.getPlayerPoints(0),23)
        chai.assert.equal(brisca.getPlayerPoints(1),25)

        //Turno 9

        chai.assert.equal(brisca.whosTurnIsIt(),0)
        brisca.sacarCarta(0,new Naipe(10,Palo.Espadas))
        brisca.sacarCarta(1,new Naipe(11,Palo.Espadas))

        chai.assert.equal(brisca.getPlayerPoints(0),23)
        chai.assert.equal(brisca.getPlayerPoints(1),30)

        //Turno 10

        chai.assert.equal(brisca.whosTurnIsIt(),1)

        brisca.sacarCarta(1,new Naipe(8,Palo.Espadas))
        brisca.sacarCarta(0,new Naipe(10,Palo.Copas))

        chai.assert.equal(brisca.getPlayerPoints(0),23)
        chai.assert.equal(brisca.getPlayerPoints(1),32)
        chai.assert.equal(brisca.getRoundNumber(),11)

        //Turno 11

        chai.assert.equal(brisca.whosTurnIsIt(),1)
        brisca.sacarCarta(1,new Naipe(10,Palo.Bastos))
        brisca.sacarCarta(0,new Naipe(6,Palo.Bastos))

        chai.assert.equal(brisca.getPlayerPoints(0),23)
        chai.assert.equal(brisca.getPlayerPoints(1),34)

        chai.assert.equal(brisca.getRoundNumber(),12)

        //Turno 12

        chai.assert.equal(brisca.whosTurnIsIt(),1)

        brisca.sacarCarta(1,new Naipe(3,Palo.Oros))
        brisca.sacarCarta(0,new Naipe(8,Palo.Bastos))

        chai.assert.equal(brisca.getPlayerPoints(0),33)
        chai.assert.equal(brisca.getPlayerPoints(1),34)

        //Turno 13

        brisca.sacarCarta(0,new Naipe(1,Palo.Bastos))
        brisca.sacarCarta(1,new Naipe(12,Palo.Bastos))

        chai.assert.equal(brisca.getPlayerPoints(0),48)
        chai.assert.equal(brisca.getPlayerPoints(1),34)

        //Turno 14

        chai.assert.equal(brisca.whosTurnIsIt(),0)
        chai.assert.equal(brisca.getRoundNumber(),14)

        brisca.sacarCarta(0,new Naipe(4,Palo.Oros))
        brisca.sacarCarta(1,new Naipe(5,Palo.Oros))

        chai.assert.equal(brisca.getPlayerPoints(0),48)
        chai.assert.equal(brisca.getPlayerPoints(1),34)

        chai.assert.equal(brisca.whosTurnIsIt(),1)

        //Turno 15

        brisca.sacarCarta(1,new Naipe(2,Palo.Bastos)) 
        brisca.sacarCarta(0,new Naipe(7,Palo.Bastos))

        chai.assert.equal(brisca.whosTurnIsIt(),0)

        chai.assert.equal(brisca.getPlayerPoints(0),48)
        chai.assert.equal(brisca.getPlayerPoints(1),34)


        //chai.assert.equal(brisca.whosTurnIsIt(),1)
        //chai.assert.equal(brisca.getPlayerPoints(),1)
        //chai.assert.equal(brisca.getRoundNumber(),1)
    })

    it('Prueba juego 2', function(){

        let mockedBaraja:Baraja = mock(Baraja);

        when(mockedBaraja.getCard())
        .thenReturn(new Naipe(2,Palo.Bastos)) //Carta de triunfo
        .thenReturn(new Naipe(3,Palo.Oros))  //Cartas jugador 0
        .thenReturn(new Naipe(10,Palo.Oros))
        .thenReturn(new Naipe(1,Palo.Bastos))
        .thenReturn(new Naipe(7,Palo.Espadas)) //Cartas jugador 1
        .thenReturn(new Naipe(5,Palo.Copas))
        .thenReturn(new Naipe(12,Palo.Oros))

        let bar:Baraja = instance(mockedBaraja);

        let brisca = new Brisca(bar, logger)
        brisca.repartir();

        brisca.sacarCarta(0,new Naipe(3,Palo.Oros))
        brisca.sacarCarta(1,new Naipe(12,Palo.Oros))

        //Turno 0
        //brisca.sacarCarta(0,new Naipe(3,Palo.Bastos))
        //brisca.sacarCarta(1,new Naipe(7,Palo.Espadas))

        
    })


    afterEach(function() {
      });
})