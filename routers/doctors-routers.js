const doctorControl = require('../controllers/doctor-controllers');

const express = require('express');
const router = express.Router();

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const urlencodedParser = bodyParser.urlencoded({ extended: false });

//////// INiCIO - ROTAS RELACIONADAS AO MEDICO

////// renderizar form de cadastro
router.get('/register', doctorControl.register);

// rota do action para o form de cadastro do médico
router.post('/addDoctor', urlencodedParser, doctorControl.add);

///////listar médicos
router.get('/list', doctorControl.list);

/////editar médico
router.get('/editDoctor/:id', doctorControl.edit);

// rota do action para o form de cadastro do médico
router.post('/attDoctor', urlencodedParser, doctorControl.att);

//////deletar medico
router.get('/deleteDoctor/:id', doctorControl.delete);

//////// FIM - ROTAS RELACIONADAS AO MEDICO

module.exports = router;
