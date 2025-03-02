using SoftwareSuite.Models.Database;
using SoftwareSuite.Models.Results;
using SoftwareSuite.Models.Security;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.IO;
using System.Linq;
using System.Net.Http;
using System.Net;
using System.Web;
using System.Web.Http.Controllers;
using System.Web.Http.Filters;
using Newtonsoft.Json;

namespace SoftwareSuite.Services.Results
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

    public class ResultService
    {

        #region "Insert/Update/Delete"
        [AuthorizationFilter]
        public DataSet PostResultProcess(ResultProcess ResultProcess, dbHandler dbHandler)
        {
            try
            {
                SqlParameter[] param = {
                    new SqlParameter("@CourseID", ResultProcess.CourseID ),
                    new SqlParameter("@ExamID", ResultProcess.ExamID),
                    new SqlParameter("@InstanceID",ResultProcess.ExamInstID ),
                   // new SqlParameter("@CollegeID", ResultProcess.CollegeID),
                   // new SqlParameter("@BranchID", ResultProcess.BranchID ),
                    new SqlParameter("@HallTicketNo", ResultProcess.HallTicketNoFrom  ),
                    new SqlParameter("@Ordinance", ResultProcess.Ordinance ==true ? "Y":"N"  ),                    
                   // new SqlParameter("@HallTicketNoTO", ResultProcess.HallTicketNoTo  ),
                    new SqlParameter("@LoginID", ResultProcess.LoginID )
                };
                return dbHandler.ReturnDataWithStoredProcedure("Process_ResultProcess", param);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        #endregion
        #region "Get Methods"
        [AuthorizationFilter]
        public DataTable GetCollegeSemWiseReport(dbHandler dbHandler, int Schemeid, int Semid)
        {
            try
            {
                string StrQuery = "";
                StrQuery = "exec USP_GET_COLLEGE_SEM_RESULT '023','C18','1SEM'";
                return dbHandler.ReturnData(StrQuery);
                //"SystemUser.DeleteFlag,SystemUser.CreLoginID,SystemUser.CreDate,SystemUser.UpdLoginID,SystemUser.UpdDate " +
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        [AuthorizationFilter]
        public DataTable GetSchemesForResults(dbHandler dbHandler)
        {
            try
            {
                string StrQuery = "";
                StrQuery = "exec USP_GET_ACTIVE_SCHEMES_FOR_RESULTS";
                return dbHandler.ReturnData(StrQuery);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        [AuthorizationFilter]
        public DataSet GetExamTypeForResults(dbHandler dbHandler, int Schemeid)
        {
            try
            {
                string StrQuery = "";
                StrQuery = "exec USP_GET_ACTIVE_SEM_EXAMS_FOR_RESULTS " + Schemeid;
                return dbHandler.ReturnDataSet(StrQuery);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        [AuthorizationFilter]
        public DataTable GetTypeWritingShorthandReport(dbHandler dbHandler, string HallTicketno)
        {
            try
            {
                string StrQuery = "";
                StrQuery = "exec USP_GET_TWSH_RESULTS " + HallTicketno;
                return dbHandler.ReturnData(StrQuery);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        [AuthorizationFilter]
        public DataSet GetBranchWiseReport(dbHandler dbHandler, int CollegeId, int Schemeid, int Semid, int ExamTypeId, int BranchId,int ExamMonthYearId)
        {
            try
            {
                string StrQuery = "";// USP_Results_GET_C18BranchWiseResults 1,5,1,1,8,4
                StrQuery = "exec USP_Results_GET_C18BranchWiseResults " + CollegeId + "," + Schemeid + "," + Semid + "," + ExamTypeId + "," + BranchId + ","+ ExamMonthYearId+"";
                return dbHandler.ReturnDataSet(StrQuery);
                //"SystemUser.DeleteFlag,SystemUser.CreLoginID,SystemUser.CreDate,SystemUser.UpdLoginID,SystemUser.UpdDate " +
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        [AuthorizationFilter]
        public DataSet GetC18MidBranchWiseReport(dbHandler dbHandler, int CollegeId, int Schemeid, int Semid, int ExamTypeId, int BranchId,int AcademicId)
        {
            try
            {
                string StrQuery = "";
                StrQuery = "exec USP_Results_GET_C18MidMarksBranchWise "+ CollegeId + "," + Schemeid + "," + Semid + "," + ExamTypeId + "," + BranchId + ","+ AcademicId + "";
                return dbHandler.ReturnDataSet(StrQuery);
                //"SystemUser.DeleteFlag,SystemUser.CreLoginID,SystemUser.CreDate,SystemUser.UpdLoginID,SystemUser.UpdDate " +
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        [AuthorizationFilter]
        public DataSet GetBranchWiseOldReport(dbHandler dbHandler, int CollegeId, int Schemeid, int Semid, int ExamTypeId, string BranchId)
        {
            try
            {
                string StrQuery = "";
                StrQuery = "exec USP_GET_COLLEGE_SEM_BRANCH_RESULT_C16 " + CollegeId + "," + Schemeid + "," + Semid + "," + ExamTypeId + ",'" + BranchId + "'";
                return dbHandler.ReturnDataSet(StrQuery);
                //"SystemUser.DeleteFlag,SystemUser.CreLoginID,SystemUser.CreDate,SystemUser.UpdLoginID,SystemUser.UpdDate " +
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        [AuthorizationFilter]
        public DataSet Getc09StudentWiseReport(dbHandler dbHandler, int CollegeId, int Schemeid, int Semid, int ExamTypeId, string BranchId)
        {
            try
            {
                string StrQuery = "";
                StrQuery = "exec USP_Results_GET_C09StudentMarksData" + CollegeId + "," + Schemeid + "," + Semid + "," + ExamTypeId + ",'" + BranchId + "'";
                return dbHandler.ReturnDataSet(StrQuery);
                //"SystemUser.DeleteFlag,SystemUser.CreLoginID,SystemUser.CreDate,SystemUser.UpdLoginID,SystemUser.UpdDate " +
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        [AuthorizationFilter]
        public DataSet GetStudentWiseReport(dbHandler dbHandler, int Semid,int StudentTypeId, string Pin, int SchemeId, int ExamTypeId,int ExamMonthYearId)
        {
            try
            {
                string StrQuery = "";
                // StrQuery = "exec USP_GET_SEMandPINwise " + Semid + ",'" + Pin + "'," + SchemeId + "," + ExamTypeId + "";
                StrQuery = "exec USP_Results_StudentSubjectGradesPoints " + ExamMonthYearId + "," + SchemeId + "," + StudentTypeId + ",'" + Pin + "'," + Semid + "," + ExamTypeId +"";
                
                return dbHandler.ReturnDataSet(StrQuery);
                //"SystemUser.DeleteFlag,SystemUser.CreLoginID,SystemUser.CreDate,SystemUser.UpdLoginID,SystemUser.UpdDate " +
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        [AuthorizationFilter]
        public DataSet GetC18MidStudentWiseReport(dbHandler dbHandler, int Semid, string Pin, int SchemeId, int ExamTypeId)
        {

            try
            {
                string StrQuery = "";
                StrQuery = "exec USP_Results_GET_C18MidMarks '" + Pin + "',"+ Semid + "," + SchemeId + "," + ExamTypeId + "";
                return dbHandler.ReturnDataSet(StrQuery);
                //"SystemUser.DeleteFlag,SystemUser.CreLoginID,SystemUser.CreDate,SystemUser.UpdLoginID,SystemUser.UpdDate " +
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        [AuthorizationFilter]
        public DataSet GetOldStudentWiseReport(dbHandler dbHandler, int Semid, int StudentTypeId, string Pin, int SchemeId, int ExamTypeId, int ExamMonthYearId)
        {
            try
            {
                string StrQuery = "";
                if (SchemeId ==3|| SchemeId == 4 || SchemeId == 8 || SchemeId == 1) {
                    StrQuery = "exec USP_Results_GET_C16studentData " + ExamMonthYearId + "," + SchemeId + "," + StudentTypeId + ",'" + Pin + "'," + Semid + "," + ExamTypeId + "";
                }
                else if(SchemeId == 2|| SchemeId == 10)
                {
                    StrQuery = "exec USP_Results_GET_ER91studentData "+ ExamMonthYearId + "," + SchemeId + "," + StudentTypeId + ",'" + Pin + "'," + Semid + "," + ExamTypeId + "";
                }
                else {
                    StrQuery = "exec USP_GET_SEMandPINwise_C16 " + Semid + ",'" + Pin + "'," + SchemeId + "," + ExamTypeId + "";
                }
              
                return dbHandler.ReturnDataSet(StrQuery);
                //"SystemUser.DeleteFlag,SystemUser.CreLoginID,SystemUser.CreDate,SystemUser.UpdLoginID,SystemUser.UpdDate " +
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        [AuthorizationFilter]
        public DataSet GetSchemeSemBranchInfo(dbHandler dbHandler, int CollegeId)
        {
            try
            {
                string StrQuery = "";
                StrQuery = "exec USP_GET_SCHEME_SEM_BRANCH_INFO " + CollegeId;
                return dbHandler.ReturnDataSet(StrQuery);
                //"SystemUser.DeleteFlag,SystemUser.CreLoginID,SystemUser.CreDate,SystemUser.UpdLoginID,SystemUser.UpdDate " +
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        [AuthorizationFilter]
        public DataSet GetCollegesSchemeSemInfo(dbHandler dbHandler)
        {
            try
            {
                string StrQuery = "";
                StrQuery = "exec usp_Get_Colleges_SCHEME_SEM_INFO";
                return dbHandler.ReturnDataSet(StrQuery);
                //"SystemUser.DeleteFlag,SystemUser.CreLoginID,SystemUser.CreDate,SystemUser.UpdLoginID,SystemUser.UpdDate " +
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        [AuthorizationFilter]
        public DataTable GetExamTypeInfo(dbHandler dbHandler, int Schemeid, int Semid)
        {
            try
            {
                string StrQuery = "";
                StrQuery = $"exec USP_GetResultReleaseTypes {Schemeid},{Semid}";
                return dbHandler.ReturnData(StrQuery);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        #endregion
    }
}
