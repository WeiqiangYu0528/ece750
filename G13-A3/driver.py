import sys
import time
sys.path.append("python-sdc-client")
from monitor import Monitor
from analyzer import Analyzer
from planner import Planner
from executor import Executor

# IBM Cloud API Credentials
URL = "https://ca-tor.monitoring.cloud.ibm.com"
APIKEY = "xiEparnIvPMBshEpuZ3pfmFrhpJyRlRNNmC1n_SjB_QG"
GUID = "b92c514a-ca21-4548-b3f0-4d6391bab407"

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

current_configurations = [{"cpu": 500, "memory": 512, "replica": 1} for _ in range(3)]

def main():
    monitor = Monitor(URL, APIKEY, GUID)
    analyzer = Analyzer(core_metrics)
    planner = Planner()
    executor = Executor()

    while True:
        # Fetch data from IBM Cloud
        print(f"Pulling metrices from ibm cloud")
        for id in avg_metric_ids:
            monitor.fetch_data_from_ibm_cloud(id, "avg")

        for id in sum_metric_ids:
            monitor.fetch_data_from_ibm_cloud(id, "sum")

        for id in max_metric_ids:
            monitor.fetch_data_from_ibm_cloud(id, "max")

        adaptation_options = analyzer.process_data(current_configurations)
        optimal_plans = planner.generate_adaptation_plan(adaptation_options)
        executor.execute(optimal_plans, current_configurations)
        # Sleep for 1 hour (3600 seconds)
        time.sleep(300)


if __name__ == "__main__":
    main()

