define(['app'], function (app) {
    app.controller("ForgetPasswordController", function ($scope, $state, $filter, $stateParams, AppSettings, $crypto, ForgetPasswordService, SystemUserService) {
        $scope.ForgetPassword = {};
        $scope.ShowLoading = false;

        const $ctrl = this;

        $ctrl.$onInit = () => {
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


            if (($scope.ForgetPassword.LoginName == undefined) || ($scope.ForgetPassword.LoginName == "")) {
                alert("Enter Username");
                return false;
            }

            if (($scope.ForgetPassword.CellNo == undefined) || ($scope.ForgetPassword.CellNo == "")) {
                alert("Enter Mobile Number");
                return false;
            }
            if (($scope.ForgetPassword.CellNo.length < 10) || ($scope.ForgetPassword.CellNo.length > 10)) {
                alert("Invalid Mobile Number");
                return false;
            }
            else if ($scope.CaptchaText == "" || $scope.CaptchaText == undefined || $scope.CaptchaText == null) {
                $scope.UserNamemessage = "* Enter Captcha";
                alert("Enter Captcha");
                $scope.Loginbutton = false;
                return;
            }

            $scope.EncriptedSession = $crypto.encrypt($crypto.encrypt($scope.SessionCaptcha, 'HBSBP9214EDU00TS'), $scope.LoginSessionEKey) + '$$@@$$' + $scope.LoginSessionEKey;
            var EncriptedCaptchaText = $crypto.encrypt($crypto.encrypt($scope.CaptchaText.toString(), 'HBSBP9214EDU00TS'), $scope.LoginSessionEKey) + '$$@@$$' + $scope.LoginSessionEKey;
            var Encriptedloginname = $crypto.encrypt($crypto.encrypt($scope.ForgetPassword.LoginName.toString(), 'HBSBP9214EDU00TS'), $scope.LoginSessionEKey) + '$$@@$$' + $scope.LoginSessionEKey;
            var Encriptedcellno = $crypto.encrypt($crypto.encrypt($scope.ForgetPassword.CellNo.toString(), 'HBSBP9214EDU00TS'), $scope.LoginSessionEKey) + '$$@@$$' + $scope.LoginSessionEKey;


            //let reqdata = $crypto.encrypt($scope.ForgetPassword.LoginName, $scope.SessionEKey) + "$$@@$$" + $crypto.encrypt($scope.ForgetPassword.CellNo, $scope.SessionEKey) + "$$@@$$" + $scope.SessionEKey;


            var captcha = AdminService.ValidateForgetPasswordCaptcha($scope.EncriptedSession, EncriptedCaptchaText, Encriptedloginname, Encriptedcellno);
            captcha.then(function (res) {
                var response = JSON.parse(res)
                if (response[0].ResponceCode == '200') {
                    //alert(response[0].ResponceDescription)
                    $scope.CaptchaText = "";
                    $scope.GetCatcha = response[0].Captcha
                    var captcha = JSON.parse(response[0].Captcha)
                    $scope.CaptchaImage = captcha[0].Image;
                    $scope.CaptchaText = "";
                    $scope.SavePreDetails()


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



        $scope.SavePreDetails = function () {
            $scope.Smsbtndisable = true;
            //if (($scope.ForgetPassword.LoginName == undefined) || ($scope.ForgetPassword.LoginName == "")) {
            //    alert("Enter Username");
            //    return false;
            //}
           
            //if (($scope.ForgetPassword.CellNo == undefined) || ($scope.ForgetPassword.CellNo == "")) {
            //    alert("Enter Mobile Number");
            //    return false;
            //}
            //if (($scope.ForgetPassword.CellNo.length < 10) || ($scope.ForgetPassword.CellNo.length > 10)) {
            //    alert("Invalid Mobile Number");
            //    return false;
            //}
            $scope.SysUserID = 0;
            $scope.ShowLoading = true;
            let reqdata = $crypto.encrypt($scope.ForgetPassword.LoginName, $scope.LoginSessionEKey) + "$$@@$$" + $crypto.encrypt($scope.ForgetPassword.CellNo, $scope.LoginSessionEKey) + "$$@@$$" + $scope.LoginSessionEKey;
            var getPromise = ForgetPasswordService.GetForgetPassword(reqdata);
            getPromise.then(function (data) {
                try {
                    var res = JSON.parse(data);

                } catch ( ex) {
                }
                if (res.Status == "200") {
                    $scope.Smsbtndisable = false;
                    $scope.ShowLoading = false;

                    var Message = "Dear Sir//Madam, Your Login Credentials: UserName=" + $scope.ForgetPassword.LoginName + ", Password= " + data[0].LoginPassword + " SBTETTS";
                    //var Urlstring = "?User=sbtetts&Passwd=sbtet@1972&Sid=SBTETS&Mobilenumber=91" + data[0].CellNo + "&Message=" + Message + "&Mtype=N&DR`=Y";
                    //  var FinalURL= AppSettings.SMSApiUrl + Urlstring;

                    alert("Login Credentials sent to the registered mobile number. Please check.");
                    RedirectToListPage();
                } else {
                    alert(res.Description);
                    $scope.Smsbtndisable = false;
                    $scope.ShowLoading = false;
                    $scope.RollEditDisable = false;
                }
               
            }, function (error) {
                    $scope.Smsbtndisable = false;
                $scope.ShowLoading = false;
                    $scope.RollEditDisable = false;
                    try {
                        var res = JSON.parse(error);

                    } catch (ex) {
                    }
                    alert(res.statusdesc);
               
            });
        }
        $scope.Exit = function () {
            RedirectToListPage();
        }
        function RedirectToListPage() {
            $state.go('login');
        }
    });
});
