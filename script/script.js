let app = new Vue({
    el: '#app',
    data: {
        visible: false
    },
});

class Alpabet {
    constructor() {
        this.allData;
        this.letterArr = [];
        this._init();
        this.letterId;
    }

    _init() {
        this.getLetters();
    }

    async getLetters() {
        let response = await fetch('data/alphabet.json');
        this.allData = await response.json();
        this.data();
    }

    data() {
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
        this.renderImg(chooseLetter.small, chooseLetter.hint, chooseLetter.id, chooseLetter.name, chooseLetter.alt, chooseLetter.full)

        console.log('---');
        console.log(chooseLetter);
        console.log(this.letterArr);
    }

    renderImg(small, hint, id, name, alt, full) {
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