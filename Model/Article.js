var mongoose = require('mongoose');  
var ArticleSchema = new mongoose.Schema({  
  title: String,
  description: String,
  category: String,
  createdBy: Object,
  createdOn: Date,
  updatedBy: Object,
  updatedOn: Date,
  deletedBy: Object,
  deletedOn: Date,
  deleted: Boolean
});

mongoose.model('Article', ArticleSchema);

module.exports = mongoose.model('Article');