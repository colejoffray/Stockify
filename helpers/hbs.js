const moment = require('moment')
require('moment-timezone')

module.exports = {
    if_eq: function(a, b, opts) {
      return a === b ? opts.fn(this) : opts.inverse(this);
  },
  formatDate: function(date, format){
    //adjusting to user's local time zone
    return moment.utc(date).format(format);
},
  hasQuartsOrPints: function(batch, options){
    if(batch.quartsMade || batch.pintsMade){
      return options.fn(this)
    }else {
      return options.inverse(this)
    }
  },
  
}