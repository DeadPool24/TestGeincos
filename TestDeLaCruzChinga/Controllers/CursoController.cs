using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Data;
using BusinessLayer;

namespace TestDeLaCruzChinga.Controllers
{
    public class CursoController : Controller
    {
        //
        // GET: /Curso/

        public ActionResult Index()
        {
            ViewBag.flagOption = 1;
            return View();
        }

        public ActionResult Asignaturas()
        {
            return View();
        }

        public ActionResult Reporte()
        {
            return View();
        }

        public object AddCurso(string Descripcion)
        {
            BlCurso obj = new BlCurso();
            obj.Descripcion = Descripcion;
            int r = obj.AddCurso();
            if (r != 0)
            {
                return Json(new { Codigo = 0, Mensaje = "Curso registrado exitosamente" });
            }
            else
            {
                return Json(new { Codigo = 1, obj.Error, Id = r });
            }
        }

        public object AddCursoAlumno(int idCurso, int idAlumno)
        {
            BlCurso obj = new BlCurso();
            obj.IdCurso = idCurso;
            int r = obj.AddCursoAlumno(idAlumno);
            if (r != 0)
            {
                return Json(new { Codigo = 0, Mensaje = "Curso registrado exitosamente", Id = r });
            }
            else
            {
                return Json(new { Codigo = 1, Mensaje = obj.Error });
            }
        }

        public object UpdateCurso(int id, string Descripcion)
        {
            BlCurso obj = new BlCurso();
            obj.IdCurso = id;
            obj.Descripcion = Descripcion;
            int r = obj.UpdateCurso();
            if (r != 0)
            {
                return Json(new { Codigo = 0, Mensaje = "Curso actualizado exitosamente" });
            }
            else
            {
                return Json(new { Codigo = 1, obj.Error });
            }
        }

        public object UpdateNotaAlumno(int idCurso, int idalumno, decimal nota)
        {
            BlCurso obj = new BlCurso();
            obj.IdCurso = idCurso;
            obj.Nota = nota;
            int r = obj.UpdateNotaAlumno(idalumno);
            if (r != 0)
            {
                return Json(new { Codigo = 0, Mensaje = "Nota actualizada exitosamente" });
            }
            else
            {
                return Json(new { Codigo = 1, obj.Error });
            }
        }

        public object DeleteCursoAlumno(int idCurso, int idalumno)
        {
            BlCurso obj = new BlCurso();
            obj.IdCurso = idCurso;
            int r = obj.DeleteCursoAlumno(idalumno);
            if (r != 0)
            {
                return Json(new { Codigo = 0, Mensaje = "Nota eliminada exitosamente" });
            }
            else
            {
                return Json(new { Codigo = 1, obj.Error });
            }
        }

        public object DeleteCurso(int id)
        {
            BlCurso obj = new BlCurso();
            obj.IdCurso = id;
            int r = obj.DeleteCurso();
            if (r != 0)
            {
                return Json(new { Codigo = 0, Mensaje = "Curso eliminado exitosamente" });
            }
            else
            {
                return Json(new { Codigo = 1, obj.Error });
            }
        }

        public object getCurso(int id = 0, bool estado = true)
        {
            BlCurso obj = new BlCurso();
            obj.IdCurso = id;
            obj.Estado = estado;
            DataTable dt = obj.FillCurso();
            if (dt != null)
            {
                var datos = (from DataRow dr in dt.Rows
                             select new
                             {
                                 IdCurso = dr["IdCurso"],
                                 Descripcion = dr["Descripcion"],
                                 Estado = dr["Estado"]
                             }).ToList();
                return Json(new { Codigo = 0, Data = datos });
            }
            else
            {
                return Json(new { Codigo = 1, Mensaje = obj.Error });
            }
        }

        public object FillNotasPorAlumno(int idalumno)
        {
            BlCurso obj = new BlCurso();
            DataTable dt = obj.FillNotasPorAlumno(idalumno);
            if (dt != null)
            {
                var datos = (from DataRow dr in dt.Rows
                             select new
                             {
                                 IdCurso = dr["IdCurso"],
                                 Descripcion = dr["Descripcion"],
                                 IdAlumno = dr["IdAlumno"],
                                 Nota = dr["Nota"]
                             }).ToList();
                return Json(new { Codigo = 0, Data = datos });
            }
            else
            {
                return Json(new { Codigo = 1, Mensaje = obj.Error });
            }
        }

        public object GetNotasGeneral()
        {
            BlCurso obj = new BlCurso();
            DataTable dt = obj.GetNotasGeneral();
            List<BlCurso> lista = new List<BlCurso>();
            List<BlAlumno> listaAlumno = new List<BlAlumno>();
            if (dt != null)
            {
                var datos = (from DataRow dr in dt.Rows
                             select new
                             {
                                 //IdCurso = dr["IdCurso"],
                                 //Descripcion = dr["Descripcion"],
                                 IdAlumno = dr["IdAlumno"],
                                 //Nota = dr["Nota"],
                                 Alumno = dr["Nombres"].ToString() + " " + dr["ApellidoPat"].ToString() + " " + dr["ApellidoMat"].ToString()
                             }).ToList().Distinct();

                foreach (var item in datos)
                {
                    BlAlumno objA = new BlAlumno();
                    lista = new List<BlCurso>();
                    objA.Nombres = item.Alumno;
                    foreach (DataRow dr in dt.Rows)
                    {
                        obj = new BlCurso();
                        if (Convert.ToInt32(item.IdAlumno) == Convert.ToInt32(dr["IdAlumno"]))
                        {
                            obj.IdCurso = Convert.ToInt32(dr["IdCurso"]);
                            obj.Descripcion = dr["Descripcion"].ToString();
                            obj.Nota = Convert.ToDecimal(dr["Nota"]);
                            lista.Add(obj);
                        }
                    }
                    objA.Notas = lista;
                    listaAlumno.Add(objA);
                }
                return Json(new { Codigo = 0, Data = listaAlumno });
            }
            else
            {
                return Json(new { Codigo = 1, Mensaje = obj.Error });
            }
        }

    }
}
