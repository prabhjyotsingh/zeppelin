// Karma configuration
// http://karma-runner.github.io/0.12/config/configuration-file.html
// Generated on 2014-08-29 using
// generator-karma 0.8.3

module.exports = function(config) {
  'use strict';

  config.set({
    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,

    // base path, that will be used to resolve files and exclude
    basePath: '../',

    // testing framework to use (jasmine/mocha/qunit/...)
    frameworks: ['jasmine'],

    // list of files / patterns to load in the browser
    files: [
      // bower:js
      'app/bower_components/jquery/dist/jquery.js',
      'app/bower_components/angular/angular.js',
      'app/bower_components/angular-bootstrap/ui-bootstrap-tpls.js',
      'app/bower_components/angular-cookies/angular-cookies.js',
      'app/bower_components/jquery-ui/jquery-ui.js',
      'app/bower_components/angular-dragdrop/src/angular-dragdrop.js',
      'app/bower_components/angular-elastic/elastic.js',
      'app/bower_components/angular-messages/angular-messages.js',
      'app/bower_components/angular-resource/angular-resource.js',
      'app/bower_components/angular-route/angular-route.js',
      'app/bower_components/angular-sanitize/angular-sanitize.js',
      'app/bower_components/angular-touch/angular-touch.js',
      'app/bower_components/codemirror/lib/codemirror.js',
      'app/bower_components/angular-ui-codemirror/ui-codemirror.js',
      'app/bower_components/angular-ui-router/release/angular-ui-router.js',
      'app/bower_components/angular-ui-tree/dist/angular-ui-tree.js',
      'app/bower_components/angular-websocket/angular-websocket.min.js',
      'app/bower_components/angular-wizard/dist/angular-wizard.min.js',
      'app/bower_components/zeroclipboard/dist/ZeroClipboard.js',
      'app/bower_components/angular-zeroclipboard/src/angular-zeroclipboard.js',
      'app/bower_components/bootstrap/dist/js/bootstrap.js',
      'app/bower_components/highlightjs/highlight.pack.js',
      'app/bower_components/papaparse/papaparse.js',
      'app/bower_components/lodash/lodash.js',
      'app/bower_components/d3/d3.js',
      'app/bower_components/topojson/topojson.js',
      'app/bower_components/chronicle/chronicle.js',
      'app/bower_components/jsondiffpatch/public/build/jsondiffpatch.js',
      'app/bower_components/angular-tooltips/dist/angular-tooltips.min.js',
      'app/bower_components/z-schema/dist/ZSchema-browser-min.js',
      'app/bower_components/angular-order-object-by/src/ng-order-object-by.js',
      'app/bower_components/angular-local-storage/dist/angular-local-storage.js',
      'app/bower_components/datalib/datalib.js',
      'app/bower_components/vega/vega.js',
      'app/bower_components/angular-mocks/angular-mocks.js',
      'app/bower_components/tether/tether.js',
      'app/bower_components/drop/dist/js/drop.js',
      'app/bower_components/heap/lib/heap.js',
      'app/bower_components/vega-lite/vega-lite.js',
      'app/bower_components/angular-ui-select/dist/select.js',
      'app/bower_components/sifter/sifter.js',
      'app/bower_components/microplugin/src/microplugin.js',
      'app/bower_components/selectize/dist/js/selectize.js',
      'app/bower_components/angular-google-analytics/dist/angular-google-analytics.min.js',
      'app/bower_components/vega-lite-ui/vlui.js',
      'app/bower_components/bootstrap3-dialog/dist/js/bootstrap-dialog.min.js',
      // endbower

      'test/spec/**/*.js'
    ],

    // list of files / patterns to exclude
    exclude: [],

    // web server port
    port: 9002,

    // Start these browsers, currently available:
    // - Chrome
    // - ChromeCanary
    // - Firefox
    // - Opera
    // - Safari (only Mac)
    // - PhantomJS
    // - IE (only Windows)
    browsers: [
      'PhantomJS'
    ],

    reporters: ['coverage','progress'],

    preprocessors: {
      'src/*/{*.js,!(test)/**/*.js}': 'coverage'
    },

    coverageReporter: {
      type: 'html',
      dir: '../reports/zeppelin-web-coverage',
      subdir: '.'
    },

    // Which plugins to enable
    plugins: [
      'karma-phantomjs-launcher',
      'karma-jasmine',
      'karma-coverage'
    ],

    // Continuous Integration mode
    // if true, it capture browsers, run tests and exit
    singleRun: false,

    colors: true,

    // level of logging
    // possible values: LOG_DISABLE || LOG_ERROR || LOG_WARN || LOG_INFO || LOG_DEBUG
    logLevel: config.LOG_INFO,

    // Uncomment the following lines if you are using grunt's server to run the tests
    // proxies: {
    //   '/': 'http://localhost:9000/'
    // },
    // URL root prevent conflicts with the site root
    // urlRoot: '_karma_'
  });
};
