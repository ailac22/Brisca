
$( document ).ready( () => {

  console.log("hola")
  var socket = io();
  let cartas = new Array(3).fill(null)

  socket.on('action', function(msg){
    if (msg.action === "CardDelivered"){

      console.log(msg)
      let empty = cartas.indexOf(null)
      console.log("empty " + empty)
       cartas[empty] = msg.card
       console.log($("#buttons").children())
      $("#buttons").children().eq(empty).html(`${msg.card.mNumero} de ${msg.card.mPalo}`)
    }
  });
})