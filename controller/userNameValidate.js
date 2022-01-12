const validateUserName = (username) => {
    var regex = /^[a-zA-Z0-9]+$/;
    return regex.test(username);
}

module.exports = validateUserName;
