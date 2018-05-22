import * as Postgres from 'pg';

const database = new Postgres.Client({ // TODO set database login info
    user: 'dbuser',
    host: 'database.server.com',
    database: 'mydb',
    password: 'secretpassword',
    port: 3211,
});

database.connect();

export { database }