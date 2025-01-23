﻿define(['app'], function (app) {
    app.controller("CcicResultsProcessingController", function ($scope, $http, $localStorage, $rootScope, $state, $stateParams, $document, CcicPreExaminationService, CcicStudentResultService, AppSettings, $timeout) {

        //var serializedData = { "Name": ["Akhil"] }
        //request = $.ajax({
        //    url: "https://docs.google.com/spreadsheets/d/1FNnXNCX-KF0eaqk9-z0FKZoenocmakvJQLZI1uo1W3Y/edit#gid=0",
        //    type: "post",
        //    data: serializedData
        //});
        $scope.reload = false;
        var authData = $localStorage.authorizationData;
        $scope.userName = authData.UserName;

        $scope.Mode1 = function () {

            //2
            $scope.Academicyear = null;
            $scope.Monthyear = null;


            $scope.ACademicYear = null;
            $scope.MOnthyear = null;
            $scope.reload = false;

            //3
            $scope.ACAdemicyear = null;
            $scope.MONthyear = null;
            $scope.reload = false;

            $scope.ACADemicyear = null;
            $scope.MONThyear = null;
            $scope.ShowData1 = false;
            $scope.FileContains1 = false;
            $scope.ShowTableData1 = false;
            $scope.reload1 = false;

            //4
            $scope.ACADEmicYear = null;
            $scope.MONTHyear = null;
            $scope.reload = false;

            //5
            $scope.resacademicyear = null;
            $scope.resmonthyear = null;
            $scope.Pin='';
            $scope.LoadImg = false;
            $scope.ResultFound = false;
            $scope.ResultNotFound = false;
            $scope.UnderMaintainance = false;

            //6
            $scope.AcadeMICYear = null;
            $scope.MONthYEar = null;
            $scope.reload = false;


        }

        $scope.Mode2 = function () {

            //1
            $scope.academicyear = null;
            $scope.monthyear = null;
            $scope.ShowData = false;
            $scope.ShowTableData = false;
            $scope.reload = false;
            $scope.FileContains = false;


            //3
            $scope.ACAdemicyear = null;
            $scope.MONthyear = null;
            $scope.reload = false;

            $scope.ACADemicyear = null;
            $scope.MONThyear = null;
            $scope.ShowData1 = false;
            $scope.FileContains1 = false;
            $scope.ShowTableData1 = false;
            $scope.reload1 = false;

            //4
            $scope.ACADEmicYear = null;
            $scope.MONTHyear = null;
            $scope.reload = false;

            //5
            $scope.resacademicyear = null;
            $scope.resmonthyear = null;
            $scope.Pin='';
            $scope.LoadImg = false;
            $scope.ResultFound = false;
            $scope.ResultNotFound = false;
            $scope.UnderMaintainance = false;

            //6
            $scope.AcadeMICYear = null;
            $scope.MONthYEar = null;
            $scope.reload = false;



        }

        $scope.Mode3 = function () {

            //1
            $scope.academicyear = null;
            $scope.monthyear = null;
            $scope.ShowData = false;
            $scope.ShowTableData = false;
            $scope.reload = false;
            $scope.FileContains = false;


            //2
            $scope.Academicyear = null;
            $scope.Monthyear = null;


            $scope.ACademicYear = null;
            $scope.MOnthyear = null;
            $scope.reload = false;


            //4
            $scope.ACADEmicYear = null;
            $scope.MONTHyear = null;
            $scope.reload = false;

            //5
            $scope.resacademicyear = null;
            $scope.resmonthyear = null;
            $scope.Pin='';
            $scope.LoadImg = false;
            $scope.ResultFound = false;
            $scope.ResultNotFound = false;
            $scope.UnderMaintainance = false;

            //6
            $scope.AcadeMICYear = null;
            $scope.MONthYEar = null;
            $scope.reload = false;

        }

        $scope.Mode4 = function () {

            //1
            $scope.academicyear = null;
            $scope.monthyear = null;
            $scope.ShowData = false;
            $scope.ShowTableData = false;
            $scope.reload = false;
            $scope.FileContains = false;


            //2
            $scope.Academicyear = null;
            $scope.Monthyear = null;


            $scope.ACademicYear = null;
            $scope.MOnthyear = null;
            $scope.reload = false;

            //3
            $scope.ACAdemicyear = null;
            $scope.MONthyear = null;
            $scope.reload = false;

            $scope.ACADemicyear = null;
            $scope.MONThyear = null;
            $scope.ShowData1 = false;
            $scope.FileContains1 = false;
            $scope.ShowTableData1 = false;
            $scope.reload1 = false;


            //5
            $scope.resacademicyear = null;
            $scope.resmonthyear = null;
            $scope.Pin='';
            $scope.LoadImg = false;
            $scope.ResultFound = false;
            $scope.ResultNotFound = false;
            $scope.UnderMaintainance = false;

            //6
            $scope.AcadeMICYear = null;
            $scope.MONthYEar = null;
            $scope.reload = false;

        }

        $scope.Mode5 = function () {

            //1
            $scope.academicyear = null;
            $scope.monthyear = null;
            $scope.ShowData = false;
            $scope.ShowTableData = false;
            $scope.reload = false;
            $scope.FileContains = false;


            //2
            $scope.Academicyear = null;
            $scope.Monthyear = null;


            $scope.ACademicYear = null;
            $scope.MOnthyear = null;
            $scope.reload = false;

            //3
            $scope.ACAdemicyear = null;
            $scope.MONthyear = null;
            $scope.reload = false;

            $scope.ACADemicyear = null;
            $scope.MONThyear = null;
            $scope.ShowData1 = false;
            $scope.FileContains1 = false;
            $scope.ShowTableData1 = false;
            $scope.reload1 = false;

            //4
            $scope.ACADEmicYear = null;
            $scope.MONTHyear = null;
            $scope.reload = false;


            //6
            $scope.AcadeMICYear = null;
            $scope.MONthYEar = null;
            $scope.reload = false;


        }

        $scope.Mode6 = function () {

            //1
            $scope.academicyear = null;
            $scope.monthyear = null;
            $scope.ShowData = false;
            $scope.ShowTableData = false;
            $scope.reload = false;
            $scope.FileContains = false;


            //2
            $scope.Academicyear = null;
            $scope.Monthyear = null;


            $scope.ACademicYear = null;
            $scope.MOnthyear = null;
            $scope.reload = false;

            //3
            $scope.ACAdemicyear = null;
            $scope.MONthyear = null;
            $scope.reload = false;

            $scope.ACADemicyear = null;
            $scope.MONThyear = null;
            $scope.ShowData1 = false;
            $scope.FileContains1 = false;
            $scope.ShowTableData1 = false;
            $scope.reload1 = false;

            //4
            $scope.ACADEmicYear = null;
            $scope.MONTHyear = null;
            $scope.reload = false;

            //5
            $scope.resacademicyear = null;
            $scope.resmonthyear = null;
            $scope.LoadImg = false;
            $scope.ResultFound = false;
            $scope.ResultNotFound = false;
            $scope.UnderMaintainance = false;


        }





        $scope.hidePreviousResult = function () {
            $scope.ResultFound = false;
            $scope.showData = 0;
            $scope.StudentWiseReportData = [];
            $scope.studentInfo = [];
            $scope.BranchSubjectGradeInfo = [];
            $scope.studentsubjecttotal = [];
        },

            $scope.DownloadPdfResult = function (tableid) {
                // alert(tableid + ":" + AppSettings.ExportToPdfUrl);
                //alert("pdf : " + tableid);
                html2canvas($('#idtoDivPrintAdmin'), {
                    onrendered: function (canvas) {
                        var data = canvas.toDataURL();
                        var docDefinition = {
                            content: [{
                                image: data,
                                width: 500
                            }]
                        };
                        pdfMake.createPdf(docDefinition).download("Table.pdf");
                    }
                });
            }

        $scope.DownloadExcelResult = function (tableId) {
            var exportHref = Excel.tableToExcel(tableId, 'StudentResult');
            $timeout(function () { location.href = exportHref; }, 100);
        }

        $scope.PrintStudentResult = function () {

            var divName = "idtoDivPrintAdmin";
            var divToPrint = document.getElementById(divName);
            var temp = document.body.innerHTML;
            $("#studentresult1").hide();
            var domClone = divToPrint.cloneNode(true);
            var $printSection = document.getElementById("printSection");
            //document.body.innerHTML = "";
            if (!$printSection) {
                var $printSection = document.createElement("div");
                $printSection.id = "printSection";
                document.body.appendChild($printSection);
            }
            $printSection.innerHTML = "";
            $printSection.appendChild(domClone);
            // alert($printSection.innerHTML);
            document.title = $scope.Pin;
            window.print();
            document.body.removeChild($printSection);
            $("#studentresult1").show();
        };


        $scope.PrintDashBoard = function () {
            var divName = "";
            if ($scope.adminuser == true) {
                divName = "idtoDivPrintAdmin";
            }
            else {
                divName = "DivIdToPrint";
            }

            var divToPrint = document.getElementById(divName);

            var newWin = window.open('', 'Print-Window');

            newWin.document.open();

            newWin.document.write('<html><body onload="window.print()">' + divToPrint.innerHTML + '</body></html>');

            newWin.document.close();

            setTimeout(function () { newWin.close(); }, 10);
        }

        $scope.DownloadPdfResultStudent = function (tableid) {

            // alert(tableid + ":" + AppSettings.ExportToPdfUrl);
            //alert("pdf : " + tableid);
            var height = $('#idtoDivPrintAdmin').height();
            var width = $('#idtoDivPrintAdmin').width();
            $('#idtoDivPrintAdmin').height('auto');
            var scaleBy = 5;
            var w = 1000;
            var h = 1000;
            var div = document.querySelector('#idtoDivPrintAdmin');
            var canvas = document.createElement('canvas');
            canvas.width = window.innerWidth * scaleBy;
            canvas.height = window.innerHeight * scaleBy;

            var context = canvas.getContext('2d');
            context.scale(scaleBy, scaleBy);
            html2canvas(div, {
                canvas: canvas,
                onrendered: function (canvas) {
                    thecanvas = canvas;
                    var data = thecanvas.toDataURL();
                    var docDefinition = {
                        // pageSize: { width: thecanvas.width, height: thecanvas.height },
                        content: [{
                            image: data,
                            width: 500
                        }],
                    };
                    pdfMake.createPdf(docDefinition).download("Table.pdf");
                    $('#idtoDivPrintAdmin').height(height);
                }
            });
        }
        $scope.SubmitForm = function () {
            $scope.ShowData = true;
        }

        $scope.submit = function () {
            if ($scope.resacademicyear == undefined || $scope.resacademicyear == null || $scope.resacademicyear == "") {
                alert("Select Academic Year ");
                return false;
            }

            if ($scope.resmonthyear == undefined || $scope.resmonthyear == null || $scope.resmonthyear == "") {
                alert("Select Exam Month Year");
                return false;
            }

            if ($scope.Pin == undefined || $scope.Pin == null || $scope.Pin == "") {
                alert("Select Pin");
                return false;
            }



            $scope.LoadImg = true;
            $scope.ResultNotFound = false;
            $scope.ResultFound = false;
            $scope.showData = 0
            var getdata = CcicStudentResultService.GetStudentPreviewResult($scope.resacademicyear, $scope.resmonthyear, $scope.Pin);
            getdata.then(function (response) {
                try {
                    var res = JSON.parse(response)
                }
                catch { }
                if (res.Table !== undefined && res.Table.length > 0) {
                    $scope.showData = 1;
                    $scope.LoadImg = false;
                    $scope.ResultFound = true;
                    $scope.getSubjectsResponse = res.Table;
                    $scope.getStudentsResponse = res.Table1;

                    $scope.Result = $scope.getStudentsResponse[0].Result;
                    $scope.SubjectTotal = $scope.getStudentsResponse[0].TotalMarks;
                    $scope.ExamMonthYear = $scope.getStudentsResponse[0].ExamMonthYear;
                    $scope.Percentage = $scope.getStudentsResponse[0].Percentage;
                    $scope.Class = $scope.getStudentsResponse[0].Class;

                    //    $scope.PIN = $scope.getStudentsResponse[0].PIN;
                }
                else {
                    //alert("no subjects");
                    //$state.go("Dashboard.AssessmentDashboard.practicals");
                    $scope.LoadImg = false;
                    $scope.ResultFound = false;
                }
            }, function (error) {
                alert("some thing went wrong");
            });


        }

        $scope.Submit = function () {
            $scope.ShowData1 = true;
        }
        $scope.GetTable = false;
        //$scope.MonthAndYear = [
        //   { "Id": 1, "ExamYearMonth": "Oct - Nov 2018" },
        //   { "Id": 2, "ExamYearMonth": "Mar - Apr 2019" },
        //   { "Id": 3, "ExamYearMonth": "June 2019" },
        //   { "Id": 4, "ExamYearMonth": "Nov - Dec 2019" }
        //]




        var expanded = false;
        $scope.showCheckboxes = function () {
            var checkboxes = document.getElementById("checkboxes");
            if (!expanded) {
                checkboxes.style.display = "block";
                expanded = true;
            } else {
                checkboxes.style.display = "none";
                expanded = false;
            }
        }

        $scope.closeCheckbox = function () {
            var checkboxes = document.getElementById("checkboxes");
            if (!expanded) {
                checkboxes.style.display = "block";
                expanded = true;
            } else {
                checkboxes.style.display = "none";
                expanded = false;
            }
        }

        //get schemes data for dropdown

        $scope.optionToggled = function (mid1list) {
            $scope.isAllSelected = $scope.schemeinfo.every(function (itm) { return itm.selected; })
            $scope.arr = [];
            angular.forEach($scope.schemeinfo, function (value, key) {
                if (value.selected === true) {
                    console.log(value);
                    $scope.arr.push({ "schemeid": value.schemeid })
                }
            });
            console.log($scope.arr)
            console.log($scope.userTypes)

        }


        $scope.toggleAll = function () {
            var toggleStatus = $scope.isAllSelected;
            angular.forEach($scope.schemeinfo, function (itm) { itm.selected = toggleStatus; });
            $scope.arr = [];
            angular.forEach($scope.schemeinfo, function (value, key) {
                if (value.selected === true) {
                    console.log(value);
                    $scope.arr.push({ "schemeid": value.schemeid })
                }

            });
            //console.log($scope.arr)
            //console.log($scope.userTypes)
        }


        // student pass type 
        //$scope.SelStudentType = 2;



        var getCcicCurrentAcademicYear = CcicPreExaminationService.GetCcicCurrentAcademicYear();
        getCcicCurrentAcademicYear.then(function (response) {

            $scope.GetCcicCurrentAcademicYear = response;

        },
            function (error) {
                alert("error while loading CurrentAcademicYear");
                var err = JSON.parse(error);

            });


        var getCcicCurrentAcademicYear = CcicPreExaminationService.GetCcicCurrentAcademicYear();
        getCcicCurrentAcademicYear.then(function (response) {

            $scope.GetCcicResultsAcademicYear = response;

        },
            function (error) {
                alert("error while loading CurrentAcademicYear");
                var err = JSON.parse(error);

            });


        $scope.GetResultsExamMonthYearData = function (resacademicyear) {
            if (resacademicyear == null || resacademicyear == undefined || resacademicyear == "") {
                return;

            }

            var getCcicAcademicYearBatch = CcicPreExaminationService.GetExamMonthYears(resacademicyear)
            getCcicAcademicYearBatch.then(function (res) {
                try {
                    var res = JSON.parse(res);
                }
                catch (err) { }

                if (res.Table.length > 0) {
                    $scope.GetResultsExamMonthYear = res.Table;
                }
                else {
                    $scope.GetResultsExamMonthYear = [];
                }
                for (var j = 1; j < res.length + 1; j++) {
                    $scope['edit' + j] = true;
                }
            },
                function (error) {
                    alert("data is not loaded");
                    var err = JSON.parse(error);
                });

        }

        $scope.GetOsdesExamMonthYearData = function (academicyear) {
            if (academicyear == null || academicyear == undefined || academicyear == "") {
                return;

            }

            var getCcicAcademicYearBatch = CcicPreExaminationService.GetExamMonthYears(academicyear)
            getCcicAcademicYearBatch.then(function (res) {
                try {
                    var res = JSON.parse(res);
                }
                catch (err) { }

                if (res.Table.length > 0) {
                    $scope.OsdesExamMonthYear = res.Table;
                }
                else {
                    $scope.OsdesExamMonthYear = [];
                }
                for (var j = 1; j < res.length + 1; j++) {
                    $scope['edit' + j] = true;
                }
            },
                function (error) {
                    alert("data is not loaded");
                    var err = JSON.parse(error);
                });

        }


        $scope.getNrExamMonthYearData = function (Academicyear) {
            if (Academicyear == null || Academicyear == undefined || Academicyear == "") {
                return;

            }

            var getCcicAcademicYearBatch = CcicPreExaminationService.GetExamMonthYears(Academicyear)
            getCcicAcademicYearBatch.then(function (res) {
                try {
                    var res = JSON.parse(res);
                }
                catch (err) { }

                if (res.Table.length > 0) {
                    $scope.NRExamMonthYear = res.Table;
                }
                else {
                    $scope.NRExamMonthYear = [];
                }
                for (var j = 1; j < res.length + 1; j++) {
                    $scope['edit' + j] = true;
                }
            },
                function (error) {
                    alert("data is not loaded");
                    var err = JSON.parse(error);
                });

        }

        $scope.getmarkspostingExamMonthYears = function (ACademicYear) {
            if (ACademicYear == null || ACademicYear == undefined || ACademicYear == "") {
                return;

            }

            var getCcicAcademicYearBatch = CcicPreExaminationService.GetExamMonthYears(ACademicYear)
            getCcicAcademicYearBatch.then(function (res) {
                try {
                    var res = JSON.parse(res);
                }
                catch (err) { }

                if (res.Table.length > 0) {
                    $scope.markspostingExamMonthYear = res.Table;
                }
                else {
                    $scope.markspostingExamMonthYear = [];
                }
                for (var j = 1; j < res.length + 1; j++) {
                    $scope['edit' + j] = true;
                }
            },
                function (error) {
                    alert("data is not loaded");
                    var err = JSON.parse(error);
                });

        }


        $scope.getWantingExamMonthYearData = function (ACademicyear) {
            if (ACademicyear == null || ACademicyear == undefined || ACademicyear == "") {
                return;

            }

            var getCcicAcademicYearBatch = CcicPreExaminationService.GetExamMonthYears(ACademicyear)
            getCcicAcademicYearBatch.then(function (res) {
                try {
                    var res = JSON.parse(res);
                }
                catch (err) { }

                if (res.Table.length > 0) {
                    $scope.WantingExamMonthYear = res.Table;
                }
                else {
                    $scope.WantingExamMonthYear = [];
                }
                for (var j = 1; j < res.length + 1; j++) {
                    $scope['edit' + j] = true;
                }
            },
                function (error) {
                    alert("data is not loaded");
                    var err = JSON.parse(error);
                });

        }


        $scope.getUploadWantingsExamMonthYearData = function (ACADemicYear) {
            if (ACADemicYear == null || ACADemicYear == undefined || ACADemicYear == "") {
                return;

            }

            var getCcicAcademicYearBatch = CcicPreExaminationService.GetExamMonthYears(ACADemicYear)
            getCcicAcademicYearBatch.then(function (res) {
                try {
                    var res = JSON.parse(res);
                }
                catch (err) { }

                if (res.Table.length > 0) {
                    $scope.UploadWantExamMonthYear = res.Table;
                }
                else {
                    $scope.UploadWantExamMonthYear = [];
                }
                for (var j = 1; j < res.length + 1; j++) {
                    $scope['edit' + j] = true;
                }
            },
                function (error) {
                    alert("data is not loaded");
                    var err = JSON.parse(error);
                });

        }

        $scope.getResultGenMonthYearData = function (ACADEmicYear) {
            if (ACADEmicYear == null || ACADEmicYear == undefined || ACADEmicYear == "") {
                return;

            }

            var getCcicAcademicYearBatch = CcicPreExaminationService.GetExamMonthYears(ACADEmicYear)
            getCcicAcademicYearBatch.then(function (res) {
                try {
                    var res = JSON.parse(res);
                }
                catch (err) { }

                if (res.Table.length > 0) {
                    $scope.ResultGenExamMonthYear = res.Table;
                }
                else {
                    $scope.ResultGenExamMonthYear = [];
                }
                for (var j = 1; j < res.length + 1; j++) {
                    $scope['edit' + j] = true;
                }
            },
                function (error) {
                    alert("data is not loaded");
                    var err = JSON.parse(error);
                });

        }


        $scope.getResultDeployMonthYearData = function (ACADEMicYear) {
            if (ACADEMicYear == null || ACADEMicYear == undefined || ACADEMicYear == "") {
                return;

            }

            var getCcicAcademicYearBatch = CcicPreExaminationService.GetExamMonthYears(ACADEMicYear)
            getCcicAcademicYearBatch.then(function (res) {
                try {
                    var res = JSON.parse(res);
                }
                catch (err) { }

                if (res.Table.length > 0) {
                    $scope.ResultsDeployExamMonthYear = res.Table;
                }
                else {
                    $scope.ResultsDeployExamMonthYear = [];
                }
                for (var j = 1; j < res.length + 1; j++) {
                    $scope['edit' + j] = true;
                }
            },
                function (error) {
                    alert("data is not loaded");
                    var err = JSON.parse(error);
                });

        }

        $scope.gETEXAMMOnthYearData = function (AcadeMICYear) {
            if (AcadeMICYear == null || AcadeMICYear == undefined || AcadeMICYear == "") {
                return;

            }

            var getCcicAcademicYearBatch = CcicPreExaminationService.GetExamMonthYears(AcadeMICYear)
            getCcicAcademicYearBatch.then(function (res) {
                try {
                    var res = JSON.parse(res);
                }
                catch (err) { }

                if (res.Table.length > 0) {
                    $scope.GetDeployExamMonthYear = res.Table;
                }
                else {
                    $scope.GetDeployExamMonthYear = [];
                }
                for (var j = 1; j < res.length + 1; j++) {
                    $scope['edit' + j] = true;
                }
            },
                function (error) {
                    alert("data is not loaded");
                    var err = JSON.parse(error);
                });

        }


        // ************************ Drag and drop ***************** //
        let dropArea = document.getElementById("drop-area")

            // Prevent default drag behaviors
            ;['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
                dropArea.addEventListener(eventName, preventDefaults, false)
                document.body.addEventListener(eventName, preventDefaults, false)
            })

            // Highlight drop area when item is dragged over it
            ;['dragenter', 'dragover'].forEach(eventName => {
                dropArea.addEventListener(eventName, highlight, false)
            })

            ;['dragleave', 'drop'].forEach(eventName => {
                dropArea.addEventListener(eventName, unhighlight, false)
            })

        // Handle dropped files
        dropArea.addEventListener('drop', handleDrop, false)

        function preventDefaults(e) {
            e.preventDefault()
            e.stopPropagation()
        }

        function highlight(e) {
            dropArea.classList.add('highlight')
        }

        function unhighlight(e) {
            dropArea.classList.remove('active')
        }

        function handleDrop(e) {
            var dt = e.dataTransfer
            var files = dt.files

            handleFiles(files)
        }

        let uploadProgress = []
        let progressBar = document.getElementById('progress-bar')

        function initializeProgress(numFiles) {
            progressBar.value = 0
            uploadProgress = []

            for (let i = numFiles; i > 0; i--) {
                uploadProgress.push(0)
            }
        }

        function updateProgress(fileNumber, percent) {
            uploadProgress[fileNumber] = percent
            let total = uploadProgress.reduce((tot, curr) => tot + curr, 0) / uploadProgress.length
            console.debug('update', fileNumber, percent, total)
            progressBar.value = total
        }

        function handleFiles(files) {
            files = [...files]
            initializeProgress(files.length)
            files.forEach(uploadFile)
            files.forEach(previewFile)
        }

        function previewFile(file) {
            let reader = new FileReader()
            reader.readAsDataURL(file)
            reader.onloadend = function () {
                let img = document.createElement('img')
                img.src = reader.result
                document.getElementById('gallery').appendChild(img)
            }
        }


        $scope.SampleData = [{
            "sbtet_code": "",
            "sbtet_branch_code": "",
            "Candidatename": "",
            "FatherName": "",
            "MotherName": "",
            "sex": "",
            "dob_date": "",
            "e_mail": "",
            "StudentContact": "",
            "SCHEME": "",
            "ActiveFlag": "",
            "AcademicYearId": "",
            "CategoryId": "",
            "TenthRollNo": "",
            "StudentRecided": "",
            "PolycetHallTicketNo": "",
            "ReligionId": "",
            "Region": "",
            "MinorityType": "",
            "PermanentAddress": "",
            "TempararyAddress": "",
            "HouseNo": "",
            "VillageorTown": "",
            "District": "",
            "Mandal": "",
            "IsPhysicallyHandicaped": "",
            "FatherAadhaarNo": "",
            "MotherAadhaarNo": "",
            "IsFatherGorthEmp": "",
            "Income": "",
            "IncomeStatusValidity": "",
            "IncomeCategory": "",
            "Occupation": "",
            "CasteNo": "",
            "CasteCertificateValidity": "",
            "Bank": "",
            "BankAccountNo": "",
            "IfscCode": "",
            "BankBranch": "",
            "mandal": "",
            "district": "",
        }]

        function uploadFile(file, i) {
            var url = 'https://api.cloudinary.com/v1_1/joezimim007/image/upload'
            var xhr = new XMLHttpRequest()
            var formData = new FormData()
            xhr.open('POST', url, true)
            xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest')

            // Update progress (can be used to show progress indicator)
            xhr.upload.addEventListener("progress", function (e) {
                updateProgress(i, (e.loaded * 100.0 / e.total) || 100)
            })

            xhr.addEventListener('readystatechange', function (e) {
                if (xhr.readyState == 4 && xhr.status == 200) {
                    updateProgress(i, 100) // <- Add this
                }
                else if (xhr.readyState == 4 && xhr.status != 200) {
                    // Error. Inform the user
                }
            })

            formData.append('upload_preset', 'ujpu6gyk')
            formData.append('file', file)
            xhr.send(formData)
        }

        $scope.FileContains = false;
        $scope.FileContains1 = false;
        $scope.$watch('newFile', function (newFileObj) {
            if (newFileObj) {
                $scope.filename = newFileObj.name;
                $scope.FileContains = true;
                $scope.FileContains1 = true;
            }
        });

        $scope.uploadFile = function () {
            var fileInput = $document[0].getElementById('File');
            $scope.file = fileInput.files[0];
            $scope.filename = $scope.file.name;
            $scope.FileContains = true;
            //$scope.FileContains1 = true;
            document.getElementById("myCheck").click();
        }


        $scope.uploadFile1 = function () {
            var fileInput = $document[0].getElementById('File1');
            $scope.file1 = fileInput.files[0];
            $scope.filename1 = $scope.file1.name;
            //$scope.FileContains = true;
            $scope.FileContains1 = true;
            document.getElementById("myCheck1").click();
        }
        $scope.$watch('myFile1', function (newFileObj) {
            if (newFileObj) {
                $scope.filename = newFileObj.name;
                $scope.FileContains = true;
                $scope.FileContains1 = true;
            }
        });

        function uploadFile(file1, i) {
            var url = 'https://api.cloudinary.com/v1_1/joezimim007/image/upload'
            var xhr = new XMLHttpRequest()
            var formData = new FormData()
            xhr.open('POST', url, true)
            xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest')

            // Update progress (can be used to show progress indicator)
            xhr.upload.addEventListener("progress", function (e) {
                updateProgress(i, (e.loaded * 100.0 / e.total) || 100)
            })

            xhr.addEventListener('readystatechange', function (e) {
                if (xhr.readyState == 4 && xhr.status == 200) {
                    updateProgress(i, 100) // <- Add this
                }
                else if (xhr.readyState == 4 && xhr.status != 200) {
                    // Error. Inform the user
                }
            })

            formData.append('upload_preset', 'ujpu6gyk')
            formData.append('file1', file1)
            xhr.send(formData)
        }


        $scope.tabledata = [];
        $scope.tabledata1 = [];
        // reading excel data
        $scope.Exceldata = [];
        $scope.Exceldata1 = [];





        $scope.openExcel = function () {
            $scope.reload = true;
            if ($scope.file != '') {
                $scope.reload = true;

                $scope.tabledata = []
                $scope.Exceldat = [];
                $scope.Exceldata = [];
                var reader = new FileReader();
                reader.readAsBinaryString($scope.file);
                reader.onload = function (e) {
                    var data = e.target.result;
                    var workbook = XLSX.read(data, {
                        type: 'binary',
                    });
                    workbook.SheetNames.forEach(function (sheetName) {
                        // Here is your object
                        var obj2 = []
                        $scope.XL_row_object = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);
                        var json_object = JSON.stringify($scope.XL_row_object);
                        $scope.JsonObj = JSON.parse(json_object)


                        $scope.reload = false
                    });

                    if ($scope.XL_row_object.length > 0) {

                        var data = {};
                        $scope.Exceldata.push($scope.XL_row_object);

                        $scope.Exceldat = $scope.Exceldata[0]

                        var tempArray = ["examcent", "ExamcentName", "scheme", "Branchcode", "Subcode", "subname", "pcode", "semester", "pinno", "SName", "ATTSTATUS", "first_eval_marks", "first_CE_marks", "Final_marks", "MAXMARKS", "MP_Punishment_proposed_COE", "barcode", "evaluatorid", "evaluator_name", "evaluator_college", "evaluator_phone", "chiefexaminerid", "ChiefExaminer_name", "ChiefExaminer_college", "ChiefExaminer_phone"];
                        var keysMached = false;
                        for (let q = 0; q < Object.keys($scope.Exceldat[0]).length; q++) {
                            if (tempArray.includes(Object.keys($scope.Exceldat[0])[q])) {
                                console.log("All Keys Matched");

                                keysMached = true;
                            } else {
                                console.log(Object.keys($scope.Exceldat[0])[q])
                                alert(Object.keys($scope.Exceldat[0])[q] + " Column Name Not Matched to the Required Excel");
                                $scope.tabledata = []
                                $scope.Exceldat = [];
                                $scope.Exceldata = [];
                                keysMached = false;
                                $scope.reload = false;
                                break;
                                return;
                            }
                        };
                        if (keysMached == true) {
                            $scope.tabledata.push({ rows: $scope.XL_row_object, cols: Object.keys($scope.XL_row_object[0]) });
                            if ($scope.tabledata.length > 0) {
                                $scope.ShowTableData = true;
                                //$scope.reload = false
                            } else {

                                $scope.tabledata = []
                                $scope.Exceldat = [];
                                $scope.Exceldata = [];
                                $scope.ShowTableData = false;
                                $scope.reload = false
                            }
                        } else {
                            $scope.reload = false
                            $scope.tabledata = []
                            $scope.Exceldat = [];
                            $scope.Exceldata = [];
                            $scope.ShowTableData = false;
                        }
                        document.getElementById("myCheck").click();

                    } else {
                        $scope.tabledata = []
                        $scope.Exceldat = [];
                        $scope.Exceldata = [];
                        $scope.reload = false
                        document.getElementById("myCheck").click();
                    }

                    $scope.reload = false

                };

                reader.onerror = function (ex) {
                    $scope.tabledata = []
                    $scope.Exceldat = [];
                    $scope.Exceldata = [];
                    $scope.reload = false
                    console.log(ex);
                    $scope.reload = false
                };

            } else {
                alert('Please Upload Excel file');
                $scope.tabledata = []
                $scope.Exceldat = [];
                $scope.Exceldata = [];
                $scope.reload = false
                $scope.reload = false
                return;
            }


        }



        $scope.openExcel1 = function () {
            $scope.reload1 = true;
            if ($scope.file1 != '') {
                $scope.reload1 = true;
                $scope.tabledata1 = []
                $scope.Exceldat1 = [];
                $scope.Exceldata1 = [];
                var reader = new FileReader();
                reader.readAsBinaryString($scope.file1);
                reader.onload = function (e) {
                    var data = e.target.result;
                    var workbook = XLSX.read(data, {
                        type: 'binary',


                    });

                    workbook.SheetNames.forEach(function (sheetName) {
                        // Here is your object
                        var obj2 = []
                        $scope.XL_row_object = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);
                        var json_object = JSON.stringify($scope.XL_row_object);
                        $scope.JsonObj = JSON.parse(json_object)

                        if ($scope.XL_row_object.length > 0) {

                            var data = {};
                            $scope.Exceldata1.push($scope.XL_row_object);

                            $scope.Exceldat1 = $scope.Exceldata1[0]

                            var tempArray1 = ["examcent", "ExamcentName", "scheme", "Branchcode", "Subcode", "subname", "pcode", "semester", "pinno", "SName", "ATTSTATUS", "first_eval_marks", "first_CE_marks", "Final_marks", "MAXMARKS", "MP_Punishment_proposed_COE", "barcode", "evaluatorid", "evaluator_name", "evaluator_college", "evaluator_phone", "chiefexaminerid", "ChiefExaminer_name", "ChiefExaminer_college", "ChiefExaminer_phone"];
                            var keysMached1 = false;
                            for (let q = 0; q < Object.keys($scope.Exceldat1[0]).length; q++) {
                                if (tempArray1.includes(Object.keys($scope.Exceldat1[0])[q])) {
                                    console.log("All Keys Matched");

                                    keysMached1 = true;
                                } else {
                                    alert(Object.keys($scope.Exceldat1[0])[q] + " Column Names Not Matched");
                                    $scope.tabledata1 = []
                                    $scope.Exceldat1 = [];
                                    $scope.Exceldata1 = [];
                                    keysMached1 = false;
                                    $scope.reload1 = false;
                                    break;
                                    return;
                                }
                            };
                            if (keysMached1 == true) {
                                $scope.tabledata1.push({ rows: $scope.XL_row_object, cols: Object.keys($scope.XL_row_object[0]) });
                                if ($scope.tabledata1.length > 0) {
                                    $scope.ShowTableData1 = true;
                                    //$scope.reload1 = false
                                } else {
                                    $scope.Exceldat1 = [];
                                    $scope.tabledata1 = []
                                    $scope.Exceldata1 = [];
                                    $scope.ShowTableData1 = false;
                                    $scope.reload1 = false
                                }
                            } else {
                                $scope.Exceldat1 = [];
                                $scope.reload1 = false
                                $scope.tabledata1 = []
                                $scope.Exceldata1 = [];
                                $scope.ShowTableData1 = false;
                            }
                            $scope.reload1 = false
                            document.getElementById("myCheck1").click();

                        } else {
                            $scope.reload1 = false
                            document.getElementById("myCheck1").click();
                        }


                    });



                };
                //$scope.reload1 = false
                reader.onerror = function (ex) {
                    console.log(ex);
                };
                //$scope.reload1 = false
                // $scope.init();
            } else {
                alert('Please Upload Excel file');
                $scope.tabledata = []
                $scope.Exceldat = [];
                $scope.Exceldata = [];
                $scope.reload1 = false
                $scope.reload1 = false
                return;
            }

        }


        //$scope.monthyear, $scope.SelStudentType, $scope.Scheme, $scope.ExamTypeId, $scope.userName
        $scope.GenerateNr = function () {

            $scope.reload = true;

            var loadData1 = CcicPreExaminationService.GenerateNrData($scope.Academicyear, $scope.Monthyear, $scope.UserName)
            loadData1.then(function (res) {
                var data = JSON.parse(res)
                if (data[0].ResponceCode == '200') {
                    $scope.Result = true;
                    var location = data[0].file;
                    window.location.href = location;
                    $scope.reload = false;
                } else
                    if (data[0].ResponceCode == '400') {
                        $scope.reload = false;
                        alert(data[0].ResponceDescription);
                    }
                    else {
                        $scope.reload = false;
                        alert('Something Went Wrong')
                    }

            }, function (error) {
                $scope.reload = false;
                $scope.gentmetbl = false;
                $scope.ResultNotFound = true;
                $scope.Result = false;
                $scope.LoadImg = false;
            });
        }

        $scope.showCustomAlert = function (message) {
            $scope.alertMessage = message;
            $scope.showAlert = true;

            return new Promise((resolve, reject) => {
                $scope.confirmYes = function () {
                    $scope.showAlert = false;
                    resolve(true);
                    $scope.resultsDeployTables();

                };

                $scope.confirmNo = function () {
                    $scope.showAlert = false;
                    resolve(false);
                };
            });
        };

        $scope.triggerAlert = function () {

            if ($scope.AcadeMICYear == undefined || $scope.AcadeMICYear == null || $scope.AcadeMICYear == "") {
                alert("Select Academic Year ");
                return false;
            }

            if ($scope.MONthYEar == undefined || $scope.MONthYEar == null || $scope.MONthYEar == "") {
                alert("Select Exam Month Year");
                return false;
            }
            $scope.showCustomAlert("Are you sure you want to Deploy Results?").then(function (result) {
                if (result) {
                    console.log("User clicked Yes");
                } else {
                    console.log("User clicked No");
                }
            });
        };
        $scope.resultsDeployTables = function () {
            $scope.reload = true;
            $scope.showAlert = false;
            $scope.alertMessage = "Are you sure you want to proceed?";
            var loadData1 = CcicStudentResultService.ResultsDeployTables($scope.AcadeMICYear, $scope.MONthYEar, $scope.UserName)
            loadData1.then(function (res) {
                //console.log(res)
                var data = JSON.parse(res)
                if (data.Table[0].ResponseCode == '200') {
                    $scope.reload = false;
                    $scope.SuccessStatus = true;
                    $scope.FailStatus = false;
                    $scope.StatusMessage = data.Table[0].ResponseDescription;
                    setTimeout(function () {
                        $scope.StatusMessage = '';
                    }, 1000);

                    alert(data.Table[0].ResponseDescription)
                } else if (data.Table[0].ResponseCode == '400') {
                    $scope.reload = false;
                    $scope.SuccessStatus = false;
                    $scope.FailStatus = true;
                    $scope.StatusMessage = data.Table[0].ResponseDescription;
                    alert(data.Table[0].ResponseDescription)
                }
                else {
                    $scope.reload = false;
                    //$('#upldfile').val(null);
                    $scope.ResultNotFound = true;
                    $scope.SuccessStatus = false;
                    $scope.FailStatus = false;
                    alert('Something Went Wrong')
                }
            }, function (error) {
                $scope.reload = false;
                alert('Something Went Wrong')
                $scope.gentmetbl = false;
                $scope.Result = false;
                $scope.ResultNotFound = true;
                $scope.SuccessStatus = false;
                $scope.FailStatus = false;
                $scope.LoadImg = false;
            });
        }


        $scope.ResultsProcessing = function () {
            $scope.reload = true;
            var loadData1 = CcicPreExaminationService.ResultsProcessing($scope.ACADEmicYear, $scope.MONTHyear, $scope.UserName)
            loadData1.then(function (res) {
                var data = JSON.parse(res)
                if (data[0].ResponceCode == '200') {
                    $scope.Result = true;
                    var location = data[0].file;
                    window.open(location, '_blank')
                    // window.location.href = location;
                    $scope.reload = false;
                } else
                    if (data[0].ResponceCode == '400') {
                        $scope.reload = false;
                        alert(data[0].ResponceDescription);
                    }
                    else {
                        $scope.reload = false;
                        alert('Something Went Wrong')
                    }
            }, function (error) {
                $scope.reload = false;
                $scope.gentmetbl = false;
                $scope.ResultNotFound = true;
                $scope.Result = false;
                $scope.LoadImg = false;
            });
        }


        $scope.ResultsLogicReports = function () {
            $scope.reload = true;
            var loadData1 = PreExaminationService.ResultsLogicReports($scope.ACADEMicYear, $scope.MONTHYear, $scope.UserName)
            loadData1.then(function (res) {
                var data = JSON.parse(res)
                if (data[0].ResponceCode == '200') {
                    $scope.Result = true;
                    var location = data[0].file;
                    window.location.href = location;
                    $scope.reload = false;
                } else
                    if (data[0].ResponceCode == '400') {
                        $scope.reload = false;
                        alert(data[0].ResponceDescription);
                    }
                    else {
                        $scope.reload = false;
                        alert('Something Went Wrong')
                    }
            }, function (error) {
                $scope.reload = false;
                $scope.gentmetbl = false;
                $scope.ResultNotFound = true;
                $scope.Result = false;
                $scope.LoadImg = false;
            });
        }

        $scope.loadSemExamTypes = function (Scheme) {
            //var res = JSON.parse(data)

            //$scope.Schemeid = res.schemeid
            //if (dataType == 1) {
            //    $scope.Scheme1 = res.scheme
            //} else if (dataType == 2) {
            //    $scope.NrScheme1 = res.scheme
            //} else if (dataType == 3) {
            //    $scope.PostScheme = res.scheme

            //} else if (dataType == 4) {
            //    $scope.Wantingsscheme1 = res.scheme
            //} else if (dataType == 5) {
            //    $scope.UploadScheme1 = res.scheme

            //} else if (dataType == 6) {
            //    $scope.Resultsscheme1 = res.scheme
            //} else if (dataType == 7) {
            //    $scope.Logicscheme1 = res.scheme
            //} else if (dataType == 8) {
            //    $scope.Deployscheme1 = res.scheme
            //}
            var getExamType = PreExaminationService.getActiveExamTypesByScheme(Scheme);
            getExamType.then(function (response) {
                var response = JSON.parse(response);
                if (response.Table.length > 0) {
                    $scope.getExamTypes = response.Table;
                } else {
                    $scope.StudentType = [];
                    alert("No Student found on this Record");
                }
            },
                function (error) {
                    alert("error while loading Exam Month Years");
                    console.log(error);
                });

        }

        $scope.GenerateWantings = function () {
            $scope.reload1 = true;
            var loadData1 = CcicPreExaminationService.GenerateWantings($scope.ACAdemicyear, $scope.MONthyear, $scope.UserName)
            loadData1.then(function (res) {
                var data = JSON.parse(res)
                if (data[0].ResponceCode == '200') {
                    $scope.Result = true;
                    var location = data[0].file;
                    window.location.href = location;
                    $scope.reload1 = false;
                } else
                    if (data[0].ResponceCode == '400') {
                        $scope.reload1 = false;
                        alert(data[0].ResponceDescription);
                    }
                    else {
                        $scope.reload1 = false;
                        alert('Something Went Wrong')
                    }
            }, function (error) {
                $scope.reload1 = false;
                $scope.gentmetbl = false;
                $scope.ResultNotFound = true;
                $scope.Result = false;
                $scope.LoadImg = false;
            });
        }

        $scope.PostMarks = function () {
            $scope.reload = true;
            $scope.ResultNotFound = false;
            $scope.SuccessStatus = false;
            $scope.FailStatus = false;

            var loadData1 = CcicPreExaminationService.PostMarks($scope.ACademicYear, $scope.MOnthyear, $scope.UserName)
            loadData1.then(function (data) {
                var data = JSON.parse(data)
                if (data.Table[0].ResponceCode == '200') {
                    $scope.reload = false;
                    alert(data.Table[0].ResponceDescription)
                    $scope.ResultNotFound = false;
                    $scope.SuccessStatus = true;
                    $scope.FailStatus = false;
                    $scope.StatusMessage = data.Table[0].ResponceDescription;
                    setTimeout(function () {
                        $scope.StatusMessage = '';

                    }, 1000);

                } else if (data.Table[0].ResponceCode == '400') {
                    $scope.reload = false;
                    alert(data.Table[0].ResponceDescription)
                    $scope.SuccessStatus = false;
                    $scope.FailStatus = true;
                    $scope.ResultNotFound = false;
                    $scope.StatusMessage = data.Table[0].ResponceDescription;
                } else {
                    $scope.reload = false;
                    $scope.ResultNotFound = true;
                    $scope.SuccessStatus = false;
                    $scope.FailStatus = false;
                    alert("Something Went Wrong.");
                }
                $scope.LoadImg = false;
            }, function (error) {
                $scope.reload = false;
                $scope.ResultNotFound = true;
                $scope.SuccessStatus = false;
                $scope.FailStatus = false;
                alert("Something Went Wrong.");
                $scope.Result = false;
                $scope.LoadImg = false;
            });
        }


        $scope.ConsolidatedPreviewScheme = 'C18'
        //{
        //    schemeid: 5,
        //    scheme: 'C18'
        //}
        $scope.GetConsolidatedPreview = function () {

            //if ($scope.SelStudentType == "" || $scope.SelStudentType == undefined || $scope.SelStudentType == null) {
            //    alert("select student type.");
            //    return;
            //}
            //if ($scope.ConsolidatedPreviewScheme == "" || $scope.ConsolidatedPreviewScheme == undefined || $scope.ConsolidatedPreviewScheme == null) {
            //    alert("select Scheme.");
            //    return;
            //}

            //if ($scope.Pin == "" || $scope.Pin == undefined || $scope.Pin == null) {
            //    alert("Enter Pin");
            //    return;
            //}


            $scope.showPreviewResultData = 0
            $scope.PreviewLoadImg = true;
            $scope.PreviewResultNotFound = false;
            $scope.PreviewResultFound = false;
            if ($scope.ConsolidatedPreviewScheme == 'C18' || $scope.ConsolidatedPreviewScheme == 'C21') {

                var resultdata = StudentResultService.GetConsolidatedPreviewResults($scope.SelStudentType, $scope.ConsolidatedPreviewScheme, $scope.Pin);
                resultdata.then(function (data) {
                    $scope.co9Data = false;
                    var data = JSON.parse(data)

                    if (data.Table.length > 0) {
                        if (data.Table2.length > 0) {
                            $scope.showPreviewResultData = 1;
                            $scope.PreviewLoadImg = false;
                            $scope.PreviewResultFound = true;
                            $scope.PreviewResultNotFound = false;
                            $scope.studentInfo = data.Table[0];
                            var resultData = [];
                            resultData = data.Table2;
                            $scope.TotalData = data.Table1[0];

                            $scope.totalearnedCourseCredits = data.Table1[0].CgpaTotalGained;
                            $scope.CreditsGained = parseFloat(data.Table1[0].CreditsGained) + 2.5 * data.Table3.length;
                            $scope.CgpaTotalCredits = parseFloat(data.Table1[0].CgpaTotalCredits) + 2.5 * data.Table3.length;

                            $scope.newresultDisplayInfo = [];

                            var SemesterList = [];
                            var sems = []
                            for (var i = 0; i < data.Table3.length; i++) {


                                if (!SemesterList.includes(data.Table3[i].SemId)) {
                                    SemesterList.push(data.Table3[i].SemId);
                                    var temp = {};
                                    temp.Subjects = [];
                                    var temcount = [];
                                    temp.Sgpainfo = [];
                                    temp.courseinfo = [];
                                    temp.semtotalinfo = [];
                                    temp.Semester = data.Table3[i].Semester;

                                    temp.SemId = data.Table3[i].SemId;
                                    var temp1 = {
                                        TotalGradePoints: data.Table3[i].TotalGradePoints,
                                        SGPA: data.Table3[i].SGPA,
                                        Credits: data.Table3[i].Credits
                                    }

                                    temp.Sgpainfo.push(temp1);
                                    var courseTotalGradePoints = 0;
                                    if (temp.SemId == 6) {
                                        var courseCerditsGained = 0;
                                    } else {
                                        var courseCerditsGained = 2.5;
                                    }

                                    var courseMaxcerdits = "";
                                    for (var j = 0; j < resultData.length; j++) {
                                        if (resultData[j].SemId == temp.SemId) {
                                            temp.Subjects.push(resultData[j]);
                                            courseTotalGradePoints += parseFloat(resultData[j].TotalGradePoints);
                                            courseCerditsGained += resultData[j].CreditsGained;

                                        }

                                    }

                                    if (temp.SemId == 6) {
                                        var temp2 = {
                                            courseTotalGradePoints: courseTotalGradePoints,
                                            courseCerditsGained: courseCerditsGained,
                                            courseMaxCerdits: data.Table3[i].Credits,
                                        }

                                    } else {
                                        var temp2 = {
                                            courseTotalGradePoints: courseTotalGradePoints,
                                            courseCerditsGained: courseCerditsGained,
                                            courseMaxCerdits: data.Table3[i].Credits + 2.5,
                                        }

                                    }

                                    sems.push(temp2);
                                    temp.courseinfo.push(temp2);

                                    if (!temcount.includes(temp.SemId)) {
                                        if (temp.SemId != '6') {
                                            temcount.push(temp.SemId);
                                            var tempobj = {
                                                Subject_Code: "",
                                                SubjectName: "Rubrics",
                                                MaxCredits: "2.5",
                                                Mid1Marks: "-",
                                                Mid2Marks: "-",
                                                InternalMarks: "-",
                                                EndExamMarks: "-",
                                                SubjectTotal: "-",
                                                HybridGrade: "-",
                                                GradePoint: "-",
                                                CreditsGained: "2.5",
                                                TotalGradePoints: "-",
                                                WholeOrSupply: "W",
                                                ExamMonthYear: "",
                                                ExamStatus: "P"
                                            };


                                            temp.Subjects.push(tempobj);
                                        }
                                    }
                                    $scope.newresultDisplayInfo.push(temp);
                                }
                            }

                            var courseTotalGradePoints = 0
                            var courseCerditsGained = 0
                            var courseMaxCerdits = 0
                            for (var j = 0; j < sems.length; j++) {
                                courseTotalGradePoints += parseFloat(sems[j].courseTotalGradePoints);
                                courseCerditsGained += sems[j].courseCerditsGained;
                                courseMaxCerdits += sems[j].courseMaxCerdits;
                                $scope.courseTotalGradePoints = courseTotalGradePoints
                                $scope.courseCerditsGained = courseCerditsGained
                                $scope.courseMaxCerdits = courseMaxCerdits

                            }

                        }
                        else {
                            $scope.co9Data = false;
                            $scope.PreviewResultFound = false;
                            $scope.PreviewResultNotFound = true;
                            $scope.PreviewLoadImg = false;
                        }
                    }
                    else {
                        alert('No Data Found')
                        $scope.co9Data = false;
                        $scope.PreviewResultFound = false;
                        $scope.PreviewResultNotFound = true;
                        $scope.PreviewLoadImg = false;
                    }
                }, function (error) {
                    $scope.co9Data = false;
                    $scope.PreviewResultFound = false;
                    $scope.ResultNotFound = true;
                    $scope.PreviewLoadImg = false;

                });
            }
            else if ($scope.ConsolidatedPreviewScheme == 'C09' || $scope.ConsolidatedPreviewScheme == 'C16' || $scope.ConsolidatedPreviewScheme == 'C16S' || $scope.ConsolidatedPreviewScheme == 'C14' || $scope.ConsolidatedPreviewScheme == 'C08' || $scope.ConsolidatedPreviewScheme == 'C05') {
                var resultdata = StudentResultService.GetConsolidatedPreviewResults($scope.SelStudentType, $scope.ConsolidatedPreviewScheme, $scope.Pin);
                resultdata.then(function (data) {
                    $scope.co9Data = true;
                    var data = JSON.parse(data)
                    $scope.ConCaptcha = "";
                    console.log(data)
                    if (data.Table.length > 0) {
                        $scope.PreviewResultFound = true;
                        if (data.Table[0].ResponceCode == '400') {
                            $scope.co9Data = false;
                            $scope.ResultFound = false;
                            $scope.ResultNotFound = true;
                            $scope.LoadImg = false;
                        }
                        if (data.Table1.length > 0) {
                            data.Table1.forEach(function (item, i) {
                                if (item.SemId == "9") {
                                    data.Table1.splice(i, 1);
                                    data.Table1.unshift(item);
                                }
                            });

                        }

                        if (data.Table.length > 0) {
                            $scope.showData = 1;
                            $scope.LoadImg = false;
                            $scope.ResultFound = true;
                            $scope.ResultNotFound = false;
                            $scope.studentInfo = data.Table[0];
                            var resultData = [];
                            resultData = data.Table;
                            $scope.TotalData = data.Table[0];

                            $scope.totalearnedCourseCredits = data.Table[0].CgpaTotalGained;
                            $scope.CreditsGained = parseFloat(data.Table[0].CreditsGained) + 2.5 * data.Table1.length;
                            $scope.CgpaTotalCredits = parseFloat(data.Table[0].CgpaTotalCredits) + 2.5 * data.Table1.length;
                            $scope.newresultDisplayInfo1 = [];

                            var SemesterList = [];

                            for (var i = 0; i < data.Table1.length; i++) {
                                if (!SemesterList.includes(data.Table1[i].SemId)) {
                                    SemesterList.push(data.Table1[i].SemId);
                                    var temp = {};
                                    temp.Subjects = [];
                                    var temcount = [];
                                    temp.Sgpainfo = [];
                                    temp.courseinfo = [];
                                    temp.semtotalinfo = [];
                                    temp.Semester = data.Table1[i].Semester;
                                    temp.i = data.Table[i].i;
                                    temp.e = data.Table[i].e;
                                    temp.st1 = data.Table[i].st1;
                                    temp.remarks = data.Table[i].remarks;
                                    temp.TotalMarks = data.Table[i].TotalMarks;
                                    temp.Result = data.Table1[i].Result;

                                    temp.SemId = data.Table1[i].SemId;
                                    var temp1 = {
                                        TotalGradePoints: data.Table1[i].TotalGradePoints,
                                        SGPA: data.Table1[i].SGPA,
                                        Credits: data.Table1[i].Credits
                                    }

                                    temp.Sgpainfo.push(temp1);
                                    var courseTotalGradePoints = 0;
                                    var courseCerditsGained = 2.5;
                                    var courseMaxcerdits = "";
                                    for (var j = 0; j < resultData.length; j++) {
                                        if (resultData[j].SemId == temp.SemId) {
                                            temp.Subjects.push(resultData[j]);
                                            courseTotalGradePoints += parseFloat(resultData[j].TotalGradePoints);
                                            courseCerditsGained += resultData[j].CreditsGained;

                                        }
                                    }
                                    var temp2 = {
                                        courseTotalGradePoints: courseTotalGradePoints,
                                        courseCerditsGained: courseCerditsGained,
                                        courseMaxCerdits: data.Table[i].Credits + 2.5
                                    }
                                    temp.courseinfo.push(temp2);


                                }
                                $scope.newresultDisplayInfo1.push(temp);
                                console.log($scope.newresultDisplayInfo1);
                            }

                        }
                        else {
                            $scope.co9Data = false;
                            $scope.ResultFound = false;
                            $scope.ResultNotFound = true;
                            $scope.LoadImg = false;
                        }
                    }
                    else {
                        alert('No Data Found')
                        $scope.co9Data = false;
                        $scope.ResultFound = false;
                        $scope.ResultNotFound = true;
                        $scope.LoadImg = false;
                    }

                }, function (error) {
                    $scope.co9Data = false;
                    $scope.ResultFound = false;
                    $scope.ResultNotFound = true;
                    $scope.LoadImg = false;

                });

            } else if ($scope.ConsolidatedPreviewScheme == 'C05' || $scope.ConsolidatedPreviewScheme == 'C08' || $scope.ConsolidatedPreviewScheme == 'C16'
                || $scope.ConsolidatedPreviewScheme == 'C16S' || $scope.ConsolidatedPreviewScheme == 'C14' || $scope.ConsolidatedPreviewScheme == 'ER91') {
                var resultdata = StudentResultService.GetConsolidatedPreviewResults($scope.SelStudentType, $scope.ConsolidatedPreviewScheme, $scope.Pin);
                resultdata.then(function (data) {
                    $scope.co9Data = true;
                    var data = JSON.parse(data)
                    $scope.ConCaptcha = "";

                    if (data.Table.length > 0) {
                        $scope.PreviewResultFound = true;
                        if (data.Table[0].ResponceCode == '400') {
                            $scope.co9Data = false;
                            $scope.ResultFound = false;
                            $scope.ResultNotFound = true;
                            $scope.LoadImg = false;
                        }
                        if (data.Table1.length > 0) {
                            data.Table1.forEach(function (item, i) {
                                if (item.SemId == "9") {
                                    data.Table1.splice(i, 1);
                                    data.Table1.unshift(item);
                                }
                            });

                        }

                        if (data.Table1.length > 0) {
                            $scope.showData = 1;
                            $scope.LoadImg = false;
                            $scope.ResultFound = true;
                            $scope.ResultNotFound = false;
                            $scope.studentInfo = data.Table[0];
                            var resultData = [];
                            resultData = data.Table;
                            $scope.TotalData = data.Table[0];

                            //$scope.totalearnedCourseCredits = data.Table1[0].CgpaTotalGained;
                            //$scope.CreditsGained = parseFloat(data.Table1[0].CreditsGained) + 2.5 * data.Table3.length;
                            //$scope.CgpaTotalCredits = parseFloat(data.Table1[0].CgpaTotalCredits) + 2.5 * data.Table3.length;
                            $scope.newresultDisplayInfo1 = [];

                            var SemesterList = [];

                            for (var i = 0; i < data.Table1.length; i++) {
                                if (!SemesterList.includes(data.Table1[i].SemId)) {
                                    SemesterList.push(data.Table1[i].SemId);
                                    var temp = {};
                                    temp.Subjects = [];
                                    var temcount = [];
                                    temp.Sgpainfo = [];
                                    temp.courseinfo = [];
                                    temp.semtotalinfo = [];
                                    temp.Semester = data.Table1[i].Semester;
                                    temp.TotalMarks = data.Table1[i].TotalMarks;
                                    temp.Result = data.Table1[i].Result;

                                    temp.SemId = data.Table1[i].SemId;
                                    var temp1 = {
                                        TotalGradePoints: data.Table1[i].TotalGradePoints,
                                        SGPA: data.Table1[i].SGPA,
                                        Credits: data.Table1[i].Credits
                                    }

                                    temp.Sgpainfo.push(temp1);
                                    var courseTotalGradePoints = 0;
                                    var courseCerditsGained = 2.5;
                                    var courseMaxcerdits = "";
                                    for (var j = 0; j < resultData.length; j++) {
                                        if (resultData[j].SemId == temp.SemId) {
                                            temp.Subjects.push(resultData[j]);
                                            courseTotalGradePoints += parseFloat(resultData[j].TotalGradePoints);
                                            courseCerditsGained += resultData[j].CreditsGained;

                                        }
                                    }
                                    var temp2 = {
                                        courseTotalGradePoints: courseTotalGradePoints,
                                        courseCerditsGained: courseCerditsGained,
                                        courseMaxCerdits: data.Table1[i].Credits + 2.5
                                    }
                                    temp.courseinfo.push(temp2);

                                    $scope.newresultDisplayInfo1.push(temp);
                                }
                            }

                        }
                        else {
                            $scope.co9Data = false;
                            $scope.ResultFound = false;
                            $scope.ResultNotFound = true;
                            $scope.LoadImg = false;
                        }
                    }
                    else {
                        alert('No Data Found')
                        $scope.co9Data = false;
                        $scope.ResultFound = false;
                        $scope.ResultNotFound = true;
                        $scope.LoadImg = false;
                    }

                }, function (error) {
                    $scope.co9Data = false;
                    $scope.ResultFound = false;
                    $scope.ResultNotFound = true;
                    $scope.LoadImg = false;

                });
            }

        }


        $scope.PrintPreviewStudentResult = function () {

            var divName = "idtoDivPreviewPrintAdmin";
            var divToPrint = document.getElementById(divName);
            var temp = document.body.innerHTML;
            $("#studentresult1").hide();
            var domClone = divToPrint.cloneNode(true);
            var $printSection = document.getElementById("printSection");
            //document.body.innerHTML = "";
            if (!$printSection) {
                var $printSection = document.createElement("div");
                $printSection.id = "printSection";
                document.body.appendChild($printSection);
            }
            $printSection.innerHTML = "";
            $printSection.appendChild(domClone);
            // alert($printSection.innerHTML);
            window.print();
            document.body.removeChild($printSection);
            $("#studentresult1").show();
        };

        //-----end-----
        $scope.UploadExcel = function () {

            $scope.reload = true;

            $scope.Exceldat = $scope.Exceldata[0]
            $scope.filteredArray = [];
            $scope.Exceldat.forEach(function (element) {
                //console.log(element)
                var obj = {
                    "examcent": element.examcent,
                    "ExamcentName": element.ExamcentName,
                    "scheme": element.scheme,
                    "Branchcode": element.Branchcode,
                    "Subcode": element.Subcode,
                    "subname": element.subname,
                    "pcode": element.pcode,
                    "semester": element.semester,
                    "pinno": element.pinno,
                    "SName": element.SName,
                    "ATTSTATUS": element.ATTSTATUS,
                    "first_eval_marks": element.first_eval_marks,
                    "first_CE_marks": element.first_CE_marks,
                    "Final_marks": element.Final_marks,
                    "MAXMARKS": element.MAXMARKS,
                    "MP_Punishment_proposed_COE": element.MP_Punishment_proposed_COE,
                    "barcode": element.barcode,
                    "evaluatorid": element.evaluatorid,
                    "evaluator_name": element.evaluator_name,
                    "evaluator_college": element.evaluator_college,
                    "evaluator_phone": element.evaluator_phone,
                    "chiefexaminerid": element.chiefexaminerid,
                    "ChiefExaminer_name": element.ChiefExaminer_name,
                    "ChiefExaminer_college": element.ChiefExaminer_college,
                    "ChiefExaminer_phone": element.ChiefExaminer_phone
                }
                $scope.filteredArray.push(obj)
            });
            var uploadJson = CcicPreExaminationService.UploadResultFileJson($scope.academicyear, $scope.monthyear, $scope.filteredArray, $scope.UserName);
            uploadJson.then(function (data) {

                var data = JSON.parse(data);
                if (data.Table[0].ResponceCode == '200') {
                    $scope.reload = false;
                    $('#upldfile').val(null);
                    $('#File').val(null);
                    $scope.filename = '';
                    $scope.myFile = '';
                    //document.getElementById('myFile').value = "";
                    //document.getElementById('file').value = "";
                    alert(data.Table[0].ResponceDescription)
                } else if (data.Table[0].ResponceCode == '400') {
                    $('#File').val(null);
                    $scope.reload = false;
                    alert(data.Table[0].ResponceDescription)
                }
                else {
                    $scope.reload = false;
                    //$('#upldfile').val(null);
                    alert('Something Went Wrong')
                }
                //$scope.tabledata;
            }, function (error) {
                $('#upldfile').val(null);
                $scope.reload = false;
                //$scope.gentmetbl = false;
                $scope.ResultNotFound = true;
                $scope.Result = false;
                $scope.LoadImg = false;
            });
            //  angular.forEach($scope.Exceldata, function (value, key) {
            //       for (i = 0; i < $scope.Exceldata.length; i++) {
            //           if ($scope.Exceldata[i].examcent == "" || $scope.Exceldata[i].examcent == null || $scope.Exceldata[i].examcent == undefined || $scope.Exceldata[i].examcent == 'NULL') {
            //               alert('examcent is required');
            //               return;
            //               break;

            //           }
            //           if ($scope.Exceldata[i].ExamcentName == "" || $scope.Exceldata[i].ExamcentName == null || $scope.Exceldata[i].ExamcentName == undefined || $scope.Exceldata[i].ExamcentName == 'NULL') {
            //               alert('ExamcentName is required');
            //               return;
            //               break;
            //           }
            //           if ($scope.Exceldata[i].scheme == "" || $scope.Exceldata[i].scheme == null || $scope.Exceldata[i].scheme == undefined || $scope.Exceldata[i].scheme == 'NULL') {
            //               alert('scheme is required');
            //               return;
            //               break;
            //           }
            //           if ($scope.Exceldata[i].Branchcode == "" || $scope.Exceldata[i].Branchcode == null || $scope.Exceldata[i].Branchcode == undefined || $scope.Exceldata[i].Branchcode == 'NULL') {
            //               alert('Branchcode is required');
            //               return;
            //               break;
            //           }
            //           if ($scope.Exceldata[i].Subcode == "" || $scope.Exceldata[i].Subcode == null || $scope.Exceldata[i].Subcode == undefined || $scope.Exceldata[i].Subcode == 'NULL') {
            //               alert('Subcode is required');
            //               return;
            //               break;
            //           }
            //           if ($scope.Exceldata[i].subname == "" || $scope.Exceldata[i].subname == null || $scope.Exceldata[i].subname == undefined || $scope.Exceldata[i].subname == 'NULL') {
            //               alert('subname is required');
            //               return;
            //               break;
            //           }
            //           if ($scope.Exceldata[i].pcode == "" || $scope.Exceldata[i].pcode == null || $scope.Exceldata[i].pcode == undefined || $scope.Exceldata[i].pcode == 'NULL') {
            //               alert('pcode is required');
            //               return;
            //               break;
            //           }
            //           if ($scope.Exceldata[i].pinno == "" || $scope.Exceldata[i].pinno == null || $scope.Exceldata[i].pinno == undefined || $scope.Exceldata[i].pinno == 'NULL') {
            //               alert('pinno is required');
            //               return;
            //               break;
            //           }
            //           if ($scope.Exceldata[i].SName == "" || $scope.Exceldata[i].SName == null || $scope.Exceldata[i].SName == undefined || $scope.Exceldata[i].SName == 'NULL') {
            //               alert('SName is required');
            //               return;
            //               break;
            //           }

            //       }
            ////   })
            //   $scope.ShowTableData = false;
            //   $scope.reload = false
            //   var type = 1;
            //   var uploadJson = PreExaminationService.UploadResultJson($scope.Exceldata);
            //   uploadJson.then(function (data) {
            //       console.log(data)
            //       //try {
            //       //    var data = JSON.parse(data);
            //       //    console.log(data)
            //       //    if (data.ResponceCode == '400') {
            //       //        alert('Data Already Inserted, Please check the downloaded Excel for more details')
            //       //        var location = data.ResponceDescription;
            //       //        window.location.href = location;

            //       //    }
            //       //} catch (err) { }
            //       var data = JSON.parse(data);
            //       if (data.Table[0].ResponceCode == '200') {
            //           $scope.reload = true;
            //           $('#upldfile').val(null);
            //           alert(data.Table[0].ResponceDescription)
            //       } else if (data.Table[0].ResponceCode == '400') {
            //           $scope.reload = true;
            //           alert(data.Table[0].ResponceDescription)
            //       }
            //       else {
            //           $scope.reload = true;
            //           $('#upldfile').val(null);
            //           alert('Something Went Wrong')
            //       }
            //       //$scope.tabledata;
            //   }, function (error) {
            //       $('#upldfile').val(null);
            //       $scope.reload = true;
            //       $scope.gentmetbl = false;
            //       $scope.ResultNotFound = true;
            //       $scope.Result = false;
            //       $scope.LoadImg = false;
            //   });
        }

        $scope.UploadWantingsExcel = function () {

            $scope.reload1 = true;

            $scope.Exceldat1 = $scope.Exceldata1[0]
            console.log($scope.Exceldat1);

            var filteredArray1 = [];

            $scope.Exceldat.forEach(function (element) {
                //console.log(element)
                var obj = {
                    "examcent": element.examcent,
                    "ExamcentName": element.ExamcentName,
                    "scheme": element.scheme,
                    "Branchcode": element.Branchcode,
                    "Subcode": element.Subcode,
                    "subname": element.subname,
                    "pcode": element.pcode,
                    "semester": element.semester,
                    "pinno": element.pinno,
                    "SName": element.SName,
                    "ATTSTATUS": element.ATTSTATUS,
                    "first_eval_marks": element.first_eval_marks,
                    "first_CE_marks": element.first_CE_marks,
                    "Final_marks": element.Final_marks,
                    "MAXMARKS": element.MAXMARKS,
                    "MP_Punishment_proposed_COE": element.MP_Punishment_proposed_COE,
                    "barcode": element.barcode,
                    "evaluatorid": element.evaluatorid,
                    "evaluator_name": element.evaluator_name,
                    "evaluator_college": element.evaluator_college,
                    "evaluator_phone": element.evaluator_phone,
                    "chiefexaminerid": element.chiefexaminerid,
                    "ChiefExaminer_name": element.ChiefExaminer_name,
                    "ChiefExaminer_college": element.ChiefExaminer_college,
                    "ChiefExaminer_phone": element.ChiefExaminer_phone
                }
                filteredArray1.push(obj)
            });

            var uploadJson = PreExaminationService.UploadWantingsJson($scope.ACADemicyear, $scope.MONThyear, filteredArray1, $scope.UserName);
            uploadJson.then(function (data) {

                var data = JSON.parse(data);
                if (data.Table[0].ResponceCode == '200') {
                    $scope.reload1 = false;
                    //$('#upldfile').val(null);
                    alert(data.Table[0].ResponceDescription)
                } else if (data.Table[0].ResponceCode == '400') {
                    $scope.reload1 = false;
                    alert(data.Table[0].ResponceDescription)
                }
                else {
                    $scope.reload1 = false;
                    //$('#upldfile').val(null);
                    alert('Something Went Wrong')
                }
                //$scope.tabledata;
            }, function (error) {
                $('#upldfile').val(null);
                $scope.reload1 = false;
                //$scope.gentmetbl = false;
                $scope.ResultNotFound = true;
                $scope.Result = false;
                $scope.LoadImg = false;
            });

        }

        $scope.upload = function () {

            console.log($scope.tabledata)
            var uploadExcl = PreExaminationService.uploadExcel($scope.myFile);


            uploadExcl.then(function (res) {
                if (res == '1') {

                }
            }, function (err) {
            })


        }
        $scope.init = function () {
            var i, j, column, cell;
            var records = [],
                record;
            var temp = $scope.XL_row_object;
            $scope.numRows = 10;
            $scope.numColumns = 20;


            for (i = 0; i < $scope.numRows; i++) {
                record = [];
                for (j = 0; j < $scope.numColumns; j++) {
                    cell = {
                        value: ''
                    }
                    record.push(cell);
                }
                records.push(record);
            }
            $scope.records = $scope.XL_row_object;

        }

        // $scope.init();

        var hideContextMenu = function () {
            $scope.isContextMenuVisible = false;
            if (!$rootScope.$$phase) {
                $rootScope.$apply();
            }
        };
        $scope.numRows = 0;
        $scope.numColumns = 0;

        $scope.isContextMenuVisible = false;
        $scope.contextmenuRowIndex = -1;
        $scope.contextmenuColumnIndex = -1
        $scope.openContextMenu = function ($event, rowIndex, columnIndex) {
            $event.preventDefault();

            if ($event.button === 0) {
                $scope.isContextMenuVisible = false;
                return;
            }

            $scope.contextmenuRowIndex = rowIndex;
            $scope.contextmenuColumnIndex = columnIndex;
            $scope.contextMenuStyle = {
                top: $event.clientY + 'px',
                left: $event.clientX + 'px'
            };
            $scope.isContextMenuVisible = true;
        };
        $scope.addRow = function () {
            var i,
                record,
                cell,
                index = $scope.contextmenuRowIndex;

            record = [];
            for (i = 0; i < $scope.numColumns; i++) {
                cell = {
                    value: 'New Cell'
                }
                record.push(cell);
            }

            $scope.records.splice(index, 0, record);
            $scope.isContextMenuVisible = false;
            $scope.numRows = $scope.records.length;
        };
        $scope.removeRow = function () {
            var index = $scope.contextmenuRowIndex;
            $scope.records.splice(index, 1);
            $scope.isContextMenuVisible = false;
            $scope.numRows = $scope.records.length;
        };
        $scope.addColumn = function () {
            var i, record;
            for (i = 0; i < $scope.records.length; i++) {
                record = $scope.records[i];
                record.splice($scope.contextmenuColumnIndex, 0, {
                    value: 'New Col'
                });
            }

            $scope.numColumns = record.length;
        };
        //var LoadActiveSchemes = AssessmentService.getSchemes(2);
        //LoadActiveSchemes.then(function (response) {
        //    $scope.ActiveSchemes = response;
        //},
        //    function (error) {
        //        alert("error while loading Schemes");
        //        var err = JSON.parse(error);
        //        console.log(err.Message);
        //    });

        //var LoadActiveSemesters = AssessmentService.getActiveSemester();
        //LoadActiveSemesters.then(function (response) {
        //    $scope.Semester = response.Table;
        //    //  console.log($scope.ActiveSemesters)
        //},
        //function (error) {
        //    alert("error while loading semesters");
        //    var err = JSON.parse(error);
        //    console.log(err.Message);
        //});






        //var LoadActiveSchemes = AssessmentService.getSchemes(2);
        //LoadActiveSchemes.then(function (response) {
        //    $scope.getActiveSchemes = response;
        //},
        //    function (error) {
        //        alert("error while loading Schemes");
        //        var err = JSON.parse(error);
        //        console.log(err.Message);
        //    });




        //var LoadActiveSemesters = AssessmentService.getActiveSemester();
        //LoadActiveSemesters.then(function (response) {
        //    $scope.sems = response.Table;
        //    //  console.log($scope.ActiveSemesters)
        //},
        //function (error) {
        //    alert("error while loading semesters");
        //    var err = JSON.parse(error);
        //    console.log(err.Message);
        //});


        $scope.Download = function () {

            var location = window.location.origin
            //console.log(location + '/Results/C18/C16C18SamapleFormate.xlsx');
            //window.location.replace('/Results/C18/C16C18SamapleFormate.xlsx');
            window.location.href = location + '/Results/CCIC_Results_Sample_Format.xlsx';



        }
        $scope.removeColumn = function () {
            var i, record;
            for (i = 0; i < $scope.records.length; i++) {
                record = $scope.records[i];
                record.splice($scope.contextmenuColumnIndex, 1);
            }

            $scope.numColumns = record.length;
        };

        $document.bind('click', function ($evt) {
            var target = angular.element($evt.target).closest('table');
            if (target.length === 0)
                hideContextMenu();

        });




        //---- progress --------------

        var circles = $('.progress .circle');
        var currentCircle = circles.first();
        var previousCircle = $();

        (function () {
            currentCircle.addClass('active');
            previousCircle.removeClass('active').addClass('done');

            var bar = currentCircle.prev();
            bar.addClass('done');

            previousCircle = currentCircle;
            currentCircle = currentCircle.nextAll('.circle:first');

            if (previousCircle.length) {
                setTimeout(arguments.callee, 1000);
            }
        })();


    });
    app.directive('ngRightClick', function ($parse) {
        return function (scope, element, attrs) {
            var fn = $parse(attrs.ngRightClick);
            element.bind('contextmenu', function (event) {
                scope.$apply(function () {
                    event.preventDefault();
                    fn(scope, {
                        $event: event
                    });
                });
            });
        };

        //var SCHEMESEMINFO = StudentWiseService.GetSchemeDataForResults();
        //$scope.pin = "";
        //SCHEMESEMINFO.then(function (data) {
        //    if (data.length > 0) {

        //        $scope.Schemeinfo = data;

        //    }
        //}, function (error) {
        //    alert(error);00000000000000000000004
        //});
        $scope.validate = function () {
            $scope.getTable = true;
        }












    });

    app.factory('Excel', function ($window) {
        var uri = 'data:application/vnd.ms-excel;base64,',
            template = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body><table>{table}</table></body></html>',
            base64 = function (s) { return $window.btoa(unescape(encodeURIComponent(s))); },
            format = function (s, c) { return s.replace(/{(\w+)}/g, function (m, p) { return c[p]; }) };
        return {
            tableToExcel: function (tableId, worksheetName) {
                var table = $(tableId),
                    ctx = { worksheet: worksheetName, table: table.html() },
                    href = uri + base64(format(template, ctx));
                return href;
            }
        };
    });


});

