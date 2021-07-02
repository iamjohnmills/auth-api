(async () => {

  //const {generateCode} = require('./app/libs/utilities');
  //console.log(await generateCode(48));

  // Include Express and Initialize App
  const express = require('express');
  const server = express();

  // Connect to DB
  const mongoose = require('mongoose');
  const {database} = require('./app/config');
  await mongoose.connect(database, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true });

  // Setup Router
  const router = require('./app/router');
  server.use('/', router);

  // Start Server
  server.listen(process.env.PORT);
  console.log(`server listening...`)

})();
