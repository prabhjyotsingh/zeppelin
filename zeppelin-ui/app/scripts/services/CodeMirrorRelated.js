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

angular.module('zeppelinUI').service('CodeMirrorRelated', function() {
  var CodeMirrorRelated = this;
  var themes = ['3024-day', '3024-night', 'abcdef', 'ambiance', 'ambiance-mobile', 'base16-dark', 'base16-light',
    'blackboard', 'cobalt', 'colorforth', 'dracula', 'eclipse', 'elegant', 'erlang-dark', 'icecoder', 'lesser-dark',
    'liquibyte', 'material', 'mbo', 'mdn-like', 'midnight', 'monokai', 'neat', 'neo', 'night', 'paraiso-dark',
    'paraiso-light', 'pastel-on-dark', 'rubyblue', 'seti', 'solarized', 'the-matrix', 'tomorrow-night-bright',
    'tomorrow-night-eighties', 'ttcn', 'twilight', 'vibrant-ink', 'xq-dark', 'xq-light', 'yeti', 'zenburn'];

  CodeMirror.commands.functionUp = function(cm) {
    var cursor = cm.getCursor();

    if (cursor.line === 1) {
      var prevPara = $(cm.display.lineDiv).parents('.paragraph-col').prev().find('.CodeMirror')[0];
      if (prevPara) {
        CodeMirrorRelated.gotoCodeMirror(prevPara.CodeMirror, 'bottom');
      }
    } else {
      cm.setCursor({line: cursor.line - 1, ch: cursor.ch, xRel: cursor.xRel});
    }
  };

  CodeMirror.commands.functionDown = function(cm) {
    var cursor = cm.getCursor();

    var line = cursor.line;
    if (line === cm.lastLine()) {
      var nextPara = $(cm.display.lineDiv).parents('.paragraph-col').next().find('.CodeMirror')[0];
      if (nextPara) {
        CodeMirrorRelated.gotoCodeMirror(nextPara.CodeMirror, 'top');
      }
    } else {
      cm.setCursor({line: cursor.line + 1, ch: cursor.ch, xRel: cursor.xRel});
    }
  };

  CodeMirrorRelated.getEditorOptions = function() {
    return angular.copy({
      lineNumbers: true,
      matchBrackets: true,
      extraKeys: {
        'Ctrl-Space': 'autocomplete',
        'Up': 'functionUp',
        'Down': 'functionDown',
        'Ctrl-A': 'functionCtrlA' //TODO implement this!!!
      },
      smartIndent: true,
      theme: themes[19],
      firstLineNumber: 0
    });
  };

  CodeMirrorRelated.jumpToLine = function(cm, lineNumber) {
    var line = parseInt(lineNumber);
    cm.setCursor({line: line, ch: 0});
    var myHeight = cm.getScrollInfo().clientHeight;
    var coords = cm.charCoords({line: line, ch: 0}, 'local');
    cm.scrollTo(null, (coords.top + coords.bottom - myHeight) / 2);
  };

  CodeMirrorRelated.gotoCodeMirror = function(cm, cursorPos) {
    cm.focus();
    if (cursorPos === 'top') {
      CodeMirrorRelated.jumpToLine(cm, 1);
    } else {
      CodeMirrorRelated.jumpToLine(cm, cm.lastLine());
    }

  };

  var interpreterCodeMirrorModeMap = {
    'markdown': ['md'],
    'htmlmixed': ['angular'],
    'shell': ['sh'],
    'sql': ['hql', 'sql', 'ignitesql', 'tql', 'oql'],
    'javascript': ['cassandra']
    //'text/plain': ['spark', 'pyspark', 'dep', 'flink', 'ignite', 'lens', 'kylin', 'anything else'],
  };

  CodeMirrorRelated.getCodeMirrorMode = function(type) {
    var self = 'text/plain';
    angular.forEach(interpreterCodeMirrorModeMap, function(value, key) {
      if (value.indexOf(type.trim()) > -1) {
        self = key;
        return false;
      }
    });
    return self;
  };

});
