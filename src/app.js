const express = require('express');
const path = require('path');
const cors = require('cors');
const app = express();

var bodyParser = require('body-parser');
app.use(bodyParser.json({limit: "50mb"}));
app.use(bodyParser.urlencoded({limit: "50mb", extended: true, parameterLimit:50000}));

const db = require("./database/models")
const Mensaje = db.Mensaje;
const server = require('http').createServer(app);
const io = require('socket.io')(server, {
    cors: {
        origin: 'http://localhost:3000'
    }
});

const session = require('express-session');
const userApi = require('./api/userApi')
const mascotaApi = require('./api/mascotaApi')
const mensajesApi = require('./api/mensajesApi')


app.use(express.static("public"));
app.use(express.static(path.join(__dirname, '../public')));
app.use(express.json());
app.use(session({ secret: 'missingPetsssss' }));
app.use(express.json({ limit: "10mb", extended: true }))
app.use(express.urlencoded({ limit: "10mb", extended: true, parameterLimit: 50000 }))
app.use(express.urlencoded({ extended: false }));
app.use(cors())


console.log('Verificar PORT socket')
server.listen(4000);

app.use('/', userApi);
app.use('/', mascotaApi);
app.use('/', mensajesApi);

io.on("connection", (socket) => {
    socket.on("message", (body, idEmisor, idReceptor) => {
        console.log(body, idEmisor, idReceptor)
        socket.broadcast.emit("message", {
            body,
            from: socket.id.slice(8),
        });
        Mensaje.create({
            mensaje: body,
            idEmisor: idEmisor,
            idReceptor: idReceptor,
        });
    });
});

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log("Servidor corriendo correctamente en el puerto", PORT)

});