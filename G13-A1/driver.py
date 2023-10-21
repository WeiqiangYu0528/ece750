import os
import sys
import json
import time
from datetime import datetime
sys.path.append("python-sdc-client")
from sdcclient import IbmAuthHelper, SdMonitorClient

# IBM Cloud API Credentials
URL = "https://ca-tor.monitoring.cloud.ibm.com"
APIKEY = "xiEparnIvPMBshEpuZ3pfmFrhpJyRlRNNmC1n_SjB_QG"
GUID = "b92c514a-ca21-4548-b3f0-4d6391bab407"

# Sysdig Data API Query Parameters
START = -3600
END = 0
SAMPLING = 10
FILTER = 'kubernetes.namespace.name="acmeair-g13"'

# Function to fetch data from IBM Cloud
def fetch_data_from_ibm_cloud(sdclient, id, aggregation):
    # Specify the metric to query
    metric = [
        # segmentation metric
        {"id": "kubernetes.deployment.name"},
        # Specify the ID for keys, and ID with aggregation for values
        {"id": id,
        "aggregations": {
            "time": aggregation,
            "group": "avg"
        }
        }]

    # Query the metric
    ok, res = sdclient.get_data(metrics = metric,  # metrics list
                                start_ts = START,  # start_ts = 600 seconds ago
                                end_ts = END,
                                sampling_s= SAMPLING,
                                filter= FILTER)  # end_ts = now

    # Check if the query was successful
    if ok:
        data = res
    else:
        print(res)
        sys.exit(1)

    # Create a directory to store the datasets if it does not exist
    if not os.path.exists('datasets'):
        os.mkdir('datasets')
        print("The 'datasets' directory has been created.")

    # Format the datetime object as a string with date and time down to the seconds
    current_time = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    # Write the data to a json file
    filename = "datasets/" + id.replace(".", "_") + "_" + aggregation + "_metric_" + current_time + ".json"
    with open(filename, "w") as outfile: 
        json.dump(data, outfile)

def main():
    # Create a client object using the IBM Cloud API credentials
    ibm_headers = IbmAuthHelper.get_headers(URL, APIKEY, GUID)
    sdclient = SdMonitorClient(sdc_url=URL, custom_headers=ibm_headers)

    # metrices: time aggregation is average
    avg_metric_ids = ["cpu.used.percent",
                  "memory.used.percent",
                  "memory.bytes.used",
                  "mongodb.connections.current",
                  "jvm.class.loaded",
                  "jvm.class.unloaded",
                  "jvm.gc.global.time",
                  "jvm.gc.global.count",
                  "jvm.thread.count",
                  "jvm.heap.used",
                  "jvm.nonHeap.used"
                  ]

    # metrices: time aggregation is maximum
    max_metric_ids = [
        "net.http.request.time"
    ]

    # metrices: time aggregation is summation
    sum_metric_ids = [
                    "net.connection.count.out",
                    "net.request.count.in"
                      ]

    # Fetch data from IBM Cloud
    for id in avg_metric_ids:
        fetch_data_from_ibm_cloud(sdclient, id, "avg")

    for id in sum_metric_ids:
        fetch_data_from_ibm_cloud(sdclient, id, "sum")

    for id in max_metric_ids:
        fetch_data_from_ibm_cloud(sdclient, id, "max")
    
if __name__ == "__main__":
     # Iteration counter
     count = 1
     while True:
        print(f"Pulling metrices from ibm cloud at iteration {count}.")
        main()
        # Sleep for 1 hour (3600 seconds)
        time.sleep(3600)
        count += 1
