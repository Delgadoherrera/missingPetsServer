const express = require('express');
const multer = require('multer');
const cors = require('cors');
const router = express.Router();
const path = require('path')
const db = require("../database/models")
const Mascota = db.Mascota;
const jwt = require('jsonwebtoken');


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
    const point = { type: 'Point', coordinates: [-76.984722, 39.807222] }; // GeoJson format: [lng, lat]
    await Mascota.create({
        idHumano: req.headers.id,
        nombre: req.headers.nombre,
        colorPrimario: req.headers.colorPrimario,
        colorSecundario: req.headers.colorSecundario,
        descripcion: req.headers.descripcionmascota,
        fotoMascota: 'http://localhost:3001//img/pets/' + req.session.newFileName,
    });
    res.status(200).send()
})

router.get("/mascotas/getById/:id", async (req, res) => {
    console.log(req.body)
    await Mascota.findAll({
        where: {
            idHumano: req.params.id,
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
    })
        .then(function (mascotas) {
            if (mascotas) {
                return res.status(200).send({data:mascotas})
            }
            else if (!mascotas) {
                console.log('No hay mascotas perdidas actualmente en tu zona.')
                return res.status(400)
            }
        }).catch((error) => {
            console.log('error catch' + error)
        })


})


module.exports = router;



