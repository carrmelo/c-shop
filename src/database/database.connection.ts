import 'reflect-metadata';
import { createConnection, Connection } from 'typeorm';

// Options generated directly from the config file
const connection: Promise<Connection> = createConnection();

export default connection;
