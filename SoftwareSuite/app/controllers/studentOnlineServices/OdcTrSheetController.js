define(['app'], function (app) {
    app.controller("OdcTrSheetController", function ($scope, $q, $http, PreExaminationService, $localStorage, $state, $stateParams, AppSettings) {
        $scope.NrGenerating = false;
        //var ApproveList = PreExaminationService.GetSchemes();
        //ApproveList.then(function (response) {

        //    console.log(response);
        //    $scope.Schemes = response.Table;

        //},
        //function (error) {
        //    //$scope.$emit('hideLoading', data);

        //    $scope.Data = false;
        //    $scope.Nodata = true;
        //    alert("error while loading data");
        //});


        var getClgTypes = PreExaminationService.GetCollegelist();
        getClgTypes.then(function (res) {
            //var res = JSON.parse(res);
            $scope.GetCollegeTypes = res.Table;
            $scope.isAllSelectedCollegeTypes = true;
            var toggleStatus = $scope.isAllSelectedCollegeTypes
            angular.forEach($scope.GetCollegeTypes, function (itm) { itm.selected = toggleStatus; });
            $scope.CollegeTypesArray = [];
            angular.forEach($scope.GetCollegeTypes, function (value, key) {
                if (value.selected === true) {
                    $scope.CollegeTypesArray.push({ "collegecode": value.CollegeCode })
                }
            });
        }, function (err) {
            $scope.LoadImg = false;
            alert("Error while loading College Types");
        });


        //----------------------CollegeTypes Multi Select Start--------------------------------//
        var CollegeTypesExpand = false;
        $scope.showCollegeTypesCheckboxes = function () {
            var checkboxes = document.getElementById("checkboxesCollegeTypes");
            if (!CollegeTypesExpand) {
                checkboxes.style.display = "block";
                checkboxes.style.position = "absolute";
                checkboxes.style.width = "92%";
                checkboxes.style.backgroundColor = "white";
                checkboxes.style['z-index'] = 99;
                CollegeTypesExpand = true;
            } else {
                checkboxes.style.display = "none";
                CollegeTypesExpand = false;
            }
        }

        $scope.closeCollegeTypesCheckbox = function () {
            var checkboxes = document.getElementById("checkboxesCollegeTypes");
            if (!CollegeTypesExpand) {
                checkboxes.style.display = "block";
                checkboxes.style.position = "absolute";
                checkboxes.style.width = "92%";
                checkboxes.style.backgroundColor = "white";
                CollegeTypesExpand = true;
            } else {
                checkboxes.style.display = "none";
                CollegeTypesExpand = false;
            }
        }


        var authData = JSON.parse(sessionStorage.getItem('user'));
        $scope.userType = authData.SystemUserTypeId;
        if ($scope.userType != 1) {
            alert("UnAuthorized Access")
            $state.go('Dashboard')
        }


        $scope.toggleAllCollegeTypes = function () {
            var toggleStatus = $scope.isAllSelectedCollegeTypes
            angular.forEach($scope.GetCollegeTypes, function (itm) { itm.selected = toggleStatus; });
            $scope.CollegeTypesArray = [];
            $scope.CollegeTypesArray.push({ "collegecode": value.CollegeCode })
        }


        $scope.optionToggledCollegeTypes = function () {
            $scope.isAllSelectedCollegeTypes = $scope.GetCollegeTypes.every(function (itm) { return itm.selected; })
            $scope.CollegeTypesArray = [];
            angular.forEach($scope.GetCollegeTypes, function (value, key) {
                if (value.selected === true) {
                    $scope.CollegeTypesArray.push({ "collegecode": value.CollegeCode })
                }
            });

        }

        //----------------------CollegeTypes Multi Select End--------------------------------//


        var ApproveLists = PreExaminationService.getExamYearMonths();
        ApproveLists.then(function (response) {

            console.log(response);
            $scope.ExamMonthYear = response.Table

        },
        function (error) {
            //$scope.$emit('hideLoading', data);

            $scope.Data = false;
            $scope.Nodata = true;
            alert("error while loading data");
        });


        $scope.logOut = function () {
            sessionStorage.loggedIn = "no";
            var GetUserLogout = SystemUserService.getUserLogout();
            alert('Logout Successfully');
            $state.go('index.WebsiteLogin');

        }


        $scope.DownloadODCTrsheet = function () {
            $scope.NrGenerating = true;
            var CertificateFeePaymentReports = PreExaminationService.GetOdcTrSheets($scope.ExamMonth, JSON.stringify($scope.CollegeTypesArray));
            CertificateFeePaymentReports.then(function (res) {

                $scope.NrGenerating = false;
                const keyToExclude = 'm4e/P4LndQ4QYQ8G+RzFmQ==';
                if (response.Status) {
                    // var keys = Object.keys(response);

                    //   $scope.statusKey = keys[0];
                    $scope.statusValue = response.Status;

                    // $scope.descriptionKey = keys[1];
                    $scope.descriptionValue = response.Description;

                    $scope.EncStatusDescription2 = $scope.descriptionValue;
                    if ($scope.statusValue == '6tEGN7Opkq9eFqVERJExVw==') {
                        $scope.decryptParameter2();
                        alert($scope.decryptedParameter2);

                    }
                } 
                else if (res.length > 0) {
                    if (res.length > 10) {
                        window.location.href = "/Reports/" + res + '.pdf';
                    } else {
                        alert("Failed to generate ODC Tr Sheets");
                    }

                } else {
                    alert("No Report Present")
                }
            }, function (err) {
                $scope.NrGenerating = false;
                $scope.LoadImg = false;
                alert("Error while loading");
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