
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');
var _ = require('underscore');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.cookieParser('your secret here'));
app.use(express.session());
app.use(app.router);
app.use(require('less-middleware')({ src: path.join(__dirname, 'public') }));
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.use(express.cookieParser());
app.use(express.session({secret: 'JimmyBosse'}));

app.get('/', routes.index);
app.get('/users', user.list);
app.use('/table', require('./routes/table'));

var server = http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});


var io = require('socket.io').listen(server);

var GameService = function(){
  function shuffle(array) {
    var m = array.length, t, i;

    // While there remain elements to shuffle…
    while (m) {

      // Pick a remaining element…
      i = Math.floor(Math.random() * m--);

      // And swap it with the current element.
      t = array[m];
      array[m] = array[i];
      array[i] = t;
    }

    return array;
  }
  var deck = shuffle([
    'sa','s2','s3','s4','s5','s6','s7','s8','s9','s10','sj','sq','sk',
    'ha','h2','h3','h4','h5','h6','h7','h8','h9','h10','hj','hq','hk',
    'ca','c2','c3','c4','c5','c6','c7','c8','c9','c10','cj','cq','ck',
    'da','d2','d3','d4','d5','d6','d7','d8','d9','d10','dj','dq','dk'
  ]);
  var game = {
    player1: {
      currentPile: 0,
      piles: [
        {position: 1, cards: [{ position: 1, value: deck[0] }, { position: 2, value: deck[1] }, { position: 3, value: deck[2] }, { position: 4, value: deck[3] }]},
        {position: 2, cards: [{ position: 1, value: deck[4] }, { position: 2, value: deck[5] }, { position: 3, value: deck[6] }, { position: 4, value: deck[7] }]},
        {position: 3, cards: [{ position: 1, value: deck[8] }, { position: 2, value: deck[9] }, { position: 3, value: deck[10]}, { position: 4, value: deck[11]}]},
        {position: 4, cards: [{ position: 1, value: deck[12]}, { position: 2, value: deck[13]}, { position: 3, value: deck[14]}, { position: 4, value: deck[15]}]},
        {position: 5, cards: [{ position: 1, value: deck[16]}, { position: 2, value: deck[17]}, { position: 3, value: deck[18]}, { position: 4, value: deck[19]}]},
        {position: 6, cards: [{ position: 1, value: deck[20]}, { position: 2, value: deck[21]}, { position: 3, value: deck[22]}, { position: 4, value: deck[23]}]}
      ]
    },
    board: {
      cards: [{ position: 1, value: deck[24] }, { position: 2, value: deck[25] }, { position: 3, value: deck[26] }, { position: 4, value: deck[27]}]
    },
    player2: {
      currentPile: 0,
      piles: [
        {position: 1, cards: [{ position: 1, value: deck[28] }, { position: 2, value: deck[29] }, { position: 3, value: deck[30]}, { position: 4, value: deck[31]}]},
        {position: 2, cards: [{ position: 1, value: deck[32] }, { position: 2, value: deck[33] }, { position: 3, value: deck[34]}, { position: 4, value: deck[35]}]},
        {position: 3, cards: [{ position: 1, value: deck[36] }, { position: 2, value: deck[37] }, { position: 3, value: deck[38]}, { position: 4, value: deck[39]}]},
        {position: 4, cards: [{ position: 1, value: deck[40] }, { position: 2, value: deck[41] }, { position: 3, value: deck[42]}, { position: 4, value: deck[43]}]},
        {position: 5, cards: [{ position: 1, value: deck[44] }, { position: 2, value: deck[45] }, { position: 3, value: deck[46]}, { position: 4, value: deck[47]}]},
        {position: 6, cards: [{ position: 1, value: deck[48] }, { position: 2, value: deck[49] }, { position: 3, value: deck[50]}, { position: 4, value: deck[51]}]}
      ]
    }
  };
  function filterPlayer1(player){
    return { piles: _.map(game.player1.piles, function(pile){
      if(pile.cards[0].value.charAt(1) === pile.cards[1].value.charAt(1) &&
        pile.cards[0].value.charAt(1) === pile.cards[2].value.charAt(1) &&
        pile.cards[0].value.charAt(1) === pile.cards[3].value.charAt(1)){
        return { position: pile.position, cards: _.map(pile.cards, function(card){
          return { status: 'up', position: card.position, value: card.value }
        })
        };
      }
      return { position: pile.position, cards: _.map(pile.cards, function(card){
        return { position: card.position, status: player === 'player1' && game.player1.currentPile === pile.position ? 'up' : 'down', value: player === 'player1' && game.player1.currentPile === pile.position ? card.value : '' }
      })}
    })};
  }
  function filterObserver1(){
    return { piles: _.map(game.player1.piles, function(pile){
      if(pile.cards[0].value.charAt(1) === pile.cards[1].value.charAt(1) &&
        pile.cards[0].value.charAt(1) === pile.cards[2].value.charAt(1) &&
        pile.cards[0].value.charAt(1) === pile.cards[3].value.charAt(1)){
        return { position: pile.position, cards: _.map(pile.cards, function(card){
          return { status: 'up', position: card.position, value: card.value }
        })
        };
      }
      return { position: pile.position, cards: _.map(pile.cards, function(card){
        return { status: 'down', position: card.position, value: '' }
      })}
    })};
  }
  function filterObserver2(){
    return { piles: _.map(game.player2.piles, function(pile){
      if(pile.cards[0].value.charAt(1) === pile.cards[1].value.charAt(1) &&
        pile.cards[0].value.charAt(1) === pile.cards[2].value.charAt(1) &&
        pile.cards[0].value.charAt(1) === pile.cards[3].value.charAt(1)){
        return { position: pile.position, cards: _.map(pile.cards, function(card){
          return { status: 'up', position: card.position, value: card.value }
        })
        };
      }
      return { position: pile.position, cards: _.map(pile.cards, function(card){
        return { status: 'down', position: card.position, value: '' }
      })}
    })};
  }
  function filterBoard(){
    return { cards: _.map(game.board.cards, function(card){
      return { position: card.position, status: 'up', value: card.value }
    })};
  }
  function filterPlayer2(player){
    return { piles: _.map(game.player2.piles, function(pile){
      if(pile.cards[0].value.charAt(1) === pile.cards[1].value.charAt(1) &&
        pile.cards[0].value.charAt(1) === pile.cards[2].value.charAt(1) &&
        pile.cards[0].value.charAt(1) === pile.cards[3].value.charAt(1)){
        return { position: pile.position, cards: _.map(pile.cards, function(card){
          return { status: 'up', position: card.position, value: card.value }
        })
        };
      }
      return { position: pile.position, cards: _.map(pile.cards, function(card){
        return { position: card.position, status: player === 'player2' && game.player2.currentPile === pile.position ? 'up' : 'down', value: player === 'player2' && game.player2.currentPile === pile.position ? card.value : '' }
      })}
    })};
  }
  function selectPile(player, position){
    if(player === 'observer'){
      return;
    }
    game[player].currentPile = position;
  }
  function swapCards(player, boardPosition, pilePosition, cardPosition){
    var boardCard = _.find(game.board.cards, function(card){
      return card.position === boardPosition;
    });
    var pileCard = _.find(_.find(game[player].piles, function(pile){
      return pile.position === pilePosition;
    }).cards, function(card){
      return card.position === cardPosition;
    });
    var newBoardValue = pileCard.value;
    var newPileValue =  boardCard.value;
    boardCard.value = newBoardValue;
    pileCard.value = newPileValue;
  }
  function checkVictory(player){
    if(game.winner === player){
      return true;
    }
    if(game.winner){
      return false;
    }
    var completedPiles = _.filter(game[player].piles, function(pile){
      if(pile.cards[0].value.charAt(1) === pile.cards[1].value.charAt(1) &&
        pile.cards[0].value.charAt(1) === pile.cards[2].value.charAt(1) &&
        pile.cards[0].value.charAt(1) === pile.cards[3].value.charAt(1)){
        return true;
      }
      return false;
    });
    if(completedPiles.length === 6){
      game.winner = player;
      return true;
    }
    return false;
  }
  return {
    hasWinner: function(){
      return game.winner;
    },
    getStatus: function(player){
      if(player === 'player1'){
        return {
          youare: 'player1',
          opponent: filterPlayer2(player),
          board: filterBoard(),
          player: filterPlayer1(player),
          opponentVictory: checkVictory('player2'),
          yourVictory: checkVictory('player1'),
          winner: game.winner,
          paused: !(player1Socket && player2Socket)
        };
      }
      if(player === 'player2'){
        return {
          youare: 'player2',
          opponent: filterPlayer1(player),
          board: filterBoard(),
          player: filterPlayer2(player),
          opponentVictory: checkVictory('player1'),
          yourVictory: checkVictory('player2'),
          winner: game.winner,
          paused: !(player1Socket && player2Socket)
        };
      }
      return {
        youare: 'observer',
        opponent: filterObserver1(),
        board: filterBoard(),
        player: filterObserver2(),
        winner: game.winner
      };
    },
    selectPile: selectPile,
    swapCards: swapCards
  }
};

var gameService = new GameService();

var player1Socket = null;
var player2Socket = null;

function whichPlayer(socket){
  if(player1Socket === socket){
    return 'player1';
  }
  if(player2Socket === socket){
    return 'player2';
  }
  return 'observer';
}

function newgame(){
  gameService = new GameService();
  io.sockets.emit('new game started, waiting for players...');
}

var disconnectTimeout;

function disconnected(){
  if(player1Socket && player2Socket){
    return;
  }
  io.sockets.emit('no reconnection within 30 seconds, killing game...');
  gameService = new GameService();
}

io.sockets.on('connection', function (socket) {
  if(player1Socket === null){
    io.sockets.emit('message', 'seating player1');
    socket.emit('message', 'you are player1');
    player1Socket = socket;
    socket.emit('seated');
    if(player2Socket){
      io.sockets.emit('ready');
    }
  } else if (player2Socket === null){
    io.sockets.emit('message', 'seating player2');
    socket.emit('message', 'you are player2');
    player2Socket = socket;
    io.sockets.emit('ready');
  }
  socket.on('disconnect', function () {
    if(player1Socket === socket){
      io.sockets.emit('message', 'player1 disconnected');
      io.sockets.emit('pause');
      player1Socket = null;
      //gameService = new GameService();
      setTimeout(disconnectTimeout, 30000);
      return;
    }
    if(player2Socket === socket){
      io.sockets.emit('message', 'player2 disconnected');
      io.sockets.emit('pause');
      player2Socket = null;
      //gameService = new GameService();
      setTimeout(disconnectTimeout, 30000);
      return;
    }
  });
  socket.on('getStatus', function(fn){
    fn(gameService.getStatus(whichPlayer(socket)));
  });
  socket.on('selectPile', function(position){
    gameService.selectPile(whichPlayer(socket), position);
    player1Socket.emit('setStatus', gameService.getStatus('player1'));
    player2Socket.emit('setStatus', gameService.getStatus('player2'));
    if(gameService.hasWinner()){
      io.sockets.emit(gameService.hasWinner() + ' wins');
      io.sockets.emit('game over');
      newgame();
      player1Socket.emit('setStatus', gameService.getStatus('player1'));
      player2Socket.emit('setStatus', gameService.getStatus('player2'));
    }
  });
  socket.on('swapCards', function(boardPosition, pilePosition, cardPosition){
    gameService.swapCards(whichPlayer(socket), boardPosition, pilePosition, cardPosition);
    player1Socket.emit('setStatus', gameService.getStatus('player1'));
    player2Socket.emit('setStatus', gameService.getStatus('player2'));
    if(gameService.hasWinner()){
      io.sockets.emit(gameService.hasWinner() + ' wins');
      io.sockets.emit('game over');
      newgame();
      player1Socket.emit('setStatus', gameService.getStatus('player1'));
      player2Socket.emit('setStatus', gameService.getStatus('player2'));
    }
  });
});