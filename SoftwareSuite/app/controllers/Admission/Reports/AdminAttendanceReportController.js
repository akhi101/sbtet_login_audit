﻿define(['app'], function (app) {
    app.controller("AdminAttendanceReportController", function ($scope, $state, $stateParams, $localStorage, AppSettings,AdmissionService, AttendanceService, Excel, $timeout) {
      //  $scope.loading = true;
        var data = {};
        $scope.$emit('showLoading', data);
        //var AcademicId = authData.AcademicId;
        //var authData = $localStorage.authorizationData;  
        var authData = JSON.parse(sessionStorage.getItem('user'));

        $scope.userType = authData.SystemUserTypeId;
        if ($scope.userType == 1 || $scope.userType == 1000 || $scope.userType  == 1014){
            var AdminAttendanceReports = AttendanceService.getAdminAttendanceReports()
            AdminAttendanceReports.then(function (response) {           
                if (response.Table.length > 0) {
                    $scope.$emit('hideLoading', data);
                   // $scope.loading = false;
                    $scope.NoResult = false;
                    $scope.Result = true;
                    $scope.AttendanceReports = response.Table;         
                } else {
                    //  $scope.loading = true;
                    $scope.$emit('hideLoading', data);
                    $scope.NoResult = false;
                    $scope.Result = false;
                    alert("No Data Found");
                }
            }, function (error) {
                $scope.$emit('hideLoading', data);
             //   $scope.loading = true;
                $scope.NoResult = false;
                $scope.Result = false;
                alert("error");
            });

            var AdminAttendanceReports = AttendanceService.getAdminAttendanceReportsExams()
            AdminAttendanceReports.then(function (response) {
                if (response.Table.length > 0) {
                    $scope.$emit('hideLoading', data);
                    // $scope.loading = false;
                    //$scope.NoResult = false;
                    //$scope.Result = true;
                    $scope.ExamsAttendanceReports = response.Table;
                } else {
                    //  $scope.loading = true;
                    $scope.$emit('hideLoading', data);
                    //$scope.NoResult = false;
                    //$scope.Result = false;
                    alert("No Data Found");
                }
            }, function (error) {
                $scope.$emit('hideLoading', data);
                //   $scope.loading = true;
                //$scope.NoResult = false;
                //$scope.Result = false;
                alert("error");
            });

        }else{
            $state.go('Dashboard.AdmissionDashboard.GetAttendanceReport');
        }

        var authData = JSON.parse(sessionStorage.getItem('user'));
        $scope.userType = authData.SystemUserTypeId;
        if ($scope.userType != 1 || $scope.userType != 3 ) {
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



        $scope.openCollegeAttendance = function (CollegeCode) {
            $localStorage.CollegeAttendanceReports = {}
            var CollegeAttendanceReports = {
              
                collegecode: CollegeCode,
            }
            $localStorage.CollegeAttendanceReports = CollegeAttendanceReports;
            $state.go("Dashboard.AdmissionDashboard.GetAttendanceReport");
        }
        $scope.DownloadtoExcel = function (tableid) {
            var exportHref = Excel.tableToExcel(tableid, 'stdentDetails');
            $timeout(function () {
                var a = document.createElement('a');
                a.href = exportHref;
                $('#a').remove();
                a.download = "CollegeList.xls";
                document.body.appendChild(a);
                a.click();
                $('#a').remove();
            }, 100);
        }

    })
    app.factory('Excel', function ($window) {
        //alert("hello");
        var uri = 'data:application/vnd.ms-excel;base64,',
            template = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body><table>{table}</table></body></html>',
            base64 = function (s) { return $window.btoa(unescape(encodeURIComponent(s))); },
            format = function (s, c) { return s.replace(/{(\w+)}/g, function (m, p) { return c[p]; }) };
        return {
            tableToExcel: function (tableId, worksheetName) {
                var table = $(tableId);
                ctx = { worksheet: worksheetName, table: table.html() },
                    href = uri + base64(format(template, ctx));
                return href;
            }
        };
    });
})