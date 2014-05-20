# Example of node-pelcod

This example show how to comunicate with a pelco d camera and control it from a webpage

[Youtube video](https://www.youtube.com/watch?v=MRMotnNFLpw)

## Getting Started

First you need to connect your pelco d camera to a RS232 / RS485 converter then to USB/RS-232 converter.
Change the path of serial port in server.js here: `new SerialPort("/dev/ttyUSB0"...`, the "/dev/ttyUSB0" to your own path.
The default address camera is 0x01.

```
$ git clone https://github.com/Scoup/node-pelcod
$ cd node-pelcod/example
$ npm install
$ bower install
$ node server.js
```
*Obs: install [bower](https://github.com/bower/bower) if dont have it

Change the file `./public/js/script.js` on line 3 to your ip.
Open your browser in http://your_ip:8000

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