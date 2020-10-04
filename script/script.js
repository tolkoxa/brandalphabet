let app = new Vue({
    el: '#app',
    data: {
        visible: false
    },
});

class Alpabet {
    constructor(countAnswer = 0, rightAnswer = 0, letterCount = 1) {
        this._init();
        this.allData; //массив из json–файла
        this.letterArr = []; //массив букв, которые уже были
        this.letterId; //id буквы, которая выбрана сейчас
        this.mainPlace = document.getElementById('main__place'); //разметка, куда рендерится основное поле
        this.countAllId = document.getElementById('countAll'); //разметка для рендера счёта и пропущеных букв
        this.countAnswer = countAnswer; //количество букв, на которые был ответ
        this.rightAnswer = rightAnswer; //количество букв, которые были угаданы
        this.skipLetter = []; //массив пропущенных букв
        this.divClass;
        this.skipClass;
        this.skipCount;
        this.letterCount = letterCount;
        this.renderAllLetters = false;
        this.i;
    }

    _init() {
        this.getLetters();
    }

    async getLetters() {
        let response = await fetch('data/alphabet.json');
        this.allData = await response.json();

        delete this.allData[0];

        this.start();
    }

    start() {
        this.mainPlace.innerHTML = '';
        this.mainPlace.insertAdjacentHTML('beforeend', `
        <div class="button">
        <button class="button__start" id="btn_start">Начать</button>
        </div>
        `);

        document.getElementById('btn_start').addEventListener('click', () => {
            this.mainPlace.innerHTML = '';
            this.renderCount();
            this.renderMain();
        });
    }
    renderCount() {
        console.log(this.countAnswer);
        ((this.skipLetter.length > 0) || (this.countAnswer > 0)) ? this.divClass = "count": this.divClass = "novisible";
        (this.skipLetter.length > 0) ? this.skipClass = "skip__letter": this.skipClass = "novisible";
        (this.countAnswer > 0) ? this.skipCount = "count__numbers": this.skipCount = "novisible";

        let strCount = `<div class="${this.divClass}">
        <div class="${this.skipClass}" id="countSkip"></div>
        <div class="${this.skipCount}" id="countNumb"></div>
        </div>`;
        this.countAllId.innerHTML = '';
        this.countAllId.insertAdjacentHTML('beforeend', strCount);
        this.check_skip();
        this.check_answer();
    }
    renderMain() {
        let strLetter = `<p class="desc__text">Буква:</p>`;
        let strImg = `<div class="letter" id="letter_img"></div>`;
        let strInput = `<p class="desc__text">Твой вариант:</p>
        <input class="form__input" type="text" id="letter_check">
        <div class="form"><button class="button__start" id="btnAnswer">Ответить</button>
        <p class="form_skip" id="skipLetter">Пропустить эту букву</p></div>`;

        this.mainPlace.insertAdjacentHTML('beforeend', strLetter + strImg + strInput);

        let chooseLetter;
        if (this.letterCount < 34) {
            chooseLetter = this.allData[this.letterCount];
        } else if (this.letterCount > 33 && this.skipLetter.length > 0) {
            chooseLetter = this.allData[this.skipLetter[this.i]];
        } else {
            this.finish();
        }
        // (!this.renderAllLetters) ? chooseLetter = this.allData[this.letterCount]: chooseLetter = this.skipLetter[i];

        //Рендер изображения
        let letterCode = document.getElementById('letter_img');
        letterCode.innerHTML = `<img src="img/${chooseLetter.small}" title="${chooseLetter.alt}"><p class="hint">${chooseLetter.hint}</p>`;

        let keyd = document.getElementById('letter_check');
        keyd.addEventListener('keydown', function(e) {
            if (e.keyCode === 13) {
                e.preventDefault();
                newLetter.showAnswer(keyd.value, chooseLetter.name, chooseLetter.id, chooseLetter.full);
            }
        });

        //Событие: нажали кнопку "Ответить"
        document.getElementById('btnAnswer').addEventListener('click', () => {
            this.showAnswer(keyd.value, chooseLetter.name, chooseLetter.id, chooseLetter.full);
        });

        //Слушаю событие: нажать на ссылку "Пропустить букву"
        document.getElementById('skipLetter').addEventListener('click', () => {
            this.skip_letter(chooseLetter.id);
        });
    }

    showAnswer(answer, name, id, full) {
        answer = answer.toUpperCase();
        let strLetter = `<p class="desc__text">Бренд:</p>`;
        let strImg = `<div class="letter" id="letter_img"><img src="img/${full}"></div>`;
        let strInput = `<p class="desc__text">Твой вариант: ${answer}</p>
        <p class="desc__text">Правильный ответ: ${name}</p>
        <div class="button">
        <button class="button__start" id="btn_start">Продолжить</button>
        </div>
        </div>`;

        this.mainPlace.innerHTML = '';
        this.mainPlace.insertAdjacentHTML('beforeend', strLetter + strImg + strInput);

        if (answer === name) {
            this.rightAnswer++
        }
        this.countAnswer++;
        this.letterCount++;

        if (this.i < this.skipLetter.length) {
            this.i++;
        }

        this.renderCount();
        this.check_answer();

        document.getElementById('btn_start').addEventListener('click', () => {
            this.mainPlace.innerHTML = '';
            this.renderMain();
        });

        if (this.countAnswer == 33) { this.finish() };
    }

    check_answer() {
        document.getElementById('countNumb').innerHTML = `Отгадано ${this.rightAnswer} из ${this.countAnswer}`;
    }

    check_skip() {
        let skipstr;
        if (this.skipLetter.length == 1) {
            skipstr = `Пропущена 1 буква`;
        } else if ((this.skipLetter.length >= 2) && (this.skipLetter.length <= 4)) {
            skipstr = `Пропущено ${this.skipLetter.length} буквы`;
        } else {
            skipstr = `Пропущено ${this.skipLetter.length} букв`;
        }

        document.getElementById('countSkip').insertAdjacentHTML('beforeend', skipstr);
    }

    skip_letter(letter_id) {
        this.skipLetter.push(letter_id);
        this.letterCount++;
        this.mainPlace.innerHTML = '';
        this.renderCount();
        this.renderMain();
    }

    finish() {
        console.log('Всё');
        this.letterArr = []
    }
}

let newLetter = new Alpabet();