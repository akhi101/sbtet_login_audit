using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data.SqlClient;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http;
using System.Web.Http.Controllers;
using System.Web.Http.Filters;
using Newtonsoft.Json;
using SoftwareSuite.Models;
using SoftwareSuite.Models.Database;
using SoftwareSuite.Models.Security;

namespace SoftwareSuite.Controllers.Polycet
{
    public class PolycetLocatorController : ApiController
    {
        public class AuthorizationFilter : AuthorizationFilterAttribute
        {
            protected AuthToken token = null;
            public override void OnAuthorization(HttpActionContext actionContext)
            {

                try
                {
                    var tokenStr = actionContext.Request.Headers.FirstOrDefault(h => h.Key == "token");
                    var tkn = tokenStr.Value.FirstOrDefault();
                    var t = tkn.Split(new string[] { "$$@@$$" }, StringSplitOptions.None);
                    var parsedToken = t[0];
                    token = JsonConvert.DeserializeObject<AuthToken>(new HbCrypt().Decrypt(parsedToken));
                    if (!validatetoken(token.AuthTokenId))
                    {
                        actionContext.Response = new HttpResponseMessage(HttpStatusCode.Unauthorized);
                    }
                    if (token.ExpiryDate < DateTime.Now)
                    {
                        actionContext.Response = new HttpResponseMessage(HttpStatusCode.Unauthorized);
                    }
                }
                catch (Exception ex)
                {
                    actionContext.Response = new HttpResponseMessage(HttpStatusCode.Unauthorized);
                }
                base.OnAuthorization(actionContext);
            }

            public bool validatetoken(string token)
            {
                string path = AppDomain.CurrentDomain.BaseDirectory + "TokenStore.txt"; // Define file path
                bool istokenvalid = false;

                string content;
                using (StreamReader reader = new StreamReader(path))
                {
                    content = reader.ReadToEnd(); // Read entire file
                }
                if (content.Contains(token))
                {
                    istokenvalid = true;
                }

                return istokenvalid;
            }




        }


        [AuthorizationFilter][HttpGet, ActionName("GetPolycetAcademicYear")]
        public HttpResponseMessage GetPolycetAcademicYear()
        {
            try
            {
                var dbHandler = new dbHandler();
                string StrQuery = "";
                StrQuery = "exec USP_Affiliation_GET_Poly_Acayr";
                var dt = dbHandler.ReturnDataSet(StrQuery);               
                HttpResponseMessage response = Request.CreateResponse(HttpStatusCode.OK, dt.Tables[0]);
                return response;
            }
            catch (Exception ex)
            {
                HttpResponseMessage response = Request.CreateResponse(HttpStatusCode.OK, ex.Message);
                return response;
            }
        }

        [AuthorizationFilter][HttpGet, ActionName("GetExamcenterInfo")]
        public HttpResponseMessage GetExamcenterInfo(string AcademicYear, int type, int Value)
        {

            using (HttpClient client = new HttpClient())
            {
                try
                {

                    var dbHandler = new dbHandler();
                    var param = new SqlParameter[3];
                    param[0] = new SqlParameter("@AcademicYear", AcademicYear);
                    param[1] = new SqlParameter("@Type", type);
                    param[2] = new SqlParameter("@Value", Value);
                    var dt = dbHandler.ReturnDataWithStoredProcedureTable("USP_Poly_CentersInfo", param);
                    HttpResponseMessage response = Request.CreateResponse(HttpStatusCode.OK, dt);
                    return response;

                }
                catch (Exception ex)
                {
                    HttpResponseMessage response = Request.CreateResponse(HttpStatusCode.OK, ex.Message);
                    return response;

                }
            }
        }
    }
}
