import json
import pandas as pd

class Analyzer:
    def __init__(self, metrics):
        # set relative weight for each property
        self.weight_cpu = 0.2
        self.weight_memory = 0.2
        self.weight_latency = 0.45
        self.weight_cost = 0.15
        self.metrics = metrics
        self.services = ['acmeair-bookingservice', 'acmeair-customerservice', 'acmeair-authservice',
                         'acmeair-flightservice', 'acmeair-mainservice']

    def triggerAdaptation(self, cpu, memory, latency):
        # Check whether adaptation is needed based on CPU, memory, and latency values
        print(f"CPU: {cpu:.2f}, memory: {memory:.2f}, latency: {latency:.2f}")
        if cpu > 50 or memory > 50 or latency > 2e7:
            return True
        else:
            return False
    
    def utility_preference_cpu(self, cpu):
        # Determine the utility preference for CPU usage
        if cpu < 25:
            return 1
        elif cpu < 50:
            return 0.5
        else:
            return 0

    def utility_preference_memory(self, memory):
        # Determine the utility preference for memory usage
        if memory < 25:
            return 1
        elif memory < 50:
            return 0.5
        else:
            return 0
    
    def utility_preference_latency(self, latency):
        # Determine the utility preference for latency
        if latency < 1e7:
            return 1
        elif latency < 2e7:
            return 0.5
        else:
            return 0
    
    def utility_preference_cost(self, cost):
        # Determine the utility preference for cost (cpu, memory, pod)
        if cost == "cpu" or cost == "memory":
            return 1
        else:
            return 0.5

    def calculate_utility(self, cpu, memory, latency, cost):
        # Calculate the overall utility score based on weighted preferences
        cpu_utility = self.weight_cpu * self.utility_preference_cpu(cpu)
        memory_utility = self.weight_memory * self.utility_preference_memory(memory)
        latency_utility = self.weight_latency * self.utility_preference_latency(latency)
        cost_utility = self.weight_cost * self.utility_preference_cost(cost)
        return cpu_utility + memory_utility + latency_utility + cost_utility

    def create_dataframe(self, filename):
        # Create a DataFrame from a JSON file
        with open(filename, 'r') as file:
            data = json.load(file)
        new_data = []
        for entry in data["data"]:
            new_entry = {}
            new_entry["timestamp"] = entry['t']
            new_entry["service"] = entry['d'][0]
            new_entry["value"] = entry['d'][1]
            new_data.append(new_entry)
        return pd.DataFrame(new_data)

    def process_data(self):
        # perform data preprocessing and check whether adaptation is required
        outputs = [[0]*len(self.metrics) for i in range(5)]
        for idx, (metric_id, aggregation) in enumerate(self.metrics):
            filename = "datasets/" + metric_id + "_" + aggregation + "_metric.json"
            df = self.create_dataframe(filename)
            aggregationData = df.groupby('service')
            avg_values = aggregationData['value'].mean()
            for i in range(5):
                outputs[i][idx] = avg_values.iloc[i]

        # for each service, determine whether adaptation is needed
        for i in range(5):
            cpu = outputs[i][0]
            memory = outputs[i][1]
            latency = outputs[i][2]
            adaptation = self.triggerAdaptation(cpu, memory, latency)
            if adaptation:
                print(f"{self.services[i]} requires adaptation")
                self.find_best_strategy(outputs[i])
            else:
                print(f"No adaptation required for {self.services[i]}")

    def find_best_strategy(self, output):
        # Find the best adaptation strategy based on utility functions
        cpu = output[0]
        memory = output[1]
        latency = output[2]
        # strategy1: increase cpu
        utility1 = self.calculate_utility(cpu / 2.0, memory, latency / 2.0, "cpu")
        # strategy2: increase memory
        utility2 = self.calculate_utility(cpu, memory / 2.0, latency / 2.0, "memory")
        # strategy3: increase pod
        utility3 = self.calculate_utility(cpu / 2.0, memory / 2.0, latency / 4.0, "pod")

        if utility1 > utility2 and utility1 > utility3:
            print("Best strategy: Increase cpu")
        elif utility2 > utility1 and utility2 > utility3:
            print("Best strategy: Increase memory")
        else:
            print("Best strategy: Increase pod")


