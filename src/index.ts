import Naipe from './Cartas/Naipe'
import Palo from './Cartas/Palo'
import Baraja from './Cartas/Baraja'
import Brisca from './Entidades/Brisca'
let express = require('express');
let app = require('express')();
let http = require('http').createServer(app);
let io = require('socket.io')(http);
const path = require('path');
import winston = require('winston')

let sockets = new Array()

console.log(__dirname)
app.use(express.static(__dirname + '/public'))
  
http.listen(5000, () => {
    console.log('listening on *:5000');
});

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    defaultMeta: { service: 'user-service' },
    transports: [
      //
      // - Write all logs with level `error` and below to `error.log`
      // - Write all logs with level `info` and below to `combined.log`
      //
      new winston.transports.File({ filename: 'error.log', level: 'error' }),
      new winston.transports.File({ filename: 'combined.log' }),
    ],
  });

  logger.add(new winston.transports.Console({
    format: winston.format.simple(),
  }));

  

io.on('connection', (socket) => {

    socket.on('carta_sacada', (msg) => {
        if (msg != null){
            let naipe = new Naipe(msg.mNumero,msg.mPalo)
            console.log('whaaa', sockets.indexOf(socket), 333)
            brisca.sacarCarta(sockets.indexOf(socket),naipe)
        }
    });
    sockets.push(socket)
    socket.emit('info_jugador', {numJugador: sockets.length - 1})
    console.log('a user connected');

    if (sockets.length == 2){
        brisca.repartir();
    }

//brisca.sacarCarta(0,new Naipe(2,Palo.Bastos))
//brisca.sacarCarta(1,new Naipe(7,Palo.Bastos))
});



let brisca = new Brisca(new Baraja, logger)

brisca.configureMustDoPauses(false)

brisca.setCallbackFunction((wha) => {

    
    //if (wha.player < sockets.length){
        console.log("will be emitting" + wha.action)
        if (wha.exclusive){
            console.log('emitting exclusive event')
            sockets[wha.player].emit('action', wha)
        }
        else {
            console.log('broadcast event')
            io.emit('action', wha)
        }
    //}
})




/* let baraja = new Baraja()



let n = baraja.getCard()



console.log(n.toString()); 

console.log(baraja.toString()) */