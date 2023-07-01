$(document).ready(function() {
    const buttons = document.querySelectorAll(".key");
    const divElements = document.querySelectorAll(".tile");
    const delete_btn = document.querySelector(".delete");
    const enter_btn = document.querySelector(".enter");

    let chars = [];
    var targetWord = '';
    var answerDict = {};

    const api_url = "https://random-word-api.vercel.app/api?words=1&length=5"; // 5-letter word api

    async function getapi(url) {
        const response = await fetch(url); // Store response of api call
        var data = await response.json(); // store data in json form (array in this case)
        targetWord = data[0]; // setting targetWord to be word from api call
        console.log(targetWord); // print answer in console
        for (let i = 0; i < targetWord.length; i++) {
            if (!(targetWord.charAt(i) in answerDict)) { // if letter doesn't exist in the dictionary yet, add it with value of 1 
                answerDict[targetWord.charAt(i)] = 1;
            } else { // if letter does exist, increment the times it appears in the answer by 1
                answerDict[targetWord.charAt(i)] += 1;
            }
        }
    }
    getapi(api_url); // actually calling the api using the api link

    var tileNum = 0;
    var rowNum = 0;

    const keyHandler = () => {
        if (tileNum < 5 && rowNum < 6) {
            divElements[tileNum + (rowNum * 5)].textContent = key.innerText;
            chars.push(key.innerText);
            tileNum++;
        }
    };

    const delHandler = () => {
        if (tileNum!=0) {
            chars.pop();
            tileNum--;
            divElements[tileNum + (rowNum * 5)].textContent = '';
        }
    }

    const enterHandler = () => {
        if (tileNum == 5 && rowNum < 6) {
            checkWord();
            winOrLose();
            tileNum = 0;
            rowNum ++;
            chars = [];
        }
    }
    
    buttons.forEach(key => {
        key.addEventListener('click', keyHandler);
    });

    delete_btn.addEventListener('click', delHandler);

    enter_btn.addEventListener('click', enterHandler);

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
            chars.push(character);
            tileNum++;
        }
    }

    function deleteCharacter() {
        if (tileNum !== 0) {
            chars.pop();
            tileNum--;
            divElements[tileNum + (rowNum * 5)].textContent = '';
        }
    }

    function processEnter() {
        if (tileNum === 5 && rowNum < 6) {
            checkWord();
            winOrLose();
            tileNum = 0;
            rowNum++;
            chars = [];
        } else if (tileNum < 5 && rowNum < 6) {
            alert("Not enough letters!")
        }
    }

    function checkWord() {
        var guessDict = {};
        let include = [];

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
                    if (button.textContent == "DEL" || button.textContent == "ENTER") {
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
            alert("You won!") // do something when won
            disableKeys();
        } else if (guessString != targetWord && rowNum == 5) { // if guessed wrong on last possible try
            alert("You lost.") // do something when lost
            disableKeys();
        }
    }

    function disableKeys() {
        document.removeEventListener('keydown', keyboardHandler);
        buttons.forEach(key => {
            key.removeEventListener('click', keyHandler);
        });
        delete_btn.removeEventListener('click', delHandler);
        enter_btn.removeEventListener('click', enterHandler);
    }
});