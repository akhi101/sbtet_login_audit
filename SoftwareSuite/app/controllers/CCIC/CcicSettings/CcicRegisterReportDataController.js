define(['app'], function (app) {
    app.controller("CcicRegisterReportDataController", function ($scope, $localStorage, $state, CcicPreExaminationService) {

        var authData = $localStorage.authorizationData;
        var tmp = $localStorage.TempData;
        $scope.UserName = authData.UserName;
        $scope.RegisterReportData = false;
        $scope.AdmRegisterReportData = false;
        var tempData2 = $localStorage.TempData2;
        var InstitutionID = authData.InstitutionID;
        const $ctrl = this;
        $ctrl.$onInit = () => {

            /*$scope.GetEnrollmentReportData();*/
            //$scope.ShowStudentDetails = false;
            //$scope.LoadImg = false;
            $scope.Clear = false;
        }

        var data = {};
        $scope.$emit('showLoading', data);

       
        //if ($scope.UserTypeID == 1) {

        //    $scope.AdmRegisterReportData = true;
        //    $scope.RegisterReportData = false;
        //    $scope.DataTable1 = true;
        //    var registerreportData = CcicPreExaminationService.GetAdminRegisterReportData(tmp.InstitutionID, tempData3.CourseID, tempData3.ReportTypeID, tmp.academicYear, tmp.batch);
        //    registerreportData.then(function (response) {
        //        try {
        //            var res = JSON.parse(response);
        //        }
        //        catch (err) { }
        //        $scope.AdmRegisterReportDataTable = [];
        //        if (res.length >= 0) {

        //            $scope.AdmRegisterReportDataTable = res;

        //        } else {

        //            $scope.AdmRegisterReportDataTable = [];
        //        }
        //    },
        //        function (error) {
        //            //   alert("error while loading Notification");
        //            var err = JSON.parse(error);
        //        });
        //}



      /*  else if ($scope.UserTypeID==2) {*/
            //$scope.RegisterReportData = true;
            //$scope.AdmRegisterReportData = false;
        //$scope.DataTable = true;
        $scope.loading = true;
        var InstitutionID = (authData.InstitutionID == undefined || authData.InstitutionID == '' || authData.InstitutionID == 0) ? tmp.InstitutionID : authData.InstitutionID

        var enrollmentreportData = CcicPreExaminationService.GetInstitutionRegisterReportData(InstitutionID, tempData2.CourseID, tempData2.ReportTypeID, tempData2.academicYear, tempData2.batch);
            enrollmentreportData.then(function (response) {
                try {
                    var res = JSON.parse(response);
                }
                catch (err) { }
                $scope.RegisterReportDataTable = [];
                if (res.length >= 0) {
                    $scope.loading = false;
                    $scope.RegisterReportDataTable = res;
                    $scope.$emit('hideLoading', data);


                } else {
                    $scope.loading = false;
                    $scope.RegisterReportDataTable = [];
                    $scope.$emit('hideLoading', data);

                }
            },
                function (error) {
                    //   alert("error while loading Notification");
                    var err = JSON.parse(error);
                });



        $scope.goBack = function () {
            var AcademicYearID = tmp.academicYear;
            var Batch = tmp.batch;
            var InstitutionID = authData.InstitutionID;
            sessionStorage.setItem("AcademicYearID", AcademicYearID);
            sessionStorage.setItem("Batch", Batch);
            sessionStorage.setItem("InstitutionID", InstitutionID);
            $state.go("CcicDashboard.Academic.Register");
        }

        $scope.Close = function () {
            $state.go('CcicDashboard.Academic.Register')
        }

       
        $scope.ViewStudentDetails = function (ApplicationNumber, StudentID, isSubmitted, ApplicationStatus) {

            $localStorage.TempData3 = {
                ApplicationNumber: ApplicationNumber,
                StudentID: StudentID,
                isSubmitted: isSubmitted,
                ApplicationStatus: ApplicationStatus,
                CourseID: tempData2.CourseID,
                REGID:2
            };

            $state.go('CcicDashboard.Academic.ViewStdDetails');


        }

    });
});















