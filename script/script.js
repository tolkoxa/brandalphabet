let app = new Vue({
    el: '#app',
    data: {
        visible: false
    },
});

class Alpabet {
    constructor(countAnswer = 0, rightAnswer = 0, letterCount = 1, i = 0) {
        this._init();
        this.allData; //массив из json–файла
        this.letterArr = []; //массив букв, которые уже были
        this.mainPlace = document.getElementById('main__place'); //разметка, куда рендерится основное поле
        this.countAllId = document.getElementById('countAll'); //разметка для рендера счёта и пропущеных букв
        this.countAnswer = countAnswer; //количество букв, на которые был ответ
        this.rightAnswer = rightAnswer; //количество букв, которые были угаданы
        this.skipLetter = []; //массив пропущенных букв
        this.divClass;
        this.skipClass;
        this.skipCount;
        this.letterCount = letterCount;
        this.i = i;
        this.chooseLetter;
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
        </div>`);

        document.getElementById('btn_start').addEventListener('click', () => {
            this.mainPlace.innerHTML = '';
            this.renderCount();
            this.renderMain();
        });
    }
    renderCount() {
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


        if (this.letterCount < 34) {
            this.chooseLetter = this.allData[this.letterCount];
        } else if (this.letterCount > 33 && this.skipLetter.length > 0) {
            this.chooseLetter = this.allData[this.skipLetter[this.i]];
            if (this.i < this.skipLetter.length) { this.i++ }
        } else {
            this.finish();
        }

        if (this.countAnswer < 33) {

            // document.getElementById('letter_check').focus();


            //Рендер изображения
            let letterCode = document.getElementById('letter_img');
            letterCode.innerHTML = `<img src="img/${this.chooseLetter.small}" title="${this.chooseLetter.alt}"><p class="hint">${this.chooseLetter.hint}</p>`;

            let keyd = document.getElementById('letter_check');
            keyd.addEventListener('keydown', function(e) {
                if (e.keyCode === 13) {
                    e.preventDefault();
                    newLetter.showAnswer(keyd.value, newLetter.chooseLetter.name, newLetter.chooseLetter.id, newLetter.chooseLetter.full);
                }
            });

            //Событие: нажали кнопку "Ответить"
            document.getElementById('btnAnswer').addEventListener('click', () => {
                this.showAnswer(keyd.value, this.chooseLetter.name, this.chooseLetter.id, this.chooseLetter.full);
            });

            //Слушаю событие: нажать на ссылку "Пропустить букву"
            document.getElementById('skipLetter').addEventListener('click', () => {
                this.skip_letter(this.chooseLetter.id);
            });
        }
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

        this.renderCount();
        this.check_answer();

        if (this.countAnswer == 33) { this.finish() };

        document.getElementById('btn_start').addEventListener('click', () => {
            this.mainPlace.innerHTML = '';
            this.renderMain();
        });
    }

    check_answer() {
        document.getElementById('countNumb').innerHTML = `Отгадано ${this.rightAnswer} из ${this.countAnswer}`;
    }

    check_skip() {
        let skipstr;
        let skipRight = this.skipLetter.length - this.i;
        if (skipRight == 0) { skipstr = ""; } else if (skipRight == 1) {
            skipstr = `Пропущена 1 буква`;
        } else if ((skipRight >= 2) && (skipRight <= 4)) {
            skipstr = `Пропущено ${skipRight} буквы`;
        } else {
            skipstr = `Пропущено ${skipRight} букв`;
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
        this.countAllId.innerHTML = '';
        this.mainPlace.innerHTML = '';

        let strCount;
        let strImg;
        let strText;
        let strBtn;

        strCount = `<div class="result">
        <p class="result__count">ТВОЙ РЕЗУЛЬТАТ</p>
        <p class="result__numbers">Верных ответов: ${this.rightAnswer} из ${this.countAnswer}.</p>`;

        strImg = `<div class="result__img">
        <div class="result__cloud">Поздравляем! Отличный результат. <br>Если бы мы с тобой придумывали азбуку, то сделали бы это быстрее и лучше.</div>
        </div>`;

        strText = `<div class="result__text">
        <p class="result__text_item">Надеюсь, что игра тебе понравилась. Сейчас в игре на каждую букву только один вариант, поэтому повторно её проходить уже не так интересно.</p>
        <p class="result__text_item">Скоро добавлю ещё несколько вариантов.</p>
        <p class="result__text_item">А сейчас расскажи об этой игре своим друщьям и знакомым.</p>
        <p class="result__text_item">Кроме этого, ты можешь поблагодарить разработчика или посмотреть другие проекты.</p></div>`;

        strBtn = `<div class="button">
        <button class="button__start" id="btn_start">Повторить</button>
        </div>
        </div>`;

        this.mainPlace.insertAdjacentHTML('beforeend', strCount + strImg + strText + strBtn);
        document.getElementById('btn_start').addEventListener('click', () => {
            this.mainPlace.innerHTML = '';
            this.restart();
        });
    }

    restart() {
        this.allData = [];
        this.letterArr = [];
        this.countAnswer = 0;
        this.rightAnswer = 0;
        this.skipLetter = [];
        this.letterCount = 1;
        this.i = 0;
        this.getLetters();
    }
}

let newLetter = new Alpabet();