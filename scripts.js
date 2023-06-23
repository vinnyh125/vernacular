$(document).ready(function() {
    const buttons = document.querySelectorAll(".key");
    const divElements = document.querySelectorAll(".tile");
    const delete_btn = document.querySelector(".delete");
    const enter_btn = document.querySelector(".enter");

    let chars = [];

    var tileNum = 0;
    var rowNum = 0;
    buttons.forEach(key => {
        key.addEventListener('click', () => {
            if (tileNum < 5 && rowNum < 6) {
                divElements[tileNum + (rowNum * 5)].textContent = key.innerText;
                console.log(tileNum);
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
            console.log(tileNum);
        }
    });

    enter_btn.addEventListener('click', () => { 
        if (tileNum == 5 && rowNum < 6) {
            let answer = chars.join('');
            if (answer == "HELLO") { //need to remember that the value of each key is CAPITALIZED
                console.log("this is run if enter button works");
            }
            tileNum = 0;
            rowNum ++;
            console.log("incremented rowNum to " + rowNum);
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
            console.log(tileNum);
            chars.push(character);
            tileNum++;
        }
    }

    function deleteCharacter() {
        if (tileNum !== 0) {
            chars.pop();
            tileNum--;
            divElements[tileNum + (rowNum * 5)].textContent = '';
            console.log(tileNum);
        }
    }

    function processEnter() {
        if (tileNum === 5 && rowNum < 6) {
            let answer = chars.join('');
            if (answer === 'HELLO') {
                console.log('This is run if enter button works');
            }
            tileNum = 0;
            rowNum++;
            console.log('Incremented rowNum to ' + rowNum);
            chars = [];
        }
    }
});