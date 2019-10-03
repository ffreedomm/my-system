import request from '../utils/request';

/**
 * 分页查询
 * @param {} data 
 */
export const queryCollectionList = (deviceNumber, start, end) => {
    return request({
        url: `/QueryTerminalRecordList?deviceNumber=${deviceNumber}&start=${start}&end=${end}`,
        method: 'post'
    })
}

/**
 * 查询总数
 * @param {} deviceNumber 
 */
export const queryTotal = (deviceNumber) => {
    return request({
        url: `/QueryTerminalRecordListSum?deviceNumber=${deviceNumber}`,
        method: 'post'
    })
}

/**
 * 终端列表
 */
export const queryTerminals = () => {
    return request({
        url: '/QueryTerminalList',
        method: 'post'
    })
}

/**
 * 设备列表
 */
export const queryDevices = () => {
    return request({
        url: '/QueryDeviceList',
        method: 'post'
    })
} 

/**
 * 新增
 * @param {} data 
 */
export const addTerminalRecord = (data) => {
    return request({
        url: '/AddTerminalRecord',
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
 * 修改
 */
export const updateTerminalRecord = (data) => {
    return request({
        url: '/UpdateTerminalRecord',
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
 * 删除
 * @param {} id 
 */
export const removeTerminalRecord = (id) => {
    return request({
        url: '/RemoveTerminalRecord?id='+id,
        method: 'post'
    })
}
