const objectId = require('mongodb').ObjectId;

const client = require('../connection');

const dbo = client.db('hospitalSystem');

exports.pagAtivoMedico = (request, response) => {
  dbo
    .collection('ativos')
    .find({
      'medico.nome': { $regex: request.query.searchDoctor, $options: 'i' }
    })
    .toArray((err, resultadoAtivos) => {
      if (err) throw err;
      response.render('ativos/listaAtivo', { resultadoAtivos });
    });
};

exports.pagAtivoEspecialidade = (request, response) => {
  dbo
    .collection('ativos')
    .find({
      especialidade: { $regex: request.query.searchSpecialty, $options: 'i' }
    })
    .toArray((err, resultadoAtivos) => {
      if (err) throw err;
      response.render('ativos/listaAtivo', {
        resultadoAtivos
      });
    });
};

exports.pagUserMedico = (request, response) => {
  nomeAcesso = global.nomeAcesso;
  botaoDashboard = false;
  if (global.tipoAcesso == 'ADM') {
    botaoDashboard = true;
  } else {
    botaoDashboard = false;
  }
  dbo
    .collection('ativos')
    .find({
      'medico.nome': { $regex: request.query.searchDoctor, $options: 'i' }
    })
    .toArray((err, resultadoAtivos) => {
      if (err) throw err;
      response.render('userList', {
        resultadoAtivos,
        nomeAcesso,
        botaoDashboard
      });
    });
};

exports.pagUserEspecialidade = (request, response) => {
  nomeAcesso = global.nomeAcesso;
  if (global.tipoAcesso == 'ADM') {
    botaoDashboard = true;
  } else {
    botaoDashboard = false;
  }
  dbo
    .collection('ativos')
    .find({
      especialidade: { $regex: request.query.searchSpecialty, $options: 'i' }
    })
    .toArray((err, resultadoAtivos) => {
      if (err) throw err;
      response.render('userList', {
        resultadoAtivos,
        nomeAcesso,
        botaoDashboard
      });
    });
};

exports.pagMedico = (request, response) => {
  dbo
    .collection('doctors')
    .find({
      nome: { $regex: request.query.searchDoctor, $options: 'i' }
    })
    .toArray((err, resultadoMedico) => {
      if (err) throw err;
      response.render('medicos/listaMedicos', { resultadoMedico });
    });
};
exports.pagEspecialidade = (request, response) => {
  dbo
    .collection('specialty')
    .find({
      especialidade: { $regex: request.query.searchSpecialty, $options: 'i' }
    })
    .toArray((err, resultadoEspecialidade) => {
      if (err) throw err;
      response.render('especialidades/listaEspecialidade', {
        resultadoEspecialidade
      });
    });
};
