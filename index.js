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
        this.key = convertToProperKey(key);
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

        if (this.isFixed) {
            if (this.key === 'capslock') {
                this.html.classList.add("button-capslock__on")
            }
            if (!isUppercase) {
                if (this.key === 'capslock') {
                    this.html.classList.remove("button-capslock__on")
                }
            }
            return
        }
        if (isUppercase) {
            this.html.textContent = this.html.textContent.toUpperCase()


        }
        if (!isUppercase) this.html.textContent = this.html.textContent.toLowerCase();

    };

    render = () => {
        this.html = document.createElement("div");
        this.classes.forEach(c => this.html.classList.add(c));
        this.html.textContent = convertToProperKeyName(this.key, this.isCapitalize)
        this.html.setAttribute("data-key", this.key)
    }
}

function setCaretPosition(ctrl, pos) {
    if (ctrl.setSelectionRange) {
        ctrl.focus();
        ctrl.setSelectionRange(pos, pos);
    }
    // else if (ctrl.createTextRange){
    //     var range = ctrl.createTextRange();
    //     range.collapse(true);
    //     range.moveEnd
    // }
}

const convertToProperKey = (key) => {
    if (key === '\\') key = 'backslash'
    if (key === 'ArrowUp') key = "↑"
    if (key === 'ArrowLeft') key = "←"
    if (key === 'ArrowDown') key = "↓"
    if (key === 'ArrowRight') key = "→"
    if (key === 'Control') key = "Ctrl"
    return key.toLowerCase();
}

const convertToProperKeyName = (key, isCapitalize = false) => {
    if (key === 'backslash') key = "\\"
    return isCapitalize ? key[0].toUpperCase() + key.slice(1) : key;
}

const keyDownEventHandler = (e) => {
    if (!allowedKeys.includes(e.key)) {
        e.preventDefault();
    }
    var key = convertToProperKey(e.key);
    const button = document.querySelector(`.button[data-key="${key}"]`)
    button?.classList.add("button__active")

    textArea.textContent += keyboard.getButtonText(key)
}

const keyUpEventHandler = (e) => {
    if (!allowedKeys.includes(e.key)) {
        e.preventDefault();
    }
    const key = convertToProperKey(e.key);
    const button = document.querySelector(`.button[data-key="${key}"]`)
    button?.classList.remove("button__active")
}

let allowedKeys = ['ArrowUp', 'ArrowLeft', 'ArrowDown', 'ArrowRight', 'backspace', 'delete',]

const keyboardButtons = [
    [
        new Button('`', '`', ['button__regular']),
        new Button('1', '1', ['button__regular']),
        new Button('2', '2', ['button__regular']),
        new Button('3', '3', ['button__regular']),
        new Button('4', '4', ['button__regular']),
        new Button('5', '5', ['button__regular']),
        new Button('6', '6', ['button__regular']),
        new Button('7', '7', ['button__regular']),
        new Button('8', '8', ['button__regular']),
        new Button('9', '9', ['button__regular']),
        new Button('0', '0', ['button__regular']),
        new Button('-', '-', ['button__regular']),
        new Button('=', '=', ['button__regular']),
        new Button('backspace', '', ['button__larger'], true, true)
    ],
    [
        new Button('tab', '\t', ['button__large'], true, true),
        new Button('q', 'q', ['button__regular']),
        new Button('w', 'w', ['button__regular']),
        new Button('e', 'e', ['button__regular']),
        new Button('r', 'r', ['button__regular']),
        new Button('t', 't', ['button__regular']),
        new Button('y', 'y', ['button__regular']),
        new Button('u', 'u', ['button__regular']),
        new Button('i', 'i', ['button__regular']),
        new Button('o', 'o', ['button__regular']),
        new Button('p', 'p', ['button__regular']),
        new Button('[', '[', ['button__regular']),
        new Button(']', ']', ['button__regular']),
        new Button('\\', '\\', ['button__regular']),
        new Button('delete', '', ['button__large'], true, true),
    ],
    [
        new Button('capslock', '', ['button__larger'], true, true),
        new Button('a', 'a', ['button__regular']),
        new Button('s', 's', ['button__regular']),
        new Button('d', 'd', ['button__regular']),
        new Button('f', 'f', ['button__regular']),
        new Button('g', 'g', ['button__regular']),
        new Button('h', 'h', ['button__regular']),
        new Button('j', 'j', ['button__regular']),
        new Button('k', 'k', ['button__regular']),
        new Button('l', 'l', ['button__regular']),
        new Button(';', ';', ['button__regular']),
        new Button('\'', '\'', ['button__regular']),
        new Button('enter', '\n', ['button__larger'], true, true),
    ],
    [
        new Button('shift', '', ['button__larger'], true, true),
        new Button('\\', '\\', ['button__regular']),
        new Button('z', 'z', ['button__regular']),
        new Button('x', 'x', ['button__regular']),
        new Button('c', 'c', ['button__regular']),
        new Button('v', 'v', ['button__regular']),
        new Button('b', 'b', ['button__regular']),
        new Button('n', 'n', ['button__regular']),
        new Button('m', 'm', ['button__regular']),
        new Button(',', ',', ['button__regular']),
        new Button('.', '.', ['button__regular']),
        new Button('/', '/', ['button__regular']),
        new Button('ArrowUp', '', ['button__large'], true, true),
        new Button('shift', '', ['button__large'], true, true),
    ],
    [
        new Button('Control', '', ['button__large'], true, true),
        new Button('Win', 'windows', ['button__large'], true, true),
        new Button('Alt', '', ['button__large'], true, true),
        new Button(' ', ' ', ['button__whitespace'], true, true),
        new Button('Alt', '', ['button__large'], true, true),
        new Button('Control', '', ['button__large'], true, true),
        new Button('ArrowLeft', '', ['button__large'], true, true),
        new Button('ArrowDown', '', ['button__large'], true, true),
        new Button('ArrowRight', '', ['button__large'], true, true),
    ]

]


const keyboardButtonsRus = [
    [
        new Button('`', '`', ['button__regular']),
        new Button('1', '1', ['button__regular']),
        new Button('2', '2', ['button__regular']),
        new Button('3', '3', ['button__regular']),
        new Button('4', '4', ['button__regular']),
        new Button('5', '5', ['button__regular']),
        new Button('6', '6', ['button__regular']),
        new Button('7', '7', ['button__regular']),
        new Button('8', '8', ['button__regular']),
        new Button('9', '9', ['button__regular']),
        new Button('0', '0', ['button__regular']),
        new Button('-', '-', ['button__regular']),
        new Button('=', '=', ['button__regular']),
        new Button('backspace', '', ['button__larger'], true, true)
    ],
    [
        new Button('tab', '\t', ['button__large'], true, true),
        new Button('й', 'й', ['button__regular']),
        new Button('ц', 'ц', ['button__regular']),
        new Button('у', 'у', ['button__regular']),
        new Button('к', 'к', ['button__regular']),
        new Button('е', 'е', ['button__regular']),
        new Button('н', 'н', ['button__regular']),
        new Button('г', 'г', ['button__regular']),
        new Button('ш', 'ш', ['button__regular']),
        new Button('щ', 'щ', ['button__regular']),
        new Button('з', 'з', ['button__regular']),
        new Button('х', 'х', ['button__regular']),
        new Button('ъ', 'ъ', ['button__regular']),
        new Button('\\', '\\', ['button__regular']),
        new Button('delete', '', ['button__large'], true, true),
    ],
    [
        new Button('capslock', '', ['button__larger'], true, true),
        new Button('ф', 'ф', ['button__regular']),
        new Button('ы', 'ы', ['button__regular']),
        new Button('в', 'в', ['button__regular']),
        new Button('а', 'а', ['button__regular']),
        new Button('п', 'п', ['button__regular']),
        new Button('р', 'р', ['button__regular']),
        new Button('о', 'о', ['button__regular']),
        new Button('л', 'л', ['button__regular']),
        new Button('д', 'д', ['button__regular']),
        new Button('ж', 'ж', ['button__regular']),
        new Button('э', 'э', ['button__regular']),
        new Button('enter', '\n', ['button__larger'], true, true),
    ],
    [
        new Button('shift', 'shift(left)', ['button__larger'], true, true),
        new Button('\\', '\\', ['button__regular']),
        new Button('я', 'я', ['button__regular']),
        new Button('ч', 'ч', ['button__regular']),
        new Button('с', 'с', ['button__regular']),
        new Button('м', 'м', ['button__regular']),
        new Button('и', 'и', ['button__regular']),
        new Button('т', 'т', ['button__regular']),
        new Button('ь', 'ь', ['button__regular']),
        new Button('б', 'б', ['button__regular']),
        new Button('ю', 'ю', ['button__regular']),
        new Button('.', '.', ['button__regular']),
        new Button('ArrowUp', '', ['button__large'], true, true),
        new Button('shift', 'shift(right)', ['button__large'], true, true),
    ],
    [
        new Button('Control', '', ['button__large'], true, true),
        new Button('Win', 'windows', ['button__large'], true, true),
        new Button('Alt', '', ['button__large'], true, true),
        new Button(' ', ' ', ['button__whitespace'], true, true),
        new Button('Alt', '', ['button__large'], true, true),
        new Button('Control', '', ['button__large'], true, true),
        new Button('ArrowLeft', '', ['button__large'], true, true),
        new Button('ArrowDown', '', ['button__large'], true, true),
        new Button('ArrowRight', '', ['button__large'], true, true),
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

