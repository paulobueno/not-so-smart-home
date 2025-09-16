const fz = require('zigbee-herdsman-converters/converters/fromZigbee');
const tz = require('zigbee-herdsman-converters/converters/toZigbee');
const exposes = require('zigbee-herdsman-converters/lib/exposes');
const reporting = require('zigbee-herdsman-converters/lib/reporting');
const e = exposes.presets;

const fzLocal = {
  action_source_name: {
    cluster: "closuresDoorLock",
    type: "raw",
    convert: (model, msg, publish, options, meta) => {
      const lookup = {
          0: 'password_unlock', //'unknown', // password 15/07
          1: 'unlock', //'lock', unlock system 15/07
          2: 'auto_lock', // 'unlock', // one touch lock and autolock 15/07
          3: 'RFID_unlock', //'lock_failure_invalid_pin_or_id', // card 15/07
          4: 'fingerprint_unlock', //'lock_failure_invalid_schedule',  // fingerprint 15/07
          5: 'unlock_failure_invalid_pin_or_id',
          6: 'unlock_failure_invalid_schedule',
          7: 'one_touch_lock',
          8: 'key_lock',
          9: 'key_unlock',
          10: 'auto_lock',
          11: 'schedule_lock',
          12: 'schedule_unlock',
          13: 'manual_lock',
          14: 'manual_unlock',
          15: 'non_access_user_operational_event',
      };
      const value = lookup[msg.data[3]];
      return { action_source_name: value }
    },
  },
  action_source_user: {
    cluster: "closuresDoorLock",
    type: "raw",
    convert: (model, msg, publish, options, meta) => {
    return { action_source_user: msg.data[5] };
    },
  },
};


const lockExtend = (meta) => {
  return {
    fromZigbee: [fzLocal.action_source_user, fzLocal.action_source_name, fz.lock, fz.battery, fz.lock_operation_event, fz.lock_programming_event, fz.lock_pin_code_response, fz.lock_user_status_response],
    toZigbee: [tz.lock, tz.pincode_lock, tz.lock_userstatus],
    meta: {pinCodeCount: 250, ...meta},
    exposes: [e.lock(), e.lock_action(), e.battery(), e.pincode()],
    configure: async (device, coordinatorEndpoint, logger) => {
      const endpoint = device.getEndpoint(1);
      await reporting.bind(endpoint, coordinatorEndpoint, ['closuresDoorLock', 'genPowerCfg']);
      await reporting.lockState(endpoint);
      await reporting.batteryPercentageRemaining(endpoint);
    },
  };
};

module.exports = [
  {
    zigbeeModel: ["YMC 420 D"],
    model: "YMC 420 D",
    vendor: "Yale",
    description: "YMC 420 D",
    extend: lockExtend(),
  },
];
