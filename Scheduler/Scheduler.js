var schedule = require('node-schedule');
var Article = require('../Model/Article');

var j = schedule.scheduleJob('* * * 1 * *', () => {
    // clean up database
    Article.deleteMany({ deleted: true }, (err, result) => {
        if (err) {
            // log down error somewhere
            console.log('Error deleting article');
        } else {
            console.log('Succesfully cleaned deleted articles.');
        }
        return;
    });
});