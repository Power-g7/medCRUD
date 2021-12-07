const specialtyControl = require('../controllers/specialty-controllers');

const express = require('express');
const router = express.Router();

const bodyParser = require('body-parser');
// const jsonParser = bodyParser.json();
const urlencodedParser = bodyParser.urlencoded({ extended: false });

//////// INICIO - ROTAS RELACIONADAS A ESPECIALIDADE
//////renderizar o form de cadastro de especialidade
router.get('/register', specialtyControl.register);

// rota do action para o form de cadastro da especialidade
router.post('/addSpecialty', urlencodedParser, specialtyControl.add);

//////renderiza a lista de especialidades
router.get('/list', specialtyControl.list);

////editar especialidade
router.get('/editSpecialty/:id', specialtyControl.edit);

/////deletar especialidade
router.get('/deleteSpecialty/:id', specialtyControl.delete);

//////// FIM - ROTAS RELACIONADAS A ESPECIALIDADE

module.exports = router;
