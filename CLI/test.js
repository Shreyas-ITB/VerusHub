
// chat-client.js
import io from 'socket.io-client';
import repl from 'repl';
import chalk from 'chalk';

const socket = io('http://localhost:9000');
var username = null

socket.on('disconnect', function() {
    socket.emit('disconnect')
});


socket.on('connect', () => {
    console.log(chalk.red('= start chatting ='))
    username = process.argv[2]
})


socket.on('message', (data) => {
    const { cmd, username } = data
    console.log(chalk.green(username + ': ' + cmd.split('\n')[0]));
})


repl.start({ 
    prompt: '',
    eval: (cmd) => {
        socket.send({ cmd, username })
    }
})


console.log("Hello sunidhiiiiiiii")