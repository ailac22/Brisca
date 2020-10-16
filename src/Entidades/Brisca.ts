import Baraja from '../Cartas/Baraja'
import Naipe from '../Cartas/Naipe'
import Jugador from '../Entidades/Jugador'
import machina = require('machina')
import _ = require('lodash')
import Palo from '../Cartas/Palo'


enum ActionType {
    CartaDeTriunfoInfo = "CartaDeTriunfoInfo",
    RoundStarted = "RoundStarted",
    RoundTurn = "RoundTurn",
    CardDelivered = "CardDelivered",
    PlayerWonRound = "PlayerWonRound",
    CardDrawn = "CardDrawn"
}

interface ActionInterface {
    action: ActionType
}
/**
 * Class that encodes the rules for the card game Brisca
 * 
 */

export default class Brisca {
    public gameFSM: machina.Fsm
    private deck: Baraja
    private players: Jugador[] = []

    //private emitter:EventEmitter = new EventEmitter

    /** Map from card number to worth in points. Cards not in the map are worth 0 points
     * and which wins is determined by their numerical ordering
     */
    private pointsByCard: Map<number,number> = new Map([[1,11],[3,10],[12,4],[11,3],[10,2]])

    /** This card will be taken at the end of the game */
    private cartaDeTriunfo: Naipe

    /** Palo de triunfo */
    private paloDeTriunfo: Palo

    /** Indicates whose turn to play a card is it */
    private currentPlayerTurn: number = 0

    private cardsDrawn: Naipe[]

    private roundNumber: number = 0;

    constructor (inputdeck: Baraja) {
        const numPlayers: number = 2;
        this.deck = inputdeck
        this.cardsDrawn = new Array(numPlayers).fill(null)
        this.players = new Array(numPlayers).fill(null).map(() => new Jugador());
        this.buildSM()
        
    }

    public setCallbackFunction(func){

        this.gameFSM.on('action',func)
    }

    public repartir(){
        this.gameFSM.handle("repartoInicial");
    }

    public getPlayerPoints(id: number): number{
        
        return _.sum(this.players[id].getWonCards().map((card) => this.pointsByCard.get(card.numero)))
    }

    public whosTurnIsIt():number {
        return this.currentPlayerTurn
    }

    public sacarCarta(playerNum: number, naipe: Naipe){
        console.log("sacar carta " + naipe.toString())
        this.gameFSM.handle('sacarCarta', {playerNum,naipe});
    }

    public getRoundNumber(): number {
        return this.roundNumber
    }

    private nextPlayerTurn() {
        this.currentPlayerTurn = ++this.currentPlayerTurn % this.players.length
    }

    private sacarCartaPrv(playerNum: number, naipe: Naipe): boolean {
        
        console.log("sacarCartaPrv")
        if (playerNum < 0 || playerNum >= this.players.length) return false;
        if (playerNum != this.currentPlayerTurn) return false;

        if (this.players[playerNum].hasCard(naipe)) {
            console.log("this player has card")
            this.players[playerNum].takeAwayCard(naipe)
            this.cardsDrawn[playerNum] = naipe
            this.gameFSM.emit('action', { action: ActionType.CardDrawn, player: playerNum, card: naipe, exclusive: false});
            console.log(`Player ${playerNum} drew card ${naipe}`)
            this.nextPlayerTurn()
            if (!this.allCardsDrawn())
                this.gameFSM.emit('action', { action: ActionType.RoundTurn, player: this.whosTurnIsIt(), exclusive: false });
        }
        else {
            console.log("this player has not the card")
        }
    }

    private allCardsDrawn(){

        return this.cardsDrawn.every((card) => card != null)
    }

    /**
     * Deals the cards
     */
    private repartoInicialPrv() {

        this.cartaDeTriunfo = this.deck.getCard()
        this.gameFSM.emit('action', { action: ActionType.CartaDeTriunfoInfo, card: this.cartaDeTriunfo, exclusive: false});
        this.paloDeTriunfo = this.cartaDeTriunfo.palo
        this.currentPlayerTurn = 0;
        /* repartir */
        for (let player of this.players) {
            for (let i = 0; i < 3; ++i){
                let card = this.deck.getCard()
                player.addCard(card)
                this.gameFSM.emit('action', { action: ActionType.CardDelivered, player: this.players.indexOf(player), card, exclusive: true });
            }
        }
    }



    private verifyWinner(): number{
        if (!this.cardsDrawn.every((card) => card.palo == this.paloDeTriunfo) && 
        this.cardsDrawn.some((card) => card.palo == this.paloDeTriunfo)){
            return this.cardsDrawn.findIndex((card:Naipe) => card.palo == this.paloDeTriunfo)
        }
        else if (!this.cardsDrawn.every((card) => card.palo == this.cardsDrawn[this.currentPlayerTurn].palo)){
            return this.currentPlayerTurn
        }

        let cardValues:number[] = this.cardsDrawn.map((card) => {
            let value = this.pointsByCard.get(card.numero)
            if (value == undefined) value = 0;
            return value
        })

        if (cardValues.every((value) => value == 0)){
            let maxOrder = Math.max.apply(null,this.cardsDrawn.map(card => card.numero));
            return this.cardsDrawn.findIndex((card:Naipe) => card.numero == maxOrder)
        }
        else {
            let maxValue = Math.max.apply(null,cardValues);
            return cardValues.indexOf(maxValue)
        }
    }

    toString(){
        return "Carta de triunfo: " + this.cartaDeTriunfo.toString() + "\n" + this.deck.toString() + ", " +  "num cartas: " + this.deck.numCards()
    }

    buildSM () {
      let este = this;
      this.gameFSM = new machina.Fsm({

        initialize: function (options) {

        },

        initialState: 'uninitialized',

        states: {

          uninitialized: {

            repartoInicial: 'repartoInicial'

          },
          repartoInicial: {

            _onEnter: function(){
                este.repartoInicialPrv()
                this.transition('turno')
            }
          },
          turno: {
              
            _onEnter: function(){
                
                this.emit('action', { action: ActionType.RoundStarted, player: este.whosTurnIsIt(), exclusive: false });
                this.emit('action', { action: ActionType.RoundTurn, player: este.whosTurnIsIt(), exclusive: false });
            },

            sacarCarta: function({playerNum, naipe}: {playerNum:number, naipe:Naipe}){
                console.log("hola")
                este.sacarCartaPrv(playerNum,naipe)
                if (este.allCardsDrawn()){
                    this.transition('roundEnd')
                }
            }

          },
          roundEnd: {

            _onEnter: function(){
                let winner = este.verifyWinner()
                este.cardsDrawn.forEach((card:Naipe) => {este.players[winner].addWonCard(card)})
                este.cardsDrawn.fill(null)

                este.currentPlayerTurn = winner;

                let i = winner
                do {
                    let card = este.deck.getCard();
                    este.players[i].addCard(card)
                    this.emit('action', { action: ActionType.CardDelivered, player: i, card, exclusive: true });
                    i = (i + 1) % este.players.length
                } while (i != winner)


                let playersScore = new Array(este.players.length).fill(null).map((cv,index) => {
                    console.log(index)
                    console.log(este.getPlayerPoints(index))
                    return este.getPlayerPoints(index)
                })
                console.log(`puntuaciones:  ${playersScore}`)
                this.emit('action', {action: ActionType.PlayerWonRound, playerNum: winner, playersScore, exclusive: false})
                console.log(`Player ${winner} won round`)
                

                ++este.roundNumber

                setTimeout( () => {
                    this.transition('turno');
                }, 8000 );
                
            }
          },

          repartir: {


          },
          endgame: {

          }

        }
    })
    }
}
