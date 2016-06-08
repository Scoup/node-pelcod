var expect = require('chai').expect
    , PelcoD = require('../pelcod')
    , MemoryStreams = require('memory-streams')

describe('PelcoD', function(){

    describe("#PelcoD", function() {
        it('should have default values', function(){
            var pelcod = new PelcoD({}, {})
            expect(pelcod).to.be.a('object')
            expect(pelcod).to.have.ownProperty('options')
            expect(pelcod.options).to.be.a('object')
            expect(pelcod.bytes).to.be.a('object')
        })
        it('should accept options', function(){
            var addrs = [1,2]
            var pelcod = new PelcoD({}, {
                addrs: addrs,
                defaultAddr: 0x02
            })
            expect(pelcod.options.defaultAddr).to.equal(0x02)
            expect(pelcod.options.addrs).to.equal(addrs)
        })

    })

    describe("Exist functions", function() {
        var pelcod = new PelcoD({}, {})
        it('should have its functions', function(){
            expect(pelcod.setAddress).to.be.a('function')
            expect(pelcod.setAddrDefault).to.be.a('function')
            expect(pelcod.setPanSpeed).to.be.a('function')
            expect(pelcod.setTiltSpeed).to.be.a('function')
            expect(pelcod.up).to.be.a('function')
            expect(pelcod.down).to.be.a('function')
            expect(pelcod.left).to.be.a('function')
            expect(pelcod.right).to.be.a('function')
            expect(pelcod.setPreset).to.be.a('function')
            expect(pelcod.clearPreset).to.be.a('function')
            expect(pelcod.setCamera).to.be.a('function')
            expect(pelcod.setCameraAuto).to.be.a('function')
            expect(pelcod.setFocusNear).to.be.a('function')
            expect(pelcod.stop).to.be.a('function')
            expect(pelcod.send).to.be.a('function')  
        })
    })

    describe("Config Commands", function(){
        var pelcod = new PelcoD({}, {})
        it('should set #setAddress', function(){
            pelcod.setAddress(0x05)
            expect(pelcod.bytes.getAddress().get()).to.be.equal(0x05)
        })
    })

    describe("Start Command Set", function(){
        it("should #setPanSpeed works", function(){
            var pelcod = new PelcoD({}, {})
            pelcod.setPanSpeed(-50)
            expect(pelcod.bytes.getData1().get()).to.be.equal(0)
            pelcod.setPanSpeed(0xFFF)
            expect(pelcod.bytes.getData1().get()).to.be.equal(0)
            pelcod.setPanSpeed(0x10)
            expect(pelcod.bytes.getData1().get()).to.be.equal(0x10)
        })
        it("should #setTiltSpeed works", function(){
            var pelcod = new PelcoD({}, {})
            pelcod.setTiltSpeed(-50)
            expect(pelcod.bytes.getData2().get()).to.be.equal(0)
            pelcod.setTiltSpeed(0xFFF)
            expect(pelcod.bytes.getData2().get()).to.be.equal(0)
            pelcod.setTiltSpeed(0x10)
            expect(pelcod.bytes.getData2().get()).to.be.equal(0x10)
        })
        it("should #up works", function(){
            var pelcod = new PelcoD({}, {})
            pelcod.up(true)
            expect(pelcod.bytes.getCom2().get()).to.be.equal(0x08)
            pelcod.up(false)
            expect(pelcod.bytes.getCom2().get()).to.be.equal(0)
        })
        it("should #down works", function(){
            var pelcod = new PelcoD({}, {})
            pelcod.down(true)
            expect(pelcod.bytes.getCom2().get()).to.be.equal(0x10)
            pelcod.down(false)
            expect(pelcod.bytes.getCom2().get()).to.be.equal(0)
        })
        it("should #left works", function(){
            var pelcod = new PelcoD({}, {})
            pelcod.left(true)
            expect(pelcod.bytes.getCom2().get()).to.be.equal(0x04)
            pelcod.left(false)
            expect(pelcod.bytes.getCom2().get()).to.be.equal(0)
        })
        it("should #right works", function(){
            var pelcod = new PelcoD({}, {})
            pelcod.right(true)
            expect(pelcod.bytes.getCom2().get()).to.be.equal(0x02)
            pelcod.right(false)
            expect(pelcod.bytes.getCom2().get()).to.be.equal(0)
        })
        it("should invert #down and #up", function(){
            var pelcod = new PelcoD({}, {})
            pelcod.up(true)
            pelcod.down(true)
            expect(pelcod.bytes.getCom2().get()).to.be.equal(0x10)
            pelcod.down(true)
            pelcod.up(true)
            expect(pelcod.bytes.getCom2().get()).to.be.equal(0x08)
        })
        it("should invert #left and #right", function(){
            var pelcod = new PelcoD({}, {})
            pelcod.left(true)
            pelcod.right(true)
            expect(pelcod.bytes.getCom2().get()).to.be.equal(0x02)
            pelcod.right(true)
            pelcod.left(true)
            expect(pelcod.bytes.getCom2().get()).to.be.equal(0x04)
        })
        it("should work with #up and #left or #right", function(){
            var pelcod = new PelcoD({}, {})
            pelcod.up(true)
            pelcod.left(true)
            expect(pelcod.bytes.getCom2().get()).to.be.equal(0xC)
            pelcod.right(true)
            expect(pelcod.bytes.getCom2().get()).to.be.equal(0xA)
        })
        it("should work with #down and #left or #right", function(){
            var pelcod = new PelcoD({}, {})
            pelcod.down(true)
            pelcod.left(true)
            expect(pelcod.bytes.getCom2().get()).to.be.equal(0x14)
            pelcod.right(true)
            expect(pelcod.bytes.getCom2().get()).to.be.equal(0x12)
        })
        it("should work with #setFocusNear", function(){
            var pelcod = new PelcoD({}, {})
            pelcod.setFocusNear(true)
            expect(pelcod.bytes.getCom1().get()).to.be.equal(0x1)
            pelcod.setFocusNear(false)
            expect(pelcod.bytes.getCom1().get()).to.be.equal(0x0)
        })
        it("should work with #stop", function(){
            var pelcod = new PelcoD({}, {})
            pelcod.down(true)
            pelcod.left(true)
            pelcod.setPanSpeed(0x10)
            pelcod.setTiltSpeed(0x10)
            pelcod.stop()
            expect(pelcod.bytes.getCom2().get()).to.be.equal(0x0)
            expect(pelcod.bytes.getData1().get()).to.be.equal(0x0)
            expect(pelcod.bytes.getData2().get()).to.be.equal(0x0)
        })
        it("should write to a stream (memory-stream)", function(){
            var stream = new MemoryStreams.WritableStream()
            var pelcod = new PelcoD(stream, {})
            pelcod.bytes.clearAll(false)
            pelcod.setAddress(1);
            pelcod.up(true);
            pelcod.setTiltSpeed(0x3F);
            pelcod.send()
            expect(stream.toBuffer().length).to.be.equal(7)
        })
        it("should not write to a non-writable stream (memory-stream)", function(){
            // This test is for code coverage stats. There is no output to check
            // console.log error will be generated
            var stream = new MemoryStreams.ReadableStream()
            var pelcod = new PelcoD(stream, {})
            pelcod.bytes.clearAll(false)
            pelcod.setAddress(1);
            pelcod.up(true);
            pelcod.setTiltSpeed(0x3F);
            pelcod.send()
            expect(1).to.be.equal(1)
        })
        it("should send valid data and valid checksum", function(){
            var stream = new MemoryStreams.WritableStream()
            var pelcod = new PelcoD(stream, {})
            pelcod.bytes.clearAll(false)
            pelcod.setAddress(1);
            pelcod.up(true);
            pelcod.setTiltSpeed(0x3F);
            pelcod.send()
            expect(stream.toBuffer()[0]).to.be.equal(0xFF)
            expect(stream.toBuffer()[1]).to.be.equal(0x01)
            expect(stream.toBuffer()[2]).to.be.equal(0x00)
            expect(stream.toBuffer()[3]).to.be.equal(0x08)
            expect(stream.toBuffer()[4]).to.be.equal(0x00)
            expect(stream.toBuffer()[5]).to.be.equal(0x3F)
            expect(stream.toBuffer()[6]).to.be.equal(0x48)
        })
        it("should test checksum mod 256", function(){
            var stream = new MemoryStreams.WritableStream() 
            var pelcod = new PelcoD(stream, {})
            pelcod.bytes.clearAll(false)
            pelcod.setAddress(240);
            pelcod.up(true);
            pelcod.setTiltSpeed(0x3F);
            pelcod.send()
            expect(stream.toBuffer()[0]).to.be.equal(0xFF)
            expect(stream.toBuffer()[1]).to.be.equal(240)
            expect(stream.toBuffer()[2]).to.be.equal(0x00)
            expect(stream.toBuffer()[3]).to.be.equal(0x08)
            expect(stream.toBuffer()[4]).to.be.equal(0x00)
            expect(stream.toBuffer()[5]).to.be.equal(0x3F)
            expect(stream.toBuffer()[6]).to.be.equal(0x37)
        })
    })

    describe("Extends Command Set", function(){
    });
})