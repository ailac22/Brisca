
$( document ).ready( () => {

  var socket = io();
  let cartas = new Array(3).fill(null)
  let cartasSacadas = new Array(2).fill(null)
  let numJugador = -1

  $("#buttons").children().each((index,elem) => {
    
    elem.onclick = () => {
      console.log(elem.innerHTML)
      socket.emit('carta_sacada', cartas[index])
      cartas[index] = null
    }
  })
  socket.on('info_jugador', (msg) =>{
    console.log("soy el jugador: " + msg.numJugador)
    numJugador = msg.numJugador
  })

  socket.on('action', function(msg){
    if (msg.action === "CardDelivered"){

        console.log(msg)
        let empty = cartas.indexOf(null)
        console.log("empty " + empty)
        cartas[empty] = msg.card
        console.log($("#buttons").children())
        $("#buttons").children().eq(empty).html(`${msg.card.mNumero} de ${msg.card.mPalo}`)
      
    }
    else if (msg.action === "CardDrawn"){
      console.log(`push! de ${msg.card} de ${msg.player}`)
      cartasSacadas[msg.player] = msg.card
      if (cartasSacadas[0] != null)
        $('#slotCartaCero').html(`Carta sacada por jugador cero: ${cartasSacadas[0].mNumero} de ${cartasSacadas[0].mPalo}`)
      if (cartasSacadas[1] != null)
        $('#slotCartaUno').html(`Carta sacada por jugador uno: ${cartasSacadas[1].mNumero} de ${cartasSacadas[1].mPalo}`)
    }
    else if (msg.action === "CartaDeTriunfoInfo"){
      $('#cartaTriunfo').html(`Carta de triunfo: ${msg.card.mNumero} de ${msg.card.mPalo}`)
    }
    else if (msg.action === "RoundTurn"){

      if (msg.player === numJugador){
        $('#teToca').html("Te toca a ti")
        disableButtons(false)
      }
      else {
        $('#teToca').html("")
        disableButtons(true)
      }
    }
    else if (msg.action === "RoundStarted"){
      cartasSacadas = new Array(2).fill(null)
      $('#slotCartaCero').html("")
      $('#slotCartaUno').html("")
    }
    else if (msg.action === "PlayerWonRound"){
      disableButtons(true)
      $('#teToca').html("")
      $('#puntuaciones').html("puntuaciones: " + msg.playersScore);
    }

  });

  function disableButtons(flag){
    $("#buttons").children().each(function(index, element) { 
      $(element).prop("disabled",flag); 
  });
  }
})