const objectId = require('mongodb').ObjectId;

const client = require('../connection');

const dbo = client.db('hospitalSystem');

exports.register = (request, response) => {
  dbo
    .collection('doctors')
    .find({})
    .toArray((erro, resultadoMedico) => {
      if (erro) throw erro;

      dbo
        .collection('specialty')
        .find({})
        .toArray((erro1, resultadoEspecialidade) => {
          if (erro1) throw erro1;

          response.render('ativos/cadastroAtivo', {
            resultadoMedico,
            resultadoEspecialidade
          });
        });
    });
};

exports.add = (request, response) => {
  let sucesso = false;
  let msgAlerta = 'Cadastro realizado com sucesso.';
  const idMedico = request.body.medicoCheck;
  const objIdMedico = new objectId(idMedico);
  const categoria = request.body.especialidadeCheck;
  if (categoria == null) {
    response.redirect('/active/register');
  } else {
    dbo
      .collection('doctors')
      .updateOne({ _id: objIdMedico }, { $set: { ativo: true } });
    dbo.collection('doctors').findOne({ _id: objIdMedico }, (err, medico) => {
      if (err) throw err;
      const objAtivo = {
        medico: {
          _id: objIdMedico,
          nome: medico.nome,
          crm: medico.crm,
          email: medico.email,
          atendimento: medico.atendimento,
          ativo: true
        },
        especialidade: categoria
      };
      dbo.collection('ativos').insertOne(objAtivo, (err, result) => {
        if (err) throw err;
        dbo
          .collection('doctors')
          .find({})
          .toArray((erro, resultadoMedico) => {
            if (erro) throw erro;

            dbo
              .collection('specialty')
              .find({})
              .toArray((erro1, resultadoEspecialidade) => {
                if (erro1) throw erro1;
                sucesso = true;
                response.render('ativos/cadastroAtivo', {
                  resultadoMedico,
                  resultadoEspecialidade,
                  sucesso,
                  msgAlerta
                });
              });
          });
      });
    });
  }
};

exports.list = (request, response) => {
  dbo
    .collection('ativos')
    .find({})
    .toArray((erro, resultadoAtivos) => {
      if (erro) throw erro;
      response.render('ativos/listaAtivo', {
        resultadoAtivos
      });
    });
};

exports.edit = (request, response) => {
  const idAtivo = request.params.id;
  const objId = new objectId(idAtivo);
  dbo.collection('ativos').findOne({ _id: objId }, (err, resultadoAtivo) => {
    if (err) throw err;

    dbo
      .collection('specialty')
      .find({})
      .toArray((erro1, resultadoEspecialidade) => {
        if (erro1) throw erro1;

        response.render('ativos/editarAtivo', {
          resultadoAtivo,
          resultadoEspecialidade
        });
      });
  });
};

exports.att = (request, response) => {
  let sucesso = false;
  let msgAlerta = 'Cadastro atualizado com sucesso.';
  const idAtivo = request.body.idAtivo;
  const objId = new objectId(idAtivo);
  const categoria = request.body.especialidadeCheck;
  if (categoria == null) {
    response.redirect('/editarAtivo/' + idAtivo + '');
  } else {
    dbo
      .collection('ativos')
      .updateOne(
        { _id: objId },
        { $set: { especialidade: categoria } },
        { upsert: true },
        (erro, resultado) => {
          if (erro) throw erro;
          dbo
            .collection('doctors')
            .find({})
            .toArray((erro, resultadoMedico) => {
              if (erro) throw erro;

              dbo
                .collection('specialty')
                .find({})
                .toArray((erro1, resultadoEspecialidade) => {
                  if (erro1) throw erro1;
                  sucesso = true;
                  response.render('ativos/cadastroAtivo', {
                    resultadoMedico,
                    resultadoEspecialidade,
                    sucesso,
                    msgAlerta
                  });
                });
            });
        }
      );
  }
};

exports.desative = (request, response) => {
  let idAtivo = request.params.id;
  const objId = new objectId(idAtivo);
  dbo.collection('ativos').findOne({ _id: objId }, (err, result) => {
    if (err) throw err;
    idMedico = result.medico._id;
    const objIdMedico = new objectId(idMedico);
    dbo
      .collection('doctors')
      .updateOne({ _id: objIdMedico }, { $set: { ativo: false } });
  });
  dbo.collection('ativos').deleteOne({ _id: objId }, (erro, resultado) => {
    if (erro) throw erro;
    response.redirect('/active/list');
  });
};
