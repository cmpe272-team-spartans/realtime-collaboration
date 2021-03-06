/**
 * Created by Yudong Yi on 11/25/14.
 */
 
var mongoose = require('mongoose')
    ,Schema = mongoose.Schema
    ,ObjectId = Schema.ObjectId
    ,autoIncrement = require('mongoose-auto-increment');


var roomSchema = new Schema({
	roomNumber: Number,
    topic: String,
    password: String
});

module.exports = mongoose.model('Room', roomSchema);
roomSchema.plugin(autoIncrement.plugin, {
    model: 'Room',
    field: 'roomNumber',
    startAt: 1,
    incrementBy: 1
});

