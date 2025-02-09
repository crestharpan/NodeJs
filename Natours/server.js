const mongoose = require('mongoose');

const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });

//HANDLING UNCAUGHT EXCEPTIONS
process.on('uncaughtException', (err) => {
  console.log(err.name, err.message);
  console.log('UNCAUGHT REJECTION--Shutting the application');

  process.exit(1);
});

const app = require('./app');

const Db = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD,
);
mongoose.connect(Db).then(() => console.log('DB connection Successful'));

//START SERVERS
const port = process.env.PORT || 8000;
const server = app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});

//HANDLING THE REJECTED PROMISES
process.on('unhandledRejection', (err) => {
  console.log(err.name, err.message);
  console.log('UNHANDLED REJECTION--Shutting the application');
  //SHUT DOWN THE APPLICATION ON FAILS DB CONNECTION
  server.close(() => {
    process.exit(1);
  });
});
