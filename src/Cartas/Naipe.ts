import type { Palo } from "./Palo";
const assert = require('assert').strict;

export default class Naipe {

    #numero = 0
    #palo: Palo
    
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

    toString(){
        return `${this.#numero} de ${this.#palo}` ;
    }

}