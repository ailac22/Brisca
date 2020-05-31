import Naipe from '../Cartas/Naipe'
const assert = require('assert').strict;
import _ = require('lodash')

export default class Jugador {
    private id: Number = 0
    private cartas: Naipe[] = []
    private cartasGanadas: Naipe[] = []

    constructor () {
      this.id = 0
    }

    /**
     * Checks if this player has a card
     * 
     * @param card Card to be tested whether this player has it or not
     * 
     * @returns Whether or not this player has the card
     */
    hasCard(card: Naipe): boolean {
        return this.cartas.some((c2: Naipe) => card.equals(c2))
    }

    /**
     * Returns number of cards in player's hand
     * 
     * @param card 
     */
    numCards(): number {
        return this.cartas.length
    }

    /**
     * Removes a card from player's hand
     * 
     * @param card 
     */
    takeAwayCard(card: Naipe): void {
        _.remove(this.cartas,(c:Naipe) => c.equals(card))

    }

    /**
     * Add a card to this player's hand
     * 
     * @param card Card to be added to this player 
     */
    addCard (card: Naipe): void {

        if (this.cartas.length >= 3) return;
        this.cartas.push(card)
        
    }

    /**
     * Add a card to the stack of cards won by this player
     * 
     * @param card Card to be added to won cards
     */
    addWonCard(card: Naipe): void {

        this.cartasGanadas.push(card);
    }

    //TODO: This is returning by reference

    /**
     * Get all the cards won by the player so far
     * 
     * 
     * @param card Card to be added to won cards
     */
    public getWonCards(): Naipe[] {
        return this.cartasGanadas
    }

    toString(){
        return 'Cartas: ' + this.cartas.map((n:Naipe) => n.toString()).join() + 
        '\nCartas Ganadas' + this.cartasGanadas.map((n:Naipe) => n.toString()).join()
    }
}
