import request from '../utils/request';

export const queryDeviceList = (name, start, end) => {
    return request({
        url: `/QueryDeviceList?name=${name}&start=${start}&end=${end}`,
        method: 'post'
    })
}


export const queryDeviceListSum = (name) => {
    return request({
        url: `/QueryDeviceListSum?name=${name}`,
        method: 'post'
    })
}


/**
 * 新增
 * @param {} data 
 */
export const addDevice = (data) => {
    return request({
        url: '/AddDevice',
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
export const updateDevice = (data) => {
    return request({
        url: '/UpdateDevice',
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


export const removeDevice = (id) => {
    return request({
        url: `/RemoveDevice?id=${id}`,
        method: 'post'
    })
}

/**
 * 设备连接一个终端 
 */
export const linkTerminalToDevice = (terminalId, deviceId) => {
    return request({
        url: `/LinkTerminalToDevice?terminalId=${terminalId}&deviceId=${deviceId}`,
        method: 'post'
    })
}

/**
 * 为治污设备关联一个产污设备 
 */
export const linkProductDeviceToTreatDevice = (productDeviceId, treatDeviceId) => {
    return request({
        url: `/LinkProductDeviceToTreatDevice?productDeviceId=${productDeviceId}&treatDeviceId=${treatDeviceId}`,
        method: 'post'
    })
}

/**
 * 获得给定企业中的全部治污设备列表（按名称升序） 
 */
export const treatDeviceListForOrg = (orgId, start, end) => {
    return request({
        url: `/TreatDeviceListForOrg?orgId=${orgId}&start=${start}&end=${end}`,
        method: 'post'
    })
}

/**
 * 获得给定企业中的全部产污设备列表（按名称升序）
 */
export const productDeviceListForOrg = (orgId) => {
    return request({
        url: `/ProductDeviceListForOrg?orgId=${orgId}`,
        method: 'post'
    })
}

/**
 * 获得给定id的设备对象 
 */
export const device = (id) => {
    return request({
        url: `/Device?id=${id}`,
        method: 'post'
    })
}

export const terminalRecordListForDevice = (id,starthis, endhis) => {
    return request({
        url: `/TerminalRecordListForDevice?deviceId=${id}&start=${starthis}&end=${endhis}`,
        method: 'post'
    })
}

export const terminalRecordListSumForDevice = (id,starthis, endhis) => {
    return request({
        url: `/TerminalRecordListSumForDevice?deviceId=${id}&start=${starthis}&end=${endhis}`,
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

export const queryOrgList = () => {
    return request({
        url: `/QueryOrgList`,
        method: 'post'
    })
}

/**
 * 设备故障数
 */

export const getTotalListForDeviceList = (ids) => {
    return request({
        url: '/TotalListForDeviceList?ids='+ids,
        method: 'post'
    })
}
