const moment = require('moment');

module.exports = {
  select: function (selected, options) {
    return options.fn(this).replace(new RegExp('value=\"'+selected+'\"'), '$&selected')
  },
  generateTime: function (date, format) {
    return moment(date).format(format);
  },
  condenseText: function (text, chars) {
    if(text.length > chars){
      return text.substring(0, chars) + ' [...]';
    } else {
      return text.substring(0, chars);
    }

  }
};
