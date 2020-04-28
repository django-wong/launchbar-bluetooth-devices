include('common.js');

/**
 * Format device json into Launchbar item
 *
 * @param      {device}  device  The device
 * @return     {item}
 */
function formatDevice(device) {
    return {
        badge: device.connected ? `Connected, ${device.rawRSSI} dpm` : 'Disconnected',
        icon: bestIconOf(device.name),
        title: device.name,
        children: showDevice(device),
        action: device.connected ? 'disconnect' : 'connect',
        actionArgument: device,
    }
}

/**
 * List all devices, by default recent 10 devices
 *
 * --favourites          list favourite devices
 * --inquiry [T]         inquiry devices in range, 10 seconds duration by default excluding time for name updates
 * --paired              list paired devices
 * --recent [N]          list recently used devices, 10 by default, 0 to list all
 */
function listDevices(args = {option: '--recent', arg: '10'}) {
    const params = [args.option || '--recent'];

    if (args.arg) {
        params.push(args.arg);
    }

    params.push(...['--format', 'json']);

    return JSON.parse(LaunchBar.execute(BLUEUTIL, ...params).trim());
}

/**
 * The entrypoint of the action
 */
function run() {
    if (!isBluetoothOn()) {
        return [TURN_ON_BLUETOOTH];
    }

    const args = { option: '--recent', arg: '10' };
    if (LaunchBar.options.commandKey) {
        args.option = '--inquiry';
    }

    const items = listDevices(args).map(formatDevice);

    items.unshift(TURN_OFF_BLUETOOTH);

    return items;
}


/**
 * Shows the device detail.
 *
 * @param      {device}  device  The device
 * @return     {items}
 */
function showDevice(device) {
    const isConnected = device.connected
    const items = [];

    items.push({
        actionRunsInBackground: true,
        action: isConnected ? 'disconnect' : 'connect',
        icon: isConnected ? 'font-awesome:toggle-off' : 'font-awesome:toggle-on',
        title: isConnected ? 'Disconnect' : 'Connect',
        actionArgument: device,
    });

    let lastConnectedAt = 'Never';

    if (device.recentAccessDate) {
        lastConnectedAt = (new Date(device.recentAccessDate)).toLocaleString();
    }

    items.push({
        title: lastConnectedAt,
        icon: 'font-awesome:info-circle',
        label: 'Last Connected At',
    });

    items.push({
        title: device.address,
        icon: 'font-awesome:info-circle',
        label: 'Address',
    });

    if (device.RSSI) {
        items.push({
            title: `${device.RSSI}, ${device.rawRSSI} dpm`,
            icon: 'font-awesome:info-circle',
            label: 'RSSI',
        });
    }

    return items;
}

/**
 * Toggle bluetooth
 */
function toggleBluetooth() {
    LaunchBar.execute(BLUEUTIL, '-p', 'toggle');
    return listDevices();
}

/**
 * Determines if bluetooth on.
 *
 * @return     {boolean}  True if bluetooth on, False otherwise.
 */
function isBluetoothOn() {
    return parseInt(LaunchBar.execute(BLUEUTIL, '-p')) === 1;
}

/**
 * Disconnects the given device.
 *
 * @param      {device}  device  The device
 */
function disconnect(device) {
    LaunchBar.execute(BLUEUTIL, '--disconnect', device.address);
    LaunchBar.hide();
    LaunchBar.displayNotification({
        title: device.name,
        string: 'Disconnected'
    });
}

/**
 * Connect to the given device
 *
 * @param      {device}  device  The device
 */
function connect(device) {
    const result = LaunchBar.execute('/bin/bash', '-c', `${BLUEUTIL} --connect ${device.address} 2>&1`);
    LaunchBar.displayNotification({
        title: device.name,
        string: result.indexOf('Failed') !== -1 ? '🥵 Failed to connect' : '🤘 Connected'
    });
}