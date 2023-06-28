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
        console.log(targetWord); // debug msg to make sure targetWord grabbed smt
        for (let i = 0; i < targetWord.length; i++) {
            if (!(targetWord.charAt(i) in answerDict)) { // if letter doesn't exist in the dictionary yet, add it with value of 1 
                answerDict[targetWord.charAt(i)] = 1;
            } else { // if letter does exist, increment the times it appears in the answer by 1
                answerDict[targetWord.charAt(i)] += 1;
            }
        }
        //console.log(answerDict); // prints dictionary of each letter in targetWord/answer and how many times they show up (this will serve as our counter)
    }
    getapi(api_url); // actually calling the api using the api link

    var tileNum = 0;
    var rowNum = 0;
    buttons.forEach(key => {
        key.addEventListener('click', () => {
            if (tileNum < 5 && rowNum < 6) {
                divElements[tileNum + (rowNum * 5)].textContent = key.innerText;
                chars.push(key.innerText);
                tileNum++;
            }
        });
    });

    delete_btn.addEventListener('click', () => {
        if (tileNum!=0) {
            chars.pop();
            tileNum--;
            divElements[tileNum + (rowNum * 5)].textContent = '';
        }
    });

    enter_btn.addEventListener('click', () => { 
        if (tileNum == 5 && rowNum < 6) {
            checkWord();
            tileNum = 0;
            rowNum ++;
            chars = [];
        }
    });

    document.addEventListener('keydown', (event) => {
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
    });

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
            tileNum = 0;
            rowNum++;
            chars = [];
        } else if (tileNum < 5 && rowNum < 6) {
            alert("Not enough letters!")
        }
    }

    function checkWord() {
        var guessDict = {};

        for (let i = 0; i < tileNum; i++) {
            if (targetWord.toUpperCase().includes(chars[i])) { // checks if user input letter is included in answer
                if (targetWord.toUpperCase().charAt(i) == chars[i]) { // if letter is in answer, check location
                    divElements[i + (rowNum * 5)].classList.add("tile-green"); // if location correct, tile green
                } else {
                    divElements[i + (rowNum * 5)].classList.add("tile-yellow");
                }
            } else { // if letter isn't in answer
                divElements[i + (rowNum * 5)].classList.add("tile-gray"); // set tile gray if letter not in answer
            }
        }
        console.log(guessDict);
    }
});