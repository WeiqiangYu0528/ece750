import matplotlib.pyplot as plt
import json
import datetime

def main():
    filename = "D:./750/datasets/cpu_used_percent_avg_metric.json"
    with open(filename) as f:
        all_eq_data = json.load(f) #save data to all_eq_data

    all_eq_dicts = all_eq_data['data']

# capture information
    y0s, y1s, y2s, y3s, y4s, y5s, y6s, y7s, lons, lats = [], [], [], [] , [], [], [], [], [], [] # 
    for eq_dict in all_eq_dicts:
        title = eq_dict['d'][0]
        if title == 'acmeair-booking-db':
            lon = timestamp_to_time(eq_dict['t'])   # X
            y5 = eq_dict['d'][1]                    # Y
            lons.append(lon)
            y5s.append(y5)
        elif title == 'acmeair-customer-db':
            y6 = eq_dict['d'][1]
            y6s.append(y6)
        elif title == 'acmeair-flight-db':
            y7 = eq_dict['d'][1]
            y7s.append(y7)
        elif title == 'acmeair-bookingservice':
            y0 = eq_dict['d'][1]
            y0s.append(y0)
        elif title == 'acmeair-authservice':
            y1 = eq_dict['d'][1]
            y1s.append(y1)
        elif title == 'acmeair-flightservice':
            y2 = eq_dict['d'][1]
            y2s.append(y2)
        elif title == 'acmeair-customerservice':
            y3 = eq_dict['d'][1]
            y3s.append(y3)
        elif title == 'acmeair-mainservice':
            y4 = eq_dict['d'][1]
            y4s.append(y4)

# draw plot
    draw_curves(lons, [y0s, y1s, y2s, y3s, y4s, y5s, y6s, y7s])
    

def draw_curves(x, ys):

    draw_name = ['acmeair-bookingservice', 'acmeair-authservice', 'acmeair-flightservice', 'acmeair-customerservice', 'acmeair-mainservice', 'acmeair-booking-db', 'acmeair-customer-db', 'acmeair-flight-db']
    colors = ['blue', 'green', 'red', 'cyan', 'magenta', 'purple', 'black', 'orange']
    # create a new figure
    plt.figure()

    # draw each curve
    for i, y in enumerate(ys):
        color = colors[i % len(colors)]  # define color
        plt.plot(x, y , color=color, label=draw_name[i])  # plot


    plt.title('cpu_used_percent_highload')
    #plt.title('memory_used_percent_lowload')

    plt.xlabel('time')                  # set x-axis        
    plt.ylabel('percent')               # set y-axis
    plt.xticks(range(1, len(x), 10))    # set x-range
    plt.yticks(range(0, 60, 10))        # set y-range
    plt.legend()                        # display egend
    plt.grid(True)                      # display grid
    plt.show()                          # display graphics


def timestamp_to_time(timestamp):
    # convert timestamps to datetime objects
    dt_object = datetime.datetime.fromtimestamp(timestamp)   
    # formatting datetime objects as readable time strings
    time_string = dt_object.strftime('%H:%M:%S')   
    return time_string


if __name__ == "__main__" :
    main()