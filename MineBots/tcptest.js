const net = require('net')

const socket = net.createConnection({
  host: '127.0.0.1',
  port: 25565
})

socket.on('connect', () => {
  console.log('TCP CONNECTED')
})

socket.on('error', err => {
  console.log('TCP ERROR:', err)
})
