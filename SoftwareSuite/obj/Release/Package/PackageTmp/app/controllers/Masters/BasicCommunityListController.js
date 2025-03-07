﻿define(['app'], function (app) {
    app.controller("BasicCommunityListController", function ($scope, $state, AppSettings, BasicCommunityService) {
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
        var gridColumns = [
			{ field: "CommName", headerText: "Name", textAlign: ej.TextAlign.Left, width: 100 },
			{ field: "CommCode", headerText: "Short Name", textAlign: ej.TextAlign.Left, width: 50 },
			{ field: "CommunityCode", headerText: "Community Code", textAlign: ej.TextAlign.Left, width: 50 },
            { field: "Active", headerText: "Status", textAlign: ej.TextAlign.Left, width: 50 },
            { field: "CommunityID", headerText: "ID", textAlign: ej.TextAlign.Right, visible: false }
        ];
        $scope.BasicCommunityList = [];
        $("#BasicCommunitys").ejGrid({
            dataSource: $scope.BasicCommunityList,
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
            $state.go('Masters.BasicCommunity', { CommunityID: 0 });
            //}
        }
        // Edit delete record
        $scope.doubleclick = function doubleclick(sender, args) {
            if (this.multiSelectCtrlRequest == false) {
               // $state.go('Masters.BasicCommunity', { CommunityID: sender.data.CommunityID });
            }
        }
        var BasicCommunitydata = BasicCommunityService.GetBasicCommunityList();
        BasicCommunitydata.then(function (data, status, headers, config, error) {
            $scope.BasicCommunityList = data;
        }, function (error) {
            alert(error);
        });
    });
});