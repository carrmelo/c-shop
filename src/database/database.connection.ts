import 'reflect-metadata';
import { createConnection, Connection, ConnectionOptions } from 'typeorm';
import { join } from 'path';
const parentDir = join(__dirname, '..');

const connectionOpts: ConnectionOptions = {
  type: 'postgres',
  host: process.env.HOSTNAME || 'localhost',
  port: Number(process.env.DB_PORT) || 5432,
  username: process.env.DB_USERNAME || 'postgers',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'car',
  entities: [`${parentDir}/**/*.entity.ts`],
  synchronize: true,
};

const connection: Promise<Connection> = createConnection(connectionOpts);

export default connection;
