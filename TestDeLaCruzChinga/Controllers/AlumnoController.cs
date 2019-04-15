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

        public object FillAlumnos(bool Estado = true, int Id = 0)
        {
            BlAlumno obj = new BlAlumno();
            obj.Estado = Estado;
            obj.IdAlumno = Id;
            DataTable dt = obj.FillAlumno();
            if (dt != null)
            {
                var datos = (from DataRow dr in dt.Rows
                             select new
                             {
                                 IdAlumno = dr["IdAlumno"],
                                 Nombres = dr["Nombres"],
                                 ApellidoPat = dr["ApellidoPat"],
                                 ApellidoMat = dr["ApellidoMat"],
                                 Dni = dr["Dni"],
                                 Correo = dr["Correo"],
                                 Apoderado = dr["Apoderado"],
                                 DniApoderado = dr["DniApoderado"],
                                 TelfonoEmergencia = dr["TelfonoEmergencia"],
                                 Nivel = dr["Nivel"],
                                 Seccion = dr["Seccion"],
                                 Estado = dr["Estado"]
                             }).ToList();
                return Json(new { Codigo = 0, Data = datos });
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

        public object UpdateAlumno(int Id, string PNom, string PApePat, string PApeMat, string PDni, string PMail, string PApod, string PDniApo,
           string PTelf, string PNiv, string PSec)
        {
            BlAlumno obj = new BlAlumno();
            obj.IdAlumno = Id;
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
            int r = obj.UpdateAlumno();
            if (r != 0)
            {
                return Json(new { Codigo = 0, Mensaje = "Alumno actualizado exitosamente", Id = r });
            }
            else
            {
                return Json(new { Codigo = 1, Mensaje = obj.Error });
            }
        }

    }
}
