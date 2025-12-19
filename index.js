const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const URL = require('./model/user');
const { generateShortURL, handleGetAnalytics } = require('./controller/control');
require("dotenv").config()
const app = express();
const bodyParser = require('body-parser');

app.use(bodyParser.json());

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.set('view engine', 'ejs');
app.set('views', path.resolve('./views'));

mongoose.connect("mongodb+srv://pawangupta5692:Pawan7208@cluster0.zbfjc.mongodb.net/URL-SHORT")
    .then(() => { console.log('Connected to MongoDB'); })
    .catch(err => { console.error('MongoDB connection error:', err); });

app.get('/', async (req, res) => {
    const urls = await URL.find({});
    res.render('home_test', { id: null, urls ,data:""});
});

app.post('/', generateShortURL);

app.get('/analytics/:shortId', handleGetAnalytics);

app.get('/:shortId', async (req, res) => {
    const shortId = req.params.shortId;
    const entry = await URL.findOneAndUpdate(
        { shortId },
        { $push: { visitHistory: { timestamp: Date.now() } } },
        { new: true }
    );

    if (entry) {
        res.redirect(entry.redirectURL);
    } else {
        res.status(404).send('URL not found');
    }
});

app.listen(3000, () => { console.log('Server Started on port 3000'); });
