// Challenge5: Blackjack

let blackjackGame = {
    'you': {'scoreSpan': '#your-blackjack-result', 'div': '#yourBox', 'score': 0},
    'dealer': {'scoreSpan': '#dealer-blackjack-result', 'div': '#dealerBox', 'score': 0},
    'cards': ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'K', 'J', 'Q', 'A'],
    'cardsMap':{'2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9, '10': 10, 'K': 10, 'J': 10, 'Q': 10, 'A': [1,11]},
    'wins': 0,
    'losses': 0,
    'draws': 0,
    'isStand': false,
    'turnOver': false,
    'isRestrict': false,
};

const YOU = blackjackGame['you'];
const DEALER = blackjackGame['dealer'];

const hitSound = new Audio('blackjack_assets/sounds/swish.m4a');
const winSound = new Audio('blackjack_assets/sounds/cash.mp3');
const lostSound = new Audio('blackjack_assets/sounds/aww.mp3');

document.querySelector('#blackjack-hit-button').addEventListener('click', blackjackHit);

document.querySelector('#blackjack-stand-button').addEventListener('click', dealerLogic);

document.querySelector('#blackjack-deal-button').addEventListener('click', blackjackDeal);

function blackjackHit(){ 
    if(blackjackGame['isStand'] === false){
        let card = randomCard();
        showCard(card, YOU);
        updateCard(card, YOU);
        showScore(YOU);
    }
}

function showCard(card,activePlayer){
    if(activePlayer['score']<=21){
        let cardImage = document.createElement('img');
        cardImage.src = `blackjack_assets/images/${card}.png`;
        document.querySelector(activePlayer['div']).appendChild(cardImage);
        hitSound.play();
    }
}

function blackjackDeal(){
    if(blackjackGame['turnOver'] === true){
        
        blackjackGame['isStand'] = false;
        

        let yourImage = document.querySelector(YOU['div']).querySelectorAll('img');
        let dealerImage = document.querySelector(DEALER['div']).querySelectorAll('img');
        
        for(let i=0; i<yourImage.length; i++){
            yourImage[i].remove();
        }
    
        for(let i=0; i<dealerImage.length; i++){
            dealerImage[i].remove();
        }

        YOU['score'] = 0;    //change internally
        DEALER['score'] = 0;

        document.querySelector(YOU['scoreSpan']).textContent = 0; //change at Front-End 
        document.querySelector(DEALER['scoreSpan']).textContent = 0;
        
        document.querySelector(YOU['scoreSpan']).style.color = '#ffffff';
        document.querySelector(DEALER['scoreSpan']).style.color = '#ffffff';

        document.querySelector('#blackjack-result').textContent = `Let's play`;
        document.querySelector('#blackjack-result').style.color = `black`;
        
        blackjackGame['isRestrict'] = false;
        blackjackGame['turnOver'] = false;
    }
}

function randomCard(){
    let randomIndex = Math.floor(Math.random() * 13);
    return blackjackGame['cards'][randomIndex];
}

function updateCard(card, activePlayer){
    if(card === 'A'){
        //if adding 11 keeps me below 21, add 11, Otherwise add 1
        if(activePlayer['score'] + blackjackGame['cardsMap'][card][1] <= 21){
            activePlayer['score'] += blackjackGame['cardsMap'][card][1];
        }else{
            activePlayer['score'] += blackjackGame['cardsMap'][card][0];
        }
    }else{
    activePlayer['score'] += blackjackGame['cardsMap'][card];
    }
}

function showScore(activePlayer){
    if(activePlayer['score']>21){
        document.querySelector(activePlayer['scoreSpan']).textContent = 'BUST!';
        document.querySelector(activePlayer['scoreSpan']).style.color = 'red'; //playing with CSS
    }else{
        document.querySelector(activePlayer['scoreSpan']).textContent = activePlayer['score'];
    }
}


function sleep(ms){//to play bot in one by one way (animation) or wait for next card to play
    return new Promise(resolve => setTimeout(resolve,ms));
}


async function dealerLogic(){ // we use async func becoz we dont want browser to be freeze
  if(blackjackGame['isRestrict'] === false){
        
         blackjackGame['isStand'] = true;

        while(DEALER['score'] < 16 && blackjackGame['isStand'] === true){// bot logic
            let card = randomCard();
            showCard(card, DEALER);
            updateCard(card, DEALER);
            showScore(DEALER);
            await sleep(1000);
        }    

            
        blackjackGame['turnOver'] = true;
        blackjackGame['isRestrict'] = true;   
        showResult(computeWinner());
    } 
  
}



// Compute winner and return who just won
// udate wins draws and losses
function computeWinner(){
    let winner;

    if(YOU['score'] <= 21){
        //condition: higher score than dealer or when dealer bust 
        if(YOU['score'] > DEALER['score'] || DEALER['score'] > 21){
            blackjackGame['wins']++;
            winner = YOU;
          
        }else if(YOU['score'] < DEALER['score']){
            blackjackGame['losses']++;
            winner = DEALER;
            
        }else if(YOU['score'] === DEALER['score']){
            blackjackGame['draws']++;
        }

        //condition: when you bust but dealer dosen't
    }else if(YOU['score'] > 21 && DEALER['score'] < 21){
        blackjackGame['losses']++;
        winner = DEALER;

        //condition: when you and dealer both bust
    }else if (YOU['score'] > 21 && DEALER['score'] > 21){
        blackjackGame['draws']++;
    }

    
    return winner;
}




function showResult(winner){
    if(blackjackGame['turnOver'] === true){
        let message, messageColor;

        if(winner === YOU){
            document.querySelector('#wins').textContent = blackjackGame['wins'];
            message = 'You won!';
            messageColor = 'green';
            winSound.play();
        }else if(winner === DEALER){
            document.querySelector('#losses').textContent = blackjackGame['losses'];
            message = 'You lost!';
            messageColor = 'red';
            lostSound.play();
        }else{
            document.querySelector('#draws').textContent = blackjackGame['draws'];
            message = 'You drew!';
            messageColor = 'yellow';
        }

        document.querySelector('#blackjack-result').textContent = message;
        document.querySelector('#blackjack-result').style.color = messageColor;
    }
}