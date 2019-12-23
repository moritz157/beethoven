const expect = require('chai').expect;
const should = require('chai').should();

const beethoven = require('./index.js')

describe('beethoven', function () {
    it('should be an object', function () {
        expect(typeof beethoven).to.equal('object');
    });
});