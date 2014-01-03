(function($, undefined){
  var selectedCard, selectedPile, deck;

  deck = [
    'sa','s2','s3','s4','s5','s6','s7','s8','s9','s10','sj','sq','sk',
    'ha','h2','h3','h4','h5','h6','h7','h8','h9','h10','hj','hq','hk',
    'ca','c2','c3','c4','c5','c6','c7','c8','c9','c10','cj','cq','ck',
    'da','d2','d3','d4','d5','d6','d7','d8','d9','d10','dj','dq','dk'
  ];

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

  function selectCard(card){
    if(selectedCard){
      selectedCard.removeClass('swapping');
    }
    selectedCard = card;
    selectedCard.addClass('swapping');
  }

  function swapSelectedCard(card){
    if(selectedCard){
      var a = card.data('card'), b = selectedCard.data('card');
      selectedCard.removeClass(b);
      card.removeClass(a);
      selectedCard.addClass(a);
      selectedCard.data('card',a);
      card.addClass(b);
      card.data('card',b);
    }
  }

  function selectPile(pile){
    if(selectedPile){
      selectedPile.removeClass('up');
      selectedPile.addClass('down');
      selectedPile.children('.card').removeClass('swapping');
      selectedPile.children('.card').removeClass('up');
      selectedPile.children('.card').addClass('down');
    }
    selectedCard = undefined;
    selectedPile = pile;
    selectedPile.removeClass('down');
    selectedPile.addClass('up');
    selectedPile.children('.card').removeClass('down');
    selectedPile.children('.card').addClass('up');
  }

  $(function(){
    var $swap = $('#swap'),
        $board = $('#board'),
        $player = $('#player'),
        $cards = [];
    $swap.hide();

    $player.on('click', '.pile.down', function(){
      var $pile = $(this);
      selectPile($pile);
    });

    $board.on('click', '.pile.up .card.up', function(){
      var $card = $(this);
      swapSelectedCard($card);
    });

    $player.on('click', '.pile.up .card.up', function(){
      var $card = $(this);
      selectCard($card);
    });

    deck = shuffle(deck);

    $cards = $('.card');
    for(var i = 0, c = deck.length; i < c; i++){
      var $card = $($cards[i]), card = deck[i];
      $card.addClass(card);
      $card.data('card', card);
    }
  });
})(jQuery);