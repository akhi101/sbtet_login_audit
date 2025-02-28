define(['app'], function (app) {
    app.controller("WebsiteLoginController", function ($scope, $localStorage, $http, $timeout, $state, $window, AppSettings, SystemUserService, $crypto, PreExaminationService, AdminService) {

        sessionStorage.loggedIn = "no";

        const $ctrl = this;

        $ctrl.$onInit = () => {
            $scope.Loginbutton = false;
        }
        var sessionId= 'Session_' + Math.random().toString(36).substr(2, 16);
        
        var eKey = SystemUserService.GetEKey();
        eKey.then(function (res) {
            $scope.LoginEKey = res;
            $scope.EncriptedSession = $crypto.encrypt($crypto.encrypt(sessionId, 'HBSBP9214EDU00TS'), $scope.LoginEKey) + '$$@@$$' + $scope.LoginEKey;
            $scope.GetCaptchaData()

        });
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


        $scope.decryptParameter = function (ciphertext, outputVar) {
            var base64Key = "iT9/CmEpJz5Z1mkXZ9CeKXpHpdbG0a6XY0Fj1WblmZA="; // AES-256 Key
            var base64IV = "u4I0j3AQrwJnYHkgQFwVNw=="; // AES IV

            var key = CryptoJS.enc.Base64.parse(base64Key);
            var iv = CryptoJS.enc.Base64.parse(base64IV);

            // Decrypt the ciphertext
            var decrypted = CryptoJS.AES.decrypt(ciphertext, key, {
                iv: iv,
                mode: CryptoJS.mode.CBC, // Ensure CBC mode
                padding: CryptoJS.pad.Pkcs7, // Ensure PKCS7 padding
            });

            // Convert decrypted data to a UTF-8 string
            $scope[outputVar] = decrypted.toString(CryptoJS.enc.Utf8);
        };

        $scope.generateHMAC = function (requestData, secretKey) {
            // Construct the exact same string format used in C# `GetDataString()`
            let dataString = `Session=${requestData.Session}&Captcha=${requestData.Captcha}&LoginName=${requestData.LoginName}&Password=${requestData.Password}&DataType=${requestData.DataType}&Salt=${requestData.Salt}`;

            let key = CryptoJS.enc.Base64.parse(secretKey); // Decode base64 key
            let hash = CryptoJS.HmacSHA256(dataString, key); // Generate HMAC
            return CryptoJS.enc.Base64.stringify(hash); // Convert to Base64
        };
        $scope.loginFailed = false;
        $scope.loginAttempts = 0;
        $scope.getUserData = function () {
            let EncUserName = $crypto.encrypt($crypto.encrypt($scope.UserName.toString(), 'HBSBP9214EDU00TS'), $scope.LoginEKey) + '$$@@$$' + $scope.LoginEKey;
            var getdata = AdminService.GetUserData(EncUserName);
            getdata.then(function (response) {
                try {
                    var res = JSON.parse(response);
                    $scope.Salt = res[0].Salt;
                } catch (err) {
                    $scope.Salt = ''
                }
            }, function (error) {
                $scope.GetCatcha = ''
                alert('Unable to load Data')
            });
        }



        // Generate a random 128-bit AES key (16 bytes)
        function generateAESKey() {
            return CryptoJS.lib.WordArray.random(16).toString(CryptoJS.enc.Base64);
        }

        // Encrypt the password using AES key
        function encryptPassword(password, key) {
            return CryptoJS.AES.encrypt(password, CryptoJS.enc.Base64.parse(key), {
                mode: CryptoJS.mode.ECB,
                padding: CryptoJS.pad.Pkcs7
            }).toString();
        }


        $scope.validatelogincaptcha = function () {


            // Validation for empty fields
            let validationFields = {
                "UserName": "* Enter user name",
                "Password": "* Enter password",
                "CaptchaText": "* Enter Captcha"
            };

            for (let field in validationFields) {
                if (!$scope[field]) {
                    alert(validationFields[field].replace("* ", ""));
                    $scope[field + "message"] = validationFields[field];
                    $scope.Loginbutton = false;
                    return;
                }
            }


            $scope.DataType = 1;

            // Helper function for encryption
            function encryptData(value) {
                return $crypto.encrypt($crypto.encrypt(value.toString(), 'HBSBP9214EDU00TS'), $scope.LoginEKey) + '$$@@$$' + $scope.LoginEKey;
            }

            var password = $scope.Password;  // Raw password entered by user
            var salt = generateAESKey();   // Generate a new AES key dynamically


            // Encrypt password using AES key
            var encryptedPassword = encryptPassword(password, salt);

            let requestData = {
                Session: $scope.EncriptedSession,
                Captcha: encryptData($scope.CaptchaText),
                LoginName: encryptData($scope.UserName),
                Password: encryptedPassword,
                Salt: salt,
                DataType: encryptData($scope.DataType)
            };

            // Generate HMAC signature
            let secretKey = "bXUqvDhzD09JmTmAYbGq3h83flSAzWWldK5OdJjVh64="; // Secure this
            let hmacSignature = $scope.generateHMAC(requestData, secretKey);

            let finalPayload = { ...requestData, NameofUser: hmacSignature };

            AdminService.ValidateUserLoginCaptcha(finalPayload).then(function (response) {
                console.log("API Response:", response);
                if (response.MESSAGE) {
                    showDecryptedMessage(response.MESSAGE);
                    $scope.GetCaptchaData();
                    return;
                }
                else {
                    sessionStorage.loggedIn = "yes";
                    $scope.token = response.token;
                    $localStorage.authToken = response.token + "$$@@$$" + $scope.LoginEKey;

                    // Decrypt multiple response fields in a loop
                    let responseFields = [
                        "USERNAME", "USERID", "COLLEGEID", "CCODE", "CTYPE", "CNAME",
                        "BID", "BCODE", "USERTYPEID", "RESPONSECODE", "RESDESCRIPTION"
                    ];

                    let decryptedData = {};
                    responseFields.forEach(field => {
                        let key = "decrypted" + field.charAt(0).toUpperCase() + field.slice(1).toLowerCase();
                        $scope.decryptParameter(response.data[field], key);
                        decryptedData[key] = $scope[key];
                    });


                    try {
                        $localStorage.authorizationData = {
                            token: $localStorage.authToken,
                            AuthTokenId: response.data.AuthTokenId,
                            SysUserID: decryptedData.decryptedUserid,
                            College_Code: decryptedData.decryptedCcode,
                            College_Name: decryptedData.decryptedCname,
                            College_Type: decryptedData.decryptedCtype,
                            SystemUserTypeId: decryptedData.decryptedUsertypeid,
                            UserName: decryptedData.decryptedUsername.toUpperCase(),
                            CollegeID: decryptedData.decryptedCollegeid,
                            BranchCode: decryptedData.decryptedBcode,
                            BranchId: decryptedData.decryptedBid,

                        };
                        sessionStorage.setItem("user", JSON.stringify($localStorage.authorizationData));
                        console.log(sessionStorage)
                        // Wait for a small delay before redirecting (ensures data is set properly)
                        setTimeout(() => {
                            console.log("Redirecting to Dashboard...");
                            //$scope.GetCaptchaData();
                            $state.go("Dashboard", {}, { reload: true });
                        }, 500); 

                    } catch (err) {

                    }

                }
                
            });

            function showDecryptedMessage(message) {
                $scope.decryptParameter(message, "decryptedMessage");
                alert($scope.decryptedMessage);

                setTimeout(() => {
                    //$scope.GetCaptchaData();
                }, 500); // Wait 0.5 seconds before regenerating Captcha
            }
        };


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
        $scope.ForgetPasswordChange = function () {
            $state.go('ForgetPassword');
        }



    });

});