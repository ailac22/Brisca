import Baraja from '../Cartas/Baraja'
import Naipe from '../Cartas/Naipe'
import Jugador from '../Entidades/Jugador'
import Palo from '../Cartas/Palo'
import machina = require('machina')
import _ = require('lodash')
import winston = require('winston')

enum ActionType {
    CartaDeTriunfoInfo = 'CartaDeTriunfoInfo',
    RoundStarted = 'RoundStarted',
    RoundTurn = 'RoundTurn',
    CardDelivered = 'CardDelivered',
    PlayerWonRound = 'PlayerWonRound',
    CardDrawn = 'CardDrawn'
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

    // private emitter:EventEmitter = new EventEmitter

    /** Map from card number to worth in points. Cards not in the map are worth 0 points
     * and which wins is determined by their numerical ordering
     */
    private pointsByCard: Map<number, number> = new Map([[1, 11], [3, 10], [12, 4], [11, 3], [10, 2]])

    /** This card will be taken at the end of the game */
    private cartaDeTriunfo: Naipe

    /** Palo de triunfo */
    private paloDeTriunfo: Palo

    /** Indicates whose turn to play a card is it */
    private currentPlayerTurn: number = 0

    private cardsDrawn: Naipe[]

    private roundNumber: number = 0;

    private logger;

    private mustDoPauses = true;

    constructor (inputdeck: Baraja, logger: any) {
      const numPlayers: number = 2
      this.deck = inputdeck
      this.cardsDrawn = new Array(numPlayers).fill(null)
      this.players = new Array(numPlayers).fill(null).map(() => new Jugador())
      this.logger = logger
      this.buildSM()
    }

    public setCallbackFunction (func) {
      
      this.gameFSM.on('action', func)
    }

    public configureMustDoPauses(flag){
      this.mustDoPauses = flag;
    }

    public repartir () {
      this.gameFSM.handle('repartoInicial')
    }

    public getPlayerPoints (id: number): number {
      return _.sum(this.players[id].getWonCards().map((card) => this.pointsByCard.get(card.numero)))
    }

    public whosTurnIsIt ():number {
      return this.currentPlayerTurn
    }

    public sacarCarta (playerNum: number, naipe: Naipe) {
      this.logger.log({ level: 'info', message: 'Function sacarCarta' })
      this.gameFSM.handle('sacarCarta', { playerNum, naipe })
    }

    public getRoundNumber (): number {
      return this.roundNumber
    }

    private nextPlayerTurn () {
      this.currentPlayerTurn = ++this.currentPlayerTurn % this.players.length
    }

    private sacarCartaPrv (playerNum: number, naipe: Naipe): boolean {

      this.logger.log({ level: 'info', message: 'Function sacarCartaPrv' })

      if (playerNum < 0 || playerNum >= this.players.length) {
        this.logger.log({ level: 'info', message: 'Player number is outside boundaries' })
        return false
      }
      if (playerNum !== this.currentPlayerTurn) {
        this.logger.log({ level: 'info', message: `It's not player's ${playerNum}` })
        return false
      }

      if (this.players[playerNum].hasCard(naipe)) {
        this.logger.log({ level: 'info', message: `Player ${playerNum} will draw ${naipe.toString()}` })

        this.players[playerNum].takeAwayCard(naipe)
        this.cardsDrawn[playerNum] = naipe
        this.gameFSM.emit('action', { action: ActionType.CardDrawn, player: playerNum, card: naipe, exclusive: false })

        
        this.logger.log({ level: 'info', message: `Player ${playerNum} drew card ${naipe.toString()}` })

        this.nextPlayerTurn()
        if (!this.allCardsDrawn()) { this.gameFSM.emit('action', { action: ActionType.RoundTurn, player: this.whosTurnIsIt(), exclusive: false }) }

        this.logger.log({ level: 'info', message: `It's player ${this.whosTurnIsIt()}'s turn` })

      } else {
        this.logger.log({ level: 'info', message: `Player ${playerNum} does not have card ${naipe.toString()}` })
      }
    }

    private allCardsDrawn () {
      return this.cardsDrawn.every((card) => card != null)
    }

    /**
     * Deals the cards
     */
    private repartoInicialPrv () {
      this.cartaDeTriunfo = this.deck.getCard()
      this.gameFSM.emit('action', { action: ActionType.CartaDeTriunfoInfo, card: this.cartaDeTriunfo, exclusive: false })
      this.paloDeTriunfo = this.cartaDeTriunfo.palo
      this.currentPlayerTurn = 0
      /* repartir */
      for (const player of this.players) {
        for (let i = 0; i < 3; ++i) {
          const card = this.deck.getCard()
          player.addCard(card)
          this.gameFSM.emit('action', { action: ActionType.CardDelivered, player: this.players.indexOf(player), card, exclusive: true })
        }
      }
    }

    private dealFollowingCards(winner: number) {


      let i = winner
      if (this.deck.numCards() !== 1){

        do {
          const card = this.deck.getCard()
          this.players[i].addCard(card)
          this.gameFSM.emit('action', { action: ActionType.CardDelivered, player: i, card, exclusive: true })
          i = (i + 1) % this.players.length
        } while (i != winner)

      }
      else {
        this.logger.log({ level: 'info', message: 'Dealing last cards!' })
        const card = this.deck.getCard()
        this.players[i].addCard(card)
        this.gameFSM.emit('action', { action: ActionType.CardDelivered, player: i, card, exclusive: true })
        i = (i + 1) % this.players.length
        this.players[i].addCard(this.cartaDeTriunfo)
        let carta = this.cartaDeTriunfo
        this.gameFSM.emit('action', { action: ActionType.CardDelivered, player: i, card: carta, exclusive: true })
      }
      

    }

    private verifyWinner (): number {
      if (!this.cardsDrawn.every((card) => card.palo == this.paloDeTriunfo) &&
        this.cardsDrawn.some((card) => card.palo == this.paloDeTriunfo)) {
        return this.cardsDrawn.findIndex((card:Naipe) => card.palo == this.paloDeTriunfo)
      } else if (!this.cardsDrawn.every((card) => card.palo == this.cardsDrawn[this.currentPlayerTurn].palo)) {
        return this.currentPlayerTurn
      }

      const cardValues:number[] = this.cardsDrawn.map((card) => {
        let value = this.pointsByCard.get(card.numero)
        if (value == undefined) value = 0
        return value
      })

      if (cardValues.every((value) => value == 0)) {
        const maxOrder = Math.max.apply(null, this.cardsDrawn.map(card => card.numero))
        return this.cardsDrawn.findIndex((card:Naipe) => card.numero == maxOrder)
      } else {
        const maxValue = Math.max.apply(null, cardValues)
        return cardValues.indexOf(maxValue)
      }
    }

    toString () {
      return 'Carta de triunfo: ' + this.cartaDeTriunfo.toString() + '\n' + this.deck.toString() + ', ' + 'num cartas: ' + this.deck.numCards()
    }

    buildSM () {
      const este = this
      this.gameFSM = new machina.Fsm({

        initialize: function (options) {

        },

        initialState: 'uninitialized',

        states: {

          uninitialized: {

            repartoInicial: 'repartoInicial'

          },
          repartoInicial: {

            _onEnter: function () {
              este.repartoInicialPrv()
              this.transition('turno')
            }
          },
          turno: {

            _onEnter: function () {
              this.emit('action', { action: ActionType.RoundStarted, player: este.whosTurnIsIt(), exclusive: false })
              this.emit('action', { action: ActionType.RoundTurn, player: este.whosTurnIsIt(), exclusive: false })
            },

            sacarCarta: function ({ playerNum, naipe }: {playerNum:number, naipe:Naipe}) {
              este.logger.log("info", "Sacar carta handler")
              este.sacarCartaPrv(playerNum, naipe)
              if (este.allCardsDrawn()) {
                this.transition('roundEnd')
              }
            }

          },
          roundEnd: {

            _onEnter: function () {
              const winner = este.verifyWinner()
              este.cardsDrawn.forEach((card:Naipe) => { este.players[winner].addWonCard(card) })
              este.cardsDrawn.fill(null)

              este.currentPlayerTurn = winner

              este.logger.log("info", "Calculating round end")
              este.players.forEach( p => {
                console.log(p.numCards())
              })
              if (este.players.some((player: Jugador) => {return player.numCards() != 0})){
                const playersScore = new Array(este.players.length).fill(null).map((cv, index) => {
                  return este.getPlayerPoints(index)
                })
                this.emit('action', { action: ActionType.PlayerWonRound, playerNum: winner, playersScore, exclusive: false })

                ++este.roundNumber

                if (este.deck.numCards() != 0){
                  este.dealFollowingCards(winner)
                  console.log("cards dealt")
                }
  
                if (este.mustDoPauses){
                  setTimeout( () => {
                    this.transition('turno');
                  }, 8000 );
                }
                else
                  this.transition('turno');
              }
              else {
                este.logger.log("info", "ENDGAME")
                this.transition('endgame')
              }
            }
          },

          repartir: {

          },
          endgame: {
            _onEnter: function () {
              este.logger.log("info", "FIN DE JUEGO")
            }
            
          }

        }
      })
    }
}
