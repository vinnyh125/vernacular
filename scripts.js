$(document).ready(function() {
    const buttons = document.querySelectorAll(".key");
    const divElements = document.querySelectorAll(".tile");
    const rowElements = document.querySelectorAll(".text-row");
    const delete_btn = document.querySelector(".delete");
    const enter_btn = document.querySelector(".enter");

    let chars = [];
    var targetWord = '';
    var answerDict = {};
    var targetWordPOS = '';
    var targetWordDefinition = '';

    let wordDict = '';

    fetch("./words_dictionary.json")
    .then(response => {
        return response.json();
    })
    .then(data => {
        wordDict = data;
    });

    const api_url = "https://random-word-api.vercel.app/api?words=1&length=5"; // 5-letter word api
    const api_dictionary_url = "https://api.dictionaryapi.dev/api/v2/entries/en/"; // dictionary api

    async function getDictionaryApi(url) {
        try {
            const response = await fetch(url);
            const data = await response.json();
            console.log(data);
            targetWordPOS = data[0].meanings[0].partOfSpeech;
            targetWordDefinition = data[0].meanings[0].definitions[0].definition;
            console.log(targetWordDefinition);
        } catch (error) {
            targetWordDefinition = "Sorry, the definition doesn't appear in the api.";
        }
    }
      
    async function getapi(url) {
        const response = await fetch(url);
        const data = await response.json();
        targetWord = data[0];
        console.log(targetWord);
        for (let i = 0; i < targetWord.length; i++) {
            if (!(targetWord.charAt(i) in answerDict)) {
            answerDict[targetWord.charAt(i)] = 1;
            } else {
            answerDict[targetWord.charAt(i)] += 1;
            }
        }
      
        const dictionaryApiUrl = api_dictionary_url + targetWord;
        getDictionaryApi(dictionaryApiUrl);
    }
      
    getapi(api_url);
      

    var tileNum = 0;
    var rowNum = 0;
    
    // Define the event handler function separately
    const clickHandler = (event) => {
        const key = event.target; // Get a reference to the clicked button element

        if (tileNum < 5 && rowNum < 6) {
            divElements[tileNum + (rowNum * 5)].textContent = key.innerText;
            tileFilled();
            chars.push(key.innerText);
            tileNum++;
        }
    };

    const deleteBtnHandler = () => {
        if (tileNum !== 0) {
            chars.pop();
            tileNum--;
            removeFilledTileStyling();
            divElements[tileNum + (rowNum * 5)].textContent = '';
        }
    };

var charsFinal;

    const enterBtnHandler = () => {
        if (tileNum === 5 && rowNum < 6) {
            if (wordDict.hasOwnProperty(chars.join("").toLowerCase())) {
                checkWord();
                winOrLose();
                tileNum = 0;
                rowNum++;
                charsFinal = chars;
                chars = [];
            } else {
                invalidInput();
            }
        } else if (tileNum < 5 && rowNum < 6) {
            invalidInput();
        }
    };

    buttons.forEach(key => {
        key.addEventListener('click', clickHandler);
    });

    delete_btn.addEventListener('click', deleteBtnHandler);

    enter_btn.addEventListener('click', enterBtnHandler);

    const keyboardHandler = (event) => {
        const { key } = event;
        const isAlphabeticalKey = /^[a-zA-Z]$/.test(key); // regex: keyboard inputs from a-z & A-Z are supported

        if (isAlphabeticalKey) {
            const uppercaseKey = key.toUpperCase(); // capitalizes inputs because everything we work with is in uppercase
            insertCharacter(uppercaseKey);
        } else if (key === 'Backspace') {
            deleteCharacter();
        } else if (key === 'Enter') {
            processEnter();
        }
    }
    document.addEventListener('keydown', keyboardHandler);

    function insertCharacter(character) {
        if (tileNum < 5 && rowNum < 6) {
            divElements[tileNum + (rowNum * 5)].textContent = character;
            tileFilled();
            chars.push(character);
            tileNum++;
        }
    }

    function deleteCharacter() {
        if (tileNum !== 0) {
            chars.pop();
            tileNum--;
            removeFilledTileStyling();
            divElements[tileNum + (rowNum * 5)].textContent = '';
        }
    }

    function processEnter() {
        if (tileNum === 5 && rowNum < 6) {
            if (wordDict.hasOwnProperty(chars.join("").toLowerCase())) {
                checkWord();
                winOrLose();
                tileNum = 0;
                rowNum++;
                charsFinal = chars;
                chars = [];
            } else {
                invalidInput();
            }
        } else if (tileNum < 5 && rowNum < 6) {
            invalidInput();
        }
    }

    function checkWord() {
        var guessDict = {};
        let include = [];

        for (let i = 0; i < tileNum; i++) {
            var delay = i + 1;
            divElements[i + (rowNum * 5)].classList.add("spin-animation");
            divElements[i + (rowNum * 5)].style.transitionDelay = (delay * .1).toString() + "s";
        }

        for (let i = 0; i < targetWord.length; i++) {
            if (!(targetWord.charAt(i) in guessDict)) { // if letter doesn't exist in the dictionary yet, add it with value of 1 
                guessDict[targetWord.charAt(i)] = 1;
            } else { // if letter does exist, increment the times it appears in the answer by 1
                guessDict[targetWord.charAt(i)] += 1;
            }
        }

        for (let i = 0; i < tileNum; i++) {
            let givenText = chars[i];
            for (let button of document.querySelectorAll("button")) {
                if (button.textContent.includes(givenText)) {
                    if (button.textContent == "DEL" || button.textContent == "ENTER" || button.textContent == "Play Again" || button.textContent == "Share") {
                        continue;
                    } else {
                        include.push(button);
                    }
                }
            }
        }

        for (let i = 0; i < tileNum; i++) {
            if (targetWord.toUpperCase().includes(chars[i])) { // checks if user input letter is included in answer
                if (targetWord.toUpperCase().charAt(i) == chars[i]) { // if letter is in answer, check location
                    divElements[i + (rowNum * 5)].classList.add("tile-green"); // if location correct, tile green
                    guessDict[chars[i].toLowerCase()] -= 1;
                    if (include[i].classList.contains("tile-yellow")) {
                        include[i].classList.remove("tile-yellow");
                    }
                    include[i].classList.add("tile-green");
                }
            } else { // if letter isn't in answer
                divElements[i + (rowNum * 5)].classList.add("tile-gray"); // set tile gray if letter not in answer
                include[i].classList.add("tile-gray");
            }
        }

        for (let i = 0; i < tileNum; i++) {
            if (targetWord.toUpperCase().includes(chars[i])) {
                if (targetWord.toUpperCase().charAt(i) == chars[i]) { // if letter is in answer, check location
                    continue;
                } else {
                    if (guessDict[chars[i].toLowerCase()] > 0) {
                        divElements[i + (rowNum * 5)].classList.add("tile-yellow");
                        guessDict[chars[i].toLowerCase()] -= 1;
                        if (include[i].classList.contains("tile-green")) {
                            continue;
                        } else {
                            include[i].classList.add("tile-yellow");
                        }
                    } else {
                        divElements[i + (rowNum * 5)].classList.add("tile-gray");
                    }
                }
            }
        }
    }

    function winOrLose() {
        let guessString = chars.join('').toLowerCase(); // changes the array of characters into a string that's fully lowercase

        if (guessString == targetWord) { // if guessed right aka won...
            endOfGame();
        } else if (guessString != targetWord && rowNum == 5) { // if guessed wrong on last possible try
            endOfGame();
        }
    }

    function endOfGame() { // styling and DOM changes when user guesses word or runs out of guesses
        document.removeEventListener('keydown', keyboardHandler);
        buttons.forEach(key => {
            key.removeEventListener('click', clickHandler);
        });
        delete_btn.removeEventListener('click', deleteBtnHandler);
        enter_btn.removeEventListener('click', enterBtnHandler);
        document.getElementById("dialogBox").style.display = "flex";
        document.getElementById("word-answer").innerText = targetWord.toUpperCase();
        document.getElementById("word-part-of-speech").innerText = targetWordPOS;
        document.getElementById("word-answer-definition").innerText = targetWordDefinition;
        document.getElementById("page-content").style.opacity = "0.5";
        document.getElementById("page-content").style.transition = "opacity 1s";
        document.getElementById("share").addEventListener("click", shareResults);
    }

    function tileFilled() { // subtle animation and border coloring changes to indicate an occupied tile
        divElements[tileNum + (rowNum * 5)].style.animation = "stretch-big 0.1s ease"; // make tile look large
        divElements[tileNum + (rowNum * 5)].style.animation = "stretch-small 0.1s ease"; // make tile look small (combination of two creates pulsing effect)
        divElements[tileNum + (rowNum * 5)].style.borderColor = "#565758"; // turn to slightly lighter shade to indicate occupancy
    }

    function removeFilledTileStyling() { // removes the animation property and changes in border color when user presses delete
        divElements[tileNum + (rowNum * 5)].style.removeProperty("animation"); // removes animation so it can repeat if needed
        divElements[tileNum + (rowNum * 5)].style.borderColor = "#3a3a3c"; // turn border-color to original shade
    }

    function invalidInput() { // subtle animation for when user tries to input a word that doesn't have enough letters or doesn't exist
        rowElements[rowNum].style.animation = "shake 0.35s ease";
        setTimeout(() => {
            rowElements[rowNum].style.animation = "";
        }, 350)
    }

    function shareResults() {
        let msg = '';
        let numOfTries = rowNum;
        let guessString = charsFinal.join('').toLowerCase();

        for (let i = 0; i < divElements.length; i++) {
            if (i % 5 == 0) {
                msg = msg + "\n"
            }
            if (divElements[i].classList.contains('tile-green')) {
                msg = msg + "🟩 "
            }
            if (divElements[i].classList.contains('tile-yellow')) {
                msg = msg + "🟨 "
            }
            if (divElements[i].classList.contains('tile-gray')) {
                msg = msg + "⬛ "
            }
            if (divElements[i].classList.length == 1) {
                msg = msg + "⬛ "
            }
        }

        msg = msg + "\n" + "Play Vernacular: https://vernaculargame.netlify.app/"

        if (guessString != targetWord && rowNum == 6) {
            navigator.clipboard.writeText("Vernacular: Did Not Solve" + msg)
        } else {
            navigator.clipboard.writeText("Vernacular: Solved in " + numOfTries + "!" + msg)
        }

        document.getElementById("share-container").style.animation = "fade-in-out 1.5s";
        setTimeout(() => {
            document.getElementById("share-container").style.removeProperty("animation");
        },1550)
    }
});