(function () {
    "use strict";

    function ScriptsCreateController($scope, $location, navigationService, formHelper, codefileResource, localizationService) {

        var vm = this;
        var node = $scope.dialogOptions.currentNode;
        var localizeCreateFolder = localizationService.localize("defaultdialog_createFolder");

        vm.creatingFolder = false;
        vm.folderName = "";
        vm.createFolderError = "";
        vm.fileExtension = "";

        vm.createFile = createFile;
        vm.showCreateFolder = showCreateFolder;
        vm.createFolder = createFolder;

        function createFile() {
            $location.search('create', null);
            $location.path("/settings/scripts/edit/" + node.id).search("create", "true");
            navigationService.hideMenu();
        }

        function showCreateFolder() {
            vm.creatingFolder = true;
        }

        function createFolder(form) {

            if (formHelper.submitForm({scope: $scope, formCtrl: form, statusMessage: localizeCreateFolder})) {

                codefileResource.createContainer("scripts", node.id, vm.folderName).then(function(path) {

                    navigationService.hideMenu();

                    navigationService.syncTree({
                        tree: "scripts",
                        path: path,
                        forceReload: true,
                        activate: true
                    });

                    formHelper.resetForm({
                        scope: $scope
                    });

                    var section = appState.getSectionState("currentSection");

                }, function(err) {

                    vm.createFolderError = err;

                    //show any notifications
                    if (angular.isArray(err.data.notifications)) {
                        for (var i = 0; i < err.data.notifications.length; i++) {
                            notificationsService.showNotification(err.data.notifications[i]);
                        }
                    }
                });
            }

        }

    }

    angular.module("umbraco").controller("Umbraco.Editors.Scripts.CreateController", ScriptsCreateController);
})();
