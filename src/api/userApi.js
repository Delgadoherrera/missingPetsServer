const express = require('express');
const multer = require('multer');
const cors = require('cors');
const router = express.Router();
const path = require('path')
const db = require("../database/models")
const Humano = db.Humano;
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, "../../public/img/img-usuarios"));
    },
    filename: (req, file, cb) => {
        /*    console.log(file); */
        const newFilename = "file" + Date.now() + path.extname(file.originalname);
        cb(null, newFilename);
        req.session.newFileName = newFilename
    }

});
const upload = multer({ storage })

router.post("/user/login", async (req, res) => {
    console.log('req.body', req.body)

    let emailVerify = req.body.email
    let password = req.body.password
    await Humano.findOne({
        where: {
            email: emailVerify,
        }
    })
        .then(await function (usuario) {
            if (usuario) {
                const token = jwt.sign({
                    email: usuario.email,
                    id: usuario.id
                }, "algoScreto", { expiresIn: '360m' });
                let dbPassword = usuario.password;
                let key = bcryptjs.compareSync(password, dbPassword);
                Humano.findOne({
                    where: {
                        email: emailVerify,
                        password: key
                    }
                }).then(function () {
                    if (emailVerify === usuario.email && key == true) {
                        let dataUser = {
                            nombre: usuario.nombre,
                            apellido: usuario.apellido,
                            email: usuario.email,
                            id: usuario.idHumano,
                            avatar: 'avatar',
                        }
                        return res.status(200).json({
                            token: token,
                            dataUser: dataUser
                        })
                    }
                    else if (emailVerify === usuario.email && key == false) {
                        // contraseña incorrecta == 1
                        return res.status(400).send('invalid password')
                    }

                }).catch((error) => {
                    /* console.log('error catch' + error) */
                })

            }
            //El mail no se encuentra ==3
            else {
                return res.status(400).send('No se encuentra el email')
            }
        });

}
)

router.post("/user/register", async (req, res) => {
 
    await Humano.create({
        nombre: req.body.name,
        apellido: req.body.apellido,
        telefono: req.body.telefono,
        email: req.body.email,
        password: bcryptjs.hashSync(req.body.password, 10),
        fotoPerfil: 'fotoPerfil',
    });
})


router.get("/user/userDetail/:id", async (req, res) => {
    console.log('REQODY', req.params.id)
     Humano.findAll({
        where: {
            idHumano: req.params.id,
        }
    }).then(function (humano) {
        if (humano) {
            return res.status(200).send({ data: humano })
        }
        else if (!humano) {
            console.log('No se han encontrado mascotas perdidas por tu zona')
            return res.status(400)
        }
    }).catch((error) => {
        console.log('error catch' + error)
    }) 
})


module.exports = router;

