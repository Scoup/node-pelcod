/**
 *  The MIT License (MIT)
 *
 *  Copyright (c) <2014> <Léo Haddad M. C. Carneiro> <scoup001@gmail.com> (http://github.com/Scoup/node-pelcod)
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the "Software"), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *
 *  The above copyright notice and this permission notice shall be included in
 *  all copies or substantial portions of the Software.
 *
 *  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 *  THE SOFTWARE.
 * ===============================================================================
 *
 * PelcoD Module to Node.JS
 * This module has a MIT License but the PelcoD protocol is a property of Pelco.
 * Any doubt about it contact Pelco. http://www.pelco.com/ 
 *
 * The Pelco D protocol: 
 *
 *  **** D PROTOCOL ****
 *  +------------+---------+-----------+-----------+--------+--------+-----------+
 *  |   BYTE 1   | BYTE 2  |  BYTE 3   |  BYTE 4   | BYTE 5 | BYTE 6 |  BYTE 7   |
 *  +------------+---------+-----------+-----------+--------+--------+-----------+
 *  |            |         |           |           |        |        |           |
 *  | Synch Byte | Address | Command 1 | Command 2 | Data 1 | Data 2 | Check Sum |
 *  +------------+---------+-----------+-----------+--------+--------+-----------+
 *
 *  All values below are shown in hexadecimal (base 16).
 *  The synchronization byte is always $FF.
 *  The address is the logical address of the receiver/driver being controlled.
 *  The check sum is the 8 bit (modulo 256) sum of the payload bytes (bytes 2 through 6) in the message.
 *
 *
 *  **** STANDARD COMMAND SET ****
 *  +-----------+-----------+----------+-----------+--------------------+-----------------+------------+-----------+------------+
 *  |           |   BIT 7   |  BIT 6   |   BIT 5   |       BIT 4        |      BIT 3      |   BIT 2    |   BIT 1   |   BIT 0    |
 *  +-----------+-----------+----------+-----------+--------------------+-----------------+------------+-----------+------------+
 *  |           |           |          |           |                    |                 |            |           |            |
 *  | Command 1 | Sense     | Reserved | Reserved  | Auto / Manual Scan | Camera On / Off | Iris Close | Iris Open | Focus Near |
 *  |           |           |          |           |                    |                 |            |           |            |
 *  | Command 2 | Focus Far | Zoom     | Zoom Tele | Down               | Up              | Left       | Right     | Always 0   |
 *  +-----------+-----------+----------+-----------+--------------------+-----------------+------------+-----------+------------+
 *
 *  The sense bit (command 1 bit 7) indicates the meaning of bits 4 and 3. If the sense bit is on, and bits 4 and
 *  3 are on, the command will enable auto-scan and turn the camera on. If the sense bit is off and bits 4 and 3
 *  are on the command will enable manual scan and turn the camera off. Of course, if either bit 4 or bit 3 are
 *  off then no action will be taken for those features.
 *
 *  The reserved bits (6 and 5) should be set to 0.
 *
 *  Word 5 contains the pan speed. Pan speed is in the range $00 (stop) to $3F (high speed) and $FF for
 *  “turbo” speed. Turbo speed is the maximum speed the device can obtain and is considered separately be-
 *  cause it is not generally a smooth step from high speed to turbo. That is, going from one speed to the next
 *  usually looks smooth and will provide for smooth motion with the exception of going into and out of turbo
 *  speed.
 *
 *  Word 6 contains the tilt speed. Tilt speed is in the range $00 (stop) to $3F (maximum speed).
 *  Word 7 is the check sum. The check sum is the sum of bytes (excluding the synchronization byte) modulo
 *  256.
 *
 *  **** EXTENDED COMMANDS ****
 *  In addition to the “PTZ” commands shown above, there are control commands that 
 *  allow you access to the more advanced features of some equipment.
 *  The response to one of these commands is four bytes long.
 *  The first byte is the synchronization character (FF), the second byte is the 
 *  receiver address, the third byte contains the alarm information and 
 *  the fourth byte is the check sum.
 *
 *  +--------------------------------+--------+--------+---------------------+-------------+
 *  |                                | BYTE 3 | BYTE 4 |       BYTE 5        |   BYTE 6    |
 *  +--------------------------------+--------+--------+---------------------+-------------+
 *  |                                |        |        |                     |             |
 *  | Set Preset                     | 00     | 03     | 00                  | 01 to 20    |
 *  |                                |        |        |                     |             |
 *  | Clear Preset                   | 00     | 05     | 00                  | 01 to 20    |
 *  |                                |        |        |                     |             |
 *  | Go To Preset                   | 00     | 07     | 00                  | 01 to 20    |
 *  |                                |        |        |                     |             |
 *  | Flip (180° about)              | 00     | 07     | 00                  | 21          |
 *  |                                |        |        |                     |             |
 *  | Go To Zero Pan                 | 00     | 07     | 00                  | 22          |
 *  |                                |        |        |                     |             |
 *  | Set Auxiliary                  | 00     | 09     | 00                  | 01 to 08    |
 *  |                                |        |        |                     |             |
 *  | Clear Auxiliary                | 00     | 0B     | 00                  | 01 to 08    |
 *  |                                |        |        |                     |             |
 *  | Remote Reset                   | 00     | 0F     | 00                  | 00          |
 *  |                                |        |        |                     |             |
 *  | Set Zone Start                 | 00     | 11     | 00                  | 01 to 08    |
 *  |                                |        |        |                     |             |
 *  | Set Zone End                   | 00     | 13     | 00                  | 01 to 08    |
 *  |                                |        |        |                     |             |
 *  | Write Char. To Screen          | 00     | 15     | X Position 00 to 28 | ASCII Value |
 *  |                                |        |        |                     |             |
 *  | Clear Screen                   | 00     | 17     | 00                  | 00          |
 *  |                                |        |        |                     |             |
 *  | Alarm Acknowledge              | 00     | 19     | 00                  | Alarm No.   |
 *  |                                |        |        |                     |             |
 *  | Zone Scan On                   | 00     | 1B     | 00                  | 00          |
 *  |                                |        |        |                     |             |
 *  | Zone Scan Off                  | 00     | 1D     | 00                  | 00          |
 *  |                                |        |        |                     |             |
 *  | Set Pattern Start              | 00     | 1F     | 00                  | 00          |
 *  |                                |        |        |                     |             |
 *  | Set Pattern Stop               | 00     | 21     | 00                  | 00          |
 *  |                                |        |        |                     |             |
 *  | Run Pattern                    | 00     | 23     | 00                  | 00          |
 *  |                                |        |        |                     |             |
 *  | Set Zoom Speed                 | 00     | 25     | 00                  | 00 to 03    |
 *  |                                |        |        |                     |             |
 *  | Set Focus Speed                | 00     | 27     | 00                  | 00 to 03    |
 *  |                                |        |        |                     |             |
 *  | Reset Camera to defaults       | 00     | 29     | 00                  | 00          |
 *  |                                |        |        |                     |             |
 *  | Auto-focus auto/on/off         | 00     | 2B     | 00                  | 00-02       |
 *  |                                |        |        |                     |             |
 *  | Auto Iris auto/on/off          | 00     | 2D     | 00                  | 00-02       |
 *  |                                |        |        |                     |             |
 *  | AGC auto/on/off                | 00     | 2F     | 00                  | 00-02       |
 *  |                                |        |        |                     |             |
 *  | Backlight compensation on/off  | 00     | 31     | 00                  | 01-02       |
 *  |                                |        |        |                     |             |
 *  | Auto white balance on/off      | 00     | 33     | 00                  | 01-02       |
 *  |                                |        |        |                     |             |
 *  | Enable device phase delay mode | 00     | 35     | 00                  | 00          |
 *  |                                |        |        |                     |             |
 *  | Set shutter speed              | 00     | 37     | Any                 | Any         |
 *  |                                |        |        |                     |             |
 *  | Adjust line lock phase delay   | 00-01  | 39     | Any                 | Any         |
 *  |                                |        |        |                     |             |
 *  | Adjust white balance (R-B)     | 00-01  | 3B     | Any                 | Any         |
 *  |                                |        |        |                     |             |
 *  | Adjust white balance (M-G)     | 00-01  | 3D     | Any                 | Any         |
 *  |                                |        |        |                     |             |
 *  | Adjust gain                    | 00-01  | 3F     | Any                 | Any         |
 *  |                                |        |        |                     |             |
 *  | Adjust auto-iris level         | 00-01  | 41     | Any                 | Any         |
 *  |                                |        |        |                     |             |
 *  | Adjust auto-iris peak value    | 00-01  | 43     | Any                 | Any         |
 *  |                                |        |        |                     |             |
 *  | Query*                         | 00     | 45     | Any                 | Any         |
 *  +--------------------------------+--------+--------+---------------------+-------------+
 *
 *  * This command can only be used in a point to point application. A device 
 *  being queried will respond to any address.
 *  Therefore, if more than one device hears this command, you will have 
 *  multiple devices transmitting at the same time.
 */

var a = 1
    , SYNC = 0xFF
    , Bytes = require('./libs/bytes')
    , extend = require('node.extend')

function PelcoD(stream, options) {
    this.stream = stream

    var defaultOptions = {
        addrs: [],
        defaultAddr: 0x01
    }
    this.options = extend(defaultOptions, options)

    var bts = [
        SYNC                        // sync
        , this.options.defaultAddr  // address
        , 0x00                        // command 1
        , 0x00                        // command 2
        , 0x00                        // data 1
        , 0x00                        // data 2
        , 0x00                        // checksum
    ]

    var extended_bts = [
        SYNC                        // sync
        , this.options.defaultAddr  // address
        , 0x00                        // command 1
        , 0x00                        // command 2
        , 0x00                        // data 1
        , 0x00                        // data 2
        , 0x00                        // checksum
    ]
    
    this.bytes = new Bytes(bts)
    this.extended_bytes = new Bytes(extended_bts)
}


/**** CONFIG COMMANDS ****/

PelcoD.prototype.setAddress = function(value) {
    this.bytes.setAddress(value)
    this.extended_bytes.setAddress(value)
}

PelcoD.prototype.setAddrDefault = function(value) {
    this.options.defaultAddr = this.options.addrs[value]
}

/**** STANDARD COMMAND SET ****/

PelcoD.prototype.setPanSpeed = function(speed) {
    if(speed < 0x00 || speed > 0xFF)
        speed = 0x00
    this.bytes.getData1().set(speed)
    return this
}

PelcoD.prototype.setTiltSpeed = function(speed) {
    if(speed < 0x00 || speed > 0x3F)
        speed = 0x00
    this.bytes.getData2().set(speed)
    return this
}

PelcoD.prototype.up = function(status) {
    if(status === true) {
        this.bytes.getCom2().on(0x03)
        this.bytes.getCom2().off(0x04)
    } else {
        this.bytes.getCom2().off(0x03)
    }
    return this
}

PelcoD.prototype.down = function(status) {
    if(status === true) {
        this.bytes.getCom2().on(0x04)
        this.bytes.getCom2().off(0x03)
    } else {
        this.bytes.getCom2().off(0x04)
    }
    return this
}

PelcoD.prototype.left = function(status) {
    if(status === true) {
        this.bytes.getCom2().on(0x02)
        this.bytes.getCom2().off(0x01)
    } else {
        this.bytes.getCom2().off(0x02)
    }
    return this
}

PelcoD.prototype.right = function(status) {
    if(status === true) {
        this.bytes.getCom2().on(0x01)
        this.bytes.getCom2().off(0x02)
    } else {
        this.bytes.getCom2().off(0x01)
    }
    return this
}

PelcoD.prototype.focusNear = function(status) {
    if(status === true) {
        this.bytes.getCom1().on(0x00)
        this.bytes.getCom2().off(0x07)
    } else {
        this.bytes.getCom1().off(0x00)
    }
    return this
}

PelcoD.prototype.focusFar = function(status) {
    if(status === true) {
        this.bytes.getCom2().on(0x07)
        this.bytes.getCom1().off(0x00)
    } else {
        this.bytes.getCom2().off(0x07)
    }
    return this
}

PelcoD.prototype.irisOpen = function(status) {
    if(status === true) {
        this.bytes.getCom1().on(0x01)
        this.bytes.getCom1().off(0x02)
    } else {
        this.bytes.getCom1().off(0x01)
    }
    return this
}

PelcoD.prototype.irisClose = function(status) {
    if(status === true) {
        this.bytes.getCom1().on(0x02)
        this.bytes.getCom1().off(0x01)
    } else {
        this.bytes.getCom1().off(0x02)
    }
    return this
}

PelcoD.prototype.zoomIn = function(status) {
    if(status === true) {
        this.bytes.getCom2().on(0x05)
        this.bytes.getCom2().off(0x06)
    } else {
        this.bytes.getCom2().off(0x05)
    }
    return this
}

PelcoD.prototype.zoomOut = function(status) {
    if(status === true) {
        this.bytes.getCom2().on(0x06)
        this.bytes.getCom2().off(0x05)
    } else {
        this.bytes.getCom2().off(0x06)
    }
    return this
}


/***** ENUM METHODS *****/
/*
PelcoD.prototype.PAN = { STOP: 0, LEFT: 1, RIGHT: 2 };
PelcoD.prototype.TILT = { STOP: 0, UP: 1, DOWN: 2 };
PelcoD.prototype.ZOOM = { STOP: 0, IN: 1, OUT: 2 };
PelcoD.prototype.FOCUS = { STOP: 0, NEAR: 1, FAR: 2 };
PelcoD.prototype.IRIS = { STOP: 0, OPEN: 1, CLOSE: 2 };

PelcoD.prototype.setPan = function(status) {
    if(status === this.PAN.STOP) {
        this.bytes.getCom2().off(0x01)
        this.bytes.getCom2().off(0x02)
    }
    if(status === this.PAN.LEFT) {
        this.bytes.getCom2().off(0x01)
        this.bytes.getCom2().on(0x02)
    }
    if(status === this.PAN.RIGHT) {
        this.bytes.getCom2().on(0x01)
        this.bytes.getCom2().off(0x02)
    }
    return this
}

PelcoD.prototype.setTilt = function(status) {
    if(status === this.TILT.STOP) {
        this.bytes.getCom2().off(0x03)
        this.bytes.getCom2().off(0x04)
    }
    if(status === this.TILT.UP) {
        this.bytes.getCom2().on(0x03)
        this.bytes.getCom2().off(0x04)
    }
    if(status === this.TILT.DOWN) {
        this.bytes.getCom2().off(0x03)
        this.bytes.getCom2().on(0x04)
    }
    return this
}

PelcoD.prototype.setFocus = function(status) {
    if(status === this.FOCUS.STOP) {
        this.bytes.getCom1().off(0x00)
        this.bytes.getCom2().off(0x07)
    }
    if(status === this.FOCUS.NEAR) {
        this.bytes.getCom1().on(0x00)
        this.bytes.getCom2().off(0x07)
    }
    if(status === this.FOCUS.FAR) {
        this.bytes.getCom1().off(0x00)
        this.bytes.getCom2().on(0x07)
    }
    return this
}

PelcoD.prototype.setIris = function(status) {
    if(status === this.IRIS.STOP) {
        this.bytes.getCom1().off(0x01)
        this.bytes.getCom1().off(0x02)
    }
    if(status === this.IRIS.OPEN) {
        this.bytes.getCom1().on(0x01)
        this.bytes.getCom1().off(0x02)
    }
    if(status === this.IRIS.CLOSE) {
        this.bytes.getCom1().off(0x01)
        this.bytes.getCom1().on(0x02)
    }
    return this
}

PelcoD.prototype.setZoom = function(status) {
    if(status === this.ZOOM.STOP) {
        this.bytes.getCom2().off(0x05)
        this.bytes.getCom2().off(0x06)
    }
    if(status === this.ZOOM.IN) {
        this.bytes.getCom2().on(0x05)
        this.bytes.getCom2().off(0x06)
    }
    if(status === this.ZOOM.OUT) {
        this.bytes.getCom2().off(0x05)
        this.bytes.getCom2().on(0x06)
    }
    return this
}
*/

/***** EXTENDED COMMANDS *****/

PelcoD.prototype.sendSetPreset = function(position, callback) {
    this.extended_bytes.clearAll(false)
        .setCom2(0x03)
        .setData2(position)
       
    this.send_extended(callback)

    return this
}

PelcoD.prototype.sendClearPreset = function(position, callback) {
    this.extended_bytes.clearAll(false)
        .setCom2(0x05)
        .setData2(position)

    this.send_extended(callback)

    return this
}

PelcoD.prototype.sendGotoPreset = function(position, callback) {
    this.extended_bytes.clearAll(false)
        .setCom2(0x07)
        .setData2(position)

    this.send_extended(callback)

    return this
}

PelcoD.prototype.sendSetAux = function(aux, callback) {
    this.extended_bytes.clearAll(false)
        .setCom2(0x09)
        .setData2(aux)

    this.send_extended(callback)

    return this
}

PelcoD.prototype.sendClearAux = function(aux, callback) {
    this.extended_bytes.clearAll(false)
        .setCom2(0x0B)
        .setData2(aux)

    this.send_extended(callback)

    return this
}

PelcoD.prototype.sendSetZoomSpeed = function(speed, callback) {
    this.extended_bytes.clearAll(false)
        .setCom2(0x25)
        .setData2(speed)

    this.send_extended(callback)

    return this
}

/**** OTHER COMMANDS ****/

PelcoD.prototype.setCamera = function(status) {
    if(status === true) {
        this.bytes.getCom1().on(0x07)
        this.bytes.getCom1().on(0x03)
    } else {
        this.bytes.getCom1().off(0x03)
        this.bytes.getCom1().off(0x07)
    }
    return this
}

PelcoD.prototype.setCameraAuto = function(status) {
    if(status === true) 
        this.bytes.getCom1().on(0x04)
    else
        this.bytes.getCom1().off(0x04)
    return this
}


/**** HELPFUL COMMANDS ****/

/**
 * Stop moving
 */
PelcoD.prototype.stop = function() {
    this.setTiltSpeed(0)
        .setPanSpeed(0)
        .left(0)
        .right(0)
        .up(0)
        .down(0)
        .zoomIn(0)
        .zoomOut(0)
        .focusNear(0)
        .focusFar(0)
        .irisOpen(0)
        .irisClose(0)

    return this
}

/**
 * Build the byte and send it to stream
 */
PelcoD.prototype.send = function(callback) {
    var buffer = this.bytes.getBuffer()
    if(typeof(this.stream) === 'undefined' || typeof(this.stream.write) === 'undefined')
        console.warn('Stream pipe not found')
    else
        this.stream.write(buffer, callback)
    return this
}

PelcoD.prototype.send_extended = function(callback) {
    var buffer = this.extended_bytes.getBuffer()
    if(typeof(this.stream) === 'undefined' || typeof(this.stream.write) === 'undefined')
        console.warn('Stream pipe not found')
    else
        this.stream.write(buffer, callback)
    return this
}


module.exports = PelcoD;




