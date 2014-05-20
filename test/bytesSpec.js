var expect = require('chai').expect
    , Bytes = require('../libs/bytes')

describe('Bytes', function(){

    describe('#Bytes()', function(){
        it('should have default values', function(){
            var bts = new Bytes()
            expect(bts).to.have.ownProperty('bytes')
            expect(bts.bytes).to.be.a('array')
            expect(bts.bytes).to.have.length(7)
        })
        it('should accept default values', function(){
            var byteArray = [0x00, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06]
            var bts = new Bytes(byteArray)

            expect(bts.bytes[0].get()).to.equal(0x00)
            expect(bts.bytes[1].get()).to.equal(0x01)
            expect(bts.bytes[2].get()).to.equal(0x02)
            expect(bts.bytes[3].get()).to.equal(0x03)
            expect(bts.bytes[4].get()).to.equal(0x04)
            expect(bts.bytes[5].get()).to.equal(0x05)
            expect(bts.bytes[6].get()).to.equal(0x06)
        })
    })

    describe('#get() #set()', function(){
        it('should have get set methods', function(){
            var bts = new Bytes()  
            expect(bts.setAddress).to.be.a('function')
            expect(bts.getAddress).to.be.a('function')
            expect(bts.setCom1).to.be.a('function')
            expect(bts.getCom1).to.be.a('function')
            expect(bts.setCom2).to.be.a('function')
            expect(bts.getCom2).to.be.a('function')
            expect(bts.setData1).to.be.a('function')
            expect(bts.getData1).to.be.a('function')
            expect(bts.setData2).to.be.a('function')
            expect(bts.getData2).to.be.a('function')
            expect(bts.setChecksum).to.be.a('function')
            expect(bts.getChecksum).to.be.a('function')
        })
    })

    describe('#getBytes()', function(){
        it('should return the bytes', function(){
            var byteArray = [0x00, 0x01, 0x02, 0x03, 0x04, 0x05]
            var bts = new Bytes(byteArray)  
            var tmp = bts.getBytes()


            expect(tmp).to.eql(byteArray)
        })
    })

    describe('#getBuffer()', function(){
        it('should set the right checksum', function(){
            var byteArray = [0xFF, 0x01, 0x00, 0x04, 0x3F, 0x00]
            var bts = new Bytes(byteArray)  

            var buffer = bts.getBuffer()

            expect(buffer.toString('hex')).to.equal('ff0100043f0044')
        })
    })

    describe('#clearAll()', function(){
        it('should clear all data without address', function(){
            var byteArray = [0xFF, 0x07, 0x02, 0x03, 0x04, 0x05]
            var bts = new Bytes(byteArray) 

            bts.clearAll()
            var out = [0xFF, 0x07, 0x00, 0x00, 0x00, 0x00]

            expect(bts.getBytes()).to.eql(out)
        })
        it('should clear all data included address', function(){
            var byteArray = [0xFF, 0x07, 0x02, 0x03, 0x04, 0x05]
            var bts = new Bytes(byteArray) 

            bts.clearAll(true)
            var out = [0xFF, 0x01, 0x00, 0x00, 0x00, 0x00]

            expect(bts.getBytes()).to.eql(out)
        })
    })

    describe('#getBuffer()', function(){

    })
})