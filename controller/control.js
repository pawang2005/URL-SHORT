const shortid = require('shortid');
const URL = require('../model/user');

async function generateShortURL(req, res) {
    const body = req.body;
    const shortId = "";
    const urls = await URL.find({});

    if (!body.url) return res.status(400).json({ error: "URL is required" });

    const customURL = body.custom;

    if(body.custom){
        await URL.findOne({shortId:customURL}).then(()=>{
            return res.render('home_test',{data:"Id already in use",id:null, urls});
        }).catch(()=>{
            shortId = customURL;
        });
    }

    else{
        shortId = shortid.generate();
    }

    await URL.create({
        shortId: shortId,
        redirectURL: body.url,
        visitHistory: [],
    });

    
    res.render('home_test', { id: shortId, urls,data:"" });
}

async function handleGetAnalytics(req, res) {
    const shortId = req.params.shortId;
    const result = await URL.findOne({ shortId });
    return res.json({ totalClicks: result.visitHistory.length, analytics: result.visitHistory });
}

module.exports = { generateShortURL, handleGetAnalytics };
