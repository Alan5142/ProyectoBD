import {database} from './../utility/Database';

/**
 * Modelo que representa un cliente
 */
export class Cliente
{
	public readonly NoCliente : number;
	public readonly NombreEmpresa : string;
	private _Correo : string;
	private readonly _Usuario : string;

	get Correo () : string
	{
		return this._Correo;
	}

	set Correo (nuevoCorreo : string)
	{
		const queryString = 'UPDATE pbd.Cliente SET Correo = $1 WHERE No_Cliente = $2';
		const queryValues = [nuevoCorreo, this.NoCliente];
		database.query(queryString, queryValues, (err, result) =>
		{
			if (!err)
			{
				this._Correo = nuevoCorreo;
			}
		});
	}

	/**
	 * Crea un nuevo cliente en la base de datos
	 * @param noCliente Identificador unico del cliente
	 * @param nombre Nombre de la empresa del cliente
	 * @param correo Correo del cliente
	 * @param usuario Usuario del cliente (maximo 15 caracteres)
	 * @param contrasena Contraseña del cliente, se encriptará en la bd
	 */
	public static CrearCliente (noCliente : number, nombre : string, correo : string, usuario : string,
								contrasena : string) : Cliente
	{
		const queryString = 'INSERT INTO pbd.Cliente (Nombre_Empresa, Correo, Usuario, Contrasena) VALUES($1, $2, $3, $4) RETURNING *';
		const queryValues = [nombre, correo, usuario];
		let cliente : Cliente = null;

		database.query(queryString, queryValues, (error, result) =>
		{
			if (error)
			{
				console.log("User exists!");
			}
			else
			{
				let rowResult = result.rows[0];
				cliente = new Cliente(rowResult.No_Cliente, rowResult.Nombre_Empresa,
					rowResult.Correo, rowResult.Usuario);
			}
		});

		return cliente;
	}

	/**
	 * Constructor del modelo cliente, es privado por el patrón de diseño "factory"
	 * @param noCliente
	 * @param nombre Nombre de la empresa del cliente
	 * @param correo Correo del cliente
	 * @param usuario Usuario del cliente (maximo 15 caracteres)
	 */
	private constructor (noCliente : number, nombre : string, correo : string, usuario : string)
	{
		this.NoCliente = noCliente;
		this.NombreEmpresa = nombre;
		this._Correo = correo;
		this._Usuario = usuario;
	}

	/**
	 * Obtiene un cliente de la bd
	 * @param queryString query que se hará
	 * @param queryValues valores del query
	 */
	private static ObtenerCliente (queryString : string, queryValues : any[]) : Cliente
	{
		let cliente : Cliente = null;
		database.query(queryString, queryValues, (error, result) =>
		{
			if (error)
			{
				console.log("User doesn't exist");
			}
			else
			{
				if (result.rowCount == 1)
				{
					let rowResult = result.rows[0];
					cliente = new Cliente(rowResult.No_Cliente, rowResult.Nombre_Empresa,
						rowResult.Correo, rowResult.Usuario);
				}
			}
		});
		return cliente;
	}

	/**
	 * Busca un usuario en la bd
	 * @param clientId Id del cliente
	 */
	public static ObtenerPorId (clientId : number) : Cliente
	{
		const queryString = 'SELECT * FROM pbd.Cliente WHERE No_Cliente = $1';
		const queryValues = [clientId];

		return this.ObtenerCliente(queryString, queryValues);
	}

	/**
	 * Busca un usuario en la bd
	 * @param nombre Nombre del cliente
	 */
	public static ObtenerPorNombre (nombre : string) : Cliente
	{
		const queryString = 'SELECT * FROM pbd.Cliente WHERE nombre_empresa = $1';
		const queryValues = [nombre];

		return Cliente.ObtenerCliente(queryString, queryValues);
	}

	/**
	 * Busca un usuario en la bd
	 * @param username Usuario del cliente
	 */
	public static ObtenerPorUsuario (username : string) : Cliente
	{
		const queryString = 'SELECT * FROM pbd.Cliente WHERE Usuario = $1';
		const queryValues = [username];

		return Cliente.ObtenerCliente(queryString, queryValues);
	}

	public CambiarContrasena (nuevaContrasena : string)
	{
		const queryString = 'UPDATE pbd.Cliente SET Contrasena = $1 WHERE No_Cliente = $2';
		const queryValues = [this.NoCliente];
		database.query(queryString, queryValues, (err, result) =>
		{
			if (err)
			{
				console.log(err);
			}
		});
	}
}
