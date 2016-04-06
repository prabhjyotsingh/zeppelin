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
  .controller('NotebookController', function($scope, $rootScope, $routeParams, $http, WebSocketMessageService,
                                             BaseURLService) {

    $scope.initWorkspace = function() {
      WebSocketMessageService.getNotebook($routeParams.noteId);
      jQuery(window).on('resize, load', function () {
        jQuery('#paragraphTree').height(jQuery(window).height() - 50);
      })
    };

    $scope.$on('setNoteContent', function(event, note) {
      if (note) {
        $scope.note = note;
        console.log(note);
        getInterpreterBindings();
      }
    });

    $('.side-nav').affix({
      offset: {
        top: 206
      }
    });

    $scope.goToParagraph = function (id) {
      var top = jQuery('#' + id + '_paragraphColumn')[0].offsetTop;
      jQuery('body').animate({scrollTop: top}, '500', 'swing');
    };

    var getInterpreterBindings = function() {
      $http.get(BaseURLService.getRestApiBase() + '/notebook/interpreter/bind/' + $scope.note.id).
      success(function(data) {
        $scope.interpreterBindings = data.body;
        $rootScope.$emit('interpreterBindings');
      }).
      error(function(data, status, headers, config) {
        if (status !== 0) {
          console.log('Error %o %o', status, data.message);
        }
      });
    };

  });
