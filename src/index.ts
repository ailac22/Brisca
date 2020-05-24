import Naipe from './Cartas/Naipe'
import Palo from './Cartas/Palo'
import Baraja from './Cartas/Baraja'
import Brisca from './Entidades/Brisca'
let app = require('express')();
let http = require('http').createServer(app);
let io = require('socket.io')(http);


/* app.get('/', (req, res) => {
    res.send(`<html><head>
    <script src="/socket.io/socket.io.js"></script>
    <script
			  src="https://code.jquery.com/jquery-3.5.1.slim.min.js"
			  integrity="sha256-4+XzXVhsDmqanXGHaHvgh1gMQKX40OUvDEBTu8JcmNs="
			  crossorigin="anonymous"></script>
    <script>
      var socket = io();
      socket.on('action', function(msg){
          console.log(msg)
        $('body').append(msg.action);
      });
    </script>
    </head><body>

    

    <h1>Hello world</h1></body></html>`);
});
  
http.listen(3000, () => {
    console.log('listening on *:3000');
});

io.on('connection', (socket) => {

console.log('a user connected');
});

console.log("inicio") */



let brisca = new Brisca(new Baraja)

brisca.setCallbackFunction((wha) => {


    io.emit('action', wha)
    console.log("action")
})

brisca.repartir();
brisca.sacarCarta(0,new Naipe(2,Palo.Bastos))
brisca.sacarCarta(1,new Naipe(7,Palo.Bastos))


/* let baraja = new Baraja()



let n = baraja.getCard()



console.log(n.toString()); 

console.log(baraja.toString()) */