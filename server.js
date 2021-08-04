const express = require('express')
require("dotenv").config()
const app = express()
const server = require('http').Server(app)
const io = require('socket.io')(server, {
'sync disconnect on unload': true })
const {v4:uuidV4} = require('uuid')

const port = process.env.PORT || 3000

const { ExpressPeerServer } = require('peer');
const peerServer = ExpressPeerServer(server, {
  debug: true,
  port: process.env.PORT || 3001
});

app.use('/peerjs', peerServer)

app.set('view engine', 'hbs')
app.use(express.static('public'))

app.get('/', (req,res)=>{
    res.render('home')
})
app.post('/createroom', (req,res)=>{
    const key = uuidV4()
    res.send({key})
})
app.get('/:room', (req,res)=>{
    res.render('room', {roomId: req.params.room})
})
io.on('connection', socket =>{
    socket.on('join-room', (roomId, userId)=>{
        socket.join(roomId)
        socket.room = roomId
        socket.broadcast.to(roomId).emit('user-connected', userId)
    })
    socket.on("disconnect", () => {
        socket.broadcast.to(socket.room).emit('user-left');
        socket.leave(socket.room);
    });
})
server.listen(port, ()=>{
    console.log('Server is up')
})