const body = document.querySelector('body');
const root = document.createElement('div');
root.id = 'root';

body.append(root);

const keyboardIndicator = document.createElement('div');
keyboardIndicator.id = 'keyboardIndicator';
keyboardIndicator.textContent = 'Windows Keyboard';
root.appendChild(keyboardIndicator);

const languageIndicator = document.createElement('div');
languageIndicator.id = 'languageIndicator';
root.appendChild(languageIndicator);

const textArea = document.createElement('textarea');
textArea.id = 'textArea';
root.appendChild(textArea);

const LANGUAGES = ['en', 'ru'];

class Keyboard {
  static languageIndex = 0;
  static isLanguageChanged = false;

  constructor (buttons) {
    this.buttons = buttons.flat();
    this.html = null;
    this.isUppercase = false;
    languageIndicator.textContent = localStorage.getItem("lang");

    this.render();
  }

  getHtml = () => this.html;

  render = () => {
    this.html = document.createElement('div');
    this.html.id = 'keyboard';
    root.appendChild(this.html);
  };

  addRow = (row) => {
    this.html.appendChild(row);
  };

  specialButtonPressedHandler = (key) => {
    if (key === 'capslock') {
      this.isUppercase = !this.isUppercase;
      this.buttons.forEach(button => button.toggleRegistry(this.isUppercase));
    }
  };

  switchToSecondaryValues = () => {
    this.buttons.forEach(button => button.switchToSecondaryValue());
  };

  switchToPrimaryValues = () => {
    this.buttons.forEach(button => button.switchToPrimaryValue());
  };

  getButtonText = (key, isShiftPressed = false) => {
    this.specialButtonPressedHandler(key);

    const buttons = this.buttons.filter(button => button.key === key);
    if (buttons.length === 0) return '';

    const text = buttons[0].getText();
    return this.isUppercase
      ? isShiftPressed ? text.toLowerCase() : text.toUpperCase()
      : isShiftPressed ? text.toUpperCase() : text.toLowerCase();
  };
}

class Row {
  constructor (buttons, classes = []) {
    this.buttons = buttons;
    this.classes = ['keyboard-row', ...classes];
    this.html = null;

    this.render();
  }

  getHtml = () => this.html;

  render = () => {
    this.html = document.createElement('div');
    this.classes.forEach(c => this.html.classList.add(c));

    for (let j = 0; j < this.buttons.length; j++) {
      this.html.appendChild(this.buttons[j].getHtml());
    }
  };
}

class Button {
  constructor (key, textValues, buttonTextValue, classes = [], isFixed = false, isCapitalize = false, secondaryTextValue = '', secondaryButtonValue = '') {
    this.key = convertToProperCode(key);
    this.textValues = typeof (textValues) === 'string' ? new Array(LANGUAGES.length).fill(textValues) : textValues;
    this.buttonTextValues = typeof (buttonTextValue) === 'string' ? new Array(LANGUAGES.length).fill(buttonTextValue) : buttonTextValue;
    this.classes = ['button', ...classes];
    this.html = null;
    this.isFixed = isFixed;
    this.isCapitalize = isCapitalize;
    this.secondaryTextValue = secondaryTextValue;
    this.secondaryButtonValue = secondaryButtonValue;
    this.isUsingSecondary = false;

    this.render();
  }

  getHtml = () => this.html;

  getText = () => this.isUsingSecondary ? this.secondaryTextValue || this.textValues[Keyboard.languageIndex] : this.textValues[Keyboard.languageIndex];

  toggleRegistry = (isUppercase) => {
    if (this.isFixed) {
      if (this.key === 'capslock') {
        this.html.classList.add('button-capslock__on');
      }
      if (!isUppercase) {
        if (this.key === 'capslock') {
          this.html.classList.remove('button-capslock__on');
        }
      }
      return;
    }
    if (isUppercase) {
      this.html.textContent = this.html.textContent.toUpperCase();
    }
    if (!isUppercase) this.html.textContent = this.html.textContent.toLowerCase();
  };

  changeLanguage = () => {
    this.html.textContent = this.buttonTextValues[Keyboard.languageIndex];
  };

  switchToSecondaryValue = () => {
    this.isUsingSecondary = true;
    if (this.secondaryButtonValue) this.html.textContent = this.secondaryButtonValue;
  };

  switchToPrimaryValue = () => {
    this.isUsingSecondary = false;
    this.html.textContent = this.buttonTextValues[Keyboard.languageIndex];
  };

  render = () => {
    this.html = document.createElement('div');
    this.classes.forEach(c => this.html.classList.add(c));
    this.html.textContent = this.isCapitalize ? capitaliseWord(this.buttonTextValues[Keyboard.languageIndex]) : this.buttonTextValues[Keyboard.languageIndex];
    this.html.setAttribute('data-key', this.key);
  };
}

const capitaliseWord = (text) => {
  if (text.length === 0) return text;
  return text[0].toUpperCase() + text.slice(1);
};

const convertToProperCode = (key) => {
  return key.toLowerCase();
};

const changeKeyboardLanguage = () => {
  Keyboard.languageIndex = (Keyboard.languageIndex + 1) % LANGUAGES.length;
  languageIndicator.textContent = LANGUAGES[Keyboard.languageIndex];
  keyboard.buttons.forEach(button => button.changeLanguage());
  localStorage.setItem("lang", LANGUAGES[Keyboard.languageIndex])
};

const checkForSpecialShortcuts = (e) => {
  if (e.altKey && e.shiftKey && !Keyboard.isLanguageChanged) {
    changeKeyboardLanguage();
    return true;
  }

  if (e.ctrlKey && convertToProperCode(e.code) === 'keya') {
    textArea.setSelectionRange(0, textArea.value.length, 'forward');
    textArea.select();
    return true;
  }

  return false;
};

const keyDownEventHandler = (e) => {
  textArea.focus();
  const code = convertToProperCode(e.code);
  const button = document.querySelector(`.button[data-key="${code}"]`);
  button?.classList.add('button__active');

  if (code === 'shiftleft' || code === 'shiftright') {
    keyboard.switchToSecondaryValues();
    // return false;
  }

  if (notAllowedCodes.includes(code)) return;

  e.preventDefault();
  if (checkForSpecialShortcuts(e)) return;

  const selectionStart = textArea.selectionStart;
  const selectionEnd = textArea.selectionEnd;

  textArea.value = textArea.value.slice(0, selectionStart) + keyboard.getButtonText(code, e.shiftKey) + textArea.value.slice(selectionEnd);
  textArea.setSelectionRange(selectionStart + 1, selectionStart + 1);
};

const keyUpEventHandler = (e) => {
  textArea.focus();
  const code = convertToProperCode(e.code);

  const button = document.querySelector(`.button[data-key="${code}"]`);
  button?.classList.remove('button__active');
  if (notAllowedCodes.includes(code)) return;

  if (code === 'shiftleft' || code === 'shiftright') {
    keyboard.switchToPrimaryValues();
    // return false;
  }

  Keyboard.isLanguageChanged = false;
  e.preventDefault();
};

const keyClickEventHandler = (e) => {
  textArea.focus();
  const code = e.target.getAttribute('data-key');

  const button = document.querySelector(`.button[data-key="${code}"]`);
  button?.classList.add('button__active');

  const selectionStart = textArea.selectionStart;
  const selectionEnd = textArea.selectionEnd;

  textArea.value = textArea.value.slice(0, selectionStart) + keyboard.getButtonText(code, e.shiftKey) + textArea.value.slice(selectionEnd);

  console.log(textArea.value);

  if (code == 'backspace') {
    textArea.value = textArea.value.slice(0, selectionStart - 1) + textArea.value.slice(selectionEnd);
    textArea.setSelectionRange(selectionStart - 1, selectionStart - 1);
  }

  if (code == 'delete') {
    textArea.value = textArea.value.slice(0, selectionStart) + textArea.value.slice(selectionEnd + 1);
    textArea.setSelectionRange(selectionStart, selectionStart);
  }

  if (code == 'arrowleft') {
    console.log(code);
    console.log(selectionStart);
    console.log(selectionEnd);
    textArea.setSelectionRange(selectionStart - 1, selectionStart - 1);
  }

  if (code == 'arrowright') {
    console.log(code);
    console.log(selectionStart);
    console.log(selectionEnd);
    textArea.setSelectionRange(selectionStart + 1, selectionStart + 1);
  }

  button?.classList.remove('button__active');
};

const notAllowedCodes = ['arrowup', 'arrowleft', 'arrowdown', 'arrowright', 'backspace', 'delete', 'enter'];

const keyboardButtons = [
  [
    new Button('backquote', ['`', 'ё'], ['`', 'ё'], ['button__regular'], false, false, '~', '~'),
    new Button('digit1', '1', '1', ['button__regular'], false, false, '!', '!'),
    new Button('digit2', '2', '2', ['button__regular'], false, false, '@', '@'),
    new Button('digit3', '3', '3', ['button__regular'], false, false, '#', '#'),
    new Button('digit4', '4', '4', ['button__regular'], false, false, '$', '$'),
    new Button('digit5', '5', '5', ['button__regular'], false, false, '%', '%'),
    new Button('digit6', '6', '6', ['button__regular'], false, false, ':', ':'),
    new Button('digit7', '7', '7', ['button__regular'], false, false, '?', '?'),
    new Button('digit8', '8', '8', ['button__regular'], false, false, '*', '*'),
    new Button('digit9', '9', '9', ['button__regular'], false, false, '(', '('),
    new Button('digit0', '0', '0', ['button__regular'], false, false, ')', ')'),
    new Button('minus', '-', '-', ['button__regular'], false, false, '_', '_'),
    new Button('equal', '=', '=', ['button__regular'], false, false, '+', '+'),
    new Button('backspace', '', 'Backspace', ['button__larger'], true, true)
  ],
  [
    new Button('tab', '\t', 'Tab', ['button__large'], true, true),
    new Button('keyq', ['q', 'й'], ['q', 'й'], ['button__regular']),
    new Button('keyw', ['w', 'ц'], ['w', 'ц'], ['button__regular']),
    new Button('keye', ['e', 'у'], ['e', 'у'], ['button__regular']),
    new Button('keyr', ['r', 'к'], ['r', 'к'], ['button__regular']),
    new Button('keyt', ['t', 'е'], ['t', 'е'], ['button__regular']),
    new Button('keyy', ['y', 'н'], ['y', 'н'], ['button__regular']),
    new Button('keyu', ['u', 'г'], ['u', 'г'], ['button__regular']),
    new Button('keyi', ['i', 'ш'], ['i', 'ш'], ['button__regular']),
    new Button('keyo', ['o', 'щ'], ['o', 'щ'], ['button__regular']),
    new Button('keyp', ['p', 'з'], ['p', 'з'], ['button__regular']),
    new Button('bracketLeft', ['[', 'х'], ['[', 'х'], ['button__regular']),
    new Button('bracketRight', [']', 'ъ'], [']', 'ъ'], ['button__regular']),
    new Button('backslash', '\\', '\\', ['button__regular'], false, false, '/', '/'),
    new Button('delete', '', 'Delete', ['button__large'], true, true)
  ],
  [
    new Button('capslock', '', 'Caps Lock', ['button__larger'], true, true),
    new Button('keya', ['a', 'ф'], ['a', 'ф'], ['button__regular']),
    new Button('keys', ['s', 'ы'], ['s', 'ы'], ['button__regular']),
    new Button('keyd', ['d', 'в'], ['d', 'в'], ['button__regular']),
    new Button('keyf', ['f', 'а'], ['f', 'а'], ['button__regular']),
    new Button('keyg', ['g', 'п'], ['g', 'п'], ['button__regular']),
    new Button('keyh', ['h', 'р'], ['h', 'р'], ['button__regular']),
    new Button('keyj', ['j', 'о'], ['j', 'о'], ['button__regular']),
    new Button('keyk', ['k', 'л'], ['k', 'л'], ['button__regular']),
    new Button('keyl', ['l', 'д'], ['l', 'д'], ['button__regular']),
    new Button('semicolon', [';', 'ж'], [';', 'ж'], ['button__regular']),
    new Button('quote', ['\'', 'э'], ['\'', 'э'], ['button__regular']),
    new Button('enter', '\n', 'Enter', ['button__larger'], true, true)
  ],
  [
    new Button('shiftLeft', '', 'Shift', ['button__larger'], true, true),
    new Button('keyz', ['z', 'я'], ['z', 'я'], ['button__regular']),
    new Button('keyx', ['x', 'ч'], ['x', 'ч'], ['button__regular']),
    new Button('keyc', ['c', 'с'], ['c', 'с'], ['button__regular']),
    new Button('keyv', ['v', 'м'], ['v', 'м'], ['button__regular']),
    new Button('keyb', ['b', 'и'], ['b', 'и'], ['button__regular']),
    new Button('keyn', ['n', 'т'], ['n', 'т'], ['button__regular']),
    new Button('keym', ['m', 'ь'], ['m', 'ь'], ['button__regular']),
    new Button('comma', [',', 'б'], [',', 'б'], ['button__regular']),
    new Button('period', ['.', 'ю'], ['.', 'ю'], ['button__regular']),
    new Button('slash', ['/', '.'], ['/', '.'], ['button__regular']),
    new Button('arrowUp', '', '↑', ['button__large'], true, true),
    new Button('shiftRight', '', 'Shift', ['button__large'], true, true)
  ],
  [
    new Button('controlleft', '', 'Ctrl', ['button__large'], true, true),
    new Button('metaleft', '', 'Win', ['button__large'], true, true),
    new Button('altLeft', '', 'Alt', ['button__large'], true, true),
    new Button('space', ' ', '', ['button__whitespace'], true, true),
    new Button('altRight', '', 'Alt', ['button__large'], true, true),
    new Button('controlright', '', 'Ctrl', ['button__large'], true, true),
    new Button('arrowleft', '', '←', ['button__large'], true, true),
    new Button('arrowdown', '', '↓', ['button__large'], true, true),
    new Button('arrowright', '', '→', ['button__large'], true, true)
  ]
];

const keyboard = new Keyboard(keyboardButtons);

const renderKeyboard = () => {
  for (let i = 0; i < keyboardButtons.length; i++) {
    keyboard.addRow(new Row(keyboardButtons[i]).getHtml());
  }
};

renderKeyboard();

document.addEventListener('keydown', keyDownEventHandler);
document.addEventListener('keyup', keyUpEventHandler);
document.addEventListener('click', keyClickEventHandler);
