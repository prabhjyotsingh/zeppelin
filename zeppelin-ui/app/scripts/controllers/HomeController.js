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
 * @name zeppelinUI.controller:HomeController
 * @description
 * # HomeController
 * Controller of the zeppelinUI
 */
angular.module('zeppelinUI')
  .controller('HomeController', function($scope, WebSocketMessageService, WizardHandler, WebSocketEventsService,
                                         Common) {
    $scope.filteredTables = [];
    $scope.currentPage = 1;
    $scope.numPerPage = 8;
    $scope.maxSize = 100;
    $scope.tablenames = [];
    $scope.datasourceSelect = {};
    $scope.deleteEnabled = false;
    $scope.csvFetchComplete = false;
    $scope.textQualifier = '"';
    $scope.detectedCsvDelimiter = ';';
    $scope.model = {
      csvUrlInput: 'https://s3.amazonaws.com/apache-zeppelin/tutorial/bank/bank.csv'
    };

    $scope.getTableDetails = function() {
      var paraText = '%spark.spark\n' +
        'def fetchTableDetails(tableName:String) = {\n' +
        'println(tableName)\n' +
        'sqlContext.sql("desc "+tableName).map(t => (t(0),t(1))).collect().foreach(\n' +
        'colName => println(colName)\n' +
        ')\n' +
        '}\n' +
        'sqlContext.sql("show tables").map(t => t(0)).collect().foreach(\n' +
        'tableName => fetchTableDetails(tableName+"")\n' +
        ')';
      WebSocketEventsService.sendNewEvent({
        op: 'TEMP_RUN_NOTE',
        data: {
          paragraph: paraText
        }
      });
    };

    $scope.init = function() {
      $scope.getTableDetails();

      $('#addNewModal').on('hidden.bs.modal', function() {
        WizardHandler.wizard().goTo(0);
      });
    };

    $scope.initUploadURL = function() {
      $scope.csvFetchComplete = false;
    };

    $scope.switchTab = function(event) {
      event.preventDefault();
      $(this).tab('show');
    };

    $scope.$watch('datasourceSelect', function(datasourceTiles) {
      for (var tile in datasourceTiles) {
        if (datasourceTiles[tile].selected === true) {
          $scope.deleteEnabled = true;
          return;
        }
      }
      $scope.deleteEnabled = false;
    }, true);

    $scope.uploadUrl = function() {
      var url = $scope.model.csvUrlInput;
      $scope.model.importAs = url.split('/');
      $scope.model.importAs = $scope.model.importAs[$scope.model.importAs.length - 1].split('.')[0];
      if ($scope.csvFetchComplete) {
        return true;
      } else {
        angular.element('.btnContinue').addClass('disabled');
        angular.element('.continueSpinner').removeClass('hidden');
        var paraText = '%spark.spark\n' +
          'import org.apache.commons.io.IOUtils\n' +
          'import java.net.URL\n' +
          'import java.nio.charset.Charset\n' +
          'var TEMP_RUN_NOTE_URL_STING = IOUtils.toString(' +
          'new URL("' + url + '"),' +
          'Charset.forName("utf8"))\n' +
          'val TEMP_STRING_SPLITTER = if (-1 != (TEMP_RUN_NOTE_URL_STING indexOf "\\n") )  "\\n" else "\\r";\n' +
          'val TEMP_RUN_NOTE_SPLITTED_STING = TEMP_RUN_NOTE_URL_STING.split(TEMP_STRING_SPLITTER);\n' +
          'print("\\n"+TEMP_RUN_NOTE_SPLITTED_STING(0))';
        WebSocketEventsService.sendNewEvent({
          op: 'TEMP_RUN_NOTE',
          data: {
            paragraph: paraText
          }
        });
      }
      return false;
    };

    $scope.importData = function() {
      angular.element('.btnContinue').addClass('disabled');
      angular.element('.continueSpinner').removeClass('hidden');

      var paraText = '%spark.spark\n' +
        'val SC_TEMP_RUN_NOTE_SPLITTED_STING = sc.parallelize(TEMP_RUN_NOTE_SPLITTED_STING)\n' +
        'case class SC_TEMP_RUN_NOTE_CLASS(';

      jQuery('.csv-preview table tbody tr').each(function() {
        if (jQuery(this).find('input:checked').length > 0) {
          paraText = paraText + jQuery(this).find('input').val() + ': ' + jQuery(this).find('select').val() + ',';
        }
      });

      paraText = paraText.replace(/,$/, '');
      paraText = paraText + ')\n';

      paraText = paraText + '' +
        'val ' + $scope.model.importAs + '= SC_TEMP_RUN_NOTE_SPLITTED_STING.map(s => s.split("' + $scope.csvDelimiter +
        '")).filter(s => s(0) != "';

      var firstRow = $scope.csvString.split($scope.csvDelimiter)[0];
      if (firstRow[0] === '"') {
        paraText = paraText + '\\"' + $scope.csvString.split($scope.csvDelimiter)[0].replace(/"/g, '') + '\\"';
      } else {
        paraText = paraText + $scope.csvString.split($scope.csvDelimiter)[0];
      }

      paraText = paraText + '").map(' +
        's => SC_TEMP_RUN_NOTE_CLASS(';
      var index = 0;
      jQuery('.csv-preview table tbody tr').each(function() {
        if (jQuery(this).find('input:checked').length > 0) {
          paraText = paraText + 's(' + index + ')';
          index++;
          if (jQuery(this).find('select').val() === 'Integer') {
            paraText = paraText + '.toInt,';
          } else {
            if ($scope.textQualifier === '"') {
              paraText = paraText + '.replaceAll("\\"", ""),';
            } else {
              paraText = paraText + '.replaceAll("' + $scope.textQualifier + '", ""),';
            }

          }
        }
      });
      paraText = paraText.replace(/,$/, '');

      paraText = paraText + ')' +
        ').toDF()\n' +
        $scope.model.importAs + '.registerTempTable("' + $scope.model.importAs + '")';

      WebSocketEventsService.sendNewEvent({
        op: 'TEMP_RUN_NOTE',
        data: {
          paragraph: paraText
        }
      });
    };

    $scope.detectDelimiter = function(csvString) {
      csvString = csvString || '';
      var max = 0;
      var detectedDelimiter;
      var possibleDelimiters = [{value: ',', count: 0}, {value: ';', count: 0}, {
        value: '\t',
        count: 0
      }];
      possibleDelimiters.forEach(function(delimiter) {
          delimiter.count += csvString.split(delimiter.value).length;
        }
      );
      possibleDelimiters.forEach(function(delimiter) {
        if (delimiter.count > max) {
          max = delimiter.count;
          detectedDelimiter = delimiter.value;
        }
      });
      $scope.csvDelimiter = detectedDelimiter;
      $scope.detectedCsvDelimiter = detectedDelimiter;
    };

    $scope.$on('tempNoteFinishedOperation', function(event, note) {
      if (note) {
        if (note.note.paragraphs[0].result && note.note.paragraphs[0].result.code === 'SUCCESS') {
          if (note.note.paragraphs[0].text.indexOf('%spark.spark\nimport org.apache.commons.io.IOUtils') === 0) {
            var msg = note.note.paragraphs[0].result.msg.split('\n');
            $scope.csvString = msg[msg.length - 1];

            $scope.csvFetchComplete = true;
            $scope.csvDataUploadFinish = false;
            angular.element('.btnContinue').removeClass('disabled');
            angular.element('.continueSpinner').addClass('hidden');
            setTimeout(function() {
              WizardHandler.wizard().next();
            }, 100);
          } else if (note.note.paragraphs[0].text.indexOf('%spark.spark\nval SC_TEMP_RUN_NOTE_SPLITTED_STING') === 0) {
            $scope.csvDataUploadFinish = true;
            angular.element('.btnContinue').removeClass('disabled');
            angular.element('.continueSpinner').addClass('hidden');
            setTimeout(function() {
              WizardHandler.wizard().finish();
              angular.element('#addNewModal').modal('hide');
              $scope.getTableDetails();
            }, 100);
          } else if (note.note.paragraphs[0].text.indexOf('%spark.spark\ndef fetchTableDetails') === 0) {
            var tables = note.note.paragraphs[0].result.msg;
            tables = tables.split('\n');
            $scope.tableDetails = {};
            $scope.tablenames = [];
            var tableName = '';
            for (var idx = 1; idx < tables.length; idx++) {
              if (!Common.isEmptyString(tables[idx])) {
                if (tables[idx][0] !== '(') {
                  tableName = tables[idx];
                  $scope.tableDetails[tableName] = [];
                  $scope.tablenames.push(tableName);
                } else {
                  var rowDetails = tables[idx].replace(/[()]/g, '').split(',');
                  $scope.tableDetails[tableName].push({
                    'rowName': rowDetails[0],
                    'rowType': rowDetails[1]
                  });
                }
              }
            }

            $scope.$watch('currentPage + numPerPage', function() {
              var begin = (($scope.currentPage - 1) * $scope.numPerPage), end = begin + $scope.numPerPage;

              $scope.filteredTables = $scope.tablenames.slice(begin, end);
            });
          }
        }

      }
    });

  });
