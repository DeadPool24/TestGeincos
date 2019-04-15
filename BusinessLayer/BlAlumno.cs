﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using BusinessLayer.Conexion;
using System.Data;

namespace BusinessLayer
{
    public class BlAlumno
    {
        public BlAlumno() { }
        public int IdAlumno { get; set; }
        public string Nombres { get; set; }
        public string ApellidoPat { get; set; }
        public string ApellidoMat { get; set; }
        public string Dni { get; set; }
        public string Correo { get; set; }
        public string Apoderado { get; set; }
        public string DniApoderado { get; set; }
        public string TelfonoEmergencia { get; set; }
        public string Nivel { get; set; }
        public string Seccion { get; set; }
        public bool Estado { get; set; }
        public string Error { get { return AccesoDatos.MessageErrorConnection; } }

        public int AddAlumno()
        {
            return new AccesoDatos().ExecuteQueryOuput("SpAddAlumno", IdAlumno, Nombres, ApellidoPat, ApellidoMat, Dni, Correo, Apoderado, DniApoderado, TelfonoEmergencia, Nivel, Seccion, Estado);
        }

        public DataTable FillAlumno()
        {
            return new AccesoDatos().ExecuteQueryData("SpFillAlumno", IdAlumno, Estado);
        }
    }
}
