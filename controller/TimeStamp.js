const timeStamp = () => {
    const getTime = new Date().getTime();
    const calculateTime = new Date(getTime);
    var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    let DateTime = calculateTime.getDate() + " " + months[calculateTime.getUTCMonth()] + " " + calculateTime.getFullYear() + " | " + calculateTime.getHours() + ":" + calculateTime.getMinutes() + ":" + calculateTime.getSeconds();
    return DateTime;
}


module.exports = timeStamp;