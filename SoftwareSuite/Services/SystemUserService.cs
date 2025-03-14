﻿using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Web;
using System.Data.SqlClient;
using System.Configuration;
using System.Security.Cryptography;
using System.IO;
using SoftwareSuite.Models.Database;
using static System.Windows.Forms.VisualStyles.VisualStyleElement.StartPanel;
using SoftwareSuite.Models.Security;
using System.Net.Http;
using System.Net;
using System.Web.Http.Controllers;
using System.Web.Http.Filters;
using Newtonsoft.Json;

namespace SoftwareSuite.Services
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

    public class SystemUserService
    {
        #region "Insert/Update/Delete"


        #endregion
        #region "Get Methods"       

        //public DataTable GetUserLogin(dbHandler dbHandler, string UserName, string Password)
        //{

        //    DataTable ds = new DataTable();
        //    try
        //    {
        //        using (var conn = new SqlConnection(dbHandler.GetConnectionString()))
        //        {
        //            using (var cmd = new SqlCommand("SP_ValidateLogin", conn))
        //            {
        //                cmd.CommandType = CommandType.StoredProcedure;
        //                cmd.Parameters.Add(new SqlParameter("@UserName", UserName));
        //                cmd.Parameters.Add(new SqlParameter("@Password", Password));
        //              //  cmd.Parameters.Add(new SqlParameter("@ipaddress", Ipaddress));
        //                conn.Open();
        //                var da = new SqlDataAdapter(cmd);
        //                da.Fill(ds);
        //                conn.Close();
        //            }
        //        }
        //        return ds;


        //    }
        //    catch (Exception ex)
        //    {
        //        
        //        dbHandler.SaveErorr("SystemProgram", 0, ex.Message);
        //        throw ex;
        //    }

        //}
        [AuthorizationFilter]
        public DataSet GetUserLogin(dbHandler dbHandler, string username, string password, string Ipaddress)
        {

            DataSet ds = new DataSet();
            try
            {
                using (var conn = new SqlConnection(dbHandler.GetConnectionString()))
                {
                    using (var cmd = new SqlCommand("USP_GET_UserLoginPermission", conn))
                    {
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add(new SqlParameter("@username", username));
                        cmd.Parameters.Add(new SqlParameter("@password", password));
                        cmd.Parameters.Add(new SqlParameter("@ipaddress", Ipaddress));
                        conn.Open();
                        var da = new SqlDataAdapter(cmd);
                        da.Fill(ds);
                        conn.Close();
                    }
                }
                return ds;


            }
            catch (Exception ex)
            {
                
                dbHandler.SaveErorr("SystemProgram", 0, ex.Message);
                throw ex;
            }

        }
        [AuthorizationFilter]
        public DataTable GetModulesbyRole(dbHandler dbHandler, Int32 UserTypeId)
        {
            try
            {
                var param = new SqlParameter[1];
                param[0] = new SqlParameter("@usertypeid", UserTypeId);
                return dbHandler.ReturnDataWithStoredProcedureTable("USP_GET_Modules", param);

            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        [AuthorizationFilter]
        public DataTable GetSubModulesbyRole(dbHandler dbHandler, Int32 UserTypeId, Int32 moduleId)
        {
            try
            {
                var param = new SqlParameter[2];
                param[0] = new SqlParameter("@usertypeid", UserTypeId);
                param[1] = new SqlParameter("@moduleid", moduleId);
                return dbHandler.ReturnDataWithStoredProcedureTable("USP_GET_SubModules", param);

            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        [AuthorizationFilter]
        public DataTable GetLoginAccess(dbHandler dbHandler, string UserName)
        {
            try
            {
                var param = new SqlParameter[1];
                param[0] = new SqlParameter("@username", UserName);
                return dbHandler.ReturnDataWithStoredProcedureTable("USP_GET_LOGIN_PERMISSION", param);

            }
            catch (Exception ex)
            {
                
                dbHandler.SaveErorr("SystemProgram", 0, ex.Message);
                throw ex;
            }
        }
        [AuthorizationFilter]
        public DataTable GetUsersRightsById(dbHandler dbHandler, Int32 SysModID, Int32 SysUsrGrpID)
        {
            try
            {
                SqlParameter pSysUserGroupId = new SqlParameter();
                pSysUserGroupId.ParameterName = "@sysusergroupid";
                pSysUserGroupId.SqlDbType = SqlDbType.Int;
                pSysUserGroupId.Value = SysUsrGrpID;

                SqlParameter[] pCollection = { pSysUserGroupId };
                return dbHandler.ReturnDataWithStoredProcedure("SP_GetUserDashboard", pCollection).Tables[0];

            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        //      public DataTable GetCheckPreDetails(dbHandler dbHandler, string TypeFlag, string LoginName, string EmailId, Int64 CellNo)
        //{
        //	try
        //	{
        //              SqlParameter[] sqlParam = new SqlParameter[4];
        //              sqlParam[0] = new SqlParameter("@TypeFlag", TypeFlag);
        //              sqlParam[0].Direction = ParameterDirection.Input;
        //              sqlParam[0].SqlDbType = SqlDbType.VarChar;

        //              sqlParam[1] = new SqlParameter("@LoginName", LoginName);
        //              sqlParam[1].Direction = ParameterDirection.Input;
        //              sqlParam[1].SqlDbType = SqlDbType.VarChar;

        //              sqlParam[2] = new SqlParameter("@EmailId", EmailId);
        //              sqlParam[2].Direction = ParameterDirection.Input;
        //              sqlParam[2].SqlDbType = SqlDbType.VarChar;

        //              sqlParam[3] = new SqlParameter("@CellNo", CellNo);
        //              sqlParam[3].Direction = ParameterDirection.Input;
        //              sqlParam[3].SqlDbType = SqlDbType.VarChar;

        //              return dbHandler.ReturnDataWithStoredProcedure("uspGetCheckPreDetails", sqlParam).Tables[0];
        //          }
        //	catch (Exception ex)
        //	{
        //		throw ex;
        //	}
        //}
        [AuthorizationFilter]
        public Int32 GetCheckOldPassword(dbHandler dbHandler, string OldPassword, int LoggedUserId)
        {
            try
            {
                string StrQuery = "";
                StrQuery = "SELECT isnull(count(*),0) as cnt from SystemUser where LoginPassword ='" + OldPassword + "' and SysUserID = " + LoggedUserId + " ";
                return Convert.ToInt32(dbHandler.ExcutiveScalar(StrQuery));
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public DataTable GetForgetPassword(dbHandler dbHandler, string LoginName, Int64 CellNo)
        {
            try
            {
                var param = new SqlParameter[2];
                param[0] = new SqlParameter("@UserName", LoginName);
                param[1] = new SqlParameter("@PhoneNumber", CellNo);
                var res = dbHandler.ReturnDataWithStoredProcedureTable("USP_GET_ForgetPassword", param);
                return res;

            }
            catch (Exception ex)
            {
                
                dbHandler.SaveErorr("SystemProgram", 0, ex.Message);
                throw ex;
            }
        }

        public DataTable GetForgotPassword(dbHandler dbHandler, string UserName)
        {
            try
            {
                var param = new SqlParameter[1];
                param[0] = new SqlParameter("@UserName", UserName);
                var res = dbHandler.ReturnDataWithStoredProcedureTable("USP_GET_Password", param);
                return res;

            }
            catch (Exception ex)
            {

                dbHandler.SaveErorr("SystemProgram", 0, ex.Message);
                throw ex;
            }
        }
        [AuthorizationFilter]
        public DataTable GetChangePassword(dbHandler dbHandler, Int32 UserId, string OldPassword, string NewPassword,string Salt)
        {
            DataTable dt = new DataTable();
            try
            {
                using (SqlConnection conn = new SqlConnection(dbHandler.GetConnectionString()))
                {
                    using (var cmd = new SqlCommand("SP_SET_ChangePassword", conn))
                    {
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add(new SqlParameter("@UserId", UserId));
                        cmd.Parameters.Add(new SqlParameter("@UserPassword", OldPassword));
                        cmd.Parameters.Add(new SqlParameter("@NewPassword", NewPassword));
                        cmd.Parameters.Add(new SqlParameter("@Salt", Salt));
                        conn.Open();
                        var da = new SqlDataAdapter(cmd);
                        da.Fill(dt);
                        conn.Close();
                    }
                }
                return dt;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        


        #endregion
    }
}
