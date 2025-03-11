define(['app'], function (app) {
    app.controller("FeeSettingsController", function ($scope, $state, $localStorage, PreExaminationService) {
        //var authData = $localStorage.authorizationData;
        var authData = JSON.parse(sessionStorage.getItem('user'));
        $scope.userType = authData.SystemUserTypeId;
        if ($scope.userType == 2 || $scope.userType == 3) {
            alert("UnAuthorized Access")
            $state.go('Dashboard');
            return;
        }
        $scope.UserName = authData.UserName;


        const $ctrl = this;
        $ctrl.$onInit = () => {
            $scope.getfeesettingsdata();


        }
        $scope.ServiceTypeValues = [{ "Id": "1", "value": 1 }, { "Id": "2", "value": 2 }]
        $scope.ChallanPrefixValues = [{ "Id": "1", "value": "MC" }, { "Id": "2", "value": "INTRM" }, { "Id": "3", "value": "TRANS" }, { "Id": "4", "value": "DMM" }, { "Id": "5", "value": "DDC" }, { "Id": "6", "value": "TC" }, { "Id": "7", "value": "NC" }, { "Id": "8", "value": "GC" }, { "Id": "9", "value": "STUD" }]

        var getDatagetCertificates = PreExaminationService.GetCertificateTypes()
        getDatagetCertificates.then(function (response) {

            try {
                var response = JSON.parse(response);
            } catch (err) { }
            $scope.CertificateTypes = response.Table;
            //$scope.CertificateTypes.splice(7, 1); 
            console.log($localStorage.StudentServices)
            $scope.Certificate = $localStorage.StudentServices.ServiceType;


            $scope.Service = false;
        }, function (error) {
            $scope.NoDataFound = true;
            $scope.result = false;
        })















        //var SchemeSem = PreExaminationService.GetTimeTableSessionSchemeSemesters($scope.selSession, $scope.selAcademicYear);
        //SchemeSem.then(function (data) {
        //    try { var data = JSON.parse(data) } catch (err) { }

        //    if (data.length > 0) {
        //        $scope.ReportFound = true;
        //        $scope.Noreports = false;
        //        $scope.GetFeeSettings = data;
        //        for (var j = 1; j < $scope.GetFeeSettings.length + 1; j++) {
        //            $scope['edit' + j] = true;
        //        }
        //    } else {
        //        $scope.ReportFound = false;
        //        $scope.Noreports = true;
        //    }
        //}, function (error) {
        //    $scope.GetFeeSettings = [];
        //    //$scope.ReportFound = fale;
        //    $scope.Noreports = true;
        //});






        $scope.logOut = function () {
            sessionStorage.loggedIn = "no";
            var GetUserLogout = SystemUserService.getUserLogout();
            alert('Logout Successfully');
            $state.go('index.WebsiteLogin');

        }

        $scope.Add = function () {

            var datatypeid = 1


            if ($scope.ServiceName == null || $scope.ServiceName == undefined || $scope.ServiceName == "") {
                alert("Please Enter Service Name");
                return;
            } if ($scope.ServiceType == null || $scope.ServiceType == undefined || $scope.ServiceType == "") {
                alert("Please Select Service Type");
                return;
            } if ($scope.ChallanPrefix == null || $scope.ChallanPrefix == undefined || $scope.ChallanPrefix == "") {
                alert("Please Enter ChallanPrefix");
                return;
            }
            if ($scope.Amount == undefined || $scope.Amount == null || $scope.Amount == "") {
                alert("Amount");
                return;
            }
           
           

            
            var datatypeid = 1
            var AddFeeSettings = PreExaminationService.AddFeeSettings(datatypeid.toString(), "0", $scope.ServiceName.toString(), "1", $scope.Amount.toString(), $scope.ServiceType.toString(), $scope.ChallanPrefix.toString(), $scope.UserName.toString())
            AddFeeSettings.then(function (response) {
                try {
                    var res = JSON.parse(response);
                }
                catch
                {

                }
                if (typeof res === "object") {
                    if (res[0].ResponseCode == '200') {
                        alert(res[0].ResponseDescription);

                    }
                    else if (res[0].ResponseCode == '400') {
                        alert(res[0].ResponseDescription);

                    } else {
                        alert('Something Went Wrong')

                    }
                }

                else {

                    var res1 = JSON.parse(response);
                    try {
                        var res2 = JSON.parse(res1);
                    }
                    catch
                    {

                    }
                    const keyToExclude = 'm4e/P4LndQ4QYQ8G+RzFmQ==';
                    if (res2.Status) {
                        // var keys = Object.keys(res);

                        //   $scope.statusKey = keys[0];
                        $scope.statusValue = res2.Status;

                        // $scope.descriptionKey = keys[1];
                        $scope.descriptionValue = res2.Description;

                        $scope.EncStatusDescription2 = $scope.descriptionValue;
                        if ($scope.statusValue == '6tEGN7Opkq9eFqVERJExVw==') {
                            $scope.decryptParameter2();
                            alert($scope.decryptedParameter2);

                        }
                    }
                }


                
            },
                function (error) {
                    alert("something Went Wrong")


                });
        }

        $scope.decryptParameter2 = function () {
            var base64Key = "iT9/CmEpJz5Z1mkXZ9CeKXpHpdbG0a6XY0Fj1WblmZA="; // AES-256 Key
            var base64IV = "u4I0j3AQrwJnYHkgQFwVNw=="; // AES IV
            var ciphertext = $scope.EncStatusDescription2; // Encrypted text (Base64)

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
            $scope.decryptedParameter2 = $scope.decryptedText2;
        };




        $scope.getfeesettingsdata = function () {
            var DataTypeID=1
            var getcourdurs = PreExaminationService.GetFeeSettingsData(DataTypeID,0);
            getcourdurs.then(function (response) {

                ////try {
                ////    var res = JSON.parse(response);
                ////}
                ////catch (err) { }
                //$scope.edit = true;
                if (response.Table.length > 0) {
                    $scope.FeeSettingsData = response.Table;
                    $scope.Noreports = false;
                    for (var j = 1; j < $scope.FeeSettingsData.length + 1; j++) {
                        $scope['edit' + j] = true;
                    }

                }
                else {
                    $scope.FeeSettingsData = [];
                    $scope.Noreports = true;
                }


            },

                function (error) {
                    alert("error while loading CourseDuration");
                    var err = JSON.parse(error);

                });
        }






        $scope.Updatefeesettings = function (data, ind) {
            $scope['edit' + ind] = true;

            var ele2 = document.getElementsByClassName("enabletable" + ind);
            for (var j = 0; j < ele2.length; j++) {
                ele2[j].style['pointer-events'] = "none";
                ele2[j].style.border = "0";
                ele2[j].style['-webkit-appearance'] = "none";
                ele2[j].style['-moz-appearance'] = "none";
            }

            var datatypeid = 2;

            //if (data.AcademicYearId == null || data.AcademicYearId == undefined || data.AcademicYearId == "") {
            //    alert("Service Name");
            //    return;
            //}
            //if (data.SessionId == undefined || data.SessionId == null || data.SessionId == "") {
            //    alert("Amount");
            //    return;
            //}
            //if (data.SchemeId == null || data.SchemeId == undefined || data.SchemeId == "") {
            //    alert("Status");
            //    return;
            //}
            //if (data.SemId == null || data.SemId == undefined || data.SemId == "") {
            //    alert("Action");
            //    return;
            //}
            


            var feesett = PreExaminationService.UpdateFeeSettings(datatypeid.toString(), data.Id.toString(), data.Name.toString(), data.Is_Active.toString() == true ? 1 : 0, data.Price.toString(), data.ServiceType.toString(), data.ChallanPrefix.toString(), $scope.UserName.toString())
            feesett.then(function (response) {
                try {
                    var res = JSON.parse(response);
                }
                catch
                {

                }
                if (typeof res === "object") {
                    if (res[0].StatusCode == '200') {
                        alert(res[0].StatusDescription);
                        $scope.getfeesettingsdata();

                    } else if (res[0].StatusCode == '400') {
                        alert(res[0].StatusDescription);
                        $scope.getfeesettingsdata();

                    } else {
                        alert('Something Went Wrong')

                    }
                }

                else {

                    var res1 = JSON.parse(response);
                    try {
                        var res2 = JSON.parse(res1);
                    }
                    catch
                    {

                    }
                    const keyToExclude = 'm4e/P4LndQ4QYQ8G+RzFmQ==';
                    if (res2.Status) {
                        // var keys = Object.keys(res);

                        //   $scope.statusKey = keys[0];
                        $scope.statusValue = res2.Status;

                        // $scope.descriptionKey = keys[1];
                        $scope.descriptionValue = res2.Description;

                        $scope.EncStatusDescription2 = $scope.descriptionValue;
                        if ($scope.statusValue == '6tEGN7Opkq9eFqVERJExVw==') {
                            $scope.decryptParameter2();
                            alert($scope.decryptedParameter2);

                        }
                    }
                }





               
            },
                function (error) {
                    alert("something Went Wrong")


                });
        }











        $scope.Editfeesettings = function (data, ind) {

            var ele1 = document.getElementsByClassName("enabletable" + ind);
            for (var j = 0; j < ele1.length; j++) {
                ele1[j].style['pointer-events'] = "auto";
                ele1[j].style.border = "1px solid #ddd";
            }


            $scope['edit' + ind] = false;

            //var DataTypeID = 2
            //var getcourdurs = PreExaminationService.GetFeeSettingsData(DataTypeID, data.Id);
            //getcourdurs.then(function (response) {

            //    //try {
            //    //    var res = JSON.parse(response);
            //    //}
            //    //catch (err) { }

            //    if (response.Table.length > 0) {
            //        $scope.FeeSettingsData = response.Table;
            //        for (var j = 1; j < $scope.FeeSettingsData.length + 1; j++) {
            //            $scope['edit' + j] = true;
            //        }
            //    }
            //    else {
            //        $scope.FeeSettingsData = [];
            //    }


            //},

            //    function (error) {
            //        alert("error while loading CourseDuration");
            //        var err = JSON.parse(error);

            //    });

        }






    })
})