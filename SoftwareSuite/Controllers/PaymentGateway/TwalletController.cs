using System;
using System.Collections.Generic;
using System.Configuration;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web;
using System.Web.Http;
using SoftwareSuite.Models.Security;
using System.Web.Http.Controllers;
using System.Web.Http.Filters;
using Newtonsoft.Json;

namespace SoftwareSuite.Controllers.PaymentGateway
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

    public class TwalletController : ApiController
    {
        #region GetMethod
        [AuthorizationFilter][HttpGet, ActionName("getCipherRequest")]
        public HttpResponseMessage getCipherRequest(string Callbackurl, string addInfo1, string addInfo2, string addInfo3, string addInfo4, string chalanaNo, string amount)
        {

            try
            {
               var agencycode = ConfigurationManager.AppSettings["agencycode"];
               var agencyName = ConfigurationManager.AppSettings["agencyName"].ToString();
                SoftwareSuite.Models.Security.TwalletCrypt CheckSum = new SoftwareSuite.Models.Security.TwalletCrypt();
                var hash = CheckSum.RequestCipher(Callbackurl, agencycode, agencyName, addInfo1, addInfo2, addInfo3, addInfo4, chalanaNo, amount);
                HttpResponseMessage response = Request.CreateResponse(HttpStatusCode.OK, hash);
                return response;
            }
            catch (Exception ex)
            {
                HttpResponseMessage response = Request.CreateResponse(HttpStatusCode.InternalServerError, ex.Message);
                return response;
            }

        }
        #endregion
    }
}
