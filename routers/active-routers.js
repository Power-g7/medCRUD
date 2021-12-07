const activeControl = require('../controllers/active-controllers');

const express = require('express');
const router = express.Router();

const bodyParser = require('body-parser');
// const jsonParser = bodyParser.json();
const urlencodedParser = bodyParser.urlencoded({ extended: false });

//////// INICIO - ROTAS RELACIONADAS AOS ATIVOS
//////renderizar lista para cadastro de ativo
router.get('/register', activeControl.register);

// rota do action para o form de cadastro do ativo
router.post('/ativar', urlencodedParser, activeControl.add);

////renderizar lista de ativos
router.get('/list', activeControl.list);

////editar ativo
router.get('/editActive/:id', activeControl.edit);

router.post('/attActive', urlencodedParser, activeControl.att);

///// deletar ativo
router.get('/desativeActive/:id', activeControl.desative);
//////// FIM - ROTAS RELACIONADAS AOS ATIVOS

module.exports = router;
