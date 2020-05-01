import Baraja from '../Cartas/Baraja'
import Naipe from '../Cartas/Naipe'
import Jugador from '../Entidades/Jugador'
import machina = require('machina')
import _ = require('lodash')

export default class Brisca {
    public gameFSM: machina.Fsm
    private deck: Baraja = new Baraja
    public players: Jugador[] = []


    constructor (numJugadores: number) {
        this.players = new Array(numJugadores).fill(null).map(() => new Jugador());
        this.buildSM()
    }

    public repartir(){
        this.gameFSM.handle("repartir");
    }

    public repartirPrv() {

        /* repartir */
        console.log(this.players.length)
        for (let player of this.players) {
            for (let i = 0; i < 3; ++i){
                let card = this.deck.getCard()
                player.addCard(card)
            }
        }
    }

    toString(){
        return this.deck.toString() + ", " +  "num cartas: " + this.deck.numCards()
    }

    buildSM () {
      let este = this;
      this.gameFSM = new machina.Fsm({

        initialize: function (options) {

        },

        initialState: 'uninitialized',

        states: {

          uninitialized: {

            repartir: 'repartir'

          },
          repartir: {

            _onEnter: function(){
                console.log("hola");
                este.repartirPrv();
            }
          }
        }
    })
    }
}

/* 
        initialize: function (options) {

        },

        initialState: 'uninitialized',

        states: {

          uninitialized: {

            repartir: 'repartir'

          },
          repartir: {

            _onEnter: function(){
                this.repartirPrv();

            }
          }
        }
 */