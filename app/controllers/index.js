module.exports = {
  register: require('./register'),
  activate: require('./activate'),
  login: require('./login'),
  forgotpassword: require('./forgotpassword'),
  resetpassword: require('./resetpassword'),
  refreshtoken: require('./refreshtoken'),
  me: require('./me'),
  emailchange: require('./emailchange'),
  passwordchange: require('./passwordchange'),
  getInvoice: require('./getInvoice'),
  testing: {
    deleteusers: require('./deleteusers'),
  },
}
