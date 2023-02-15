const express = require('express')
const http = require('http')
const socketio = require('socket.io')
const Filter = require('bad-words')
const {generateMessage, generateLocation} = require('./utils/messages')
const {addUser, removeUser, getUser, getUsersInRoom} = require('./utils/user')

const app = express();
const server = http.createServer(app)
const io = socketio(server)



const port = process.env.PORT


let count = 1;
io.on('connection', (socket) => {
    // console.log('new websocket connection.')

    // socket.emit('countUpdated', count)

    // socket.on('increment', () => {
    //     count++;
    //     // socket.emit('countUpdated', count)
    //     io.emit('countUpdated', count)
    // })

    // send welcome message
    // socket.emit('message', 'Welcome to our website.')

    // socket.emit('recieve-message', 'Hello guyz')


    // chat room
    socket.on('join', ({name, room}, cb) => {
        const {error, user} = addUser({
            id: socket.id,
            username: name,
            room
        })

        if(error) return cb(error)

        socket.join(user.room)

        socket.broadcast.to(user.room).emit('new-user', `${user.username} joined our chat`)

        io.to(user.room).emit('roomData', {
            room: user.room,
            users: getUsersInRoom(user.room)
        })

        cb()
    })

    socket.on('send-message', (message, cb) => {
        const filter = new Filter()
        if(filter.isProfane(message)) return cb('Profinity not allowed.')

        const user = getUser(socket.id)


        io.to(user.room).emit('recieve-message', {message: generateMessage(message), username: user.username})

        cb()
    })

    // send alert-message - new connection
    // socket.broadcast.emit('new-user', `Someone joined our chat`)
    // send alert-message - disconnect
    socket.on('disconnect', () => {
        const removeduser = removeUser(socket.id)

        if(removeduser){
            io.to(removeduser.room).emit('disconnects', `${removeduser.username} left our chat`)

            io.to(removeduser.room).emit('roomData', {
                room: removeduser.room,
                users: getUsersInRoom(removeduser.room)
            })
        }
    })


    // get and broadcast location
    socket.on('location-share', (message, cb) => {
        // console.log(message)
        const user = getUser(socket.id)

        socket.broadcast.to(user.room).emit('location', {message: generateLocation(message), username: user.username})

        cb();
    })
    
})

app.use(express.static(process.env.STATIC_PATH))
server.listen(port, () => {
    console.log(`Server is up on port ${port}`)
})