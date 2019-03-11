import 'reflect-metadata';
import { createConnection, Connection } from 'typeorm';

const connection: Promise<Connection> = createConnection();

export default connection;
