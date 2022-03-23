import { WORDS } from "./words.js";
import { ANSWER } from "./words.js";

const NUMBER_OF_GUESSES = 6;
let guessesRemaining = NUMBER_OF_GUESSES;
let currentGuess = [];
let emojiArray = [];
let nextLetter = 0;
let rightGuessString = ANSWER[Math.floor(Math.random() * ANSWER.length)]

function initBoard() {
    let board = document.getElementById("game-board");

    for (let i = 0; i < 6; i++) {
        emojiArray[i] = ["white", "white", "white", "white", "white", "white"];
    }

    //var element = document.getElementById("about");
    //element.setAttribute("onclick", about)

    for (let i = 0; i < NUMBER_OF_GUESSES; i++) {
        let row = document.createElement("div")
        row.className = "letter-row"

        for (let j = 0; j < 6; j++) {
            let box = document.createElement("div")
            box.className = "letter-box"
            row.appendChild(box)
        }

        board.appendChild(row)
    }
}

function shadeKeyBoard(letter, color) {
    for (const elem of document.getElementsByClassName("keyboard-button")) {
        if (elem.textContent === letter) {
            let oldColor = elem.style.backgroundColor
            if (oldColor === 'green') {
                return
            }

            if (oldColor === 'yellow' && color !== 'green') {
                return
            }

            elem.style.backgroundColor = color
            break
        }
    }
}

function deleteLetter () {
    let row = document.getElementsByClassName("letter-row")[6 - guessesRemaining]
    let box = row.children[nextLetter - 1]
    box.textContent = ""
    box.classList.remove("filled-box")
    currentGuess.pop()
    nextLetter -= 1
}

async function checkGuess () {
    let row = document.getElementsByClassName("letter-row")[6 - guessesRemaining]
    let guessString = ''
    let rightGuess = Array.from(rightGuessString)

    for (const val of currentGuess) {
        guessString += val
    }

    if (guessString.length != 6) {
        toastr.error("Not enough letters!")
        return
    }

    if (!WORDS.includes(guessString)) {
        toastr.error("Word not in list!")
        return
    }


    for (let i = 0; i < 6; i++) {
        let letterColor = ''
        let box = row.children[i]
        let letter = currentGuess[i]

        let letterPosition = rightGuess.indexOf(currentGuess[i])
        // is letter in the correct guess
        if (letterPosition === -1) {
            letterColor = 'grey'
            emojiArray[6 - guessesRemaining][i] = letterColor
        } else {
            // now, letter is definitely in word
            // if letter index and right guess index are the same
            // letter is in the right position
            if (currentGuess[i] === rightGuess[i]) {
                // shade green
                letterColor = 'green'
                emojiArray[6 - guessesRemaining][i] = letterColor
            } else {
                // shade box yellow
                letterColor = 'yellow'
                emojiArray[6 - guessesRemaining][i] = letterColor
            }

            rightGuess[letterPosition] = "#"
        }

        let delay = 250 * i
        setTimeout(()=> {
            //flip box
            animateCSS(box, 'flipInX')
            //shade box
            box.style.backgroundColor = letterColor
            shadeKeyBoard(letter, letterColor)
        }, delay)
    }

    if (guessString === rightGuessString) {
        generateScoreCard()
        guessesRemaining = 0
        return
    } else {
        guessesRemaining -= 1;
        currentGuess = [];
        nextLetter = 0;

        if (guessesRemaining === 0) {
            toastr.error("You've run out of guesses! Game over!")
            toastr.info(`The right word was: "${rightGuessString}"`)
        }
    }
}

const delay = ms => new Promise(res => setTimeout(res, ms));

async function generateScoreCard () {
    let result = ``;
    result = result + "Tordle " + GetFormattedDate() + "\n\n";
    let board = document.getElementById("game-board");
    var rows = board.getElementsByClassName('letter-row');
    for( var i=0; i< emojiArray.length; i++ )
    {
     var row = emojiArray[i];
     for( var j=0; j< row.length; j++ )
     {
      var boxColor = row[j]

      switch (boxColor) {
        case 'green':
          result = result + '🟩';
          break;
        case 'yellow':
          result = result + '🟨';
          break;
        case 'grey':
          result = result + '⬜';
          break;
        default:
          result = result + '⬛';
          break;
      }
     }

     result = result + "\n";
    }
    var link = "\nhttp://www.tordle.us"
    link.link("http://www.tordle.us")
    var clip_result = result + link
    console.log(clip_result)
    await navigator.clipboard.writeText(clip_result);
    toastr.options.closeButton = true;
    let html_result = result.replace(/(?:\r\n|\r|\n)/g, "</br>")
    toastr.success("Yup, that's a turtle! Game over!</br></br>Result is copied to clipboard.</br></br>" + html_result +  "</br><a href='www.tordle.us'>www.tordle.us</a>")
  }

function GetFormattedDate() {
    var d = new Date();
    var datestring = (d.getMonth()+1)  + "/" + d.getDate() + "/" + d.getFullYear()
    return datestring;
}

function about() {
  toastr.options.closeButton = true;
  toastr.options.extendedTimeOut= 1000;
  toastr.options.timeOut= 1000;
  toastr.options.tapToDismiss= false;
  toastr.success("Tordle challenges you to find the animal in the picture.</br>After each guess, letters in the correct position will be green,</br> letters in the word but in the wrong position will be yellow, </br> and letters not in the word will be gray. </br> You have six guesses, good luck!")
}

function insertLetter (pressedKey) {
    if (nextLetter === 6) {
        return
    }
    pressedKey = pressedKey.toLowerCase()

    let row = document.getElementsByClassName("letter-row")[6 - guessesRemaining]
    let box = row.children[nextLetter]
    animateCSS(box, "pulse")
    box.textContent = pressedKey
    box.classList.add("filled-box")
    currentGuess.push(pressedKey)
    nextLetter += 1
}

const animateCSS = (element, animation, prefix = 'animate__') =>
  // We create a Promise and return it
  new Promise((resolve, reject) => {
    const animationName = `${prefix}${animation}`;
    // const node = document.querySelector(element);
    const node = element
    node.style.setProperty('--animate-duration', '0.3s');

    node.classList.add(`${prefix}animated`, animationName);

    // When the animation ends, we clean the classes and resolve the Promise
    function handleAnimationEnd(event) {
      event.stopPropagation();
      node.classList.remove(`${prefix}animated`, animationName);
      resolve('Animation ended');
    }

    node.addEventListener('animationend', handleAnimationEnd, {once: true});
});

document.addEventListener("keyup", (e) => {

    if (guessesRemaining === 0) {
        return
    }

    let pressedKey = String(e.key)
    if (pressedKey === "Backspace" && nextLetter !== 0) {
        deleteLetter()
        return
    }

    if (pressedKey === "Enter") {
        checkGuess()
        return
    }

    let found = pressedKey.match(/[a-z]/gi)
    if (!found || found.length > 1) {
        return
    } else {
        insertLetter(pressedKey)
    }
})

document.getElementById("keyboard-cont").addEventListener("click", (e) => {
    const target = e.target

    if (!target.classList.contains("keyboard-button")) {
        return
    }
    let key = target.textContent

    if (key === "Del") {
        key = "Backspace"
    }

    document.dispatchEvent(new KeyboardEvent("keyup", {'key': key}))
})

initBoard();
