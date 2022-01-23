const validateInput = (inputText) => {

    if (inputText) {
        var Temp = inputText.trim().toLowerCase();
        return Temp;
    }

}

module.exports = validateInput;