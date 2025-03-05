using System;
using System.Collections.Generic;
using System.Linq;
using System.Diagnostics;
using System.Web;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Data.SqlClient;
using Newtonsoft.Json;
using System.Configuration;
using System.Xml;
using System.Threading.Tasks;
using System.IO;
using SoftwareSuite.Models.Database;
using System.Web.Script.Serialization;
using Newtonsoft.Json.Linq;
using SoftwareSuite.Models;
using System.Timers;
using System.Data;
using RestSharp;
using DocumentFormat.OpenXml.Packaging;
using System.Web.UI.WebControls;
using static SoftwareSuite.Controllers.PreExamination.GenerateNR;
using System.Text.RegularExpressions;
using SoftwareSuite.Models.Security;
using static SoftwareSuite.Controllers.TWSH.TwshStudentRegController;

namespace SoftwareSuite.Controllers.PreExamination
{
    public class PreExaminationReportController : BaseController
    {


        

        [AuthorizationFilter]
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

        [AuthorizationFilter()]
        [AuthorizationFilter][HttpGet, ActionName("PinCheck")]
        public string PinCheck(string DataType,string DataType1)

        {
            try
            {
                if (DataType != "")
                {
                    Regex regex = new Regex(@"^[a-zA-Z0-9_.-]+$");
                    if (!regex.IsMatch(DataType))
                    {


                        var plaintext = "400";
                        var plaintext1 = "Invalid " + DataType1 + " :- " + DataType;
                        var plaintext2 = "status";
                        var plaintext3 = "description";

                        string key = "iT9/CmEpJz5Z1mkXZ9CeKXpHpdbG0a6XY0Fj1WblmZA="; // AES-256 key
                        string iv = "u4I0j3AQrwJnYHkgQFwVNw==";     // AES IV

                        string resstatus = Encryption.Encrypt(plaintext, key, iv);
                        string resdescription = Encryption.Encrypt(plaintext1, key, iv);
                        string Status = Encryption.Encrypt(plaintext2, key, iv);
                        string Description = Encryption.Encrypt(plaintext3, key, iv);
                        // string Content = new StringContent("{\"" + Status + "\" : \"" + resstatus + "\", \"" + Description + "\" : \"" + resdescription + "\"}", Encoding.UTF8, "application/json")
                        //  return Content;
                        var res = JsonConvert.SerializeObject("{\"Status\" : \"" + resstatus + "\",\"Description\" : \"" + resdescription + "\"}");
                        return res;

                    }
                    else
                    {
                        return "YES";
                    }
                }
                else
                {
                    return "YES";
                }
            }
            catch (Exception ex)
            {
                return ex.Message;
            }
        }



        [AuthorizationFilter()]
        [AuthorizationFilter][HttpGet, ActionName("NameCheck")]
        public string NameCheck(string DataType, string DataType1)

        {
            try
            {
                if (DataType != "")
                {
                    Regex regex = new Regex("^[a-zA-Z\\s]*$");
                    if (!regex.IsMatch(DataType))
                    {


                        var plaintext = "400";
                        var plaintext1 = "Invalid " + DataType1 + " :- " + DataType;
                        var plaintext2 = "status";
                        var plaintext3 = "description";

                        string key = "iT9/CmEpJz5Z1mkXZ9CeKXpHpdbG0a6XY0Fj1WblmZA="; // AES-256 key
                        string iv = "u4I0j3AQrwJnYHkgQFwVNw==";     // AES IV

                        string resstatus = Encryption.Encrypt(plaintext, key, iv);
                        string resdescription = Encryption.Encrypt(plaintext1, key, iv);
                        string Status = Encryption.Encrypt(plaintext2, key, iv);
                        string Description = Encryption.Encrypt(plaintext3, key, iv);
                        // string Content = new StringContent("{\"" + Status + "\" : \"" + resstatus + "\", \"" + Description + "\" : \"" + resdescription + "\"}", Encoding.UTF8, "application/json")
                        //  return Content;
                        var res = JsonConvert.SerializeObject("{\"Status\" : \"" + resstatus + "\",\"Description\" : \"" + resdescription + "\"}");
                        return res;

                    }
                    else
                    {
                        return "YES";
                    }
                }
                else
                {
                    return "YES";
                }
            }
            catch (Exception ex)
            {
                return ex.Message;
            }
        }

        [AuthorizationFilter()]
        [AuthorizationFilter][HttpGet, ActionName("GenderCheck")]
        public string GenderCheck(string DataType, string DataType1)

        {
            try
            {
                if (DataType != "")
                {
                    Regex regex = new Regex("^[MF]$");
                    if (!regex.IsMatch(DataType))
                    {
                        var plaintext = "400";
                        var plaintext1 = "Invalid " + DataType1 + " :- " + DataType;
                        var plaintext2 = "status";
                        var plaintext3 = "description";

                        string key = "iT9/CmEpJz5Z1mkXZ9CeKXpHpdbG0a6XY0Fj1WblmZA="; // AES-256 key
                        string iv = "u4I0j3AQrwJnYHkgQFwVNw==";     // AES IV

                        string resstatus = Encryption.Encrypt(plaintext, key, iv);
                        string resdescription = Encryption.Encrypt(plaintext1, key, iv);
                        string Status = Encryption.Encrypt(plaintext2, key, iv);
                        string Description = Encryption.Encrypt(plaintext3, key, iv);
                        // string Content = new StringContent("{\"" + Status + "\" : \"" + resstatus + "\", \"" + Description + "\" : \"" + resdescription + "\"}", Encoding.UTF8, "application/json")
                        //  return Content;
                        var res = JsonConvert.SerializeObject("{\"Status\" : \"" + resstatus + "\",\"Description\" : \"" + resdescription + "\"}");
                        return res;
                    }
                    else
                    {
                        return "YES";
                    }
                }
                else
                {
                    return "YES";
                }
            }
            catch (Exception ex)
            {
                return ex.Message;
            }
        }

        [AuthorizationFilter()]
        [AuthorizationFilter][HttpGet, ActionName("MobileNumberCheck")]
        public string MobileNumberCheck(string DataType, string DataType1)
        {
            try
            {
                if (DataType != "")
                {
                    Regex regex = new Regex("^\\d{10}$");
                    if (!regex.IsMatch(DataType))
                    {
                        var plaintext = "400";
                        var plaintext1 = "Invalid " + DataType1 + " :- " + DataType;
                        var plaintext2 = "status";
                        var plaintext3 = "description";

                        string key = "iT9/CmEpJz5Z1mkXZ9CeKXpHpdbG0a6XY0Fj1WblmZA="; // AES-256 key
                        string iv = "u4I0j3AQrwJnYHkgQFwVNw==";     // AES IV

                        string resstatus = Encryption.Encrypt(plaintext, key, iv);
                        string resdescription = Encryption.Encrypt(plaintext1, key, iv);
                        string Status = Encryption.Encrypt(plaintext2, key, iv);
                        string Description = Encryption.Encrypt(plaintext3, key, iv);
                        // string Content = new StringContent("{\"" + Status + "\" : \"" + resstatus + "\", \"" + Description + "\" : \"" + resdescription + "\"}", Encoding.UTF8, "application/json")
                        //  return Content;
                        var res = JsonConvert.SerializeObject("{\"Status\" : \"" + resstatus + "\",\"Description\" : \"" + resdescription + "\"}");
                        return res;
                    }
                    else
                    {
                        return "YES";
                    }
                }
                else
                {
                    return "YES";
                }
            }
            catch (Exception ex)
            {
                return ex.Message;
            }
        }

        [AuthorizationFilter()]
        [AuthorizationFilter][HttpGet, ActionName("EmailCheck")]
        public string EmailCheck(string DataType, string DataType1)
        {
            try
            {
                if (DataType != "")
                {
                    Regex regex = new Regex("^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$");
                    if (!regex.IsMatch(DataType))
                    {
                        var plaintext = "400";
                        var plaintext1 = "Invalid " + DataType1 + " :- " + DataType;
                        var plaintext2 = "status";
                        var plaintext3 = "description";

                        string key = "iT9/CmEpJz5Z1mkXZ9CeKXpHpdbG0a6XY0Fj1WblmZA="; // AES-256 key
                        string iv = "u4I0j3AQrwJnYHkgQFwVNw==";     // AES IV

                        string resstatus = Encryption.Encrypt(plaintext, key, iv);
                        string resdescription = Encryption.Encrypt(plaintext1, key, iv);
                        string Status = Encryption.Encrypt(plaintext2, key, iv);
                        string Description = Encryption.Encrypt(plaintext3, key, iv);
                        // string Content = new StringContent("{\"" + Status + "\" : \"" + resstatus + "\", \"" + Description + "\" : \"" + resdescription + "\"}", Encoding.UTF8, "application/json")
                        //  return Content;
                        var res = JsonConvert.SerializeObject("{\"Status\" : \"" + resstatus + "\",\"Description\" : \"" + resdescription + "\"}");
                        return res;
                    }
                    else
                    {
                        return "YES";
                    }
                }
                else
                {
                    return "YES";
                }
            }
            catch (Exception ex)
            {
                return ex.Message;
            }
        }


        [AuthorizationFilter()]
        [HttpGet, ActionName("OnlyThreeDigitCheck")]
        public string OnlyThreeDigitCheck(string DataType, string DataType1)
        {
            try
            {
                if (DataType != "")
                {
                    Regex regex = new Regex("^\\d{3}$");
                    if (!regex.IsMatch(DataType))
                    {
                        var plaintext = "400";
                        var plaintext1 = "Invalid " + DataType1 + " :- " + DataType;
                        var plaintext2 = "status";
                        var plaintext3 = "description";

                        string key = "iT9/CmEpJz5Z1mkXZ9CeKXpHpdbG0a6XY0Fj1WblmZA="; // AES-256 key
                        string iv = "u4I0j3AQrwJnYHkgQFwVNw==";     // AES IV

                        string resstatus = Encryption.Encrypt(plaintext, key, iv);
                        string resdescription = Encryption.Encrypt(plaintext1, key, iv);
                        string Status = Encryption.Encrypt(plaintext2, key, iv);
                        string Description = Encryption.Encrypt(plaintext3, key, iv);
                        // string Content = new StringContent("{\"" + Status + "\" : \"" + resstatus + "\", \"" + Description + "\" : \"" + resdescription + "\"}", Encoding.UTF8, "application/json")
                        //  return Content;
                        var res = JsonConvert.SerializeObject("{\"Status\" : \"" + resstatus + "\",\"Description\" : \"" + resdescription + "\"}");
                        return res;
                    }
                    else
                    {
                        return "YES";
                    }
                }
                else
                {
                    return "YES";
                }
            }
            catch (Exception ex)
            {
                return ex.Message;
            }
        }

        [AuthorizationFilter()]
        [HttpGet, ActionName("NumberCheck")]
        public string NumberCheck(string DataType, string DataType1)
        {
            try
            {
                if (DataType != "")
                {
                    Regex regex = new Regex("^[0-9]+$");
                    if (!regex.IsMatch(DataType))
                    {
                        var plaintext = "400";
                        var plaintext1 = "Invalid " + DataType1 + " :- " + DataType;
                        var plaintext2 = "status";
                        var plaintext3 = "description";

                        string key = "iT9/CmEpJz5Z1mkXZ9CeKXpHpdbG0a6XY0Fj1WblmZA="; // AES-256 key
                        string iv = "u4I0j3AQrwJnYHkgQFwVNw==";     // AES IV

                        string resstatus = Encryption.Encrypt(plaintext, key, iv);
                        string resdescription = Encryption.Encrypt(plaintext1, key, iv);
                        string Status = Encryption.Encrypt(plaintext2, key, iv);
                        string Description = Encryption.Encrypt(plaintext3, key, iv);
                        // string Content = new StringContent("{\"" + Status + "\" : \"" + resstatus + "\", \"" + Description + "\" : \"" + resdescription + "\"}", Encoding.UTF8, "application/json")
                        //  return Content;
                        var res = JsonConvert.SerializeObject("{\"Status\" : \"" + resstatus + "\",\"Description\" : \"" + resdescription + "\"}");
                        return res;
                    }
                    else
                    {
                        return "YES";
                    }
                }
                else
                {
                    return "YES";
                }
            }
            catch (Exception ex)
            {
                return ex.Message;
            }
        }

        [AuthorizationFilter()]
        [HttpGet, ActionName("DateCheck")]
        public string DateCheck(string DataType,string DataType1)
        {
            try
            {
                if (DataType != "")
                {
                    Regex regex = new Regex(@"^(\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])|(0[1-9]|[12][0-9]|3[01])-(0[1-9]|1[0-2])-\d{4})(?:[T ](0[0-9]|1[0-9]|2[0-3]):([0-5][0-9]):([0-5][0-9]))?$");
                    if (!regex.IsMatch(DataType))
                    {
                        var plaintext = "400";
                        var plaintext1 = "Invalid " + DataType1 + " :- " + DataType;
                        var plaintext2 = "status";
                        var plaintext3 = "description";

                        string key = "iT9/CmEpJz5Z1mkXZ9CeKXpHpdbG0a6XY0Fj1WblmZA="; // AES-256 key
                        string iv = "u4I0j3AQrwJnYHkgQFwVNw==";     // AES IV

                        string resstatus = Encryption.Encrypt(plaintext, key, iv);
                        string resdescription = Encryption.Encrypt(plaintext1, key, iv);
                        string Status = Encryption.Encrypt(plaintext2, key, iv);
                        string Description = Encryption.Encrypt(plaintext3, key, iv);
                        // string Content = new StringContent("{\"" + Status + "\" : \"" + resstatus + "\", \"" + Description + "\" : \"" + resdescription + "\"}", Encoding.UTF8, "application/json")
                        //  return Content;
                        var res = JsonConvert.SerializeObject("{\"Status\" : \"" + resstatus + "\",\"Description\" : \"" + resdescription + "\"}");
                        return res;
                    }
                    else
                    {
                        return "YES";
                    }
                }
                else
                {
                    return "YES";
                }
            }
            catch (Exception ex)
            {
                return ex.Message;
            }
        }
        [AuthorizationFilter()]
        [AuthorizationFilter][HttpPost, ActionName("GetFeePaymentReports")]
        public string GetFeePaymentReports(string StudentTypeId, string StartDate, string EndDate, string examType)
        {
            try
            {
                string StudentTypeId1 = NumberCheck(StudentTypeId.ToString(), "StudentType");
                string StartDate1 = DateCheck(StartDate.ToString(), "StartDate");
                string EndDate1 = DateCheck(EndDate.ToString(), "EndDate");
                string examType1 = NumberCheck(examType.ToString(), "ExamType");
              

                if (StudentTypeId1 != "YES")
                {
                    return StudentTypeId1;
                }
                else if (StartDate1 != "YES")
                {
                    return StartDate1;
                }
                else if(EndDate1 != "YES")
                {
                    return EndDate1;
                }
                else if(examType1 != "YES")
                {
                    return examType1;
                }

                var dbHandler = new dbHandler();
                string StrQuery = "usp_SFP_GET_FeePaymentReports ";
                var param = new SqlParameter[4];
                param[0] = new SqlParameter("@StudentTypeId", int.Parse(StudentTypeId));
                param[1] = new SqlParameter("@StartDate", StartDate);
                param[2] = new SqlParameter("@EndDate", EndDate);
                param[3] = new SqlParameter("@examType", int.Parse(examType));
                var ds = dbHandler.ReturnDataWithStoredProcedure(StrQuery, param);
                var filename = "TransactionReport-" + Guid.NewGuid().ToString() + ".xlsx";
                var eh = new ExcelHelper();
                var path = ConfigurationManager.AppSettings["DownloadsFolderPathTR"];
                bool folderExists = Directory.Exists(path);
                if (!folderExists)
                    Directory.CreateDirectory(path);
                eh.ExportDataSet(ds, path + filename);
                Timer timer = new Timer(30000);
                timer.Elapsed += (sender, e) => elapse(sender, e, ConfigurationManager.AppSettings["DownloadsFolderPathTR"] + filename);
                timer.Start();
                return "/TR/" + filename;
            }
            catch (Exception ex)
            {
                //dbHandler.SaveErorr("GetFeePaymentReports", token.UserId, ex.Message + "\n-----------\n" + ex.StackTrace);
            }
            return "";
        }

        [AuthorizationFilter()]
        [AuthorizationFilter][HttpPost, ActionName("ThreeBacklogODCReports")]
        public string ThreeBacklogODCReports(string fromdate, string todate, string day, string month, string year, string ExamYearMonth)
        {
            try
            {
                var dbHandler = new dbHandler();
                string StrQuery = "USP_GET_3BacklogODCReports ";
                var param = new SqlParameter[2];
                param[0] = new SqlParameter("@fromdate", fromdate);
                param[1] = new SqlParameter("@todate", todate);
                //param[2] = new SqlParameter("@day", day);
                //param[3] = new SqlParameter("@month", month);
                //param[4] = new SqlParameter("@year", year);
                //param[5] = new SqlParameter("@ExamYearMonth", ExamYearMonth);
                var ds = dbHandler.ReturnDataWithStoredProcedure(StrQuery, param);
                var filename = "ThreeBacklogODCReports-" + Guid.NewGuid().ToString() + ".xlsx";
                var eh = new ExcelHelper();
                var path = ConfigurationManager.AppSettings["DownloadsFolderPathTR"];
                bool folderExists = Directory.Exists(path);
                if (!folderExists)
                    Directory.CreateDirectory(path);
                eh.ExportDataSet(ds, path + filename);
                Timer timer = new Timer(30000);
                timer.Elapsed += (sender, e) => elapse(sender, e, ConfigurationManager.AppSettings["DownloadsFolderPathTR"] + filename);
                timer.Start();
                return "/TR/" + filename;
            }
            catch (Exception ex)
            {
                //dbHandler.SaveErorr("USP_GET_3BacklogODCReports", token.UserId, ex.Message + "\n-----------\n" + ex.StackTrace);
            }
            return "";
        }

        [AuthorizationFilter()]
        [AuthorizationFilter][HttpPost, ActionName("GetSubBillerReport")]
        public string GetSubBillerReport(string SubBillerId, string StartDate, string EndDate)
        {
            try
            {
                var dbHandler = new dbHandler();
                string StrQuery = "USP_GET_SubBillerIdBasedReports ";
                var param = new SqlParameter[3];
                param[0] = new SqlParameter("@subbillerid", SubBillerId);
                param[1] = new SqlParameter("@fromData", SqlDbType.Date);
                param[1].Value = StartDate;
                param[2] = new SqlParameter("@toData", SqlDbType.Date);
                param[2].Value = EndDate;
                var ds = dbHandler.ReturnDataWithStoredProcedure(StrQuery, param);
                var filename = "SubBillerReport_" + ".xlsx";
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
                //dbHandler.SaveErorr("USP_GET_SubBillerIdBasedReports", token.UserId, ex.Message + "\n-----------\n" + ex.StackTrace);
                return "Error Occured. Please Try Again";
            }
        }

        [AuthorizationFilter()]
        [AuthorizationFilter][HttpPost, ActionName("GetDayWiseSubBillerCountExcel")]
        public string GetDayWiseSubBillerCountExcel(string Date)
        {
            try
            {
                var dbHandler = new dbHandler();
                string StrQuery = "USP_GET_SubBillerDateBasedReports ";
                var param = new SqlParameter[1];
                param[0] = new SqlParameter("@Date", Date);
                var ds = dbHandler.ReturnDataWithStoredProcedure(StrQuery, param);
                var filename = "SubBillerReportCount_" + ".xlsx";
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
                //dbHandler.SaveErorr("USP_GET_SubBillerDateBasedReports", token.UserId, ex.Message + "\n-----------\n" + ex.StackTrace);
                return "Error Occured. Please Try Again";
            }
        }

        [AuthorizationFilter()]
        [AuthorizationFilter][HttpPost, ActionName("GetDayWiseSubBillerReport")]
        public string GetDayWiseSubBillerReport(int DataType, string subbillerid, string Date)
        {
            try
            {
                var dbHandler = new dbHandler();
                string StrQuery = "SP_Get_SubBillerDateBasedReportslist ";
                var param = new SqlParameter[3];
                param[0] = new SqlParameter("@DataType", DataType);
                param[1] = new SqlParameter("@subbillerid", subbillerid);
                param[2] = new SqlParameter("@Date", Date);
                //param[2].Value = Date;
                var ds = dbHandler.ReturnDataWithStoredProcedure(StrQuery, param);
                var filename = "SubBillerReport_" + subbillerid + "_" + Guid.NewGuid().ToString() + ".xlsx";
                var eh = new ExcelHelper();
                var path = ConfigurationManager.AppSettings["DownloadsFolderPathSB"];
                bool folderExists = Directory.Exists(path);
                if (!folderExists)
                    Directory.CreateDirectory(path);
                eh.ExportDataSet(ds, path + filename);
                Timer timer = new Timer(30000);
                timer.Elapsed += (sender, e) => elapse(sender, e, ConfigurationManager.AppSettings["DownloadsFolderPathSB"] + filename);
                timer.Start();
                return "/TR/" + filename;
            }
            catch (Exception ex)
            {
                //dbHandler.SaveErorr("SP_Get_SubBillerDateBasedReportslist", token.UserId, ex.Message + "\n-----------\n" + ex.StackTrace);
                return "Error Occured. Please Try Again";
            }
        }




        [AuthorizationFilter()]
        [AuthorizationFilter][HttpPost, ActionName("ThreeBacklogODCByPin")]
        public string ThreeBacklogODCByPin(string fromdate, string todate, string PIN)
        {
            try
            {
                var dbHandler = new dbHandler();
                string StrQuery = "USP_GET_3BacklogODCReports_ByPIN ";
                var param = new SqlParameter[3];
                param[0] = new SqlParameter("@fromdate", fromdate);
                param[1] = new SqlParameter("@todate", todate);
                param[2] = new SqlParameter("@PIN", PIN);
                //param[2] = new SqlParameter("@day", day);
                //param[3] = new SqlParameter("@month", month);
                //param[4] = new SqlParameter("@year", year);
                //param[5] = new SqlParameter("@ExamYearMonth", ExamYearMonth);
                var ds = dbHandler.ReturnDataWithStoredProcedure(StrQuery, param);
                if (ds.Tables[0].Rows.Count > 0)
                {
                    var filename = "ThreeBacklogODCByPin-" + PIN + ".xlsx";
                    var eh = new ExcelHelper();
                    var path = ConfigurationManager.AppSettings["DownloadsFolderPathTR"];
                    bool folderExists = Directory.Exists(path);
                    if (!folderExists)
                        Directory.CreateDirectory(path);
                    eh.ExportDataSet(ds, path + filename);
                    Timer timer = new Timer(30000);
                    timer.Elapsed += (sender, e) => elapse(sender, e, ConfigurationManager.AppSettings["DownloadsFolderPathTR"] + filename);
                    timer.Start();
                    return "/TR/" + filename;
                }
                else
                {
                    return "No Data Found";
                }
            }
            catch (Exception ex)
            {
                //dbHandler.SaveErorr("USP_GET_3BacklogODCReports", token.UserId, ex.Message + "\n-----------\n" + ex.StackTrace);
            }
            return "";
        }


        [AuthorizationFilter()]
        [AuthorizationFilter][HttpPost, ActionName("GetFromExalReports")]
        public string GetFromExalReports([FromBody] HttpPostedFileBase file)
        {
            var path = string.Empty;
            try
            {
                if (file != null && file.ContentLength > 0)
                {
                    var fileName = Path.GetFileName(file.FileName);
                    var eh = new ExcelHelper();
                    path = Path.Combine(Server.MapPath("~/Reports/"), fileName);
                    file.SaveAs(path);
                    DataTable dt = eh.ExelToDataSet(path);
                    System.Web.Script.Serialization.JavaScriptSerializer serializer = new System.Web.Script.Serialization.JavaScriptSerializer();
                    List<Dictionary<string, object>> rows = new List<Dictionary<string, object>>();
                    Dictionary<string, object> row;
                    foreach (DataRow dr in dt.Rows)
                    {
                        row = new Dictionary<string, object>();
                        foreach (DataColumn col in dt.Columns)
                        {
                            row.Add(col.ColumnName.ToString().Trim(), dr[col].ToString().Trim());
                        }
                        rows.Add(row);
                    }



                    string finalString = serializer.Serialize(rows).ToString();
                    Timer timer = new Timer(3000);
                    timer.Elapsed += (sender, e) => elapse(sender, e, path);
                    timer.Start();
                    return finalString;
                }
            }
            catch (Exception ex)
            {
                //dbHandler.SaveErorr("GetFeePaymentReports", token.UserId, ex.Message + "\n-----------\n" + ex.StackTrace);
                return ex.StackTrace;
            }
            return "0";
        }



        [AuthorizationFilter()]
        [AuthorizationFilter][HttpGet, ActionName("GetS2SPaymentReports")]
        public string GetS2SPaymentReports(int DataTypeId, string EndDate, string StartDate, int StudentTypeId)
        {
            try
            {
                var dbHandler = new dbHandler();
                var param = new SqlParameter[4];
                param[0] = new SqlParameter("@DataTypeId", DataTypeId);
                param[1] = new SqlParameter("@StudentTypeId", StudentTypeId);
                param[2] = new SqlParameter("@StartDate", StartDate);
                param[3] = new SqlParameter("@EndDate", EndDate);
                var ds = dbHandler.ReturnDataWithStoredProcedure("ADM_SFP_GET_S2SPaymentReports", param);
                if (DataTypeId == 6)
                {
                    var filename = "TransactionReport" + DataTypeId + "-" + Guid.NewGuid().ToString() + ".xlsx";
                    var eh = new ExcelHelper();
                    var path = ConfigurationManager.AppSettings["DownloadsFolderPathTR"];
                    bool folderExists = Directory.Exists(path);
                    if (!folderExists)
                        Directory.CreateDirectory(path);
                    eh.ExportDataSet(ds, path + filename);
                    Timer timer = new Timer(30000);
                    timer.Elapsed += (sender, e) => elapse(sender, e, ConfigurationManager.AppSettings["DownloadsFolderPathTR"] + filename);
                    timer.Start();
                    return "/TR/" + filename;
                }
                return JsonConvert.SerializeObject(ds);
            }
            catch (Exception ex)
            {
                dbHandler.SaveErorr("ADM_SFP_GET_S2SPaymentReports", 0, ex.Message);
                return ex.Message;
            }
        }


        [AuthorizationFilter()]
        [AuthorizationFilter][HttpGet, ActionName("GetS2SPaymentDetails")]
        public string GetS2SPaymentDetails(int UserTypeId, string ChallanNumber, int StudentTypeId)
        {
            try
            {
                var dbHandler = new dbHandler();
                var param = new SqlParameter[3];
                param[0] = new SqlParameter("@UserTypeId ", UserTypeId);
                param[1] = new SqlParameter("@ChallanNumber", ChallanNumber);
                param[2] = new SqlParameter("@StudentTypeId  ", StudentTypeId);
                var ds = dbHandler.ReturnDataWithStoredProcedure("USP_SFP_GET_FeeReceipt", param);
                return JsonConvert.SerializeObject(ds);
            }
            catch (Exception ex)
            {
                dbHandler.SaveErorr("USP_SFP_GET_FeeReceipt", 0, ex.Message);
                return ex.Message;
            }
        }


        [AuthorizationFilter()]
        [AuthorizationFilter][HttpGet, ActionName("NrExcelReports")]
        public string NrExcelReports(int StudentTypeId, string CollegeCode, int ExamTypeId, int ExamMonthYearId)
        {
            try
            {
                string studentTypeId = NumberCheck(StudentTypeId.ToString(), "StudentType");
                string collegeCode = NumberCheck(CollegeCode.ToString(), "CollegeCode");
                string examTypeId = NumberCheck(ExamTypeId.ToString(), "ExamType");
                string examMonthYearId = NumberCheck(ExamMonthYearId.ToString(), "ExamMonthYear");

                if (studentTypeId != "YES")
                {
                    return studentTypeId;
                }
                else if (collegeCode != "YES")
                {
                    return collegeCode;
                }

                else if (examTypeId != "YES")
                {
                    return examTypeId;
                }
                else if (examMonthYearId != "YES")
                {
                    return examMonthYearId;
                }

                var dbHandler = new dbHandler();
                var param = new SqlParameter[4];
                param[0] = new SqlParameter("@StudentTypeId", StudentTypeId);
                param[1] = new SqlParameter("@CollegeCode", CollegeCode);
                param[2] = new SqlParameter("@ExamTypeId", ExamTypeId);
                param[3] = new SqlParameter("@ExamMonthYearId", ExamMonthYearId);
                DataSet ds = dbHandler.ReturnDataWithStoredProcedure("USP_SFP_GET_NR_EXCEL_REPORT", param);
                var filename = "NrReport-" + CollegeCode + "_" + Guid.NewGuid() + ".xlsx";
                var eh = new ExcelHelper();
                var path = ConfigurationManager.AppSettings["DownloadsFolderPath"];
                bool folderExists = Directory.Exists(path);
                if (!folderExists)
                    Directory.CreateDirectory(path);
                eh.ExportDataSet(ds, path + filename);
                Timer timer = new Timer(200000);
                timer.Elapsed += (sender, e) => elapse(sender, e, ConfigurationManager.AppSettings["DownloadsFolderPath"] + filename);
                timer.Start();
                return "/Downloads/" + filename;
            }
            catch (Exception ex)
            {
                //dbHandler.SaveErorr("GetFeePaymentReports", token.UserId, ex.Message + "\n-----------\n" + ex.StackTrace);
            }
            return "";
        }

        [AuthorizationFilter()]
        [AuthorizationFilter][HttpGet, ActionName("FeeNotPaidExcelReport")]
        public string FeeNotPaidExcelReport()
        {
            try
            {
                var dbHandler = new dbHandler();
                string StrQuery = "";
                StrQuery = "exec USP_SFP_GET_NotPaidList";
                DataSet ds = dbHandler.ReturnDataSet(StrQuery);
                var filename = "FeeNotPaidContacts-" + Guid.NewGuid() + ".xlsx";
                var eh = new ExcelHelper();
                var path = ConfigurationManager.AppSettings["DownloadsFolderPath"];
                bool folderExists = Directory.Exists(path);
                if (!folderExists)
                    Directory.CreateDirectory(path);
                eh.ExportDataSet(ds, path + filename);
                Timer timer = new Timer(200000);
                timer.Elapsed += (sender, e) => elapse(sender, e, ConfigurationManager.AppSettings["DownloadsFolderPath"] + filename);
                timer.Start();
                return "/Downloads/" + filename;
            }
            catch (Exception ex)
            {
                //dbHandler.SaveErorr("USP_SFP_GET_NotPaidList", token.UserId, ex.Message + "\n-----------\n" + ex.StackTrace);
            }
            return "";
        }

        [AuthorizationFilter()]
        [AuthorizationFilter][HttpGet, ActionName("PrinterNrDownloadExcelReport")]
        public string PrinterNrDownloadExcelReport(int ExamMonthYearId, int AcademicYearId, int StudentTypeId, int ExamTypeId = 0, string semid = null)
        {
            try
            {
                var dbHandler = new dbHandler();
                var param = new SqlParameter[5];
                param[0] = new SqlParameter("@ExamMonthYearId", ExamMonthYearId);
                param[1] = new SqlParameter("@AcademicID", AcademicYearId);
                param[2] = new SqlParameter("@StudentTypeId", StudentTypeId);
                param[3] = new SqlParameter("@ExamTypeId", ExamTypeId);
                param[4] = new SqlParameter("@semid", semid);
                DataSet ds = dbHandler.ReturnDataWithStoredProcedure("USP_GET_NRForPrinter", param);
                if (ds.Tables[0].Rows[0]["ResponceCode"].ToString() == "200")
                {
                    var filename = "PrinterNrDownloadExcel" + "_" + ds.Tables[0].Rows[0]["ExamMonthYear"].ToString() + "_" + Guid.NewGuid() + ".xlsx";
                    var eh = new ExcelHelper();
                    var path = ConfigurationManager.AppSettings["DownloadsFolderPath"];
                    DataSet excelds = ds;
                    //excelds.Tables.Add(ds.Tables.);
                    bool folderExists = Directory.Exists(path);
                    if (!folderExists)
                        Directory.CreateDirectory(path);
                    eh.ExportDataSet(excelds, path + filename);
                    Timer timer = new Timer(200000);
                    timer.Elapsed += (sender, e) => elapse(sender, e, ConfigurationManager.AppSettings["DownloadsFolderPath"] + filename);
                    timer.Start();
                    return "/Downloads/" + filename;
                }
                else
                {
                    var filename = "PrinterNrDownloadExcel-" + Guid.NewGuid().ToString() + ".xlsx";
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
            }
            catch (Exception ex)
            {
                //dbHandler.SaveErorr("USP_GET_NRForPrinter", token.UserId, ex.Message + "\n-----------\n" + ex.StackTrace);
            }
            return "";
        }

        [AuthorizationFilter()]
        [AuthorizationFilter][HttpGet, ActionName("PrinterNrAttendanceExcelReport")]
        public string PrinterNrAttendanceExcelReport(int ExamMonthYearId, int AcademicYearId, int StudentTypeId, int ExamTypeId = 0, string semid = null)
        {
            try
            {
                var dbHandler = new dbHandler();
                var param = new SqlParameter[5];
                param[0] = new SqlParameter("@ExamMonthYearId", ExamMonthYearId);
                param[1] = new SqlParameter("@AcademicID", AcademicYearId);
                param[2] = new SqlParameter("@StudentTypeId", StudentTypeId);
                param[3] = new SqlParameter("@ExamTypeId", ExamTypeId);
                param[4] = new SqlParameter("@semid", semid);
                DataSet ds = dbHandler.ReturnDataWithStoredProcedure("USP_GET_NRForPrinter_Attendance", param);
                if (ds.Tables[0].Rows[0]["ResponceCode"].ToString() == "200")
                {
                    var filename = "PrinterNr_Attendance_DownloadExcel" + "_" + ds.Tables[0].Rows[0]["ExamMonthYear"].ToString() + "_" + Guid.NewGuid() + ".xlsx";
                    var eh = new ExcelHelper();
                    var path = ConfigurationManager.AppSettings["DownloadsFolderPath"];
                    DataSet excelds = ds;
                    //excelds.Tables.Add(ds.Tables.);
                    bool folderExists = Directory.Exists(path);
                    if (!folderExists)
                        Directory.CreateDirectory(path);
                    eh.ExportDataSet(excelds, path + filename);
                    Timer timer = new Timer(200000);
                    timer.Elapsed += (sender, e) => elapse(sender, e, ConfigurationManager.AppSettings["DownloadsFolderPath"] + filename);
                    timer.Start();
                    return "/Downloads/" + filename;
                }
                else
                {
                    var filename = "PrinterNrDownloadExcel-" + Guid.NewGuid().ToString() + ".xlsx";
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
            }
            catch (Exception ex)
            {
                //dbHandler.SaveErorr("USP_GET_NRForPrinter", token.UserId, ex.Message + "\n-----------\n" + ex.StackTrace);
            }
            return "";
        }


        private void CreateIfMissing(string path)
        {
            bool folderExists = Directory.Exists(path);
            if (!folderExists)
                Directory.CreateDirectory(path);
        }

        public class NRPhotosData
        {

            public string PIN { get; set; }
            public int Studentid { get; set; }
        }

        [AuthorizationFilter()]
        [AuthorizationFilter][HttpGet, ActionName("PrinterNrDownload")]
        public string PrinterNrDownload(int ExamMonthYearId, int AcademicYearId, int StudentTypeId, int ExamTypeId = 0, string semid = null)
        {
            try
            {
                var dbHandler = new dbHandler();
                var param = new SqlParameter[5];
                param[0] = new SqlParameter("@ExamMonthYearId", ExamMonthYearId);
                param[1] = new SqlParameter("@AcademicID", AcademicYearId);
                param[2] = new SqlParameter("@StudentTypeId", StudentTypeId);
                param[3] = new SqlParameter("@ExamTypeId", ExamTypeId);
                param[4] = new SqlParameter("@semid", semid);
                DataSet ds = dbHandler.ReturnDataWithStoredProcedure("USP_GET_NRForPrinter", param);

                var param2 = new SqlParameter[5];
                param2[0] = new SqlParameter("@ExamMonthYearId", ExamMonthYearId);
                param2[1] = new SqlParameter("@AcademicID", AcademicYearId);
                param2[2] = new SqlParameter("@StudentTypeId", StudentTypeId);
                param2[3] = new SqlParameter("@ExamTypeId", ExamTypeId);
                param2[4] = new SqlParameter("@semid", semid);
                DataSet Photods = dbHandler.ReturnDataWithStoredProcedure("USP_GET_NRForPrinterPinListForPhotos", param2);
                var path = ConfigurationManager.AppSettings["StudentPhotosFolder"].ToString();
                CreateIfMissing(path);
                var DipomaPrinterNrData = DataTableHelper.ConvertDataTable<NRPhotosData>(Photods.Tables[1]);
                //var DipomaPrinterNrData = DataTableHelper.ConvertDataTable<NRPhotosData>(Photods.Tables[1]);

                if (DipomaPrinterNrData.Count > 0)
                {
                    var Photos = DipomaPrinterNrData.Select(x => new { x.PIN, x.Studentid }).Distinct().ToList();
                    foreach (var stu in Photos)
                    {
                        if (!System.IO.File.Exists(path + "\\" + stu.PIN + ".jpg"))
                        {
                            var param1 = new SqlParameter[1];
                            param1[0] = new SqlParameter("@studentid", stu.Studentid);
                            DataSet ds1 = dbHandler.ReturnDataWithStoredProcedure("USP_GET_StudentPhotoByStudentId", param1);
                            if (ds1.Tables[0].Rows[0]["ResponceCode"].ToString() == "200")
                            {
                                var base64photo = ds1.Tables[1].Rows[0]["profilephoto"].ToString().Replace("data:image/png;base64,", "").Replace("data:image/jpeg;base64,", "");
                                byte[] imageBytes = Convert.FromBase64String(base64photo);
                                System.IO.File.WriteAllBytes(path + "\\" + stu.PIN + ".jpg", imageBytes);

                            }
                        }
                    }
                }

                GenerateNR GenerateNR = new GenerateNR();
                return GenerateNR.GetNrForPrinter(ds, ds.Tables[0].Rows[0]["ExamMonthYear"].ToString());
            }
            catch (Exception ex)
            {
                return ex.Message;
            }
        }

        [AuthorizationFilter()]
        [AuthorizationFilter][HttpGet, ActionName("PrinterNrCollegeVsBranchReport")]
        public string PrinterNrCollegeVsBranchReport(int ExamMonthYearId, int AcademicYearId, int StudentTypeId, int ExamTypeId)
        {
            try
            {
                var dbHandler = new dbHandler();
                var param = new SqlParameter[4];
                param[0] = new SqlParameter("@ExamMonthYearId", ExamMonthYearId);
                param[1] = new SqlParameter("@AcademicID", AcademicYearId);
                param[2] = new SqlParameter("@StudentTypeId", StudentTypeId);
                param[3] = new SqlParameter("@ExamTypeId", ExamTypeId);
                DataSet ds = dbHandler.ReturnDataWithStoredProcedure("USP_GET_NR_CollegeVsBranchReport", param);
                if (ds.Tables[0].Rows[0]["ResponceCode"].ToString() == "200")
                {
                    var filename = "NRCollegeVsBranchReport" + "_" + ds.Tables[0].Rows[0]["ExamMonthYear"].ToString() + "_" + Guid.NewGuid() + ".xlsx";
                    var eh = new ExcelHelper();
                    var path = ConfigurationManager.AppSettings["DownloadsFolderPath"];
                    DataSet excelds = ds;
                    bool folderExists = Directory.Exists(path);
                    if (!folderExists)
                        Directory.CreateDirectory(path);
                    eh.ExportDataSet(excelds, path + filename);
                    Timer timer = new Timer(200000);
                    timer.Elapsed += (sender, e) => elapse(sender, e, ConfigurationManager.AppSettings["DownloadsFolderPath"] + filename);
                    timer.Start();
                    return "/Downloads/" + filename;
                }
                else
                {
                    var filename = "NRCollegeVsBranchReport-" + Guid.NewGuid().ToString() + ".xlsx";
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
            }
            catch (Exception ex)
            {
                //dbHandler.SaveErorr("GetFeePaymentReports", token.UserId, ex.Message + "\n-----------\n" + ex.StackTrace);
                return "";
            }
        }

        [AuthorizationFilter()]
        [AuthorizationFilter][HttpGet, ActionName("NrReports")]
        public string NrReports(string ExamMonthYearId, string StudentTypeId, string CollegeCode, string ExamDate, string ExamTypeId)
        {
            string NRReportDir = @"Reports\NR\";
            try
            {
                string examMonthYearId = NumberCheck(ExamMonthYearId.ToString(), "ExamMonthYear");
                string studentTypeId = NumberCheck(StudentTypeId.ToString(), "StudentType");
                string collegeCode = NumberCheck(CollegeCode.ToString(), "CollegeCode");
                string examDate = DateCheck(ExamDate.ToString(), "ExamDate");
                string examTypeId = NumberCheck(ExamTypeId.ToString(), "ExamType");


                if (examMonthYearId != "YES")
                {
                    return examMonthYearId;
                }
                else if (studentTypeId != "YES")
                {
                    return studentTypeId;
                }

                else if (collegeCode != "YES")
                {
                    return collegeCode;      
                }
                else if (examDate != "YES")
                {
                    return examDate;
                }
                else if (examTypeId != "YES")
                {
                    return examTypeId;
                }

                var dbHandler = new dbHandler();
                var param = new SqlParameter[5];
                param[0] = new SqlParameter("@ExamMonthYearId", int.Parse(ExamMonthYearId));
                param[1] = new SqlParameter("@StudentTypeId", int.Parse(StudentTypeId));
                param[2] = new SqlParameter("@CollegeCode", CollegeCode);
                param[3] = new SqlParameter("@ExamDate", ExamDate);
                param[4] = new SqlParameter("@ExamType", int.Parse(ExamTypeId));
                DataSet ds = dbHandler.ReturnDataWithStoredProcedure("USP_SFP_GET_NR_BAC_Test", param);
                GenerateNR GenerateNR = new GenerateNR();
                var pdf = GenerateNR.GetNrPdf(ds, NRReportDir);

                return pdf;
            }
            catch (Exception ex)
            {
                return null;
            }
        }

        [AuthorizationFilter()]
        [AuthorizationFilter][HttpGet, ActionName("GetCurrentExamDatesForNr")]
        public string GetCurrentExamDatesForNr(int ExamMonthYearId, int StudentTypeId, int ExamTypeId)
        {
            try
            {
                var dbHandler = new dbHandler();
                var param = new SqlParameter[3];
                param[0] = new SqlParameter("@ExamMonthYearId", ExamMonthYearId);
                param[1] = new SqlParameter("@StudentTypeId", StudentTypeId);
                param[2] = new SqlParameter("@ExamTypeId", ExamTypeId);
                var dt = dbHandler.ReturnDataWithStoredProcedure("USP_SFP_GET_CurrentExamDates ", param);
                return JsonConvert.SerializeObject(dt);
            }
            catch (Exception ex)
            {
                dbHandler.SaveErorr("USP_SFP_GET_CurrentExamDates", 0, ex.Message);
                return JsonConvert.SerializeObject(ex.Message);
            }
        }

        private static void elapse(object sender, ElapsedEventArgs e, string s)
        {
            System.IO.File.Delete(s);
            ((Timer)sender).Stop();
            ((Timer)sender).Dispose();
        }

        [AuthorizationFilter()]
        [AuthorizationFilter][HttpGet, ActionName("GetSubBillerDayWiseCount")]
        public string GetSubBillerDayWiseCount(string Date)
        {
            try
            {
                var dbHandler = new dbHandler();
                var param = new SqlParameter[1];
                param[0] = new SqlParameter("@Date ", Date);
                var ds = dbHandler.ReturnDataWithStoredProcedure("USP_GET_SubBillerDateBasedReports", param);
                return JsonConvert.SerializeObject(ds);
            }
            catch (Exception ex)
            {
                dbHandler.SaveErorr("USP_GET_SubBillerDateBasedReports", 0, ex.Message);
                return ex.Message;
            }
        }

        [AuthorizationFilter()]
        [AuthorizationFilter][HttpGet, ActionName("addorUpdateFeeSettings")]
        public string addorUpdateFeeSettings(int DataType, int ID, string Name, bool Is_Active, int Price, int ServiceType, string ChallanPrefix, string UserName)
        {
            try
            {
                var dbHandler = new dbHandler();
                var param = new SqlParameter[8];
                param[0] = new SqlParameter("@DataType", DataType);
                param[1] = new SqlParameter("@ID", ID);
                param[2] = new SqlParameter("@Name", Name);
                param[3] = new SqlParameter("@Is_Active", Is_Active);
                param[4] = new SqlParameter("@Price", Price);
                param[5] = new SqlParameter("@ServiceType", ServiceType);
                param[6] = new SqlParameter("@ChallanPrefix", ChallanPrefix);
                param[7] = new SqlParameter("@UserName", UserName);
                var dt = dbHandler.ReturnDataWithStoredProcedureTable("SP_Add_Update_CertificateTypes", param);
                return JsonConvert.SerializeObject(dt);
            }
            catch (Exception ex)
            {
                dbHandler.SaveErorr("SP_Add_Update_CertificateTypes", 0, ex.Message);
                return ex.Message;
            }
        }


        [AuthorizationFilter()]
        [AuthorizationFilter][HttpPost, ActionName("GetSemesterWiseStatisticsExcel")]
        public string GetSemesterWiseStatisticsExcel(int DataType, int AcademicYearId, int Exammonthyearid, string CollegeCode, string BranchCode)
        {
            try
            {
                


                var dbHandler = new dbHandler();
                string StrQuery = "USP_GET_ResultStatistics ";
                var param = new SqlParameter[5];
                param[0] = new SqlParameter("@DataType", DataType);
                param[1] = new SqlParameter("@AcademicYearId", AcademicYearId);
                param[2] = new SqlParameter("@Exammonthyearid", Exammonthyearid);
                param[3] = new SqlParameter("@CollegeCode", CollegeCode);
                param[4] = new SqlParameter("@BranchCode", BranchCode);
                var ds = dbHandler.ReturnDataWithStoredProcedure(StrQuery, param);
                var filename = "SemesterWiseStatistics_" + ".xlsx";
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
                //dbHandler.SaveErorr("USP_GET_ResultStatistics", token.UserId, ex.Message + "\n-----------\n" + ex.StackTrace);
                return "Error Occured. Please Try Again";
            }
        }

        [AuthorizationFilter()]
        [AuthorizationFilter][HttpPost, ActionName("GetCollegeWiseStatisticsExcel")]
        public string GetCollegeWiseStatisticsExcel(int DataType, int AcademicYearId, int Exammonthyearid, string CollegeCode, string BranchCode)
        {
            try
            {
                var dbHandler = new dbHandler();
                string StrQuery = "USP_GET_ResultStatistics ";
                var param = new SqlParameter[5];
                param[0] = new SqlParameter("@DataType", DataType);
                param[1] = new SqlParameter("@AcademicYearId", AcademicYearId);
                param[2] = new SqlParameter("@Exammonthyearid", Exammonthyearid);
                param[3] = new SqlParameter("@CollegeCode", CollegeCode);
                param[4] = new SqlParameter("@BranchCode", BranchCode);
                var ds = dbHandler.ReturnDataWithStoredProcedure(StrQuery, param);
                var filename = "CollegeWiseStatistics_" + ".xlsx";
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
                //dbHandler.SaveErorr("USP_GET_ResultStatistics", token.UserId, ex.Message + "\n-----------\n" + ex.StackTrace);
                return "Error Occured. Please Try Again";
            }
        }

        [AuthorizationFilter()]
        [AuthorizationFilter][HttpPost, ActionName("GetBranchWiseStatisticsExcel")]
        public string GetBranchWiseStatisticsExcel(int DataType, int AcademicYearId, int Exammonthyearid, string CollegeCode, string BranchCode)
        {
            try
            {
                var dbHandler = new dbHandler();
                string StrQuery = "USP_GET_ResultStatistics ";
                var param = new SqlParameter[5];
                param[0] = new SqlParameter("@DataType", DataType);
                param[1] = new SqlParameter("@AcademicYearId", AcademicYearId);
                param[2] = new SqlParameter("@Exammonthyearid", Exammonthyearid);
                param[3] = new SqlParameter("@CollegeCode", CollegeCode);
                param[4] = new SqlParameter("@BranchCode", BranchCode);
                var ds = dbHandler.ReturnDataWithStoredProcedure(StrQuery, param);
                var filename = "BranchWiseStatistics_" + ".xlsx";
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
                //dbHandler.SaveErorr("USP_GET_ResultStatistics", token.UserId, ex.Message + "\n-----------\n" + ex.StackTrace);
                return "Error Occured. Please Try Again";
            }
        }




        [AuthorizationFilter()]
        [AuthorizationFilter][HttpGet, ActionName("GetMonthlyAbstractCount")]
        public string GetMonthlyAbstractCount(string fromDate, string toDate)
        {
            try
            {
                var dbHandler = new dbHandler();
                var param = new SqlParameter[2];
                param[0] = new SqlParameter("@fromDate ", fromDate);
                param[1] = new SqlParameter("@toDate ", toDate);
                var ds = dbHandler.ReturnDataWithStoredProcedure("USP_GET_SubBillerMonthBasedReports", param);
                return JsonConvert.SerializeObject(ds);
            }
            catch (Exception ex)
            {
                dbHandler.SaveErorr("USP_GET_SubBillerMonthBasedReports", 0, ex.Message);
                return ex.Message;
            }
        }



        [AuthorizationFilter()]
        [AuthorizationFilter][HttpPost, ActionName("GetMonthwiseAbstractReport")]
        public string GetMonthwiseAbstractReport(int DataType, string subbillerid, string fromDate, string toDate)
        {
            try
            {
                var dbHandler = new dbHandler();
                string StrQuery = "SP_Get_SubBillerMonthBasedReportslist ";
                var param = new SqlParameter[4];
                param[0] = new SqlParameter("@DataType", DataType);
                param[1] = new SqlParameter("@subbillerid", subbillerid);
                param[2] = new SqlParameter("@fromDate", fromDate);
                param[3] = new SqlParameter("@toDate", toDate);
                //param[2].Value = Date;
                var ds = dbHandler.ReturnDataWithStoredProcedure(StrQuery, param);
                if (DataType == 1)
                {
                    var filename = "MonthlyAbstract_TotalRecords_" + subbillerid + ".xlsx";
                    var eh = new ExcelHelper();
                    var path = ConfigurationManager.AppSettings["DownloadsFolderPathSB"];
                    bool folderExists = Directory.Exists(path);
                    if (!folderExists)
                        Directory.CreateDirectory(path);
                    eh.ExportDataSet(ds, path + filename);
                    Timer timer = new Timer(30000);
                    timer.Elapsed += (sender, e) => elapse(sender, e, ConfigurationManager.AppSettings["DownloadsFolderPathSB"] + filename);
                    timer.Start();
                    return "/TR/" + filename;
                }
                else if (DataType == 2)
                {
                    var filename = "MonthlyAbstract_Success_" + subbillerid + ".xlsx";
                    var eh = new ExcelHelper();
                    var path = ConfigurationManager.AppSettings["DownloadsFolderPathSB"];
                    bool folderExists = Directory.Exists(path);
                    if (!folderExists)
                        Directory.CreateDirectory(path);
                    eh.ExportDataSet(ds, path + filename);
                    Timer timer = new Timer(30000);
                    timer.Elapsed += (sender, e) => elapse(sender, e, ConfigurationManager.AppSettings["DownloadsFolderPathSB"] + filename);
                    timer.Start();
                    return "/TR/" + filename;
                }
                else if (DataType == 3)
                {
                    var filename = "MonthlyAbstract_Fail_" + subbillerid + ".xlsx";
                    var eh = new ExcelHelper();
                    var path = ConfigurationManager.AppSettings["DownloadsFolderPathSB"];
                    bool folderExists = Directory.Exists(path);
                    if (!folderExists)
                        Directory.CreateDirectory(path);
                    eh.ExportDataSet(ds, path + filename);
                    Timer timer = new Timer(30000);
                    timer.Elapsed += (sender, e) => elapse(sender, e, ConfigurationManager.AppSettings["DownloadsFolderPathSB"] + filename);
                    timer.Start();
                    return "/TR/" + filename;
                }
                else if (DataType == 4)
                {
                    var filename = "MonthlyAbstract_Reject_" + subbillerid + ".xlsx";
                    var eh = new ExcelHelper();
                    var path = ConfigurationManager.AppSettings["DownloadsFolderPathSB"];
                    bool folderExists = Directory.Exists(path);
                    if (!folderExists)
                        Directory.CreateDirectory(path);
                    eh.ExportDataSet(ds, path + filename);
                    Timer timer = new Timer(30000);
                    timer.Elapsed += (sender, e) => elapse(sender, e, ConfigurationManager.AppSettings["DownloadsFolderPathSB"] + filename);
                    timer.Start();
                    return "/TR/" + filename;
                }
                return "/TR/";

            }
            catch (Exception ex)
            {
                //dbHandler.SaveErorr("SP_Get_SubBillerMonthBasedReportslist", token.UserId, ex.Message + "\n-----------\n" + ex.StackTrace);
                return "Error Occured. Please Try Again";
            }
        }


        [AuthorizationFilter()]
        [AuthorizationFilter][HttpPost, ActionName("GetMonthlywiseAbstractCountExcel")]
        public string GetMonthlywiseAbstractCountExcel(string fromDate, string toDate)
        {
            try
            {
                var dbHandler = new dbHandler();
                string StrQuery = "USP_GET_SubBillerMonthBasedReports ";
                var param = new SqlParameter[2];
                param[0] = new SqlParameter("@fromDate", fromDate);
                param[1] = new SqlParameter("@toDate", toDate);
                var ds = dbHandler.ReturnDataWithStoredProcedure(StrQuery, param);
                var filename = "MonthlywiseAbstractCount_" + ".xlsx";
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
                //dbHandler.SaveErorr("USP_GET_SubBillerMonthBasedReports", token.UserId, ex.Message + "\n-----------\n" + ex.StackTrace);
                return "Error Occured. Please Try Again";
            }
        }

    }
}
