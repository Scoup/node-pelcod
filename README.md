# node-pelcod

Module to communicate with CCTV cameras using Pelco D protocol.

This module implements the standard commands (Pan/Tilt/Zoom/Focus/Iris) and some extended commands (Preset/Aux). Other commands are still missing. Be free to fork and help!

Insipired by [hoegaarden](https://github.com/hoegaarden/node-pelco-d) pelcod project.

## Getting Started

### [npm](https://www.npmjs.org/) install
`$ npm install pelcod`

### Manual install
Just add the node_modules: [pelcod](https://github.com/Scoup/node-pelcod).
Requires a serial stream like [serialport](https://github.com/voodootikigod/node-serialport) and can also work with a memory stream like [memory-streams](https://github.com/paulja/memory-streams-js)

### Config

```javascript
var Pelcod = require('pelcod');
var pelcod = new Pelcod(stream, options)
```


## Documentation

PelcoD requires a serial port module to write the data to.

Pelco D cameras use No parity, 8 Data bits and 1 Stop bit, baud rate depends on your camera setting but is often 2400

Before you can control any Pelco-D cameras, you need to prepare the following items:
   - A RS-232 port (or USB/RS-232 converter)
   - A RS232 / RS485 converter


Pelco D has standard and extended commands. The standard command combines Pan,Tilt,Zoom,Focus,Iris,Pan Speed and Tilt Speed into a single command and so these commands can be used in a group. The extended commands carry out a single action.

## Examples

There is an example in ./example folder that reads Pan/Tilt control from a web browser and controls the camera

[Youtube video](https://www.youtube.com/watch?v=MRMotnNFLpw)


There is an example in ./example2 folder that reads the Cursor Keys and controls the camera from the command line, using the node 'keypress' package, with support for Pan, Tilt, Zoom, Focus, Iris, Presets and Aux functions



### Standard Group Command
```javascript
    pelcod.up(true)
        .left(true)
        .setPanSpeed(getSpeed(0x3F))
        .setTiltSpeed(getSpeed(0x2F))
        .send()
```

```javascript
    pelcod.zoomIn(true)
        .send()
```

## List of commands
```
up()
down()
left()
right()
zoomIn()
zoomOut()
focusNear()
focusFar()
irisOpen()
irisClose()
stop()
send()
```

### Extended Group Command
```javascript
    pelcod.sentGotoPreset(2)
```

## List of commands
```
sendSetPreset(num)
sendClearPreset(num)
sendGotoPreset(num)
sendSetAux(num)
sendClearAux(num)
sendSetZoomSpeed(num)
```


## Testing
```shell
$ mocha
```

## Todo List
- Add pelcod test
- Add documentation
- Add more extended commands

## Release History
- v0.1 - Started the first release
- v0.2 - Added the rest of the standard commands and several extended commands (contributed by Roger Hardiman)
- v0.3 - Extra extended commands (contributed by Roger Hardiman)

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
