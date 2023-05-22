const mongoose = require('mongoose');
const { port, env, database } = require('./config');

const app = require('./app');

console.log(env, database);

mongoose
  .connect(database, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    // eslint-disable-next-line no-console
    console.log('DB Connected');
  });

app.listen(port, () => console.log(`listening to port ${port}`));
