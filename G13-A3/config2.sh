#!/bin/bash

# Initialize variables with default values
cpu="500"
memory="512"
replica="1"
service=""

# Process command line arguments
while [[ $# -gt 0 ]]; do
  case "$1" in
    cpu=*) # Using parameter names
      cpu="${1#cpu=}"
      shift
      ;;
    memory=*) # Using parameter names
      memory="${1#memory=}"
      shift
      ;;
    replica=*)
      replica="${1#replica=}"
      shift
      ;;
    service=*) # Using parameter names 
      service="${1#service=}"
      shift
      ;;
    [0-9a-z]*) # Using just values
      if [ -z "$cpu" ]; then
        cpu="$1"
      elif [ -z "$memory" ]; then
        memory="$1"
      elif [ -z "$replica" ]; then
        replica="$1"
      elif [ -z "$service" ]; then
        service="$1"
      else
        echo "Ignoring extra argument: $1"
      fi
      shift
      ;;
    *)
      echo "Invalid argument: $1"
      exit 1
      ;;
  esac
done

# Check if both CPU and memory values are provided
if [ -z "$cpu" ] || [ -z "$memory" ] || [ -z "$replica" ]; then
  echo "Usage: $0 [cpu=CPU_VALUE] [memory=MEMORY_VALUE] [replica=REPLICA_VALUE]"
  exit 1
fi

# Your script logic using the provided CPU and memory values
echo "CPU: $cpu"
echo "Memory: $memory"
echo "Replica: $replica"
echo "Service: $service"

# Define the list of yaml files
files=("deploy-acmeair-mainservice-java.yaml" "deploy-acmeair-authservice-java.yaml" "deploy-acmeair-flightservice-java.yaml" "deploy-acmeair-customerservice-java.yaml" "deploy-acmeair-bookingservice-java.yaml")

# Iterate over the services
for file in "${files[@]}"; do
  # Use sed to replace CPU and memory values
  service_=$(echo $file | grep -oE "acmeair-.*?service" | head -1)
  # echo $service_
  if [ "$service" == "" ] || [ "$service" == "$service_" ]; then
    sed -i'' -e "s/cpu: .*m/cpu: ${cpu}m/g" $file
    sed -i'' -e "s/memory: .*Mi/memory: ${memory}Mi/g" $file
    sed -i'' -e "0,/replicas: [0-9]*/s//replicas: ${replica}/" $file
    echo $service_
    oc apply -f $file
  fi
  
  # Apply the configuration with oc apply
done
