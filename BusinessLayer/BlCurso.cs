﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using BusinessLayer.Conexion;
using System.Data;

namespace BusinessLayer
{
    public class BlCurso
    {
        public BlCurso() { }
        public int IdCurso { get; set; }
        public string Descripcion { get; set; }
        public string _Alumno { get; set; }
        public decimal Nota { get; set; }
        public bool Estado { get; set; }
        public string Error { get { return AccesoDatos.MessageErrorConnection; } }
        public int AddCurso()
        {
            return new AccesoDatos().ExecuteQueryOuput("SpAddCurso", IdCurso, Descripcion);
        }

        public int AddCursoAlumno(int idAlumno)
        {
            return new AccesoDatos().ExecuteQueryOuput("SpAddCursoAlumno", IdCurso, idAlumno);
        }
        public int UpdateCurso()
        {
            return new AccesoDatos().ExecuteQuery("spUpdateCurso", IdCurso, Descripcion);
        }
        public int UpdateNotaAlumno(int idAlumno)
        {
            return new AccesoDatos().ExecuteQuery("SpUpdateNotaAlumno", idAlumno, IdCurso, Nota);
        }
        public int DeleteCursoAlumno(int idAlumno)
        {
            return new AccesoDatos().ExecuteQuery("SpDeleteCursoAlumno", idAlumno, IdCurso);
        }
        public int DeleteCurso()
        {
            return new AccesoDatos().ExecuteQuery("SpDeleteCurso", IdCurso);
        }
        public DataTable FillCurso()
        {
            return new AccesoDatos().ExecuteQueryData("SpFillCurso", IdCurso, Estado);
        }

        public DataTable GetNotasGeneral()
        {
            return new AccesoDatos().ExecuteQueryData("SpGetNotasGeneral");
        }

        public DataTable FillNotasPorAlumno(int idalumno)
        {
            return new AccesoDatos().ExecuteQueryData("SpFillNotasPorAlumno", idalumno);
        }
    }
}
