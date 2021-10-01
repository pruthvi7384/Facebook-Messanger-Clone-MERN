import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import Pusher from 'pusher';

import mongoMessages  from './messageModel.js';

const app = express();
const port = process.env.PORT || 8000;

// Midleware
    app.use(express.json());
    app.use(cors());

    const pusher = new Pusher({
        appId: "1275439",
        key: "ee7a40a30c8c02570180",
        secret: "eec4e730291e6c6eeea0",
        cluster: "ap2",
        useTLS: true
      });
      

// Db Config
// QCFgH3EXNgZglrwh

const mongoURI =`mongodb+srv://admin:QCFgH3EXNgZglrwh@cluster0.hdtuy.mongodb.net/messages?retryWrites=true&w=majority`
mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });

//   Database Connection 

mongoose.connection.once('open', () => {
    console.log('DB CONNECTED');
    // Databse Connection Watch
    const changeStream = mongoose.connection.collection('messages').watch();
    // Change The Database Collection Pusher Useed
    changeStream.on('change', (change) => {
      pusher.trigger('messages-channel', 'newMessage', {
        'change': change
      });
    });
})

// API End Points

app.get('/',(req, res) => {
    res.status(200).send('Welcome To Facebook Messanger');
})

// POST The Datae

app.post('/save/messages',(req, res) => {
    const dbMessages = req.body;
    mongoMessages.create(dbMessages, (err, messages) => {
        if (err) {
            res.status(500).send(err);
        }else{
            res.status(201).send(messages);
        }
    })
})

// GET Data

app.get('/retrieve/conversation',(req, res)=>{
    mongoMessages.find((err, messages)=>{
        if (err) {
            res.status(500).send(err);
        }else{
            messages.sort((b,a)=>{
                return a.timestamp - b.timestamp;
            });
            res.status(200).send(messages);
        }
    })
})

// Listner

app.listen(port,()=>{
    console.log(`server listning on http://localhost:${port}`)
})