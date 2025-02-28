using System;
using System.Collections.Generic;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using System.Web.Http;
using System.Net.Http;
using System.Net;
using Newtonsoft.Json;
using SoftwareSuite.BLL;
using SoftwareSuite.Models.Security;
using System.Data.SqlClient;
using SoftwareSuite.Models.Database;
using System.IO;
using System.Web.Http.Controllers;
using System.Web.Http.Filters;
using System.Linq;
using System.Runtime.Caching;
using OfficeOpenXml.FormulaParsing.LexicalAnalysis;
using SoftwareSuite.Models.CCIC;
using static System.Windows.Forms.VisualStyles.VisualStyleElement.StartPanel;
using SoftwareSuite.Controllers.AdminServices;
using MongoDB.Driver.Core.Configuration;



public class AuthController : ApiController
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





    private static int loginAttempts = 0;
    private static bool loginLocked = false;
    private static readonly object lockObj = new object();
    private static readonly string SecretKey = "bXUqvDhzD09JmTmAYbGq3h83flSAzWWldK5OdJjVh64=";

    private async Task ResetLoginAttempts()
    {
        await Task.Delay(60 * 1000);
        lock (lockObj)
        {
            loginAttempts = 0;
            loginLocked = false;
        }
    }

    private static byte[] GenerateSalt(int size = 16)
    {
        var salt = new byte[size];
        using (var rng = new RNGCryptoServiceProvider())
        {
            rng.GetBytes(salt);
        }
        return salt;
    }

    private static byte[] HashWithSalt(string data, byte[] salt)
    {
        using (var sha256 = SHA256.Create())
        {
            byte[] dataBytes = Encoding.UTF8.GetBytes(data);
            byte[] dataWithSalt = new byte[dataBytes.Length + salt.Length];
            Buffer.BlockCopy(dataBytes, 0, dataWithSalt, 0, dataBytes.Length);
            Buffer.BlockCopy(salt, 0, dataWithSalt, dataBytes.Length, salt.Length);
            return sha256.ComputeHash(dataWithSalt);
        }
    }

    //private static bool CompareByteArrays(byte[] a, byte[] b)
    //{
    //    if (a.Length != b.Length) return false;
    //    for (int i = 0; i < a.Length; i++)
    //    {
    //        if (a[i] != b[i]) return false;
    //    }
    //    return true;
    //}

    private static string GenerateHMAC(string data)
    {
        byte[] key = Convert.FromBase64String(SecretKey);
        using (var hmac = new HMACSHA256(key))
        {
            byte[] hash = hmac.ComputeHash(Encoding.UTF8.GetBytes(data));
            return Convert.ToBase64String(hash);
        }
    }

    private static bool SlowEquals(byte[] a, byte[] b)
    {
        int diff = a.Length ^ b.Length;
        for (int i = 0; i < a.Length && i < b.Length; i++)
        {
            diff |= a[i] ^ b[i];
        }
        return diff == 0;
    }

    private static bool IsValidRequest(SecureRequest requestData)
    {
        if (requestData == null || string.IsNullOrEmpty(requestData.NameofUser)) return false;
        string computedHMAC = GenerateHMAC(requestData.GetDataString());
        return SlowEquals(Convert.FromBase64String(requestData.NameofUser), Convert.FromBase64String(computedHMAC));
    }

    internal class Output
    {
        public string ResponceCode { get; internal set; }
        public string ResponceDescription { get; internal set; }
        public string Captcha { get; internal set; }


        public string captcha { get; set; }
        public string Data { get; internal set; }
    }

    [AuthorizationFilter][HttpGet, ActionName("GetDecryptedData")]
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

    [AuthorizationFilter][HttpPost, ActionName("GetUserData")]
    public string GetUserData(string UserName)
    {
        try
        {


            string decrptedUserName = GetDecryptedData(UserName.ToString());
            var dbHandler = new dbHandler();
            var param = new SqlParameter[1];
            param[0] = new SqlParameter("@UserName", decrptedUserName);
            var dt = dbHandler.ReturnDataWithStoredProcedureTable("SP_Get_UserHash", param);
            return JsonConvert.SerializeObject(dt);
        }
        catch (Exception ex)
        {

            dbHandler.SaveErorr("SP_Get_AccountStatus", 0, ex.Message);
            return ex.Message;
        }
    }

    [AuthorizationFilter]
    [AuthorizationFilter][HttpPost, ActionName("AddorGetAccountStatus")]
    public string AddorGetAccountStatus(string DataType, string UserName)
    {
        try
        {


            string decrptedDataType = GetDecryptedData(DataType.ToString());
            string decrptedUserName = GetDecryptedData(UserName.ToString());
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

    private HttpResponseMessage EncryptedResponse(string message)
    {
        string key = "iT9/CmEpJz5Z1mkXZ9CeKXpHpdbG0a6XY0Fj1WblmZA=";
        string iv = "u4I0j3AQrwJnYHkgQFwVNw==";
        string encryptedMessage = Encryption.Encrypt(message, key, iv);
        return Request.CreateResponse(HttpStatusCode.OK, new { MESSAGE = encryptedMessage });
    }






    // SHA-256 Hash Function
    private string ComputeSHA256Hash(string input)
    {
        using (SHA256 sha256 = SHA256.Create())
        {
            byte[] bytes = Encoding.UTF8.GetBytes(input);
            byte[] hashBytes = sha256.ComputeHash(bytes);
            return BitConverter.ToString(hashBytes).Replace("-", "").ToLower();
        }
    }

    [AuthorizationFilter]
    [AuthorizationFilter][HttpGet, ActionName("UpdatePassword")]
    public void UpdatePassword(string UserName, string Password, string Salt)
    {
        var dbHandler = new dbHandler();

        try
        {
            string decryptedUserName = GetDecryptedData(UserName);

            var param = new SqlParameter[3];
            param[0] = new SqlParameter("@UserName", decryptedUserName);
            param[1] = new SqlParameter("@Password", Password);
            param[2] = new SqlParameter("@Salt", Salt);
            var dt = dbHandler.ReturnDataWithStoredProcedure("SP_Update_Password", param);
        }
        catch (Exception ex)
        {

            dbHandler.SaveErorr("SP_Update_Password", 0, ex.Message);
        }

    }


    [AuthorizationFilter]
    [AuthorizationFilter][HttpGet, ActionName("UpdateNonce")]
    public void UpdateNonce(string UserName,string Nonce)
    {
        var dbHandler = new dbHandler();

        try
        {
            string decryptedUserName = GetDecryptedData(UserName);

            var param = new SqlParameter[2];
            param[0] = new SqlParameter("@UserName", decryptedUserName);
            param[1] = new SqlParameter("@Nonce", Nonce);
            var dt = dbHandler.ReturnDataWithStoredProcedure("SP_Update_Nonce", param);
        }
        catch (Exception ex)
        {

            dbHandler.SaveErorr("SP_Update_Nonce", 0, ex.Message);
        }

    }

    // Generate a secure nonce (random string)
    public static string GenerateNonce(int size = 32)
    {
        byte[] nonceBytes = new byte[size];
        using (var rng = new RNGCryptoServiceProvider())
        {
            rng.GetBytes(nonceBytes);
        }
        return Convert.ToBase64String(nonceBytes);
    }

    [HttpPost]
    [Route("api/getNonceAndSalt")]
    public string GetNonceAndSalt([FromBody] dynamic requestData)
    {
        try
        {
            // Ensure UserName exists in the request
            if (requestData == null || requestData.UserName == null)
                return JsonConvert.SerializeObject(new { message = "Invalid request. UserName is required." });

            string encryptedUserName = requestData.UserName.ToString();

            // Step 1: Decrypt the username
            string decryptedUserName = GetDecryptedData(encryptedUserName);

            // Step 2: Generate a unique nonce
            string Nonce = GenerateNonce();

            // Step 3: Get Salt from Database
            var users = AddorGetAccountStatus("sBH8FPW8yD6RcKYFqgS9M6CUL2pEt89mpwv6kUZ7nxjJaN49I2LbzlsdRBsmLBJlGrpxuiLo4DahFEQaTixYtmOJ/NXekjCaBtLSf+qogkFnmMTWScxEFf29XORE2CmX1i/6oSKPKc9uZ5qYuzqx5g==$$@@$$hvrotvfuno", encryptedUserName);
            var userRecord = JsonConvert.DeserializeObject<List<Dictionary<string, object>>>(users);

            if (userRecord == null || userRecord.Count == 0)
                return JsonConvert.SerializeObject(new { message = "User not found." });

            string Salt = userRecord[0]["Salt"].ToString();

            // Step 4: Return JSON response
            var response = new { nonce = Nonce, salt = Salt };
            return JsonConvert.SerializeObject(response);
        }
        catch (Exception ex)
        {
            return JsonConvert.SerializeObject(new { message = "Error retrieving nonce and salt.", error = ex.Message });
        }
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

    private string GenerateSalt()
    {
        byte[] saltBytes = new byte[16];
        using (var rng = new RNGCryptoServiceProvider())
        {
            rng.GetBytes(saltBytes);
        }
        return Convert.ToBase64String(saltBytes);
    }

    private string HashPassword(string password, string salt)
    {
        using (SHA256 sha256 = SHA256.Create())
        {
            byte[] hashBytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(password + salt));
            return Convert.ToBase64String(hashBytes);
        }
    }


    private string HashPassword(string password, string nonce, string uniqueSalt)
    {
        using (SHA256 sha256 = SHA256.Create())
        {
            byte[] hashBytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(password + nonce + uniqueSalt));
            return Convert.ToBase64String(hashBytes);
        }
    }
    private bool IsNonceUsed(string nonce)
    {
        return nonceCache.Contains(nonce);
    }

    private void MarkNonceAsUsed(string nonce)
    {
        nonceCache.Add(nonce, true, DateTimeOffset.UtcNow.Add(NonceExpiration));
    }

    private static MemoryCache nonceCache = MemoryCache.Default;
    private static readonly TimeSpan NonceExpiration = TimeSpan.FromMinutes(10);

    //[AuthorizationFilter][HttpPost, ActionName("ValidateUserLoginCaptcha")]
    //public async Task<HttpResponseMessage> ValidateUserLoginCaptcha([FromBody] SecureRequest requestData)
    //{


    //    string decryptedLoginName = GetDecryptedData(requestData.LoginName);

    //    //string decryptedPassword = GetDecryptedData(requestData.Password);

    //    string salt = GenerateSalt();
    //    string hashedPassword = HashPassword(requestData.Password, salt);

    //    UpdatePassword(requestData.LoginName, hashedPassword, salt);



    //    var users = AddorGetAccountStatus("sBH8FPW8yD6RcKYFqgS9M6CUL2pEt89mpwv6kUZ7nxjJaN49I2LbzlsdRBsmLBJlGrpxuiLo4DahFEQaTixYtmOJ/NXekjCaBtLSf+qogkFnmMTWScxEFf29XORE2CmX1i/6oSKPKc9uZ5qYuzqx5g==$$@@$$hvrotvfuno", requestData.LoginName);
    //    var userRecord = JsonConvert.DeserializeObject<List<Dictionary<string, object>>>(users);

    //    if (userRecord == null)
    //    {
    //        return Request.CreateResponse(HttpStatusCode.OK, new { MESSAGE = "User not found." });
    //    }





    //    // Step 1: Retrieve stored Base64 hash & salt from DB

    //    string storedHashedPassword = userRecord[0]["UserPassword"].ToString();
    //    string storedSalt = userRecord[0]["Salt"].ToString();


    //    // Compute the expected hash
    //    string expectedHash = HashPassword(storedHashedPassword, requestData.Nonce, requestData.Salt);




    //    if (!IsValidRequest(requestData))
    //    {
    //        return EncryptedResponse("Tampered request detected!");

    //    }


    //    string loginLock = loginLocked ? "Yes" : "No";


    //    //string DataType = "1482cS+YzslJtmNjRWaaRgEVGBuxXXnqhU5WaptbY14kryoQ6HfnRxJgnmKWzqRBfp9RORS/dwlutMR6IA+Qlaf0Io2Ao7cfL1UJ0/hja+jkZ6C5GyuzEy6ZDzxEGX4CBXn9taRmDr0JYogxBWJT8Q==$$@@$$zkdrgkjzna";



    //    string AccountLocked = userRecord[0]["AccountLocked"].ToString();

    //    lock (lockObj)
    //    {
    //        if (loginLock == "Yes" && AccountLocked == "true")
    //        {
    //            return EncryptedResponse("Account temporarily locked. Try again later.");
    //        }
    //    }
    //    var dbHandler = new dbHandler();
    //    List<Output> p = new List<Output>();
    //    Output p1 = new Output();
    //    var captcha = string.Empty;
    //    string token = "";
    //    string decryptsessionid = null;
    //    string decryptedCaptcha = GetDecryptedData(requestData.Captcha);

    //    var res = requestData.Session.ToString().Split(new string[] { "$$@@$$" }, StringSplitOptions.None);
    //    var crypt = new HbCrypt(res[1]);
    //    var encrypt = new HbCrypt();
    //    string sessionid = crypt.AesDecrypt(res[0]);
    //    decryptsessionid = encrypt.AesDecrypt(sessionid);

    //    var param = new SqlParameter[2];
    //    param[0] = new SqlParameter("@SessionId", decryptsessionid);
    //    param[1] = new SqlParameter("@Captcha", decryptedCaptcha);
    //    var dt = dbHandler.ReturnDataWithStoredProcedureTable("USP_TEST_GET_ExamsCaptchaSessionLog", param);

    //    if (dt.Rows[0]["ResponseCode"].ToString() != "200")
    //    {
    //        return EncryptedResponse("Invalid Captcha");

    //    }

    //    var userAuth = new SystemUserBLL().GetUserLogin(decryptedLoginName, System.Web.HttpContext.Current.Request.UserHostAddress);
    //    StringBuilder builder = new StringBuilder();
    //    Random random = new Random();
    //    char ch;
    //    for (int i = 0; i < 10; i++)
    //    {
    //        ch = Convert.ToChar(Convert.ToInt32(Math.Floor(26 * random.NextDouble() + 65)));
    //        builder.Append(ch);

    //    }
    //    AddTokenToStore(builder.ToString().ToLower());
    //    if (userAuth.SystemUser.Count == 0 || userAuth.UserAuth[0].ResponceCode != "200")
    //    {
    //        lock (lockObj) { loginAttempts++; }
    //        if (loginAttempts > 2)
    //        {
    //            lock (lockObj) { loginLocked = true; }
    //            Task.Run(() => ResetLoginAttempts());
    //            return EncryptedResponse("Account locked for 1 minute.");
    //        }
    //        return EncryptedResponse("Invalid username or password");

    //    }

    //    var user = userAuth.SystemUser[0];
    //    if (requestData.HashedPassword == expectedHash)
    //    {
    //        // Prevent nonce reuse by storing it in DB (or cache) and marking it as used
    //        if (IsNonceUsed(requestData.Nonce))
    //        {
    //            return EncryptedResponse("Nonce already used");
    //        }
    //        MarkNonceAsUsed(requestData.Nonce);
    //        lock (lockObj) { loginAttempts++; }
    //        if (loginAttempts > 2)
    //        {
    //            lock (lockObj) { loginLocked = true; }
    //            Task.Run(() => ResetLoginAttempts());
    //            return EncryptedResponse("Account locked for 1 minute.");
    //        }
    //        return EncryptedResponse("Invalid username or password");
    //    }


    //    lock (lockObj) { loginAttempts = 0; } // Reset login attempts on successful login


    //    string clientIpAddress = System.Web.HttpContext.Current.Request.UserHostAddress;

    //    HttpResponseMessage response = Request.CreateResponse(HttpStatusCode.OK, new { token, data = User, clientIpAddress });

    //    AuthToken t = new AuthToken
    //    {
    //        UserName = user.UserName ?? "",
    //        UserId = user.UserId ?? "",
    //        UserTypeId = user.UserTypeId ?? "",
    //        CollegeId = user.CollegeId ?? "",
    //        CollegeName = user.CollegeName ?? "",
    //        CollegeCode = user.CollegeCode ?? "",
    //        collegeType = user.collegeType ?? "",
    //        BranchCode = user.BranchCode ?? "",
    //        BranchId = user.BranchId ?? "",
    //        ResponceCode = user.ResponceCode ?? "",
    //        RespoceDescription = user.RespoceDescription ?? "",
    //        ExpiryDate = DateTime.Now.AddHours(1),
    //        AuthTokenId = builder.ToString().ToLower()
    //    };
    //    string username = user.UserName;
    //    var userid = user.UserId;
    //    var collegeid = user.CollegeId;
    //    var collegename = user.CollegeName;
    //    var usertypeid = user.UserTypeId;
    //    var ccode = user.CollegeCode;
    //    var ctype = user.collegeType;
    //    var bcode = user.BranchCode;
    //    var bid = user.BranchId;
    //    var rescode = user.ResponceCode;
    //    var resdesc = user.RespoceDescription;
    //    var AuthTokenId = builder.ToString().ToLower();

    //    string key = "iT9/CmEpJz5Z1mkXZ9CeKXpHpdbG0a6XY0Fj1WblmZA="; // AES-256 key
    //    string iv = "u4I0j3AQrwJnYHkgQFwVNw==";     // AES IV

    //    string USERNAME = Encryption.Encrypt(username, key, iv);
    //    string USERID = Encryption.Encrypt(userid, key, iv);
    //    string COLLEGEID = Encryption.Encrypt(collegeid, key, iv);
    //    string CNAME = Encryption.Encrypt(collegename, key, iv);
    //    string USERTYPEID = Encryption.Encrypt(usertypeid, key, iv);
    //    string CCODE = Encryption.Encrypt(ccode, key, iv);
    //    string CTYPE = Encryption.Encrypt(ctype, key, iv);
    //    string BCODE = Encryption.Encrypt(bcode, key, iv);
    //    string BID = Encryption.Encrypt(bid, key, iv);
    //    string RESPONSECODE = Encryption.Encrypt(rescode, key, iv);
    //    string RESDESCRIPTION = Encryption.Encrypt(resdesc, key, iv);
    //    var hbcrypt = new HbCrypt();
    //    token = hbcrypt.Encrypt(JsonConvert.SerializeObject(t));
    //    response = Request.CreateResponse(HttpStatusCode.OK, new { token, USERTYPEID, USERID, USERNAME, COLLEGEID, CCODE, CTYPE, CNAME, BID, BCODE, RESPONSECODE, RESDESCRIPTION, t.ExpiryDate, AuthTokenId });
    //    return response;

    //}




    //[AuthorizationFilter][HttpPost, ActionName("ValidateUserLoginCaptcha")]
    //public async Task<HttpResponseMessage> ValidateUserLoginCaptcha([FromBody] SecureRequest requestData)
    //{
    //    string decryptedLoginName = GetDecryptedData(requestData.LoginName);
    //    //string decryptedEnterPassword = GetDecryptedData(requestData.Password);

    //    string EnteredHashPassword = requestData.Password;

    //    // Fetch user data from DB
    //    var users = AddorGetAccountStatus("sBH8FPW8yD6RcKYFqgS9M6CUL2pEt89mpwv6kUZ7nxjJaN49I2LbzlsdRBsmLBJlGrpxuiLo4DahFEQaTixYtmOJ/NXekjCaBtLSf+qogkFnmMTWScxEFf29XORE2CmX1i/6oSKPKc9uZ5qYuzqx5g==$$@@$$hvrotvfuno", requestData.LoginName);
    //    var userRecord = JsonConvert.DeserializeObject<List<Dictionary<string, object>>>(users);

    //    if (userRecord == null || userRecord.Count == 0)
    //    {
    //        return Request.CreateResponse(HttpStatusCode.OK, new { MESSAGE = "User not found." });
    //    }


    //     // Step 1: Retrieve stored Base64 hash & salt from DB
    //    string storedPasswordHash = userRecord[0]["UserPassword"].ToString();
    //    string storedSalt = userRecord[0]["Salt"].ToString();
    //    string accountLocked = userRecord[0]["AccountLocked"].ToString();

    //    //    // Compute the expected hash
    //       //string expectedHash = HashPassword(EnteredHashPassword, storedSalt);


    //    if (!IsValidRequest(requestData))
    //    {
    //        return EncryptedResponse("Tampered request detected!");
    //    }

    //    lock (lockObj)
    //    {
    //        if (loginLocked && accountLocked == "true")
    //        {
    //            return EncryptedResponse("Account temporarily locked. Try again later.");
    //        }
    //    }

    //    // Captcha verification
    //    string decryptedCaptcha = GetDecryptedData(requestData.Captcha);
    //    var res = requestData.Session.ToString().Split(new string[] { "$$@@$$" }, StringSplitOptions.None);
    //    var crypt = new HbCrypt(res[1]);
    //    var encrypt = new HbCrypt();
    //    string sessionId = crypt.AesDecrypt(res[0]);
    //    string decryptedSessionId = encrypt.AesDecrypt(sessionId);

    //    var param = new SqlParameter[2];
    //    param[0] = new SqlParameter("@SessionId", decryptedSessionId);
    //    param[1] = new SqlParameter("@Captcha", decryptedCaptcha);
    //    var dt = new dbHandler().ReturnDataWithStoredProcedureTable("USP_TEST_GET_ExamsCaptchaSessionLog", param);

    //    if (dt.Rows[0]["ResponseCode"].ToString() != "200")
    //    {
    //        return EncryptedResponse("Invalid Captcha");
    //    }

    //    var userAuth = new SystemUserBLL().GetUserLogin(decryptedLoginName, System.Web.HttpContext.Current.Request.UserHostAddress);

    //    // Generate a new token
    //    StringBuilder builder = new StringBuilder();
    //    Random random = new Random();
    //    for (int i = 0; i < 10; i++)
    //    {
    //        builder.Append((char)('A' + random.Next(26)));
    //    }
    //    string authTokenId = builder.ToString().ToLower();
    //    AddTokenToStore(authTokenId);

    //    if (userAuth.SystemUser.Count == 0 || userAuth.UserAuth[0].ResponceCode != "200")
    //    {
    //        lock (lockObj) { loginAttempts++; }
    //        if (loginAttempts > 2)
    //        {
    //            lock (lockObj) { loginLocked = true; }
    //            Task.Run(() => ResetLoginAttempts());
    //            return EncryptedResponse("Account locked for 1 minute.");
    //        }
    //        return EncryptedResponse("Invalid username or password");
    //    }

    //    var user = userAuth.SystemUser[0];

    //    //if (!isPasswordValid)
    //    //{
    //    //    lock (lockObj) { loginAttempts++; }
    //    //    if (loginAttempts > 2)
    //    //    {
    //    //        lock (lockObj) { loginLocked = true; }
    //    //        Task.Run(() => ResetLoginAttempts());
    //    //        return EncryptedResponse("Account locked for 1 minute.");
    //    //    }
    //    //    return EncryptedResponse("Invalid username or password");
    //    //}

    //    if (EnteredHashPassword != storedPasswordHash)
    //    {

    //        lock (lockObj) { loginAttempts++; }
    //        if (loginAttempts > 2)
    //        {
    //            lock (lockObj) { loginLocked = true; }
    //            Task.Run(() => ResetLoginAttempts());
    //            return EncryptedResponse("Account locked for 1 minute.");
    //        }
    //        return EncryptedResponse("Invalid username or password");
    //    }
    //    // Prevent nonce reuse by storing it in DB (or cache) and marking it as used
    //    if (IsNonceUsed(requestData.Nonce))
    //    {
    //        return EncryptedResponse("Nonce already used");
    //    }
    //    MarkNonceAsUsed(requestData.Nonce);
    //    lock (lockObj) { loginAttempts = 0; } // Reset login attempts on successful login

    //    string clientIpAddress = System.Web.HttpContext.Current.Request.UserHostAddress;

    //    AuthToken t = new AuthToken
    //    {
    //        UserName = user.UserName ?? "",
    //        UserId = user.UserId ?? "",
    //        UserTypeId = user.UserTypeId ?? "",
    //        CollegeId = user.CollegeId ?? "",
    //        CollegeName = user.CollegeName ?? "",
    //        CollegeCode = user.CollegeCode ?? "",
    //        collegeType = user.collegeType ?? "",
    //        BranchCode = user.BranchCode ?? "",
    //        BranchId = user.BranchId ?? "",
    //        ResponceCode = user.ResponceCode ?? "",
    //        RespoceDescription = user.RespoceDescription ?? "",
    //        ExpiryDate = DateTime.Now.AddHours(1),
    //        AuthTokenId = authTokenId
    //    };

    //    string key = "iT9/CmEpJz5Z1mkXZ9CeKXpHpdbG0a6XY0Fj1WblmZA="; // AES-256 key
    //    string iv = "u4I0j3AQrwJnYHkgQFwVNw=="; // AES IV

    //    var hbcrypt = new HbCrypt();
    //    string token = hbcrypt.Encrypt(JsonConvert.SerializeObject(t));

    //    return Request.CreateResponse(HttpStatusCode.OK, new
    //    {
    //        token,
    //        USERTYPEID = Encryption.Encrypt(user.UserTypeId, key, iv),
    //        USERID = Encryption.Encrypt(user.UserId, key, iv),
    //        USERNAME = Encryption.Encrypt(user.UserName, key, iv),
    //        COLLEGEID = Encryption.Encrypt(user.CollegeId, key, iv),
    //        CCODE = Encryption.Encrypt(user.CollegeCode, key, iv),
    //        CTYPE = Encryption.Encrypt(user.collegeType, key, iv),
    //        CNAME = Encryption.Encrypt(user.CollegeName, key, iv),
    //        BID = Encryption.Encrypt(user.BranchId, key, iv),
    //        BCODE = Encryption.Encrypt(user.BranchCode, key, iv),
    //        RESPONSECODE = Encryption.Encrypt(user.ResponceCode, key, iv),
    //        RESDESCRIPTION = Encryption.Encrypt(user.RespoceDescription, key, iv),
    //        t.ExpiryDate,
    //        AuthTokenId = authTokenId
    //    });
    //}




    public class SecureRequest
    {
        public string Session { get; set; }
        public string Captcha { get; set; }
        public string LoginName { get; set; }
        public string Password { get; set; }
        public string DataType { get; set; }
        public string Nonce { get; set; }

        public string NameofUser { get; set; }

        public string GetDataString()
        {
            return $"Session={Session}&Captcha={Captcha}&LoginName={LoginName}&Password={Password}&DataType={DataType}&Nonce={Nonce}";
        }
    }
}
