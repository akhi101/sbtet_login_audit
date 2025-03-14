﻿define(['app'], function (app) {
    app.controller("BasicDistrictsListController", function ($scope, $state, AppSettings, BasicDistrictsService) {
        $scope.CompanyName = AppSettings.CompanyName;
        $scope.LoginYear = AppSettings.SelectedYear;
        var PageNm = $state.current.name.split(".")[1];
        var RightForCurrentPage = [];
        var UsersRightsdata = [];
        UsersRightsdata = AppSettings.UserRights;
        for (var i = 0; i < UsersRightsdata.length; i++) {
            if (UsersRightsdata[i].GridFormToOpen == PageNm) {
                var obj = {};
                obj.isaddable = UsersRightsdata[i].isaddable;
                RightForCurrentPage.push(obj);
            }
        }
        var BasicDistrictsdata = BasicDistrictsService.GetBasicDistrictsForList(3);
        BasicDistrictsdata.then(function (data) {
			$scope.BasicDistrictsList = data;
        }, function (error) {
            alert(error);
            });

        $scope.FillDistrictList = function (ActiveFlag) {
            if (ActiveFlag == undefined) { ActiveFlag = 3; }
            if (ActiveFlag == "") { ActiveFlag = 3; }
            var BasicDistrictsdata = BasicDistrictsService.GetBasicDistrictsForList(ActiveFlag);
        BasicDistrictsdata.then(function (data) {
			$scope.BasicDistrictsList = data;
        }, function (error) {
            alert(error);
            });
        }

        var gridColumns = [
			{ field: "StateName", headerText: "State", textAlign: ej.TextAlign.Left, width: 100 },
			{ field: "DistName", headerText: "Name", textAlign: ej.TextAlign.Left, width: 50 },
			{ field: "DistCode", headerText: "Code", textAlign: ej.TextAlign.Left, width: 50 },
			{ field: "OldCode", headerText: "Old Code", textAlign: ej.TextAlign.Left, width: 50 },
            { field: "Active", headerText: "Status", textAlign: ej.TextAlign.Left, width: 50 },
			{ field: "DistrictID", headerText: "DistrictID", textAlign: ej.TextAlign.Right, visible: false }
        ];
        $scope.BasicDistrictsList = [];
        $("#BasicDistricts").ejGrid({
            dataSource: $scope.BasicDistrictsList,
            allowPaging: true,
            pageSettings: { pageSize: 10 },
            allowSearching: true,
            allowScrolling: true,
            allowResizeToFit: true,
            allowFiltering: true,
			toolbarSettings: { showToolbar: true, toolbarItems: [ej.Grid.ToolBarItems.WordExport, ej.Grid.ToolBarItems.ExcelExport, ej.Grid.ToolBarItems.PdfExport, ej.Grid.ToolBarItems.Search] },
			editSettings: { allowAdding: true },
            toolbarClick: function (args) {
                if (args.itemName == "Add") {
                    args.cancel = true;
                    AddNew();
                }
                if (args.itemName == "Excel Export") {
                    args.cancel = true;
                    this.export(AppSettings.ExportToExcelUrl);
                }
                if (args.itemName == "Word Export") {
                    args.cancel = true;
                    this.export(AppSettings.ExportToWordUrl);
                }
                if (args.itemName == "PDF Export") {
                    args.cancel = true;
                    this.export(AppSettings.ExportToPdfUrl);
                }
            },
            columns: gridColumns
        });
        // Add new Record
        function AddNew() {
            //if (RightForCurrentPage[0].isaddable != 'Y') {
            //     alert("You Don't have Add Rights");
            //    return;
            // } else {
			$state.go('Masters.BasicDistricts', { DistrictID: 0 });
            //}
        }
        // Edit delete record
        $scope.doubleclick = function doubleclick(sender, args) {
            if (this.multiSelectCtrlRequest == false) {
				//$state.go('Masters.BasicDistricts', { DistrictID: sender.data.DistrictID });
            }
        }
    });
});