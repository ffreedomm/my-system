import axios from 'axios';

const service = axios.create({
    baseURL: 'https://www.easy-mock.com/mock/592501a391470c0ac1fab128',
    timeout: 5000
})

service.interceptors.request.use( config => {
    // if (store.getters.token) {
    //     config.headers['Authorization'] = getToken() // 让每个请求携带自定义token 请根据实际情况自行修改
    //   }
    return config;
}, error => {
    console.log(error);
    return Promise.reject();
})

service.interceptors.response.use(response => {
    if(response.status === 200){
        return response.data;
    }else{
        Promise.reject();
    }
}, error => {
    console.log(error);
    return Promise.reject();
})

export default service;