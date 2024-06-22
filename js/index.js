const display = document.getElementById('display');
const result = document.getElementById('result');
const keys = document.querySelectorAll('.keys div');
const registerFlag = document.getElementById('result-register');
let register = null;
let lastResult = 0;

// Event listeners for specific buttons and invoked functions
document.getElementById('clear').addEventListener('click', () => {
    display.value = '';
    result.value = '';
    register = null;
});

document.querySelector('#keys .btn-calc').addEventListener('click', () => {
    doCalculation();
});

function doCalculation() {
    try {
        let input = substituteAns(display.value);
        result.value = math.evaluate(input);
        lastResult = result.value;
        if (result.value == 'undefined') {
            result.value = '';
            lastResult = 0; 
        }
    } catch (error) {
        result.value = 'Syntax Error';
    }
    display.setSelectionRange(0, display.value.length);
}

function substituteAns(expr) {
    return expr.replace(/ans/g, lastResult);
}

// Callback functions and invoked functions
function insertAtCaret(input) {
    // Prevent all characters except for numbers, math operators and common parentheses
    if (display.value.length < settings.maxlengthinput) {
        const sav = display.selectionStart;
        if (sav < display.selectionEnd) {
            deleteSelection();
        }
        display.value = display.value.slice(0, display.selectionStart) + input + display.value.slice(display.selectionStart);
        display.setSelectionRange(sav + input.length, sav + input.length);
    }
}

function insertAtPosition(input, position) {
    // Prevent all characters except for numbers, math operators and common parentheses
    if (display.value.length < settings.maxlengthinput) {
        display.value = display.value.slice(0, position) + input + display.value.slice(position);
    }
}

function deleteSelectionOrAtCaret() {
    if (display.selectionStart < display.selectionEnd) {
        deleteSelection();
    } else {
        deleteAtCaretPosition(offset = 0);
    }
}

function deleteSelection() {
    const sav = display.selectionStart
    display.value = display.value.slice(0, sav) + display.value.slice(display.selectionEnd);
    display.setSelectionRange(sav, sav);
}

function deleteAtCaretPosition(offset = 0) {
    if (display.selectionStart == display.value.length) {
        display.value = display.value.slice(0, display.value.length - 1);
    } else {
        display.value = display.value.slice(0, display.selectionStart + offset) + display.value.slice(display.selectionStart + offset + 1);
    }
}

function deleteAtPosition(position) {
    display.value = display.value.slice(0, position) + display.value.slice(position + 1);
}

function plusOrMinus() {
    let caretOrSelection = [display.selectionStart, display.selectionEnd];
    let start, end
    [start, end] = findNumber();
    if (display.value[start - 1] != '-') {
        if (display.value[start - 1] == '+') {
            deleteAtPosition(position = start - 1);
            start -= 1;
            caretOrSelection[0] -= 1;
            caretOrSelection[1] -= 1;
        }
        insertAtPosition('-', start);
        caretOrSelection[0] += 1;
        caretOrSelection[1] += 1;
    } else {
        deleteAtPosition(position = start - 1)
        insertAtPosition('+', start - 1);
    }
    display.setSelectionRange(caretOrSelection[0], caretOrSelection[1]);
}

function findNumber() {
    const currentValue = display.value;
    let start = display.selectionStart;
    let end = display.selectionEnd;
    // Move start index to the beginning of the number
    while (start > 0 && /[\d\.]/.test(currentValue[start - 1])) {
        start--;
    }
    // Move end index to the end of the number
    while (end < currentValue.length && /\d/.test(currentValue[end])) {
        end++;
    }
    return [start, end];
}

function storeInRegister() {
    if (!isNaN(+result.value) && result.value !== '') {
        register = result.value;
    }
}

function recallFromRegister() {
    insertAtCaret(register);
}

function updateRegisterFlag() {
    if (register) {
        registerFlag.innerHTML = 'M';
    } else {
        registerFlag.innerHTML = '';
    }

}

// General event listeners
document.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        doCalculation();
    }
});


document.addEventListener("keydown", function (event) {
    if (!settings.allowedSpecialKeys.includes(event.key)) {
        event.preventDefault();
        if (settings.allowedCharacters.includes(event.key)) {
            insertAtCaret(event.key);
        }
    }
});


// General program behavior
//
function keepSanity() {
    // Keep input display element in focus; Ensures that input is always processed and that caret is displayed
    display.focus();
    // Keep input display element free from not allowed characters
    regex = new RegExp('[^' + settings.allowedCharacters + '|^' + '|^'.join(settings.allowedStrings) + ']', 'g')
    display.value = display.value.replace(regex, '');
    // Keep input display element size according to the setting
    display.value = display.value.slice(0, settings.maxlengthinput);
    // Keep the register tag up to date
    updateRegisterFlag()
}
setInterval(() => keepSanity(), 250);