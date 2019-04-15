using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;
using System.Web.Script.Serialization;

namespace BusinessLayer
{
    public class BlConsultaDniReniec
    {
        public string success { get; set; }
        public string ruc { get; set; }
        public string razon_social { get; set; }
        public string ciiu { get; set; }
        public string fecha_actividad { get; set; }
        public string contribuyente_condicion { get; set; }
        public string contribuyente_tipo { get; set; }
        public string contribuyente_estado { get; set; }
        public string nombre_comercial { get; set; }
        public string fecha_inscripcion { get; set; }
        public string domicilio_fiscal { get; set; }
        public string sistema_emision { get; set; }
        public string sistema_contabilidad { get; set; }
        public string actividad_exterior { get; set; }
        public string emision_electronica { get; set; }
        public string fecha_inscripcion_ple { get; set; }
        public string Oficio { get; set; }
        public string fecha_baja { get; set; }
        public object representante_legal { get; set; }
        public object empleados { get; set; }
        public object locales { get; set; }
        public string _Error { get; set; }

        public string dni { get; set; }
        public string cui { get; set; }
        public string apellido_paterno { get; set; }
        public string apellido_materno { get; set; }
        public string nombres { get; set; }

        public Task<BlConsultaDniReniec> ConsultaDNI(string pDni)
        {
            BlConsultaDniReniec objeto = new BlConsultaDniReniec();
            System.Net.ServicePointManager.ServerCertificateValidationCallback += delegate { return true; };
            return Task.Run(() =>
            {
                try
                {
                    JavaScriptSerializer ser = new JavaScriptSerializer();
                    var request = (HttpWebRequest)WebRequest.Create(Path.Combine("https://api.reniec.cloud/dni", pDni));
                    request.Method = "GET";
                    request.ContentType = "application/JSON; charset=utf-8";
                    HttpWebResponse response = request.GetResponse() as HttpWebResponse;
                    Stream stream = response.GetResponseStream();
                    StreamReader reader = new StreamReader(stream);
                    var result = reader.ReadToEnd();

                    JavaScriptSerializer js = new JavaScriptSerializer();
                    objeto = js.Deserialize<BlConsultaDniReniec>(result);
                }
                catch (Exception ex)
                {
                    objeto._Error = ex.Message;
                }
                return objeto;
            });

        }


    }
}
