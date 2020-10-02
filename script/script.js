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
    constructor(countAnswer = 0, skipLetterCount = 0, rightAnswer) {
        this.allData;
        this.letterArr = [];
        this._init();
        this.letterId;
        this.mainPlace = document.getElementById('main__place');
        this.countAnswer = countAnswer;
        this.rightAnswer = rightAnswer;
        this.skipLetter = [];
        this.skipLetterCount = skipLetterCount;
        this.countFirst = false;
        this.divClass;
        this.skipClass;
        this.skipCount;
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
        newLetter.renderGame();
    }

    renderGame() {
        ((this.skipLetterCount > 0) || (this.countAnswer > 0)) ? this.divClass = "count": this.divClass = "novisible";
        (this.skipLetterCount > 0) ? this.skipClass = "skip__letter": this.skipClass = "novisible";
        (this.countAnswer > 0) ? this.skipCount = "count__numbers": this.skipCount = "novisible";

        let strCount = `<div class="${this.divClass}">
        <div class="${this.skipClass}" id="countSkip"></div>
        <div class="${this.skipCount}" id="countNumb"></div>
        </div>`;
        let strLetter = `<p class="desc__text">Буква:</p>`;
        let strImg = `<div class="letter" id="letter_img"></div>`;
        let strInput = `<p class="desc__text">Твой вариант:</p>
        <input class="form__input" type="text" id="letter_check">
        <div class="form"><button class="button__start">Ответить</button>
        <p class="form_skip" id="skipLetter">Пропустить эту букву</p></div>`;

        this.mainPlace.insertAdjacentHTML('beforeend', strCount + strLetter + strImg + strInput);

        this.check_skip();

        //Генерация случайного порядкового номера буквы
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

        //Рендер изображения
        this.renderImage(chooseLetter.small, chooseLetter.hint, chooseLetter.id, chooseLetter.name, chooseLetter.alt, chooseLetter.full);

        let keyd = document.getElementById('letter_check');
        keyd.addEventListener('keydown', function(e) {
            if (e.keyCode === 13) {
                e.preventDefault();
                newLetter.submit(keyd.value, chooseLetter.name, chooseLetter.id, chooseLetter.full);
            }
        });

        //Слушаю событие: нажать на ссылку "Пропустить букву"
        document.getElementById('skipLetter').addEventListener('click', () => {
            this.skip_letter(chooseLetter.id);
        });

    }

    renderImage(small, hint, id, name, alt, full) {
        let letterCode = document.getElementById('letter_img');
        letterCode.innerHTML = `<img src="img/${small}" title="${alt}"><p class="hint">${hint}</p>`;
    }

    check_skip() {
        let skipstr;
        if (this.skipLetterCount == 1) {
            skipstr = `Пропущена 1 буква`;
        } else if ((this.skipLetterCount >= 2) && (this.skipLetterCount <= 4)) {
            skipstr = `Пропущено ${this.skipLetterCount} буквы`;
        } else {
            skipstr = `Пропущено ${this.skipLetterCount} букв`;
        }

        document.getElementById('countSkip').insertAdjacentHTML('beforeend', skipstr);
    }

    skip_letter(letter_id) {
        this.skipLetter.push(letter_id);
        this.skipLetterCount++;
        this.play();
    }

    data() {

        this.renderImg(chooseLetter.small, chooseLetter.hint, chooseLetter.id, chooseLetter.name, chooseLetter.alt, chooseLetter.full)
    }

    //Рендер большого изображения (после ответа)
    renderFull(full) {
        let letterCode = document.getElementById('letter_img');
        letterCode.innerHTML = `<img src="img/${full}">`;
    }

    randomizer(i) {
        return Math.floor(Math.random() * i);
    }

    submit(value, name, id, full) {

        //Очищаю input
        document.getElementById('letter_check').value = '';
        if (value == name) {
            rightAnswer++;
        }

        // let submitStr = ;
        // id="countNumb"

        this.letterArr.push(id);
        this.renderFull(full);
    }

    finish() {
        console.log('Всё');
        this.letterArr = []
    }
}


let newLetter = new Alpabet();