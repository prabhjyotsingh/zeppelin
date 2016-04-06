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

angular.module('zeppelinUI')
  .config(function($routeProvider) {
    $routeProvider
      .when('/addSource', {
        templateUrl: 'views/addSource.html',
        controller: 'AddSourceController',
        controllerAs: 'addSource'
      })
      .when('/home', {
        templateUrl: 'views/home.html',
        controller: 'HomeController',
        controllerAs: 'home'
      })
      .when('/workspace', {
        templateUrl: 'views/workspace.html',
        controller: 'WorkspaceController',
        controllerAs: 'workspace'
      })
      .when('/workspace/:noteId', {
        templateUrl: 'views/notebook/notebook.html',
        controller: 'NotebookController',
        controllerAs: 'workspace'
      }).when('/polestar', {
        templateUrl: 'views/polestar.html',
        controller: 'PolestarController'
      })
      .otherwise({
        redirectTo: '/home'
      });

  });
