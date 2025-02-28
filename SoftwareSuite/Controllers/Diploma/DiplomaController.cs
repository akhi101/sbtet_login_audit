using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web;
using System.Web.Http;
using System.Web.Http.Controllers;
using System.Web.Http.Filters;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using SoftwareSuite.Models.Database;
using SoftwareSuite.Models.Security;

namespace SoftwareSuite.Controllers.ExternalServices
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

    public class DiplomaController : ApiController
    {
        //USP_SS_GET_InteriamCertificateDetails
        [AuthorizationFilter][HttpGet, ActionName("GetDiplomaStudentDetails")]
        public HttpResponseMessage GetDiplomaStudentDetails(HttpRequestMessage request)    //int ExamMonthYearId, int StudentTypeId, string CollegeCode, string ExamDate, int ExamTypeId)
        {

            try
            {
                var apikey = request.Headers.GetValues("apiKey").FirstOrDefault();
                var apikeyOrig = ConfigurationManager.AppSettings["DiplomaDataSharingApiKey"].ToString();
                if (apikey != apikeyOrig)
                {
                    var response = Request.CreateResponse(HttpStatusCode.Forbidden);
                    response.Content = new StringContent(JsonConvert.SerializeObject("{\"respcode\":\"403\",\"respdesc\" = \"Invalid Api Key\"\" }"), System.Text.Encoding.UTF8, "application/json");

                    return response;
                }
            }
            catch (Exception)
            {
                var response = Request.CreateResponse(HttpStatusCode.Forbidden);
                response.Content = new StringContent(JsonConvert.SerializeObject("{\"respcode\":\"403\",\"respdesc\" = \"Invalid Api Key\"\" }"), System.Text.Encoding.UTF8, "application/json");
                return response;
            }

            try
            {

                IDictionary<string, string> queryParams = request.GetQueryNameValuePairs().ToDictionary(x => x.Key, x => x.Value);
                var dbHandler = new dbHandler();
                var param = new SqlParameter[1];
                param[0] = new SqlParameter("@pin", (queryParams["pin"]).ToString());
                DataSet ds = dbHandler.ReturnDataWithStoredProcedure("USP_SS_GET_DiplomaPassedDetails", param);
                HttpResponseMessage response = Request.CreateResponse(HttpStatusCode.OK, ds);
                return response;
            }
            catch (Exception ex)
            {
                dbHandler.SaveErorr("USP_SS_GET_DiplomaPassedDetails", 0, ex.Message);
                var retMsg = "{\"status\":\"400\",\"statusdesc\": \"" + ex.Message + "\"}";
                return Request.CreateResponse(HttpStatusCode.OK, retMsg);
            }
        }

        [AuthorizationFilter][HttpGet, ActionName("GetDiplomaAllStudentDetails")]
        public HttpResponseMessage GetDiplomaAllStudentDetails(HttpRequestMessage request)    //int ExamMonthYearId, int StudentTypeId, string CollegeCode, string ExamDate, int ExamTypeId)
        {

            try
            {
                var apikey = request.Headers.GetValues("apiKey").FirstOrDefault();
                var apikeyOrig = ConfigurationManager.AppSettings["AllDiplomaDataSharingApiKey"].ToString();
                if (apikey != apikeyOrig)
                {
                    var response = Request.CreateResponse(HttpStatusCode.Forbidden);
                    response.Content = new StringContent(JsonConvert.SerializeObject("{\"respcode\":\"403\",\"respdesc\" = \"Invalid Api Key\"\" }"), System.Text.Encoding.UTF8, "application/json");

                    return response;
                }
            }
            catch (Exception)
            {
                var response = Request.CreateResponse(HttpStatusCode.Forbidden);
                response.Content = new StringContent(JsonConvert.SerializeObject("{\"respcode\":\"403\",\"respdesc\" = \"Invalid Api Key\"\" }"), System.Text.Encoding.UTF8, "application/json");
                return response;
            }

            try
            {

                IDictionary<string, string> queryParams = request.GetQueryNameValuePairs().ToDictionary(x => x.Key, x => x.Value);
                var dbHandler = new dbHandler();
                var param = new SqlParameter[1];
                param[0] = new SqlParameter("@pin", (queryParams["pin"]).ToString());
                DataSet ds = dbHandler.ReturnDataWithStoredProcedure("USP_SS_GET_DiplomaStudentDetails", param);
                HttpResponseMessage response = Request.CreateResponse(HttpStatusCode.OK, ds);
                return response;
            }
            catch (Exception ex)
            {
                dbHandler.SaveErorr("USP_SS_GET_DiplomaStudentDetails", 0, ex.Message);
                var retMsg = "{\"status\":\"400\",\"statusdesc\": \"" + ex.Message + "\"}";
                return Request.CreateResponse(HttpStatusCode.OK, retMsg);
            }
        }
        //    public class DiplomaController : Controller
        //{
        //    // GET: Diploma
        //    public ActionResult Index()
        //    {
        //        return View();
        //    }
        //}
    }
}
