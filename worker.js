var fs = require('fs')
var worker
process.on('message', (m, server) => {
	if(m == 'server') {
		worker = server
		server.on('connection', socket => {
			socket.end('hello from ' + process.pid)
			throw Error('oh...')
		})
	}
})

process.on('uncaughtException', (err) => {
	fs.appendFile('log', err)
	worker.close(() => {
		process.exit(1)
	})
})