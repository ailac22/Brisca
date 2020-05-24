import Brisca from '../src/Entidades/Brisca'
import Naipe from '../src/Cartas/Naipe'
import Palo from '../src/Cartas/Palo'
import Baraja from '../src/Cartas/Baraja'
import { mock, when, instance } from 'ts-mockito';
import chai = require('chai')

describe('Brisca', function(){

    it('Should', function(){

        let obj = {
            baraja: []
        }
        
        let mockedBaraja:Baraja = mock(Baraja);

        when(mockedBaraja.getCard())
        .thenReturn(new Naipe(2,Palo.Bastos)) //Carta de triunfo
        .thenReturn(new Naipe(3,Palo.Bastos))  //Cartas jugador 0
        .thenReturn(new Naipe(10,Palo.Oros))
        .thenReturn(new Naipe(1,Palo.Bastos))
        .thenReturn(new Naipe(7,Palo.Espadas)) //Cartas jugador 1
        .thenReturn(new Naipe(5,Palo.Copas))
        .thenReturn(new Naipe(11,Palo.Espadas))
        .thenReturn(new Naipe(4,Palo.Copas))
        .thenReturn(new Naipe(12,Palo.Copas))

        let bar:Baraja = instance(mockedBaraja);
        let bastos2 = new Naipe(2,Palo.Bastos)

        let brisca = new Brisca(2, bar)
        brisca.repartir();

        //Turno 1
        brisca.sacarCarta(0,new Naipe(3,Palo.Bastos))
        brisca.sacarCarta(1,new Naipe(7,Palo.Espadas))

        //Turno 2
        brisca.sacarCarta(0,new Naipe(10,Palo.Oros))
        brisca.sacarCarta(1,new Naipe(12,Palo.Copas))
    })

    afterEach(function() {
      });
})