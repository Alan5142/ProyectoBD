import * as Sequelize from 'sequelize';

export const sequelize = new Sequelize('proyectobd', 'Pbd', 'Stark-Alan', {
	host : 'localhost',
	dialect : 'postgres',
	operatorsAliases : false,

	pool : {
		max : 5,
		min : 0,
		acquire : 30000,
		idle : 10000
	},
	define : {
		timestamps : false
	}
});

export {Sequelize};