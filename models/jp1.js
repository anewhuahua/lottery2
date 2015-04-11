var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var jp1Schema = new Schema({
  jp:   
  {type: String},
  amount:
  {type: Number},
});

// statics
jp1Schema.statics.getJP = function (j, cb) {
  this.find({jp:j}, cb);
}
jp1Schema.static.chouJiang = function(cb) {
  this.findOne({ amount: {$gt: 0} } );
}

module.exports = mongoose.model('JP', jp1Schema)
