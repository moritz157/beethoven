const expect = require('chai').expect;
const pathMagic = require('./pathMagic.js');

describe('pathMagic', () => {
    it('should replace backslashes with regular slashes', () => {
        expect(pathMagic.directoryPath('C:\\Users\\Test\\Desktop\\Test\\')).to.equal('C:/Users/Test/Desktop/Test/');
        expect(pathMagic.directoryPath('/this\\is/mixed/')).to.equal('/this/is/mixed/');
        expect(pathMagic.directoryPath('\\and/has\\multiple/backslashes\\')).to.equal('/and/has/multiple/backslashes/');
    })

    it('should add missing slashes in a directory path', () => {
        expect(pathMagic.directoryPath('/test/path')).to.equal('/test/path/');
        expect(pathMagic.directoryPath('/oh well/there are/spaces')).to.equal('/oh well/there are/spaces/');
        expect(pathMagic.directoryPath('./the/final/test/in/here')).to.equal('./the/final/test/in/here/');
    })

    it('should remove .json filenames in a directory path', () => {
        expect(pathMagic.directoryPath('/test/path/test.json')).to.equal('/test/path/');
        expect(pathMagic.directoryPath('/with spaces/every where .json')).to.equal('/with spaces/');
    })

    it('should do everything at once', () => {
        expect(pathMagic.directoryPath('C:\\Users\\Test\\Desktop\\Test\\test.json')).to.equal('C:/Users/Test/Desktop/Test/');
        expect(pathMagic.directoryPath('C:\\Users\\Test\\Desktop\\Test')).to.equal('C:/Users/Test/Desktop/Test/');
    })
})