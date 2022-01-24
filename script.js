const cards = []; // Blank array for depositing all our cards

// Creating a deck of cards
const suits = ["spades", "hearts", "clubs", "diams"]; //since, there are 4 different suits in cards

//for every deck of cards we have 13 different types
const numb = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];

let playerCard = []; //array to hold what cards are being held by Player AND see the output
let dealerCard = []; // array to hold what cards are being held by Dealer AND see the output
//variables needed for the gameplay
let cardCount = 0; // giving us the first card and to know which card we are at
let mydollars = 200;
let endplay = false;
// Get a bunch of variables to pick up the elements
const message = document.getElementById("message");
const output = document.getElementById("output");
const dealerHolder = document.getElementById("dealerHolder"); // access the information of the dealers's cards
const playerHolder = document.getElementById("playerHolder"); // of the player's cards
const pValue = document.getElementById("pValue");
const dValue = document.getElementById("dValue");
const dollarValue = document.getElementById("dollars");

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////

document.getElementById("mybet").onchange = function () {
  //event listener
  if (this.value < 0) {
    this.value = 0;
  } //limiting minimum and maximum values for the bet
  if (this.value > mydollars) {
    this.value = mydollars;
  }
  message.innerHTML = "Bet changed to £" + this.value;
};

// Looping through all the values in suits (build deck of cards)
for (s in suits) {
  const suit = suits[s][0].toUpperCase(); // To pick up the first character and making it uppercase

  // When running through suits,background color for the element
  const bgcolor = suit == "S" || suit == "C" ? "black" : "red"; //black to spades and clubs,red to hearts and diamonds
  for (n in numb) {
    //output.innerHTML += "<span style='color:" + bgcolor + "'>&" + suits[s] + ";" + numb[n] + "</span> ";
    let cardValue = n > 9 ? 10 : parseInt(n) + 1; // Generating card values for A,K,Q,J
    //var cardValue = 1;

    //Generating a random card
    // Creating a card objet
    const card = {
      suit,
      icon: suits[s],
      bgcolor,
      cardnum: numb[n],
      cardvalue: cardValue, // knowing the card's worth
    };
    cards.push(card);
  }
}

function Start() {
  shuffleDeck(cards); // Changing the order of cards
  dealNew(); //After shuffling, we want to deal out a new deck of cards
  document.getElementById("start").style.display = "none";
  dollarValue.innerHTML = mydollars;
}

function dealNew() {
  // No arguments, because we simply dealing out the cards
  dValue.innerHTML = "?";
  playerCard = []; // clear out the dealer's and player's card
  dealerCard = []; // so that when we dealing new cards, we want it to be clear
  dealerHolder.innerHTML = ""; // same goes for the innerHTML of both dealer and player
  playerHolder.innerHTML = "";
  const betvalue = document.getElementById("mybet").value;
  mydollars = mydollars - betvalue;
  document.getElementById("dollars").innerHTML = mydollars; //Here, presentation to the user
  document.getElementById("myactions").style.display = "block";
  message.innerHTML =
    "Get up to 21 and beat the dealer to win.<br>Current bet is £" + betvalue;
  document.getElementById("mybet").disabled = true;
  document.getElementById("maxbet").disabled = true;
  deal();
  document.getElementById("btndeal").style.display = "none";
}

function redeal() {
  cardCount++; //To move on to the next card
  if (cardCount > 40) {
    //checks to see if cardcount is over the given max cards
    console.log("NEW DECK");
    shuffleDeck(cards);
    cardCount = 0; //cardcount to zero after shuffling of the cards
    message.innerHTML = "New Shuffle";
  }
  if (mydollars < 0) {
   
   refreshPage(); 
   window.alert("You have no money! YOU BUST!");
  }
}

function deal() {
  for (x = 0; x < 2; x++) {
    // Because we start with 2 cards in blackjack
    dealerCard.push(cards[cardCount]); // pushing into dealer's card array
    dealerHolder.innerHTML += cardOutput(cardCount, x);
    if (x == 0) {
      dealerHolder.innerHTML += '<div id="cover" style="left:100px;"></div>'; //covering the Dealer's first card
    }
    redeal();
    playerCard.push(cards[cardCount]); // // pushing into player's card array
    playerHolder.innerHTML += cardOutput(cardCount, x); //outputting the card
    redeal();
  }
  let playervalue = checktotal(playerCard);
  if (playervalue == 21 && playerCard.length == 2) {
    //quickcheck to see if the players got a blackjack
    playend(); // and if they did, end the play right here
  }
  pValue.innerHTML = playervalue;
}

function cardOutput(n, x) {
  // Card no. and position the card to stack on top of one another
  let hpos = x > 0 ? x * 60 + 100 : 100; //If not a first card, move over the card
  return (
    //Creating a Play Card and outputting the styled card
    '<div class="icard ' +
    cards[n].icon + //card values here
    '" style="left:' +
    hpos + // getting that position value here
    'px;">  <div class="top-card suit">' +
    cards[n].cardnum +
    '<br></div>  <div class="content-card suit"></div>  <div class="bottom-card suit">' +
    cards[n].cardnum +
    "<br></div> </div>"
  );
}

function maxbet() {
  document.getElementById("mybet").value = mydollars; //took the value within mydollars
  message.innerHTML = "Bet changed to £" + mydollars;
}

//Player Actions
function cardAction(a) {
  console.log(a);
  switch (a) {
    case "hit":
      playucard(); // add new card to player's hand
      break;
    case "hold":
      playend(); // playout (letting the dealer playout his hand) and calculate
      break;
    case "double": //combination of HIT and HOLD
      // double current bet, remove value from mydollars
      let betvalue = parseInt(document.getElementById("mybet").value);
      if (mydollars - betvalue < 0) {
        betvalue = betvalue + mydollars;
        mydollars = 0;
      } else {
        mydollars = mydollars - betvalue;
        betvalue = betvalue * 2; // took the betvalue and double that value  accounting for mydollars
      }
      document.getElementById("dollars").innerHTML = mydollars;
      document.getElementById("mybet").value = betvalue;
      playucard(); // add new card to players hand
      playend(); // playout and calculate
      break;
    default:
      // if not HIT, HOLD or DOUBLE
      console.log("done");
      playend(); // playout and calculate
  }
}

// Stops Player having negaive infinate dollars with a value less than 0
// function bust(mydollars) {
//  refreshPage()

// }

//Grab the next card and pushing it into the player's card array and adding into the output
let playucard = () => {
  playerCard.push(cards[cardCount]); //adding a new card to playercard array
  playerHolder.innerHTML += cardOutput(cardCount, playerCard.length - 1);
  redeal();
  let rValu = checktotal(playerCard); // picking up the current value and checking the total
  pValue.innerHTML = rValu;
  if (rValu > 21) {
    message.innerHTML = "Busted!";
    playend();
  }
};

function playend() {
  endplay = true;
  document.getElementById("cover").style.display = "none";
  document.getElementById("myactions").style.display = "none";
  document.getElementById("btndeal").style.display = "block";
  document.getElementById("mybet").disabled = false;
  document.getElementById("maxbet").disabled = false;
  message.innerHTML = "Click Deal button for next Game<br>";
  const payoutJack = 1;
  const insuranceJack = 1;
  let dealervalue = checktotal(dealerCard);
  dValue.innerHTML = dealervalue;

  while (dealervalue < 17) {
    dealerCard.push(cards[cardCount]);
    dealerHolder.innerHTML += cardOutput(cardCount, dealerCard.length - 1);
    redeal();
    dealervalue = checktotal(dealerCard);
    dValue.innerHTML = dealervalue;
  }

  //Insurance Feature
  // const Insurance = () => {
  // if (dealerHolder === 10) {
  // 	message.innerHTML = 'Checking for Blackjack....' {
  // 		}	else if (dealervalue === 21){
  // 	message.innerHTML += '<span style="color:red;">Dealer gets BlackJack! You lost £' + betvalue + '</span>';

  // }
  // 	}
  // }

  //Who wins?
  let playervalue = checktotal(playerCard); // final check to see who won
  if (playervalue == 21 && playerCard.length == 2) {
    //quick check to see if it's a blackjack
    message.innerHTML = "Player Blackjack";
    payoutJack = 1.5;
    insuranceJack = 2;
  }

  let betvalue = parseInt(document.getElementById("mybet").value) * payoutJack;
  if (
    (playervalue < 22 && dealervalue < playervalue) ||
    (dealervalue > 21 && playervalue < 22)
  ) {
    message.innerHTML +=
      '<span style="background-color:green;">You WIN! You won £' +
      betvalue +
      "</span>";
    mydollars = mydollars + betvalue * 2;
  } else if (playervalue > 21) {
    message.innerHTML +=
      '<span style="background-color:red;">Dealer Wins! You lost £' +
      betvalue +
      "</span>";
  } else if (playervalue == dealervalue) {
    message.innerHTML += '<span style="color:blue;">PUSH</span>';
    mydollars = mydollars + betvalue;
  } else {
    message.innerHTML +=
      '<span style="background-color:red;">Dealer Wins! You lost £' +
      betvalue +
      "</span>";
  }
  pValue.innerHTML = playervalue;
  dollarValue.innerHTML = mydollars;
}

function checktotal(arr) {
  let rValue = 0;
  let aceAdjust = false; // Adjustment for an ace(as it could be 1 or 11)
  for (let i in arr) {
    if (arr[i].cardnum == "A" && !aceAdjust) {
      aceAdjust = true;
      rValue = rValue + 10;
    }
    rValue = rValue + arr[i].cardvalue;
  }

  if (aceAdjust && rValue > 21) {
    rValue = rValue - 10;
  }
  return rValue;
}

function shuffleDeck(array) {
  //shuffling the deck, order of cards get re-arranged
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1)); // getting random values
    let temp = array[i]; // a temporary holder to hold the value of i
    array[i] = array[j]; // re-creating the value of i by a random value
    array[j] = temp;
  }
  return array;
}

function refreshPage() {
  window.location.reload(false);
}
