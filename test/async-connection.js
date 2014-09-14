var PQ = require('../')
var assert = require('assert');


describe('async connection', function() {
  it('works', function(done) {
    var pq = new PQ();
    pq.connect(function(err) {
      assert.ifError(err);
      pq.exec('SELECT NOW()');
      assert.equal(pq.ntuples(), 1);
      done();
    });
  });

  it('works with hard-coded connection parameters', function(done) {
    var pq = new PQ();
    pq.connect('host=localhost', done);
  });

  it('returns an error to the callback if connection fails', function(done) {
    new PQ().connect('host=asldkfjasldkfjalskdfjasdf', function(err) {
      assert(err, 'should have passed an error');
      done();
    });
  });

  it('respects the active domain', function(done) {
    var pq = new PQ();
    var domain = require('domain').create();
    domain.run(function() {
      var activeDomain = process.domain;
      assert(activeDomain, 'Should have an active domain');
      pq.connect(function(err) {
        assert.strictEqual(process.domain, activeDomain, 'Active domain is lost');
        done();
      });
    });
  });
});
