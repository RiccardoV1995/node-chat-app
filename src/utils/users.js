const users = []

const addUser = ({ id, username, room }) => {
    // Clean the data
    username = username.trim().toLowerCase()
    room = room.trim().toLowerCase()

    // Validation data
    if (!username || !room) {
        return {
            error: 'Username and room are required!'
        }
    }

    // Checking to existing user
    const existingUser = users.find((user) => {
        return user.room === room && user.username === username
    })

    // Validation user
    if (existingUser) {
        return {
            error: 'Username is in use!'
        }
    }

    // Store user
    const user = { id, username, room}
    users.push(user)
    return{user}
}

const removeUser = (id) => {
    const index = users.findIndex((user) => user.id === id) // il return è sottointeso

    if (index !== -1) { // index non è uguale a -1 vuol dire che abbiamo trovato una corrispondenza
        return users.splice(index, 1)[0] // il parametro corr. all'oggetto da rimuovere, il secondo a quanti oggetti rimuovere. Al posto dell'oggetto eliminato restituisce [0]
    }
}

const getUser = (id) => {
    return users.find((user) => user.id === id)
}

const getUsersInRoom = (room) => {
    room.trim().toLowerCase()
    return users.filter((user) => user.room === room)
}

module.exports = {
    addUser,
    removeUser,
    getUser,
    getUsersInRoom
}