import sys
import time
sys.path.append("python-sdc-client")
from monitor import Monitor
from analyzer import Analyzer

# IBM Cloud API Credentials
URL = "https://ca-tor.monitoring.cloud.ibm.com"
APIKEY = ""
GUID = ""

# metrices: time aggregation is average
avg_metric_ids = ["cpu.quota.used.percent",
            "memory.limit.used.percent",
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

# metrices: core metrics used to perform adaptation analysis
core_metrics = [
    ("cpu_quota_used_percent", "avg"),
    ("memory_limit_used_percent", "avg"),
    ("net_http_request_time", "max")
]

def main():
    monitor = Monitor(URL, APIKEY, GUID)
    analyzer = Analyzer(core_metrics)

    while True:
        # Fetch data from IBM Cloud
        for id in avg_metric_ids:
            monitor.fetch_data_from_ibm_cloud(id, "avg")

        for id in sum_metric_ids:
            monitor.fetch_data_from_ibm_cloud(id, "sum")

        for id in max_metric_ids:
            monitor.fetch_data_from_ibm_cloud(id, "max")
        print(f"Pulling metrices from ibm cloud")
        analyzer.process_data()
        # Sleep for 1 hour (3600 seconds)
        time.sleep(300)


if __name__ == "__main__":
    main()

