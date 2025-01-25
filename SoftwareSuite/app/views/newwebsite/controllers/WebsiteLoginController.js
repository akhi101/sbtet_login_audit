define(['app'], function (app) {
    app.controller("WebsiteLoginController", function ($scope,$http, $localStorage, $state, $window, AppSettings, SystemUserService, $crypto, PreExaminationService, AdminService) {


        const $ctrl = this;

        $ctrl.$onInit = () => {
            $scope.Loginbutton = false;
            $scope.SessionCaptcha = sessionStorage.getItem('SessionCaptcha')

            var eKey = SystemUserService.GetEKey();
            eKey.then(function (res) {
                $scope.LoginSessionEKey = res;
                $scope.EncriptedSession = $crypto.encrypt($crypto.encrypt($scope.SessionCaptcha, 'HBSBP9214EDU00TS'), $scope.LoginSessionEKey) + '$$@@$$' + $scope.LoginSessionEKey;
                $scope.GetCaptchaData()

            });


        }

        $scope.GetCaptchaData = function () {
            var captcha = PreExaminationService.GetCaptchaString($scope.EncriptedSession);
            captcha.then(function (response) {
                try {
                    var res = JSON.parse(response);
                    $scope.GetCatcha = res[0].Text;
                    $scope.CaptchaImage = res[0].Image;

                } catch (err) {
                    $scope.GetCatcha = ''
                }
            }, function (error) {
                $scope.GetCatcha = ''
                alert('Unable to load Captcha')
            });
        }


        $scope.validatecaptcha = function () {

  
            if ($scope.UserName == "" || $scope.UserName == undefined || $scope.UserName == null) {
                $scope.UserNamemessage = "* Enter user name";
                alert("Enter UserName");
                $scope.Loginbutton = false;
                return;
            }
            else if ($scope.Password == "" || $scope.Password == undefined || $scope.Password == null) {
                $scope.UserPasswordmessage = "* Enter Password";
                alert("Enter Password");
                $scope.Loginbutton = false;
                return;
            }
            else if ($scope.CaptchaText == "" || $scope.CaptchaText == undefined || $scope.CaptchaText == null) {
                $scope.UserNamemessage = "* Enter Captcha";
                alert("Enter Captcha");
                $scope.Loginbutton = false;
                return;
            }

            $scope.EncriptedSession = $crypto.encrypt($crypto.encrypt($scope.SessionCaptcha, 'HBSBP9214EDU00TS'), $scope.LoginSessionEKey) + '$$@@$$' + $scope.LoginSessionEKey;
            var EncriptedCaptchaText = $crypto.encrypt($crypto.encrypt($scope.CaptchaText.toString(), 'HBSBP9214EDU00TS'), $scope.LoginSessionEKey) + '$$@@$$' + $scope.LoginSessionEKey;

            var captcha = AdminService.ValidateCaptcha($scope.EncriptedSession, EncriptedCaptchaText);
            captcha.then(function (res) {
                var response = JSON.parse(res)
                if (response[0].ResponceCode == '200') {
                    //alert(response[0].ResponceDescription)
                    $scope.CaptchaText = "";
                    $scope.GetCatcha = response[0].Captcha
                    var captcha = JSON.parse(response[0].Captcha)
                    $scope.CaptchaImage = captcha[0].Image;
                    $scope.CaptchaText = "";
                    $scope.Login()


                } else {
                    alert(response[0].ResponceDescription)
                    $scope.CaptchaText = "";
                    $scope.GetCatcha = response[0].Captcha
                    var captcha = JSON.parse(response[0].Captcha)

                    $scope.CaptchaImage = captcha[0].Image;
                    $scope.CaptchaText = "";
                    $scope.Loginbutton = false;

                }

            }, function (error) {
                $scope.GetCatcha = ''
                alert('Unable to load Captcha')
            });
        }

        $scope.addAccountStatus = function () {
            $scope.loading = true;
            var DataType = 1;
            var Encripteddatatype = $crypto.encrypt($crypto.encrypt(DataType.toString(), 'HBSBP9214EDU00TS'), $scope.LoginSessionEKey) + '$$@@$$' + $scope.LoginSessionEKey;
            var EncriptedUserName = $crypto.encrypt($crypto.encrypt($scope.UserName.toString(), 'HBSBP9214EDU00TS'), $scope.LoginSessionEKey) + '$$@@$$' + $scope.LoginSessionEKey;
            var addaccount = AdminService.AddAccountStatus(Encripteddatatype, EncriptedUserName)
            addaccount.then(function (resp) {
                try {
                    var res = JSON.parse(resp);
                }
                catch (err) { }
                if (res.Table.length > 0) {
                    $scope.AccountStatus = res.Table;
                    $scope.getAccountStatus();
                    $scope.loading = false;
                }
                else {
                    $scope.AccountStatus = [];
                    $scope.loading = false;
                }

            },
                function (error) {
                    //alert("data is not loaded");
                    //    var err = JSON.parse(error);
                });

        }

        $scope.getAccountStatus = function () {
            $scope.loading = true;
            var DataType = 2;
            var Encripteddatatype = $crypto.encrypt($crypto.encrypt(DataType.toString(), 'HBSBP9214EDU00TS'), $scope.LoginSessionEKey) + '$$@@$$' + $scope.LoginSessionEKey;
            var EncriptedUserName = $crypto.encrypt($crypto.encrypt($scope.UserName.toString(), 'HBSBP9214EDU00TS'), $scope.LoginSessionEKey) + '$$@@$$' + $scope.LoginSessionEKey;
            var addaccount = AdminService.GetAccountStatus(Encripteddatatype , EncriptedUserName);
            addaccount.then(function (resp) {
                try {
                    var res = JSON.parse(resp);
                }
                catch (err) { }
                if (res.Table.length > 0) {
                    $scope.AccountStatusData = res.Table;
                    $scope.loading = false;
                }
                else {
                    $scope.AccountStatusData = [];
                    $scope.loading = false;
                }

            },
                function (error) {
                    //alert("data is not loaded");
                    //    var err = JSON.parse(error);
                });

        }






        $scope.loginFailed = false;
        $scope.loginAttempts = 0;
        $scope.Login = function () {
            delete $localStorage.authorizationData;


            if ($scope.UserName == undefined) {
                $scope.UserName = ""
            };
            if ($scope.Password == undefined) {
                $scope.Password = ""
            };

            if ($scope.UserName == "" && $scope.Password == "") {
                $scope.UserNamemessage = "* Enter user name";
                $scope.Passwordmessage = "* Enter Password";
                alert("Enter UserName And Password");
                return;
            }
            if ($scope.UserName == "") {
                $scope.UserNamemessage = "* Enter user name";
                alert("Enter UserName");
                return;
            }
            else if ($scope.Password == "") {
                $scope.Passwordmessage = "* Enter Password";
                alert("Enter Password");
                return;
            }
            else {

                if ($scope.Password !== null && $scope.UserName !== null) {

                    var data = $crypto.encrypt($scope.Password, $scope.LoginSessionEKey) + "$$@@$$" + $crypto.encrypt($scope.UserName, $scope.LoginSessionEKey) + "$$@@$$" + $scope.LoginSessionEKey;
                    $http.post(AppSettings.WebApiUrl + 'api/SystemUser/GetUserLogin', data, {}).then(function (response) {
                        //console.log(response)
                        var UserRights = [];
                        sessionStorage.loggedIn = "yes";
                        var token = response.data.token + "$$@@$$" + $scope.LoginSessionEKey;
                        sessionStorage.setItem('authToken', token);
                        $localStorage.authToken = response.data.token + "$$@@$$" + $scope.LoginSessionEKey;
                        var status = response.data.data.UserAuth[0].ResponceCode;
                        if (status != "200" && $scope.loginAttempts <= 2) {
                            alert(response.data.data.UserAuth[0].RespoceDescription);
                            $scope.loginFailed = true;
                            $scope.Loginbutton = false;
                            $scope.loginAttempts++;
                        }
                        else if ((status != "200" || status == "200") && $scope.loginAttempts >= 2) {
                            alert('Account Locked');
                            $scope.addAccountStatus();
                            $timeout(function () {
                                $scope.loginAttempts = 0;
                                $scope.Loginbutton = false;
                            }, 1 * 60 * 1000);
                            return;
                        }
                        else {
                            var DataType = 2;
                            var Encripteddatatype = $crypto.encrypt($crypto.encrypt(DataType.toString(), 'HBSBP9214EDU00TS'), $scope.LoginSessionEKey) + '$$@@$$' + $scope.LoginSessionEKey;
                            var EncriptedUserName = $crypto.encrypt($crypto.encrypt($scope.UserName.toString(), 'HBSBP9214EDU00TS'), $scope.LoginSessionEKey) + '$$@@$$' + $scope.LoginSessionEKey;
                            var addaccount = AdminService.GetAccountStatus(Encripteddatatype, EncriptedUserName);
                            addaccount.then(function (resp) {
                                try {
                                    var res = JSON.parse(resp);
                                }
                                catch (err) { }
                                if (res.Table.length > 0) {
                                    $scope.AccountStatusData = res.Table;
                                    $scope.loading = false;
                                    if ($scope.AccountStatusData[0].AccountLocked == false || $scope.AccountStatusData[0].AccountLocked == null) {
                                        $scope.Loginbutton = true;

                                        sessionStorage.setItem('SessionID', $scope.LoginSessionEKey);
                                        response.data = response.data.data.SystemUser[0];
                                        try {
                                            authorizationData = {
                                                token: sessionStorage.getItem("authToken"),
                                                SessionID: $scope.LoginSessionEkey,
                                                SysUserID: response.data.UserId,
                                                College_Code: response.data.CollegeCode,
                                                College_Name: response.data.CollegeName,
                                                SystemUserTypeId: response.data.UserTypeId,
                                                UserName: $scope.UserName.toUpperCase(),
                                                CollegeID: response.data.CollegeId,
                                                BranchCode: response.data.BranchCode,
                                                BranchId: response.data.BranchId,

                                                CollegeCatName: "",
                                                Clg_Type: "",
                                                SectionId: "",
                                                SchemeId: "",
                                                SemesterId: "",
                                                AcademicId: "",
                                                percentage: "",
                                                TypeFlag: response.data.TypeFlag,
                                                MngtTypID: response.data.MngtTypID,
                                                SysUsrGrpID: response.data.SysUsrGrpID,
                                                SeqNo: response.data.SeqNo
                                            };

                                            sessionStorage.setItem('user', JSON.stringify(authorizationData));
                                            $state.go('Dashboard');
                                            $scope.Loginbutton = false;
                                        } catch (err) {

                                        }
                                        $state.go('Dashboard');
                                    }
                                    else {
                                        alert('Account is Locked');
                                        $scope.loading = false;
                                        $scope.Loginbutton = false;
                                        return;
                                    }
                                }
                            },
                                function (error) {
                                    //alert("data is not loaded");
                                    //    var err = JSON.parse(error);
                                });
                        }
                    });
                };
            }

        }
        $scope.ForgetPasswordChange = function () {
            $state.go('ForgetPassword');
        }



    });

});