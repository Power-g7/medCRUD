module.exports = {
  eUSER: function (req, res, next) {
    if (global.tipoAcesso == 'USER' || global.tipoAcesso == 'ADM') {
      return next();
    } else {
      res.redirect('/login');
    }
  }
};
