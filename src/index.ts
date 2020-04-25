import Naipe from './Cartas/Naipe'
import {Palo} from './Cartas/Palo'
import Baraja from './Cartas/Baraja'


let baraja = new Baraja()

let n = baraja.getCard()



console.log(n.numero + " de " + n.palo); 

console.log(baraja.toString())