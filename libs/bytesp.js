var Byte = require('./byte')

function BytesP(bytesArray) {

	if(bytesArray != null) {
		this.bytes = []
		for(var i = 0; i < 8; i++) {
			if(typeof(bytesArray[i]) != 'undefined')
				this.bytes[i] = new Byte(bytesArray[i])
			else
				this.bytes[i] = new Byte()
		}

	} else {
		this.bytes = [
			new Byte(0xA0)		// STX 
				, new Byte(0x01)	// address
				, new Byte()		// command 1
				, new Byte()		// command 2
				, new Byte()		// data 1
				, new Byte()		// data 2
				, new Byte()		// ETX
				, new Byte()		// checksum
		]
	}
}

BytesP.prototype.setAddress = function(value) {
	this.bytes[1].set(value)
	return this
}

BytesP.prototype.getAddress = function() {
	return this.bytes[1]
}

BytesP.prototype.setCom1 = function(value) {
	this.bytes[2].set(value)
	return this
}

BytesP.prototype.getCom1 = function() {
	return this.bytes[2]
}

BytesP.prototype.setCom2 = function(value) {
	this.bytes[3].set(value)
	return this
}

BytesP.prototype.getCom2 = function() {
	return this.bytes[3]
}

BytesP.prototype.setData1 = function(value) {
	this.bytes[4].set(value)
	return this
}

BytesP.prototype.getData1 = function() {
	return this.bytes[4]
}

BytesP.prototype.setData2 = function(value) {
	this.bytes[5].set(value)
	return this
}

BytesP.prototype.getData2 = function() {
	return this.bytes[5]
}

BytesP.prototype.setChecksum = function(value) {
	this.bytes[7].set(value)
	return this
}

BytesP.prototype.getChecksum = function() {
	return this.bytes[7]
}

BytesP.prototype.getBytes = function() {
	var output = []
	for(var i = 0; i < 7; i++) {
		var value = this.bytes[i].get()
		output.push(value)
	}
	return output
}

BytesP.prototype.getBuffer = function() {
	var array = this.getBytes()
	array = setChecksum(array)
	return new Buffer(array)
}

BytesP.prototype.clearAll = function(withAddress) {
	if(withAddress === true) {
		this.setAddress(0x00)
	}
	this.setData1(0x00)
	this.setData2(0x00)
	this.setCom1(0x00)
	this.setCom2(0x00)
	this.setChecksum(0x00)
	return this
}

function setChecksum(byteArray) {
	var checksum = 0x00
	var max = byteArray.length
	for(var i = 0; i < max; i++) {
		checksum = checksum ^ byteArray[i]
	}

	byteArray[max++] = checksum
	return byteArray
}

module.exports = BytesP
