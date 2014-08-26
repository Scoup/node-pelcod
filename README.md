# node-pelcod

Module to comunicate with Pelco D protocol.

This module is still in alpha and some standard and extend commands is still missing. Be free to fork and help!

Insipired by [hoegaarden](https://github.com/hoegaarden/node-pelco-d) pelcod project.

## Getting Started

### [npm](https://www.npmjs.org/) install
`$ npm install pelcod`

### Manual install
Just add the node_modules: [pelcod](https://github.com/Scoup/node-pelcod).
Require some serial stream like [serialport](https://github.com/voodootikigod/node-serialport)

### Config

```javascript
var Pelcod = require('pelcod');
var pelcod = new Pelcod(stream, options)
```


## Documentation

PelcoD requires a serial port module to write the buffer.

Pelco D camera use No parity, 8 Data bits and 1 Stop bit, baud rate depends on your camera setting

Before you can control any Pelco-D cameras, you need to prepare the following items:
   - An RS-232 port (or USB/RS-232 converter)
   - An RS232 / RS485 converter


Pelco D has standart and extend commands. The extend commands has to be used alone. The standart commands you can use in group.

## Examples

There is a example in ./example folder

[Youtube video](https://www.youtube.com/watch?v=MRMotnNFLpw)

### Standart Group Command
```javascript
    pelcod.up(true)
        .left(true)
        .setPanSpeed(getSpeed(0x3F))
        .setTiltSpeed(getSpeed(0x2F))
        .send()
```

## List of commands
```
up()
down()
left()
right()
stop()
send()
```

## Testing
```shell
$ mocha
```

## Todo List
- Add pelcod test
- Add documentation
- Add some functions for standard and extends commands

## Release History
- v0.1 - Started the first release

## License

The MIT License (MIT)

Copyright (c) 2014 Léo Haddad M. C. Carneiro

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.