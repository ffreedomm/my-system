import request from '../utils/request';

/**
 * 获取图标信息
 */
export const getChartsData = (data) => {
    return request({
        url: '/PETotalListForDeviceList',
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

/**
 * 获取设备
 * @param {} id 
 */
export const getDevices = (id) => {
    return request({
        url: '/LinkedDeviceListForDevice?deviceId='+id,
        method: 'post'
    })
}

