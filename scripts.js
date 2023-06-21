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

    var i = 0;
    buttons.forEach(key => {
        key.addEventListener('click', () => { //need to prevent user from being able to type onto next row unless enter is pressed
            divElements[i].textContent = key.innerText
            chars.push(key.innerText)
            i++
        })
    })

    delete_btn.addEventListener('click', () => {
        if (i!=0) {
            chars.pop()
            i--
            divElements[i].textContent = ''
        }
    })

    enter_btn.addEventListener('click', () => { //need to add check to make sure that the answer is a word and is of length 5
        let answer = chars.join('')
        if (answer == "HELLO") { //need to remember that the value of each key is CAPITALIZED
            console.log("this is run if enter button works")
        }
    })
});