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
 * @name zeppelinUI
 * @description
 * # zeppelinUI
 *
 * Main module of the application.
 */
angular
  .module('zeppelinUI', [
    'ngResource',
    'ngRoute',
    'ui.bootstrap',
    'angular-websocket',
    'mgo-angular-wizard',
    'ui.codemirror',
    'ui.tree',
    'ngCookies',
    'ngRoute',
    'ngSanitize',
    'angular-websocket',
    'monospaced.elastic',
    'ngDragDrop',
    'Chronicle',
    '720kb.tooltips',
    'vlui'
  ])
  .constant('ZSchema', window.ZSchema)
  .constant('jsondiffpatch', window.jsondiffpatch)
  .constant('Papa', window.Papa);

function auth() {
  var $http = angular.injector(['ng']).get('$http');
  var BaseURLService = angular.injector(['zeppelinUI']).get('BaseURLService');
  // withCredentials when running locally via grunt
  $http.defaults.withCredentials = true;

  return $http.get(BaseURLService.getRestApiBase() + '/security/ticket').then(function(response) {
    angular.module('zeppelinUI').run(function($rootScope) {
      $rootScope.ticket = angular.fromJson(response.data).body;
    });
  }, function(errorResponse) {
    // Handle error case
  });
}

function bootstrapApplication() {
  angular.bootstrap(document, ['zeppelinUI']);
}


angular.element(document).ready(function() {
  auth().then(bootstrapApplication);
});
