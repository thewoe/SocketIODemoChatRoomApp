const app = require('express')();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const port = 5000;

server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

app.get('/javascript', (req, res) => {
    res.sendFile(__dirname + '/public/javascript.html');
});

app.get('/swift', (req, res) => {
    res.sendFile(__dirname + '/public/swift.html');
});

app.get('/css', (req, res) => {
    res.sendFile(__dirname + '/public/css.html');
});

// tech namespace
const tech = io.of('/tech');

tech.on('connection', (socket) => { // tech is the server of the tech namespace (room)
    socket.on('join', (data) => {
        socket.join(data.room); // join the selected (chat) room
        tech.in(data.room).emit('message', `New user joined ${data.room} room!`); // all users in tech room see new user joined message
    });
    socket.on('message', (data) => {
        console.log(`message: ${data.msg}`);
        tech.in(data.room).emit('message', data.msg); // send message to the selected (chat) room
    });
    socket.on('disconnect', () => { // socket is the client (which is the backend in this case)
        console.log('user disconnected');
        tech.emit('message', 'user disconnected'); // send 'user disconnected' message to all clients
    });
});