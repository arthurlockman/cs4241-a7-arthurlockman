var fs   = require('fs')
  , marked = require('marked')
  , url  = require('url')
  , querystring = require('querystring')
  , admin  = require('firebase-admin')
  , port = 8080
  , cookie = require('cookie')
  , generateName = require('sillyname')
  , app = require('express')()
  , http = require('http').Server(app)
  , io = require('socket.io')(http)

//Configure firebase connection
// https://firebase.google.com/docs/database/admin/retrieve-data
// https://firebase.google.com/docs/database/admin/save-data
var serviceAccount = require("./firebase.json")
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount), 
  databaseURL: "https://cs4241-a7-arthurlockman.firebaseio.com/"
})

var db = admin.database()
var ref = db.ref('/')
var messagesRef = ref.child('messages')
var usersRef = ref.child('users')

//Handle when a new message is received
messagesRef.on('child_added', function(snapshot) {
  console.log(snapshot.val())
  io.emit('message', JSON.stringify(snapshot.val()))
}, function(errorObject) {
  console.log('Read failed: ' + errorObject.code)
})

io.on('connection', function(socket) {
  console.log('a user connected!')
  socket.on('disconnect', function() {
    console.log('a user disconnected')
  })
})

//Save a new message to the DB
function saveNewMessage(req, res) {
  var chunk = ''
  cookies = parseCookies(req)
  req.on('data', function(data) {
    chunk += data
  })
  req.on('end', function() {
    var data = querystring.parse(chunk)
    messagesRef.push().set({
      message: data.message,
      user: cookies.clientId
    })
    res.end('operation complete')
  })
}

//Get all messages from DB
function getAllMessages(req, res) {
  messagesRef.once('value', function(v) {
    res.end(JSON.stringify(v.val()))
  })
}

function sendReadme(res) {
  var contentType = 'text/html'
  fs.readFile(__dirname + '/README.md', 'utf8', function(err, md) {
    if (err) {
      throw err
    }
    
    //Serve rendered readme
    res.writeHead(200, {'Content-type': contentType})
    res.end(marked(md), 'utf-8')
  })
}

function sendFile(res, filename, contentType) {
  contentType = contentType || 'text/html'

  fs.readFile(filename, function(error, content) {
    res.writeHead(200, {'Content-type': contentType})
    res.end(content, 'utf-8')
  })
}

function sendIndex(res, req)
{
  contentType = 'text/html'
  cookies = parseCookies(req)
  if (!Object.keys(cookies).length)
  {
    newClientName = generateName()
    console.log('New client: ' + newClientName)
    usersRef.push().set({
      userId: newClientName
    })
    fs.readFile('index.html', function(error, content) {
      res.writeHead(200, {'Content-Type': contentType, 'Set-Cookie': 'clientId='+newClientName+'; expires='+new Date(new Date().getTime()+315360000000).toUTCString()})
      res.end(content, 'utf-8')
    })
  } else {
      console.log(cookies)
      fs.readFile('index.html', function(error, content) {
        res.writeHead(200, {'Content-Type': contentType})
        res.end(content, 'utf-8')
      })
  }
}

function parseCookies(req) {
  if(!req.headers.cookie) return {}
  var rc = req.headers.cookie
  return cookie.parse(rc)
}

app.get('/', function(req, res) {
  sendIndex(res, req)
})
app.get('/css/style.css', function(req, res) {
  sendFile(res, 'style.css', 'text/css')
})
app.get('/scripts.js', function(req, res) {
  sendFile(res, 'scripts.js', 'text/javascript')
})
app.get('/server.js', function(req, res) {
  sendFile(res, 'server.js', 'text/javascript')
})
app.get('/readme.md', function(req, res) {
  sendReadme(res)
})
app.get('/README.md', function(req, res) {
  sendReadme(res)
})
app.get('/newmessage', function(req, res) {
  sendFile(res, 'scripts.js', 'text/javascript')
})
app.post('/newmessage', saveNewMessage)
app.get('/messages', getAllMessages)

http.listen(process.env.PORT || port, function() {
  console.log('listening on ' + (process.env.PORT || port))
})