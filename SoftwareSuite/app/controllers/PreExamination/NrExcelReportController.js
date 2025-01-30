define(['app'], function (app) {
    app.controller("NrExcelReportController", function ($scope, $http, $localStorage, $state, $stateParams, AppSettings, PreExaminationService) {

        $scope.ArrayBarimg = [];
        $scope.ArrayBarcode = [];
        $scope.BarcodeElements = [];
        $scope.examTypeId = "0";
        $scope.Exams = [
            { id: 1, exam: "Mid 1" },
            { id: 2, exam: "Mid 2" },
            { id: 5, exam: "Semester" }
        ];
        //var authData = $localStorage.authorizationData;

        var authData = JSON.parse(sessionStorage.getItem('user'));

        $scope.DetailsFound = false;
        PreExaminationService.GetExamMonthYears().then(function (res) {
            $scope.ExamMonthYears = res.Table;
        },
            function (error) {
                alert("error while loading Exam Month Years");
                console.log(error);
            });

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


        $scope.changedVal = function () {
            $scope.DetailsFound = false;
        }

        var authData = JSON.parse(sessionStorage.getItem('user'));
        $scope.userType = authData.SystemUserTypeId;
        if ($scope.userType != 1) {
            alert("UnAuthorized Access")
            $state.go('Dashboard')
        }



        $scope.logOut = function () {
            sessionStorage.loggedIn = "no";
            var GetUserLogout = SystemUserService.postUserLogout($scope.userName);
            GetUserLogout.then(function (response) {
                if (response.Table[0].ResponceCode == '200') {
                    alert(response.Table[0].ResponceDescription);
                } else {
                    alert('Unsuccess')
                }
            },
                function (error) {
                    //   alert("error while loading Notification");
                    var err = JSON.parse(error);
                });
            sessionStorage.removeItem('user')
            sessionStorage.removeItem('authToken')
            sessionStorage.removeItem('SessionID')
            sessionStorage.clear();

            $localStorage.authorizationData = ""
            $localStorage.authToken = ""
            delete $localStorage.authorizationData;
            delete $localStorage.authToken;
            delete $scope.SessionID;
            $scope.authentication = {
                isAuth: false,
                UserId: 0,
                userName: ""
            };
            $state.go('index.WebsiteLogin')

        }



        $scope.getNrExcel = function (StudentType, ExamTypeId) {
            $scope.LoadImg = true;
            var getNrReports = PreExaminationService.NrExcelReports(StudentType, authData.College_Code.toString(), ExamTypeId, $scope.selectedEmy);
            getNrReports.then(function (res) {
                $scope.LoadImg = false;
                if (res.length > 0) {
                    if (res.length > 4) {
                        window.location.href = res;
                    } else {
                        alert("No NR Excel Report Present")
                    }
                } else {
                    alert("No NR Report Present")
                }
            }, function (err) {
                $scope.LoadImg = false;
                alert("Error while loading");
            });

        };

    })
})