import createSocketIoMiddleware from 'redux-socket.io'
import io from 'socket.io-client'
const socket = io()
const socketIoMiddleware = createSocketIoMiddleware(socket, 'server/')

export default socketIoMiddleware
