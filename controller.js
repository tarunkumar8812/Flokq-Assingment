const redis = require('redis');
const kue = require('kue');
const axios = require('axios');
const validUrl = require('valid-url');
const client = redis.createClient();
const queue = kue.createQueue();
const DataModel = require("./dataModel");




//-----------Queue Function------------//

function createJob(myUrl, res) {
    const job = queue.create('request', myUrl).priority('high').removeOnComplete(true).ttl(20).save(async function (err) {
        if (!err) {
            res.send("Your new id for the url is " + job.id);         // The key to the data is the provided link
            client.hset(job.id, "data", JSON.stringify({ jobId: job.id, url: myUrl }), redis.print);        // creates a new hashed object {data.id : request}

            console.log(job.state())
            const result = await DataModel.create({ jobId: job.id, url: myUrl, result: JSON.stringify(job) })

        }                                                         //  request is initally set to none
        else {
            res.send("There was an error importing your data");
        }
    });

}

async function requestStatus(id, res) {
    client.hget(id, 'data', async function (err, obj) {
        if (err) {
            res.send(err);
        }
        else if (obj == null) {
            const dataFromDataBase = await DataModel.findOne({ jobId: id })
            res.send(`this data is coming from mongoDB ${dataFromDataBase}`);
            // res.send("This key does not exist! Check your spelling or try a new key");
        }
        else if (obj == 'none') {
            res.send("This task is still running");
        }
        else {
            res.send(obj);
        }
    });
}

function processRequest(job, done) { // Process that grabs the HTML and updates the Redis hash 
    axios.get(job.data)
        .then(function (response) {
            client.hset(job.id, 'data', response.data, redis.print);
            done();
        });
}

queue.process('request', 5, function (job, done) { // the queue can process multiple jobs, currently set to 5
    processRequest(job, done);
});


//---------------- Routes----------------//

async function blank(req, res) {
    res.send('Massdrop Challenge: Create a request and view its status');
}

//to get
async function getStatus(req, res) {
    requestStatus(req.params['id'], res);
}

//to create
async function create(req, res) {
    if (validUrl.isHttpUri("http://" + req.params['url'])) {
        createJob("http://" + req.params['url'], res);
    }
    else {
        res.json("Invalid URL. Please Input a valid URL");
    }
}


module.exports = { blank, getStatus, create }