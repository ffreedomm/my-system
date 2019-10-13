import request from '../utils/request';

/**
 * 分页查询
 * @param {} data 
 */
export const queryList = (name, start, end) => {
    return request({
        url: `/QueryAlertParamList?name=${name}&start=${start}&end=${end}`,
        method: 'post'
    })
}

/**
 * 查询总数
 * @param {} name 
 */
export const queryTotal = (name) => {
    return request({
        url: `/QueryAlertParamListSum?name=${name}`,
        method: 'post'
    })
}


/**
 * 设备分页查询
 * @param {} data 
 */
export const queryList1 = (alertParamId, start, end) => {
    return request({
        url: `/DeviceListForAlertParam?alertParamId=${alertParamId}&start=${start}&end=${end}`,
        method: 'post'
    })
}

/**
 * 查询设备总数
 * @param {} name 
 */
export const queryTotal1 = (alertParamId) => {
    return request({
        url: `/DeviceListSumForAlertParam?alertParamId=${alertParamId}`,
        method: 'post'
    })
}

/**
 * 查询设备
 */
export const queryDeviceList = () => {
    return request({
        url: '/QueryDeviceList',
        method: 'post'
    })
}



/**
 * 设置到设备
 * @param {} name 
 */
export const setDevice = (data) => {
    return request({
        url: '/SetAlertParamForDeviceList',
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
 * 新增
 * @param {} data 
 */
export const add = (data) => {
    return request({
        url: '/AddAlertParam',
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
export const update = (data) => {
    return request({
        url: '/UpdateAlertParam',
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
export const remove = (id) => {
    return request({
        url: '/RemoveAlertParam?id='+id,
        method: 'post'
    })
}

