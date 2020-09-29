let app = new Vue({
    el: '#app',
    data: {
        visible: false
    },
});

/*
<p class="desc__text">Буква:</p>
        <div class="letter" id="letter_img">
        </div>
        <p class="desc__text">Твой вариант:</p>
        <input class="form__input" type="text" id="letter_check">
*/


class Alpabet {
    constructor() {
        this.allData;
        this.letterArr = [];
        this._init();
        this.letterId;
        this.mainPlace = document.getElementById('main__place');
    }

    _init() {
        this.getLetters();
    }

    async getLetters() {
        let response = await fetch('data/alphabet.json');
        this.allData = await response.json();
        this.start();
    }

    start() {
        this.mainPlace.innerHTML = '';
        this.mainPlace.insertAdjacentHTML('beforeend', `
        <div class="button">
        <button class="button__start" id="btn_start">Начать</button>
        </div>
        `);

        document.getElementById('btn_start').addEventListener('click', this.play);
    }

    play() {
        document.getElementById('main__place').innerHTML = '';
        console.log('play');
        newLetter.renderGame();
    }

    renderGame() {
        let strLetter = `<p class="desc__text">Буква:</p>`;
        let strImg = `<div class="letter" id="letter_img"></div>`;
        let strInput = `<p class="desc__text">Твой вариант:</p>
        <input class="form__input" type="text" id="letter_check">`;
        this.mainPlace.insertAdjacentHTML('beforeend', strLetter + strImg + strInput);
        console.log('renderGame');

        this.letterId = this.randomizer(this.allData.length);

        do {
            this.letterId = this.randomizer(this.allData.length);
        }
        while (this.letterArr.indexOf(this.letterId) != -1);

        if (this.letterArr.length == this.allData.length) {
            this.finish();
        };
        console.log(this.letterId);

        let chooseLetter = this.allData[this.letterId - 1];

        this.renderImage(chooseLetter.small, chooseLetter.hint, chooseLetter.id, chooseLetter.name, chooseLetter.alt, chooseLetter.full);

    }

    renderImage(small, hint, id, name, alt, full) {
        let letterCode = document.getElementById('letter_img');
        letterCode.innerHTML = `<img src="img/${small}" title="${alt}"><p class="hint">${hint}</p>`;

        let keyd = document.getElementById('letter_check');
        keyd.addEventListener('keydown', function(e) {
            if (e.keyCode === 13) {
                e.preventDefault();
                newLetter.submit(keyd.value, name, id);
                newLetter.renderFull(full);
            }
        });
    }

    data() {

        this.renderImg(chooseLetter.small, chooseLetter.hint, chooseLetter.id, chooseLetter.name, chooseLetter.alt, chooseLetter.full)

        console.log('---');
        console.log(chooseLetter);
        console.log(this.letterArr);
    }

    render_Img(small, hint, id, name, alt, full) {

    }

    renderFull(full) {
        let letterCode = document.getElementById('letter_img');
        letterCode.innerHTML = `<img src="img/${full}">`;
    }

    randomizer(i) {
        return Math.floor(Math.random() * i);
    }

    submit(value, name, id) {
        document.getElementById('letter_check').value = '';
        console.log('submit2');
        console.log('-2-');
        console.log(value.toUpperCase());
        console.log('-2-');
        console.log(name);
        this.letterArr.push(id);
        console.log('-arr-');
        console.log(this.letterArr);
        console.log('-arr-');
        this.data();
    }

    finish() {
        console.log('Всё');
        this.letterArr = []
    }
}


let newLetter = new Alpabet();