define(['app'], function (app) {
    app.service("CcicStudentResultService", function (DataAccessService) {


        
        this.GetStudentResult = function (AcademicYearID,ExamMonthYearID,PIN) {
            var paramObj = {
                "AcademicYearID": AcademicYearID,
                "ExamMonthYearID": ExamMonthYearID,
                "PIN": PIN
            };
            var promise = DataAccessService.getDataWithPara('api/CcicStudentResult/GetStudentResult', paramObj);
            return promise;
        };

        this.GetStudentPreviewResult = function (AcademicYearID, ExamMonthYearID, PIN) {
            var paramObj = {
                "AcademicYearID": AcademicYearID,
                "ExamMonthYearID": ExamMonthYearID,
                "PIN": PIN
            };
            var promise = DataAccessService.getDataWithPara('api/CcicStudentResult/GetStudentPreviewResult', paramObj);
            return promise;
        };


        this.ResultsDeployTables = function (AcademicYearID, ExamMonthYearID, UserName) {
            var paramObj = {
                "AcademicYearID": AcademicYearID,
                "ExamMonthYearID": ExamMonthYearID,
                "UserName": UserName
            };
            var promise = DataAccessService.getDataWithPara('api/CcicStudentResult/ResultsDeployTables', paramObj);
            return promise;
        };

       

    });
});