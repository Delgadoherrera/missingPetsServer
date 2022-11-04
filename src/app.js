const express = require('express');
const path = require('path');
const cors = require('cors');

const session = require('express-session');
const app = express();
const userApi = require('./api/userApi')
const mascotaApi = require('./api/mascotaApi')
const mensajesApi = require('./api/mensajesApi')
app.use(express.static("public"));
app.use(express.static(path.join(__dirname, '../public')));
app.use(express.json());
app.use(session({ secret: 'missingPetsssss' }));
app.use(express.json({limit: "10mb", extended: true}))
app.use(express.urlencoded({limit: "10mb", extended: true, parameterLimit: 50000}))

app.use(cors())


app.use('/', userApi); 
app.use('/', mascotaApi);
app.use('/', mensajesApi); 

app.listen(3001, () => {
    console.log("Servidor corriendo correctamente en http://localhost:3001/")

});