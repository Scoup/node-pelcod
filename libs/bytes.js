var Byte = require('./byte')

function Bytes(bytesArray) {

	if(bytesArray != null) {
		this.bytes = []
		for(var i = 0; i < 7; i++) {
			if(typeof(bytesArray[i]) != 'undefined')
				this.bytes[i] = new Byte(bytesArray[i])
			else
				this.bytes[i] = new Byte()
		}

	} else {
		this.bytes = [
			new Byte(0xFF)		// sync
				, new Byte(0x01)	// address
				, new Byte()		// command 1
				, new Byte()		// command 2
				, new Byte()		// data 1
				, new Byte()		// data 2
				, new Byte()		// checksum
		]
	}
}

Bytes.prototype.setAddress = function(value) {
	this.bytes[1].set(value)
	return this
}

Bytes.prototype.getAddress = function() {
	return this.bytes[1]
}

Bytes.prototype.setCom1 = function(value) {
	this.bytes[2].set(value)
	return this
}

Bytes.prototype.getCom1 = function() {
	return this.bytes[2]
}

Bytes.prototype.setCom2 = function(value) {
	this.bytes[3].set(value)
	return this
}

Bytes.prototype.getCom2 = function() {
	return this.bytes[3]
}

Bytes.prototype.setData1 = function(value) {
	this.bytes[4].set(value)
	return this
}

Bytes.prototype.getData1 = function() {
	return this.bytes[4]
}

Bytes.prototype.setData2 = function(value) {
	this.bytes[5].set(value)
	return this
}

Bytes.prototype.getData2 = function() {
	return this.bytes[5]
}

Bytes.prototype.setChecksum = function(value) {
	this.bytes[6].set(value)
	return this
}

Bytes.prototype.getChecksum = function() {
	return this.bytes[6]
}

Bytes.prototype.getBytes = function() {
	var output = []
	for(var i = 0; i < 6; i++) {
		var value = this.bytes[i].get()
		output.push(value)
	}
	return output
}

Bytes.prototype.getBuffer = function() {
	var array = this.getBytes()
	array = setChecksum(array)
	return new Buffer(array)
}

Bytes.prototype.clearAll = function(withAddress) {
	if(withAddress === true) {
		this.setAddress(0x01)
	}
	this.setData1(0x00)
	this.setData2(0x00)
	this.setCom1(0x00)
	this.setCom2(0x00)
	this.setChecksum(0x00)
	return this
}

function setChecksum(byteArray) {
	var sum = 0x00
	var max = byteArray.length
	for(var i = 1; i < max; i++) {
		sum += byteArray[i]
	}

	sum = sum % 256

	byteArray[max++] = sum
	return byteArray
}

module.exports = Bytes;