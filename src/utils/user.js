const users = []

const addUser = ({id, username, room}) => {
    username = username.trim().toLowerCase()
    room = room.trim().toLowerCase()

    // validate the data
    if(!username || !room){
        return {
            error: 'Username and Room are required.'
        }
    }

    // check for existing user
    const exists = users.find((user) => {
        return user.room === room && user.username === username
    })

    // validate username
    if(exists){
        return {
            error: 'Username is already in use.'
        }
    }

    // store
    const user = {id, username, room}
    users.push(user)

    return {user}
}

const removeUser = (id) => {
    const index = users.findIndex((user) => {
        return user.id === id
    })

    if(index !== -1) return users.splice(index, 1)[0]
}

const getUser = (id) => {
    const index = users.findIndex((user) => {
        return user.id === id
    })

    return users[index];
}

const getUsersInRoom = (room) => {
    room = room.trim().toLowerCase()
    const resultUsers = users.filter((user) => {
        return user.room === room
    })

    return resultUsers;
}

module.exports = {
    addUser,
    removeUser,
    getUser,
    getUsersInRoom,
}

// addUser({
//     id: 21,
//     username: 'Andrew tate',
//     room: 'Room1'
// })
// addUser({
//     id: 22,
//     username: 'Andrew ',
//     room: 'Room2'
// })
// console.log(users)

// console.log(getUser(22))
