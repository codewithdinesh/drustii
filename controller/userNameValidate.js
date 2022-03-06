const validateUserName = (username) => {

    var regex = /^(?=.{1,27}$)(?![0-9_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$/;

    return regex.test(username);
}

module.exports = validateUserName;
