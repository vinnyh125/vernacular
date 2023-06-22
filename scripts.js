$(document).ready(function() {
    const buttons = document.querySelectorAll(".key");
    const divElements = document.querySelectorAll(".tile");
    const delete_btn = document.querySelector(".delete");
    const enter_btn = document.querySelector(".enter");

    let chars = [];

    var tileNum = 0;
    var rowNum = 0;
    buttons.forEach(key => {
        key.addEventListener('click', () => { //need to prevent user from being able to type onto next row unless enter is pressed
            if ((tileNum + (rowNum * 5)) < 30) {
                if (tileNum<=4) {
                    if (tileNum == 4 && divElements[tileNum + (rowNum * 5)].textContent.trim().length > 0) {
                        return;
                    }
                    divElements[tileNum + (rowNum * 5)].textContent = key.innerText;
                    chars.push(key.innerText);
                    if (tileNum < 4) {
                        tileNum++;
                    } 
                }
            }
        })
    })

    delete_btn.addEventListener('click', () => {
        console.log("I'm deleting at " + (tileNum + (rowNum * 5)));
        if (tileNum == 0) {
            chars.pop();
            divElements[tileNum + (rowNum * 5)].textContent = '';
        }
        if (tileNum > 0) {
            chars.pop();
            divElements[tileNum + (rowNum * 5)].textContent = '';
            tileNum--;
        }
    })

    enter_btn.addEventListener('click', () => { //need to add check to make sure that the answer is a word and is of length 5
        if (tileNum == 4) {
            let answer = chars.join('');
            if (answer == "HELLO") { //need to remember that the value of each key is CAPITALIZED
                console.log("this is run if enter button works");
            }
            rowNum ++;
            tileNum = 0;
            chars = [];
            console.log("You pressed: enter and incremented rowNum to " + (rowNum));
        }
    })
});