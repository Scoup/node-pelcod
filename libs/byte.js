function Byte(bits) {
    this.word = bits | 0x00;
    return this;
}

Byte.prototype.on = function(bit) {
    this.word |= (0x01 << bit);
    return this;
}

Byte.prototype.off = function(bit) {
    var mask = ~(0x01 << bit);
    this.word &= mask;
    return this;
}

Byte.prototype.get = function() {
    return this.word;
}

Byte.prototype.set = function(bits) {
	this.word = bits | 0x00;
}

module.exports = Byte;