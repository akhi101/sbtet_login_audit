﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SoftwareSuite.Models.Security
{
    public class AuthToken
    {
        //internal object collegeType;
        public string UserName { get; set; }
        public string UserPassword { get; set; }
        public string Salt { get; set; }
        public string AuthTokenId { get; set; }
        public string UserId { get; set; }
        public string BranchCode { get; set; }
        public string BranchId { get; set; }

        public string CollegeId { get; set; }
        public string CollegeName { get; set; }
        public string UserTypeId { get; set; }
        public string CollegeCode { get; set; }
        public string collegeType { get; set; }
        //public string AccountLocked { get; set; }
        public string ResponceCode { get; set; }
        public string RespoceDescription { get; set; }
        public DateTime ExpiryDate { get; set; }
    }

    //public class refreshAuthToken
    //{
    //    public string Token { get; set;}
    //    public bool isTokenValid { get; set;}
    //    public DateTime TokenExpiryDate { get; set;}
    //}
}
