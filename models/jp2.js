var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var jp2chema = new Schema({
  jp:   
  {type: String},
  amount:
  {type: Number},
});

// statics
jp2Schema.statics.getJP = function (j, cb) {
  this.find({jp:j}, cb);
}

module.exports = mongoose.model('JP2', jp2Schema)
