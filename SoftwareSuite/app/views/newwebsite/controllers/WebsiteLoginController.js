define(['app'], function (app) {
    app.controller("WebsiteLoginController", function ($scope, $http, $localStorage, $timeout, $state, $window, AppSettings, SystemUserService, $crypto, PreExaminationService, AdminService) {


        const $ctrl = this;

        $ctrl.$onInit = () => {
            $scope.Loginbutton = false;
            $scope.SessionCaptcha = sessionStorage.getItem('SessionCaptcha')

            var eKey = SystemUserService.GetEKey();
            eKey.then(function (res) {
                $scope.LoginEKey = res;
                $scope.EncriptedSession = $crypto.encrypt($crypto.encrypt($scope.SessionCaptcha, 'HBSBP9214EDU00TS'), $scope.LoginEKey) + '$$@@$$' + $scope.LoginEKey;
                $scope.GetCaptchaData()

            });

            var sessioneKey = SystemUserService.GetSessionEKey();
            sessioneKey.then(function (res) {
                $scope.LoginSessionEKey = res;
                sessionStorage.SessionEkey = res;

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


        $scope.decryptParameter1 = function () {
            var base64Key = "iT9/CmEpJz5Z1mkXZ9CeKXpHpdbG0a6XY0Fj1WblmZA="; // AES-256 Key
            var base64IV = "u4I0j3AQrwJnYHkgQFwVNw=="; // AES IV
            var ciphertext = $scope.USERNAME; // Encrypted text (Base64)

            var key = CryptoJS.enc.Base64.parse(base64Key);
            var iv = CryptoJS.enc.Base64.parse(base64IV);

            // Decrypt the ciphertext
            var decrypted = CryptoJS.AES.decrypt(ciphertext, key, {
                iv: iv,
                mode: CryptoJS.mode.CBC, // Ensure CBC mode
                padding: CryptoJS.pad.Pkcs7, // Ensure PKCS7 padding
            });

            // Convert decrypted data to a UTF-8 string
            $scope.decryptedText1 = decrypted.toString(CryptoJS.enc.Utf8);
            $scope.decryptedUserName = $scope.decryptedText1;
        };

        $scope.decryptParameter2 = function () {
            var base64Key = "iT9/CmEpJz5Z1mkXZ9CeKXpHpdbG0a6XY0Fj1WblmZA="; // AES-256 Key
            var base64IV = "u4I0j3AQrwJnYHkgQFwVNw=="; // AES IV
            var ciphertext = $scope.USERID; // Encrypted text (Base64)

            var key = CryptoJS.enc.Base64.parse(base64Key);
            var iv = CryptoJS.enc.Base64.parse(base64IV);

            // Decrypt the ciphertext
            var decrypted = CryptoJS.AES.decrypt(ciphertext, key, {
                iv: iv,
                mode: CryptoJS.mode.CBC, // Ensure CBC mode
                padding: CryptoJS.pad.Pkcs7, // Ensure PKCS7 padding
            });

            // Convert decrypted data to a UTF-8 string
            $scope.decryptedText2 = decrypted.toString(CryptoJS.enc.Utf8);
            $scope.decryptedUserID = $scope.decryptedText2;
        };

        $scope.decryptParameter3 = function () {
            var base64Key = "iT9/CmEpJz5Z1mkXZ9CeKXpHpdbG0a6XY0Fj1WblmZA="; // AES-256 Key
            var base64IV = "u4I0j3AQrwJnYHkgQFwVNw=="; // AES IV
            var ciphertext = $scope.USERTYPEID; // Encrypted text (Base64)

            var key = CryptoJS.enc.Base64.parse(base64Key);
            var iv = CryptoJS.enc.Base64.parse(base64IV);

            // Decrypt the ciphertext
            var decrypted = CryptoJS.AES.decrypt(ciphertext, key, {
                iv: iv,
                mode: CryptoJS.mode.CBC, // Ensure CBC mode
                padding: CryptoJS.pad.Pkcs7, // Ensure PKCS7 padding
            });

            // Convert decrypted data to a UTF-8 string
            $scope.decryptedText3 = decrypted.toString(CryptoJS.enc.Utf8);
            $scope.decryptedUserTypeID = $scope.decryptedText3;
        };

        $scope.decryptParameter4 = function () {
            var base64Key = "iT9/CmEpJz5Z1mkXZ9CeKXpHpdbG0a6XY0Fj1WblmZA="; // AES-256 Key
            var base64IV = "u4I0j3AQrwJnYHkgQFwVNw=="; // AES IV
            var ciphertext = $scope.RESPONSECODE; // Encrypted text (Base64)

            var key = CryptoJS.enc.Base64.parse(base64Key);
            var iv = CryptoJS.enc.Base64.parse(base64IV);

            // Decrypt the ciphertext
            var decrypted = CryptoJS.AES.decrypt(ciphertext, key, {
                iv: iv,
                mode: CryptoJS.mode.CBC, // Ensure CBC mode
                padding: CryptoJS.pad.Pkcs7, // Ensure PKCS7 padding
            });

            // Convert decrypted data to a UTF-8 string
            $scope.decryptedText4 = decrypted.toString(CryptoJS.enc.Utf8);
            $scope.decryptedResCode = $scope.decryptedText4;
        };

        $scope.decryptParameter5 = function () {
            var base64Key = "iT9/CmEpJz5Z1mkXZ9CeKXpHpdbG0a6XY0Fj1WblmZA="; // AES-256 Key
            var base64IV = "u4I0j3AQrwJnYHkgQFwVNw=="; // AES IV
            var ciphertext = $scope.RESDESCRIPTION; // Encrypted text (Base64)

            var key = CryptoJS.enc.Base64.parse(base64Key);
            var iv = CryptoJS.enc.Base64.parse(base64IV);

            // Decrypt the ciphertext
            var decrypted = CryptoJS.AES.decrypt(ciphertext, key, {
                iv: iv,
                mode: CryptoJS.mode.CBC, // Ensure CBC mode
                padding: CryptoJS.pad.Pkcs7, // Ensure PKCS7 padding
            });

            // Convert decrypted data to a UTF-8 string
            $scope.decryptedText5 = decrypted.toString(CryptoJS.enc.Utf8);
            $scope.decryptedResDesc = $scope.decryptedText5;
        };



        $scope.decryptParameter6 = function () {
            var base64Key = "iT9/CmEpJz5Z1mkXZ9CeKXpHpdbG0a6XY0Fj1WblmZA="; // AES-256 Key
            var base64IV = "u4I0j3AQrwJnYHkgQFwVNw=="; // AES IV
            var ciphertext = $scope.message; // Encrypted text (Base64)

            var key = CryptoJS.enc.Base64.parse(base64Key);
            var iv = CryptoJS.enc.Base64.parse(base64IV);

            // Decrypt the ciphertext
            var decrypted = CryptoJS.AES.decrypt(ciphertext, key, {
                iv: iv,
                mode: CryptoJS.mode.CBC, // Ensure CBC mode
                padding: CryptoJS.pad.Pkcs7, // Ensure PKCS7 padding
            });

            // Convert decrypted data to a UTF-8 string
            $scope.decryptedText6 = decrypted.toString(CryptoJS.enc.Utf8);
            $scope.decryptedmessage = $scope.decryptedText6;
        };

        $scope.decryptParameter7 = function () {
            var base64Key = "iT9/CmEpJz5Z1mkXZ9CeKXpHpdbG0a6XY0Fj1WblmZA="; // AES-256 Key
            var base64IV = "u4I0j3AQrwJnYHkgQFwVNw=="; // AES IV
            var ciphertext = $scope.isLocked; // Encrypted text (Base64)

            var key = CryptoJS.enc.Base64.parse(base64Key);
            var iv = CryptoJS.enc.Base64.parse(base64IV);

            // Decrypt the ciphertext
            var decrypted = CryptoJS.AES.decrypt(ciphertext, key, {
                iv: iv,
                mode: CryptoJS.mode.CBC, // Ensure CBC mode
                padding: CryptoJS.pad.Pkcs7, // Ensure PKCS7 padding
            });

            // Convert decrypted data to a UTF-8 string
            $scope.decryptedText7 = decrypted.toString(CryptoJS.enc.Utf8);
            $scope.decryptedislocked = $scope.decryptedText7;
        };

        $scope.decryptParameter8 = function () {
            var base64Key = "iT9/CmEpJz5Z1mkXZ9CeKXpHpdbG0a6XY0Fj1WblmZA="; // AES-256 Key
            var base64IV = "u4I0j3AQrwJnYHkgQFwVNw=="; // AES IV
            var ciphertext = $scope.COLLEGEID; // Encrypted text (Base64)

            var key = CryptoJS.enc.Base64.parse(base64Key);
            var iv = CryptoJS.enc.Base64.parse(base64IV);

            // Decrypt the ciphertext
            var decrypted = CryptoJS.AES.decrypt(ciphertext, key, {
                iv: iv,
                mode: CryptoJS.mode.CBC, // Ensure CBC mode
                padding: CryptoJS.pad.Pkcs7, // Ensure PKCS7 padding
            });

            // Convert decrypted data to a UTF-8 string
            $scope.decryptedText8 = decrypted.toString(CryptoJS.enc.Utf8);
            $scope.decryptedCollegeId = $scope.decryptedText8;
        };

        $scope.decryptParameter9 = function () {
            var base64Key = "iT9/CmEpJz5Z1mkXZ9CeKXpHpdbG0a6XY0Fj1WblmZA="; // AES-256 Key
            var base64IV = "u4I0j3AQrwJnYHkgQFwVNw=="; // AES IV
            var ciphertext = $scope.BRANCHID; // Encrypted text (Base64)

            var key = CryptoJS.enc.Base64.parse(base64Key);
            var iv = CryptoJS.enc.Base64.parse(base64IV);

            // Decrypt the ciphertext
            var decrypted = CryptoJS.AES.decrypt(ciphertext, key, {
                iv: iv,
                mode: CryptoJS.mode.CBC, // Ensure CBC mode
                padding: CryptoJS.pad.Pkcs7, // Ensure PKCS7 padding
            });

            // Convert decrypted data to a UTF-8 string
            $scope.decryptedText9 = decrypted.toString(CryptoJS.enc.Utf8);
            $scope.decryptedBranchId = $scope.decryptedText9;
        };

        $scope.decryptParameter10 = function () {
            var base64Key = "iT9/CmEpJz5Z1mkXZ9CeKXpHpdbG0a6XY0Fj1WblmZA="; // AES-256 Key
            var base64IV = "u4I0j3AQrwJnYHkgQFwVNw=="; // AES IV
            var ciphertext = $scope.BRANCHCODE; // Encrypted text (Base64)

            var key = CryptoJS.enc.Base64.parse(base64Key);
            var iv = CryptoJS.enc.Base64.parse(base64IV);

            // Decrypt the ciphertext
            var decrypted = CryptoJS.AES.decrypt(ciphertext, key, {
                iv: iv,
                mode: CryptoJS.mode.CBC, // Ensure CBC mode
                padding: CryptoJS.pad.Pkcs7, // Ensure PKCS7 padding
            });

            // Convert decrypted data to a UTF-8 string
            $scope.decryptedText10 = decrypted.toString(CryptoJS.enc.Utf8);
            $scope.decryptedBranchCode = $scope.decryptedText10;
        };


        $scope.decryptParameter11 = function () {
            var base64Key = "iT9/CmEpJz5Z1mkXZ9CeKXpHpdbG0a6XY0Fj1WblmZA="; // AES-256 Key
            var base64IV = "u4I0j3AQrwJnYHkgQFwVNw=="; // AES IV
            var ciphertext = $scope.CCODE; // Encrypted text (Base64)

            var key = CryptoJS.enc.Base64.parse(base64Key);
            var iv = CryptoJS.enc.Base64.parse(base64IV);

            // Decrypt the ciphertext
            var decrypted = CryptoJS.AES.decrypt(ciphertext, key, {
                iv: iv,
                mode: CryptoJS.mode.CBC, // Ensure CBC mode
                padding: CryptoJS.pad.Pkcs7, // Ensure PKCS7 padding
            });

            // Convert decrypted data to a UTF-8 string
            $scope.decryptedText11 = decrypted.toString(CryptoJS.enc.Utf8);
            $scope.decryptedCollegeCode = $scope.decryptedText11;
        };

        $scope.decryptParameter12 = function () {
            var base64Key = "iT9/CmEpJz5Z1mkXZ9CeKXpHpdbG0a6XY0Fj1WblmZA="; // AES-256 Key
            var base64IV = "u4I0j3AQrwJnYHkgQFwVNw=="; // AES IV
            var ciphertext = $scope.CTYPE; // Encrypted text (Base64)

            var key = CryptoJS.enc.Base64.parse(base64Key);
            var iv = CryptoJS.enc.Base64.parse(base64IV);

            // Decrypt the ciphertext
            var decrypted = CryptoJS.AES.decrypt(ciphertext, key, {
                iv: iv,
                mode: CryptoJS.mode.CBC, // Ensure CBC mode
                padding: CryptoJS.pad.Pkcs7, // Ensure PKCS7 padding
            });

            // Convert decrypted data to a UTF-8 string
            $scope.decryptedText12 = decrypted.toString(CryptoJS.enc.Utf8);
            $scope.decryptedCollegeType = $scope.decryptedText12;
        };

        $scope.decryptParameter13 = function () {
            var base64Key = "iT9/CmEpJz5Z1mkXZ9CeKXpHpdbG0a6XY0Fj1WblmZA="; // AES-256 Key
            var base64IV = "u4I0j3AQrwJnYHkgQFwVNw=="; // AES IV
            var ciphertext = $scope.CNAME; // Encrypted text (Base64)

            var key = CryptoJS.enc.Base64.parse(base64Key);
            var iv = CryptoJS.enc.Base64.parse(base64IV);

            // Decrypt the ciphertext
            var decrypted = CryptoJS.AES.decrypt(ciphertext, key, {
                iv: iv,
                mode: CryptoJS.mode.CBC, // Ensure CBC mode
                padding: CryptoJS.pad.Pkcs7, // Ensure PKCS7 padding
            });

            // Convert decrypted data to a UTF-8 string
            $scope.decryptedText13 = decrypted.toString(CryptoJS.enc.Utf8);
            $scope.decryptedCollegeName = $scope.decryptedText13;
        };
        $scope.loginFailed = false;
        $scope.loginAttempts = 0;
        $scope.validatelogincaptcha = function () {

            delete $localStorage.authorizationData;

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

            else if ($scope.UserName == "" && $scope.Password == "") {
                $scope.UserNamemessage = "* Enter user name";
                $scope.Passwordmessage = "* Enter Password";
                alert("Enter UserName And Password");
                return;
            }
            else if ($scope.UserName == "") {
                $scope.UserNamemessage = "* Enter user name";
                alert("Enter UserName");
                return;
            }
            else if ($scope.Password == "") {
                $scope.Passwordmessage = "* Enter Password";
                alert("Enter Password");
                return;
            }
            else if ($scope.CaptchaText == "" || $scope.CaptchaText == undefined || $scope.CaptchaText == null) {
                $scope.UserNamemessage = "* Enter Captcha";
                alert("Enter Captcha");
                $scope.Loginbutton = false;
                return;
            }
            $scope.DataType = 1;
            var EncriptedDataType = $crypto.encrypt($crypto.encrypt($scope.DataType.toString(), 'HBSBP9214EDU00TS'), $scope.LoginEKey) + '$$@@$$' + $scope.LoginEKey;
            var EncriptedLoginName = $crypto.encrypt($crypto.encrypt($scope.UserName, 'HBSBP9214EDU00TS'), $scope.LoginEKey) + '$$@@$$' + $scope.LoginEKey;
            var EncriptedPassword = $crypto.encrypt($crypto.encrypt($scope.Password, 'HBSBP9214EDU00TS'), $scope.LoginEKey) + '$$@@$$' + $scope.LoginEKey;
            var EncriptedCaptchaText = $crypto.encrypt($crypto.encrypt($scope.CaptchaText.toString(), 'HBSBP9214EDU00TS'), $scope.LoginEKey) + '$$@@$$' + $scope.LoginEKey;
            var EncriptedSessionId = $crypto.encrypt($crypto.encrypt($scope.LoginSessionEKey.toString(), 'HBSBP9214EDU00TS'), $scope.LoginEKey) + '$$@@$$' + $scope.LoginEKey;


            var captcha = AdminService.ValidateUserLoginCaptcha($scope.EncriptedSession, EncriptedCaptchaText, EncriptedLoginName, EncriptedPassword, EncriptedDataType);
            captcha.then(function (response) {
                $scope.token = response.token;
                $scope.loginLocked = response.isLocked;

                if ($scope.token == undefined && $scope.loginLocked==undefined) {
                    $scope.message = response.MESSAGE;
                    $scope.decryptParameter6();
                    alert($scope.decryptedmessage);
                    return;
                }
                else if ($scope.loginLocked != undefined) {
                    $scope.message = response.MESSAGE;
                    $scope.decryptParameter6();
                    alert($scope.decryptedmessage);
                    return;
                }

                else if ($scope.token == undefined && response.loginLocked == false) {
                    $scope.message = response.MESSAGE;
                    $scope.decryptParameter6();
                    alert($scope.decryptedmessage);
                    return;
                }
                else if ($scope.token.length > 0) {
                    var UserRights = [];
                    sessionStorage.loggedIn = "yes";
                    $localStorage.authToken = response.token + "$$@@$$" + $scope.LoginEKey;
                    $scope.SessionID = $scope.LoginSessionEKey;

                    //console.log("Login Success. Navigating to Dashboard...");
                    $scope.USERNAME = response.USERNAME;
                    $scope.USERID = response.USERID;
                    $scope.COLLEGEID = response.COLLEGEID;
                    $scope.CCODE = response.CCODE;
                    $scope.CTYPE = response.CTYPE;
                    $scope.CNAME = response.CNAME;
                    $scope.BRANCHID = response.BID;
                    $scope.BRANCHCODE = response.BCODE;
                    $scope.USERTYPEID = response.USERTYPEID;
                    $scope.RESPONSECODE = response.RESPONSECODE;
                    $scope.RESDESCRIPTION = response.RESDESCRIPTION;
                    $scope.token = response.token;
                    $scope.decryptParameter1();
                    $scope.decryptParameter2();
                    $scope.decryptParameter3();
                    $scope.decryptParameter4();
                    $scope.decryptParameter5();
                    $scope.decryptParameter8();
                    $scope.decryptParameter9();
                    $scope.decryptParameter10();
                    $scope.decryptParameter11();
                    $scope.decryptParameter12();
                    $scope.decryptParameter13();


                    //delete $localStorage.authToken;
                    //$localStorage.authToken = $scope.token + "$$@@$$" + $scope.LoginEKey;

                    //sessionStorage.loggedIn = "yes";
                    //$scope.SessionID = $scope.LoginSessionEKey;

                    //response.data = response.data.SystemUser[0];
                          let authorizationData = {
                                token: $localStorage.authToken,
                                AuthTokenId: response.AuthTokenId,
                                SysUserID: $scope.decryptedUserID,
                                College_Code: $scope.decryptedCollegeCode,
                                College_Name: $scope.decryptedCollegeName,
                                College_Type: $scope.decryptedCollegeType,
                                SystemUserTypeId: $scope.decryptedUserTypeID,
                                UserName: $scope.decryptedUserName.toUpperCase(),
                                CollegeID: $scope.decryptedCollegeId,
                                BranchCode: $scope.decryptedBranchCode,
                                BranchId: $scope.decryptedBranchId,
                                //TypeFlag: response.data.TypeFlag,
                                //MngtTypID: response.data.MngtTypID,
                                //SysUsrGrpID: response.data.SysUsrGrpID,
                                //SeqNo: response.data.SeqNo
                            };

                            sessionStorage.setItem('user', JSON.stringify(authorizationData));
                            $state.go('Dashboard');

                    //$timeout(function () {
                    //    try {
                    //        $state.go('Dashboard'); // Preferred AngularJS way
                    //        $scope.$apply(); // Ensure digest cycle updates
                    //    } catch (e) {
                    //        console.error("State transition failed, using window.location.href instead.");
                    //        window.location.href = '#/Dashboard'; // Fallback
                    //        window.location.reload(); // Ensure refresh
                    //    }
                    //}, 0);


                    }

                


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

            $scope.EncriptedSession = $crypto.encrypt($crypto.encrypt($scope.SessionCaptcha, 'HBSBP9214EDU00TS'), $scope.LoginEKey) + '$$@@$$' + $scope.LoginEKey;
            var EncriptedCaptchaText = $crypto.encrypt($crypto.encrypt($scope.CaptchaText.toString(), 'HBSBP9214EDU00TS'), $scope.LoginEKey) + '$$@@$$' + $scope.LoginEKey;

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
            var Encripteddatatype = $crypto.encrypt($crypto.encrypt(DataType.toString(), 'HBSBP9214EDU00TS'), $scope.LoginEKey) + '$$@@$$' + $scope.LoginEKey;
            var EncriptedUserName = $crypto.encrypt($crypto.encrypt($scope.UserName.toString(), 'HBSBP9214EDU00TS'), $scope.LoginEKey) + '$$@@$$' + $scope.LoginEKey;
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
            var Encripteddatatype = $crypto.encrypt($crypto.encrypt(DataType.toString(), 'HBSBP9214EDU00TS'), $scope.LoginEKey) + '$$@@$$' + $scope.LoginEKey;
            var EncriptedUserName = $crypto.encrypt($crypto.encrypt($scope.UserName.toString(), 'HBSBP9214EDU00TS'), $scope.LoginEKey) + '$$@@$$' + $scope.LoginEKey;
            var addaccount = AdminService.GetAccountStatus(Encripteddatatype, EncriptedUserName);
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




        $scope.gotoLogin = function () {
            $state.go('Dashboard');
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

                    var data = $crypto.encrypt($scope.Password, $scope.LoginEKey) + "$$@@$$" + $crypto.encrypt($scope.UserName, $scope.LoginEKey) + "$$@@$$" + $scope.LoginEKey;
                    $http.post(AppSettings.WebApiUrl + 'api/SystemUser/GetUserLogin', data, {}).then(function (response) {
                        var UserRights = [];
                        sessionStorage.loggedIn = "yes";
                        var token = response.data.token + "$$@@$$" + $scope.LoginEKey;
                        sessionStorage.setItem('authToken', token);
                        $localStorage.authToken = response.data.token + "$$@@$$" + $scope.LoginEKey;
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
                            var Encripteddatatype = $crypto.encrypt($crypto.encrypt(DataType.toString(), 'HBSBP9214EDU00TS'), $scope.LoginEKey) + '$$@@$$' + $scope.LoginEKey;
                            var EncriptedUserName = $crypto.encrypt($crypto.encrypt($scope.UserName.toString(), 'HBSBP9214EDU00TS'), $scope.LoginEKey) + '$$@@$$' + $scope.LoginEKey;
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

                                        sessionStorage.setItem('SessionID', $scope.LoginEKey);
                                        response.data = response.data.data.SystemUser[0];
                                        try {
                                            authorizationData = {
                                                token: sessionStorage.getItem("authToken"),
                                                SessionID: $scope.LoginEKey,
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
                                            setTimeout(function () {
                                                $state.go('Dashboard');
                                                $scope.gotoLogin();
                                            }, 200);
                                            
                                            $scope.Loginbutton = false;
                                        }

                                        catch (err) {

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