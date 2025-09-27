#!/bin/sh
# Install envsubst if not available
apk add --no-cache gettext

# Process configuration file conditionally
if [ ! -f /output/zigbee2mqtt/configuration.yaml ]; then
    envsubst < /input/zigbee2mqtt/configuration.yaml > /output/zigbee2mqtt/configuration.yaml
fi

# Copy files only if they don't exist (won't overwrite)
cp -n /input/zigbee2mqtt/*.db /output/zigbee2mqtt/ 2>/dev/null || true
cp -n /input/zigbee2mqtt/*.js /output/zigbee2mqtt/ 2>/dev/null || true
cp -n /input/mosquitto/mosquitto.conf /output/mosquitto/mosquitto.conf 2>/dev/null || true


echo "Configuration file generated successfully"
