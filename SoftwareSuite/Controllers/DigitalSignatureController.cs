using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.IO;
using System.Linq;
using System.Net.Http;
using System.Net;
using System.Web;
using System.Web.Http;
using System.Web.Http.Controllers;
using System.Web.Http.Filters;
using System.Web.Mvc;
using Newtonsoft.Json;
using SoftwareSuite.Models.Database;
using SoftwareSuite.Models.Security;
using ActionNameAttribute = System.Web.Mvc.ActionNameAttribute;
using HttpGetAttribute = System.Web.Mvc.HttpGetAttribute;
using HttpPostAttribute = System.Web.Mvc.HttpPostAttribute;

namespace SoftwareSuite.Controllers
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

    public class DigitalSignatureController : BaseController
    {
        #region
        public class SaveDigitalSignatureReq
        {
            public string SerialNumber { get; set; }
            public string Subject { get; set; }
            public string NotBefore { get; set; }
            public string NotAfter { get; set; }
        }
        #endregion

        [AuthorizationFilter][HttpGet, ActionName("SaveDigitalSignature")]
        public string SaveDigitalSignature([FromBody] SaveDigitalSignatureReq req)
        {
            try
            {
                var db = new dbHandler();
                var par = new SqlParameter[6];
                par[0] = new SqlParameter("@UserId", System.Data.SqlDbType.Int);
                par[0].Value = token.UserId;
                par[1] = new SqlParameter("@SerialNumber", System.Data.SqlDbType.VarChar, 500);
                par[1].Value = req.SerialNumber;
                par[2] = new SqlParameter("@Subject", System.Data.SqlDbType.VarChar, -1);
                par[2].Value = req.Subject;
                par[3] = new SqlParameter("@NotBefore", System.Data.SqlDbType.VarChar, 500);
                par[3].Value = req.NotBefore;
                par[4] = new SqlParameter("@NotAfter", System.Data.SqlDbType.VarChar, 500);
                par[4].Value = req.NotAfter;
                par[5] = new SqlParameter("@IsActive", System.Data.SqlDbType.Bit);
                par[5].Value = 0;
                db.ReturnDataWithStoredProcedure("usp_SBP_DSC_SET_Certificate", par);
                return "Certificate Linked";
            }
            catch (Exception ex)
            {
                //dbHandler.SaveErorr("DigitalSignatureController", token.UserId, ex.Message);
                return "Certificate Link Failed";
            }
        }

        [HttpGet]
        public string GetDigitalSignatures()
        {
            var db = new dbHandler();
            var par = new SqlParameter[1];
            par[0] = new SqlParameter("@UserId", token.UserId);
            var ds = db.ReturnDataWithStoredProcedure("usp_SBP_DSC_GET_Certificate", par);
            return JsonConvert.SerializeObject(ds.Tables[0]);
        }
    }
}
