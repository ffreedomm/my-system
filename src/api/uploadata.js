import request from '../utils/request';

export const queryUploadataList = (deviceId, start, end) => {
    return request({
        url: `/QueryUploadDataList?deviceId=${deviceId}&start=${start}&end=${end}`,
        method: 'post'
    })
}


export const queryUploadataListSum = (deviceId, start, end) => {
    return request({
        url: `/QueryUploadDataListSum?deviceId=${deviceId}&start=${start}&end=${end}`,
        method: 'post'
    })
}

