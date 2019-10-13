import request from '../utils/request';

/**
 * 分页查询
 * @param {} data 
 */
export const queryList = (name, start, end) => {
    return request({
        url: `/QueryWorkPeriodList?name=${name}&start=${start}&end=${end}`,
        method: 'post'
    })
}

/**
 * 查询总数
 * @param {} name 
 */
export const queryTotal = (name) => {
    return request({
        url: `/QueryWorkPeriodListSum?name=${name}`,
        method: 'post'
    })
}

/**
 * 新增
 * @param {} data 
 */
export const add = (data) => {
    return request({
        url: '/AddWorkPeriod',
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
        url: '/UpdateWorkPeriod',
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
        url: '/RemoveWorkPeriod?id='+id,
        method: 'post'
    })
}


/**
 * 设备分页查询
 * @param {} data 
 */
export const queryList1 = (workPeriodId, start, end) => {
    return request({
        url: `/DeviceListForWorkPeriod?workPeriodId=${workPeriodId}&start=${start}&end=${end}`,
        method: 'post'
    })
}

/**
 * 查询设备总数
 * @param {} name 
 */
export const queryTotal1 = (workPeriodId) => {
    return request({
        url: `/DeviceListSumForWorkPeriod?workPeriodId=${workPeriodId}`,
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
        url: '/SetWorkPeriodForDeviceList',
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