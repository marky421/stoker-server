var Sensor = function(data) {
    this.name   = data['name'];
    this.serial = data['serial'];
    this.temps  = data['temps'];
}

Sensor.prefixSerial = 'n1';
Sensor.prefixTarget = 'ta';
Sensor.prefixLow    = 'tl';
Sensor.prefixHigh   = 'th';

module.exports = Sensor;