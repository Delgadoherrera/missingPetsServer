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
    let sent = JSON.parse(req.body.formDatas)
    console.log(sent.colorPrimario)

    await Mascota.create({
        nombre: sent.nombre,
        idHumano: sent.id,
        colorPrimario: sent.colorPrimario,
        colorSecundario: sent.colorSecundario,
        pesoAproximado: sent.pesoAproximado,
        status: 0,
        tipoMascota: sent.tipoMascota,
        descripcion: sent.descripcionMascota,
        fotoMascota: 'http://localhost:3001//img/pets/' + req.session.newFileName,
    });
    res.status(200).send()
})

router.get("/mascotas/getById/:id", async (req, res) => {
    console.log(req.body)
    await Mascota.findAll({
        where: {
            idHumano: req.params.id,
            status: { [Op.ne]: 3 }


        }
    }).then(await function (mascotas) {
        return res.status(200).send({ data: mascotas })
    })
})

router.post("/mascotas/mascotaPerdida/:id", async (req, res) => {
    /*     console.log('mascota nueva con location default')
        console.log(req.body.latitude)
        console.log(req.params.id) */
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

router.post("/mascotas/mascotaPerdidaNewLocation/:id", async (req, res) => {
    /*  console.log('mascota con nueva location') */


    Mascota.update({
        latPerdida: req.body[req.body.length - 1].latitude,
        lngPerdida: req.body[req.body.length - 1].longitude,
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
        where: { status: { [Op.in]: [1, 3] }, }
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
    let sent = JSON.parse(req.body.formDatas)
    console.log(sent.colorPrimario)
    if (sent.newLatitude) {
        await Mascota.create({
            /*   nombre: sent.nombre, */
            idHumano: sent.id,
            colorPrimario: sent.colorPrimario,
            colorSecundario: sent.colorSecundario,
            pesoAproximado: sent.pesoAproximado,
            status: 3,
            tipoMascota: sent.tipoMascota,
            descripcion: sent.descripcionMascota,
            fotoMascota: 'http://localhost:3001//img/pets/' + req.session.newFileName,
            latEncontrada: sent.newLatitude,
            lngEncontrada: sent.newLongitude,


        });
        res.status(200).send()

    }
    else {
        await Mascota.create({
            /*   nombre: sent.nombre, */
            idHumano: sent.id,
            colorPrimario: sent.colorPrimario,
            colorSecundario: sent.colorSecundario,
            pesoAproximado: sent.pesoAproximado,
            status: 3,
            tipoMascota: sent.tipoMascota,
            descripcion: sent.descripcionMascota,
            fotoMascota: 'http://localhost:3001//img/pets/' + req.session.newFileName,
            latEncontrada: sent.initialLatitude,
            lngEncontrada: sent.initialLongitude,


        });
        res.status(200).send()
    }




})
router.post("/mascotas/mascotaEncontrada/:id", upload.single('file'), async (req, res) => {
    console.log(req.body)
    console.log(req.headers)

    Mascota.update({

        status: 0,
        latPerdida: 0,
        lngPerdida: 0.
    }, {
        where: { idMascota: req.params.id }
    }
    );
    res.status(200).send()


})


module.exports = router;



