const express = require('express')
const redis = require('redis');
const kue = require('kue');
const app = express()
app.set('port', (process.env.PORT || 6000));
const client = redis.createClient();
const queue = kue.createQueue();
app.use(express.json());
const mongoose = require("mongoose");

const router = require("./route");

client.on('connect', function () {
  console.log('connected to Redis');
});

client.on('error', function (err) {
  console.log("Error " + err);
});

queue.on('error', function (err) {
  console.log('Kue Error: ', err);
});


// MongoDB connection
mongoose.connect("mongodb+srv://TarunKumar123:xLcX9W1SI9646ftM@cluster1.tpwtwiv.mongodb.net/Flokq", { useNewUrlParser: true }, mongoose.set('strictQuery', true)
)
  .then(() => console.log("MongoDB is connected"))
  .catch((err) => console.log(err.message));



app.use('/', router)
app.use("/*", (req, res) => res.status(404).send({ status: false, message: "invalid Path url" }));




// //-----------Queue Function------------//

// function createJob(myUrl, res) {
//   const job = queue.create('request', myUrl).priority('high').removeOnComplete(true).ttl(20000).save(async function (err) {
//     if (!err) {
//       res.send("Your new id for the url is " + job.id);         // The key to the data is the provided link
//       console.log(job);

//       client.hset(job.id, JSON.stringify(obj1), 'none', redis.print);        // creates a new hashed object {data.id : request}
//       // db.collection.save(obj)

//       console.log(job.state())
//       const result = await DataModel.create({ jobId: job.id, url: myUrl, result: JSON.stringify(job) })

//     }                                                         //  request is initally set to none
//     else {
//       res.send("There was an error importing your data");
//     }
//   });

//   // console.log(job.state());
//   // console.log(job);
// }

// async function requestStatus(id, res) {
//   const db = await DataModel.findOne({ jobId: id })

//   console.log(db);

//   client.hget(id, 'data', function (err, obj) {
//     if (err) {
//       res.send(err);
//     }
//     else if (obj == null) {
//       res.send("This key does not exist! Check your spelling or try a new key");
//     }
//     else if (obj == 'none') {
//       res.send("This task is still running");
//     }
//     else {
//       res.send(obj);
//     }
//   });
// }

// function processRequest(job, done) { // Process that grabs the HTML and updates the Redis hash 
//   axios.get(job.data)
//     .then(function (response) {
//       client.hset(job.id, 'data', response.data, redis.print);
//       done();
//     });
// }

// queue.process('request', 5, function (job, done) { // the queue can process multiple jobs, currently set to 5
//   processRequest(job, done);
// });


//---------------- Routes----------------//

// app.get('/check', async function (req, res) {
//   const messages = "this is succesfull message"
//   const test = await client.SET("check", JSON.stringify(messages))
//   console.log(`test : - ${test}`);

//   const data = await client.GET("check")
//   console.log(`data : - ${data}`);

//   res.send({ data: JSON.parse(data) });
// })



// app.get('/', function (req, res) {
//   res.send('Massdrop Challenge: Create a request and view its status');
// })


// //to get
// app.get('/status/:id', function (req, res) {
//   requestStatus(req.params['id'], res);
// })

// //to create
// app.get('/create/:url', function (req, res) {
//   if (validUrl.isHttpUri("http://" + req.params['url'])) {
//     createJob("http://" + req.params['url'], res);
//   }
//   else {
//     res.json("Invalid URL. Please Input a valid URL");
//   }
// })



app.listen(app.get('port'), function () {
  console.log('Server listening on port: ', app.get('port'));
});



