// Path to blueutil
const BLUEUTIL = '/usr/local/bin/blueutil';

// A set of predefined icon
const ICONSET = {
    'airpods': 'font-awesome:apple',
    'apple': 'font-awesome:apple',
    'magic mouse': 'font-awesome:apple',
    'iphone': 'font-awesome:mobile',
    'android': 'font-awesome:android'
};

// Item to turn on the bluetooth
const TURN_ON_BLUETOOTH = {
    title: 'Turn Bluetooth ON',
    icon: 'font-awesome:toggle-off',
    action: 'toggleBluetooth',
    actionRunsInBackground: true,
};

// Item to turn on the bluetooth
const TURN_OFF_BLUETOOTH = {
    title: 'Turn Bluetooth OFF',
    icon: 'font-awesome:toggle-on',
    action: 'toggleBluetooth',
    actionRunsInBackground: true,
}

/**
 * Find the best icon for specified device name
 *
 * @param      {string}  deviceName  The device name
 * @return     {string}  The icon name
 */
function bestIconOf(deviceName) {
    for(const name in ICONSET){
        if(ICONSET.hasOwnProperty(name)){
            if (deviceName.toLowerCase().indexOf(name) !== -1) {
                return ICONSET[name];
            }
        }
    }
    return 'font-awesome:bluetooth';
}
