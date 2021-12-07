const routerControl = require('../controllers/search-controllers');
const express = require('express');
const router = express.Router();

////////////////// INICIO -  ROTA SEARCH
//////pagina de ativos
//procura entre os doutores de ativos, case insensitive
router.get('/doctor', routerControl.pagAtivoMedico);
//procura entre as especialidades, case insensitive
router.get('/specialty', routerControl.pagAtivoEspecialidade);
// pagina de usuarios
//procura entre os doutores de ativos, case insensitive
router.get('/doctorUser', routerControl.pagUserMedico);
//procura entre as especialidades, case insensitive
router.get('/specialtyUser', routerControl.pagUserEspecialidade);
//procura entre os doutores de medicos, case insensitive
router.get('/doctors', routerControl.pagMedico);
//procura entre as especialidades, case insensitive
router.get('/specialtys', routerControl.pagEspecialidade);
////////////////// FIM -  ROTA SEARCH
module.exports = router;
