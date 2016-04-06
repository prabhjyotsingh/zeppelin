'use strict';
/*
 * Licensed to the Apache Software Foundation (ASF) under one or more
 * contributor license agreements.  See the NOTICE file distributed with
 * this work for additional information regarding copyright ownership.
 * The ASF licenses this file to You under the Apache License, Version 2.0
 * (the "License"); you may not use this file except in compliance with
 * the License.  You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @name zeppelinUI.controller:WorkspaceController
 * @description
 * # WorkspaceController
 * Controller of the zeppelinUI
 */
angular.module('zeppelinUI')
  .controller('WorkspaceController', function($scope, WebSocketMessageService) {
    $scope.filteredNotes = [];
    $scope.currentPage = 1;
    $scope.numPerPage = 8;
    $scope.maxSize = 100;
    $scope.notes = [];
    $scope.workspaceSelect = {};
    $scope.deleteEnabled = false;

    $scope.init = function() {
      WebSocketMessageService.getNotebookList();
    };

    $scope.$on('setNoteMenu', function(event, note) {
      if (note) {
        $scope.notes = note;
        $scope.$watch('currentPage + numPerPage', function() {
          var begin = (($scope.currentPage - 1) * $scope.numPerPage), end = begin + $scope.numPerPage;

          $scope.filteredNotes = $scope.notes.slice(begin, end);
        });

      }
    });

    $scope.$watch('workspaceSelect', function(workspaceTiles) {
      for (var tile in workspaceTiles) {
        if (workspaceTiles[tile].selected === true) {
          $scope.deleteEnabled = true;
          return;
        }
      }
      $scope.deleteEnabled = false;
    }, true);

  });
