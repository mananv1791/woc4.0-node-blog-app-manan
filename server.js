const express = require('express');
const bodyParser = require('body-parser')
const app = express();
const MongoClient = require('mongodb').MongoClient
var http = require('http');
const { resourceUsage } = require('process');
const multer = require('multer')
const path = require('path')


global.__basedir = __dirname;
var base_path = __basedir;

const storage = multer.diskStorage({
  //destination for files
  destination:(req, file, cb) => {
    cb(null, 'public/uploads')
  },
    filename:(req,file, cb) => {
      console.log(file)
      cb(null, Date.now() + path.extname(file.originalname))
    },
});

const upload = multer({
  storage: storage
})

MongoClient.connect('mongodb+srv://manan:<password>@blogapp.7sz1z.mongodb.net/myFirstDatabase?retryWrites=true&w=majority', { useUnifiedTopology: true })
  .then(client => {
    console.log('Connected to Database')
    const db = client.db('blogsapp')
    const blogCollection = db.collection('blogs')

    app.use(express.json());
    app.use(bodyParser.urlencoded({ extended: true }))

    app.set('view engine', 'ejs');
  
    app.get('/', (req, res) => {
      res.sendFile(__basedir + '/views/index.html')
    })  
  
    app.post('/', upload.single('image') ,(req, res) => {
      blogCollection.insertOne(req.body)
      .then(result => {
        res.redirect('/')
      })
    })

    app.get('/viewblog', (req, res) => {
      db.collection('blogs').find().toArray()
        .then(results => {
          res.render('viewblog.ejs', { blogs: results })
        })
        .catch(error => console.error(error))
    })
  })
  .catch(error => console.error(error))
  
    app.listen(3000, function() {
      console.log('listening on 3000');
  })
