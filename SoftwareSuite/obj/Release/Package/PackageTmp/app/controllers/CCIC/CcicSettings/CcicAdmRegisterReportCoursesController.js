define(['app'], function (app) {
    app.controller("CcicAdmRegisterReportCourses", function ($scope, $localStorage, $state, CcicPreExaminationService) {

        var authData = $localStorage.authorizationData;
        $scope.UserName = authData.UserName;
        $scope.UserTypeID = authData.UserTypeID;
        var tmp = $localStorage.TempData;

        $scope.InstitutionID = tmp.InstitutionID;
        $scope.Institution = tmp.Institution;
        $scope.AcademicYear = tmp.academicYear;
        $scope.Batch = tmp.batch;

        const $ctrl = this;
        $ctrl.$onInit = () => {


        }


        $scope.goBack = function () {
            var AcademicYearID = tmp.academicYear;
            var Batch = tmp.batch;
            sessionStorage.setItem("AcademicYearID", AcademicYearID);
            sessionStorage.setItem("Batch", Batch);
            $state.go("CcicDashboard.Academic.Register");
        }



        var data = [];
        $scope.$emit('showLoading', data);

        $scope.loading = true;
        var InstitutionID = (authData.InstitutionID == undefined || authData.InstitutionID == '' || authData.InstitutionID == 0) ? tmp.InstitutionID : authData.InstitutionID
        var registerreportcoursesCount = CcicPreExaminationService.GetInsRegisterReportCoursesCount(InstitutionID,tmp.academicYear,tmp.batch);
        registerreportcoursesCount.then(function (response) {
            try {
                var res = JSON.parse(response);
            }
            catch (err) { }
            $scope.RegisterReportCoursesTable = [];
            if (res.length >= 0) {
                $scope.loading = false;
                $scope.RegisterReportCoursesTable = res;
                $scope.$emit('hideLoading', data);

            } else {
                $scope.loading = false;
                $scope.RegisterReportCoursesTable = [];
                $scope.$emit('hideLoading', data);

            }
        },
            function (error) {
                //   alert("error while loading Notification");
                var err = JSON.parse(error);
            });


    



        $scope.ShowDetails = function (CourseID, ReportTypeID, Course) {

            $localStorage.TempData2 = {
                InstitutionID: $scope.InstitutionID,
                CourseID: CourseID,
                ReportTypeID: ReportTypeID,
                academicYear: $scope.AcademicYear,
                batch: $scope.Batch,
                Course: Course,
                Institution: $scope.Institution

            };

            $state.go('CcicDashboard.Academic.CcicAdmRegisterReportData');


        }



    });
});

