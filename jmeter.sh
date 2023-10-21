#!/bin/bash

# Define variables
JMETER_HOME="../../../apache-jmeter-5.6.2"
JMETER_SCRIPT="AcmeAir-microservices-mpJwt.jmx"
LOG_FILE="jMeter-log"
HOST="acmeair-g13.ece750cluster-04e8c71ff333c8969bc4cbc5a77a70f6-0000.ca-tor.containers.appdomain.cloud"
PORT=80
USER=999
RAMP=0
DELAY=1
DURATION=3000000

# Change directory
cd ./acmeair-driver/acmeair-jmeter/scripts

COUNT=1

# while true
# do
#   if [ $COUNT -eq 1 ]; then
#     sleep $DURATION
#     COUNT=$((COUNT % 3 + 1))
#     continue
#   elif [ $COUNT -eq 2 ]; then
#     THREAD=10
#   else
#     THREAD=50
#   fi

$THREAD=50

curl http://$HOST:$PORT/booking/loader/load
echo ""
curl http://$HOST:$PORT/flight/loader/load
echo ""
curl http://$HOST:$PORT/customer/loader/load?numCustomers=10000 #(note : this will load 10,000 simulated user data)
echo ""

echo $THREAD
# Run JMeter
"${JMETER_HOME}/bin/jmeter" -n -t "${JMETER_SCRIPT}" -DusePureIDs=true -JHOST="${HOST}" -JPORT="${PORT}" -j "${LOG_FILE}" -JTHREAD="${THREAD}" -JUSER="${USER}" -JDURATION="${DURATION}" -JRAMP="${RAMP}" -JDELAY="${DELAY}"
# Update count for the next iteration
COUNT=$((COUNT % 3 + 1))

# done

# Check for errors
if [ $? -ne 0 ]; then
    echo "Error: JMeter execution failed."
    exit 1
fi
