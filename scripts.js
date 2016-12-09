var socket = io()

socket.on('message', function(msg) {
    messageInfo = JSON.parse(msg)
    // Use JSON.stringify on server
    // TODO: update page with new message
})

window.onload = function () {
    document.getElementById('new-message-button').addEventListener('click', newMessageButtonClick)
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