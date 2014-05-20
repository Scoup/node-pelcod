var expect = require('chai').expect
    , Byte = require('../libs/byte')

describe('Byte', function(){
    describe("#Byte()", function(){
        it("should accept bits when created", function(){
            var bt = new Byte(0x07)
            expect(bt).to.have.a.property("word", 0x07)
        })
        it("should have 0x00 by default value", function(){
            var bt = new Byte()
            expect(bt).to.have.a.property("word", 0x00)
        })
    })
    describe("#on()", function(){
        it("should flip bits", function(){
            var bt = new Byte()
            bt.on(1) // 00000010
            bt.on(2) // 00000110
            expect(bt).to.have.a.property("word", 0x06)
        })
    })
    describe("#off()", function(){
        it("should flip bits", function(){
            var bt = new Byte(0x07) // 00000111
            bt.off(0) // 00000110
            bt.off(4) // 00000110
            expect(bt).to.have.a.property("word", 0x06)
        })
    })
    describe("#get()", function(){
        it("should get the word", function(){
            var bt = new Byte(0x07)
            expect(bt.get()).to.equal(0x07)
        })
    })
    describe("#set()", function(){
        it("should set the word", function(){
            var bt = new Byte()
            bt.set(0x01)
            expect(bt.get()).to.equal(0x01)
        })
    })
})