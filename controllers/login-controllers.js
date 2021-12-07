// const loginModel = require('../models/')
const { response } = require('express');
const client = require('../connection');

const dbo = client.db('hospitalSystem');

exports.login = (request, response) => {
  let notLogin = true;
  return response.render('login', { notLogin });
};
exports.loginBadRequest = (request, response) => {
  let notLogin = true;
  return response.render('loginRedirect', { notLogin });
};

exports.enter = (request, response) => {
  const email = request.body.email;
  const senha = request.body.senha;
  dbo.collection('users').findOne({ email }, (err, result) => {
    if (err) throw err;
    if (result == null) {
      response.redirect('/login/badRequest');
    } else {
      if (result.senha == senha) {
        if (result.acesso == 'ADM') {
          global.nomeAcesso = result.nome;
          global.tipoAcesso = 'ADM';
          // response.send('VOCE É ADM');
          response.redirect('/dashboard');
        } else {
          global.nomeAcesso = result.nome;

          global.tipoAcesso = 'USER';
          // response.send('VOCÊ É USER');
          response.redirect('/userList');
        }
      } else {
        response.redirect('/login/badRequest');
      }
    }
  });
};

exports.logout = (request, response) => {
  global.nomeAcesso = '';
  global.tipoAcesso = '';
  console.log(global.tipoAcesso);
  response.redirect('/');
};
