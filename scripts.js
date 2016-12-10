var socket = io()

socket.on('message', function(msg) {
    messageInfo = JSON.parse(msg)
    addMessageToPage(messageInfo.message, messageInfo.user)
})

window.onload = function () {
    document.getElementById('new-message-button').addEventListener('click', newMessageButtonClick)
    loadMessages()
}

function newMessageButtonClick() {
    var req = new XMLHttpRequest()
    var field = document.getElementById('new-message-field')
    req.open('POST', '/newmessage', true)
    req.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded')
    req.addEventListener("load", function() {
        field.value = ''
    })
    req.send('message='+field.value)
}

function loadMessages() {
    var req = new XMLHttpRequest()
    req.addEventListener('load', function() {
        console.log('Got new information')
        handleNewMessageList(req)
    })
    req.open('GET', '/messages')
    req.send()
}

function handleNewMessageList(req) {
    if (req.readyState !== XMLHttpRequest.DONE)
        return
    if (req.status === 200)
    {
        messages = JSON.parse(req.responseText)
        jQuery.each(messages, function(e) {
            message = messages[e]['message']
            client = messages[e]['user']
            addMessageToPage(message, client)
        })
    }
}

function addMessageToPage(message, client) {
    console.log(client + ": " + message)
    console.log(getCookie("clientId"))
    if (client === getCookie("clientId"))
    {
        var html = document.getElementById('messages-content').innerHTML
        document.getElementById('messages-content').innerHTML = '<p><div class="alert alert-success" role="alert"><strong>You (' + client + ')</strong>: '+message+'</div></p>' + html
    } else {
        var html = document.getElementById('messages-content').innerHTML
        document.getElementById('messages-content').innerHTML = '<p><div class="alert alert-info" role="alert"><strong>'+client+'</strong>: '+message+'</div></p>' + html
    }
}

function getCookie(name) {
  var value = "; " + document.cookie
  var parts = value.split("; " + name + "=")
  if (parts.length == 2) return parts.pop().split(";").shift()
}