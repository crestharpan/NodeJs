const app = require('./app');
//START SERVERS
const port = 8000;
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
