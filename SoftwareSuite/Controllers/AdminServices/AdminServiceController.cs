﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Data.SqlClient;
using SoftwareSuite.Models.Database;
using System.Web.Script.Serialization;
using System.Diagnostics;
using Newtonsoft.Json;
using RestSharp;
using System.Web;
using SoftwareSuite.Models;
using System.IO;
using SoftwareSuite.Models.Assessment;
using System.Configuration;
using System.Timers;
using System.Drawing;
using System.Drawing.Imaging;
using System.Text.RegularExpressions;
using SoftwareSuite.Models.Security;
using SoftwareSuite.Controllers.PreExamination;
using SoftwareSuite.Controllers.Results;
using System.Web.Http.Filters;
using System.Web.Http.Controllers;
using Microsoft.AspNetCore.StaticFiles;
using static SoftwareSuite.Controllers.Admission.AdmissionController;
using SoftwareSuite.Controllers.SystemAdministration;
using SoftwareSuite.BLL;
using System.Net.Http.Headers;
using System.Reflection;
using System.Web.UI.WebControls;
using DocumentFormat.OpenXml.Office.CustomXsn;
using System.Threading.Tasks;
using static System.Windows.Forms.VisualStyles.VisualStyleElement.StartPanel;
using System.Text;
using System.Security.Cryptography;

namespace SoftwareSuite.Controllers.AdminServices
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
                token = JsonConvert.DeserializeObject<AuthToken>(new HbCrypt(t[1]).Decrypt(parsedToken));
                if (token.ExpiryDate < DateTime.Now)
                {
                    actionContext.Response = new HttpResponseMessage(HttpStatusCode.Unauthorized);
                    // ctx.Result = new HttpStatusCodeResult(HttpStatusCode.Unauthorized, "Not Authorised");
                }
            }
            catch (Exception ex)
            {
                actionContext.Response = new HttpResponseMessage(HttpStatusCode.Unauthorized);
                // ctx.Result = new HttpStatusCodeResult(HttpStatusCode.BadRequest, "Invalid Authentication Token");
            }
            base.OnAuthorization(actionContext);
        }


    }

    public class AdminServiceController : ApiController
    {

        [HttpPost, ActionName("PostMarksEntryDates")]
        public string PostMarksEntryDates([FromBody] SetDatesMarksEntryreqdata ReqData)
        {
            try
            {
                string clientIpAddress = System.Web.HttpContext.Current.Request.UserHostAddress;
                var dbHandler = new dbHandler();
                var param = new SqlParameter[12];
                param[0] = new SqlParameter("@examid", ReqData.examId);
                param[1] = new SqlParameter("@semid", ReqData.semid);
                param[2] = new SqlParameter("@AcademicYearId", ReqData.AcademicYearId);
                param[3] = new SqlParameter("@username", ReqData.userName);
                param[4] = new SqlParameter("@fromdate", ReqData.fromDate);
                param[5] = new SqlParameter("@todate", ReqData.toDate);
                param[6] = new SqlParameter("@finedate", ReqData.fineDate);
                param[7] = new SqlParameter("@ipaddress", clientIpAddress);
                param[8] = new SqlParameter("@fine", ReqData.fine);
                param[9] = new SqlParameter("@studenttypeid", ReqData.Studenttypeid);
                param[10] = new SqlParameter("@schemeid", ReqData.schemeid);
                param[11] = new SqlParameter("@ExamMonthYearId", ReqData.ExamMonthYearId);
                var dt = dbHandler.ReturnDataWithStoredProcedure("USP_SET_EXAM_DATES", param);
                return JsonConvert.SerializeObject(dt);
            }
            catch (Exception ex)
            {

                dbHandler.SaveErorr("USP_SET_EXAM_DATES", 0, ex.Message);
                return ex.Message;

            }

        }

        [HttpGet, ActionName("GetAllCourses")]
        public HttpResponseMessage GetAllCourses()
        {
            try
            {
                var dbHandler = new dbHandler();
                string StrQuery = "";
                StrQuery = "exec USP_GET_BranchMasterAndGradeMaster";
                return Request.CreateResponse(HttpStatusCode.OK, dbHandler.ReturnDataSet(StrQuery));
            }
            catch (Exception ex)
            {
                dbHandler.SaveErorr("USP_GET_BranchMasterAndGradeMaster", 0, ex.Message);
                return Request.CreateResponse(HttpStatusCode.InternalServerError, ex.Message);
            }
        }

        [HttpPost, ActionName("GetCaptchaString")]
        public string GetCaptchaString(JsonObject data)
        {
            var dbHandler = new dbHandler();
            try
            {
                string strCaptchaString = "";
                int intZero = '0';
                int intNine = '9';
                int intA = 'A';
                int intZ = 'Z';
                int intsma = 'a';
                int intsmz = 'z';
                int intCount = 0;
                int intRandomNumber = 0;

                Random random = new Random(System.DateTime.Now.Millisecond);

                while (intCount < 6)
                {
                    intRandomNumber = random.Next(intZero, intsmz);
                    if (((intRandomNumber >= intZero) && (intRandomNumber <= intNine)) || ((intRandomNumber >= intA) && (intRandomNumber <= intZ)) || ((intRandomNumber >= intsma) && (intRandomNumber <= intsmz)))
                    {
                        strCaptchaString = strCaptchaString + (char)intRandomNumber;
                        intCount = intCount + 1;
                    }
                }
                string decryptsessionid = null;
                if (data["SessionId"].ToString().Length > 10)
                {
                    string encriptedsessionid = "";

                    var res = data["SessionId"].ToString().Split(new string[] { "$$@@$$" }, StringSplitOptions.None);
                    var crypt = new HbCrypt(res[1]);
                    var sessionencrypt = new HbCrypt();

                    //long CellNo = Convert.ToInt64(crypt.AesDecrypt(res[1]));
                    string sessionid = crypt.AesDecrypt(res[0]);
                    decryptsessionid = sessionencrypt.AesDecrypt(sessionid);
                }
                else
                {
                    decryptsessionid = data["SessionId"].ToString();
                }

                SetSessionId(decryptsessionid, strCaptchaString);
                var skyblue = System.Drawing.ColorTranslator.FromHtml("#1F497D");
                //var white = System.Drawing.ColorTranslator.FromHtml("linear-gradient(90deg, rgba(237,245,255,1) 0%, rgba(204,223,247,1) 100%)");
                string str = ConvertTextToImage(strCaptchaString, "sans-serif", 35, Color.White, skyblue, 250, 65).ToString();

                List<person> p = new List<person>();
                person p1 = new person();

                p1.Image = str;
                //p1.Text = strCaptchaString;
                p.Add(p1);

                return JsonConvert.SerializeObject(p);
            }
            catch (Exception ex)
            {
                dbHandler.SaveErorr("USP_SET_ReleaseTcPin", 0, ex.Message);
                return ex.Message;
            }
        }


        [HttpPost, ActionName("ValidateCaptcha")]
        public string ValidateCaptcha(JsonObject data)
        {
            var dbHandler = new dbHandler();
            List<Output> p = new List<Output>();
            Output p1 = new Output();
            var captcha = string.Empty;
            try
            {
                var res = data["SessionId"].ToString().Split(new string[] { "$$@@$$" }, StringSplitOptions.None);
                var crypt = new HbCrypt(res[1]);
                var encrypt = new HbCrypt();
                string sessionid = crypt.AesDecrypt(res[0]);
                string decryptsessionid = encrypt.AesDecrypt(sessionid);

                var res1 = data["Captcha"].ToString().Split(new string[] { "$$@@$$" }, StringSplitOptions.None);
                var crypt1 = new HbCrypt(res1[1]);
                var encrypt1 = new HbCrypt();
                string Captcha = crypt1.AesDecrypt(res1[0]);
                string decryptCaptcha = encrypt1.AesDecrypt(Captcha);

                var param = new SqlParameter[2];
                param[0] = new SqlParameter("@SessionId", decryptsessionid);
                param[1] = new SqlParameter("@Captcha", decryptCaptcha);
                var dt = dbHandler.ReturnDataWithStoredProcedureTable("USP_GET_ExamsCaptchaSessionLog", param);

                if (dt.Rows[0]["ResponseCode"].ToString() == "200")
                {
                    captcha = GetCaptchaString(data);
                    p1.ResponceCode = dt.Rows[0]["ResponseCode"].ToString();
                    p1.ResponceDescription = dt.Rows[0]["ResponseDescription"].ToString();
                    p1.Captcha = captcha;
                    p.Add(p1);
                    return JsonConvert.SerializeObject(p);

                }
                else
                {
                    captcha = GetCaptchaString(data);
                    p1.ResponceCode = "400";
                    p1.ResponceDescription = dt.Rows[0]["ResponseDescription"].ToString();
                    p1.Captcha = captcha;
                    p.Add(p1);
                    return JsonConvert.SerializeObject(p);
                }

            }
            catch (Exception ex)
            {
                dbHandler.SaveErorr("USP_GET_ExamsCaptchaSessionLog", 0, ex.Message);
                captcha = GetCaptchaString(data);
                p1.ResponceCode = "400";
                p1.ResponceDescription = ex.Message;
                p1.Captcha = captcha;
                p.Add(p1);
                return JsonConvert.SerializeObject(p);
                //return ex.Message;
            }
        }

        public class ForgetPasswordRequest
        {
            public string LoginName { get; set; }
            public string CellNo { get; set; }
        }
        [HttpPost, ActionName("ValidateForgetPasswordCaptcha")]
        public string ValidateForgetPasswordCaptcha(JsonObject data)
        {
            var dbHandler = new dbHandler();
            List<Output> p = new List<Output>();
            Output p1 = new Output();
            var captcha = string.Empty;
            try
            {
                //var res = data["SessionId"].ToString().Split(new string[] { "$$@@$$" }, StringSplitOptions.None);
                //var crypt = new HbCrypt(res[1]);
                //var encrypt = new HbCrypt();
                //string sessionid = crypt.AesDecrypt(res[0]);
                //string decryptsessionid = encrypt.AesDecrypt(sessionid);

                //var res1 = data["Captcha"].ToString().Split(new string[] { "$$@@$$" }, StringSplitOptions.None);
                //var crypt1 = new HbCrypt(res1[1]);
                //var encrypt1 = new HbCrypt();
                //string Captcha = crypt1.AesDecrypt(res1[0]);
                //string decryptCaptcha = encrypt1.AesDecrypt(Captcha);


                string decryptsessionid = GetDecryptedData(data["SessionId"].ToString());
                string decryptCaptcha = GetDecryptedData(data["Captcha"].ToString());
                string decryptLoginname = GetDecryptedData(data["LoginName"].ToString());
                string decryptCell = GetDecryptedData(data["CellNo"].ToString());

                var param = new SqlParameter[2];
                param[0] = new SqlParameter("@SessionId", decryptsessionid);
                param[1] = new SqlParameter("@Captcha", decryptCaptcha);
                var dt = dbHandler.ReturnDataWithStoredProcedureTable("USP_GET_ExamsCaptchaSessionLog", param);

                if (dt.Rows[0]["ResponseCode"].ToString() == "200")
                {
                    //SystemUserBLL sysbll = new SystemUserBLL();
                    //p1.Data = sysbll.GetForgetPassword(decryptLoginname, decryptCell);

                    SystemUserBLL SystemUserBLL = new SystemUserBLL();
                    SystemRes ForgetRes = new SystemRes();
                    var passcrypt = new HbCrypt();
                    ForgetRes = SystemUserBLL.GetForgetPassword(decryptLoginname.Replace("'", "''"), Int64.Parse(decryptCell));
                    string retMsg = string.Empty;
                    if (ForgetRes.ResponceCode == "200" && ForgetRes.userType == "sbtet")
                    {
                        try
                        {
                            string decryptpassword = passcrypt.Decrypt(ForgetRes.Password);


                            SMSServiceController smsService = new SMSServiceController();
                            string SMSCount = smsService.SendSMS(decryptCell.ToString());
                            if (SMSCount != "{\"Status\" : \"200\", \"Description\" : \"SMS sent successfully.\"}")
                            {
                                return SMSCount;
                            }
                            else
                            {
                                string url = ConfigurationManager.AppSettings["SMS_API"].ToString();
                                string Msg = "SBTET Portal Login Credentials, UserName = {0}, Password = {1}, Secretary,SBTET TS.";
                                var Message = string.Format(Msg, decryptLoginname.Replace("'", "''"), decryptpassword);
                                string urlParameters = "?mobile=" + decryptCell + "&message=" + HttpUtility.UrlEncode(Message) + "&templateid=1007161786891783450";
                                HttpClient client = new HttpClient();
                                client.BaseAddress = new Uri(url);
                                client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
                                HttpResponseMessage response = client.GetAsync(urlParameters).Result;
                                retMsg = "{\"Status\":\"" + ForgetRes.ResponceCode + "\",\"Description\": \"" + ForgetRes.ResponceDescription + "\"}";
                                return retMsg;
                            }




                            //retMsg = "{\"status\":\"" + ForgetRes.ResponceCode + "\",\"statusdesc\": \"" + ForgetRes.ResponceDescription + "\"}";

                        }
                        catch (Exception ex)
                        {
                            retMsg = "{\"Status\":\"400\",\"Description\": \"" + ex.Message + "\"}";
                            return retMsg;
                        }
                    }
                    else if (ForgetRes.ResponceCode == "200" && ForgetRes.userType == "twsh")
                    {
                        try
                        {
                            // string decryptpassword = passcrypt.Decrypt(ForgetRes.Password);
                            string url = ConfigurationManager.AppSettings["SMS_API"].ToString();
                            //string smsusername = ConfigurationManager.AppSettings["SMS_Service_Username"].ToString();
                            //string smspassword = ConfigurationManager.AppSettings["SMS_Service_Password"].ToString();
                            string Msg = "SBTET Portal Login Credentials, UserName = {0}, Password = {1}, Secretary,SBTET TS.";
                            var Message = string.Format(Msg, decryptLoginname.Replace("'", "''"), ForgetRes.Password);
                            string urlParameters = "?mobile=" + decryptCell + "&message=" + HttpUtility.UrlEncode(Message) + "&templateid=1007161786891783450";
                            HttpClient client = new HttpClient();
                            client.BaseAddress = new Uri(url);
                            client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
                            HttpResponseMessage response = client.GetAsync(urlParameters).Result;
                            retMsg = "{\"Status\":\"" + ForgetRes.ResponceCode + "\",\"statusdesc\": \"" + ForgetRes.ResponceDescription + "\"}";
                            return retMsg;
                        }
                        catch (Exception ex)
                        {
                            retMsg = "{\"Status\":\"400\",\"Description\": \"" + ex.Message + "\"}";
                            return retMsg;

                        }
                    }
                    else
                    {
                        retMsg = "{\"Status\":\"" + ForgetRes.ResponceCode + "\",\"Description\": \"" + ForgetRes.ResponceDescription + "\"}";
                        return retMsg;

                    }

                }
                else
                {
                    captcha = GetCaptchaString(data);
                    p1.ResponceCode = "400";
                    p1.ResponceDescription = dt.Rows[0]["ResponseDescription"].ToString();
                    p1.Captcha = captcha;
                    p.Add(p1);
                    return JsonConvert.SerializeObject(p);
                }

            }
            catch (Exception ex)
            {
                dbHandler.SaveErorr("USP_GET_ExamsCaptchaSessionLog", 0, ex.Message);
                captcha = GetCaptchaString(data);
                p1.ResponceCode = "400";
                p1.ResponceDescription = ex.Message;
                p1.Captcha = captcha;
                p.Add(p1);
                return JsonConvert.SerializeObject(p);
                //return ex.Message;
            }
        }

        public class LoginCaptchaDetails{

            public string Session { get; set; }
            public string DataType { get; set; }
            public string SessionID { get; set; }
            public string Captcha { get; set; }
            public string LoginName { get; set; }
            public string Password { get; set; }
        }

        private static int loginAttempts = 0; // Ensure it's a static variable for tracking across requests
        private static bool loginLocked = false;
        private static readonly object lockObj = new object(); // Object for thread safety

        private async Task ResetLoginAttempts()
        {
            await Task.Delay(1 * 60 * 1000); // 1-minute delay
            lock (lockObj)  // Lock to prevent race condition
            {
                loginAttempts = 0;
                loginLocked = false;
            }
        }

        public void AddTokenToStore(string Message)
        {
            try
            {
                String str = AppDomain.CurrentDomain.BaseDirectory + "TokenStore.txt";
                using (System.IO.StreamWriter file = new System.IO.StreamWriter(str, true))
                {
                    try
                    {
                        //file.WriteLine(System.DateTime.Now.ToString());
                        file.WriteLine(Message);
                        file.WriteLine("");
                    }
                    catch (Exception ex)
                    {

                    }
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }

        }

        // Method to generate a secure salt
        public static byte[] GenerateSalt(int size = 16)
        {
            var salt = new byte[size];
            using (var rng = new RNGCryptoServiceProvider())
            {
                rng.GetBytes(salt);
            }
            return salt;
        }


        // Method to hash data with salt using SHA256
        public static byte[] HashWithSalt(string data, byte[] salt)
        {
            using (var sha256 = SHA256.Create())
            {
                // Combine data and salt
                var dataBytes = Encoding.UTF8.GetBytes(data);
                var dataWithSalt = new byte[dataBytes.Length + salt.Length];
                Buffer.BlockCopy(dataBytes, 0, dataWithSalt, 0, dataBytes.Length);
                Buffer.BlockCopy(salt, 0, dataWithSalt, dataBytes.Length, salt.Length);

                // Compute hash
                return sha256.ComputeHash(dataWithSalt);
            }
        }

        // Method to validate the password
        public static bool ValidatePassword(string enteredPassword, byte[] storedSalt, byte[] storedHash)
        {
            byte[] enteredHash = HashWithSalt(enteredPassword, storedSalt);
            return CompareByteArrays(enteredHash, storedHash);
        }


        // Helper method to compare byte arrays
        private static bool CompareByteArrays(byte[] a, byte[] b)
        {
            if (a.Length != b.Length) return false;

            for (int i = 0; i < a.Length; i++)
            {
                if (a[i] != b[i]) return false;
            }
            return true;
        }

        public static void StorePassword(string password, out byte[] salt, out byte[] hashedPassword)
        {
            salt = GenerateSalt(); // Generate salt only during password setup
            hashedPassword = HashWithSalt(password, salt);
        }

        [HttpPost, ActionName("ValidateUserLoginCaptcha")]
        public async Task<HttpResponseMessage> ValidateUserLoginCaptcha([FromBody] LoginCaptchaDetails ReqData)
        {
            bool loginFailed = false;
            var dbHandler = new dbHandler();
            List<Output> p = new List<Output>();
            Output p1 = new Output();
            var captcha = string.Empty;

            try
            {



                string loginLock = loginLocked ? "Yes" : "No";
                string islock = "loginLock";
                string lockkey = "iT9/CmEpJz5Z1mkXZ9CeKXpHpdbG0a6XY0Fj1WblmZA="; // AES-256 key
                string lockiv = "u4I0j3AQrwJnYHkgQFwVNw==";     // AES IV
                string isLocked = Encryption.Encrypt(islock, lockkey, lockiv);

                string DataType = "1482cS+YzslJtmNjRWaaRgEVGBuxXXnqhU5WaptbY14kryoQ6HfnRxJgnmKWzqRBfp9RORS/dwlutMR6IA+Qlaf0Io2Ao7cfL1UJ0/hja+jkZ6C5GyuzEy6ZDzxEGX4CBXn9taRmDr0JYogxBWJT8Q==$$@@$$zkdrgkjzna";

                string UserAccountStatus = AddorGetAccountStatus(DataType, ReqData.LoginName);

                var users = JsonConvert.DeserializeObject<List<Dictionary<string, object>>>(UserAccountStatus);

                string AccountLocked= users[0]["AccountLocked"].ToString();
                if (loginLock == "Yes" && AccountLocked=="true")
                {
                    string message = "Account is temporarily locked. Try again later.";
                    string key = "iT9/CmEpJz5Z1mkXZ9CeKXpHpdbG0a6XY0Fj1WblmZA="; // AES-256 key
                    string iv = "u4I0j3AQrwJnYHkgQFwVNw==";     // AES IV
                    string MESSAGE = Encryption.Encrypt(message, key, iv);
                    return Request.CreateResponse(HttpStatusCode.OK, new { MESSAGE, isLocked });
                }
                string token = "";



                string decryptsession = GetDecryptedData(ReqData.Session);
                string decryptCaptcha = GetDecryptedData(ReqData.Captcha);
                string decryptLoginname = GetDecryptedData(ReqData.LoginName);
                string decryptpassword = GetDecryptedData(ReqData.Password);

 


                var crypt = new HbCrypt();
                string encrypassword = crypt.Encrypt(decryptpassword);


                var param = new SqlParameter[2];
                param[0] = new SqlParameter("@SessionId", decryptsession);
                param[1] = new SqlParameter("@Captcha", decryptCaptcha);
                var dt = dbHandler.ReturnDataWithStoredProcedureTable("USP_GET_ExamsCaptchaSessionLog", param);

                if (dt.Rows[0]["ResponseCode"].ToString() == "200")
                {
                    var hbcrypt = new HbCrypt();
                    string clientIpAddress = System.Web.HttpContext.Current.Request.UserHostAddress;
                    SystemUserBLL SystemUserBLL = new SystemUserBLL();
                    SystemUserAuth User;
                    byte[] salt = GenerateSalt(); // Generate salt
                    byte[] hashedPassword = HashWithSalt(encrypassword, salt); // Hash password with salt

                    string saltBase64 = Convert.ToBase64String(salt); // Convert salt to Base64
                    string hashBase64 = Convert.ToBase64String(hashedPassword); // Convert hash to Base64
                    User = SystemUserBLL.GetUserLogin(decryptLoginname.Replace("'", "''"), clientIpAddress);
                    StringBuilder builder = new StringBuilder();
                    Random random = new Random();
                    char ch;
                    for (int i = 0; i < 10; i++)
                    {
                        ch = Convert.ToChar(Convert.ToInt32(Math.Floor(26 * random.NextDouble() + 65)));
                        builder.Append(ch);

                    }
                    AddTokenToStore(builder.ToString().ToLower());

                    if (User.SystemUser.Count > 0 && User.UserAuth[0].ResponceCode == "200")
                    {

                        var u = User.SystemUser[0];
                        var v = User.UserAuth[0];
                        string Salt = User.SystemUser[0].Salt.ToString();
                        string HashedPassword = User.SystemUser[0].UserPassword.ToString();

                        byte[] storedSalt = Convert.FromBase64String(Salt);
                        byte[] storedHash = Convert.FromBase64String(HashedPassword);

                        // Hash the entered password with the stored salt
                        byte[] enteredHash = HashWithSalt(encrypassword, storedSalt);

                        // Compare stored and computed hashes
                        bool isPasswordValid = CompareByteArrays(enteredHash, storedHash);
                        if (!isPasswordValid)
                        {
                            lock (lockObj) // Ensure thread-safe increment
                            {
                                loginAttempts++;
                            }
                            if (loginAttempts > 2)
                            {
                                lock (lockObj) { loginLocked = true; }
                                Task.Run(() => ResetLoginAttempts());
                                string message1 = "Account locked for 1 minute.";

                                string key1 = "iT9/CmEpJz5Z1mkXZ9CeKXpHpdbG0a6XY0Fj1WblmZA="; // AES-256 key
                                string iv1 = "u4I0j3AQrwJnYHkgQFwVNw==";     // AES IV
                                string MESSAGE = Encryption.Encrypt(message1, key1, iv1);
                                HttpResponseMessage response1 = Request.CreateResponse(HttpStatusCode.OK, new { MESSAGE, isLocked });
                                return response1;

                            }
                            else
                            {
                                string message = "No such username or password";
                                string key1 = "iT9/CmEpJz5Z1mkXZ9CeKXpHpdbG0a6XY0Fj1WblmZA="; // AES-256 key
                                string iv1 = "u4I0j3AQrwJnYHkgQFwVNw==";     // AES IV
                                string MESSAGE = Encryption.Encrypt(message, key1, iv1);
                                return Request.CreateResponse(HttpStatusCode.OK, new { MESSAGE });
                            }
                        }
                        else
                        {
                            lock (lockObj) { loginAttempts = 0; } // Reset login attempts on successful login
                            AuthToken t = new AuthToken
                            {
                                UserName = u.UserName ?? "",
                                UserId = u.UserId ?? "",
                                UserTypeId = u.UserTypeId ?? "",
                                CollegeId = u.CollegeId ?? "",
                                CollegeName = u.CollegeName ?? "",
                                CollegeCode = u.CollegeCode ?? "",
                                collegeType = u.collegeType ?? "",
                                BranchCode = u.BranchCode ?? "",
                                BranchId = u.BranchId ?? "",
                                ResponceCode = v.ResponceCode ?? "",
                                RespoceDescription = v.RespoceDescription ?? "",
                                ExpiryDate = DateTime.Now.AddHours(1),
                                AuthTokenId = builder.ToString().ToLower()
                            };

                            var username = u.UserName;
                            var userid = u.UserId;
                            var collegeid = u.CollegeId;
                            var collegename = u.CollegeName;
                            var usertypeid = u.UserTypeId;
                            var ccode = u.CollegeCode;
                            var ctype = u.collegeType;
                            var bcode = u.BranchCode;
                            var bid = u.BranchId;
                            var rescode = v.ResponceCode;
                            var resdesc = v.RespoceDescription;
                            var AuthTokenId = builder.ToString().ToLower();

                            string key = "iT9/CmEpJz5Z1mkXZ9CeKXpHpdbG0a6XY0Fj1WblmZA="; // AES-256 key
                            string iv = "u4I0j3AQrwJnYHkgQFwVNw==";     // AES IV

                            string USERNAME = Encryption.Encrypt(username, key, iv);
                            string USERID = Encryption.Encrypt(userid, key, iv);
                            string COLLEGEID = Encryption.Encrypt(collegeid, key, iv);
                            string CNAME = Encryption.Encrypt(collegename, key, iv);
                            string USERTYPEID = Encryption.Encrypt(usertypeid, key, iv);
                            string CCODE = Encryption.Encrypt(ccode, key, iv);
                            string CTYPE = Encryption.Encrypt(ctype, key, iv);
                            string BCODE = Encryption.Encrypt(bcode, key, iv);
                            string BID = Encryption.Encrypt(bid, key, iv);
                            string RESPONSECODE = Encryption.Encrypt(rescode, key, iv);
                            string RESDESCRIPTION = Encryption.Encrypt(resdesc, key, iv);

                            token = hbcrypt.Encrypt(JsonConvert.SerializeObject(t));
                            HttpResponseMessage response = Request.CreateResponse(HttpStatusCode.OK, new { token, USERTYPEID, USERID, USERNAME, COLLEGEID, CCODE, CTYPE, CNAME, BID, BCODE, RESPONSECODE, RESDESCRIPTION, t.ExpiryDate, clientIpAddress, AuthTokenId });
                            return response;
                        }
                    }
                    //else if (User.SystemUser.Count > 0 && User.UserAuth[0].ResponceCode == "401")
                    //{
                    //    lock (lockObj) // Ensure thread-safe increment
                    //    {
                    //        loginAttempts++;
                    //    }
                    //    if (loginAttempts > 2)
                    //    {
                    //        lock (lockObj) { loginLocked = true; }
                    //        UserAccountStatus = AddorGetAccountStatus(ReqData.DataType, ReqData.LoginName);
                    //        Task.Run(() => ResetLoginAttempts());
                    //        string message = "Account locked for 1 minute.";

                    //        string key = "iT9/CmEpJz5Z1mkXZ9CeKXpHpdbG0a6XY0Fj1WblmZA="; // AES-256 key
                    //        string iv = "u4I0j3AQrwJnYHkgQFwVNw==";     // AES IV
                    //        string MESSAGE = Encryption.Encrypt(message, key, iv);
                    //        HttpResponseMessage response = Request.CreateResponse(HttpStatusCode.OK, new { MESSAGE, isLocked });
                    //        return response;
                    //    }
                    //    else
                    //    {
                    //        string message = "No such username or password";
                    //        string key = "iT9/CmEpJz5Z1mkXZ9CeKXpHpdbG0a6XY0Fj1WblmZA="; // AES-256 key
                    //        string iv = "u4I0j3AQrwJnYHkgQFwVNw==";     // AES IV
                    //        string MESSAGE = Encryption.Encrypt(message, key, iv);
                    //        HttpResponseMessage response = Request.CreateResponse(HttpStatusCode.OK, new { MESSAGE });
                    //        return response;
                    //    }
                    //}
                    else
                    {
                        string message = "Login failed. Please try again.";
                        string key = "iT9/CmEpJz5Z1mkXZ9CeKXpHpdbG0a6XY0Fj1WblmZA="; // AES-256 key
                        string iv = "u4I0j3AQrwJnYHkgQFwVNw==";     // AES IV
                        string MESSAGE = Encryption.Encrypt(message, key, iv);
                        HttpResponseMessage response = Request.CreateResponse(HttpStatusCode.OK, new { MESSAGE });
                        return response;
                    }

                }
                else
                {
                    var message = "Invalid Captcha";

                    string key = "iT9/CmEpJz5Z1mkXZ9CeKXpHpdbG0a6XY0Fj1WblmZA="; // AES-256 key
                    string iv = "u4I0j3AQrwJnYHkgQFwVNw==";     // AES IV
                    string MESSAGE = Encryption.Encrypt(message, key, iv);
                    HttpResponseMessage response = Request.CreateResponse(HttpStatusCode.OK, new { MESSAGE });
                    return response;
                }

            }
            catch (Exception ex)
            {
                dbHandler.SaveErorr("USP_GET_ExamsCaptchaSessionLog", 0, ex.Message);
                //captcha = GetCaptchaString(data);
                p1.ResponceCode = "400";
                p1.ResponceDescription = ex.Message;
                p1.Captcha = captcha;
                p.Add(p1);
                return null;
            }
        }

        [HttpGet, ActionName("getUserLogout")]
        public void getUserLogout()
        {
            try
            {
                String str = AppDomain.CurrentDomain.BaseDirectory + "TokenStore.txt";
                if (File.Exists(str))
                {
                    File.Delete(str);
                    File.Create(str).Close(); // Creates a new empty file
                }
            }
            catch (Exception ex)
            {
            }
        }

        public class AccountStatus
        {
            public string DataType { get; set; }
            public string UserName { get; set; }

        }

        //[AuthorizationFilter()]
        [HttpPost, ActionName("AddorGetAccountStatus")]
        public string AddorGetAccountStatus(string DataType,string UserName)
        {
            try
            {


                string decrptedDataType = GetDecryptedData(DataType.ToString());
                string decrptedUserName = GetDecryptedData(UserName.ToString());
                //var tokenStr = ActionContext.Request.Headers.FirstOrDefault(h => h.Key == "token");
                //var tkn = tokenStr.Value.FirstOrDefault();
                //var t = tkn.Split(new string[] { "$$@@$$" }, StringSplitOptions.None);
                //var parsedToken = t[0];
                //var token = JsonConvert.DeserializeObject<AuthToken>(new HbCrypt(t[1]).Decrypt(parsedToken));
                var dbHandler = new dbHandler();
                var param = new SqlParameter[2];
                param[0] = new SqlParameter("@DataType", decrptedDataType);
                param[1] = new SqlParameter("@UserName", decrptedUserName);
                var dt = dbHandler.ReturnDataWithStoredProcedureTable("SP_Get_AccountStatus", param);
                return JsonConvert.SerializeObject(dt);
            }
            catch (Exception ex)
            {

                dbHandler.SaveErorr("SP_Get_AccountStatus", 0, ex.Message);
                return ex.Message;
            }
        }


        [HttpGet, ActionName("GetCaptchaString10")]
        public string GetCaptchaString10()
        {
            var dbHandler = new dbHandler();
            try
            {

                string strCaptchaString = "";
                //if (Captcha == null)
                //{

                int intZero = '0';
                int intNine = '9';
                int intA = 'A';
                int intZ = 'Z';
                int intCount = 0;
                int intRandomNumber = 0;
                //string strCaptchaString = "";

                Random random = new Random(System.DateTime.Now.Millisecond);

                while (intCount < 10)
                {
                    intRandomNumber = random.Next(intZero, intZ);
                    if (((intRandomNumber >= intZero) && (intRandomNumber <= intNine) || (intRandomNumber >= intA) && (intRandomNumber <= intZ)))
                    {
                        strCaptchaString = strCaptchaString + (char)intRandomNumber;
                        intCount = intCount + 1;
                    }
                }

                return strCaptchaString;

            }
            catch (Exception ex)
            {
                dbHandler.SaveErorr("USP_SET_ReleaseTcPin", 0, ex.Message);
                return ex.Message;
            }
        }

        [HttpGet, ActionName("SetSessionId")]
        public string SetSessionId(string SessionId, string Captcha)
        {
            var dbHandler = new dbHandler();
            try
            {

                var param = new SqlParameter[2];
                param[0] = new SqlParameter("@SessionId", SessionId);
                param[1] = new SqlParameter("@Captcha", Captcha);
                var dt = dbHandler.ReturnDataWithStoredProcedure("USP_SET_ExamsCaptchaSessionLog", param);
                return JsonConvert.SerializeObject(dt);
            }
            catch (Exception ex)
            {
                dbHandler.SaveErorr("USP_SET_ExamsCaptchaSessionLog", 0, ex.Message);
                return ex.Message;
            }
        }


        public string ConvertTextToImage(string txt, string fontname, int fontsize, Color bgcolor, Color fcolor, int width, int Height)
        {
            Bitmap bmp = new Bitmap(width, Height);
            using (Graphics graphics = Graphics.FromImage(bmp))
            {

                Font font = new Font(fontname, fontsize);
                graphics.FillRectangle(new SolidBrush(bgcolor), 0, 0, bmp.Width, bmp.Height);
                graphics.DrawString(txt, font, new SolidBrush(fcolor), 0, 0);
                graphics.Flush();
                font.Dispose();
                graphics.Dispose();


            }
            Bitmap bImage = bmp;  // Your Bitmap Image
            System.IO.MemoryStream ms = new MemoryStream();
            bImage.Save(ms, ImageFormat.Jpeg);
            byte[] byteImage = ms.ToArray();
            var SigBase64 = Convert.ToBase64String(byteImage);
            return SigBase64;

        }

        [HttpGet, ActionName("GetDecryptedData")]
        public string GetDecryptedData(string DataType)
        {
            try
            {

                var res = DataType.ToString().Split(new string[] { "$$@@$$" }, StringSplitOptions.None);
                var crypt = new HbCrypt(res[1]);
                var encrypt = new HbCrypt();
                string datatype = crypt.AesDecrypt(res[0]);
                string decryptdatatype = encrypt.AesDecrypt(datatype);
                return decryptdatatype;

            }
            catch (Exception ex)
            {
                return ex.Message;
            }
        }



        [HttpPost, ActionName("ValidateAttendenceCaptcha")]
        public string ValidateAttendenceCaptcha(JsonObject data)
        {
            var dbHandler = new dbHandler();
            List<Output> p = new List<Output>();
            Output p1 = new Output();
            var captcha = string.Empty;
            try
            {

                string SessionID = GetDecryptedData(data["SessionId"].ToString());
                string Captcha = GetDecryptedData(data["Captcha"].ToString());
                string Pin = GetDecryptedData(data["Pin"].ToString());


                var PinMatch = ValidatePin(Pin);
                if (PinMatch == "200")
                {

                    var param = new SqlParameter[2];
                    param[0] = new SqlParameter("@SessionId", SessionID);
                    param[1] = new SqlParameter("@Captcha", Captcha);
                    var dt = dbHandler.ReturnDataWithStoredProcedureTable("USP_GET_ExamsCaptchaSessionLog", param);

                    if (dt.Rows[0]["ResponseCode"].ToString() == "200")
                    {
                        PreExaminationController PreExamination = new PreExaminationController();
                        p1.Data = PreExamination.getAttendanceReport(data["Pin"].ToString());
                        captcha = GetCaptchaString(data);
                        p1.ResponceCode = dt.Rows[0]["ResponseCode"].ToString();
                        p1.ResponceDescription = dt.Rows[0]["ResponseDescription"].ToString();
                        p1.Captcha = captcha;
                        p.Add(p1);
                        return JsonConvert.SerializeObject(p);
                    }
                    else
                    {
                        captcha = GetCaptchaString(data);
                        p1.ResponceCode = "400";
                        p1.ResponceDescription = dt.Rows[0]["ResponseDescription"].ToString();
                        p1.Captcha = captcha;
                        p.Add(p1);
                        return JsonConvert.SerializeObject(p);
                    }
                }
                else
                {
                    p1.ResponceCode = "400";
                    p1.ResponceDescription = "PIN Not Matched";
                    p1.Captcha = captcha;
                    p.Add(p1);
                    return JsonConvert.SerializeObject(p);
                }
            }
            catch (Exception ex)
            {
                dbHandler.SaveErorr("USP_GET_ExamsCaptchaSessionLog", 0, ex.Message);
                captcha = GetCaptchaString(data);
                p1.ResponceCode = "400";
                p1.ResponceDescription = ex.Message;
                p1.Captcha = captcha;
                p.Add(p1);
                return JsonConvert.SerializeObject(p);
                //return ex.Message;
            }
        }


        [HttpPost, ActionName("ValidateHallTicketCaptcha")]
        public string ValidateHallTicketCaptcha(JsonObject data)
        {
            var dbHandler = new dbHandler();
            List<Output> p = new List<Output>();
            Output p1 = new Output();
            var captcha = string.Empty;
            try
            {
                string Pin = GetDecryptedData(data["Pin"].ToString());
                string DateOfBirth = GetDecryptedData(data["DateOfBirth"].ToString());
                string StudentTypeId = GetDecryptedData(data["StudentTypeId"].ToString());
                string EMYR = GetDecryptedData(data["EMYR"].ToString());


                string SessionID = GetDecryptedData(data["SessionId"].ToString());
                string Captcha = GetDecryptedData(data["Captcha"].ToString());


                var PinMatch = ValidatePin(Pin);
                if (PinMatch == "200")
                {

                    var param = new SqlParameter[2];
                    param[0] = new SqlParameter("@SessionId", SessionID);
                    param[1] = new SqlParameter("@Captcha", Captcha);
                    var dt = dbHandler.ReturnDataWithStoredProcedureTable("USP_GET_ExamsCaptchaSessionLog", param);

                    if (dt.Rows[0]["ResponseCode"].ToString() == "200")
                    {
                        PreExaminationController PreExamination = new PreExaminationController();
                        if (StudentTypeId.ToString() == "1")
                        {
                            p1.Data = PreExamination.GetRegularHallticket(data["Pin"].ToString(), data["DateOfBirth"].ToString(), data["StudentTypeId"].ToString(), data["EMYR"].ToString());
                        }
                        else if (StudentTypeId.ToString() == "2")
                        {
                            p1.Data = PreExamination.GetBacklogHallticket(data["Pin"].ToString(), data["DateOfBirth"].ToString(), data["StudentTypeId"].ToString(), data["EMYR"].ToString());
                        }
                        captcha = GetCaptchaString(data);
                        p1.ResponceCode = dt.Rows[0]["ResponseCode"].ToString();
                        p1.ResponceDescription = dt.Rows[0]["ResponseDescription"].ToString();
                        p1.Captcha = captcha;
                        p.Add(p1);
                        return JsonConvert.SerializeObject(p);
                    }
                    else
                    {
                        captcha = GetCaptchaString(data);
                        p1.ResponceCode = "400";
                        p1.ResponceDescription = dt.Rows[0]["ResponseDescription"].ToString();
                        p1.Captcha = captcha;
                        p.Add(p1);
                        return JsonConvert.SerializeObject(p);
                    }
                }
                else
                {
                    p1.ResponceCode = "400";
                    p1.ResponceDescription = "PIN Not Matched";
                    p1.Captcha = captcha;
                    p.Add(p1);
                    return JsonConvert.SerializeObject(p);
                }
            }
            catch (Exception ex)
            {
                dbHandler.SaveErorr("USP_GET_ExamsCaptchaSessionLog", 0, ex.Message);
                captcha = GetCaptchaString(data);
                p1.ResponceCode = "400";
                p1.ResponceDescription = ex.Message;
                p1.Captcha = captcha;
                p.Add(p1);
                return JsonConvert.SerializeObject(p);
                //return ex.Message;
            }
        }


        [HttpPost, ActionName("ValidateStudentFeePaymentforAdminCaptcha")]
        public string ValidateStudentFeePaymentforAdminCaptcha(JsonObject data)
        {
            var dbHandler = new dbHandler();
            List<Output> p = new List<Output>();
            Output p1 = new Output();
            var captcha = string.Empty;
            try
            {

                string SessionID = GetDecryptedData(data["SessionId"].ToString());
                string Captcha = GetDecryptedData(data["Captcha"].ToString());
                string Pin = GetDecryptedData(data["Pin"].ToString());

                string StudentTypeId = GetDecryptedData(data["StudentTypeId"].ToString());
                string UserTypeId = GetDecryptedData(data["UserTypeId"].ToString());


                var PinMatch = ValidatePin(Pin);
                if (PinMatch == "200")
                {

                    var param = new SqlParameter[2];
                    param[0] = new SqlParameter("@SessionId", SessionID);
                    param[1] = new SqlParameter("@Captcha", Captcha);
                    var dt = dbHandler.ReturnDataWithStoredProcedureTable("USP_GET_ExamsCaptchaSessionLog", param);

                    if (dt.Rows[0]["ResponseCode"].ToString() == "200")
                    {
                        PreExaminationController PreExamination = new PreExaminationController();
                        p1.Data = PreExamination.GetStudentFeePaymentDetailsforAdmin(data["Pin"].ToString(), data["StudentTypeId"].ToString(), data["UserTypeId"].ToString());
                        captcha = GetCaptchaString(data);
                        p1.ResponceCode = dt.Rows[0]["ResponseCode"].ToString();
                        p1.ResponceDescription = dt.Rows[0]["ResponseDescription"].ToString();
                        p1.Captcha = captcha;
                        p.Add(p1);
                        return JsonConvert.SerializeObject(p);
                    }
                    else
                    {
                        captcha = GetCaptchaString(data);
                        p1.ResponceCode = "400";
                        p1.ResponceDescription = dt.Rows[0]["ResponseDescription"].ToString();
                        p1.Captcha = captcha;
                        p.Add(p1);
                        return JsonConvert.SerializeObject(p);
                    }
                }
                else
                {
                    p1.ResponceCode = "400";
                    p1.ResponceDescription = "PIN Not Matched";
                    p1.Captcha = captcha;
                    p.Add(p1);
                    return JsonConvert.SerializeObject(p);
                }
            }
            catch (Exception ex)
            {
                dbHandler.SaveErorr("USP_GET_ExamsCaptchaSessionLog", 0, ex.Message);
                captcha = GetCaptchaString(data);
                p1.ResponceCode = "400";
                p1.ResponceDescription = ex.Message;
                p1.Captcha = captcha;
                p.Add(p1);
                return JsonConvert.SerializeObject(p);
                //return ex.Message;
            }
        }


        [HttpPost, ActionName("ValidateStudentFeePaymentDetailsCaptcha")]
        public string ValidateStudentFeePaymentDetailsCaptcha(JsonObject data)
        {
            var dbHandler = new dbHandler();
            List<Output> p = new List<Output>();
            Output p1 = new Output();
            var captcha = string.Empty;
            try
            {

                string SessionID = GetDecryptedData(data["SessionId"].ToString());
                string Captcha = GetDecryptedData(data["Captcha"].ToString());
                string Pin = GetDecryptedData(data["Pin"].ToString());

                string StudentTypeId = GetDecryptedData(data["StudentTypeId"].ToString());
                string EMYR = GetDecryptedData(data["EMYR"].ToString());


                var PinMatch = ValidatePin(Pin);
                if (PinMatch == "200")
                {

                    var param = new SqlParameter[2];
                    param[0] = new SqlParameter("@SessionId", SessionID);
                    param[1] = new SqlParameter("@Captcha", Captcha);
                    var dt = dbHandler.ReturnDataWithStoredProcedureTable("USP_GET_ExamsCaptchaSessionLog", param);

                    if (dt.Rows[0]["ResponseCode"].ToString() == "200")
                    {
                        PreExaminationController PreExamination = new PreExaminationController();
                        p1.Data = PreExamination.GetStudentFeePaymentDetails(data["Pin"].ToString(), data["StudentTypeId"].ToString());
                        captcha = GetCaptchaString(data);
                        p1.ResponceCode = dt.Rows[0]["ResponseCode"].ToString();
                        p1.ResponceDescription = dt.Rows[0]["ResponseDescription"].ToString();
                        p1.Captcha = captcha;
                        p.Add(p1);
                        return JsonConvert.SerializeObject(p);
                    }
                    else
                    {
                        captcha = GetCaptchaString(data);
                        p1.ResponceCode = "400";
                        p1.ResponceDescription = dt.Rows[0]["ResponseDescription"].ToString();
                        p1.Captcha = captcha;
                        p.Add(p1);
                        return JsonConvert.SerializeObject(p);
                    }
                }
                else
                {
                    p1.ResponceCode = "400";
                    p1.ResponceDescription = "PIN Not Matched";
                    p1.Captcha = captcha;
                    p.Add(p1);
                    return JsonConvert.SerializeObject(p);
                }
            }
            catch (Exception ex)
            {
                dbHandler.SaveErorr("USP_GET_ExamsCaptchaSessionLog", 0, ex.Message);
                captcha = GetCaptchaString(data);
                p1.ResponceCode = "400";
                p1.ResponceDescription = ex.Message;
                p1.Captcha = captcha;
                p.Add(p1);
                return JsonConvert.SerializeObject(p);
                //return ex.Message;
            }
        }

        [HttpPost, ActionName("ValidateC09ConsolidatedResultCaptcha")]
        public string ValidateC09ConsolidatedResultCaptcha(JsonObject data)
        {
            var dbHandler = new dbHandler();
            List<Output> p = new List<Output>();
            Output p1 = new Output();
            var captcha = string.Empty;
            try
            {

                string SessionID = GetDecryptedData(data["SessionId"].ToString());
                string Captcha = GetDecryptedData(data["Captcha"].ToString());
                string Pin = GetDecryptedData(data["Pin"].ToString());

                var PinMatch = ValidatePin(Pin);
                if (PinMatch == "200")
                {

                    var param = new SqlParameter[2];
                    param[0] = new SqlParameter("@SessionId", SessionID);
                    param[1] = new SqlParameter("@Captcha", Captcha);
                    var dt = dbHandler.ReturnDataWithStoredProcedureTable("USP_GET_ExamsCaptchaSessionLog", param);

                    if (dt.Rows[0]["ResponseCode"].ToString() == "200")
                    {
                        ResultsController Results = new ResultsController();
                        p1.Data = Results.GetC09ConsolidatedResult(data["Pin"].ToString());
                        captcha = GetCaptchaString(data);
                        p1.ResponceCode = dt.Rows[0]["ResponseCode"].ToString();
                        p1.ResponceDescription = dt.Rows[0]["ResponseDescription"].ToString();
                        p1.Captcha = captcha;
                        p.Add(p1);
                        return JsonConvert.SerializeObject(p);
                    }
                    else
                    {
                        captcha = GetCaptchaString(data);
                        p1.ResponceCode = "400";
                        p1.ResponceDescription = dt.Rows[0]["ResponseDescription"].ToString();
                        p1.Captcha = captcha;
                        p.Add(p1);
                        return JsonConvert.SerializeObject(p);
                    }
                }
                else
                {
                    p1.ResponceCode = "400";
                    p1.ResponceDescription = "PIN Not Matched";
                    p1.Captcha = captcha;
                    p.Add(p1);
                    return JsonConvert.SerializeObject(p);
                }
            }
            catch (Exception ex)
            {
                dbHandler.SaveErorr("USP_GET_ExamsCaptchaSessionLog", 0, ex.Message);
                captcha = GetCaptchaString(data);
                p1.ResponceCode = "400";
                p1.ResponceDescription = ex.Message;
                p1.Captcha = captcha;
                p.Add(p1);
                return JsonConvert.SerializeObject(p);
                //return ex.Message;
            }
        }

        [HttpPost, ActionName("ValidateC14ConsolidatedResultCaptcha")]
        public string ValidateC14ConsolidatedResultCaptcha(JsonObject data)
        {
            var dbHandler = new dbHandler();
            List<Output> p = new List<Output>();
            Output p1 = new Output();
            var captcha = string.Empty;
            try
            {

                string SessionID = GetDecryptedData(data["SessionId"].ToString());
                string Captcha = GetDecryptedData(data["Captcha"].ToString());
                string Pin = GetDecryptedData(data["Pin"].ToString());

                var PinMatch = ValidatePin(Pin);
                if (PinMatch == "200")
                {

                    var param = new SqlParameter[2];
                    param[0] = new SqlParameter("@SessionId", SessionID);
                    param[1] = new SqlParameter("@Captcha", Captcha);
                    var dt = dbHandler.ReturnDataWithStoredProcedureTable("USP_GET_ExamsCaptchaSessionLog", param);

                    if (dt.Rows[0]["ResponseCode"].ToString() == "200")
                    {
                        ResultsController Results = new ResultsController();
                        p1.Data = Results.GetC14ConsolidatedResult(data["Pin"].ToString());
                        captcha = GetCaptchaString(data);
                        p1.ResponceCode = dt.Rows[0]["ResponseCode"].ToString();
                        p1.ResponceDescription = dt.Rows[0]["ResponseDescription"].ToString();
                        p1.Captcha = captcha;
                        p.Add(p1);
                        return JsonConvert.SerializeObject(p);
                    }
                    else
                    {
                        captcha = GetCaptchaString(data);
                        p1.ResponceCode = "400";
                        p1.ResponceDescription = dt.Rows[0]["ResponseDescription"].ToString();
                        p1.Captcha = captcha;
                        p.Add(p1);
                        return JsonConvert.SerializeObject(p);
                    }
                }
                else
                {
                    p1.ResponceCode = "400";
                    p1.ResponceDescription = "PIN Not Matched";
                    p1.Captcha = captcha;
                    p.Add(p1);
                    return JsonConvert.SerializeObject(p);
                }
            }
            catch (Exception ex)
            {
                dbHandler.SaveErorr("USP_GET_ExamsCaptchaSessionLog", 0, ex.Message);
                captcha = GetCaptchaString(data);
                p1.ResponceCode = "400";
                p1.ResponceDescription = ex.Message;
                p1.Captcha = captcha;
                p.Add(p1);
                return JsonConvert.SerializeObject(p);
                //return ex.Message;
            }
        }

        [HttpPost, ActionName("ValidateC16ConsolidatedResultCaptcha")]
        public string ValidateC16ConsolidatedResultCaptcha(JsonObject data)
        {
            var dbHandler = new dbHandler();
            List<Output> p = new List<Output>();
            Output p1 = new Output();
            var captcha = string.Empty;
            try
            {

                string SessionID = GetDecryptedData(data["SessionId"].ToString());
                string Captcha = GetDecryptedData(data["Captcha"].ToString());
                string Pin = GetDecryptedData(data["Pin"].ToString());

                var PinMatch = ValidatePin(Pin);
                if (PinMatch == "200")
                {

                    var param = new SqlParameter[2];
                    param[0] = new SqlParameter("@SessionId", SessionID);
                    param[1] = new SqlParameter("@Captcha", Captcha);
                    var dt = dbHandler.ReturnDataWithStoredProcedureTable("USP_GET_ExamsCaptchaSessionLog", param);

                    if (dt.Rows[0]["ResponseCode"].ToString() == "200")
                    {
                        ResultsController Results = new ResultsController();
                        p1.Data = Results.GetC16ConsolidatedResult(data["Pin"].ToString());
                        captcha = GetCaptchaString(data);
                        p1.ResponceCode = dt.Rows[0]["ResponseCode"].ToString();
                        p1.ResponceDescription = dt.Rows[0]["ResponseDescription"].ToString();
                        p1.Captcha = captcha;
                        p.Add(p1);
                        return JsonConvert.SerializeObject(p);
                    }
                    else
                    {
                        captcha = GetCaptchaString(data);
                        p1.ResponceCode = "400";
                        p1.ResponceDescription = dt.Rows[0]["ResponseDescription"].ToString();
                        p1.Captcha = captcha;
                        p.Add(p1);
                        return JsonConvert.SerializeObject(p);
                    }
                }
                else
                {
                    p1.ResponceCode = "400";
                    p1.ResponceDescription = "PIN Not Matched";
                    p1.Captcha = captcha;
                    p.Add(p1);
                    return JsonConvert.SerializeObject(p);
                }
            }
            catch (Exception ex)
            {
                dbHandler.SaveErorr("USP_GET_ExamsCaptchaSessionLog", 0, ex.Message);
                captcha = GetCaptchaString(data);
                p1.ResponceCode = "400";
                p1.ResponceDescription = ex.Message;
                p1.Captcha = captcha;
                p.Add(p1);
                return JsonConvert.SerializeObject(p);
                //return ex.Message;
            }
        }

        [HttpPost, ActionName("ValidateC16SConsolidatedResultCaptcha")]
        public string ValidateC16SConsolidatedResultCaptcha(JsonObject data)
        {
            var dbHandler = new dbHandler();
            List<Output> p = new List<Output>();
            Output p1 = new Output();
            var captcha = string.Empty;
            try
            {

                string SessionID = GetDecryptedData(data["SessionId"].ToString());
                string Captcha = GetDecryptedData(data["Captcha"].ToString());
                string Pin = GetDecryptedData(data["Pin"].ToString());

                var PinMatch = ValidatePin(Pin);
                if (PinMatch == "200")
                {

                    var param = new SqlParameter[2];
                    param[0] = new SqlParameter("@SessionId", SessionID);
                    param[1] = new SqlParameter("@Captcha", Captcha);
                    var dt = dbHandler.ReturnDataWithStoredProcedureTable("USP_GET_ExamsCaptchaSessionLog", param);

                    if (dt.Rows[0]["ResponseCode"].ToString() == "200")
                    {
                        ResultsController Results = new ResultsController();
                        p1.Data = Results.GetC16SConsolidatedResult(data["Pin"].ToString());
                        captcha = GetCaptchaString(data);
                        p1.ResponceCode = dt.Rows[0]["ResponseCode"].ToString();
                        p1.ResponceDescription = dt.Rows[0]["ResponseDescription"].ToString();
                        p1.Captcha = captcha;
                        p.Add(p1);
                        return JsonConvert.SerializeObject(p);
                    }
                    else
                    {
                        captcha = GetCaptchaString(data);
                        p1.ResponceCode = "400";
                        p1.ResponceDescription = dt.Rows[0]["ResponseDescription"].ToString();
                        p1.Captcha = captcha;
                        p.Add(p1);
                        return JsonConvert.SerializeObject(p);
                    }
                }
                else
                {
                    p1.ResponceCode = "400";
                    p1.ResponceDescription = "PIN Not Matched";
                    p1.Captcha = captcha;
                    p.Add(p1);
                    return JsonConvert.SerializeObject(p);
                }
            }
            catch (Exception ex)
            {
                dbHandler.SaveErorr("USP_GET_ExamsCaptchaSessionLog", 0, ex.Message);
                captcha = GetCaptchaString(data);
                p1.ResponceCode = "400";
                p1.ResponceDescription = ex.Message;
                p1.Captcha = captcha;
                p.Add(p1);
                return JsonConvert.SerializeObject(p);
                //return ex.Message;
            }
        }

        [HttpPost, ActionName("ValidateER91ConsolidatedResultCaptcha")]
        public string ValidateER91ConsolidatedResultCaptcha(JsonObject data)
        {
            var dbHandler = new dbHandler();
            List<Output> p = new List<Output>();
            Output p1 = new Output();
            var captcha = string.Empty;
            try
            {

                string SessionID = GetDecryptedData(data["SessionId"].ToString());
                string Captcha = GetDecryptedData(data["Captcha"].ToString());
                string Pin = GetDecryptedData(data["Pin"].ToString());

                var PinMatch = ValidatePin(Pin);
                if (PinMatch == "200")
                {

                    var param = new SqlParameter[2];
                    param[0] = new SqlParameter("@SessionId", SessionID);
                    param[1] = new SqlParameter("@Captcha", Captcha);
                    var dt = dbHandler.ReturnDataWithStoredProcedureTable("USP_GET_ExamsCaptchaSessionLog", param);

                    if (dt.Rows[0]["ResponseCode"].ToString() == "200")
                    {
                        ResultsController Results = new ResultsController();
                        p1.Data = Results.GetER91ConsolidatedResult(data["Pin"].ToString());
                        captcha = GetCaptchaString(data);
                        p1.ResponceCode = dt.Rows[0]["ResponseCode"].ToString();
                        p1.ResponceDescription = dt.Rows[0]["ResponseDescription"].ToString();
                        p1.Captcha = captcha;
                        p.Add(p1);
                        return JsonConvert.SerializeObject(p);
                    }
                    else
                    {
                        captcha = GetCaptchaString(data);
                        p1.ResponceCode = "400";
                        p1.ResponceDescription = dt.Rows[0]["ResponseDescription"].ToString();
                        p1.Captcha = captcha;
                        p.Add(p1);
                        return JsonConvert.SerializeObject(p);
                    }
                }
                else
                {
                    p1.ResponceCode = "400";
                    p1.ResponceDescription = "PIN Not Matched";
                    p1.Captcha = captcha;
                    p.Add(p1);
                    return JsonConvert.SerializeObject(p);
                }
            }
            catch (Exception ex)
            {
                dbHandler.SaveErorr("USP_GET_ExamsCaptchaSessionLog", 0, ex.Message);
                captcha = GetCaptchaString(data);
                p1.ResponceCode = "400";
                p1.ResponceDescription = ex.Message;
                p1.Captcha = captcha;
                p.Add(p1);
                return JsonConvert.SerializeObject(p);
                //return ex.Message;
            }
        }


        [HttpPost, ActionName("ValidateC05ConsolidatedResultCaptcha")]
        public string ValidateC05ConsolidatedResultCaptcha(JsonObject data)
        {
            var dbHandler = new dbHandler();
            List<Output> p = new List<Output>();
            Output p1 = new Output();
            var captcha = string.Empty;
            try
            {

                string SessionID = GetDecryptedData(data["SessionId"].ToString());
                string Captcha = GetDecryptedData(data["Captcha"].ToString());
                string Pin = GetDecryptedData(data["Pin"].ToString());

                var PinMatch = ValidatePin(Pin);
                if (PinMatch == "200")
                {

                    var param = new SqlParameter[2];
                    param[0] = new SqlParameter("@SessionId", SessionID);
                    param[1] = new SqlParameter("@Captcha", Captcha);
                    var dt = dbHandler.ReturnDataWithStoredProcedureTable("USP_GET_ExamsCaptchaSessionLog", param);

                    if (dt.Rows[0]["ResponseCode"].ToString() == "200")
                    {
                        ResultsController Results = new ResultsController();
                        p1.Data = Results.GetC05ConsolidatedResult(data["Pin"].ToString());
                        captcha = GetCaptchaString(data);
                        p1.ResponceCode = dt.Rows[0]["ResponseCode"].ToString();
                        p1.ResponceDescription = dt.Rows[0]["ResponseDescription"].ToString();
                        p1.Captcha = captcha;
                        p.Add(p1);
                        return JsonConvert.SerializeObject(p);
                    }
                    else
                    {
                        captcha = GetCaptchaString(data);
                        p1.ResponceCode = "400";
                        p1.ResponceDescription = dt.Rows[0]["ResponseDescription"].ToString();
                        p1.Captcha = captcha;
                        p.Add(p1);
                        return JsonConvert.SerializeObject(p);
                    }
                }
                else
                {
                    p1.ResponceCode = "400";
                    p1.ResponceDescription = "PIN Not Matched";
                    p1.Captcha = captcha;
                    p.Add(p1);
                    return JsonConvert.SerializeObject(p);
                }
            }
            catch (Exception ex)
            {
                dbHandler.SaveErorr("USP_GET_ExamsCaptchaSessionLog", 0, ex.Message);
                captcha = GetCaptchaString(data);
                p1.ResponceCode = "400";
                p1.ResponceDescription = ex.Message;
                p1.Captcha = captcha;
                p.Add(p1);
                return JsonConvert.SerializeObject(p);
                //return ex.Message;
            }
        }

        [HttpPost, ActionName("ValidateC08ConsolidatedResultCaptcha")]
        public string ValidateC08ConsolidatedResultCaptcha(JsonObject data)
        {
            var dbHandler = new dbHandler();
            List<Output> p = new List<Output>();
            Output p1 = new Output();
            var captcha = string.Empty;
            try
            {

                string SessionID = GetDecryptedData(data["SessionId"].ToString());
                string Captcha = GetDecryptedData(data["Captcha"].ToString());
                string Pin = GetDecryptedData(data["Pin"].ToString());

                var PinMatch = ValidatePin(Pin);
                if (PinMatch == "200")
                {

                    var param = new SqlParameter[2];
                    param[0] = new SqlParameter("@SessionId", SessionID);
                    param[1] = new SqlParameter("@Captcha", Captcha);
                    var dt = dbHandler.ReturnDataWithStoredProcedureTable("USP_GET_ExamsCaptchaSessionLog", param);

                    if (dt.Rows[0]["ResponseCode"].ToString() == "200")
                    {
                        ResultsController Results = new ResultsController();
                        p1.Data = Results.GetC08ConsolidatedResult(data["Pin"].ToString());
                        captcha = GetCaptchaString(data);
                        p1.ResponceCode = dt.Rows[0]["ResponseCode"].ToString();
                        p1.ResponceDescription = dt.Rows[0]["ResponseDescription"].ToString();
                        p1.Captcha = captcha;
                        p.Add(p1);
                        return JsonConvert.SerializeObject(p);
                    }
                    else
                    {
                        captcha = GetCaptchaString(data);
                        p1.ResponceCode = "400";
                        p1.ResponceDescription = dt.Rows[0]["ResponseDescription"].ToString();
                        p1.Captcha = captcha;
                        p.Add(p1);
                        return JsonConvert.SerializeObject(p);
                    }
                }
                else
                {
                    p1.ResponceCode = "400";
                    p1.ResponceDescription = "PIN Not Matched";
                    p1.Captcha = captcha;
                    p.Add(p1);
                    return JsonConvert.SerializeObject(p);
                }
            }
            catch (Exception ex)
            {
                dbHandler.SaveErorr("USP_GET_ExamsCaptchaSessionLog", 0, ex.Message);
                captcha = GetCaptchaString(data);
                p1.ResponceCode = "400";
                p1.ResponceDescription = ex.Message;
                p1.Captcha = captcha;
                p.Add(p1);
                return JsonConvert.SerializeObject(p);
                //return ex.Message;
            }
        }

        [HttpPost, ActionName("ValidateConsolidatedResultCaptcha")]
        public string ValidateConsolidatedResultCaptcha(JsonObject data)
        {
            var dbHandler = new dbHandler();
            List<Output> p = new List<Output>();
            Output p1 = new Output();
            var captcha = string.Empty;
            try
            {

                string SessionID = GetDecryptedData(data["SessionId"].ToString());
                string Captcha = GetDecryptedData(data["Captcha"].ToString());
                string Pin = GetDecryptedData(data["Pin"].ToString());

                var PinMatch = ValidatePin(Pin);
                if (PinMatch == "200")
                {

                    var param = new SqlParameter[2];
                    param[0] = new SqlParameter("@SessionId", SessionID);
                    param[1] = new SqlParameter("@Captcha", Captcha);
                    var dt = dbHandler.ReturnDataWithStoredProcedureTable("USP_GET_ExamsCaptchaSessionLog", param);

                    if (dt.Rows[0]["ResponseCode"].ToString() == "200")
                    {
                        ResultsController Results = new ResultsController();
                        p1.Data = Results.GetConsolidatedResults(data["Pin"].ToString());
                        captcha = GetCaptchaString(data);
                        p1.ResponceCode = dt.Rows[0]["ResponseCode"].ToString();
                        p1.ResponceDescription = dt.Rows[0]["ResponseDescription"].ToString();
                        p1.Captcha = captcha;
                        p.Add(p1);
                        return JsonConvert.SerializeObject(p);
                    }
                    else
                    {
                        captcha = GetCaptchaString(data);
                        p1.ResponceCode = "400";
                        p1.ResponceDescription = dt.Rows[0]["ResponseDescription"].ToString();
                        p1.Captcha = captcha;
                        p.Add(p1);
                        return JsonConvert.SerializeObject(p);
                    }
                }
                else
                {
                    p1.ResponceCode = "400";
                    p1.ResponceDescription = "PIN Not Matched";
                    p1.Captcha = captcha;
                    p.Add(p1);
                    return JsonConvert.SerializeObject(p);
                }
            }
            catch (Exception ex)
            {
                dbHandler.SaveErorr("USP_GET_ExamsCaptchaSessionLog", 0, ex.Message);
                captcha = GetCaptchaString(data);
                p1.ResponceCode = "400";
                p1.ResponceDescription = ex.Message;
                p1.Captcha = captcha;
                p.Add(p1);
                return JsonConvert.SerializeObject(p);
                //return ex.Message;
            }
        }



        [HttpPost, ActionName("ValidateDetailsByPinCaptcha")]
        public string ValidateDetailsByPinCaptcha(JsonObject data)
        {
            var dbHandler = new dbHandler();
            List<Output> p = new List<Output>();
            Output p1 = new Output();
            var captcha = string.Empty;
            try
            {

                string SessionID = GetDecryptedData(data["SessionId"].ToString());
                string Captcha = GetDecryptedData(data["Captcha"].ToString());
                string Pin = GetDecryptedData(data["pin"].ToString());

                var PinMatch = ValidatePin(Pin);
                if (PinMatch == "200")
                {

                    var param = new SqlParameter[2];
                    param[0] = new SqlParameter("@SessionId", SessionID);
                    param[1] = new SqlParameter("@Captcha", Captcha);
                    var dt = dbHandler.ReturnDataWithStoredProcedureTable("USP_GET_ExamsCaptchaSessionLog", param);

                    if (dt.Rows[0]["ResponseCode"].ToString() == "200")
                    {
                        PreExaminationController preExam = new PreExaminationController();
                        p1.Data = preExam.getDetailsByPins(data["pin"].ToString());
                        captcha = GetCaptchaString(data);
                        p1.ResponceCode = dt.Rows[0]["ResponseCode"].ToString();
                        p1.ResponceDescription = dt.Rows[0]["ResponseDescription"].ToString();
                        p1.Captcha = captcha;
                        p.Add(p1);
                        return JsonConvert.SerializeObject(p);
                    }
                    else
                    {
                        captcha = GetCaptchaString(data);
                        p1.ResponceCode = "400";
                        p1.ResponceDescription = dt.Rows[0]["ResponseDescription"].ToString();
                        p1.Captcha = captcha;
                        p.Add(p1);
                        return JsonConvert.SerializeObject(p);
                    }
                }
                else
                {
                    p1.ResponceCode = "400";
                    p1.ResponceDescription = "PIN Not Matched";
                    p1.Captcha = captcha;
                    p.Add(p1);
                    return JsonConvert.SerializeObject(p);
                }
            }
            catch (Exception ex)
            {
                dbHandler.SaveErorr("USP_GET_ExamsCaptchaSessionLog", 0, ex.Message);
                captcha = GetCaptchaString(data);
                p1.ResponceCode = "400";
                p1.ResponceDescription = ex.Message;
                p1.Captcha = captcha;
                p.Add(p1);
                return JsonConvert.SerializeObject(p);
                //return ex.Message;
            }
        }

        [HttpPost, ActionName("ValidateMigrationDetailsByPinCaptcha")]
        public string ValidateMigrationDetailsByPinCaptcha(JsonObject data)
        {
            var dbHandler = new dbHandler();
            List<Output> p = new List<Output>();
            Output p1 = new Output();
            var captcha = string.Empty;
            try
            {

                string SessionID = GetDecryptedData(data["SessionId"].ToString());
                string Captcha = GetDecryptedData(data["Captcha"].ToString());
                string Pin = GetDecryptedData(data["pin"].ToString());

                var PinMatch = ValidatePin(Pin);
                if (PinMatch == "200")
                {

                    var param = new SqlParameter[2];
                    param[0] = new SqlParameter("@SessionId", SessionID);
                    param[1] = new SqlParameter("@Captcha", Captcha);
                    var dt = dbHandler.ReturnDataWithStoredProcedureTable("USP_GET_ExamsCaptchaSessionLog", param);

                    if (dt.Rows[0]["ResponseCode"].ToString() == "200")
                    {
                        PreExaminationController preExam = new PreExaminationController();
                        p1.Data = preExam.getMigrationDetailsByPin(data["pin"].ToString());
                        captcha = GetCaptchaString(data);
                        p1.ResponceCode = dt.Rows[0]["ResponseCode"].ToString();
                        p1.ResponceDescription = dt.Rows[0]["ResponseDescription"].ToString();
                        p1.Captcha = captcha;
                        p.Add(p1);
                        return JsonConvert.SerializeObject(p);
                    }
                    else
                    {
                        captcha = GetCaptchaString(data);
                        p1.ResponceCode = "400";
                        p1.ResponceDescription = dt.Rows[0]["ResponseDescription"].ToString();
                        p1.Captcha = captcha;
                        p.Add(p1);
                        return JsonConvert.SerializeObject(p);
                    }
                }
                else
                {
                    p1.ResponceCode = "400";
                    p1.ResponceDescription = "PIN Not Matched";
                    p1.Captcha = captcha;
                    p.Add(p1);
                    return JsonConvert.SerializeObject(p);
                }
            }
            catch (Exception ex)
            {
                dbHandler.SaveErorr("USP_GET_ExamsCaptchaSessionLog", 0, ex.Message);
                captcha = GetCaptchaString(data);
                p1.ResponceCode = "400";
                p1.ResponceDescription = ex.Message;
                p1.Captcha = captcha;
                p.Add(p1);
                return JsonConvert.SerializeObject(p);
                //return ex.Message;
            }
        }

        [HttpPost, ActionName("ValidateTranscriptDetailsByPinCaptcha")]
        public string ValidateTranscriptDetailsByPinCaptcha(JsonObject data)
        {
            var dbHandler = new dbHandler();
            List<Output> p = new List<Output>();
            Output p1 = new Output();
            var captcha = string.Empty;
            try
            {

                string SessionID = GetDecryptedData(data["SessionId"].ToString());
                string Captcha = GetDecryptedData(data["Captcha"].ToString());
                string Pin = GetDecryptedData(data["pin"].ToString());

                var PinMatch = ValidatePin(Pin);
                if (PinMatch == "200")
                {

                    var param = new SqlParameter[2];
                    param[0] = new SqlParameter("@SessionId", SessionID);
                    param[1] = new SqlParameter("@Captcha", Captcha);
                    var dt = dbHandler.ReturnDataWithStoredProcedureTable("USP_GET_ExamsCaptchaSessionLog", param);

                    if (dt.Rows[0]["ResponseCode"].ToString() == "200")
                    {
                        PreExaminationController preExam = new PreExaminationController();
                        p1.Data = preExam.getTranscriptDetailsByPin(data["pin"].ToString());
                        captcha = GetCaptchaString(data);
                        p1.ResponceCode = dt.Rows[0]["ResponseCode"].ToString();
                        p1.ResponceDescription = dt.Rows[0]["ResponseDescription"].ToString();
                        p1.Captcha = captcha;
                        p.Add(p1);
                        return JsonConvert.SerializeObject(p);
                    }
                    else
                    {
                        captcha = GetCaptchaString(data);
                        p1.ResponceCode = "400";
                        p1.ResponceDescription = dt.Rows[0]["ResponseDescription"].ToString();
                        p1.Captcha = captcha;
                        p.Add(p1);
                        return JsonConvert.SerializeObject(p);
                    }
                }
                else
                {
                    p1.ResponceCode = "400";
                    p1.ResponceDescription = "PIN Not Matched";
                    p1.Captcha = captcha;
                    p.Add(p1);
                    return JsonConvert.SerializeObject(p);
                }
            }
            catch (Exception ex)
            {
                dbHandler.SaveErorr("USP_GET_ExamsCaptchaSessionLog", 0, ex.Message);
                captcha = GetCaptchaString(data);
                p1.ResponceCode = "400";
                p1.ResponceDescription = ex.Message;
                p1.Captcha = captcha;
                p.Add(p1);
                return JsonConvert.SerializeObject(p);
                //return ex.Message;
            }
        }

        [HttpPost, ActionName("ValidateTcDetailsByPinCaptcha")]
        public string ValidateTcDetailsByPinCaptcha(JsonObject data)
        {
            var dbHandler = new dbHandler();
            List<Output> p = new List<Output>();
            Output p1 = new Output();
            var captcha = string.Empty;
            try
            {

                string SessionID = GetDecryptedData(data["SessionId"].ToString());
                string Captcha = GetDecryptedData(data["Captcha"].ToString());
                string Pin = GetDecryptedData(data["pin"].ToString());

                var PinMatch = ValidatePin(Pin);
                if (PinMatch == "200")
                {

                    var param = new SqlParameter[2];
                    param[0] = new SqlParameter("@SessionId", SessionID);
                    param[1] = new SqlParameter("@Captcha", Captcha);
                    var dt = dbHandler.ReturnDataWithStoredProcedureTable("USP_GET_ExamsCaptchaSessionLog", param);

                    if (dt.Rows[0]["ResponseCode"].ToString() == "200")
                    {
                        PreExaminationController preExam = new PreExaminationController();
                        p1.Data = preExam.getTcDetailsByPin(data["pin"].ToString());
                        captcha = GetCaptchaString(data);
                        p1.ResponceCode = dt.Rows[0]["ResponseCode"].ToString();
                        p1.ResponceDescription = dt.Rows[0]["ResponseDescription"].ToString();
                        p1.Captcha = captcha;
                        p.Add(p1);
                        return JsonConvert.SerializeObject(p);
                    }
                    else
                    {
                        captcha = GetCaptchaString(data);
                        p1.ResponceCode = "400";
                        p1.ResponceDescription = dt.Rows[0]["ResponseDescription"].ToString();
                        p1.Captcha = captcha;
                        p.Add(p1);
                        return JsonConvert.SerializeObject(p);
                    }
                }
                else
                {
                    p1.ResponceCode = "400";
                    p1.ResponceDescription = "PIN Not Matched";
                    p1.Captcha = captcha;
                    p.Add(p1);
                    return JsonConvert.SerializeObject(p);
                }
            }
            catch (Exception ex)
            {
                dbHandler.SaveErorr("USP_GET_ExamsCaptchaSessionLog", 0, ex.Message);
                captcha = GetCaptchaString(data);
                p1.ResponceCode = "400";
                p1.ResponceDescription = ex.Message;
                p1.Captcha = captcha;
                p.Add(p1);
                return JsonConvert.SerializeObject(p);
                //return ex.Message;
            }
        }

        [HttpPost, ActionName("ValidateNcDetailsByPinCaptcha")]
        public string ValidateNcDetailsByPinCaptcha(JsonObject data)
        {
            var dbHandler = new dbHandler();
            List<Output> p = new List<Output>();
            Output p1 = new Output();
            var captcha = string.Empty;
            try
            {

                string SessionID = GetDecryptedData(data["SessionId"].ToString());
                string Captcha = GetDecryptedData(data["Captcha"].ToString());
                string Pin = GetDecryptedData(data["pin"].ToString());

                var PinMatch = ValidatePin(Pin);
                if (PinMatch == "200")
                {

                    var param = new SqlParameter[2];
                    param[0] = new SqlParameter("@SessionId", SessionID);
                    param[1] = new SqlParameter("@Captcha", Captcha);
                    var dt = dbHandler.ReturnDataWithStoredProcedureTable("USP_GET_ExamsCaptchaSessionLog", param);

                    if (dt.Rows[0]["ResponseCode"].ToString() == "200")
                    {
                        PreExaminationController preExam = new PreExaminationController();
                        p1.Data = preExam.getNcDetailsByPin(data["pin"].ToString());
                        captcha = GetCaptchaString(data);
                        p1.ResponceCode = dt.Rows[0]["ResponseCode"].ToString();
                        p1.ResponceDescription = dt.Rows[0]["ResponseDescription"].ToString();
                        p1.Captcha = captcha;
                        p.Add(p1);
                        return JsonConvert.SerializeObject(p);
                    }
                    else
                    {
                        captcha = GetCaptchaString(data);
                        p1.ResponceCode = "400";
                        p1.ResponceDescription = dt.Rows[0]["ResponseDescription"].ToString();
                        p1.Captcha = captcha;
                        p.Add(p1);
                        return JsonConvert.SerializeObject(p);
                    }
                }
                else
                {
                    p1.ResponceCode = "400";
                    p1.ResponceDescription = "PIN Not Matched";
                    p1.Captcha = captcha;
                    p.Add(p1);
                    return JsonConvert.SerializeObject(p);
                }
            }
            catch (Exception ex)
            {
                dbHandler.SaveErorr("USP_GET_ExamsCaptchaSessionLog", 0, ex.Message);
                captcha = GetCaptchaString(data);
                p1.ResponceCode = "400";
                p1.ResponceDescription = ex.Message;
                p1.Captcha = captcha;
                p.Add(p1);
                return JsonConvert.SerializeObject(p);
                //return ex.Message;
            }
        }

        [HttpPost, ActionName("ValidateODCDetailsByPinCaptcha")]
        public string ValidateODCDetailsByPinCaptcha(JsonObject data)
        {
            var dbHandler = new dbHandler();
            List<Output> p = new List<Output>();
            Output p1 = new Output();
            var captcha = string.Empty;
            try
            {

                string SessionID = GetDecryptedData(data["SessionId"].ToString());
                string Captcha = GetDecryptedData(data["Captcha"].ToString());
                string Pin = GetDecryptedData(data["pin"].ToString());

                var PinMatch = ValidatePin(Pin);
                if (PinMatch == "200")
                {

                    var param = new SqlParameter[2];
                    param[0] = new SqlParameter("@SessionId", SessionID);
                    param[1] = new SqlParameter("@Captcha", Captcha);
                    var dt = dbHandler.ReturnDataWithStoredProcedureTable("USP_GET_ExamsCaptchaSessionLog", param);

                    if (dt.Rows[0]["ResponseCode"].ToString() == "200")
                    {
                        PreExaminationController preExam = new PreExaminationController();
                        p1.Data = preExam.getODCDetailsByPin(data["pin"].ToString());
                        captcha = GetCaptchaString(data);
                        p1.ResponceCode = dt.Rows[0]["ResponseCode"].ToString();
                        p1.ResponceDescription = dt.Rows[0]["ResponseDescription"].ToString();
                        p1.Captcha = captcha;
                        p.Add(p1);
                        return JsonConvert.SerializeObject(p);
                    }
                    else
                    {
                        captcha = GetCaptchaString(data);
                        p1.ResponceCode = "400";
                        p1.ResponceDescription = dt.Rows[0]["ResponseDescription"].ToString();
                        p1.Captcha = captcha;
                        p.Add(p1);
                        return JsonConvert.SerializeObject(p);
                    }
                }
                else
                {
                    p1.ResponceCode = "400";
                    p1.ResponceDescription = "PIN Not Matched";
                    p1.Captcha = captcha;
                    p.Add(p1);
                    return JsonConvert.SerializeObject(p);
                }
            }
            catch (Exception ex)
            {
                dbHandler.SaveErorr("USP_GET_ExamsCaptchaSessionLog", 0, ex.Message);
                captcha = GetCaptchaString(data);
                p1.ResponceCode = "400";
                p1.ResponceDescription = ex.Message;
                p1.Captcha = captcha;
                p.Add(p1);
                return JsonConvert.SerializeObject(p);
                //return ex.Message;
            }
        }

        [HttpPost, ActionName("ValidateMarksMemoDetailsByPinCaptcha")]
        public string ValidateMarksMemoDetailsByPinCaptcha(JsonObject data)
        {
            var dbHandler = new dbHandler();
            List<Output> p = new List<Output>();
            Output p1 = new Output();
            var captcha = string.Empty;
            try
            {

                string SessionID = GetDecryptedData(data["SessionId"].ToString());
                string Captcha = GetDecryptedData(data["Captcha"].ToString());
                string Pin = GetDecryptedData(data["pin"].ToString());

                var PinMatch = ValidatePin(Pin);
                if (PinMatch == "200")
                {

                    var param = new SqlParameter[2];
                    param[0] = new SqlParameter("@SessionId", SessionID);
                    param[1] = new SqlParameter("@Captcha", Captcha);
                    var dt = dbHandler.ReturnDataWithStoredProcedureTable("USP_GET_ExamsCaptchaSessionLog", param);

                    if (dt.Rows[0]["ResponseCode"].ToString() == "200")
                    {
                        PreExaminationController preExam = new PreExaminationController();
                        p1.Data = preExam.getMarksMemoDetailsByPin(data["pin"].ToString());
                        captcha = GetCaptchaString(data);
                        p1.ResponceCode = dt.Rows[0]["ResponseCode"].ToString();
                        p1.ResponceDescription = dt.Rows[0]["ResponseDescription"].ToString();
                        p1.Captcha = captcha;
                        p.Add(p1);
                        return JsonConvert.SerializeObject(p);
                    }
                    else
                    {
                        captcha = GetCaptchaString(data);
                        p1.ResponceCode = "400";
                        p1.ResponceDescription = dt.Rows[0]["ResponseDescription"].ToString();
                        p1.Captcha = captcha;
                        p.Add(p1);
                        return JsonConvert.SerializeObject(p);
                    }
                }
                else
                {
                    p1.ResponceCode = "400";
                    p1.ResponceDescription = "PIN Not Matched";
                    p1.Captcha = captcha;
                    p.Add(p1);
                    return JsonConvert.SerializeObject(p);
                }
            }
            catch (Exception ex)
            {
                dbHandler.SaveErorr("USP_GET_ExamsCaptchaSessionLog", 0, ex.Message);
                captcha = GetCaptchaString(data);
                p1.ResponceCode = "400";
                p1.ResponceDescription = ex.Message;
                p1.Captcha = captcha;
                p.Add(p1);
                return JsonConvert.SerializeObject(p);
                //return ex.Message;
            }
        }

        [HttpPost, ActionName("ValidateStudyDetailsByPinCaptcha")]
        public string ValidateStudyDetailsByPinCaptcha(JsonObject data)
        {
            var dbHandler = new dbHandler();
            List<Output> p = new List<Output>();
            Output p1 = new Output();
            var captcha = string.Empty;
            try
            {

                string SessionID = GetDecryptedData(data["SessionId"].ToString());
                string Captcha = GetDecryptedData(data["Captcha"].ToString());
                string Pin = GetDecryptedData(data["pin"].ToString());

                var PinMatch = ValidatePin(Pin);
                if (PinMatch == "200")
                {

                    var param = new SqlParameter[2];
                    param[0] = new SqlParameter("@SessionId", SessionID);
                    param[1] = new SqlParameter("@Captcha", Captcha);
                    var dt = dbHandler.ReturnDataWithStoredProcedureTable("USP_GET_ExamsCaptchaSessionLog", param);

                    if (dt.Rows[0]["ResponseCode"].ToString() == "200")
                    {
                        PreExaminationController preExam = new PreExaminationController();
                        p1.Data = preExam.getStudyDetailsByPin(data["pin"].ToString());
                        captcha = GetCaptchaString(data);
                        p1.ResponceCode = dt.Rows[0]["ResponseCode"].ToString();
                        p1.ResponceDescription = dt.Rows[0]["ResponseDescription"].ToString();
                        p1.Captcha = captcha;
                        p.Add(p1);
                        return JsonConvert.SerializeObject(p);
                    }
                    else
                    {
                        captcha = GetCaptchaString(data);
                        p1.ResponceCode = "400";
                        p1.ResponceDescription = dt.Rows[0]["ResponseDescription"].ToString();
                        p1.Captcha = captcha;
                        p.Add(p1);
                        return JsonConvert.SerializeObject(p);
                    }
                }
                else
                {
                    p1.ResponceCode = "400";
                    p1.ResponceDescription = "PIN Not Matched";
                    p1.Captcha = captcha;
                    p.Add(p1);
                    return JsonConvert.SerializeObject(p);
                }
            }
            catch (Exception ex)
            {
                dbHandler.SaveErorr("USP_GET_ExamsCaptchaSessionLog", 0, ex.Message);
                captcha = GetCaptchaString(data);
                p1.ResponceCode = "400";
                p1.ResponceDescription = ex.Message;
                p1.Captcha = captcha;
                p.Add(p1);
                return JsonConvert.SerializeObject(p);
                //return ex.Message;
            }
        }

        [HttpPost, ActionName("ValidateBonafiedDetailsByPinCaptcha")]
        public string ValidateBonafiedDetailsByPinCaptcha(JsonObject data)
        {
            var dbHandler = new dbHandler();
            List<Output> p = new List<Output>();
            Output p1 = new Output();
            var captcha = string.Empty;
            try
            {

                string SessionID = GetDecryptedData(data["SessionId"].ToString());
                string Captcha = GetDecryptedData(data["Captcha"].ToString());
                string Pin = GetDecryptedData(data["pin"].ToString());

                var PinMatch = ValidatePin(Pin);
                if (PinMatch == "200")
                {

                    var param = new SqlParameter[2];
                    param[0] = new SqlParameter("@SessionId", SessionID);
                    param[1] = new SqlParameter("@Captcha", Captcha);
                    var dt = dbHandler.ReturnDataWithStoredProcedureTable("USP_GET_ExamsCaptchaSessionLog", param);

                    if (dt.Rows[0]["ResponseCode"].ToString() == "200")
                    {
                        PreExaminationController preExam = new PreExaminationController();
                        p1.Data = preExam.getBonafiedDetailsByPin(data["pin"].ToString());
                        captcha = GetCaptchaString(data);
                        p1.ResponceCode = dt.Rows[0]["ResponseCode"].ToString();
                        p1.ResponceDescription = dt.Rows[0]["ResponseDescription"].ToString();
                        p1.Captcha = captcha;
                        p.Add(p1);
                        return JsonConvert.SerializeObject(p);
                    }
                    else
                    {
                        captcha = GetCaptchaString(data);
                        p1.ResponceCode = "400";
                        p1.ResponceDescription = dt.Rows[0]["ResponseDescription"].ToString();
                        p1.Captcha = captcha;
                        p.Add(p1);
                        return JsonConvert.SerializeObject(p);
                    }
                }
                else
                {
                    p1.ResponceCode = "400";
                    p1.ResponceDescription = "PIN Not Matched";
                    p1.Captcha = captcha;
                    p.Add(p1);
                    return JsonConvert.SerializeObject(p);
                }
            }
            catch (Exception ex)
            {
                dbHandler.SaveErorr("USP_GET_ExamsCaptchaSessionLog", 0, ex.Message);
                captcha = GetCaptchaString(data);
                p1.ResponceCode = "400";
                p1.ResponceDescription = ex.Message;
                p1.Captcha = captcha;
                p.Add(p1);
                return JsonConvert.SerializeObject(p);
                //return ex.Message;
            }
        }

        [HttpPost, ActionName("ValidateFeePaymentStatusCaptcha")]
        public string ValidateFeePaymentStatusCaptcha(JsonObject data)
        {
            var dbHandler = new dbHandler();
            List<Output> p = new List<Output>();
            Output p1 = new Output();
            var captcha = string.Empty;
            try
            {

                string SessionID = GetDecryptedData(data["SessionId"].ToString());
                string Captcha = GetDecryptedData(data["Captcha"].ToString());
                string Pin = GetDecryptedData(data["pin"].ToString());

                var PinMatch = ValidatePin(Pin);
                if (PinMatch == "200")
                {

                    var param = new SqlParameter[2];
                    param[0] = new SqlParameter("@SessionId", SessionID);
                    param[1] = new SqlParameter("@Captcha", Captcha);
                    var dt = dbHandler.ReturnDataWithStoredProcedureTable("USP_GET_ExamsCaptchaSessionLog", param);

                    if (dt.Rows[0]["ResponseCode"].ToString() == "200")
                    {
                        PreExaminationController preExam = new PreExaminationController();
                        p1.Data = preExam.getFeePaymentStatus(data["pin"].ToString());
                        captcha = GetCaptchaString(data);
                        p1.ResponceCode = dt.Rows[0]["ResponseCode"].ToString();
                        p1.ResponceDescription = dt.Rows[0]["ResponseDescription"].ToString();
                        p1.Captcha = captcha;
                        p.Add(p1);
                        return JsonConvert.SerializeObject(p);
                    }
                    else
                    {
                        captcha = GetCaptchaString(data);
                        p1.ResponceCode = "400";
                        p1.ResponceDescription = dt.Rows[0]["ResponseDescription"].ToString();
                        p1.Captcha = captcha;
                        p.Add(p1);
                        return JsonConvert.SerializeObject(p);
                    }
                }
                else
                {
                    p1.ResponceCode = "400";
                    p1.ResponceDescription = "PIN Not Matched";
                    p1.Captcha = captcha;
                    p.Add(p1);
                    return JsonConvert.SerializeObject(p);
                }
            }
            catch (Exception ex)
            {
                dbHandler.SaveErorr("USP_GET_ExamsCaptchaSessionLog", 0, ex.Message);
                captcha = GetCaptchaString(data);
                p1.ResponceCode = "400";
                p1.ResponceDescription = ex.Message;
                p1.Captcha = captcha;
                p.Add(p1);
                return JsonConvert.SerializeObject(p);
                //return ex.Message;
            }
        }

        [HttpGet, ActionName("ValidatePinDetailsCaptcha")]
        public string ValidatePinDetailsCaptcha(string pin)
        {
            try
            {
                string Pin = GetDecryptedData(pin);
                var dbHandler = new dbHandler();
                var param = new SqlParameter[1];
                param[0] = new SqlParameter("@pin", Pin);
                var dt = dbHandler.ReturnDataWithStoredProcedure("USP_SFP_GET_GetStudentDetailsForCertificate", param);
                return JsonConvert.SerializeObject(dt);

            }
            catch (Exception ex)
            {

                dbHandler.SaveErorr("USP_SFP_GET_GetStudentDetailsForCertificate", 0, ex.Message);
                return ex.Message;
            }

        }



        [HttpPost, ActionName("ValidateTwoYearsFeePaymentStatusCaptcha")]
        public string ValidateTwoYearsFeePaymentStatusCaptcha(JsonObject data)
        {
            var dbHandler = new dbHandler();
            List<Output> p = new List<Output>();
            Output p1 = new Output();
            var captcha = string.Empty;
            try
            {

                string SessionID = GetDecryptedData(data["SessionId"].ToString());
                string Captcha = GetDecryptedData(data["Captcha"].ToString());
                string Pin = GetDecryptedData(data["pin"].ToString());

                var PinMatch = ValidatePin(Pin);
                if (PinMatch == "200")
                {

                    var param = new SqlParameter[2];
                    param[0] = new SqlParameter("@SessionId", SessionID);
                    param[1] = new SqlParameter("@Captcha", Captcha);
                    var dt = dbHandler.ReturnDataWithStoredProcedureTable("USP_GET_ExamsCaptchaSessionLog", param);

                    if (dt.Rows[0]["ResponseCode"].ToString() == "200")
                    {
                        PreExaminationController preExam = new PreExaminationController();
                        p1.Data = preExam.getTwoYearsFeePaymentStatus(data["pin"].ToString());
                        captcha = GetCaptchaString(data);
                        p1.ResponceCode = dt.Rows[0]["ResponseCode"].ToString();
                        p1.ResponceDescription = dt.Rows[0]["ResponseDescription"].ToString();
                        p1.Captcha = captcha;
                        p.Add(p1);
                        return JsonConvert.SerializeObject(p);
                    }
                    else
                    {
                        captcha = GetCaptchaString(data);
                        p1.ResponceCode = "400";
                        p1.ResponceDescription = dt.Rows[0]["ResponseDescription"].ToString();
                        p1.Captcha = captcha;
                        p.Add(p1);
                        return JsonConvert.SerializeObject(p);
                    }
                }
                else
                {
                    p1.ResponceCode = "400";
                    p1.ResponceDescription = "PIN Not Matched";
                    p1.Captcha = captcha;
                    p.Add(p1);
                    return JsonConvert.SerializeObject(p);
                }
            }
            catch (Exception ex)
            {
                dbHandler.SaveErorr("USP_GET_ExamsCaptchaSessionLog", 0, ex.Message);
                captcha = GetCaptchaString(data);
                p1.ResponceCode = "400";
                p1.ResponceDescription = ex.Message;
                p1.Captcha = captcha;
                p.Add(p1);
                return JsonConvert.SerializeObject(p);
                //return ex.Message;
            }
        }

        [HttpPost, ActionName("ValidateGenuinenessCheckDetailsByPinCaptcha")]
        public string ValidateGenuinenessCheckDetailsByPinCaptcha(JsonObject data)
        {
            var dbHandler = new dbHandler();
            List<Output> p = new List<Output>();
            Output p1 = new Output();
            var captcha = string.Empty;
            try
            {

                string SessionID = GetDecryptedData(data["SessionId"].ToString());
                string Captcha = GetDecryptedData(data["Captcha"].ToString());
                string Pin = GetDecryptedData(data["pin"].ToString());

                var PinMatch = ValidatePin(Pin);
                if (PinMatch == "200")
                {

                    var param = new SqlParameter[2];
                    param[0] = new SqlParameter("@SessionId", SessionID);
                    param[1] = new SqlParameter("@Captcha", Captcha);
                    var dt = dbHandler.ReturnDataWithStoredProcedureTable("USP_GET_ExamsCaptchaSessionLog", param);

                    if (dt.Rows[0]["ResponseCode"].ToString() == "200")
                    {
                        PreExaminationController preExam = new PreExaminationController();
                        p1.Data = preExam.getGenuinenessCheckDetailsByPin(data["pin"].ToString());
                        captcha = GetCaptchaString(data);
                        p1.ResponceCode = dt.Rows[0]["ResponseCode"].ToString();
                        p1.ResponceDescription = dt.Rows[0]["ResponseDescription"].ToString();
                        p1.Captcha = captcha;
                        p.Add(p1);
                        return JsonConvert.SerializeObject(p);
                    }
                    else
                    {
                        captcha = GetCaptchaString(data);
                        p1.ResponceCode = "400";
                        p1.ResponceDescription = dt.Rows[0]["ResponseDescription"].ToString();
                        p1.Captcha = captcha;
                        p.Add(p1);
                        return JsonConvert.SerializeObject(p);
                    }
                }
                else
                {
                    p1.ResponceCode = "400";
                    p1.ResponceDescription = "PIN Not Matched";
                    p1.Captcha = captcha;
                    p.Add(p1);
                    return JsonConvert.SerializeObject(p);
                }
            }
            catch (Exception ex)
            {
                dbHandler.SaveErorr("USP_GET_ExamsCaptchaSessionLog", 0, ex.Message);
                captcha = GetCaptchaString(data);
                p1.ResponceCode = "400";
                p1.ResponceDescription = ex.Message;
                p1.Captcha = captcha;
                p.Add(p1);
                return JsonConvert.SerializeObject(p);
                //return ex.Message;
            }
        }

        [HttpPost, ActionName("ValidateDataByPinCaptcha")]
        public string ValidateDataByPinCaptcha(JsonObject data)
        {
            var dbHandler = new dbHandler();
            List<Output> p = new List<Output>();
            Output p1 = new Output();
            var captcha = string.Empty;
            try
            {

                string SessionID = GetDecryptedData(data["SessionId"].ToString());
                string Captcha = GetDecryptedData(data["Captcha"].ToString());
                string StudentTypeId = GetDecryptedData(data["StudentTypeId"].ToString());
                string Pin = GetDecryptedData(data["Pin"].ToString());

                var PinMatch = ValidatePin(Pin);
                if (PinMatch == "200")
                {

                    var param = new SqlParameter[2];
                    param[0] = new SqlParameter("@SessionId", SessionID);
                    param[1] = new SqlParameter("@Captcha", Captcha);
                    var dt = dbHandler.ReturnDataWithStoredProcedureTable("USP_GET_ExamsCaptchaSessionLog", param);

                    if (dt.Rows[0]["ResponseCode"].ToString() == "200")
                    {
                        PreExaminationController PreExamination = new PreExaminationController();
                        string pin = data["Pin"].ToString();
                        string StudentTypeID = data["StudentTypeId"].ToString();
                        //p1.Data = PreExamination.getUserDataByPin(StudentTypeID, pin);
                        captcha = GetCaptchaString(data);
                        p1.ResponceCode = dt.Rows[0]["ResponseCode"].ToString();
                        p1.ResponceDescription = dt.Rows[0]["ResponseDescription"].ToString();
                        p1.Captcha = captcha;
                        p.Add(p1);
                        return JsonConvert.SerializeObject(p);
                    }
                    else
                    {
                        captcha = GetCaptchaString(data);
                        p1.ResponceCode = "400";
                        p1.ResponceDescription = dt.Rows[0]["ResponseDescription"].ToString();
                        p1.Captcha = captcha;
                        p.Add(p1);
                        return JsonConvert.SerializeObject(p);
                    }
                }
                else
                {
                    p1.ResponceCode = "400";
                    p1.ResponceDescription = "PIN Not Matched";
                    p1.Captcha = captcha;
                    p.Add(p1);
                    return JsonConvert.SerializeObject(p);
                }
            }
            catch (Exception ex)
            {
                dbHandler.SaveErorr("USP_GET_ExamsCaptchaSessionLog", 0, ex.Message);
                captcha = GetCaptchaString(data);
                p1.ResponceCode = "400";
                p1.ResponceDescription = ex.Message;
                p1.Captcha = captcha;
                p.Add(p1);
                return JsonConvert.SerializeObject(p);
                //return ex.Message;
            }
        }

        [HttpGet, ActionName("ValidatePin")]
        public string ValidatePin(string Pin)
        {
            string ResponceCode = "";
            try
            {


                var match = Regex.IsMatch(Pin, @"^[A-Za-z0-9-]*$");
                if (match)
                {
                    ResponceCode = "200";

                }
                else
                {
                    ResponceCode = "400";

                }
                return ResponceCode;
            }
            catch (Exception ex)
            {
                ResponceCode = "400";
                return ResponceCode;
            }
        }


        internal class Output
        {
            public string ResponceCode { get; internal set; }
            public string ResponceDescription { get; internal set; }
            public string Captcha { get; internal set; }


            public string captcha { get; set; }
            public string Data { get; internal set; }
        }

        [HttpGet, ActionName("GetStaffTypes")]
        public HttpResponseMessage GetStaffTypes()
        {
            try
            {
                var dbHandler = new dbHandler();
                string StrQuery = "";
                StrQuery = "exec ADM_GET_StaffTypes";
                return Request.CreateResponse(HttpStatusCode.OK, dbHandler.ReturnDataSet(StrQuery));
            }
            catch (Exception ex)
            {
                dbHandler.SaveErorr("ADM_GET_StaffTypes", 0, ex.Message);
                return Request.CreateResponse(HttpStatusCode.InternalServerError, ex.Message);
            }
        }

        [HttpGet, ActionName("GetDownloadsList")]
        public HttpResponseMessage GetDownloadsList()
        {
            try
            {
                var dbHandler = new dbHandler();
                string StrQuery = "";
                StrQuery = "exec USP_GET_DownloadsForAdmin";
                return Request.CreateResponse(HttpStatusCode.OK, dbHandler.ReturnDataSet(StrQuery));
            }
            catch (Exception ex)
            {
                dbHandler.SaveErorr("USP_GET_DownloadsForAdmin", 0, ex.Message);
                return Request.CreateResponse(HttpStatusCode.InternalServerError, ex.Message);
            }
        }

        [HttpGet, ActionName("GetActiveDownloadsList")]
        public HttpResponseMessage GetActiveDownloadsList()
        {
            try
            {
                var dbHandler = new dbHandler();
                string StrQuery = "";
                StrQuery = "exec USP_GET_DownloadsForWebSite";
                return Request.CreateResponse(HttpStatusCode.OK, dbHandler.ReturnDataSet(StrQuery));
            }
            catch (Exception ex)
            {
                dbHandler.SaveErorr("USP_GET_DownloadsForWebSite", 0, ex.Message);
                return Request.CreateResponse(HttpStatusCode.InternalServerError, ex.Message);
            }
        }


        [HttpGet, ActionName("getUserTypes")]
        public HttpResponseMessage getUserTypes()
        {
            try
            {
                var dbHandler = new dbHandler();
                string StrQuery = "";
                StrQuery = "exec USP_GET_UserTypes";
                return Request.CreateResponse(HttpStatusCode.OK, dbHandler.ReturnDataSet(StrQuery));
            }
            catch (Exception ex)
            {
                dbHandler.SaveErorr("USP_GET_UserTypes", 0, ex.Message);
                throw ex;
            }
        }

        [HttpGet, ActionName("GetUsers")]
        public HttpResponseMessage GetUsers()
        {
            try
            {
                var dbHandler = new dbHandler();
                string StrQuery = "";
                StrQuery = "exec ADM_GET_All_Users";
                return Request.CreateResponse(HttpStatusCode.OK, dbHandler.ReturnDataSet(StrQuery));
            }
            catch (Exception ex)
            {
                dbHandler.SaveErorr("ADM_GET_All_Users", 0, ex.Message);
                throw ex;
            }
        }


        [HttpGet, ActionName("GetAllUsers")]
        public HttpResponseMessage GetAllUsers()
        {
            try
            {
                var dbHandler = new dbHandler();
                string StrQuery = "";
                StrQuery = "exec SP_Get_Users";
                return Request.CreateResponse(HttpStatusCode.OK, dbHandler.ReturnDataSet(StrQuery));
            }
            catch (Exception ex)
            {
                dbHandler.SaveErorr("SP_Get_Users", 0, ex.Message);
                throw ex;
            }
        }








        [HttpGet, ActionName("AddUserPasswords")]
        public string AddUserPasswords(string UserName, string Password)
        {
            var dbHandler = new dbHandler();

            try
            {
                var param = new SqlParameter[2];
                param[0] = new SqlParameter("@UserName", UserName);
                param[1] = new SqlParameter("@Password", Password);
                var dt = dbHandler.ReturnDataWithStoredProcedure("SP_Set_UserPasswords", param);
                return JsonConvert.SerializeObject(dt);
            }
            catch (Exception ex)
            {

                dbHandler.SaveErorr("SP_Set_UserPasswords", 0, ex.Message);
                return ex.Message;
            }

        }

        [HttpGet, ActionName("getNotifications")]
        public HttpResponseMessage getNotifications()
        {
            try
            {
                var dbHandler = new dbHandler();
                string StrQuery = "";
                StrQuery = "exec ADM_GET_AllNotifications";
                return Request.CreateResponse(HttpStatusCode.OK, dbHandler.ReturnDataSet(StrQuery));
            }
            catch (Exception ex)
            {
                dbHandler.SaveErorr("ADM_GET_AllNotifications", 0, ex.Message);
                return Request.CreateResponse(HttpStatusCode.Gone, ex);
            }

        }


        [HttpGet, ActionName("getCircularTypes")]
        public HttpResponseMessage getCircularTypes()
        {
            try
            {
                var dbHandler = new dbHandler();
                string StrQuery = "";
                StrQuery = "exec ADM_GET_CircularTypes";
                return Request.CreateResponse(HttpStatusCode.OK, dbHandler.ReturnDataSet(StrQuery));
            }
            catch (Exception ex)
            {
                dbHandler.SaveErorr("ADM_GET_CircularTypes", 0, ex.Message);
                return Request.CreateResponse(HttpStatusCode.Gone, ex);
            }

        }

        [HttpGet, ActionName("GetProjects")]
        public HttpResponseMessage GetProjects()
        {
            try
            {
                var dbHandler = new dbHandler();
                string StrQuery = "";
                StrQuery = "exec SP_Get_Projects";
                return Request.CreateResponse(HttpStatusCode.OK, dbHandler.ReturnDataSet(StrQuery));
            }
            catch (Exception ex)
            {
                dbHandler.SaveErorr("SP_Get_Projects", 0, ex.Message);
                return Request.CreateResponse(HttpStatusCode.Gone, ex);
            }

        }


        [HttpGet, ActionName("GetTaskTypes")]
        public HttpResponseMessage GetTaskTypes()
        {
            try
            {
                var dbHandler = new dbHandler();
                string StrQuery = "";
                StrQuery = "exec SP_Get_TaskType";
                return Request.CreateResponse(HttpStatusCode.OK, dbHandler.ReturnDataSet(StrQuery));
            }
            catch (Exception ex)
            {
                dbHandler.SaveErorr("SP_Get_TaskType", 0, ex.Message);
                return Request.CreateResponse(HttpStatusCode.Gone, ex);
            }

        }



        [HttpGet, ActionName("getStaffList")]
        public HttpResponseMessage getStaffList()
        {
            try
            {
                var dbHandler = new dbHandler();
                string StrQuery = "";
                StrQuery = "exec ADM_GET_StaffInfo";
                return Request.CreateResponse(HttpStatusCode.OK, dbHandler.ReturnDataSet(StrQuery));
            }
            catch (Exception ex)
            {
                dbHandler.SaveErorr("ADM_GET_StaffInfo", 0, ex.Message);
                return Request.CreateResponse(HttpStatusCode.Gone, ex);
            }

        }



        [HttpGet, ActionName("getStaffActive")]
        public HttpResponseMessage getStaffActive()
        {
            try
            {
                var dbHandler = new dbHandler();
                string StrQuery = "";
                StrQuery = "exec ADM_GET_StaffActive";
                return Request.CreateResponse(HttpStatusCode.OK, dbHandler.ReturnDataSet(StrQuery));
            }
            catch (Exception ex)
            {
                dbHandler.SaveErorr("ADM_GET_StaffActive", 0, ex.Message);
                return Request.CreateResponse(HttpStatusCode.OK, ex.Message);
            }
        }


        [HttpGet, ActionName("GetCollegesList")]
        public HttpResponseMessage GetCollegesList()
        {
            try
            {
                var dbHandler = new dbHandler();
                string StrQuery = "";
                StrQuery = "exec ADM_GET_COLLEGESLIST";
                return Request.CreateResponse(HttpStatusCode.OK, dbHandler.ReturnDataSet(StrQuery));
            }
            catch (Exception ex)
            {
                dbHandler.SaveErorr("ADM_GET_COLLEGESLIST", 0, ex.Message);
                return Request.CreateResponse(HttpStatusCode.OK, ex.Message);
            }
        }


        [HttpGet, ActionName("GetModulesbyRole")]
        public HttpResponseMessage GetModulesbyRole(int usertypeid)
        {
            try
            {
                var dbHandler = new dbHandler();
                var param = new SqlParameter[1];
                param[0] = new SqlParameter("@usertypeid", usertypeid);
                var dt = dbHandler.ReturnDataWithStoredProcedureTable("ADM_Login_GET_Modules", param);
                HttpResponseMessage response = Request.CreateResponse(HttpStatusCode.OK, dt);
                return response;
            }
            catch (Exception ex)
            {
                dbHandler.SaveErorr("ADM_Login_GET_Modules ", 0, ex.Message);
                return Request.CreateResponse(HttpStatusCode.OK, ex.Message);
            }
        }

        [HttpGet, ActionName("DeleteStaff")]
        public HttpResponseMessage DeleteStaff(int id)
        {
            try
            {
                var dbHandler = new dbHandler();
                var param = new SqlParameter[1];
                param[0] = new SqlParameter("@id", id);
                var dt = dbHandler.ReturnDataWithStoredProcedureTable("ADM_DEL_Staff", param);
                HttpResponseMessage response = Request.CreateResponse(HttpStatusCode.OK, dt);
                return response;
            }
            catch (Exception ex)
            {
                dbHandler.SaveErorr("ADM_DEL_Staff ", 0, ex.Message);
                throw ex;
            }

        }

        [HttpGet, ActionName("DeleteCircular")]
        public HttpResponseMessage DeleteCircular(int id)
        {
            try
            {
                var dbHandler = new dbHandler();
                var param = new SqlParameter[1];
                param[0] = new SqlParameter("@id", id);
                var dt = dbHandler.ReturnDataWithStoredProcedureTable("ADM_DEL_CIRCULARS", param);
                HttpResponseMessage response = Request.CreateResponse(HttpStatusCode.OK, dt);
                return response;
            }
            catch (Exception ex)
            {
                dbHandler.SaveErorr("ADM_DEL_CIRCULARS ", 0, ex.Message);
                throw ex;
            }

        }

        [HttpGet, ActionName("DeleteDownloads")]
        public HttpResponseMessage DeleteDownloads(int id)
        {
            try
            {
                var dbHandler = new dbHandler();
                var param = new SqlParameter[1];
                param[0] = new SqlParameter("@id", id);
                var dt = dbHandler.ReturnDataWithStoredProcedureTable("ADM_DEL_Downloads", param);
                HttpResponseMessage response = Request.CreateResponse(HttpStatusCode.OK, dt);
                return response;
            }
            catch (Exception ex)
            {
                dbHandler.SaveErorr("ADM_DEL_Downloads ", 0, ex.Message);
                throw ex;
            }

        }


        [HttpGet, ActionName("DeleteTender")]
        public HttpResponseMessage DeleteTender(int id)
        {
            try
            {
                var dbHandler = new dbHandler();
                var param = new SqlParameter[1];
                param[0] = new SqlParameter("@id", id);
                var dt = dbHandler.ReturnDataWithStoredProcedureTable("ADM_DEL_Tenders", param);
                HttpResponseMessage response = Request.CreateResponse(HttpStatusCode.OK, dt);
                return response;
            }
            catch (Exception ex)
            {
                dbHandler.SaveErorr("ADM_DEL_Tenders ", 0, ex.Message);
                throw ex;
            }

        }

        [HttpGet, ActionName("SwitchCircular")]
        public HttpResponseMessage SwitchCircular(int id, int IsActive)
        {
            try
            {
                var dbHandler = new dbHandler();
                var param = new SqlParameter[2];
                param[0] = new SqlParameter("@id", id);
                param[1] = new SqlParameter("@IsActive", IsActive);
                var dt = dbHandler.ReturnDataWithStoredProcedureTable("ADM_SWITCH_CIRCULARS", param);
                HttpResponseMessage response = Request.CreateResponse(HttpStatusCode.OK, dt);
                return response;
            }
            catch (Exception ex)
            {
                dbHandler.SaveErorr("ADM_SWITCH_CIRCULARS ", 0, ex.Message);
                throw ex;
            }

        }

        [HttpGet, ActionName("SwitchDownloads")]
        public HttpResponseMessage SwitchDownloads(int id, int IsActive)
        {
            try
            {
                var dbHandler = new dbHandler();
                var param = new SqlParameter[2];
                param[0] = new SqlParameter("@id", id);
                param[1] = new SqlParameter("@IsActive", IsActive);
                var dt = dbHandler.ReturnDataWithStoredProcedureTable("ADM_SWITCH_Downloads", param);
                HttpResponseMessage response = Request.CreateResponse(HttpStatusCode.OK, dt);
                return response;
            }
            catch (Exception ex)
            {
                dbHandler.SaveErorr("ADM_SWITCH_Downloads ", 0, ex.Message);
                throw ex;
            }

        }


        [HttpGet, ActionName("SwitchStaff")]
        public HttpResponseMessage SwitchStaff(int id, int IsActive)
        {
            try
            {
                var dbHandler = new dbHandler();
                var param = new SqlParameter[2];
                param[0] = new SqlParameter("@id", id);
                param[1] = new SqlParameter("@IsActive", IsActive);
                var dt = dbHandler.ReturnDataWithStoredProcedureTable("ADM_SWITCH_Staff", param);
                HttpResponseMessage response = Request.CreateResponse(HttpStatusCode.OK, dt);
                return response;
            }
            catch (Exception ex)
            {
                dbHandler.SaveErorr("ADM_SWITCH_Staff ", 0, ex.Message);
                throw ex;
            }

        }


        [HttpGet, ActionName("SwitchTender")]
        public HttpResponseMessage SwitchTender(int id, int IsActive)
        {
            try
            {
                var dbHandler = new dbHandler();
                var param = new SqlParameter[2];
                param[0] = new SqlParameter("@id", id);
                param[1] = new SqlParameter("@IsActive", IsActive);
                var dt = dbHandler.ReturnDataWithStoredProcedureTable("ADM_SWITCH_Tenders", param);
                HttpResponseMessage response = Request.CreateResponse(HttpStatusCode.OK, dt);
                return response;
            }
            catch (Exception ex)
            {
                dbHandler.SaveErorr("ADM_SWITCH_Tenders ", 0, ex.Message);
                throw ex;
            }

        }



        [HttpGet, ActionName("GetAllModulesbyRole")]
        public HttpResponseMessage GetAllModulesbyRole(int usertypeid)
        {
            try
            {
                var dbHandler = new dbHandler();
                var param = new SqlParameter[1];
                param[0] = new SqlParameter("@usertypeid", usertypeid);
                var dt = dbHandler.ReturnDataWithStoredProcedureTable("USP_GET_ALLModules", param);
                HttpResponseMessage response = Request.CreateResponse(HttpStatusCode.OK, dt);
                return response;
            }
            catch (Exception ex)
            {
                dbHandler.SaveErorr("ADM_Login_GET_Modules ", 0, ex.Message);
                throw ex;
            }

        }

        [HttpGet, ActionName("GetSubModulesbyRole")]
        public HttpResponseMessage GetSubModulesbyRole(int usertypeid, int moduleid)
        {
            try
            {
                var dbHandler = new dbHandler();
                var param = new SqlParameter[2];
                param[0] = new SqlParameter("@usertypeid", usertypeid);
                param[1] = new SqlParameter("@moduleid", moduleid);
                var dt = dbHandler.ReturnDataWithStoredProcedureTable("ADM_Login_GET_SubModules ", param);
                HttpResponseMessage response = Request.CreateResponse(HttpStatusCode.OK, dt);
                return response;
            }
            catch (Exception ex)
            {
                dbHandler.SaveErorr("ADM_Login_GET_SubModules ", 0, ex.Message);
                throw ex;
            }

        }


        [HttpGet, ActionName("SetSubModuleInactive")]
        public HttpResponseMessage SetSubModuleInactive(int usertypeid, int moduleId, int SubModuleId, int IsActive)
        {
            try
            {
                var dbHandler = new dbHandler();
                var param = new SqlParameter[4];
                param[0] = new SqlParameter("@usertypeid", usertypeid);
                param[1] = new SqlParameter("@moduleId", moduleId);
                param[2] = new SqlParameter("@SubModuleId", SubModuleId);
                param[3] = new SqlParameter("@IsActive", IsActive);
                var dt = dbHandler.ReturnDataWithStoredProcedureTable("ADM_Login_SET_SubmodueInctive ", param);
                HttpResponseMessage response = Request.CreateResponse(HttpStatusCode.OK, dt);
                return response;
            }
            catch (Exception ex)
            {
                dbHandler.SaveErorr("ADM_Login_SET_SubmodueInctive ", 0, ex.Message);
                throw ex;
            }

        }


        [HttpGet, ActionName("SetModuleInactive")]
        public HttpResponseMessage SetModuleInactive(int usertypeid, int moduleId, int IsActive)
        {
            try
            {
                var dbHandler = new dbHandler();
                var param = new SqlParameter[3];
                param[0] = new SqlParameter("@usertypeid", usertypeid);
                param[1] = new SqlParameter("@moduleId", moduleId);
                param[2] = new SqlParameter("@IsActive", IsActive);
                var dt = dbHandler.ReturnDataWithStoredProcedureTable("ADM_Login_SET_modueInctive ", param);
                HttpResponseMessage response = Request.CreateResponse(HttpStatusCode.OK, dt);
                return response;
            }
            catch (Exception ex)
            {
                dbHandler.SaveErorr("ADM_Login_SET_modueInctive ", 0, ex.Message);
                throw ex;
            }

        }


        [HttpGet, ActionName("NotificationInactive")]
        public HttpResponseMessage NotificationInactive(int Id)
        {
            try
            {
                var dbHandler = new dbHandler();
                var param = new SqlParameter[1];
                param[0] = new SqlParameter("@Id ", Id);
                var dt = dbHandler.ReturnDataWithStoredProcedureTable("ADM_SET_NotificationInactive ", param);
                HttpResponseMessage response = Request.CreateResponse(HttpStatusCode.OK, dt);
                return response;
            }
            catch (Exception ex)
            {
                dbHandler.SaveErorr("ADM_SET_NotificationInactive ", 0, ex.Message);
                throw ex;
            }

        }
        public class notification
        {
            public string Notification { get; set; }
            public int UserTypeId { get; set; }
            public DateTime fromDate { get; set; }
            public DateTime ToDate { get; set; }

        }







        [HttpGet, ActionName("getUserType")]
        public HttpResponseMessage getUserType()
        {
            try
            {
                var dbHandler = new dbHandler();
                string StrQuery = "";
                StrQuery = "exec USP_GET_UserType";
                return Request.CreateResponse(HttpStatusCode.OK, dbHandler.ReturnDataSet(StrQuery));
            }
            catch (Exception ex)
            {
                dbHandler.SaveErorr("USP_GET_UserType", 0, ex.Message);
                throw ex;
            }
        }

        [HttpGet, ActionName("getActiveBranches")]
        public HttpResponseMessage getActiveBranches()
        {
            try
            {
                var dbHandler = new dbHandler();
                string StrQuery = "";
                StrQuery = "exec USP_GET_ActiveBranches";
                return Request.CreateResponse(HttpStatusCode.OK, dbHandler.ReturnDataSet(StrQuery));
            }
            catch (Exception ex)
            {
                dbHandler.SaveErorr("USP_GET_ActiveBranches", 0, ex.Message);
                throw ex;
            }
        }



        [HttpGet, ActionName("SwitchUserStatus")]
        public HttpResponseMessage SwitchUserStatus(string UserId)
        {
            try
            {
                var dbHandler = new dbHandler();
                var param = new SqlParameter[1];
                param[0] = new SqlParameter("@UserId ", UserId);
                var dt = dbHandler.ReturnDataWithStoredProcedureTable("ADM_SET_UserIdActiveInActive", param);
                HttpResponseMessage response = Request.CreateResponse(HttpStatusCode.OK, dt);
                return response;
            }
            catch (Exception ex)
            {
                dbHandler.SaveErorr("ADM_SET_UserIdActiveInActive", 0, ex.Message);
                throw ex;
            }
        }

        [HttpGet, ActionName("GetNotificationByUser")]
        public HttpResponseMessage GetNotificationByUser(int UserTypeId)
        {
            try
            {
                var dbHandler = new dbHandler();
                var param = new SqlParameter[2];
                string clientIpAddress = System.Web.HttpContext.Current.Request.UserHostAddress;
                param[0] = new SqlParameter("@UserTypeId", UserTypeId);
                param[1] = new SqlParameter("@clientIpAddress", clientIpAddress);
                var dt = dbHandler.ReturnDataWithStoredProcedureTable("USP_GET_Notification", param);
                HttpResponseMessage response = Request.CreateResponse(HttpStatusCode.OK, dt);
                return response;
            }
            catch (Exception ex)
            {
                dbHandler.SaveErorr("USP_GET_Notification", 0, ex.Message);
                HttpResponseMessage response = Request.CreateResponse(HttpStatusCode.OK, ex.Message);
                return response;
            }
        }


        [HttpGet, ActionName("GetNotificationsActiveByUser")]
        public HttpResponseMessage GetNotificationsActiveByUser(int UserTypeId)
        {
            try
            {
                var dbHandler = new dbHandler();
                var param = new SqlParameter[1];
                param[0] = new SqlParameter("@UserTypeId", UserTypeId);
                var dt = dbHandler.ReturnDataWithStoredProcedureTable("USP_GET_Notification_Active", param);
                HttpResponseMessage response = Request.CreateResponse(HttpStatusCode.OK, dt);
                return response;
            }
            catch (Exception ex)
            {
                dbHandler.SaveErorr("USP_GET_Notification_Active", 0, ex.Message);
                throw ex;
            }
        }


        [HttpGet, ActionName("GetCircularByUser")]
        public HttpResponseMessage GetCircularByUser(int UserTypeId)
        {
            try
            {
                var dbHandler = new dbHandler();
                var param = new SqlParameter[1];
                param[0] = new SqlParameter("@UserTypeId", UserTypeId);
                var dt = dbHandler.ReturnDataWithStoredProcedureTable("SBP_GET_CircularByUserType", param);
                HttpResponseMessage response = Request.CreateResponse(HttpStatusCode.OK, dt);
                return response;
            }
            catch (Exception ex)
            {
                dbHandler.SaveErorr("SBP_GET_CircularByUserType", 0, ex.Message);
                throw ex;
            }
        }



        [HttpGet, ActionName("GetBranchList")]
        public HttpResponseMessage GetBranchList(string @CollegeCode)
        {
            try
            {
                var dbHandler = new dbHandler();
                var param = new SqlParameter[1];
                param[0] = new SqlParameter("@CollegeCode", CollegeCode);

                var dt = dbHandler.ReturnDataWithStoredProcedureTable("ADM_GET_BRANCHLIST", param);
                HttpResponseMessage response = Request.CreateResponse(HttpStatusCode.OK, dt);
                return response;
            }
            catch (Exception ex)
            {
                dbHandler.SaveErorr("ADM_GET_BRANCHLIST", 0, ex.Message);
                throw ex;
            }
        }

        [HttpGet, ActionName("getActiveSchemes")]
        public string getActiveSchemes()
        {
            try
            {
                var dbHandler = new dbHandler();
                string StrQuery = "";
                StrQuery = "exec USP_GET_SCHEMES";
                var res = dbHandler.ReturnDataSet(StrQuery);
                return JsonConvert.SerializeObject(res);
            }
            catch (Exception ex)
            {
                dbHandler.SaveErorr("USP_GET_SCHEMES", 0, ex.Message);
                return ex.Message;
            }
        }

        [HttpGet, ActionName("getCirculars")]
        public string getCirculars()
        {
            try
            {
                var dbHandler = new dbHandler();
                string StrQuery = "";
                StrQuery = "exec ADM_GET_Circular";
                var res = dbHandler.ReturnDataSet(StrQuery);
                return JsonConvert.SerializeObject(res);
            }
            catch (Exception ex)
            {
                dbHandler.SaveErorr("ADM_GET_Circular", 0, ex.Message);
                return ex.Message;
            }
        }

        [HttpGet, ActionName("getTenders")]
        public string getTenders()
        {
            try
            {
                var dbHandler = new dbHandler();
                string StrQuery = "";
                StrQuery = "exec ADM_GET_Tenders";
                var res = dbHandler.ReturnDataSet(StrQuery);
                return JsonConvert.SerializeObject(res);
            }
            catch (Exception ex)
            {
                dbHandler.SaveErorr("ADM_GET_Tenders", 0, ex.Message);
                return ex.Message;
            }
        }

        [HttpGet, ActionName("getCircularsActive")]
        public string getCircularsActive()
        {
            try
            {
                var dbHandler = new dbHandler();
                string StrQuery = "";
                StrQuery = "exec ADM_GET_Circulars_Active";
                var res = dbHandler.ReturnDataSet(StrQuery);
                return JsonConvert.SerializeObject(res);
            }
            catch (Exception ex)
            {
                dbHandler.SaveErorr("ADM_GET_Circulars_Active", 0, ex.Message);
                return ex.Message;
            }
        }

        [HttpGet, ActionName("getTendersActive")]
        public string getTendersActive()
        {
            try
            {
                var dbHandler = new dbHandler();
                string StrQuery = "";
                StrQuery = "exec ADM_GET_Tenders_Active";
                var res = dbHandler.ReturnDataSet(StrQuery);
                return JsonConvert.SerializeObject(res);
            }
            catch (Exception ex)
            {
                dbHandler.SaveErorr("ADM_GET_Tenders_Active", 0, ex.Message);
                return ex.Message;
            }
        }



        [HttpGet, ActionName("GetUserIdStatus")]
        public HttpResponseMessage GetUserIdStatus(string UserName)
        {
            try
            {
                var dbHandler = new dbHandler();
                var param = new SqlParameter[1];
                param[0] = new SqlParameter("@UserName", UserName);
                var dt = dbHandler.ReturnDataWithStoredProcedureTable("ADM_GET_UserIdStatus", param);
                HttpResponseMessage response = Request.CreateResponse(HttpStatusCode.OK, dt);
                return response;
            }
            catch (Exception ex)
            {
                dbHandler.SaveErorr("ADM_GET_UserIdStatus", 0, ex.Message);
                throw ex;
            }

        }


        public class userDetails
        {
            public int UserTypeId { get; set; }
            public string UserName { get; set; }
            public string UserPassword { get; set; }
            public DateTime ExpiryDate { get; set; }
            public string FirstName { get; set; }
            public string LastName { get; set; }
            public string Address1 { get; set; }
            public string EmailId { get; set; }
            public string CellNo { get; set; }
            public int CollegeId { get; set; }
            public int BranchId { get; set; }


        }

        [HttpPost, ActionName("createUser")]
        public HttpResponseMessage createUser([FromBody] userDetails request)
        {
            try
            {
                var dbHandler = new dbHandler();
                var param = new SqlParameter[11];
                param[0] = new SqlParameter("@UserTypeId", request.UserTypeId);
                param[1] = new SqlParameter("@UserName", request.UserName);
                param[2] = new SqlParameter("@UserPassword", request.UserPassword);
                param[3] = new SqlParameter("@ExpiryDate", request.ExpiryDate);
                param[4] = new SqlParameter("@FirstName", request.FirstName);
                param[5] = new SqlParameter("@LastName", request.LastName);
                param[6] = new SqlParameter("@Address1", request.Address1);
                param[7] = new SqlParameter("@EmailId", request.EmailId);
                param[8] = new SqlParameter("@CellNo", request.CellNo);
                param[9] = new SqlParameter("@CollegeId", request.CollegeId);
                param[10] = new SqlParameter("@BranchId", request.BranchId);
                var dt = dbHandler.ReturnDataWithStoredProcedureTable("ADM_SET_CreateNewLogin", param);
                HttpResponseMessage response = Request.CreateResponse(HttpStatusCode.OK, dt);
                return response;
            }
            catch (Exception ex)
            {
                dbHandler.SaveErorr("ADM_SET_CreateNewLogin", 0, ex.Message);
                throw ex;
            }
        }
        //[HttpPost, ActionName("PostNotification")]
        //public HttpResponseMessage PostNotification([FromBody]notification request)
        //{
        //    try
        //    {
        //        var dbHandler = new dbHandler();
        //        var param = new SqlParameter[4];
        //        param[0] = new SqlParameter("@Notification ", request.Notification);
        //        param[1] = new SqlParameter("@UserTypeId ", request.UserTypeId);
        //        param[2] = new SqlParameter("@fromDate ", request.fromDate);
        //        param[3] = new SqlParameter("@ToDate ", request.ToDate);
        //        var dt = dbHandler.ReturnDataWithStoredProcedureTable("USP_SET_Notification", param);
        //        HttpResponseMessage response = Request.CreateResponse(HttpStatusCode.OK, dt);
        //        return response;
        //    }
        //    catch (Exception ex)
        //    {
        //        dbHandler.SaveErorr("USP_SET_Notification", 0, ex.Message);
        //        throw ex;
        //    }

        //}

        public class NotificationData
        {
            public string Notification { get; set; }
            public int UserTypeId { get; set; }
            public DateTime FromDate { get; set; }
            public DateTime ToDate { get; set; }

        }



        [HttpPost, ActionName("PostNotification")]
        public string PostNotification([FromBody] JsonObject NotificationData)
        {
            try
            {
                var dbHandler = new dbHandler();
                var param = new SqlParameter[1];
                param[0] = new SqlParameter("@Json", NotificationData["Json"]);
                var res = dbHandler.ReturnDataWithStoredProcedureTable("ADM_SET_Notification", param);
                return JsonConvert.SerializeObject(res);
            }
            catch (Exception ex)
            {

                dbHandler.SaveErorr("ADM_SET_Notification", 0, ex.Message);
                return ex.Message;
            }
        }
        [HttpGet, ActionName("GetSemester")]
        public HttpResponseMessage GetSemester(int UserType)
        {
            try
            {
                var dbHandler = new dbHandler();
                var param = new SqlParameter[1];
                param[0] = new SqlParameter("@UserType", UserType);

                var dt = dbHandler.ReturnDataWithStoredProcedure("USP_Admission_GET_SemSchemes ", param);
                HttpResponseMessage response = Request.CreateResponse(HttpStatusCode.OK, dt);
                return response;
            }
            catch (Exception ex)
            {
                dbHandler.SaveErorr("USP_Admission_GET_SemSchemes ", 0, ex.Message);
                throw ex;
            }
        }

        [HttpGet, ActionName("GetTicketsCount")]
        public string GetTicketsCount(string UserName)
        {
            try
            {
                var dbHandler = new dbHandler();
                var param = new SqlParameter[1];
                param[0] = new SqlParameter("@UserName", UserName);

                var dt = dbHandler.ReturnDataWithStoredProcedure("SP_Get_UserTaskCounts ", param);
                return JsonConvert.SerializeObject(dt);

            }
            catch (Exception ex)
            {
                return ex.Message;

            }
        }

        private static void elapse(object sender, ElapsedEventArgs e, string s)
        {
            System.IO.File.Delete(s);
            ((Timer)sender).Stop();
            ((Timer)sender).Dispose();
        }


        [HttpGet, ActionName("GetStatusWiseTickets")]
        public string GetStatusWiseTickets(int DataType, string UserName)
        {
            try
            {
                var dbHandler = new dbHandler();
                string StrQuery = "SP_Get_StatusWiseTaskData ";
                string Name = "";
                var param = new SqlParameter[2];
                param[0] = new SqlParameter("@DataType", DataType);
                param[1] = new SqlParameter("@UserName", UserName);
                var ds = dbHandler.ReturnDataWithStoredProcedure(StrQuery, param);
                if (DataType == 1)
                {
                    Name = "Pending";
                }
                else if (DataType == 2)
                {
                    Name = "Approve";
                }
                else if (DataType == 3)
                {
                    Name = "Under Process";
                }
                else if (DataType == 4)
                {
                    Name = "Completed";
                }
                var filename = Name + "_StatusWiseReport_" + ".xlsx";
                var eh = new ExcelHelper();
                var path = ConfigurationManager.AppSettings["DownloadsFolderPath"];
                bool folderExists = Directory.Exists(path);
                if (!folderExists)
                    Directory.CreateDirectory(path);
                eh.ExportDataSet(ds, path + filename);
                Timer timer = new Timer(30000);
                timer.Elapsed += (sender, e) => elapse(sender, e, ConfigurationManager.AppSettings["DownloadsFolderPath"] + filename);
                timer.Start();
                return "/Downloads/" + filename;
            }
            catch (Exception ex)
            {
                return "Error Occured. Please Try Again";
            }
        }

        public class person
        {

            public string Image { get; set; }
            public string file { get; set; }
            public string ResponceCode { get; set; }
            public string ResponceDescription { get; set; }
        }




        private string GetWebAppRoot()
        {
            var env = ConfigurationManager.AppSettings["SMS_ENV"].ToString();
            string host = (HttpContext.Current.Request.Url.IsDefaultPort) ?
               HttpContext.Current.Request.Url.Host :
               HttpContext.Current.Request.Url.Authority;
            if (env == "PROD")
            {
                host = String.Format("{0}://{1}", HttpContext.Current.Request.Url.Scheme, host);
                return host + "/";
            }
            else if (env == "DEV")
            {

                host = String.Format("{0}://{1}", HttpContext.Current.Request.Url.Scheme, host);
                return host + HttpContext.Current.Request.ApplicationPath;
            }
            return host + "/";
        }


        [HttpGet, ActionName("GetorEditorDeleteTicketsData")]
        public string GetorEditorDeleteTicketsData(int DataType, string UserName, int TaskID)
        {
            var dbHandler = new dbHandler();

            try
            {
                var param = new SqlParameter[3];
                param[0] = new SqlParameter("@DataType", DataType);
                param[1] = new SqlParameter("@UserName", UserName);
                param[2] = new SqlParameter("@TaskID", TaskID);
                var dt = dbHandler.ReturnDataWithStoredProcedure("SP_Get_Edit_Delete_Task", param);
                return JsonConvert.SerializeObject(dt);
            }
            catch (Exception ex)
            {

                dbHandler.SaveErorr("SP_Get_Edit_Delete_Task", 0, ex.Message);
                return ex.Message;
            }

        }

        [HttpGet, ActionName("GetTicketsCountData")]
        public string GetTicketsCountData(int DataType, string UserName, string User, int ProjectID)
        {
            var dbHandler = new dbHandler();

            try
            {
                var param = new SqlParameter[4];
                param[0] = new SqlParameter("@DataType", DataType);
                param[1] = new SqlParameter("@UserName", UserName);
                param[2] = new SqlParameter("@User", User);
                param[3] = new SqlParameter("@ProjectID", ProjectID);
                var dt = dbHandler.ReturnDataWithStoredProcedure("SP_Get_UserTaskCountsData", param);
                return JsonConvert.SerializeObject(dt);
            }
            catch (Exception ex)
            {

                dbHandler.SaveErorr("SP_Get_UserTaskCountsData", 0, ex.Message);
                return ex.Message;
            }

        }

        public class TicketsData
        {
            public int ID { get; set; }
            public string Title { get; set; }
            public string TaskDescription { get; set; }
            public string TicketFilePath { get; set; }
            public string UpdatedFilePath { get; set; }
            public string UpdatedFileName { get; set; }
            public string TicketFileName { get; set; }
            public int CircularTypeId { get; set; }
            public DateTime TaskDate { get; set; }
            public int DataType { get; set; }
            public int TaskID { get; set; }
            public int TaskTypeID { get; set; }
            public int ProjectID { get; set; }
            public string Remarks { get; set; }
            public string UserName { get; set; }
            public bool Active { get; set; }
            public int Status { get; set; }
            public string CompletionStatus { get; set; }
            public string WorkAssignedTo { get; set; }

            public string StatusRemarks { get; set; }
            public string TaskRemarks { get; set; }

        }

        [HttpPost, ActionName("AddorUpdateorDeleteTickets")]
        public HttpResponseMessage AddorUpdateorDeleteTickets([FromBody] TicketsData TicketsData)
        {
            try
            {

                var TicketFilePath = string.Empty;
                if (TicketsData.DataType == 1)
                {
                    string relativePath = string.Empty;
                    var path = ConfigurationManager.AppSettings["TicketsPath"];
                    var TicketName = TicketsData.TicketFileName;
                    bool folder = Directory.Exists(path);
                    if (!folder)
                        Directory.CreateDirectory(path);
                    string TicketPath = Path.Combine(path, TicketName);

                    byte[] PrincipalimageBytes = Convert.FromBase64String(TicketsData.TicketFilePath);
                    File.WriteAllBytes(TicketPath, PrincipalimageBytes);
                    relativePath = TicketPath.Replace(HttpContext.Current.Request.PhysicalApplicationPath, GetWebAppRoot()).Replace(@"\", "/");
                    TicketFilePath = relativePath;
                }
                else if (TicketsData.DataType == 2 && TicketsData.TicketFilePath != "Empty")
                {
                    string relativePath = string.Empty;
                    var path = ConfigurationManager.AppSettings["TicketsPath"];
                    var TicketName = TicketsData.TicketFileName;
                    bool folder = Directory.Exists(path);
                    if (!folder)
                        Directory.CreateDirectory(path);
                    string TicketPath = Path.Combine(path, TicketName);

                    byte[] PrincipalimageBytes = Convert.FromBase64String(TicketsData.TicketFilePath);
                    File.WriteAllBytes(TicketPath, PrincipalimageBytes);
                    relativePath = TicketPath.Replace(HttpContext.Current.Request.PhysicalApplicationPath, GetWebAppRoot()).Replace(@"\", "/");
                    TicketFilePath = relativePath;
                }
                else
                {
                    TicketFilePath = TicketsData.TicketFilePath;
                }

                var dbHandler = new dbHandler();
                var param = new SqlParameter[10];
                param[0] = new SqlParameter("@DataType", TicketsData.DataType);
                param[1] = new SqlParameter("@TaskID", TicketsData.TaskID);
                param[2] = new SqlParameter("@TaskTypeID", TicketsData.TaskTypeID);
                param[3] = new SqlParameter("@ProjectID", TicketsData.ProjectID);
                param[4] = new SqlParameter("@TaskDescription", TicketsData.TaskDescription);
                param[5] = new SqlParameter("@TicketFilePath", TicketFilePath);
                param[6] = new SqlParameter("@TaskDate", TicketsData.TaskDate);
                param[7] = new SqlParameter("@TaskRemarks", TicketsData.TaskRemarks);
                param[8] = new SqlParameter("@Active", TicketsData.Active);
                param[9] = new SqlParameter("@UserName", TicketsData.UserName);
                var dt = dbHandler.ReturnDataWithStoredProcedureTable("SP_Add_Update_Tasks", param);
                HttpResponseMessage response = Request.CreateResponse(HttpStatusCode.OK, dt);
                return response;

            }
            catch (Exception ex)
            {

                dbHandler.SaveErorr("SP_Add_Update_Tasks", 0, ex.Message);
                return Request.CreateResponse(HttpStatusCode.InternalServerError, ex.Message);
            }
        }

        [HttpPost, ActionName("UpdateCountsData")]
        public HttpResponseMessage UpdateCountsData([FromBody] TicketsData TicketsData)
        {
            try
            {
                var dbHandler = new dbHandler();
                var param = new SqlParameter[3];
                param[0] = new SqlParameter("@TaskID", TicketsData.TaskID);
                param[1] = new SqlParameter("@Status", TicketsData.Status);
                param[2] = new SqlParameter("@Remarks", TicketsData.Remarks);
                var dt = dbHandler.ReturnDataWithStoredProcedureTable("SP_Update_CountsData", param);
                HttpResponseMessage response = Request.CreateResponse(HttpStatusCode.OK, dt);
                return response;

            }
            catch (Exception ex)
            {

                dbHandler.SaveErorr("SP_Update_CountsData", 0, ex.Message);
                return Request.CreateResponse(HttpStatusCode.InternalServerError, ex.Message);
            }
        }

        [HttpPost, ActionName("UpdateWorkStatus")]
        public HttpResponseMessage UpdateWorkStatus([FromBody] TicketsData TicketsData)
        {
            try
            {
                var UpdatedFilePath = string.Empty;
                if (TicketsData.DataType == 1)
                {
                    string relativePath = string.Empty;
                    var path = ConfigurationManager.AppSettings["UpdatedTicketsPath"];
                    var TicketName = TicketsData.TicketFileName;
                    bool folder = Directory.Exists(path);
                    if (!folder)
                        Directory.CreateDirectory(path);
                    string TicketPath = Path.Combine(path, TicketName);

                    byte[] PrincipalimageBytes = Convert.FromBase64String(TicketsData.TicketFilePath);
                    File.WriteAllBytes(TicketPath, PrincipalimageBytes);
                    relativePath = TicketPath.Replace(HttpContext.Current.Request.PhysicalApplicationPath, GetWebAppRoot()).Replace(@"\", "/");
                    UpdatedFilePath = relativePath;
                }
                else if (TicketsData.DataType == 2 && TicketsData.UpdatedFilePath != "Empty")
                {
                    string relativePath = string.Empty;
                    var path = ConfigurationManager.AppSettings["UpdatedTicketsPath"];
                    var TicketName = TicketsData.UpdatedFileName;
                    bool folder = Directory.Exists(path);
                    if (!folder)
                        Directory.CreateDirectory(path);
                    string TicketPath = Path.Combine(path, TicketName);

                    byte[] PrincipalimageBytes = Convert.FromBase64String(TicketsData.UpdatedFilePath);
                    File.WriteAllBytes(TicketPath, PrincipalimageBytes);
                    relativePath = TicketPath.Replace(HttpContext.Current.Request.PhysicalApplicationPath, GetWebAppRoot()).Replace(@"\", "/");
                    UpdatedFilePath = relativePath;
                }
                else
                {
                    UpdatedFilePath = TicketsData.UpdatedFilePath;
                }
                var dbHandler = new dbHandler();
                var param = new SqlParameter[6];
                param[0] = new SqlParameter("@DataType", TicketsData.DataType);
                param[1] = new SqlParameter("@TaskID", TicketsData.TaskID);
                param[2] = new SqlParameter("@WorkAssignedTo", TicketsData.WorkAssignedTo);
                param[3] = new SqlParameter("@CompletionStatus", TicketsData.CompletionStatus);
                param[4] = new SqlParameter("@UpdatedFilePath", UpdatedFilePath);
                param[5] = new SqlParameter("@StatusRemarks", TicketsData.StatusRemarks);
                var dt = dbHandler.ReturnDataWithStoredProcedureTable("SP_Update_WorkAssignedData", param);
                HttpResponseMessage response = Request.CreateResponse(HttpStatusCode.OK, dt);
                return response;

            }
            catch (Exception ex)
            {

                dbHandler.SaveErorr("SP_Update_WorkAssignedData", 0, ex.Message);
                return Request.CreateResponse(HttpStatusCode.InternalServerError, ex.Message);
            }
        }

        [HttpPost, ActionName("UpdateWorkAssigned")]
        public HttpResponseMessage UpdateWorkAssigned([FromBody] TicketsData TicketsData)
        {
            try
            {
                var dbHandler = new dbHandler();
                var param = new SqlParameter[6];
                param[0] = new SqlParameter("@DataType", TicketsData.DataType);
                param[1] = new SqlParameter("@TaskID", TicketsData.TaskID);
                param[2] = new SqlParameter("@WorkAssignedTo", TicketsData.WorkAssignedTo);
                param[3] = new SqlParameter("@CompletionStatus", TicketsData.CompletionStatus);
                param[4] = new SqlParameter("@UpdatedFilePath", TicketsData.UpdatedFilePath);
                param[5] = new SqlParameter("@StatusRemarks", TicketsData.StatusRemarks);
                var dt = dbHandler.ReturnDataWithStoredProcedureTable("SP_Update_WorkAssignedData", param);
                HttpResponseMessage response = Request.CreateResponse(HttpStatusCode.OK, dt);
                return response;

            }
            catch (Exception ex)
            {

                dbHandler.SaveErorr("SP_Update_WorkAssignedData", 0, ex.Message);
                return Request.CreateResponse(HttpStatusCode.InternalServerError, ex.Message);
            }
        }



        [HttpPost, ActionName("SaveScheamdata")]
        public HttpResponseMessage SaveScheamdata([FromBody] JsonObject request)
        {
            try
            {

                var dbHandler = new dbHandler();
                var param = new SqlParameter[2];
                param[0] = new SqlParameter("@UserType", request["UserType"]);

                param[1] = new SqlParameter("@json", request["json"]);
                var dt = dbHandler.ReturnDataWithStoredProcedureTable("USP_Admission_SET_SemSchemes", param);
                HttpResponseMessage response = Request.CreateResponse(HttpStatusCode.OK, dt);
                return response;
            }
            catch (Exception ex)
            {

                dbHandler.SaveErorr("USP_Admission_SET_SemSchemes", 0, ex.Message);
                throw ex;
            }
        }
        [HttpGet, ActionName("GetStatuswiseReport")]
        public string GetStatuswiseReport(int DataType, string UserName)
        {
            var dbHandler = new dbHandler();

            try
            {
                var param = new SqlParameter[2];
                param[0] = new SqlParameter("@DataType", DataType);
                param[1] = new SqlParameter("@UserName", UserName);
                var dt = dbHandler.ReturnDataWithStoredProcedure("SP_Get_StatusWiseTaskData", param);
                return JsonConvert.SerializeObject(dt);
            }
            catch (Exception ex)
            {

                dbHandler.SaveErorr("SP_Get_StatusWiseTaskData", 0, ex.Message);
                return ex.Message;
            }

        }

    }




    public class AdminServiceBaseController : BaseController
    {

        [HttpPost, ActionName("uploadFile")]
        public string uploadFile([FromBody] HttpPostedFileBase file, string Title, string Description, string Ids)
        {
            var path = string.Empty;
            try
            {
                if (file != null && file.ContentLength > 0)
                {
                    var fileName = Path.GetFileName(file.FileName);
                    var eh = new ExcelHelper();
                    path = Path.Combine(Server.MapPath("~/Circulars/"), fileName);
                    file.SaveAs(path);

                    String[] spearator = { "\\softwaresuite\\SoftwareSuite", "" };
                    Int32 count = 2;

                    String[] strlist = path.Split(spearator, count, StringSplitOptions.None);
                    strlist[1] = strlist[1].Replace("\\", "/");
                    //  return path;
                    var dbHandler = new dbHandler();
                    var param = new SqlParameter[4];
                    param[0] = new SqlParameter("@Title", Title);
                    param[1] = new SqlParameter("@Description", Description);
                    param[2] = new SqlParameter("@Url", strlist[1]);
                    param[3] = new SqlParameter("@Ids", Ids);
                    var dt = dbHandler.ReturnDataWithStoredProcedureTable("ADM_SET_Circular", param);
                    return JsonConvert.SerializeObject(dt);
                    //    HttpResponseMessage response = Request.CreateResponse(HttpStatusCode.OK, dt);
                    //return response;
                }

            }
            catch (Exception ex)
            {
                dbHandler.SaveErorr("GetFeePaymentReports", 1, ex.Message + "\n-----------\n" + ex.StackTrace);
                return ex.StackTrace;
            }
            return "0";
        }



    }

}
