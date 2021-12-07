module.exports = {
  eADMIN: function (req, res, next) {
    if (global.tipoAcesso == 'ADM') {
      return next();
    } else {
      res.redirect('/userList');
    }
  }
};
