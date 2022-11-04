const express = require('express');
const multer = require('multer');
const cors = require('cors');
const router = express.Router();
const path = require('path')
const db = require("../database/models")
const Mensaje = db.Mensaje;
const jwt = require('jsonwebtoken');
var Sequelize = require('sequelize');
const Op = Sequelize.Op;


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, "../../public/img/pets"));
    },
    filename: (req, file, cb) => {
        /*    console.log(file); */
        const newFilename = "file" + Date.now() + path.extname(file.originalname);
        cb(null, newFilename);
        req.session.newFileName = newFilename
    }

});
const upload = multer({ storage })





router.post("/mensajes/nuevoMensaje/", async (req, res) => {
    console.log(req.body.date)

    await Mensaje.create({
        mensaje: req.body.msg.msg,
        idEmisor: req.body.emisor,
        idReceptor: req.body.receptor,
        fechaMensaje: req.body.date,
    });
    res.status(200).send()
 

})

module.exports = router;



