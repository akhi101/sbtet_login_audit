using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.IO;
using System.Linq;
using System.Net.Http;
using System.Net;
using System.Text;
using System.Threading.Tasks;
using System.Web.Http;
using System.Web.Http.Controllers;
using System.Web.Http.Filters;
using Newtonsoft.Json;
using SoftwareSuite.Models.Database;
using SoftwareSuite.Models.Security;

namespace SoftwareSuite.Services.Admission
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
        [AuthorizationFilter]
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

    public class AdmissionService
    {

        //new AdmissionReport sp
        [AuthorizationFilter]
        public DataSet GetDataForAdmissionDashboard(dbHandler dbhandler, string CollegeCode, int UserId, int AcademicYearId)
        {
            try
            {

                var param = new SqlParameter[3];
                param[0] = new SqlParameter("@CollegeCode", CollegeCode);
                param[1] = new SqlParameter("@UserId", UserId);
                param[2] = new SqlParameter("@AcademicYearId", AcademicYearId);
                return dbhandler.ReturnDataWithStoredProcedure("USP_Admission_GET_DashBoradReports_old", param);
            }
            catch (Exception ex)
            {
                dbHandler.SaveErorr("USP_Admission_GET_DashBoradReports_old", 0, ex.Message);
                throw ex;
            }
        }

        //public DataSet GetDataForAdmissionDashboard(dbHandler dbhandler, int UserId, string CollegeId, int AcademicYearId)
        //{
        //    try
        //    {
        //        var param = new SqlParameter[3];
        //        param[0] = new SqlParameter("@UserId", UserId);
        //        param[1] = new SqlParameter("@CollegeCode", CollegeId);
        //        param[2] = new SqlParameter("@AcademicYear_Id", AcademicYearId);
        //        return dbhandler.ReturnDataWithStoredProcedure("usp_GetDataForAdmissionDashboard", param);
        //    }
        //    catch (Exception ex)
        //    {
        //        dbHandler.SaveErorr("usp_GetDataForAdmissionDashboard", 0, ex.Message);
        //        throw ex;
        //    }
        //}
        [AuthorizationFilter]
        public DataSet GetCollegesSchemeSemInfo()
        {
            try
            {
                var dbHandler = new dbHandler();
                string StrQuery = "";
                StrQuery = "exec usp_Get_Colleges_SCHEME_SEM_INFO";
                return dbHandler.ReturnDataSet(StrQuery);
            }
            catch (Exception ex)
            {
                dbHandler.SaveErorr("usp_Get_Colleges_SCHEME_SEM_INFO", 0, ex.Message);
                throw ex;
            }
        }
        [AuthorizationFilter]
        public DataSet GetAcademicYearsActive()
        {
            try
            {
                var dbHandler = new dbHandler();
                string StrQuery = "";
                StrQuery = "exec USP_GetAcademicYearsActive";
                return dbHandler.ReturnDataSet(StrQuery);
            }
            catch (Exception ex)
            {
                dbHandler.SaveErorr("USP_GetAcademicYearsActive", 0, ex.Message);
                throw ex;
            }
        }



    }
}
