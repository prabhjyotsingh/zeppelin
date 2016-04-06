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
  .controller('ParagraphController', function($scope, $rootScope, $timeout, CodeMirrorRelated,
                                              WebSocketMessageService, Dataset, Config, Papa) {

    var ParagraphController = this;

    $scope.init = function(currentParagraph) {
      $scope.paragraph = currentParagraph;
      $scope.paragraph.editorOptions = CodeMirrorRelated.getEditorOptions();
      setTimeout(function() {
        $scope.editor = jQuery('#' + $scope.paragraph.id + ' .CodeMirror')[0].CodeMirror;

        $scope.editor.on('beforeChange', function(cm, change) {
          if (change.from.line === 0) {
            if (change.text[0][0] !== '%' || change.text[0].length < 2) {
              change.cancel();
            }
          }
        });

      }, 500);
    };

    $scope.$on('updateParagraph', function(event, data) {
      $scope.init(data.paragraph);
    });

    $rootScope.$on('interpreterBindings', function() {
      if(!$scope.paragraph.title){
        $scope.paragraph.title = 'Untitled';
      }

      if (!$scope.paragraph.text) {
        $scope.language = ParagraphController.getDefaultLanguage($scope.interpreterBindings);
        $scope.paragraph.text = $scope.language + '\n';
        $scope.mode = ParagraphController.getDefaultMode($scope.interpreterBindings);
      } else {
        $scope.language = ParagraphController.getParagraphLanguage($scope.paragraph.text.split('\n')[0]);
        ParagraphController.changeLanguage($scope.language);
      }

      $scope.paragraph.editorOptions.mode = $scope.mode.codeMirrorMode;
    });

    $rootScope.$on('updateProgress', function(event, data) {
      if (data.id === $scope.paragraph.id) {
        $scope.currentProgress = data.progress;
      }
    });

    var commitParagraph = function(title, text, config, params) {
      WebSocketMessageService.commitParagraph($scope.paragraph.id, title, text, config, params);
    };

    ParagraphController.getDefaultLanguage = function(interpreterBindings) {
      return '%' + interpreterBindings[0].name + '.' + interpreterBindings[0].interpreters[0].name;
    };

    ParagraphController.getDefaultMode = function(interpreterBindings) {
      return {
        interpreterGroup: interpreterBindings[0].name,
        interpreter: interpreterBindings[0].interpreters[0].name,
        codeMirrorMode: CodeMirrorRelated.getCodeMirrorMode(interpreterBindings[0].interpreters[0].name)
      };
    };

    ParagraphController.getParagraphLanguage = function(firstLine) {
      if (!firstLine || firstLine.indexOf('%') < 0 || firstLine.indexOf('.') < 0) {
        return ParagraphController.getDefaultLanguage($scope.interpreterBindings);
      } else {
        return firstLine;
      }
    };

    ParagraphController.changeLanguage = function(newLangauge) {
      if ($scope.paragraph.text.match('^%([a-zA-Z]*).([a-zA-Z])*\n')) {
        $scope.paragraph.text = $scope.paragraph.text.replace(/^%([a-zA-Z]*).([a-zA-Z])*\n/, newLangauge + '\n');
      } else {
        $scope.paragraph.text = $scope.paragraph.text.replace(/^/, newLangauge + '\n');
      }
      $scope.language = newLangauge;
      ParagraphController.changeMode();
      if ($scope.editor) {
        $scope.editor.setOption('mode', $scope.mode.codeMirrorMode);
      }

    };

    ParagraphController.changeMode = function() {
      if ($scope.language.match('^%([a-zA-Z]*).([a-zA-Z])*')) {
        var lan = $scope.language.split('%')[1];
        $scope.mode = {
          interpreterGroup: lan.split('.')[0],
          interpreter: lan.split('.')[1],
          codeMirrorMode: CodeMirrorRelated.getCodeMirrorMode(lan.split('.')[1])
        };
      } else {
        $scope.mode = ParagraphController.getDefaultMode();
      }
    };

    $scope.switchLanguage = function(language) {
      ParagraphController.changeLanguage(language);
    };

    $scope.emptyFunction = function() {
      $scope.paragraph.text = $scope.language + '\n';
      var cm = $scope.editor;
      setTimeout(function() {
        CodeMirrorRelated.jumpToLine(cm, cm.lastLine());
      }, 100);
    };

    $scope.getResultType = function(paragraph) {
      var pdata = (paragraph) ? paragraph : $scope.paragraph;
      if (pdata.result && pdata.result.type) {
        return pdata.result.type;
      } else {
        return 'TEXT';
      }
    };

    $scope.renderResult = function() {
      if ($scope.getResultType() === 'TABLE') {
        $scope.renderTable();
      } else if ($scope.getResultType() === 'ANGULAR') {
        $scope.renderAngular();
      } else {
        $scope.renderHtml();
      }
    };

    $scope.datasetChanged = function() {
      if (!Dataset.dataset) {
        // reset if no dataset has been set
        Dataset.dataset = Dataset.currentDataset;
        return;
      }

      console.log('reached here');
      Dataset.update(Dataset.dataset).then(function() {
        Config.updateDataset(Dataset.dataset, Dataset.type);
      });
    };

    $scope.showGraph = function() {
      var data = $scope.paragraph.result.msg;
      var result = Papa.parse(data, {
        dynamicTyping: true,
        header: true
      });
      data = result.data;
      //data.splice(data.length - 1, 1); // TODO: check why remove first line
      console.log(result);

      var dataset = {
        id: Date.now(),  // time as id
        name: 'pastedData',
        values: data,
        group: 'pasted'
      };
      Dataset.dataset = Dataset.add(angular.copy(dataset));
      $scope.datasetChanged();

      $scope.datasetName = '';
      $scope.data = '';
      jQuery('#p' + $scope.paragraph.id + '_graph_content').show();
      jQuery('#p' + $scope.paragraph.id + '_table_content').hide();
      console.log('#' + $scope.paragraph.id + '_paragraphColumn_main .success-output');
      jQuery('#' + $scope.paragraph.id + '_paragraphColumn_main .success-output').css('max-height', '700px');
    };

    $scope.showTable = function() {
      jQuery('#p' + $scope.paragraph.id + '_table_content').show();
      jQuery('#p' + $scope.paragraph.id + '_graph_content').hide();

      jQuery('#' + $scope.paragraph.id + '_paragraphColumn_main .success-output').css('max-height', '200px');
    };

    $scope.renderTable = function() {
      jQuery('#p' + $scope.paragraph.id + '_table_content').html($scope.paragraph.result.msg);
    };

    $scope.renderHtml = function() {
      if (jQuery('#p' + $scope.paragraph.id + '_html').length) {
        try {
          jQuery('#p' + $scope.paragraph.id + '_html').html($scope.paragraph.result.msg);

          jQuery('#p' + $scope.paragraph.id + '_html').find('pre code').each(function(i, e) {
            hljs.highlightBlock(e);
          });
        } catch (err) {
          console.log('HTML rendering error %o', err);
        }
      }
    };

    $scope.renderAngular = function() {
      if (angular.element('#p' + $scope.paragraph.id + '_angular').length) {
        try {
          angular.element('#p' + $scope.paragraph.id + '_angular').html($scope.paragraph.result.msg);

          $compile(angular.element('#p' + $scope.paragraph.id + '_angular').contents())($rootScope.compiledScope);
        } catch (err) {
          console.log('ANGULAR rendering error %o', err);
        }
      } else {
        $timeout($scope.renderAngular(), 10);
      }
    };

    $scope.toggleEditor = function() {
      if ($scope.paragraph.config.editorHide) {
        $scope.openEditor();
      } else {
        $scope.closeEditor();
      }
    };

    $scope.closeEditor = function() {
      console.log('close the note');

      var newParams = angular.copy($scope.paragraph.settings.params);
      var newConfig = angular.copy($scope.paragraph.config);
      newConfig.editorHide = true;

      commitParagraph($scope.paragraph.title, $scope.paragraph.text, newConfig, newParams);
    };

    $scope.openEditor = function() {
      console.log('open the note');

      var newParams = angular.copy($scope.paragraph.settings.params);
      var newConfig = angular.copy($scope.paragraph.config);
      newConfig.editorHide = false;

      commitParagraph($scope.paragraph.title, $scope.paragraph.text, newConfig, newParams);
    };

    $scope.deleteParagraph = function() {
      var result = confirm('Do you want to delete this paragraph?');
      if (result) {
        WebSocketMessageService.removeParagraph($scope.paragraph.id);
      }
    };

    $scope.runParagraph = function() {
      WebSocketMessageService.runParagraph($scope.paragraph.id, $scope.paragraph.title,
        $scope.editor.getValue(), $scope.paragraph.config, $scope.paragraph.settings.params);
    };

  });
