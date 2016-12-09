var http = require('http')
  , fs   = require('fs')
  , marked = require('marked')
  , url  = require('url')
  , querystring = require('querystring')
  , admin  = require('firebase-admin')
  , port = 8080
  , cookie = require('cookie')
  , generateName = require('sillyname')

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

ref.on('value', function(snapshot) {
  console.log(snapshot.val())
}, function(errorObject) {
  console.log('Read failed: ' + errorObject.code)
})

//Handle when a new message is received
messagesRef.on('child_added', function(snapshot) {
  console.log(snapshot.val())
}, function(errorObject) {
  console.log('Read failed: ' + errorObject.code)
})

//Save a new message to the DB
function saveNewMessage(req, res) {
  var chunk = ''
  req.on('data', function(data) {
    chunk += data
  })
  req.on('end', function() {
    var data = querystring.parse(chunk)
    messagesRef.push().set({
      message: data.message,
      user: clientId
    })
  })
  messagesRef.push().set({
    message: messageText,
    user: clientId
  })
}

// saveNewMessage("aefaefafaefe", "Test Message")

var server = http.createServer (function (req, res) {
  var uri = url.parse(req.url)

  switch( uri.pathname ) {
    case '/':
    case '/index.html':
        sendIndex(res, req)
        break
    case '/css/style.css':
      sendFile(res, 'style.css', 'text/css')
      break
    case '/scripts.js':
      sendFile(res, 'scripts.js', 'text/javascript')
      break
    case '/server.js':
      sendFile(res, 'server.js', 'text/javascript')
      break
    case '/readme.md':
    case '/README.md':
      sendReadme(res)
      break
    case '/newmessage':
      saveNewMessage(req, res)
    default:
      res.end('404 not found')
  }
})

server.listen(process.env.PORT || port)
console.log('listening on 8080')

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