const express = require("express")
const app = express()
const https = require('https')
const http = require('http').Server(app);
const io = require('socket.io')(http);
const Discord = require('discord.js')
const config = require('./config.json')

const bodyParser = require("body-parser")

const client = new Discord.Client();

client.on("message", function(message) { 
    
    console.log(message.author.username + " : "+ message.content)    
    // res.render("index", {data : message.author.username + " : "+ message.content })    
    io.emit('chat message',message.author.username + " : "+ message.content);             
}); 

const url = "https://discord.com/api/v8/channels/801784356711956522/messages"
const auth = ""
const headers = {"Authorization": auth,
               "Content-Type": 'application/json', 'referer': "https://discord.com/channels/801784356217421874/801784356711956522"}


const options = {
    headers : headers, 
    method : "POST"
}    

app.set("view engine", "ejs")
app.use(express.static("public"))

app.get('/', (req, res) => {
    res.render("index", {data : "EMPTY"}) 
})


io.on('connection', (socket) => {
  console.log('a user connected');
    socket.on('disconnect', () => {
    console.log('user disconnected');
  });
    socket.on('chat message', (msg) => {
    let data = JSON.stringify({'content':msg , 'nounce': 802056256326991872, 'tts': false})
    console.log('message: ' + msg);
    process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;

const req = https.request(url, options, (res) => {
  console.log(`statusCode: ${res.statusCode}`)

  res.on('data', (d) => {
    process.stdout.write(d)
  })
})

req.on('error', (error) => {
  console.error(error)
})

req.write(data)
req.end()
  });
});

http.listen(3000, () => {
  console.log('listening on *:3000');
});

client.login(config.BOT_TOKEN);