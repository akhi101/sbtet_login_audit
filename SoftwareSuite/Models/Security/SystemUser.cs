using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SoftwareSuite.Models.Security
{
    public class SystemUser
    {
        public string UserName { get; set; }
        public string AuthTokenId { get; set; }
        public string UserId { get; set; }
        public string UserTypeId { get; set; }
        public string CollegeCode { get; set; }
        public string collegeType { get; set; }
        public string AccountLocked { get; set; }
        public DateTime ExpiryDate { get; set; }
        public string BranchCode { get; set; }
        public string CollegeName { get; set; }
        public string CollegeId { get; set; }
        public string BranchId { get; set; }
        public int AcademicId { get; set; }
        public string ResponceCode { get; set; }
        public string RespoceDescription { get; set; }
    }
    public class ReCaptcha
    { 
        public bool Success { get; set; }
        public float score { get; set; }

    }
    public class LogSystemUser
    {
        public string UserName { get; set; }
    }
    public class UserAuth
    {
        public string ResponceCode { get; set; }
        public string RespoceDescription { get; set; }
    }
    public class SystemUserAuth
    {
        public List<SystemUser> SystemUser { get; set; }
        public List<UserAuth> UserAuth { get; set; }
    }
}
