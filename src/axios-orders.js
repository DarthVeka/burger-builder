import axios from 'axios';

const instance = axios.create({
    baseURL: 'https://myburger-app.firebaseio.com/'
});

export default instance;