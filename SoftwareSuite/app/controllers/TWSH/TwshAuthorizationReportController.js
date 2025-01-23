define(['app'], function (app) {
    app.controller("TwshAuthorizationReportController", function ($scope, $state, TwshStudentRegService, $localStorage) {
        var authData = $localStorage.authorizationData;

        $scope.userId = authData.SysUserID;
        $scope.userType = authData.SystemUserTypeId;

        var Exammode = sessionStorage.getItem("ExamMode");
        var ExamMonthYearID = sessionStorage.getItem("ExamMonthYearID");
        var CbtfromData = sessionStorage.getItem("cbtfromdate");
        var CbttoData = sessionStorage.getItem("cbttodate");

        $scope.clearSessionStorage = function () {
            sessionStorage.removeItem("Exammode");
            sessionStorage.removeItem("ExamMonthYearID");
            sessionStorage.removeItem("CbtfromData");
            sessionStorage.removeItem("CbttoData");
        };

        // Function to detect browser refresh
        $scope.detectRefresh = function () {
            if (!performance.navigation.type || performance.navigation.type === 1) {
                // Browser refresh detected, clear session storage
                $scope.clearSessionStorage();
            }
        };

        // Call detectRefresh on page load
        $scope.detectRefresh();


        if (ExamMonthYearID != null) {

            $scope.ExamMode = Exammode;
            $scope.ExamMonthYearId = ExamMonthYearID;
            $scope.fromdate = CbtfromData;
            $scope.todate = CbttoData;

            var GetInstituteReports = TwshStudentRegService.getTwshAuthorizationlList($scope.ExamMode, $scope.ExamMonthYearId, $scope.fromdate.toString(), $scope.todate.toString());
            GetInstituteReports.then(function (response) {

                if (response.length > 0) {
                    //$scope.LoadImg = false;
                    //$scope.$emit('hideLoading', MyData);
                    $scope.data = true;

                    $scope.QualifiedList = response;
                    var Registered = 0;
                    var ApprovalPending = 0;
                    var Approved = 0;
                    var Rejected = 0;
                    for (count = 0; count < $scope.QualifiedList.length; count++) {
                        Registered += parseInt($scope.QualifiedList[count].registered)
                        ApprovalPending += parseInt($scope.QualifiedList[count].ApprovalPending)
                        Approved += parseInt($scope.QualifiedList[count].Approved);
                        Rejected += parseInt($scope.QualifiedList[count].rejected);
                    }

                    $scope.Registered = Registered;
                    $scope.ApprovalPending = ApprovalPending;
                    $scope.Approved = Approved;
                    $scope.Rejected = Rejected;

                } else {
                    //$scope.LoadImg = false;
                    $scope.$emit('hideLoading', MyData);
                    $scope.StatusMessage = "No Data Found";
                    $scope.showStatus = true;
                    $scope.statusclass = 'alert-danger';
                    $scope.data = false;
                }
            },
                function (error) {
                    $scope.$emit('hideLoading', MyData);
                    //$scope.LoadImg = false;
                    $scope.StatusMessage = "No Data Found";
                    $scope.showStatus = true;
                    $scope.statusclass = 'alert-danger';
                    $scope.data = false;

                });

        }




        $scope.ExamTypes = [
           { Name: "Computer Based Test(CBT)", Id: 1 },
           { Name: "TypeMachine Based Test(TMBT)", Id: 2 }
        ];
       
        var GetExamYearMonth = TwshStudentRegService.getTwshExamMonthYears();
        GetExamYearMonth.then(function (res) {
            //console.log(res)
           // var response=JSON.parse(res)
            $scope.getExamYearMonth = res.Table;
            //console.log($scope.getExamYearMonth)
        },
                function (error) {

                    var err = JSON.parse(error);
                });

        //$scope.LoadImg = true;
        $scope.GetReport = function () {
            $scope.fromdate = moment($scope.FromDate).format("YYYY-MM-DD");
            $scope.todate = moment($scope.ToDate).format("YYYY-MM-DD");
            var GetInstituteReports = TwshStudentRegService.getTwshAuthorizationlList($scope.ExamMode, $scope.ExamMonthYearId, $scope.fromdate.toString(), $scope.todate.toString());
            GetInstituteReports.then(function (response) {
            
                if (response.length > 0) {
                    //$scope.LoadImg = false;
                    //$scope.$emit('hideLoading', MyData);
                    $scope.data = true;

                    $scope.QualifiedList = response;
                    var Registered = 0;
                    var ApprovalPending = 0;
                    var Approved = 0;
                    var Rejected = 0;
                    for (count = 0; count < $scope.QualifiedList.length; count++) {
                        Registered += parseInt($scope.QualifiedList[count].registered)
                        ApprovalPending += parseInt($scope.QualifiedList[count].ApprovalPending)
                        Approved += parseInt($scope.QualifiedList[count].Approved);
                        Rejected += parseInt($scope.QualifiedList[count].rejected);
                    }

                    $scope.Registered = Registered;
                    $scope.ApprovalPending = ApprovalPending;
                    $scope.Approved = Approved;
                    $scope.Rejected = Rejected;

                } else {
                    //$scope.LoadImg = false;
                    $scope.$emit('hideLoading', MyData);
                    $scope.StatusMessage = "No Data Found";
                    $scope.showStatus = true;
                    $scope.statusclass = 'alert-danger';
                    $scope.data = false;
                }
            },
                function (error) {
                    $scope.$emit('hideLoading', MyData);
                    //$scope.LoadImg = false;
                    $scope.StatusMessage = "No Data Found";
                    $scope.showStatus = true;
                    $scope.statusclass = 'alert-danger';
                    $scope.data = false;

                });

        }
        $scope.DownloadtoExcel = function () {
            var ApprovalList = TwshStudentRegService.getTwshAuthorizationlListExcel($scope.ExamMode, $scope.ExamMonthYearId, $scope.fromdate.toString(), $scope.todate.toString());
            ApprovalList.then(function (res) {
                var response = JSON.parse(res)
                if (response[0].ResponceCode = '200') {
                    //$scope.loading = false;
                    //$scope.Data = true;
                    window.location.href = response[0].file;

                } else {
                    alert("No Data Found")
                    $scope.loading = false;
                    //$scope.Data = false;
                }
            },
        function (error) {
            //$scope.Data = false;
            $scope.loading = false;
            alert("error while loading Exam Month Year");

        });
        }


        $scope.DownloadtoExcelBlind = function () {
            var DataType = 1;
            var blndlist = TwshStudentRegService.GetStudentBlindListExcel(DataType);
            blndlist.then(function (response) {
                if (response != null && response.length > 1) {
                    var location = window.location.origin;
                    $scope.LoadImg = false;
                    window.location.href = response;
                    $scope.NoResult = false;

                } else {
                    alert("No Data Found")
                    $scope.loading = false;
                    //$scope.Data = false;
                }
            },
                function (error) {
                    //$scope.Data = false;
                    $scope.loading = false;
                    alert("error while loading List");

                });
        }

        $scope.OpenCountData = function (data) {
            $localStorage.TwshAuthListData = {
                CollegeCode: data.CollegeCode,
                ExamMode: $scope.ExamMode,
                ExamMonthYearId: $scope.ExamMonthYearId,
                fromdate: "2024-12-09",
                todate: "2024-12-09"
            }
            $state.go('Dashboard.TypeWriting.TwshAuthorizationReportGradeWise')
        }

        $scope.changemode = function (data) {
            if (data==1) {
                $scope.QualifiedList = [];
                $scope.data = false;
                $scope.ExamMonthYearId = null;
                
            }
            else if (data == 2){
                $scope.QualifiedList = [];
                $scope.data = false;
                $scope.ExamMonthYearId = null;

            }

        }

    })
})