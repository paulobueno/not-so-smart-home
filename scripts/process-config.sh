#!/bin/sh
# Install envsubst if not available
apk add --no-cache gettext

# Process the template and create the configuration
envsubst < /input/zigbee2mqtt/configuration.yaml > /output/zigbee2mqtt/configuration.yaml
cp /input/zigbee2mqtt/*.db /output/zigbee2mqtt/
cp /input/zigbee2mqtt/*.js /output/zigbee2mqtt/
cp /input/mosquitto/mosquitto.conf /output/mosquitto/mosquitto.conf

echo "Configuration file generated successfully"
