const express = require('express');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;

const cors = require('cors');
require('dotenv').config();

const app = express();
const port =process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.xqlz2.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run(){
         try{
                  await client.connect();
                  const database = client.db('carMeachanic');
                  const servicesCollection = database.collection('services');

                  //POST API
                  app.post('/services', async(req, res) =>{
                           const service = req.body;
                  console.log('Hit the post api', service)
                  const result = await servicesCollection.insertOne(service);
                  console.log(result)
                  res.json(result)
                  })

                  // GET SINGLE SERVICE
                  app.get('/services/:id', async(req, res) =>{
                           const id = req.params.id;
                           console.log('getting id', id)
                           const query = {_id: ObjectId(id)}
                           const service = await servicesCollection.findOne(query);
                           res.json(service);
                  });

                  //GET API
                  app.get('/services', async(req, res) =>{
                           const cursor = servicesCollection.find({});
                           const services = await cursor.toArray();
                           res.send(services);
                  })
         }
         finally{
                  // await client.close();
         }
}

run().catch(console.dir);

app.get('/', (req, res) =>{
         res.send('Running Genius Servers')
});




app.listen(port, ()=>{
         console.log('Runnging genius server on port', port);
});
