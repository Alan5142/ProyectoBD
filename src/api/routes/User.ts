import * as Express from 'express';

import {database} from  '../../utility/Database';
const route = Express.Router();

route.get('/', (req, res) =>
{
    res.json({ejemplo: 'true'})
});

route.post('/', (req, res) =>
{
    // TODO handle login
    database.query('Insert into proyecto.empleado (');
});

route.get('/:userid', (req, res) =>
{
    // TODO are user logged and he wants to see his/her information?

    // TODO return a json string that contains user information
});

export {route as userRoute};
