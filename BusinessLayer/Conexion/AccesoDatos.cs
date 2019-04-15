using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Data;
using System.Data.SqlClient;
using System.Configuration;

namespace BusinessLayer.Conexion
{
    public class AccesoDatos
    {

        /// <summary>
        /// Obtiene o establece el nombre de la Base de Datos para la conexion Actual
        /// </summary>
        public static string DataBase = "";

        /// <summary>
        /// Obtiene o establece la Contraseña para la conexión
        /// </summary>
        public static string Password = "";

        /// <summary>
        /// Obtiene o establece el Nombre del Servidor
        /// </summary>
        public static string Server = "";

        /// <summary>
        /// Obtiene o establece el nombre del usuario de la conexión
        /// </summary>
        public static string User = "";

        /// <summary>
        /// Obtiene o establece la cadena Completa utilizada para la conexion a la Base de datos 
        /// </summary>
        //private static string ConnectionString = "Data Source=SQL5027;Initial Catalog=DB_A1339D_LATIN;Persist Security Info=True;User ID=DB_A1339D_LATIN_admin ;Password=entercomp2017;";
        //private static string ConnectionString = "Data Source=sql5027.smarterasp.net;Initial Catalog=DB_A1339D_LATIN;Persist Security Info=True;User ID=DB_A1339D_LATIN_admin ;Password=entercomp2017;";
        private static string ConnectionString = ConfigurationManager.AppSettings["cn"].ToString();

        /// <summary>
        /// Almacena el mensaje devuelto en caso exista algun error de conexión en la clase, de forma resumida
        /// </summary>
        public static string MessageErrorConnection = "";

        /// <summary>
        /// Almacena el mensaje devuelto en caso exista algun error de conexión en la clase, de forma Detallada
        /// </summary>
        public string MessageErrorConnectionDetail = "";

        /// <summary>
        /// SqlCon
        /// </summary>
        protected SqlConnection sqlCon;
        /// <summary>
        /// sqlCmd
        /// </summary>
        protected SqlCommand sqlCmd;
        /// <summary>
        /// sqlTra
        /// </summary>
        protected SqlTransaction sqlTra;

        /// <summary>
        /// Establece los datos de la cadena de conexion en modo mixto que utilizara esta clase y a la vez estable los datos que s recibe como parametros
        /// </summary>
        /// <param name="pServer">Nombre del Servidor</param>
        /// <param name="pDataBase">Nombre de la Base de Datos</param>
        /// <param name="pUser">Nombre del usuario </param>
        /// <param name="pPassword">Pasword </param> 
        public static void setConectionStringMixta(string pServer, string pDataBase, string pUser, string pPassword)
        {
            DataBase = pDataBase; Server = pServer; User = pUser; Password = pPassword;
            setConectionStringMixta();
        }

        /// <summary>
        /// Estable la cadena de conexion fija para la instancia sqlConnection, con los datos staticos asignados Server,Port,User,Pasword, DataBase
        /// </summary>
        public static void setConectionStringMixta()
        {
            ConnectionString = "Data Source=" + Server +
              ";Initial Catalog=" + DataBase + ";Persist Security Info=True;User ID=" + User +
              ";Password=" + Password + ";";
        }

        /// <summary>
        /// Inicializa una nueva instacia de CdDatos y crea un objeto SqlConnection con la cadena de conexion 
        /// establecida en el AccesoDatos.Conectionstring
        /// </summary>
        public AccesoDatos(string cadena)
        {
            sqlCon = new SqlConnection();
            sqlCon.ConnectionString = cadena;
        }

        /// <summary>
        /// Inicializa una nueva instacia de CdDatos y crea un objeto SqlConnection con la cadena de conexion 
        /// establecida en el AccesoDatos.Conectionstring
        /// </summary>
        public AccesoDatos()
        {
            sqlCon = new SqlConnection();
            sqlCon.ConnectionString = ConnectionString;
        }

        /// <summary>
        /// Abre la conexión SQL 
        /// </summary>
        /// <returns></returns>
        public SqlConnection openConexion()
        {
            if (sqlCon.State != System.Data.ConnectionState.Open) sqlCon.Open();
            return sqlCon;
        }

        /// <summary>
        /// Cierra la conexión SQL
        /// </summary>
        private void cerrarConexion()
        {
            if (sqlCon.State != System.Data.ConnectionState.Closed) sqlCon.Close();
        }

        /// <summary>
        /// Prueba la conexión, se debe haber establecido la Cadena de Conexion de la clase
        /// </summary>
        /// <returns></returns> 
        public bool ProbarConexion()
        {
            try
            {
                openConexion();
                return true;
            }
            catch (Exception ex) { MessageErrorConnectionDetail = ex.ToString(); MessageErrorConnection = ex.Message; return false; }

        }


        /// <summary>
        /// Ejecuta una operacion SQL Insert,Update,delete y retorna el valor del parametro de salida 
        /// que contiene el procedimiento almacenado  
        /// </summary>
        /// <param name="ProcedureName">Nombre del Procedimiento Almacenado</param>
        /// <param name="Parametros">Parametros a enviar (el Nro y posicion de los parametros debe coicidir con los 
        /// del Procedimiento Almacenado)  </param>
        public int ExecuteQueryOuput(string ProcedureName, params Object[] Parametros)
        {
            int rpta = 0;
            try
            {
                openConexion();
                MessageErrorConnection = "";
                sqlCmd = new SqlCommand(ProcedureName, sqlCon);
                sqlCmd.CommandType = CommandType.StoredProcedure;
                SqlCommandBuilder.DeriveParameters(sqlCmd);//RECUPERO LA INFORMACION DEL PROCEDIMIENTO ALMACENADO

                for (int i = 1; i < sqlCmd.Parameters.Count; i++)
                {
                    sqlCmd.Parameters[i].Value = Parametros[i - 1]; //SOLO ME SIRVE PARA EL PRIMER PARAMETRO
                }

                sqlCmd.ExecuteNonQuery();

                rpta = Convert.ToInt32(sqlCmd.Parameters[1].Value);//retorna su id
            }
            catch (Exception ex)
            {
                rpta = 0;
                MessageErrorConnection = ex.Message;
                MessageErrorConnectionDetail = ex.ToString();
            }

            finally
            {
                cerrarConexion();
            }

            return rpta;

        }

        public string ExecuteQueryOuputString(string ProcedureName, params Object[] Parametros)
        {
            string rpta;
            try
            {
                openConexion();
                MessageErrorConnection = "";
                sqlCmd = new SqlCommand(ProcedureName, sqlCon);
                sqlCmd.CommandType = CommandType.StoredProcedure;
                SqlCommandBuilder.DeriveParameters(sqlCmd);//RECUPERO LA INFORMACION DEL PROCEDIMIENTO ALMACENADO

                for (int i = 1; i < sqlCmd.Parameters.Count; i++)
                {
                    sqlCmd.Parameters[i].Value = Parametros[i - 1]; //SOLO ME SIRVE PARA EL PRIMER PARAMETRO
                }

                sqlCmd.ExecuteNonQuery();

                rpta = sqlCmd.Parameters[1].Value.ToString();//retorna su id
            }
            catch (Exception)
            {
                throw;
            }
            finally
            {
                cerrarConexion();
            }

            return rpta;

        }

        //retorna Scalar
        public int ExecuteQueryScalar(string ProcedureName, params Object[] Parametros)
        {
            int rpta;
            try
            {
                openConexion();
                MessageErrorConnection = "";
                sqlCmd = new SqlCommand(ProcedureName, sqlCon);
                sqlCmd.CommandType = CommandType.StoredProcedure;
                SqlCommandBuilder.DeriveParameters(sqlCmd);//RECUPERO LA INFORMACION DEL PROCEDIMIENTO ALMACENADO

                for (int i = 1; i < sqlCmd.Parameters.Count; i++)
                {
                    sqlCmd.Parameters[i].Value = Parametros[i - 1]; //SOLO ME SIRVE PARA EL PRIMER PARAMETRO
                }



                rpta = Convert.ToInt32(sqlCmd.ExecuteScalar());//retorna su id
            }
            catch (Exception ex)
            {
                MessageErrorConnection = ex.Message; MessageErrorConnectionDetail = ex.ToString(); rpta = 0;
            }

            finally
            {
                cerrarConexion();
            }

            return rpta;

        }

        /// <summary>
        /// Ejecuta una operacion SQL Insert,Update,delete y retorna el numero de filas afectadas en la Tabla
        /// de la base de datos  
        /// </summary>
        /// <param name="ProcedureName">Nombre del Procedimiento Almacenado</param>
        /// <param name="Parametros">Parametros a enviar (el Nro y posicion de los parametros debe coicidir con los 
        /// del Procedimiento Almacenado)  </param>
        public int ExecuteQuery(string ProcedureName, params Object[] Parametros)
        {
            int rpta = 1;

            try
            {
                openConexion();
                MessageErrorConnection = "";
                sqlCmd = new SqlCommand(ProcedureName, sqlCon);
                sqlCmd.CommandType = CommandType.StoredProcedure;
                SqlCommandBuilder.DeriveParameters(sqlCmd);

                for (int i = 1; i < sqlCmd.Parameters.Count; i++)
                {
                    sqlCmd.Parameters[i].Value = Parametros[i - 1];
                }

                rpta = sqlCmd.ExecuteNonQuery();
            }
            catch (Exception EX)
            {
                throw;
            }
            finally
            {
                cerrarConexion();
            }

            return rpta;

        }

        /// <summary>
        /// Ejecuta una operacion SQL Insert,Update,delete y retorna el numero de filas afectadas en la Tablas
        /// de la base de datos  
        /// </summary>
        /// <param name="ProcedureName">Nombre del Procedimiento Almacenado</param>         
        public int ExecuteQuery(string ProcedureName)
        {
            int rpta;

            try
            {
                openConexion();
                MessageErrorConnection = "";
                sqlCmd = new SqlCommand(ProcedureName, sqlCon);
                sqlCmd.CommandType = CommandType.StoredProcedure;

                rpta = sqlCmd.ExecuteNonQuery();
            }
            catch (Exception ex)
            {
                MessageErrorConnection = ex.Message; MessageErrorConnectionDetail = ex.ToString(); rpta = 0;
            }

            finally
            {
                cerrarConexion();
            }

            return rpta;

        }

        /// <summary>
        /// Ejecuta una consulta SQL y Retorna un DataTable con los valores Devueltos por la Consulta del
        /// procedimiento almacenado
        /// </summary>
        /// <param name="ProcedureName">Nombre del Procedimiento Almacenado</param>         
        public DataTable ExecuteQueryData(string ProcedureName)
        {

            DataTable dtAux = new DataTable("TABLA");

            try
            {

                sqlCmd = new SqlCommand(ProcedureName, sqlCon);
                sqlCmd.CommandType = CommandType.StoredProcedure;
                MessageErrorConnection = "";
                SqlDataAdapter sqlDat = new SqlDataAdapter(sqlCmd);
                sqlDat.Fill(dtAux);

            }
            catch (Exception ex)
            {
                MessageErrorConnection = ex.Message; MessageErrorConnectionDetail = ex.ToString(); dtAux = null;
            }

            return dtAux;

        }

        /// <summary>
        /// Ejecuta una consulta SQL y Retorna un DataTable con los valores Devueltos por la Consulta del
        /// procedimiento almacenado 
        /// </summary>
        /// <param name="ProcedureName">Nombre del Procedimiento Almacenado</param>
        /// <param name="Parametros">Parametros a enviar (el Nro y posicion de los parametros debe coicidir con los 
        /// del Procedimiento Almacenado)  </param>
        public DataTable ExecuteQueryData(string ProcedureName, params Object[] Parametros)
        {
            DataTable dtAux = new DataTable("TABLA");

            try
            {
                openConexion();
                MessageErrorConnection = "";
                sqlCmd = new SqlCommand(ProcedureName, sqlCon);
                sqlCmd.CommandType = CommandType.StoredProcedure;

                SqlCommandBuilder.DeriveParameters(sqlCmd);

                for (int i = 1; i < sqlCmd.Parameters.Count; i++)
                {
                    sqlCmd.Parameters[i].Value = Parametros[i - 1];
                }

                SqlDataAdapter sqlDat = new SqlDataAdapter(sqlCmd);
                sqlDat.Fill(dtAux);

            }
            catch (Exception ex)
            {
                MessageErrorConnection = ex.Message; MessageErrorConnectionDetail = ex.ToString(); dtAux = null;
            }

            finally
            {
                cerrarConexion();
            }

            return dtAux;

        }


        /// <summary>
        /// Ejecuta una consulta SQL y Retorna un DataTable con los valores Devueltos por la Consulta del
        /// procedimiento almacenado 
        /// </summary>
        /// <param name="ProcedureName">Nombre del Procedimiento Almacenado</param>
        /// <param name="Parametros">Parametros a enviar (el Nro y posicion de los parametros debe coicidir con los 
        /// del Procedimiento Almacenado)  </param>
        public DataTable ExecuteQueryDataN(string ProcedureName, params Object[] Parametros)
        {
            DataTable dtAux = new DataTable("TABLA");

            try
            {
                openConexion();
                MessageErrorConnection = "";
                sqlCmd = new SqlCommand(ProcedureName, sqlCon);
                sqlCmd.CommandType = CommandType.StoredProcedure;

                SqlCommandBuilder.DeriveParameters(sqlCmd);
                for (int i = 1; i < sqlCmd.Parameters.Count; i++)
                {
                    sqlCmd.Parameters[i].Value = Parametros[i - 1];
                }

                SqlDataAdapter sqlDat = new SqlDataAdapter(sqlCmd);
                sqlDat.Fill(dtAux);

            }
            catch (Exception)
            {
                throw;
            }

            finally
            {
                cerrarConexion();
            }

            return dtAux;

        }

        //el de codigo SQL seria ExecuteStringQueryData
        /// <summary>
        /// Inicia la transacción y abre la conexion
        /// </summary>
        public void StartTransaccion()
        {
            openConexion();
            sqlTra = sqlCon.BeginTransaction();
        }

        /// <summary>
        /// Confirma la transación y cierra la conexión si todo ha sido correcto
        /// </summary>
        public void ConfirmTransaction()
        {
            sqlTra.Commit();
            cerrarConexion();
        }

        /// <summary>
        /// Aborta la Transacción y cierra la conexión si ha existido algún error en la consulta
        /// </summary>
        public void AbortTransaction()
        {
            sqlTra.Rollback();
            cerrarConexion();
        }

        /// <summary>
        /// Ejecuta una operacion SQL Insert,Update,delete dentro de una Transacción y retorna el valor del parametro de salida 
        /// que contiene el procedimiento almacenado  
        /// </summary>
        /// <param name="ProcedureName">Nombre del Procedimiento Almacenado</param>
        /// <param name="Parametros">Parametros a enviar (el Nro y posicion de los parametros debe coicidir con los 
        /// del Procedimiento Almacenado)  </param>
        public int ExecuteQueryOutputTransaction(string ProcedureName, params Object[] Parametros)
        {
            int rpta;
            try
            {
                MessageErrorConnection = "";
                sqlCmd = new SqlCommand(ProcedureName, sqlCon, sqlTra);
                sqlCmd.CommandType = CommandType.StoredProcedure;
                SqlCommandBuilder.DeriveParameters(sqlCmd);
                MessageErrorConnection = "";
                for (int i = 1; i < sqlCmd.Parameters.Count; i++)
                {
                    sqlCmd.Parameters[i].Value = Parametros[i - 1];
                }

                sqlCmd.ExecuteNonQuery();

                rpta = Convert.ToInt32(sqlCmd.Parameters[1].Value);

            }
            catch (Exception ex)
            {
                MessageErrorConnection = ex.Message; MessageErrorConnectionDetail = ex.ToString(); rpta = 0;
            }

            return rpta;

        }

        public int ExecuteQueryTransactionScalar(string ProcedureName, params Object[] Parametros)
        {
            int rpta;
            try
            {
                MessageErrorConnection = "";
                sqlCmd = new SqlCommand(ProcedureName, sqlCon, sqlTra);
                sqlCmd.CommandType = CommandType.StoredProcedure;
                SqlCommandBuilder.DeriveParameters(sqlCmd);
                MessageErrorConnection = "";
                for (int i = 1; i < sqlCmd.Parameters.Count; i++)
                {
                    sqlCmd.Parameters[i].Value = Parametros[i - 1];
                }


                rpta = Convert.ToInt32(sqlCmd.ExecuteScalar());

            }
            catch (Exception ex)
            {
                MessageErrorConnection = ex.Message; MessageErrorConnectionDetail = ex.ToString(); rpta = 0;
            }

            return rpta;

        }

        /// <summary>
        /// Ejecuta una operacion SQL Insert,Update,delete dentro de una Transacción y retorna el valor del parametro de salida en formato string
        /// que contiene el procedimiento almacenado  
        /// </summary>
        /// <param name="ProcedureName">Nombre del Procedimiento Almacenado</param>
        /// <param name="Parametros">Parametros a enviar (el Nro y posicion de los parametros debe coicidir con los 
        /// del Procedimiento Almacenado)  </param>
        public string ExecuteQueryOutputTransactionString(string ProcedureName, params Object[] Parametros)
        {
            string rpta;
            try
            {
                MessageErrorConnection = "";
                sqlCmd = new SqlCommand(ProcedureName, sqlCon, sqlTra);
                sqlCmd.CommandType = CommandType.StoredProcedure;
                SqlCommandBuilder.DeriveParameters(sqlCmd);
                MessageErrorConnection = "";
                for (int i = 1; i < sqlCmd.Parameters.Count; i++)
                {
                    sqlCmd.Parameters[i].Value = Parametros[i - 1];
                }

                sqlCmd.ExecuteNonQuery();

                rpta = sqlCmd.Parameters[1].Value.ToString();

            }
            catch (Exception ex)
            {
                MessageErrorConnection = ex.Message; MessageErrorConnectionDetail = ex.ToString(); rpta = "";
            }

            return rpta;

        }

        /// <summary>
        /// Ejecuta una operacion SQL Insert,Update,delete dentro de una Transacción y retorna el numero de filas afectadas en la Tabla
        /// de la base de datos  
        /// </summary>
        /// <param name="ProcedureName">Nombre del Procedimiento Almacenado</param>
        /// <param name="Parametros">Parametros a enviar (el Nro y posicion de los parametros debe coicidir con los 
        /// del Procedimiento Almacenado)  </param>
        public int ExecuteQueryTransaction(string ProcedureName, params Object[] Parametros)
        {
            int rpta;
            try
            {
                MessageErrorConnection = "";
                sqlCmd = new SqlCommand(ProcedureName, sqlCon, sqlTra);
                sqlCmd.CommandType = CommandType.StoredProcedure;
                SqlCommandBuilder.DeriveParameters(sqlCmd);//RECUPERO LA INFORMACION DEL PROCEDIMIENTO ALMACENADO
                MessageErrorConnection = "";
                for (int i = 1; i < sqlCmd.Parameters.Count; i++)
                {
                    sqlCmd.Parameters[i].Value = Parametros[i - 1]; //SOLO ME SIRVE PARA EL PRIMER PARAMETRO
                }

                rpta = sqlCmd.ExecuteNonQuery();

            }
            catch (Exception ex)
            {
                MessageErrorConnection = ex.Message; MessageErrorConnectionDetail = ex.ToString(); rpta = 0;
            }

            return rpta;

        }

        /// <summary>
        /// Ejecuta una operacion SQL Insert,Update,delete dentro de una Transacción y retorna el numero de filas afectadas en la Tabla
        /// de la base de datos  
        /// </summary>
        /// <param name="ProcedureName">Nombre del Procedimiento Almacenado</param> 
        public int ExecuteQueryTransaction(string ProcedureName)
        {
            int rpta;
            try
            {
                sqlCmd = new SqlCommand(ProcedureName, sqlCon, sqlTra);
                sqlCmd.CommandType = CommandType.StoredProcedure;
                MessageErrorConnection = "";
                rpta = sqlCmd.ExecuteNonQuery();
            }
            catch (Exception ex)
            {
                MessageErrorConnection = ex.Message; MessageErrorConnectionDetail = ex.ToString(); rpta = 0;
            }

            return rpta;


        }

        /// <summary>
        /// Ejecuta una consulta SQL y Retorna un DataTable con los valores Devueltos por la Consulta del
        /// procedimiento almacenado dentro de una Transacción
        /// </summary>
        /// <param name="ProcedureName">Nombre del Procedimiento Almacenado</param>
        /// <param name="Parametros">Parametros a enviar (el Nro y posicion de los parametros debe coicidir con los 
        /// del Procedimiento Almacenado)  </param>
        public DataTable ExecuteQueryDataTransaction(string ProcedureName, params Object[] Parametros)
        {
            DataTable dtAux = new DataTable("TABLA");

            try
            {
                sqlCmd = new SqlCommand(ProcedureName, sqlCon);
                sqlCmd.CommandType = CommandType.StoredProcedure;
                MessageErrorConnection = "";
                SqlCommandBuilder.DeriveParameters(sqlCmd);

                for (int i = 0; i < sqlCmd.Parameters.Count; i++)
                {
                    sqlCmd.Parameters[i].Value = Parametros[i];
                }

                SqlDataAdapter sqlDat = new SqlDataAdapter(sqlCmd);
                sqlDat.Fill(dtAux);

            }
            catch (Exception ex)
            {
                MessageErrorConnection = ex.Message; MessageErrorConnectionDetail = ex.ToString(); dtAux = null;
            }

            return dtAux;

        }

        public DataTable ExecuteQueryDataSql(string consulta)
        {
            DataTable dtAux = new DataTable("TABLA");
            MessageErrorConnection = "";

            try
            {
                sqlCmd = new SqlCommand(consulta, sqlCon);
                MessageErrorConnection = "";
                SqlDataAdapter sqlDat = new SqlDataAdapter(sqlCmd);
                sqlDat.Fill(dtAux);

            }
            catch (Exception)
            {
                throw;
            }

            return dtAux;

        }

        public int ExecuteQuerySql(string consulta)
        {
            int rpta;
            MessageErrorConnection = "";

            try
            {
                openConexion();
                MessageErrorConnection = "";
                sqlCmd = new SqlCommand(consulta, sqlCon);

                rpta = sqlCmd.ExecuteNonQuery();


            }
            catch (Exception ex)
            {
                MessageErrorConnection = ex.Message; rpta = 0;
            }

            finally
            {
                cerrarConexion();
            }

            return rpta;

        }

        public DataSet ExecuteQueryDataSet(string ProcedureName, params Object[] Parametros)
        {
            DataSet dtAux = new DataSet("TABLA");

            try
            {
                openConexion();
                MessageErrorConnection = "";
                sqlCmd = new SqlCommand(ProcedureName, sqlCon);
                sqlCmd.CommandType = CommandType.StoredProcedure;

                SqlCommandBuilder.DeriveParameters(sqlCmd);

                for (int i = 1; i < sqlCmd.Parameters.Count; i++)
                {
                    sqlCmd.Parameters[i].Value = Parametros[i - 1];
                }

                SqlDataAdapter sqlDat = new SqlDataAdapter(sqlCmd);
                sqlDat.Fill(dtAux);

            }
            catch (Exception ex)
            {
                MessageErrorConnection = ex.Message; MessageErrorConnectionDetail = ex.ToString(); dtAux = null;
            }

            finally
            {
                cerrarConexion();
            }

            return dtAux;

        }


    }
}
