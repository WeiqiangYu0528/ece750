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
        self.memory_lower_bound = 512
        self.memory_upper_bound = 1024
        self.replica_lower_bound = 1
        self.replica_upper_bound = 3
        self.configuration_data = self.load_configuration_data()
        self.loads = ["low", "medium", "high"]
        self.services = ['acmeair-bookingservice', 'acmeair-customerservice', 'acmeair-flightservice']


    def load_configuration_data(self):
        # Load the configuration data from the configuration file
        with open("configuration.json", "r") as file:
            data = json.load(file)
        return data


    def triggerAdaptation(self, cpu, memory, latency):
        # Check whether adaptation is needed based on CPU, memory, and latency values
        print(f"CPU: {cpu:.2f}, memory: {memory:.2f}, latency: {latency:.2f}")
        if cpu > 75 or memory > 75 or latency > 2e7:
            return (True, True)
        elif cpu < 25 or memory < 25:
            return (True, False)
        return (False, False)
    
    def utility_preference_cpu(self, cpu):
        # Determine the utility preference for CPU usage
        if cpu < 25:
            return 1
        elif cpu < 75:
            return 0.5
        else:
            return 0

    def utility_preference_memory(self, memory):
        # Determine the utility preference for memory usage
        if memory < 25:
            return 1
        elif memory < 75:
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
        if cost == "memory":
            return 1
        else:
            return 0.5

    def calculate_utility(self, cpu_usage, memory_usage, latency, cost):
        # Calculate the overall utility score based on weighted preferences
        cpu_utility = self.weight_cpu * self.utility_preference_cpu(cpu_usage)
        memory_utility = self.weight_memory * self.utility_preference_memory(memory_usage)
        latency_utility = self.weight_latency * self.utility_preference_latency(latency)
        cost_utility = self.weight_cost * self.utility_preference_cost(cost)
        return cpu_utility + memory_utility + latency_utility + cost_utility

    def determine_request_load(self, service):
        filename = "datasets/net_request_count_in_sum_metric.json"
        df = self.create_dataframe(filename)
        aggregationData = df.groupby('service')
        avg_values = aggregationData['value'].mean()
        load = "low"
        if avg_values.loc[service] > 2000:
            load = self.loads[2]
        elif avg_values.loc[service] > 1000:
            load = self.loads[1]
        print(f"request number for {service} is {avg_values.loc[service]}, {load} traffic")
        return load

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

    def process_data(self, current_configurations):
        # perform data preprocessing and check whether adaptation is required
        adaptation_options = [None for _ in range(3)]
        outputs = [[0]*len(self.metrics) for _ in range(3)]
        for idx, (metric_id, aggregation) in enumerate(self.metrics):
            filename = "datasets/" + metric_id + "_" + aggregation + "_metric.json"
            df = self.create_dataframe(filename)
            aggregationData = df.groupby('service')
            avg_values = aggregationData['value'].mean()
            # print(avg_values)
            for i in range(3):
                outputs[i][idx] = avg_values.loc[self.services[i]]
        # print(outputs)
        # for each service, determine whether adaptation is needed
        for i in range(3):
            cpu = outputs[i][0]
            memory = outputs[i][1]
            latency = outputs[i][2]
            adaptation, busy = self.triggerAdaptation(cpu, memory, latency)
            if adaptation:
                print(f"{self.services[i]} requires adaptation")
                adaptation_options[i] = self.generate_adaptation_options(current_configurations[i], self.services[i], busy)
            else:
                print(f"No adaptation required for {self.services[i]}")
        return adaptation_options
    
    def fetch_configuration_data(self, option):
        if self.check_validity(option):
            key = f"{option['service']}_{option['replica']}_{option['memory']}_{option['load']}"
            if self.configuration_data.get(key):
                return self.configuration_data[key]
            else:
                print(f"Key {key} is invalid")
        return None

    def check_validity(self, option):
        # Check if the adaptation options are valid
        # If valid, return True
        # Otherwise, return False
        valid = True
        if option['memory'] < self.memory_lower_bound or option['memory'] > self.memory_upper_bound \
            or option['replica'] < self.replica_lower_bound or option['replica'] > self.replica_upper_bound:
            valid = False
        return valid

    def generate_adaptation_option(self, cpu, memory, replica, cost, service, busy, load):
        # Calculate the overall utility score based on weighted preferences
        option = {"cpu": cpu, "memory": memory, "replica": replica, "service": service, "load": load}
        data = self.fetch_configuration_data(option)
        if data:
            option["utility"] = self.calculate_utility(data['cpu_percent'], data['memory_percent'], data['response_time'], cost)
            if busy and cost == "memory":
                print(f"Adaptation Strategy: increase memory to {memory} for {service}")
            elif busy and cost == "replica":
                print(f"Adaptation Strategy: increase replica to {replica} for {service}")
            elif not busy and cost == "memory":
                print(f"Adaptation Strategy: decrease memory to {memory} for {service}")
            else:
                print(f"Adaptation Strategy: decrease replica to {replica} for {service}")
            return option
        else:
            print("error")
        return None

    def generate_adaptation_options(self, configuration, service, busy):
        # Find the best adaptation strategy based on utility functions
        adaptation_options = [0, 0]
      
        cpu = configuration["cpu"]
        memory = configuration["memory"]
        replica = configuration["replica"]
        load = self.determine_request_load(service)

        if busy:
            # strategy1: increase memory
            adaptation_options[0] = self.generate_adaptation_option(cpu, memory + 256, replica, "memory", service, busy, load)
            # strategy2: increase pod
            adaptation_options[1] = self.generate_adaptation_option(cpu, memory, replica + 1, "replica", service, busy, load)
        else:
            # strategy1: decrease memory
            adaptation_options[0] = self.generate_adaptation_option(cpu, memory - 256, replica, "memory", service, busy, load)
            # strategy2: decrease pod
            adaptation_options[1] = self.generate_adaptation_option(cpu, memory, replica - 1, "replica", service, busy, load)

        return adaptation_options



