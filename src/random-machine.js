import './index.css'
let getRandomBtn = document.querySelector('#getRandom');
let randomNumber = document.querySelectorAll('.randomNumber');

getRandomBtn.addEventListener('click', function() {
    let randomSet = [];
    randomNumber.forEach(item => {
        let random;
        do {
            random = parseInt(Math.random() * 4 + 1)
        } while (randomSet.indexOf(random) !== -1);
        randomSet.push(random);
        item.innerText = random;
    });
});