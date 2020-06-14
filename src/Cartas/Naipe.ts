import type Palo  from "./Palo";
const assert = require('assert').strict;

/**
 * Clase que representa una carta
 *
 */

export default class Naipe {

    private mNumero = 0
    private mPalo: Palo
    
    /**
     * @return El palo de esta carta
     */
    get palo(){
        return this.mPalo
    }
    get numero() {
        return this.mNumero;
      }

    constructor(numero: number,palo: Palo){
        assert(numero>=1 && numero <= 12);

        this.mNumero = numero;
        this.mPalo = palo;
    }

    equals(card: Naipe): boolean{
        return this.mPalo == card.mPalo && this.mNumero == card.mNumero;
    }

    toString(): string{
        return `${this.mNumero} de ${this.mPalo}` ;
    }

    toJSON() {
        return {mNumero: this.mNumero, mPalo: this.mPalo}
    }
}