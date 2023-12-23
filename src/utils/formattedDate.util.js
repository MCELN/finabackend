const formatDate = (date) => {
    const dateFormat = new Date(date);
    const day = dateFormat.getDate();
    const month = dateFormat.getMonth() + 1;
    const year = dateFormat.getFullYear();

    const formattedDay = day < 10 ? `0${day}` : day;
    const formattedMonth = month < 10 ? `0${month}` : month;

    return `${formattedDay}/${formattedMonth}/${year}`;
};

module.exports = formatDate;