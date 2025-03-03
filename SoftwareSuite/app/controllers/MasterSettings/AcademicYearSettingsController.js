define(['app'], function (app) {
    app.controller("AcademicYearSettingsController", function ($scope, $http, $localStorage, $state, $stateParams, AppSettings, MasterPageService, PreExaminationService) {
     
        //var authData = $localStorage.authorizationData;
        var authData = JSON.parse(sessionStorage.getItem('user'));
        $scope.userType = authData.SystemUserTypeId;
        if ($scope.userType == 2 || $scope.userType == 3) {
            alert("UnAuthorized Access")
            $state.go('Dashboard')
        }
        $scope.UserName = authData.UserName
     
        $scope.finalList = [];
        //console.log(authData)
        const $ctrl = this;
        $ctrl.$onInit = () => {
            $scope.GetData();
         //  $scope.disabletable();
        }

        $scope.disabletable = function () {
            var ele = document.getElementsByClassName("tableinpt");
            //ele.style.width = "100%";
            //ele.style['box-shadow'] = "none";
            //ele.style['pointer-events'] = "none";
            //ele.style.cursor = "pointer";
          
          
        }

        $scope.logOut = function () {
            sessionStorage.loggedIn = "no";
            var GetUserLogout = SystemUserService.getUserLogout();
            alert('Logout Successfully');
            $state.go('index.WebsiteLogin');

        }
     
        $scope.UpdateAcaYear = function (StartYear) {
            var tempyr = (parseInt(StartYear) + 1).toString();
            var yr = StartYear + '-' + tempyr.substring(2,4);
            $scope.AcademicYear = yr;
        }
          
        $scope.GetData = function () {
            var GetMonthYear = PreExaminationService.GetMonthYear()
            GetMonthYear.then(function (response) {

                $scope.GetExamMonthYear = response.Table;
               
                for (let i = 0; i < $scope.GetExamMonthYear.length; i++) {                  
                    if ($scope.GetExamMonthYear[i].IsCurrentAcademicYear == true) {
                        $scope.finalList.push($scope.GetExamMonthYear[i]);
                    }                  
                }

                //  var ele = document.getElementsByClassName("tableinpt");
                for (var j = 1; j < response.Table.length+1; j++) {
                     $scope['edit' + j] = true;
                }
            }, 
         function (error) {
             alert("data is not loaded");
             var err = JSON.parse(error);
             console.log(err.Message);
         });

        }

        $scope.EditAcademicYear = function (data,ind) {         
            var ele1 = document.getElementsByClassName("enabletable" + ind);
            for (var j = 0; j < ele1.length; j++) {
                ele1[j].style['pointer-events'] = "auto";
                ele1[j].style.border = "1px solid #ddd";
            }
            $scope['edit' + ind] = false;  
           
        }


        $scope.UpdateAcademicYear = function (dat,ind) {
            $scope['edit'+ind] = true;
          
            var ele2 = document.getElementsByClassName("enabletable" + ind);
            for (var j = 0; j < ele2.length; j++) {
                ele2[j].style['pointer-events'] = "none";
                ele2[j].style.border = "0";
            }

            if (dat.StartDate == null || dat.StartDate == undefined || dat.StartDate == "") {
                alert("Select Start Date");
                return;
            }
            if (dat.EndDate == null || dat.EndDate == undefined || dat.EndDate == "") {
                alert("Select End Date");
                return;
            }

            if (dat.IsCurrentAcademicYear == null || dat.IsCurrentAcademicYear == undefined || dat.IsCurrentAcademicYear == "") {
                alert("Select IsCurrentAcademicYear.");
                return;
            }
            var datatypeid = 2; 
            var srtdate = dat.StartDate == undefined || dat.StartDate == null || dat.StartDate == "" ? " " : moment(dat.StartDate).format("YYYY-MM-DD");
            var enddate = dat.EndDate == undefined || dat.EndDate == null || dat.EndDate == "" ? " " : moment(dat.EndDate).format("YYYY-MM-DD");
            var updateaca = PreExaminationService.SetAcademicYear(datatypeid, dat.AcademicYear, dat.AcademicStartYear, srtdate, enddate, $scope.UserName, dat.IsCurrentAcademicYear, parseInt(dat.AcademicID),1)
            updateaca.then(function (response) {
                var res = JSON.parse(response);
                try {
                    var res = JSON.parse(response);
                }
                catch
                {
                }
                const keyToExclude = 'm4e/P4LndQ4QYQ8G+RzFmQ==';
                if (res.Status) {
                    // var keys = Object.keys(res);
                    //   $scope.statusKey = keys[0];
                    $scope.statusValue = res.Status;
                    // $scope.descriptionKey = keys[1];
                    $scope.descriptionValue = res.Description;
                    $scope.EncStatusDescription2 = $scope.descriptionValue;
                    if ($scope.statusValue == '6tEGN7Opkq9eFqVERJExVw==') {
                        $scope.decryptParameter2();
                        alert($scope.decryptedParameter2);
                    }
                } else
                //var response = JSON.parse(response)
                if (response[0].ResponceCode == '200') {
                    alert(response[0].ResponceDescription)
                    $scope.GetData();
                } else {
                    alert('Something Went Wrong')
                }
            },
                function (error) {
                    alert("something Went Wrong")


                });

        }
        Array.prototype.remByVal = function (val) {
            for (var i = 0; i < this.length; i++) {
                if (this[i].ElectiveSet === val) {
                    this.splice(i, 1);
                    break;
                }
            }
            return this;
        }

        $scope.changeActive = function (data, active, index) {
            for (let i = 0; i < $scope.finalList.length; i++) {
                if ($scope.finalList[i].IsCurrentAcademicYear == data.IsCurrentAcademicYear) {
                    $scope.finalList.remByVal(data.IsCurrentAcademicYear);
                    break;
                }
            }
            $scope.finalList.push(data);

            for (let i = 0; i < $scope.GetExamMonthYear.length; i++) {
                if ($scope.GetExamMonthYear[i].IsCurrentAcademicYear == data.IsCurrentAcademicYear) {
                    if (i != index) {
                        $scope.GetExamMonthYear[i].IsCurrentAcademicYear = false;
                    }
                }
            }
            console.log($scope.finalList);
        }

        $scope.Submit = function () {

            var datatypeid = 1
            if ($scope.StartYear == null || $scope.StartYear == undefined || $scope.StartYear == "") {
                alert("Select Start of Academic Year");
                return;
            }
            if ($scope.StartDate == null || $scope.StartDate == undefined || $scope.StartDate == "") {
                alert("Select Start Date");
                return;
            }
            if ($scope.EndDate == null || $scope.EndDate == undefined || $scope.EndDate == "") {
                alert("Select End Date");
                return;
            }
            var SetUserType = PreExaminationService.SetAcademicYear(datatypeid, $scope.AcademicYear, $scope.StartYear, moment($scope.StartDate).format("YYYY-MM-DD"), moment($scope.EndDate).format("YYYY-MM-DD"), $scope.UserName, true,0,0)
            SetUserType.then(function (response) {
                var res = JSON.parse(response);
                try {
                    var res = JSON.parse(response);
                }
                catch
                {
                }
                const keyToExclude = 'm4e/P4LndQ4QYQ8G+RzFmQ==';
                if (res.Status) {
                    // var keys = Object.keys(res);
                    //   $scope.statusKey = keys[0];
                    $scope.statusValue = res.Status;
                    // $scope.descriptionKey = keys[1];
                    $scope.descriptionValue = res.Description;
                    $scope.EncStatusDescription2 = $scope.descriptionValue;
                    if ($scope.statusValue == '6tEGN7Opkq9eFqVERJExVw==') {
                        $scope.decryptParameter2();
                        alert($scope.decryptedParameter2);
                    }
                } else
                //var response = JSON.parse(response)
                if (res[0].ResponceCode == '200') {
                    alert(res[0].ResponceDescription)
                    $scope.GetData();
                } else {
                    alert('Something Went Wrong')
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

    })
})