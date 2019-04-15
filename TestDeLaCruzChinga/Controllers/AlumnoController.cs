using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using BusinessLayer;
using System.Data;

namespace TestDeLaCruzChinga.Controllers
{
    public class AlumnoController : Controller
    {
        //
        // GET: /Alumno/

        public ActionResult Index()
        {
            ViewBag.flagOption = 1;
            return View();
        }

        public object FillAlumnos(bool Estado, int Id)
        {
            BlAlumno obj = new BlAlumno();
            obj.Estado = Estado;
            obj.IdAlumno = Id;
            DataTable dt = obj.FillAlumno();
            if (dt != null)
            {
                return Json(new { Codigo = 0, Data = dt });
            }
            else
            {
                return Json(new { Codigo = 1, Mensaje = obj.Error });
            }
        }

        public object AddAlumno(string PNom, string PApePat, string PApeMat, string PDni, string PMail, string PApod, string PDniApo,
            string PTelf, string PNiv, string PSec)
        {
            BlAlumno obj = new BlAlumno();
            obj.Nombres = PNom;
            obj.ApellidoPat = PApePat;
            obj.ApellidoMat = PApeMat;
            obj.Dni = PDni;
            obj.Correo = PMail;
            obj.Apoderado = PApod;
            obj.DniApoderado = PDniApo;
            obj.TelfonoEmergencia = PTelf;
            obj.Nivel = PNiv;
            obj.Seccion = PSec;
            int r = obj.AddAlumno();
            if (r != 0)
            {
                return Json(new { Codigo = 0, Mensaje = "Alumno registrado exitosamente", Id = r });
            }
            else
            {
                return Json(new { Codigo = 1, Mensaje = obj.Error });
            }
        }

    }
}
