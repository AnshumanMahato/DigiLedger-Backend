const mongoose = require('mongoose');
const { port, database } = require('./config');

const app = require('./app');

mongoose.connect(database).then(() => {
  // eslint-disable-next-line no-console
  console.log('DB Connected');
});

// eslint-disable-next-line no-console
app.listen(port, () => console.log(`listening to port ${port}`));
