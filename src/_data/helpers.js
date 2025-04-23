module.exports = {
  currentYear() {
    const today = new Date();
    const year  = today.getFullYear();
    const dash  = `&zwj;&hairsp;&zwj;&ndash;&zwj;&hairsp;&zwj;`;
    if (year > 2012) {
      return dash + year;
    } else {
      return;
    }
  },
};
