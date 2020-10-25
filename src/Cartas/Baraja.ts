import Naipe from './Naipe'
import Palo from './Palo'
import _ = require('lodash')

export default class Baraja {

    private baraja: Naipe[] = []
    
    constructor(){

        for (let numero: number = 1; numero <= 12; ++numero){
                this.baraja.push(new Naipe(numero,Palo.Bastos))
                this.baraja.push(new Naipe(numero,Palo.Oros))
                this.baraja.push(new Naipe(numero,Palo.Copas))
                this.baraja.push(new Naipe(numero,Palo.Espadas))
        }
            
        this.baraja = _.shuffle(this.baraja)
    }

    toString(){
        return this.baraja.map((n) => n.toString() + " ").join();
    }
    public getCard(){
        return this.baraja.pop();
    }

    public numCards(){
        return this.baraja.length;
    }
}

