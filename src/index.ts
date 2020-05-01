import Naipe from './Cartas/Naipe'
import {Palo} from './Cartas/Palo'
import Baraja from './Cartas/Baraja'
import Brisca from './Entidades/Brisca'


let brisca = new Brisca(2)

brisca.repartir();

console.log(brisca.toString())

/* let baraja = new Baraja()



let n = baraja.getCard()



console.log(n.toString()); 

console.log(baraja.toString()) */