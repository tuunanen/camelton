'use strict';

var Camelton = require('../index.js');

exports.index = {
  camelton: {
    setUp: function(callback) {
      this.source              = './tests/fixtures/source-1.json';
      this.sourceCorrupt       = './tests/fixtures/source-1-corrupt.json';
      this.destination         = './tests/fixtures/destination-1.json';
      this.destinationCorrupt  = './tests/fixtures/destination-1-corrupt.json';

      callback();
    },
    testInitialization: function(test) {
      var _this = this,

          camelton = new Camelton(this.source, this.destination),
          cameltonCustomized = new Camelton(this.source, this.destination, {
            sort: 'asc',
            verbose: true
          });

      test.expect(6);

      // Using `new` is enforced in constructor.
      test.ok(Camelton(this.source, this.destination) instanceof Camelton, // jshint ignore:line
        'Using `new` is enforced in constructor.');

      // Throws an error if no source file is defined.
      test.throws(
        function() {
          new Camelton(null, _this.destination);
        },
        Error,
        'Throws an error if no source file is defined.'
      );
      // Throws an error if no destination file is defined.
      test.throws(
        function() {
          new Camelton(_this.source, null);
        },
        Error,
        'Throws an error if no destination file is defined.'
      );
      // An array of files is supported as destination.
      test.doesNotThrow(
        function() {
          new Camelton(_this.source, [_this.destination]);
        },
        Error,
        'An array of files is supported as destination.'
      );

      // Creates an options object with defaults.
      test.deepEqual(camelton.options, {verbose: false},
        'Creates an options object with defaults.');
      // Creates an options object with user specified values.
      test.deepEqual(cameltonCustomized.options, {
            sortObjOptions: {sortOrder: 'asc'},
            sort: 'asc',
            verbose: true
        },
        'Creates an options object with user specified values.');

      test.done();
    },

    testRun: function(test) {
      var _this = this;

      test.expect(2);

      // Throws an error if source file is not valid JSON.
      test.throws(
        function() {
          var camelton = new Camelton(_this.sourceCorrupt, _this.destination);
          camelton.run();
        },
        Error,
        'Throws an error if source file is not valid JSON.'
      );
      // Silently fails if destination file is not valid JSON (does not throw).
      test.doesNotThrow(
        function() {
          var camelton = new Camelton(_this.source, _this.destinationCorrupt);
          camelton.run();
        },
        Error,
        'Silently fails if destination file is not valid JSON (does not throw).'
      );

      test.done();
    }
  }
};
