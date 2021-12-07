// npm init -y
// npm install mongodb express express-handlebars body-parser

//requisição do express
const express = require('express');
//requisição do express-handlebars
const handle = require('express-handlebars');
//requisição do client que está declarado no arquivo connection.js
const client = require('./connection');
//chamando o express na const app
const app = express();
//declaração do dataBase hospitalSystem
const dbo = client.db('hospitalSystem');
//criando o diretório partials
const hbs = handle.create({
  // handleHelper radio button
  helpers: {
    radioCheck: function (c1, c2, options) {
      if (c1 == c2) {
        return options.fn(this);
      } else {
        return options.inverse(this);
      }
    }
  },
  partialsDir: 'views/partials/'
});

//declaração da porta que está sendo usada
const port = 3000;

// requisição var global acesso
const { eADMIN } = require('./helpers/eADMIN');
const { eUSER } = require('./helpers/eUSER');

//declarando o engine a ser usado -> handlebars
app.engine('handlebars', hbs.engine);
// setando a view engine como handlebars
app.set('view engine', 'handlebars');
// colocando em uso o urlencoded do express, um middleware responsável por retornar apenas o mesmo tipo de conteúdo requerido
app.use(express.urlencoded({ extended: true }));
// colocando em uso o json do express, um middleware responsável por retornar apenas o mesmo tipo de conteúdo requerido
app.use(express.json());
// colocando em uso os diretórios estáticos pela pasta /public
app.use(express.static(__dirname + '/public'));

// variável global usada para controle de acesso
global.tipoAcesso = '';
global.nomeAcesso = '';

// require nos routes
// raiz da rota de login é /login
const loginRoute = require('./routers/login-routers');
app.use('/login', loginRoute);
// raiz da rota de ativos é /active
const activeRoute = require('./routers/active-routers');
app.use('/active', eADMIN, activeRoute);
// raiz da rota de médicos é /doctors
const doctorRoute = require('./routers/doctors-routers');
app.use('/doctors', eADMIN, doctorRoute);
// raiz da rota de especialidades é /specialty
const specialtyRoute = require('./routers/specialty-routers');
app.use('/specialty', eADMIN, specialtyRoute);
// raiz da rota de especialidades é /specialty
const searchRoute = require('./routers/search-routers');
app.use('/search', eUSER, searchRoute);

//////// INICIO - ROTAS RELACIONADA A RAIZ
// essa rota é a raiz de tudo, onde temos a opção de escolher entre o login de ADM e USER
// daqui vai para o /login
//ou entao vai direto pro login, idk
app.get('/', (request, response) => {
  let notLogin = true;
  response.render('root', { notLogin });
});
//////// FIM - ROTAS RELACIONADA A RAIZ

//////// INICIO - ROTAS RELACIONADA AO ADMIN
//dashboard do admin onde terá três botões, um que vai pro /doctors/list, um que vai para o /specialty/list e um que vai para o /active/list
app.get('/dashboard', eADMIN, (request, response) => {
  let nomeAcesso = global.nomeAcesso;

  dbo
    .collection('doctors')
    .estimatedDocumentCount({})
    .then(result1 => {
      dbo
        .collection('specialty')
        .estimatedDocumentCount({})
        .then(result2 => {
          dbo
            .collection('ativos')
            .estimatedDocumentCount({})
            .then(result3 => {
              response.render('admCRUD', {
                nomeAcesso,
                result1,
                result2,
                result3
              });
            });
        });
    });
});
//////// FIM - ROTAS RELACIONADA AO ADMIN

//////// INICIO - ROTAS RELACIONADA AO USER
//página do user, aparece a lista de ativos sem os botões de ação e tem a barra de pesquisa para procura de médicos e especialidades
app.get('/userList', eUSER, (request, response) => {
  let nomeAcesso = global.nomeAcesso;
  let botaoDashboard = false;

  dbo
    .collection('ativos')
    .find({})
    .toArray((erro, resultadoAtivos) => {
      if (erro) throw erro;
      if (global.tipoAcesso == 'ADM') {
        botaoDashboard = true;
        response.render('userList', {
          resultadoAtivos,
          nomeAcesso,
          botaoDashboard
        });
      } else {
        response.render('userList', {
          resultadoAtivos,
          nomeAcesso,
          botaoDashboard
        });
      }
    });
});
//////// FIM - ROTAS RELACIONADA AO USER

//////// CONECTANDO COM O SERVIDOR
app.listen(port, () => {
  console.log('Servidor Rodando.');
});
