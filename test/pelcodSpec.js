var expect = require('chai').expect
    , PelcoD = require('../pelcod')

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
        it("should work with #up and #left or #right)", function(){
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
    })

    describe("Extends Command Set", function(){
    });
})