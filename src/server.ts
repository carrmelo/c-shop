import app from './app/app';
import databaseConnection from './database/database.connection';

const PORT: number = +process.env.PORT || 3000;

databaseConnection
  .then(() => {
    console.log('Database connection stablished');
    app.listen(PORT);
  })
  .catch(console.error);
