const loginControl = require('../controllers/login-controllers');
const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
// const jsonParser = bodyParser.json();
const urlencodedParser = bodyParser.urlencoded({ extended: false });

//////// INICIO - ROTAS RELACIONADA AO LOGIN

//rota que apresenta o form do login
router.get('/', loginControl.login);
//rota que apresenta falha no login
router.get('/badRequest', loginControl.loginBadRequest);
// //rota que posta os dados do login para confirmar e usar a rotina de verificação do tipo de acesso
router.post('/enter', urlencodedParser, loginControl.enter);
// // rota para logout
router.get('/logout', loginControl.logout);

//////// FIM - ROTAS RELACIONADA AO LOGIN

module.exports = router;
