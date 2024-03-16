import { createServer } from 'http';
import { Server } from 'socket.io';
import chalk from 'chalk';

const httpServer = createServer();
const io = new Server(httpServer);
const port = 9000;

httpServer.listen(port, () => {
    console.log(chalk.green(`Server listening on port ${port}`));
});

io.on('connection', (socket) => {
    socket.on('message', (evt) => {
        console.log(chalk.blue('Someone joined the room'));
        console.log(evt)
        socket.broadcast.emit('message', evt);
    });
})

io.on('disconnect', (evt) => {
    console.log(chalk.yellow('Someone left the room'));
});