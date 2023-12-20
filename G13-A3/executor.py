
import subprocess

class Executor:
    def __init__(self):
        pass

    # Function to fetch data from IBM Cloud
    def execute(self, adaptation_plans, configurations):
        # Check if the adaptation options are valid
        # If valid, return True
        # Otherwise, return False
        for idx, adaptation_plan in enumerate(adaptation_plans):
            if adaptation_plan:
                cpu = adaptation_plan["cpu"]
                memory = adaptation_plan["memory"]
                replica = adaptation_plan['replica']
                service = adaptation_plan['service']
                command = f"./config.sh cpu={cpu} memory={memory} replica={replica} service={service}"
                res = subprocess.run(command, shell=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)

                # Check the result
                if res.returncode == 0:
                    if memory != configurations[idx]['memory']:
                        print(f"Memory is changed from {configurations[idx]['memory']} to {memory} for {service}")
                    elif replica != configurations[idx]['replica']:
                        print(f"Replica is changed from {configurations[idx]['replica']} to {replica} for {service}")
                    configurations[idx] = adaptation_plan
                    print(res.stdout)
                else:
                    print("Adaptation failed with error:")
                    print(res.stderr)