import {Sequelize, sequelize} from './Database';

export const Software = sequelize.define('software', {
	Clave_Software :
		{
			type : Sequelize.SMALLINT,
			primaryKey : true
		},
	Nombre :
		{
			type : Sequelize.TEXT,
			unique : true
		},
	Descripcion : Sequelize.TEXT,
	Estado : Sequelize.ENUM('En_proceso', 'Cancelado', 'Atrasado', 'Terminado'),
	Fecha_Inicio : Sequelize.DATEONLY,
	Fecha_Termino : Sequelize.DATEONLY
});

export const CanceladosTarde = sequelize.define('canceladosTarde', {
	Clave_CT :
		{
			type : Sequelize.SMALLINT,
			primaryKey : true
		},
	Motivo :
		{
			type : Sequelize.TEXT
		},
	Fecha_Ten_Termino : Sequelize.DATEONLY,
	Software : Sequelize.SMALLINT
});

Software.hasOne(CanceladosTarde, {foreignKey : 'Software'});

export const Desarrollo = sequelize.define('desarrollo', {
	Clave_desarrollo :
		{
			type : Sequelize.INTEGER,
			primaryKey : true
		},
	Tarea : Sequelize.TEXT,
	Fecha_Inicio : Sequelize.DATEONLY,
	Fecha_Termino : Sequelize.DATEONLY,
	Software : Sequelize.SMALLINT,
	Empleado : Sequelize.INTEGER
});

export const Empleado = sequelize.define('empleado', {
	Nomina :
		{
			type : Sequelize.INTEGER,
			primaryKey : true
		},
	Gdo_Estudios : Sequelize.ENUM('Primaria', 'Secundaria', 'Bachillerato', 'Licenciatura', 'Maestria', 'Doctorado'),
	Nombre : Sequelize.TEXT,
	Apellidos : Sequelize.TEXT,
	Estatus : Sequelize.ENUM('Activo', 'Inactivo', 'Recontratado')
});

Empleado.hasMany(Desarrollo, {foreignKey : 'Empleado'});
Software.hasMany(Desarrollo, {foreignKey : 'Software'});

export const PerfilesPasados = sequelize.define('perfiles_pasados', {
	Clave :
		{
			type : Sequelize.SMALLINT,
			primaryKey : true
		},
	Usuario : Sequelize.STRING(15),
	Puesto : Sequelize.ENUM('Gerente', 'Desarrollador'),
	Empleado : Sequelize.INTEGER
});

Empleado.hasMany(PerfilesPasados, {foreignKey : 'Empleado'});

export const Perfil = sequelize.define('perfil', {
	Clave_Empleado :
		{
			type : Sequelize.SMALLINT,
			primaryKey : true
		},
	Correo : Sequelize.STRING(320),
	Usuario : Sequelize.STRING(15),
	Contrasena : Sequelize.TEXT,
	Puesto : Sequelize.ENUM('Gerente', 'Desarrollador'),
	Empleado : Sequelize.INTEGER
});

Empleado.hasOne(Perfil, {foreignKey : 'Empleado'});

export const Imagen = sequelize.define('imagenes', {
	Clave_Foto :
		{
			type : Sequelize.INTEGER,
			primaryKey : true
		},
	Direccion : Sequelize.TEXT,
	Perfil : Sequelize.INTEGER
});

Perfil.hasMany(Imagen, {foreignKey : 'Perfile'});

export const EntradaSalida = sequelize.define('entrada_salida', {
	Clave_Registro :
		{
			type : Sequelize.INTEGER,
			primaryKey : true
		},
	Tipo : Sequelize.ENUM('Entrada', 'Salida'),
	Registro : Sequelize.DATE,
	Perfil : Sequelize.INTEGER
});

Perfil.hasMany(EntradaSalida, {foreignKey : 'Perfil'});

export const Tokens = sequelize.define('tokens',
	{
		refreshToken :
			{
				type : Sequelize.TEXT,
				primaryKey : true
			},
		token :
			{
				type : Sequelize.TEXT,
				unique : true
			},
		expiration :
			{
				type : Sequelize.DATE
			}
	});

sequelize.sync({force : false});
