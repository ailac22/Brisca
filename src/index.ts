import Naipe from './Cartas/Naipe'
import Palo from './Cartas/Palo'
import Baraja from './Cartas/Baraja'
import Brisca from './Entidades/Brisca'
let express = require('express');
let app = require('express')();
let http = require('http').createServer(app);
let io = require('socket.io')(http);
const path = require('path');

let sockets = new Array()

console.log(__dirname)
app.use(express.static(__dirname + '/public'))
  
http.listen(5000, () => {
    console.log('listening on *:5000');
});

io.on('connection', (socket) => {

    sockets.push(socket)
console.log('a user connected');


brisca.repartir();
//brisca.sacarCarta(0,new Naipe(2,Palo.Bastos))
//brisca.sacarCarta(1,new Naipe(7,Palo.Bastos))
});

console.log("inicio")


let brisca = new Brisca(new Baraja)

brisca.setCallbackFunction((wha) => {

    if (wha.player < sockets.length){
    console.log("will be emitting" + wha.player)
        sockets[wha.player].emit('action', wha)
        console.log("action")
    }
})




/* let baraja = new Baraja()



let n = baraja.getCard()



console.log(n.toString()); 

console.log(baraja.toString()) */