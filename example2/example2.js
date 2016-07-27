//
// Pelco D Telemetry Generation Example
// Uses Node-Pelco
// (c) Roger Hardiman 2016
//
// 1) Open the serial port
// 2) Read the keyboard and send Pan, Tilt and Zoom commands to the serial port
//
// As the 'keypress' package does not have a 'keyup' event we use a timeout
// to generate a Stop command 50ms after the last keypress
//
// Please edit the value of SERIAL_PORT to match the name of your serial port
//


var PelcoD = require('../pelcod');
var keypress = require('keypress');
var SerialPort = require("serialport");
var SERIAL_PORT = '/dev/ttyUSB0';  // COM1 or /dev/ttyUSB0
var CAMERA_ADDRESS = 1;

var serialPort = new SerialPort(SERIAL_PORT, {
  baudrate: 2400,
  parity: 'none',
  dataBits: 8,
  stopBits: 1,
});


var pelcod;
var PAN_SPEED = 32;  // range 0(stop), 1(slow) to 63 (fast)
var TILT_SPEED = 32; // range 0(stop), 1(slow) to 63 (fast)
var ZOOM_SPEED = 0;  // values 0(slow),1(low med),2(high med) or 3 (fast)
var STOP_DELAY_MS = 50;
var stop_timer;
var last_ch = '';

var stream = serialPort.on("open", function(err){
	if (err) {
		console.log('Error: '+err);
		return;
	} else {
		pelcod = new PelcoD(stream);
		pelcod.setAddress(CAMERA_ADDRESS);
		read_and_process_keyboard();
	}
});

function read_and_process_keyboard() {
	// listen for the "keypress" events
	keypress(process.stdin);
	process.stdin.setRawMode(true);
	process.stdin.resume();

	console.log('PELCO TELEMETRY CONTROL for Camera ' + CAMERA_ADDRESS + ' Sending to ' + SERIAL_PORT);
	console.log('Press Cursor Keys to move camera');
	console.log('Press + and - to zoom.');
	console.log('Press i or I for Iris Open/Close control.');
	console.log('Press f or F for Focus Near/Far control.');
	console.log('Press p1 to p9 to goto preset.');
	console.log('Press s1 to s9 to set preset.');
	console.log('Press a1 to a9 to turn Aux On.');
	console.log('Press A1 to A9 to turn Aux Off.');
	console.log('Press q to quit');

	// keypress handler
	process.stdin.on('keypress', function (ch, key) {

		/* Exit on 'q' or 'Q' or 'CTRL C' */
		if ((key && key.ctrl && key.name == 'c') ||
		    (key && key.name == 'q')) {
			process.exit();
		}


		if (ch) console.log('got "keypress character"',ch);
		else if (key) console.log('got "keypress"',key.name);

		if      (key && key.name == 'up')    move(0,1,0,0,0,'up');
		else if (key && key.name == 'down')  move(0,-1,0,0,0,'down');
		else if (key && key.name == 'left')  move(-1,0,0,0,0,'left');
		else if (key && key.name == 'right') move(1,0,0,0,0,'right');
		else if (key && key.name == 'home')  move(-1,1,0,0,0,'up left');
		else if (key && key.name == 'pageup') move(1,1,0,0,0,'up right');
		else if (key && key.name == 'end')   move(-1,-1,0,0,0,'down left');
		else if (key && key.name == 'pagedown') move(1,-1,0,0,0,'down right');
		
		else if (ch  && ch       == '-')     move(0,0,-1,0,0,'zoom out');
		else if (ch  && ch       == '+')     move(0,0,1,0,0,'zoom in');
		// On English keyboards '+' is "Shift and = key"
		// Accept the "=" key as zoom in
		else if (ch  && ch       == '=')     move(0,0,1,0,0,'zoom in');
		else if (ch  && ch       == 'f')     move(0,0,0,1,0,'focus near');
		else if (ch  && ch       == 'F')     move(0,0,0,-1,0,'focus far');
		else if (ch  && ch       == 'i')     move(0,0,0,0,1,'iris open');
		else if (ch  && ch       == 'I')     move(0,0,0,0,-1,'iris close');
		
		// check if last_char was p,s,a or A and current char is a number
		else if (ch  && ch>='1' && ch <='9' && last_ch === 'p') goto_preset(ch);
		else if (ch  && ch>='1' && ch <='9' && last_ch === 's') set_preset(ch);
		else if (ch  && ch>='1' && ch <='9' && last_ch === 'a') set_aux(ch);
		else if (ch  && ch>='1' && ch <='9' && last_ch === 'A') clear_aux(ch);
		
		// last character was not a special letter so use the numeric value for PTZ
		else if (ch && ch == '8')  move(0,1,0,0,0,'up');
		else if (ch && ch == '2')  move(0,-1,0,0,0,'down');
		else if (ch && ch == '4')  move(-1,0,0,0,0,'left');
		else if (ch && ch == '6')  move(1,0,0,0,0,'right');
		else if (ch && ch == '7')  move(-1,1,0,0,0,'up left');
		else if (ch && ch == '9')  move(1,1,0,0,0,'up right');
		else if (ch && ch == '1')  move(-1,-1,0,0,0,'down left');
		else if (ch && ch == '3')  move(1,-1,0,0,0,'down right');
		else if (ch && ch == '5')  move(0,0,0,0,0,'stop');


       if (ch) last_ch = ch;

	});



	function move(pan_direction, tilt_direction, zoom_direction, focus_direction, iris_direction, msg) {
		// Step 1 - Turn off the keyboard processing (so keypresses do not buffer up)
		// Step 2 - Clear any existing 'stop' timeouts. We will re-schedule a new 'stop' command in this function 
		// Step 3 - Send the Pan/Tilt/Zoom 'move' command.
		// Step 4 - In the callback from the PTZ 'move' command we schedule the ONVIF Stop command to be executed after a short delay and re-enable the keyboard

		// Clear any pending 'stop' commands
		if (stop_timer) clearTimeout(stop_timer);

		// Move the camera
		console.log('sending move command ' + msg);

		pelcod.bytes.clearAll(false);
		pelcod.setAddress(CAMERA_ADDRESS);

		// Pan and Tilt
		if (pan_direction<0) {
			pelcod.left(true);
			pelcod.setPanSpeed(PAN_SPEED);
		}

		if (pan_direction>0) {
			pelcod.right(true);
			pelcod.setPanSpeed(PAN_SPEED);
		}

		if (tilt_direction>0) {
			pelcod.up(true);
			pelcod.setTiltSpeed(TILT_SPEED);
		}

		if (tilt_direction<0) {
			pelcod.down(true);
			pelcod.setTiltSpeed(TILT_SPEED);
		}

		// Zoom
		if (zoom_direction>0) {
			pelcod.zoomIn(true);
			pelcod.sendSetZoomSpeed(ZOOM_SPEED);
		}
		if (zoom_direction<0) {
			pelcod.zoomOut(true);
			pelcod.sendSetZoomSpeed(ZOOM_SPEED);
		}

		// Focus
		if (focus_direction>0) pelcod.focusNear(true);
		if (focus_direction<0) pelcod.focusFar(true);

		// Iris
		if (iris_direction>0) pelcod.irisOpen(true);
		if (iris_direction<0) pelcod.irisClose(true);

		pelcod.send();


		// Schedule a Stop command to run in the future 
		stop_timer = setTimeout(stop,STOP_DELAY_MS);
	}


	function stop() {
		console.log('sending stop command');
		pelcod.stop().send();
	}


	function goto_preset(preset_number) {
		console.log('sending goto preset command '+ preset_number);
		pelcod.sendGotoPreset(preset_number);
	}

	function set_preset(preset_number) {
		console.log('sending set preset command '+ preset_number);
		pelcod.sendSetPreset(preset_number);
	}

	function set_aux(aux_number) {
		console.log('sending set aux command '+ aux_number);
		pelcod.sendSetAux(aux_number);
	}

	function clear_aux(aux_number) {
		console.log('sending clear aux command '+ aux_number);
		pelcod.sendClearAux(aux_number);
	}
}


