import axios from 'axios';

const baseURL = {
    dev: "http://www.localhost:8082/user/",
    production: "http://instagram.ece750cluster-04e8c71ff333c8969bc4cbc5a77a70f6-0000.ca-tor.containers.appdomain.cloud/user/"
}

export default axios.create({
    baseURL:baseURL.production,
    headers: {"ngrok-skip-browser-warning":"true"}
});