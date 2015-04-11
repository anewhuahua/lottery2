var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var award2Schema = new Schema({
  mobile:   
  {type: String},
  jiaping:
  {type: String},
  time:   
  {type : Date, default: Date.now}
});

// statics
award2Schema.statics.getAward = function (m, cb) {
  this.find({mobile:m}, cb);
}

module.exports = mongoose.model('Award2', award2Schema)
