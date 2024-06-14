const { SerialPort } = require('serialport');
const Readline = require('@serialport/parser-readline');

// Nombre del puerto serial
const portName = '/dev/cu.usbmodem11301';

// Crear una instancia de SerialPort
const arduinoPort = new SerialPort({
    path: portName,
    baudRate: 9600
});

// Configurar el parser para leer los datos del puerto serie
const parser = arduinoPort.pipe(new Readline.ReadlineParser({ delimiter: '\n' }));

// Exportar la instancia de SerialPort y el parser
module.exports = { arduinoPort, parser };
