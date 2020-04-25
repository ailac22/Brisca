import type { Palo } from "./Palo";

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
        this.#numero = numero;
        this.#palo = palo;
    }

    toString(){
        return this.#numero + " de " + this.#palo ;
    }

}