const objectId = require('mongodb').ObjectId;

const client = require('../connection');

const dbo = client.db('hospitalSystem');

exports.register = (request, response) => {
  let conteudoBotaoEspecialidade = 'Cadastrar';
  let botaoLimpar = true;
  response.render('especialidades/cadastroEspecialidade', {
    conteudoBotaoEspecialidade,
    botaoLimpar
  });
};

exports.add = (request, response) => {
  let conteudoBotaoEspecialidade = 'Cadastrar';
  let especialidadeForm = request.body.especialidade.toUpperCase().trim();
  let msgAlerta = 'Cadastro realizado com sucesso.';
  let sucesso = false;
  let fracasso = false;

  dbo
    .collection('specialty')
    .findOne({ especialidade: especialidadeForm }, (err, resultado) => {
      if (err) throw err;
      if (resultado == null) {
        if (request.body.idEspecialidadeEditar == '') {
          const objSpecialty = {
            especialidade: especialidadeForm
          };
          dbo.collection('specialty').insertOne(objSpecialty, (err, result) => {
            if (err) throw err;
            msgAlerta = 'Cadastro realizado com sucesso.';
            sucesso = true;
            response.render('especialidades/cadastroEspecialidade', {
              msgAlerta,
              sucesso,
              conteudoBotaoEspecialidade
            });
          });
        } else {
          let idEspecialidade = request.body.idEspecialidadeEditar;
          const objId = new objectId(idEspecialidade);

          dbo
            .collection('specialty')
            .updateOne(
              { _id: objId },
              { $set: { especialidade: especialidadeForm } },
              { upsert: true },
              (erro, result) => {
                if (erro) throw erro;
                sucesso = true;

                msgAlerta = 'Cadastro atualizado com sucesso.';
                response.render('especialidades/cadastroEspecialidade', {
                  msgAlerta,
                  sucesso,
                  conteudoBotaoEspecialidade
                });
              }
            );
        }
      } else {
        fracasso = true;
        msgAlerta = 'A especialidade inserida já existe. Operação inválida!';
        response.render('especialidades/cadastroEspecialidade', {
          msgAlerta,
          fracasso,
          conteudoBotaoEspecialidade
        });
      }
    });
};

exports.list = (request, response) => {
  dbo
    .collection('specialty')
    .find({})
    .toArray((erro1, resultadoEspecialidade) => {
      if (erro1) throw erro1;
      response.render('especialidades/listaEspecialidade', {
        resultadoEspecialidade
      });
    });
};

exports.edit = (request, response) => {
  let conteudoBotaoEspecialidade = 'Atualizar';
  let botaoLimpar = false;
  const idEspecialidade = request.params.id;
  const objId = new objectId(idEspecialidade);
  dbo
    .collection('specialty')
    .findOne({ _id: objId }, (err, resultadoEspecialidade) => {
      if (err) throw err;
      response.render('especialidades/cadastroEspecialidade', {
        resultadoEspecialidade,
        conteudoBotaoEspecialidade,
        botaoLimpar
      });
    });
};

exports.delete = (request, response) => {
  let idEspecialidade = request.params.id;
  const objId = new objectId(idEspecialidade);
  // dbo.collection('specialty').findOne({ _id: objId }, (err, result) => {
  //   if (err) throw err;
  //   console.log(result);
  //   console.log(result.especialidade);
  //   dbo
  //     .collection('ativos')
  //     .find({ especialidade: result.especialidade })
  //     .toArray((erro1, resultado1) => {
  //       if (erro1) throw erro1;
  //       // if (result.especialidade == null) {
  //       //   console.log('esse resultado foi null');
  //       // } else
  //       if (resultado1.length == 1) {
  //         const objMedico = new objectId(resultado1[0].medico._id);
  //         dbo
  //           .collection('doctors')
  //           .updateOne(
  //             { _id: objMedico },
  //             { $set: { ativo: false } },
  //             { upsert: true },
  //             (erro3, resultado3) => {
  //               if (erro3) throw erro3;
  //             }
  //           );
  //         dbo
  //           .collection('ativos')
  //           .deleteOne(
  //             { especialidade: resultado1[0].especialidade },
  //             (erro2, resultado2) => {
  //               if (erro2) throw erro2;
  //             }
  //           );
  //       } else if (resultado1.length >= 2) {
  //         for (let i = 0; i < resultado1.length; i++) {
  //           if (typeof resultado1[i].especialidade == 'string') {
  //             const objMedico = new objectId(resultado1[i].medico._id);
  //             dbo
  //               .collection('doctors')
  //               .updateOne(
  //                 { _id: objMedico },
  //                 { $set: { ativo: false } },
  //                 { upsert: true },
  //                 (erro4, resultado4) => {
  //                   if (erro4) throw erro4;
  //                 }
  //               );
  //             dbo
  //               .collection('ativos')
  //               .deleteOne(
  //                 { especialidade: resultado1[i].especialidade },
  //                 (erro5, resultado5) => {
  //                   if (erro5) throw erro5;
  //                 }
  //               );
  //           } else if (typeof resultado1[i].especialidade == 'object') {
  //             let novaEspecialidade = [];
  //             for (let j = 0; j < resultado1[i].especialidade.length; j++) {
  //               if (resultado1[i].especialidade[j] != result.especialidade) {
  //                 novaEspecialidade.push(resultado1[i].especialidade[j]);
  //               }
  //             }

  //             const objMedico1 = new objectId(resultado1[i].medico._id);
  //             dbo
  //               .collection('ativos')
  //               .updateOne(
  //                 { 'medico._id': objMedico1 },
  //                 { $set: { especialidade: novaEspecialidade } },
  //                 { upsert: true },
  //                 (erro6, resultado6) => {
  //                   if (erro6) throw erro6;
  //                 }
  //               );
  //           }
  //         }
  //       }
  //     });
  // });

  dbo.collection('specialty').deleteOne({ _id: objId }, (erro, resultado) => {
    if (erro) throw erro;
    response.redirect('/specialty/list');
  });
};
