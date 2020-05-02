import type { Palo } from "./Palo";
const assert = require('assert').strict;

/**
 * Clase que representa una carta
 *
 */

export default class Naipe {

    #numero = 0
    #palo: Palo
    
    /**
     * @return El palo de esta carta
     */
    get palo(){
        return this.#palo
    }
    get numero() {
        return this.#numero;
      }

    constructor(numero: number,palo: Palo){
        assert(numero>=1 && numero <= 12);

        this.#numero = numero;
        this.#palo = palo;
    }

    equals(card: Naipe): boolean{
        return this.palo == card.palo && this.numero == card.numero;
    }

    toString(): string{
        return `${this.#numero} de ${this.#palo}` ;
    }

}