import os
import sys
import json

from sdcclient import IbmAuthHelper, SdMonitorClient

class Monitor:
    def __init__(self, url, api_key, guid):
        # Create a client object using the IBM Cloud API credentials
        ibm_headers = IbmAuthHelper.get_headers(url, api_key, guid)
        self.sdclient = SdMonitorClient(sdc_url=url, custom_headers=ibm_headers)

        # Sysdig Data API Query Parameters
        # Pull the latest 5 minutes of data
        self.START = -300
        self.END = 0
        self.SAMPLING = 10
        self.FILTER = 'kubernetes.namespace.name="acmeair-g13"'
    
    # Function to fetch data from IBM Cloud
    def fetch_data_from_ibm_cloud(self, id, aggregation):
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
        ok, res = self.sdclient.get_data(metrics = metric,  # metrics list
                                        start_ts = self.START,  # start_ts = 600 seconds ago
                                        end_ts = self.END,
                                        sampling_s = self.SAMPLING,
                                        filter= self.FILTER)  # end_ts = now

        # Check if the query was successful
        if ok:
            data = res
        else:
            print(res)
            sys.exit(1)

        # Create a directory to store the datasets if it does not exist
        if not os.path.exists('datasets'):
            os.mkdir('datasets')
            print("The 'datasets' directory is created.")

        # Write the data to a json file
        filename = "datasets/" + id.replace(".", "_") + "_" + aggregation + "_metric.json"
        with open(filename, "w") as outfile: 
            json.dump(data, outfile)
