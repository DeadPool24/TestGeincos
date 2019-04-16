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

    }
}
