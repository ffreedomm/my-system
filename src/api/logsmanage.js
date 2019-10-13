import request from '../utils/request';

export const queryLogsmanageList = (userName,operation,start, end) => {
    return request({
        url: `/QueryUserLogList?userName=${userName}&operation=${operation}&start=${start}&end=${end}`,
        method: 'post'
    })
}


export const queryLogsmanageListSum = (userName,operation,start, end) => {
    return request({
        url: `/QueryUserLogListSum?userName=${userName}&operation=${operation}&start=${start}&end=${end}`,
        method: 'post'
    })
}


export const removeLogsmanage = (id) => {
    return request({
        url: `/RemoveUserLog?id=${id}`,
        method: 'post'
    })
}


export const checkAdminAccount = (data) => {
    return request({
        url: '/CheckAdminAccount',
        method: 'post',
        data,
        transformRequest: [function (data) {
            let ret = ''
            for (let it in data) {
              ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
            }
            return ret
        }],
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
        }
    })
}


