define(['app'], function (app) {
    app.controller("ChangePasswordController", function ($scope, $state, $filter, $localStorage, $stateParams, $crypto, AppSettings, ChangePasswordService, MenuService, SystemUserService) {
      
        //var authData = $localStorage.authorizationData;
        var authData = JSON.parse(sessionStorage.getItem('user'));

        $scope.NewPassword = "";
            //$scope.userType = authData.SystemUserTypeId
            $scope.userName = authData.UserName;

            AppSettings.userName = authData.userName;
            AppSettings.LoggedUserId = authData.SysUserID;
            //alert("College Id" + authData.CollegeID);
            AppSettings.CollegeID = authData.CollegeID;
            $scope.CollegeID = authData.CollegeID;
            AppSettings.AcdYrID = authData.AcdYrID;
            AppSettings.PrevAdmNo = authData.PrevAdmNo;
            AppSettings.TypeFlag = authData.TypeFlag;
            AppSettings.MngtTypID = authData.MngtTypID;
            AppSettings.SysUsrGrpID = authData.SysUsrGrpID,
            AppSettings.SeqNo = authData.SeqNo,
            AppSettings.UserRights = authData.UserRights,
            AppSettings.DistrictIDs = authData.DistrictIDs;
            AppSettings.College_Code = authData.College_Code;
            AppSettings.College_Name = authData.College_Name;
            $scope.College_Name = authData.College_Name
            $scope.College_Code = authData.College_Code;
            $scope.ChangePassword = {};
            $scope.shownewpassword = false;
            $scope.CheckOldPassword = function () {
                if (($scope.OldPassword == undefined) || ($scope.OldPassword == "")) {
                    alert("Enter Old Password");
                    return false;
                }
                let reqdata = $crypto.encrypt($scope.OldPassword, authData.AuthTokenId) + "$$@@$$" + $crypto.encrypt(AppSettings.LoggedUserId.toString(), authData.AuthTokenId) + "$$@@$$" + authData.AuthTokenId;
                var getPromise = ChangePasswordService.GetCheckOldPassword(reqdata);
                getPromise.then(function (data) {
                    if (data == 0) {
                        alert("Invalid Old Password");
                        return;
                    } else {
                        $scope.shownewpassword = true;
                    }
                }, function (error) {
                    alert(error);
                });
            }
        $scope.SaveChangePassword = function () {
            if (($scope.OldPassword == undefined) || ($scope.OldPassword == "")) {
                alert("Enter Old Password");
                return;
            }

                if (($scope.NewPassword == undefined) || ($scope.NewPassword == "")) {
                    alert("Enter New Password");
                    return;
                }
                if (($scope.ConfirmPassword == undefined) || ($scope.ConfirmPassword == "")) {
                    alert("Enter Confirm Password");
                    return;
                }
            if (($scope.NewPassword && $scope.NewPassword.length) != ($scope.ConfirmPassword && $scope.ConfirmPassword.length)) {
                    alert("New Password and Confirm Password did not match.");
                    return;
            }
            if (($scope.NewPassword == $scope.OldPassword) || ($scope.ConfirmPassword == $scope.OldPassword)) {
                alert("New Password and Old Password must not be same");
                return;
            }
            var passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()\-_=+{};:,<.>])(?!.*(?:yourUserId|yourAppName)).{8,}$/;
            if (passwordRegex.test($scope.NewPassword)) {
            } else {
                alert('Password does not meet the requirements');
                return;
            }
            if (passwordRegex.test($scope.ConfirmPassword)) {
            } else {
                alert('Password does not meet the requirements');
                return;
            }
            let reqdata = $crypto.encrypt($scope.NewPassword, authData.AuthTokenId) + "$$@@$$" + $crypto.encrypt($scope.OldPassword, authData.AuthTokenId) + "$$@@$$" + $crypto.encrypt(AppSettings.LoggedUserId.toString(), authData.AuthTokenId) + "$$@@$$" + authData.AuthTokenId;
            var getPromise = ChangePasswordService.GetChangePassword(reqdata);
            getPromise.then(function (data) {
                if (data.ResponceCode == "200") {
                    alert(data.ResponceDescription);
                    $scope.logOut();
                } else {
                    alert(data.ResponceDescription);
                    $scope.OldPassword = "";
                    $scope.NewPassword = "";
                    $scope.ConfirmPassword = "";
                }
                  
                }, function (error) {
                    alert(error);
                });
            }
            $scope.Exit = function () {
                RedirectToListPage();
            }
            function RedirectToListPage() {
                $state.go('index.WebsiteLogin');
            }
        $scope.logOut = function () {
            sessionStorage.loggedIn = "no";
            var GetUserLogout = SystemUserService.getUserLogout();
            $state.go('index.WebsiteLogin');

        }
    });
    });

