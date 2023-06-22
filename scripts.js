$(document).ready(function() {
    const buttons = document.querySelectorAll(".key");
    console.log(buttons);
    const divElements = document.querySelectorAll(".tile");
    console.log(divElements);
    const delete_btn = document.querySelector(".delete");
    console.log(delete_btn);
    const enter_btn = document.querySelector(".enter");
    console.log(enter_btn);

    let chars = [];

    var tileNum = 0;
    var rowNum = 0;
    buttons.forEach(key => {
        key.addEventListener('click', () => { //need to prevent user from being able to type onto next row unless enter is pressed
            if (tileNum < 5 && rowNum < 6) {
                divElements[tileNum + (rowNum * 5)].textContent = key.innerText;
                console.log(tileNum);
                chars.push(key.innerText);
                tileNum++;
            }
        })
    })

    delete_btn.addEventListener('click', () => {
        if (tileNum!=0) {
            chars.pop();
            tileNum--;
            divElements[tileNum + (rowNum * 5)].textContent = '';
            console.log(tileNum);
        }
    })

    enter_btn.addEventListener('click', () => { //need to add check to make sure that the answer is a word and is of length 5
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
    })
});