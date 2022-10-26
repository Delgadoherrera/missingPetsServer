const express = require('express');
const multer = require('multer');
const cors = require('cors');
const router = express.Router();
const path = require('path')
const db = require("../database/models")
const Mascota = db.Mascota;
const MascotaEncontrada = db.MascotaEncontrada
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


router.post("/mascota/register", upload.single('file'), async (req, res) => {
    console.log(req.body)
    console.log(req.headers)
    await Mascota.create({
        nombre: req.headers.nombre,
        idHumano: req.headers.id,
        colorPrimario: req.headers.colorprimario,
        colorSecundario: req.headers.colorsecundario,
        pesoAproximado: req.headers.pesoaproximado,
        status: 0,
        tipoMascota: req.headers.tipomascota,
        descripcion: req.headers.descripcionmascota,
        fotoMascota: 'http://localhost:3001//img/pets/' + req.session.newFileName,
    });
    res.status(200).send()
})

router.get("/mascotas/getById/:id", async (req, res) => {
    console.log(req.body)
    await Mascota.findAll({
        where: {
            /*  idHumano: req.params.id, */
            /*   status:{[Op.ne]:1} */


        }
    }).then(await function (mascotas) {
        return res.status(200).send({ data: mascotas })
    })
})

router.post("/mascotas/mascotaPerdida/:id", async (req, res) => {
    console.log(req.body)
    console.log(req.params.id)

    Mascota.update({
        latPerdida: req.body.latitude,
        lngPerdida: req.body.longitude,
        status: 1

    }, {
        where: { idMascota: req.params.id }
    }

    ).catch(error => res.send(error))

    res.status(200).send()


})

router.get("/mascotas/mascotasPerdidas", async (req, res) => {
    console.log(req.body)
    console.log(req.params.id)

    Mascota.findAll({
        where: {
            status: 1,
        }
    }).then(function (mascotas) {
        if (mascotas) {
            return res.status(200).send({ data: mascotas })
        }
        else if (!mascotas) {
            console.log('No hay mascotas perdidas actualmente en tu zona.')
            return res.status(400)
        }
    }).catch((error) => {
        console.log('error catch' + error)
    })
})

router.get("/mascotas/mascotaEncontrada", async (req, res) => {
    console.log(req.body)
    console.log(req.params.id)

    MascotaEncontrada.findAll({
        where: {
            status: 1,
        }
    }).then(function (encontradas) {
        if (encontradas) {
            return res.status(200).send({ data: encontradas })
        }
        else if (!encontradas) {
            console.log('No se han encontrado mascotas perdidas por tu zona')
            return res.status(400)
        }
    }).catch((error) => {
        console.log('error catch' + error)
    })
})

router.post("/mascotas/nuevaMascotaPerdida", upload.single('file'), async (req, res) => {
    console.log(req.body)
    console.log(req.headers)

    await Mascota.create({
        nombre: 'Esta mascota fue encontrada sin nombre',
        idHumano: req.headers.id,
        colorPrimario: req.headers.colorprimario,
        colorSecundario: req.headers.colorsecundario,
        pesoAproximado: req.headers.pesoaproximado,
        status: 1,
        tipoMascota: req.headers.tipomascota,
        descripcion: req.headers.descripcionmascota,
        fotoMascota: 'http://localhost:3001//img/pets/' + req.session.newFileName,
        latEncontrada: req.headers.lat,
        latEncontrada: req.headers.lng
    });
    res.status(200).send()


})
router.post("/mascotas/mascotaEncontrada/:id", upload.single('file'), async (req, res) => {
    console.log(req.body)
    console.log(req.headers)

     Mascota.update({

        status: 0,
    }, {
        where: { idMascota: req.params.id }
    }
    );
    res.status(200).send() 


})


module.exports = router;



