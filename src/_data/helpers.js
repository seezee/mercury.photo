module.exports = {
  currentYear() {
    const today = new Date();
    const year  = today.getFullYear();
    const dash  = `&NoBreak;&hairsp;&NoBreak;&ndash;&NoBreak;&hairsp;&NoBreak;`;
    if (year > 2012) {
      return dash + year;
    } else {
      return;
    }
  },
};
