/*
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
'use strict';

angular.module('zeppelinUI').service('Common', function() {
  this.formatSCV = function(csvString, csvDelimiter, textQualifier) {
    csvString = csvString || '';
    var csvList = [];
    csvList = csvString.replace(new RegExp(textQualifier, 'g'), '').split(csvDelimiter);
    return csvList;
  };

  this.isEmptyString = function(str) {
    if (!str) {
      return true;
    } else if (str.trim() === '') {
      return true;
    }
    return false;
  };
});
