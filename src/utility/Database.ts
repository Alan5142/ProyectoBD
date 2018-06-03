import * as Postgres from 'pg';

const database = new Postgres.Client({ // TODO set database login info
	user : 'Pbd',
    host: 'localhost',
    database: 'pbd',
    password: 'Stark-Alan',
    port: 5432,
});

database.connect();
console.log("Se conecto a la bd");
export { database }