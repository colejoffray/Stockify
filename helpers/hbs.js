const moment = require('moment')

module.exports = {
    if_eq: function(a, b, opts) {
      return a === b ? opts.fn(this) : opts.inverse(this);
  },
  formatDate: function(date, format){
    return moment(date).format(format)
},
  hasQuartsOrPints: function(batch, options){
    if(batch.quartsMade || batch.pintsMade){
      return options.fn(this)
    }else {
      return options.inverse(this)
    }
  },
  
}