import {Sequelize, sequelize} from "./database";

export interface ISoftwareAttributes
{
	ClaveSoftware: number,
	Nombre: string,
	Descripcion: Date,
	Estado: string,
	FechaInicio: Date,
	FechaTermino: Date
}

export interface ISoftwareInstance extends Sequelize.Instance<ISoftwareAttributes>
{
	ClaveSoftware: number,
	Nombre: string,
	Descripcion: Date,
	Estado: string,
	FechaInicio: Date,
	FechaTermino: Date
}

export const Software = sequelize.define<ISoftwareInstance, ISoftwareAttributes>("software", {
	Clave_Software:
		{
			type: Sequelize.SMALLINT,
			primaryKey: true
		},
	Nombre:
		{
			type: Sequelize.TEXT,
			unique: true
		},
	Descripcion: Sequelize.TEXT,
	Estado: Sequelize.ENUM("En_proceso", "Cancelado", "Atrasado", "Terminado"),
	Fecha_Inicio: Sequelize.DATEONLY,
	Fecha_Termino: Sequelize.DATEONLY
});

export interface ICanceladosTardeAttributes
{
	ClaveCT: number,
	Motivo: string,
	FechaTenTermino: Date,
	Software: number
}

export interface ICanceladosTardeInstance extends Sequelize.Instance<ICanceladosTardeAttributes>
{
	ClaveCT: number,
	Motivo: string,
	FechaTenTermino: Date,
	Software: number
}

export const CanceladosTarde = sequelize.define<ICanceladosTardeInstance, ICanceladosTardeAttributes>("canceladosTarde",
																									  {
																										  Clave_CT:
																											  {
																												  type: Sequelize.SMALLINT,
																												  primaryKey: true
																											  },
																										  Motivo:
																											  {
																												  type: Sequelize.TEXT
																											  },
																										  Fecha_Ten_Termino: Sequelize.DATEONLY,
																										  Software: Sequelize.SMALLINT
																									  });

Software.hasOne(CanceladosTarde, {foreignKey: "Software"});

export interface IDesarrolloAttributes
{
	ClaveDesarrollo: Number,
	Tarea: string,
	FechaInicio: Date,
	FechaTermino: Date,
	Software: number,
	Empleado: number
}

export interface IDesarrolloInstance extends Sequelize.Instance<IDesarrolloAttributes>
{
	ClaveDesarrollo: Number,
	Tarea: string,
	FechaInicio: Date,
	FechaTermino: Date,
	Software: number,
	Empleado: number
}

export const Desarrollo = sequelize.define<IDesarrolloInstance, IDesarrolloAttributes>("desarrollo", {
	Clave_desarrollo:
		{
			type: Sequelize.INTEGER,
			primaryKey: true
		},
	Tarea: Sequelize.TEXT,
	Fecha_Inicio: Sequelize.DATEONLY,
	Fecha_Termino: Sequelize.DATEONLY,
	Software: Sequelize.SMALLINT,
	Empleado: Sequelize.INTEGER
});

export interface IEmpleadoAttributes
{
	Nomina: number,
	GdoEstudios: string,
	Nombre: string,
	Apellidos: string,
	Estatus: string
}

export interface IEmpleadoInstance extends Sequelize.Instance<IEmpleadoAttributes>
{
	Nomina: number,
	GdoEstudios: string,
	Nombre: string,
	Apellidos: string,
	Estatus: string
}

export const Empleado = sequelize.define<IEmpleadoInstance, IEmpleadoAttributes>("empleado", {
	Nomina:
		{
			autoIncrement: true,
			type: Sequelize.INTEGER,
			primaryKey: true
		},
	Gdo_Estudios: Sequelize.ENUM("Primaria", "Secundaria", "Bachillerato", "Licenciatura", "Maestria", "Doctorado"),
	Nombre: Sequelize.TEXT,
	Apellidos: Sequelize.TEXT,
	Estatus: Sequelize.ENUM("Activo", "Inactivo", "Recontratado")
});

Empleado.hasMany(Desarrollo, {foreignKey: "Empleado"});
Software.hasMany(Desarrollo, {foreignKey: "Software"});

export interface IPerfilesPasadosAttributes
{
	Clave: number,
	Usuario: string,
	Puesto: string,
	Empleado: number
}

export interface IPerfilesPasadosInstance extends Sequelize.Instance<IPerfilesPasadosAttributes>
{
	Clave: number,
	Usuario: string,
	Puesto: string,
	Empleado: number
}

export const PerfilesPasados = sequelize.define<IPerfilesPasadosInstance, IPerfilesPasadosAttributes>(
	"perfiles_pasados", {
		Clave:
			{
				type: Sequelize.SMALLINT,
				primaryKey: true
			},
		Usuario: Sequelize.STRING(15),
		Puesto: Sequelize.ENUM("Gerente", "Desarrollador"),
		Empleado: Sequelize.INTEGER
	});

Empleado.hasMany(PerfilesPasados, {foreignKey: "Empleado"});

export interface IPerfilAttributes
{
	ClaveEmpleado: number,
	correo: string,
	Usuario: string,
	Contrasena: string,
	Puesto: string,
	Empleado: number
}

export interface IPerfilInstance extends Sequelize.Instance<IPerfilAttributes>
{
	ClaveEmpleado: number,
	correo: string,
	Usuario: string,
	Contrasena: string,
	Puesto: string,
	Empleado: number
}

export const Perfil = sequelize.define<IPerfilInstance, IPerfilAttributes>("perfil", {
	Clave_Empleado:
		{
			type: Sequelize.SMALLINT,
			primaryKey: true
		},
	Correo: Sequelize.STRING(320),
	Usuario: Sequelize.STRING(15),
	Contrasena: Sequelize.TEXT,
	Puesto: Sequelize.ENUM("Gerente", "Desarrollador", "AdminBD"),
	Empleado: Sequelize.INTEGER
});

Empleado.hasOne(Perfil, {foreignKey: "Empleado"});

export interface IImagenAttributes
{
	ClaveFoto?: number,
	Direccion?: string,
	Perfil?: number
}

export interface IImagenInstance extends Sequelize.Instance<IImagenAttributes>
{
	ClaveFoto: number,
	Direccion: string,
	Perfil: number
}

export const Imagen = sequelize.define<IImagenInstance, IImagenAttributes>("imagenes", {
	Clave_Foto:
		{
			type: Sequelize.INTEGER,
			primaryKey: true
		},
	Direccion: Sequelize.TEXT,
	Perfil: Sequelize.INTEGER
});

Perfil.hasMany(Imagen, {foreignKey: "Perfile"});

export interface IEntradaSalidaAttributes
{
	ClaveRegistro: number,
	Tipo: string,
	Registro: Date,
	Perfil: number
}

export interface IEntradaSalidaInstance extends Sequelize.Instance<IEntradaSalidaAttributes>
{
	ClaveRegistro: number,
	Tipo: string,
	Registro: Date,
	Perfil: number
}

export const EntradaSalida = sequelize.define<IEntradaSalidaInstance, IEntradaSalidaAttributes>("entrada_salida", {
	Clave_Registro:
		{
			type: Sequelize.INTEGER,
			primaryKey: true
		},
	Tipo: Sequelize.ENUM("Entrada", "Salida"),
	Registro: Sequelize.DATE,
	Perfil: Sequelize.INTEGER
});

Perfil.hasMany(EntradaSalida, {foreignKey: "Perfil"});

export interface ITokensAttributes
{
	refreshToken: string,
	token: string,
	expiration: Date
}

export interface ITokensInstance extends Sequelize.Instance<ITokensInstance>
{
	refreshToken: string,
	token: string,
	expiration: Date
}

export const Tokens = sequelize.define<ITokensInstance, ITokensAttributes>("tokens",
																		   {
																			   refreshToken:
																				   {
																					   type: Sequelize.TEXT,
																					   primaryKey: true
																				   },
																			   token:
																				   {
																					   type: Sequelize.TEXT,
																					   unique: true
																				   },
																			   expiration:
																				   {
																					   type: Sequelize.DATE
																				   }
																		   });

sequelize.sync({force: false, logging: false});
