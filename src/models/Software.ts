import {database} from '../utility/Database';

export enum EstadoSoftware
{

}

/**
 * Modelo que representa la relación entre el software y el cliente
 */
export class Software
{
	public readonly ClaveSoftware : number;
	private _Nombre : string;
	private _Descripcion : string;
	private _Estado : EstadoSoftware;
	public readonly FechaInicio : Date;
	private _FechaTermino : Date;

	get Nombre () : string
	{
		return this._Nombre;
	}

	set Nombre (nuevoNombre : string)
	{
		const queryString = 'UPDATE pbd.Software SET Nombre = $1 WHERE Clave_Software = $2';
		const queryValues = [nuevoNombre, this.ClaveSoftware];
		database.query(queryString, queryValues, (err, result) =>
		{
			if (!err)
			{
				this._Nombre = nuevoNombre;
			}
		});
	}

	get Descripcion () : string
	{
		return this._Descripcion;
	}

	set Descripcion (nuevaDescripcion : string)
	{
		const queryString = 'UPDATE pbd.Software SET Descripcion = $1 WHERE Clave_Software = $2';
		const queryValues = [nuevaDescripcion, this.ClaveSoftware];
		database.query(queryString, queryValues, (err, result) =>
		{
			if (!err)
			{
				this._Descripcion = nuevaDescripcion;
			}
		});
	}

	get Estado () : EstadoSoftware
	{
		return this._Estado;
	}

	set Estado (nuevoEstado : EstadoSoftware)
	{
		const queryString = 'UPDATE pbd.Software SET Estado = $1 WHERE Clave_Software = $2';
		const queryValues = [nuevoEstado, this.ClaveSoftware];
		database.query(queryString, queryValues, (err, result) =>
		{
			if (!err)
			{
				this._Estado = nuevoEstado;
			}
		});
	}

	get FechaTermino () : Date
	{
		return this._FechaTermino;
	}

	set FechaTermino (nuevaFecha : Date)
	{
		const queryString = 'UPDATE pbd.Software SET Fecha_Termino = $1 WHERE Clave_Software = $2';
		const queryValues = [nuevaFecha, this.ClaveSoftware];
		database.query(queryString, queryValues, (err, result) =>
		{
			if (!err)
			{
				this._FechaTermino = nuevaFecha;
			}
		});
	}

	private constructor (claveSoftware : number, nombre : string, descripcion : string, estado : EstadoSoftware,
						 fechaInicio : Date, fechaTermino : Date)
	{
		this.ClaveSoftware = claveSoftware;
		this._Descripcion = descripcion;
		this._Estado = estado;
		this.FechaInicio = fechaInicio;
		this._FechaTermino = fechaTermino;
	}

	public static CrearSoftware (nombre : string, descripcion : string, estado : EstadoSoftware, fechaInicio : Date,
								 fechaTermino : Date) : Software
	{
		const queryString = 'INSERT INTO pbd.Software (Nombre_Empresa, Correo, Usuario, Contrasena) VALUES($1, $2, $3, $4) RETURNING *';
		const queryValues = [nombre, descripcion, estado];
		let software : Software = null;

		database.query(queryString, queryValues, (error, result) =>
		{
			if (error)
			{
				console.log("Software exists!");
			}
			else
			{
				let rowResult = result.rows[0];
				let estado : EstadoSoftware = (<any>EstadoSoftware)[rowResult.Estado];
				software = new Software(rowResult.Clave_Software, rowResult.Nombre, rowResult.Descripcion,
					estado, rowResult.Fecha_Inicio, rowResult.Fecha_Termino);
			}
		});

		return software;
	}

	private static ObtenerSoftware (queryString : string, queryValues : any[]) : Software
	{
		let software : Software = null;
		database.query(queryString, queryValues, (error, result) =>
		{
			if (error)
			{
				console.log("Software doesn't exist");
			}
			else
			{
				if (result.rowCount == 1)
				{
					let rowResult = result.rows[0];
					let estado : EstadoSoftware = (<any>EstadoSoftware)[rowResult.Estado];
					software = new Software(rowResult.Clave_Software, rowResult.Nombre, rowResult.Descripcion,
						estado, rowResult.Fecha_Inicio, rowResult.Fecha_Termino);
				}
			}
		});
		return software;
	}

	public static ObtenerSoftwarePorId (clave : number) : Software
	{
		const queryString = 'SELECT * FROM pbd.Software WHERE Clave_Software = $1';
		const queryValues = [clave];

		return this.ObtenerSoftware(queryString, queryValues);
	}

	public static ObtenerSoftwarePorNombre (nombre : string) : Software
	{
		const queryString = 'SELECT * FROM pbd.Software WHERE Nombre = $1';
		const queryValues = [nombre];

		return this.ObtenerSoftware(queryString, queryValues);
	}
}