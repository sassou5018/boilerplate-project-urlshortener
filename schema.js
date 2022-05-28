const mongoose = require('mongoose');
const DB_URI = process.env.DB_URI;

const dbConnect = () => {
    mongoose.connect(DB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
        .then(() => {
        console.log('Connected to MongoDB');
        })
        .catch(err => {
        console.log('Error connecting to MongoDB', err);
        });
}


const urlSchema = new mongoose.Schema({
    original_url: String,
    short_url: Number
});

const urlModel = mongoose.model('url', urlSchema);

module.exports = { dbConnect, urlModel };