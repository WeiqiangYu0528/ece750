
class Planner:
    def __init__(self):
        pass
    
    def generate_adaptation_plan(self, adaptation_options):
        # Generate an adaptation plan based on the adaptation options
        # Return the adaptation plan
        optimal_plans = [None for _ in range(3)] 
        for idx, plans in enumerate(adaptation_options):
            if plans:
                option = {'utility': 0}
                for plan in plans:
                    if plan and option['utility'] < plan['utility']:
                        option = plan
                if option['utility'] > 0:
                    optimal_plans[idx] = option
        return optimal_plans


        
