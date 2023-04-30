const body = document.querySelector("body");
const root = document.createElement("div");
root.id = "root";

body.append(root);

const textArea = document.createElement('textarea');
textArea.id = "textArea";
root.appendChild(textArea);


class Keyboard {
    constructor(buttons) {
        this.buttons = buttons.flat();
        this.html = null;
        this.isUppercase = false;

        this.render();
    }

    getHtml = () => this.html;

    render = () => {
        this.html = document.createElement("div");
        this.html.id = "keyboard";
        root.appendChild(this.html)
    }

    addRow = (row) => {
        this.html.appendChild(row)
    }

    buttonPressed = (key) => {
        if (key === 'capslock') {
            this.isUppercase = !this.isUppercase;
            this.buttons.forEach(button => button.toggleRegistry(this.isUppercase))
        }
    }

    getButtonText = (key) => {
        this.buttonPressed(key)

        let buttons = this.buttons.filter(button => button.key === key)
        if (buttons.length === 0) return '';

        let text = buttons[0].getText();
        return this.isUppercase ? text.toUpperCase() : text.toLowerCase();
    }
}

class Row {
    constructor(buttons, classes = []) {
        this.buttons = buttons;
        this.classes = ["keyboard-row", ...classes]
        this.html = null;

        this.render();
    }

    getHtml = () => this.html;

    render = () => {
        this.html = document.createElement("div");
        this.classes.forEach(c => this.html.classList.add(c))

        for (let j = 0; j < this.buttons.length; j++) {
            this.html.appendChild(this.buttons[j].getHtml())
        }
    }
}

class Button {
    constructor(key, value, classes, isFixed = false, isCapitalize = false) {
        this.key = key;
        this.value = value;
        this.classes = ["button", ...classes];
        this.html = null;
        this.isFixed = isFixed;
        this.isCapitalize = isCapitalize;

        this.render();
    }

    getHtml = () => this.html;

    getText = () => this.value;

    toggleRegistry = (isUppercase) => {
        if(this.isFixed) return;

        if(isUppercase) this.html.textContent = this.html.textContent.toUpperCase();
        if(!isUppercase) this.html.textContent = this.html.textContent.toLowerCase();
    };

    render = () => {
        this.html = document.createElement("div");
        this.classes.forEach(c => this.html.classList.add(c));
        this.html.textContent = this.isCapitalize ? this.key[0].toUpperCase() + this.key.slice(1) : this.key;
        this.html.setAttribute("data-key", this.key)
    }
}


const keyDownEventHandler = (e) => {
    e.preventDefault();
    const key = e.key.toLowerCase();
    const button = document.querySelector(`.button[data-key="${key}"]`)
    button?.classList.add("button__active")

    textArea.textContent += keyboard.getButtonText(key)
}

const keyUpEventHandler = (e) => {
    e.preventDefault();
    const key = e.key.toLowerCase();
    const button = document.querySelector(`.button[data-key="${key}"]`)
    button?.classList.remove("button__active")
}

const keyboardButtons = [
    [
        new Button('`', '`', ['button__regular']),
        new Button('1', '1', ['button__regular']),
        new Button('2', '2', ['button__regular']),
        new Button('3', '3', ['button__regular']),
        new Button('4', '4', ['button__regular']),
        new Button('5', '5', ['button__regular']),
    ],
    [
        new Button('tab', '\t', ['button__large'], true, true),
        new Button('q', 'q', ['button__regular']),
        new Button('w', 'w', ['button__regular']),
        new Button('e', 'e', ['button__regular']),
        new Button('r', 'r', ['button__regular']),
        new Button('t', 't', ['button__regular']),
    ],
    [
        new Button('capslock', '', ['button__larger'], true, true),
    ]
]
const keyboard = new Keyboard(keyboardButtons)

const renderKeyboard = () => {
    for (let i = 0; i < keyboardButtons.length; i++) {
        keyboard.addRow(new Row(keyboardButtons[i]).getHtml())
    }
}

renderKeyboard();

document.addEventListener('keydown', keyDownEventHandler);
document.addEventListener('keyup', keyUpEventHandler);
