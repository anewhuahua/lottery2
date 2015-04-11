var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var award1Schema = new Schema({
  mobile:   
  {type: String},
  jiaping:
  {type: String},
  time:   
  {type : Date, default: Date.now}
});

// statics
award1Schema.statics.getAward = function (m, cb) {
  this.find({mobile:m}, cb);
}
module.exports = mongoose.model('Award1', award1Schema)
