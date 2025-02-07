using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Web.Mvc;
using SoftwareSuite.Models.Security;
using Org.BouncyCastle.Ocsp;
using SoftwareSuite.Controllers.SystemAdministration;

namespace SoftwareSuite.Controllers
{
    public class BaseController : Controller
    {
        protected AuthToken token = null;
        //protected refreshAuthToken refreshtoken = null;

        protected override void OnActionExecuting(ActionExecutingContext ctx)
        {
            try
            {

                var tokenStr = ctx.HttpContext.Request.Headers.Get("token");
                var t = tokenStr.Split(new string[] { "$$@@$$" }, StringSplitOptions.None);
                tokenStr = t[0];
                token = JsonConvert.DeserializeObject<AuthToken>(new HbCrypt().Decrypt(tokenStr));
                if (token.ExpiryDate < DateTime.Now)
                {
                    ctx.Result = new HttpStatusCodeResult(HttpStatusCode.Unauthorized, "Not Authorised");
                }
            }
            catch (Exception ex)
            {
                ctx.Result = new HttpStatusCodeResult(HttpStatusCode.BadRequest, "Invalid Authentication Token");
            }
            base.OnActionExecuting(ctx);
        }


        //protected override  ActionResult  OnActionExecuted(ActionExecutedContext ctx)
        //{
        //    try
        //    {

        //        var tokenStr = ctx.HttpContext.Request.Headers.Get("token");
        //        var refreshtokenStr = ctx.HttpContext.Request.Headers.Get("refreshToken");
        //        var t = tokenStr.Split(new string[] { "$$@@$$" }, StringSplitOptions.None);
        //        refreshtoken = JsonConvert.DeserializeObject<refreshAuthToken>(new HbCrypt().Decrypt(refreshtokenStr));
        //        refreshAuthToken s = new refreshAuthToken { Token = tokenStr, isTokenValid = true, TokenExpiryDate = DateTime.Now.AddMinutes(10) };
        //        ActionResult reftoken = JsonConvert.SerializeObject( new HbCrypt().Encrypt(s));
        //        return ContentResult(reftoken);

        //    }
        //    catch (Exception ex)
        //    {
        //        ctx.Result = new HttpStatusCodeResult(HttpStatusCode.BadRequest, "Invalid Authentication Token");
        //    }
        //    base.OnActionExecuted(ctx);
        //}



    }
}
