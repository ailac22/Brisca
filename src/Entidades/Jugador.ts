import Naipe from '../Cartas/Naipe'
const assert = require('assert').strict;

export default class Jugador {
    private id: Number = 0
    private cartas: Naipe[] = []
    constructor () {
      this.id = 0
    }

    addCard (card: Naipe) {
        console.log(this.cartas.length)
        assert(this.cartas.length < 3)
        this.cartas.push(card)

    }

    toString(){
        return "Cartas: " + this.cartas.map((n:Naipe) => n.toString()).join()
    }
}
