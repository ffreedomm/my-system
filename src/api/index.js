import request from '../utils/request';

export const fetchData = (param) => {
    return request({
        url: '/ms/table/list',
        method: 'post',
        data: param
    })
}