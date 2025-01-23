﻿define(['app'], function (app) {
    app.factory('Excel', function ($window) {
        //alert("hello");
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
    app.controller("BranchWiseController", function ($scope, $http, $localStorage, $state, AppSettings, MenuService, BranchWiseService, Excel, $timeout) {
        // column to sort
        $scope.column = 'pin';
        // sort ordering (Ascending or Descending). Set true for desending
        $scope.reverse = false;
        // called on header click
        $scope.sortColumn = function (col) {
            $scope.column = col;
            if ($scope.reverse) {
                $scope.reverse = false;
                $scope.reverseclass = 'arrow-up';
            } else {
                $scope.reverse = true;
                $scope.reverseclass = 'arrow-down';
            }
        };

        $scope.sortClass = function (col) {
            if ($scope.column == col) {
                if ($scope.reverse) {
                    return 'arrow-down';
                } else {
                    return 'arrow-up';
                }
            } else {
                return '';
            }
        };

        var authData = $localStorage.authorizationData;
        $scope.userName = authData.userName;
        AppSettings.LoggedUserId = authData.SysUserID;
        AppSettings.CollegeID = authData.CollegeID;
        $scope.CollegeID = authData.CollegeID;
        AppSettings.SysUsrGrpID = authData.SysUsrGrpID;
        AppSettings.userName = authData.userName;
        AppSettings.AcdYrID = authData.AcdYrID;
        AppSettings.TypeFlag = authData.TypeFlag;
        AppSettings.ExamInstID = $localStorage.ExamInstID;
        AppSettings.MngtTypID = authData.MngtTypID;
        AppSettings.DistrictIDs = authData.DistrictIDs;
        $scope.College_Code = authData.College_Code;
        $scope.College_Name = authData.College_Name;

        $scope.LoadImg = false;
        $scope.sortType = '- pin';
        if ($scope.CollegeID == 0) {
            // Scheme Sem branch Information
            var CollegesInfo = BranchWiseService.GetCollegesSchemeSemInfo(AppSettings.CollegeID);

            CollegesInfo.then(function (data) {
                if (data.length > 0) {

                    $scope.collegeinfo = data[0].collegeInfo;
                    $scope.schemeinfo = data[0].schemeInfo;
                    $scope.seminfo = data[0].semInfo;

                }

            }, function (error) {
                alert(error);
            });
            // end Scheme Sem branch Information
        }
        else {
            // Scheme Sem branch Information
            var SCHEMESEMINFO = BranchWiseService.GetSchemeSemBranchInfo(AppSettings.CollegeID);

            SCHEMESEMINFO.then(function (data) {
                if (data.length > 0) {

                    $scope.schemeinfo = data[0].schemeInfo;
                    $scope.seminfo = data[0].semInfo;
                    $scope.branchinfo = data[0].branchInfo;
                }

            }, function (error) {
                alert(error);
            });
            // end Scheme Sem branch Information
        }
        $scope.OpenProgram = function (GridFormToOpen) {
            var strroute = '' + GridFormToOpen;
            $state.go(strroute);
        }
        $scope.OpenDashboard = function () {
            $state.go('Dashboard')
        }
        $scope.GoToHome = function () {
            $state.go('Exam');
        }
        $scope.MyProfile = function () {
            alert("ok");
        }
        $scope.MyCollege = function () {
            if (AppSettings.TypeFlag == 'C') {
                $state.go('Exam.CollegeInfo');
            }
            else {
                alert("This is not College user");
                return;
            }
        }
        $scope.logOut = function () {
            sessionStorage.loggedIn = "no";
            delete $localStorage.authorizationData;
            var InsertLoginList = MenuService.GetUpdateLogoutInfo(AppSettings.LoggedUserId, $scope.userName);
            InsertLoginList.then(function (Districtdata, status, headers, config, error) {
            }, function (error) {
                alert(error);
            });
            $scope.authentication = {
                isAuth: false,
                UserId: 0,
                userName: ""
            };
            $state.go('login');
        }
        //$scope.$on('onUnload', function(e) {
        //    delete $localStorage.authorizationData;
        //    sessionStorage.loggedIn = "no";
        //});
        //drilldowncoding

        function matchFirstChar(c, string) {
            return (string.charAt(0) == c);
        }

        function removeFirstChar(string) {
            return string.slice(1);
        }

        function removeDash(label) {
            if (matchFirstChar('-', label)) {
                return removeFirstChar(label);
            }
            return label;
        }
        function addDash(label) {
            if (!matchFirstChar('-', label)) {
                return '-' + label;
            }
            return label;
        }
        $scope.OpenCollegeSemWiseReport = function () {
            //$state.go('StudentReg');
            $state.go('CollegeSemWise');
        }
        $scope.OpenBranchWiseReport = function () {

            $state.go('BranchWise');
        }
        $scope.OpenStudentWiseReport = function () {

            $state.go('StudentWise');
        }
        $scope.loadBranches = function () {
            $scope.showData = 0;
            // Branch Information
            var BranchInfo = BranchWiseService.GetSchemeSemBranchInfo($scope.college);

            BranchInfo.then(function (data) {
                if (data.length > 0) {

                    $scope.branchinfo = data[0].branchInfo;
                }

            }, function (error) {
                alert(error);
            });
            // Branch Information
        }
        $scope.hidePreviousResult = function () {
            $scope.showData = 0;
        }

        $scope.loadExamTypes = function () {
            $scope.showData = 0;
            // Branch Information
            var ExamTypeInfo = BranchWiseService.GetExamTypeInfo($scope.scheme, $scope.sem);

            ExamTypeInfo.then(function (data) {
                if (data.length > 0) {
                    $scope.examtypeinfo = data[0].typeInfo;
                }

            }, function (error) {
                alert(error);
            });
            // Branch Information
        }
        $scope.Submit = function () {
            $scope.showData = 0;
            if (AppSettings.CollegeID == 0) {
                if (($scope.college == undefined) || ($scope.college == "0") || ($scope.college == "")) {
                    alert("Select College");
                    return false;
                }
            }
            if (($scope.scheme == undefined) || ($scope.scheme == "0") || ($scope.scheme == "")) {
                alert("Select Scheme");
                return false;
            }
            if (($scope.sem == undefined) || ($scope.sem == "0") || ($scope.sem == "")) {
                alert("Select Sem");
                return false;
            }
            if (($scope.examtype == undefined) || ($scope.examtype == "0") || ($scope.examtype == "")) {
                alert("Select Exam");
                return false;
            }
            if (($scope.branch == undefined) || ($scope.branch == "0") || ($scope.branch == "")) {
                alert("Select Branch");
                return false;
            }
            $scope.LoadImg = true;
            $scope.ResultNotFound = false;
            $scope.ResultFound = false;
            if (AppSettings.CollegeID == 0)
                var collegeid = $scope.college;
            else
                var collegeid = AppSettings.CollegeID;
            // alert(collegeid);
            var ResultData = BranchWiseService.GetBranchWiseReport(collegeid, $scope.scheme, $scope.sem, $scope.examtype, $scope.branch);
            ResultData.then(function (data) {
                if (data.length > 0) {

                    if (data[0].branchWiseReport.length > 0) {
                        //alert(data[0].branchWiseReport[0].Scheme_Code);
                        $scope.ResultFound = true;
                        $scope.showData = 1;
                        $scope.ResultNotFound = false;
                        $scope.collegescheme = data[0].branchWiseReport[0].Scheme_Code;
                        $scope.semyear = data[0].branchWiseReport[0].Semister;
                        $scope.branchcode = $scope.branch;
                        $scope.StudentExamType = data[0].branchWiseReport[0].ExamType;
                        $scope.CollegeCode = data[0].branchWiseReport[0].CollegeCode;
                        $scope.CollegeName = data[0].branchWiseReport[0].CollegeName;
                        //alert(data[0].branchWiseReport[0].CollegeCode);
                        var newArray = [];
                        if (data[0].studentSubjectTotalSGPA.length > 0) {
                            angular.forEach(data[0].studentSubjectTotalSGPA, function (value, key) {
                                var exists = false;
                                angular.forEach(newArray, function (val2, key) {
                                    if (angular.equals(value.pin, val2.pin)) { exists = true };
                                });
                                if (exists == false && value.id != "") { newArray.push(value); }
                            });
                        }
                        $scope.studentscount = newArray.length;
                        $scope.BranchSubjectGradeInfo = data[0].branchSubjectGradeInfo;
                        $scope.StudentSubjectTotalSGPA = data[0].studentSubjectTotalSGPA;                      
                        $scope.BranchWiseReport = data[0].branchWiseReport;
                        $scope.LoadImg = false;
                    }
                    else {
                        $scope.ResultFound = false;
                        $scope.ResultNotFound = true;
                        $scope.LoadImg = false;
                    }
                }
                else {
                    $scope.ResultFound = false;
                    $scope.ResultNotFound = true;
                    $scope.LoadImg = false;
                    //   alert("Data Not Found.");
                }
            }, function (error) {
                alert(error);
            });
            $scope.loadBranches = function () {
                // alert($scope.college);
            }
            $scope.getChildren = function (parent) {
                //  alert(parent.pin);
                var arr2 = $scope.BranchWiseReport;
                var children = [];
                for (var i = 0; i < arr2.length; i++) {
                    if (arr2[i].pin == parent.pin) {
                        
                        children.push(arr2[i]);
                    }
                }
               
                return children;
            };
            //$scope.MngtName = "";
            //var ExamInstSelect = document.getElementById("ExamInstID");
            //var ExamInstSelectText = ExamInstSelect.options[ExamInstSelect.selectedIndex].text;
            //var DistrictSelect = document.getElementById("DistrictID");
            //var DistrictSelectText = DistrictSelect.options[DistrictSelect.selectedIndex].text;
            //var CourseSelect = document.getElementById("CourseID"); 
            //var CourseSelectText = CourseSelect.options[CourseSelect.selectedIndex].text;
            //var ExamSelect = document.getElementById("ExamID"); 
            //var ExamSelectText = ExamSelect.options[ExamSelect.selectedIndex].text;
            //var MainGrpSelect = document.getElementById("MainGrpID");
            //var MainGrpSelectText = MainGrpSelect.options[MainGrpSelect.selectedIndex].text; 
            //var MediumSelect = document.getElementById("MediumID");
            //var MediumSelectText = MediumSelect.options[MediumSelect.selectedIndex].text; 
            //var CasteSelect = document.getElementById("CasteID");
            //var CasteSelectText = CasteSelect.options[CasteSelect.selectedIndex].text;
            //document.getElementById('HeadLabel').innerHTML = 'Exam Fee Transaction Report <br/>'
            //    + 'Exam Instance: ' + ExamInstSelectText + ' &emsp;&emsp; District: ' + DistrictSelectText + ' &emsp;&emsp; Stream: ' + CourseSelectText +
            //    '<br/>Year: ' + ExamSelectText + '&emsp;&emsp;Group: ' + MainGrpSelectText + '&emsp;&emsp;Medium: ' + MediumSelectText + '&emsp;&emsp;Caste/Community: ' + CasteSelectText;

            //$scope.MngtTypIDs = "";
            //$scope.LoadImg = true;
            //for (var i = 0; i < $scope.BasicManagementTypeList.length; i++) {
            //    if ($scope.BasicManagementTypeList[i].Selected) {
            //        if ($scope.MngtTypIDs == "") {
            //            $scope.MngtTypIDs = $scope.BasicManagementTypeList[i].MngtTypID;
            //            $scope.MngtName = $scope.BasicManagementTypeList[i].MngtTypName; // for printing
            //        }
            //        else {                   
            //            $scope.MngtTypIDs = $scope.MngtTypIDs + ',' + $scope.BasicManagementTypeList[i].MngtTypID;
            //            $scope.MngtName += ',' + $scope.BasicManagementTypeList[i].MngtTypName; // for printing
            //        }
            //    }
            //}
            //if (AppSettings.CollegeID != 0) {
            //    for (var i = 0; i < $scope.BasicManagementTypeList.length; i++) {
            //        if ($scope.BasicManagementTypeList[i].MngtTypID == AppSettings.MngtTypID) {
            //            $scope.BasicManagementTypeList[i].Selected = true;
            //            $scope.MngtTypIDs = $scope.BasicManagementTypeList[i].MngtTypID;
            //            $scope.MngtName = $scope.BasicManagementTypeList[i].MngtTypName; // for printing
            //        }
            //    }
            //}
            //$("#MangtLabel").text('Management Type: ' + $scope.MngtName);
            //if ($scope.MngtTypIDs == "") {
            //    alert("Select atleast single management type");
            //    return;
            //}
            //if (($scope.Exam.ExamInstID == "") || ($scope.Exam.ExamInstID == undefined)) {
            //    alert("Select Exam Instance");
            //    return;
            //}
            //if (($scope.Exam.CourseID == "") || ($scope.Exam.CourseID == undefined)) {
            //    alert("Select Stream");
            //    return;
            //}
            //if (($scope.Exam.ExamID == "") || ($scope.Exam.ExamID == undefined)) {
            //    alert("Select Exam");
            //    return;
            //}
            //if (($scope.Exam.DistrictID == "") || ($scope.Exam.DistrictID == undefined)) {
            //    $scope.Exam.DistrictID = 0;
            //}
            //if (($scope.Exam.CourseID == "") || ($scope.Exam.CourseID == undefined)) {
            //    $scope.Exam.CourseID = 0;
            //}
            //if (($scope.Exam.MainGrpID == "") || ($scope.Exam.MainGrpID == undefined)) {
            //    $scope.Exam.MainGrpID = 0;
            //}
            //if (($scope.Exam.MediumID == "") || ($scope.Exam.MediumID == undefined)) {
            //    $scope.Exam.MediumID = 0;
            //}
            //if (($scope.Exam.CasteID == "") || ($scope.Exam.CasteID == undefined)) {
            //    $scope.Exam.CasteID = 0;
            //}

            //$scope.MngtTypName = "ALL";
            //$scope.CourseName = "ALL";
            //$scope.MainGrpName = "ALL";
            //$scope.MediumName = "ALL";
            //$scope.CasteName = "ALL";
            //$scope.AcdYrName = "ALL";
            //$scope.CollegeDistName = "ALL";
            //for (var i = 0; i < $scope.BasicExamInstanceList.length; i++) {
            //    if ($scope.BasicExamInstanceList[i].ExamInstID == $scope.Exam.ExamInstID) {
            //        $scope.AcdYrName = $scope.BasicExamInstanceList[i].ExamInstanceRemark;
            //    }
            //}
            //for (var i = 0; i < $scope.DistrictList.length; i++) {
            //    if ($scope.DistrictList[i].DistrictID == $scope.Exam.DistrictID) {
            //        $scope.CollegeDistName = $scope.DistrictList[i].DistName;
            //    }
            //}
            //for (var i = 0; i < $scope.CourseList.length; i++) {
            //    if ($scope.CourseList[i].CourseID == $scope.Exam.CourseID) {
            //        $scope.CourseName = $scope.CourseList[i].CourseName;
            //    }
            //}
            //for (var i = 0; i < $scope.MainGroupList.length; i++) {
            //    if ($scope.MainGroupList[i].MainGrpID == $scope.Exam.MainGrpID) {
            //        $scope.MainGrpName = $scope.MainGroupList[i].MainGrpName;
            //    }
            //}
            //for (var i = 0; i < $scope.MediumList.length; i++) {
            //    if ($scope.MediumList[i].MediumID == $scope.Exam.MediumID) {
            //        $scope.MediumName = $scope.MediumList[i].MediumName;
            //    }
            //}


            //if (AppSettings.CollegeID == 0) {
            //    var TotalRecorddata = DrillDownExamService.GetCollegedataByMngtypeAndDistrict(AppSettings.ExamInstID, AppSettings.AcdYrID, $scope.Exam.DistrictID, AppSettings.LoggedUserId, $scope.MngtTypIDs, $scope.Exam.CourseID, $scope.Exam.ExamID, $scope.Exam.MainGrpID, $scope.Exam.MediumID, $scope.Exam.CasteID);
            //}
            //else {
            //    var gender = "";
            //    var TotalRecorddata = DrillDownExamService.GetCollegedataByMngtypeAndDistrictByCollege(AppSettings.ExamInstID, AppSettings.AcdYrID, $scope.Exam.DistrictID, AppSettings.CollegeID, gender, $scope.MngtTypIDs, $scope.Exam.CourseID, $scope.Exam.ExamID, $scope.Exam.MainGrpID, $scope.Exam.MediumID, $scope.Exam.CasteID);
            //}
            //TotalRecorddata.then(function (data) {
            //    $scope.LoadImg = false;
            //    if (data.length > 0) {
            //        if (AppSettings.CollegeID == 0) {
            //            $scope.DrillDownList = data;
            //        }
            //        else {
            //            $scope.colPageAdmissionListForfirst = data;
            //        }
            //        $scope.ShowBtn = true;
            //    } else {
            //        alert("Data Not Found.");
            //        $scope.DrillDownList = [];
            //        $scope.colPageAdmissionListForfirst = [];
            //        $scope.ShowBtn = false;
            //    }
            //}, function (error) {
            //    alert(error);
            //    $scope.LoadImg = false;
            //    $scope.ShowBtn = false;
            //});
        }
        $scope.DownloadPdfResult = function (tableid) {
            // alert(tableid + ":" + AppSettings.ExportToPdfUrl);
            //alert("pdf : " + tableid);
            var height = $('#cntn').height();
            $('#cntn').height('auto');
            var scaleBy = 5;
            var w = 1000;
            var h = 1000;
            var div = document.querySelector('#idtoDivPrintAdmin');
            var canvas = document.createElement('canvas');
            canvas.width = w * scaleBy;
            canvas.height = h * scaleBy;
            canvas.style.width = w + 'px';
            canvas.style.height = h + 'px';
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
                    $('#cntn').height(height);
                }
            });
            // html2canvas($('#idtoDivPrintAdmin'), {
            //     scale: 5,
            //     onrendered: function (canvas) {
            //         var data = canvas.toDataURL();
            //         addImage(data);
            //         $('#cntn').height(height);
            //     }
            // });
        }

        $scope.PrintStudentResult = function () {

            var divName = "idtoDivPrintAdmin";

            var divToPrint = document.getElementById(divName);

            var domClone = divToPrint.cloneNode(true);
            var $printSection = document.getElementById("printSection");
            if (!$printSection) {
                var $printSection = document.createElement("div");
                $printSection.id = "printSection";
                document.body.appendChild($printSection);
            }
            $printSection.innerHTML = "";
            $printSection.appendChild(domClone);
            window.print();
            document.body.removeChild($printSection);

        };

        $scope.DownloadExcelResult = function (tableId) {
            // alert(AppSettings.ExportToExcelUrl);
            //alert("Excel : "+tableId);
            var exportHref = Excel.tableToExcel(tableId, 'StudentResult');
            $timeout(function () { location.href = exportHref; }, 100);
        }
        $scope.PrintDashBoard = function () {

            var divName = "idtoDivPrintAdmin";

            var divToPrint = document.getElementById(divName);

            var domClone = divToPrint.cloneNode(true);
            var $printSection = document.getElementById("printSection");
            if (!$printSection) {
                var $printSection = document.createElement("div");
                $printSection.id = "printSection";
                document.body.appendChild($printSection);
            }
            $printSection.innerHTML = "";
            $printSection.appendChild(domClone);
            window.print();
            document.body.removeChild($printSection);
        }
    });
    app.$inject = ['$scope'];
});












