// const doctorModel = require('../models/doctors-model');
const objectId = require('mongodb').ObjectId;

const client = require('../connection');

const dbo = client.db('hospitalSystem');

exports.register = (request, response) => {
  response.render('medicos/cadastroMedicos');
};

exports.add = (request, response) => {
  let sucesso = false;
  let fracassoCRM = false;
  let fracassoEmail = false;
  let msgAlerta = '';

  crmForm = request.body.crm.toUpperCase().trim();
  emailForm = request.body.emailMedico.toUpperCase().trim();
  dbo.collection('doctors').findOne({ crm: crmForm }, (erro1, resultado1) => {
    if (erro1) throw erro1;
    if (resultado1 == null) {
      dbo
        .collection('doctors')
        .findOne({ email: emailForm }, (erro2, resultado2) => {
          if (erro2) throw erro2;
          if (resultado2 == null) {
            const objDoctor = {
              nome: request.body.nomeMedico.toUpperCase().trim(),
              crm: crmForm,
              email: emailForm,
              atendimento: request.body.atendimento.toUpperCase().trim(),
              ativo: false
            };
            dbo.collection('doctors').insertOne(objDoctor, (err, result) => {
              if (err) throw err;
              sucesso = true;
              msgAlerta = 'Cadastro realizado com sucesso.';
              response.render('medicos/cadastroMedicos', {
                sucesso,
                msgAlerta
              });
            });
          } else {
            fracassoEmail = true;
            msgAlerta = 'O Email inserido já existe. Operação inválida!';
            response.render('medicos/cadastroMedicos', {
              fracassoEmail,
              msgAlerta
            });
          }
        });
    } else {
      fracassoCRM = true;
      msgAlerta = 'O CRM inserido já existe. Operação inválida!';
      response.render('medicos/cadastroMedicos', {
        fracassoCRM,
        msgAlerta
      });
    }
  });
};

exports.att = (request, response) => {
  let sucesso = false;
  let fracassoCRM = false;
  let fracassoEmail = false;
  let msgAlerta = '';

  const idMedico = request.body.idMedicoEditar;
  const objId = new objectId(idMedico);
  const nomeForm = request.body.nomeMedico.toUpperCase().trim();
  const crmForm = request.body.crm.toUpperCase().trim();
  const emailForm = request.body.emailMedico.toUpperCase().trim();
  const atendimentoForm = request.body.atendimento.toUpperCase();

  dbo.collection('doctors').findOne({ crm: crmForm }, (erro1, resultado1) => {
    if (erro1) throw erro1;
    if (resultado1 == null || resultado1._id == idMedico) {
      dbo
        .collection('doctors')
        .findOne({ email: emailForm }, (erro2, resultado2) => {
          if (erro2) throw erro2;
          if (resultado2 == null || resultado2._id == idMedico) {
            // response.send('Ele é o único com esse crm e email, pode att');
            dbo.collection('doctors').updateOne(
              { _id: objId },
              [
                {
                  $set: { nome: nomeForm }
                },
                { $set: { crm: crmForm } },
                {
                  $set: {
                    email: emailForm
                  }
                },
                {
                  $set: {
                    atendimento: atendimentoForm
                  }
                }
              ],
              { upsert: true },
              (erro, resultado) => {
                if (erro) throw erro;
              }
            );

            dbo.collection('doctors').findOne({ _id: objId }, (err, result) => {
              if (result.ativo) {
                dbo.collection('ativos').updateOne(
                  { 'medico._id': objId },
                  [
                    {
                      $set: {
                        'medico.nome': nomeForm
                      }
                    },
                    {
                      $set: {
                        'medico.crm': crmForm
                      }
                    },
                    {
                      $set: {
                        'medico.email': emailForm
                      }
                    },
                    {
                      $set: {
                        'medico.atendimento': atendimentoForm
                      }
                    }
                  ],
                  { upsert: true },
                  (erro, resultado) => {
                    if (erro) throw erro;
                  }
                );
              }
            });
            sucesso = true;
            msgAlerta = 'Cadastro atualizado com sucesso.';
            response.render('medicos/cadastroMedicos', {
              sucesso,
              msgAlerta
            });
          } else {
            fracassoEmail = true;
            msgAlerta = 'O Email inserido já existe. Operação inválida!';
            response.render('medicos/cadastroMedicos', {
              fracassoEmail,
              msgAlerta
            });
          }
        });
    } else {
      fracassoCRM = true;
      msgAlerta = 'O CRM inserido já existe. Operação inválida!';
      response.render('medicos/cadastroMedicos', {
        fracassoCRM,
        msgAlerta
      });
    }
  });
};

exports.list = (request, response) => {
  dbo
    .collection('doctors')
    .find({})
    .toArray((erro, resultadoMedico) => {
      if (erro) throw erro;
      response.render('medicos/listaMedicos', { resultadoMedico });
    });
};

exports.edit = (request, response) => {
  const idMedico = request.params.id;
  const objId = new objectId(idMedico);
  dbo.collection('doctors').findOne({ _id: objId }, (err, resultadoMedico) => {
    if (err) throw err;
    response.render('medicos/atualizaMedicos', {
      resultadoMedico
    });
  });
};

exports.delete = (request, response) => {
  const idMedico = request.params.id;
  const objId = new objectId(idMedico);
  dbo.collection('doctors').findOne({ _id: objId }, (err, result) => {
    if (result.ativo) {
      dbo
        .collection('ativos')
        .deleteOne({ 'medico._id': objId }, (erro, resultado) => {
          if (erro) throw erro;
          dbo
            .collection('doctors')
            .deleteOne({ _id: objId }, (erro, resultado) => {
              if (erro) throw erro;
              response.redirect('/doctors/list');
            });
        });
    } else {
      dbo.collection('doctors').deleteOne({ _id: objId }, (erro, resultado) => {
        if (erro) throw erro;
        response.redirect('/doctors/list');
      });
    }
  });
};
