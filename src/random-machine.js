import './index.css'
let getRandomBtn = document.querySelector('#getRandom');
let randomNumber = document.querySelectorAll('.randomNumber');

const randomNumberUI = document.querySelector('#randomNumberUI');
const deviceHandController = document.querySelector('#deviceHandController');
const leftHandDevice = document.querySelector('#leftHandDevice');
const rightHandDevice = document.querySelector('#rightHandDevice');

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

leftHandDevice.addEventListener('click', function() {
    randomNumberUI.classList.add('flex-row-reverse');
    deviceHandController.classList.add('justify-end');
    rightHandDevice.classList.remove('hidden');
    leftHandDevice.classList.add('hidden');
});

rightHandDevice.addEventListener('click', function() {
    randomNumberUI.classList.remove('flex-row-reverse');
    deviceHandController.classList.remove('justify-end');
    leftHandDevice.classList.remove('hidden');
    rightHandDevice.classList.add('hidden');
});