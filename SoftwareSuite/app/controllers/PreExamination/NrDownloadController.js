define(['app'], function (app) {
    app.controller("NrDownloadController", function ($scope, $http, $localStorage, $state, $stateParams, AppSettings, PreExaminationService) {

        $scope.ArrayBarimg = [];
        $scope.ArrayBarcode = [];
        $scope.BarcodeElements = [];
        $scope.ExamMonthYears = [];
        $scope.selectedEmy = "";
        $scope.StudentTypeId = "";
        $scope.examTypeId = "0";
        //$scope.Exams = [
        //    { id: 1, exam: "Mid 1" },
        //    { id: 2, exam: "Mid 2" },
        //    { id: 5, exam: "Semester" }
        //];
        
        PreExaminationService.getExamTypesForExamCenters().then(function (res) {
            var response = JSON.parse(res)
            $scope.Exams = response.Table;
        },
            function (error) {
                alert("error while loading Exam Month Years");
                console.log(error);
            });


        PreExaminationService.GetExamMonthYears().then(function (res) {
            $scope.ExamMonthYears = res.Table;
        },
            function (error) {
                alert("error while loading Exam Month Years");
                console.log(error);
            });

        //var authData = $localStorage.authorizationData;
        var authData = JSON.parse(sessionStorage.getItem('user'));

        $scope.DetailsFound = false;
        var LoadExamTypeBysem = PreExaminationService.getStudentType();
        LoadExamTypeBysem.then(function (response) {
            if (response.Table.length > 0) {
                $scope.StudentType = response.Table;
            } else {
                $scope.StudentType = [];
                alert("No Student found on this Record");
            }
        },
            function (error) {
                alert("error while loading Student Types");
                console.log(error);
            });



        $scope.logOut = function () {
            sessionStorage.loggedIn = "no";
            var GetUserLogout = SystemUserService.getUserLogout();
            alert('Logout Successfully');
            $state.go('index.WebsiteLogin');

        }


        $scope.changedExamType = function () {
            $scope.DetailsFound = false;
            if ($scope.StudentTypeId != "" && $scope.selectedEmy != "") {
                var getCurrentExamDates = PreExaminationService.CurrentExamDatesForNr($scope.selectedEmy, $scope.StudentTypeId, $scope.examTypeId);
                getCurrentExamDates.then(function (response) {
                    if (response.Table.length > 0) {
                        $scope.ExamDates = response.Table;
                    } else {
                        $scope.ExamDates = [];
                        alert("No ExamDates Found.");
                    }
                },
                    function (error) {
                        alert("error while loading Exam Dates");
                        console.log(error);
                    });
            }
        }



        var authData = JSON.parse(sessionStorage.getItem('user'));
        $scope.userType = authData.SystemUserTypeId;
        if ($scope.userType == 1 || $scope.userType == 3) {
            alert("UnAuthorized Access")
            $state.go('Dashboard')
        }


        $scope.changedExamDates = function () {
            $scope.DetailsFound = false;
        };

        $scope.getNRStudentDetails = function (ExamMonthYearId, StudentType, ExamDate, ExamType) {
            $scope.LoadImg = true;
            var getNrReports = PreExaminationService.NrReports(ExamMonthYearId.toString(), StudentType.toString(), authData.College_Code.toString(), ExamDate.toString(), ExamType.toString());
            getNrReports.then(function (res) {

                function isUUID(res) {
                    var uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
                    return uuidRegex.test(res);
                }

                // Example Usage
                if (isUUID(res)) {
                    $scope.LoadImg = false;
                    if (res.length > 0) {
                        if (res.length > 4) {
                            window.location.href = '/Reports/' + res + '.pdf';
                        } else {
                            alert("No NR Report Present");
                        }
                    } else {
                        alert("No NR Report Present");
                    }
                } else {
                    var res1 = JSON.parse(res);
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
                            $scope.LoadImg = false;
                        }
                    }
                }
            }, function (err) {
                $scope.LoadImg = false;
                alert("Error while loading");
            });

        };

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

        $scope.printMarksEntered = function () {

            $scope.printHead = true;
            var divName = "idtoDivPrint";
            var $markstable = document.createElement("div");
            $markstable.innerHTML = '';
            $markstable.className = "table";
            var divToPrint = document.getElementById(divName);
            var temp = document.body.innerHTML;
            //    $("#markslist").hide();
            var domClone = divToPrint.cloneNode(true);
            var $printSection = document.getElementById("printSection");
            if ($printSection) {
                var $printSection = document.createElement("div");
                $printSection.id = "printSection";


                document.body.appendChild($printSection);

                var $ele1 = document.createElement("div");
                $ele1.className = "row";

                var $ele2 = document.createElement("div");
                $ele2.className = "col-lg-2 col-md-12";

                var $ele3 = document.createElement("div");
                $ele3.className = "col-lg-10 col-md-12";


                $ele1.appendChild($ele3);

                $printSection.appendChild($ele1);

                $printSection.appendChild($ele1);
                $printSection.appendChild($markstable);

            }
            var tempTitle = document.title;
            var dateobj = new Date();
            //var B = dateobj.getDate();
            // var date = dateobj.getDate() + dateobj.getHours+":"+dateobj.getMinutes;
            //document.write(B);
            document.title = $scope.pinNumber;
            window.print();
            document.title = tempTitle;

        }
    })
})