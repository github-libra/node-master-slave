var fork = require('child_process').fork
var cpus = require('os').cpus()

var server = require('net').createServer()
server.listen(1337)
var workers = {}

for(var i=0; i<cpus.length; i++) {
	createWorker()
}

process.on('exit', () => {
	for(var pid in workers) {
		workers[pid].kill()
	}
})

function createWorker() {
	var worker = fork('./worker.js')
	worker.on('exit', () => {
		console.log(`worker ${worker.pid} exited`)
		delete workers[worker.pid]
		createWorker()
	})

	worker.send('server', server)
	workers[worker.pid] = worker;
	console.log(`create worker, pid: ${worker.pid}`)
}
