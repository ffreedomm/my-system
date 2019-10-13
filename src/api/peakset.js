import request from '../utils/request';

/**
 * 分页查询
 * @param {} data 
 */
export const queryList = (name, start, end) => {
    return request({
        url: `/QueryReportPeriodList?name=${name}&start=${start}&end=${end}`,
        method: 'post'
    })
}

/**
 * 查询总数
 * @param {} name 
 */
export const queryTotal = (name) => {
    return request({
        url: `/QueryReportPeriodListSum?name=${name}`,
        method: 'post'
    })
}

/**
 * 新增
 * @param {} data 
 */
export const add = (data) => {
    return request({
        url: '/AddReportPeriod',
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
        url: '/UpdateReportPeriod',
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
        url: '/RemoveReportPeriod?id='+id,
        method: 'post'
    })
}

export const getOrgList =()=>{
    return request({
        url: '/QueryOrgList',
        method: 'post'
    })
}


/**
 * 设备分页查询
 * @param {} data 
 */
export const queryList1 = (reportPeriodId, start, end) => {
    return request({
        url: `/DeviceListForReportPeriod?reportPeriodId=${reportPeriodId}&start=${start}&end=${end}`,
        method: 'post'
    })
}

/**
 * 查询设备总数
 * @param {} name 
 */
export const queryTotal1 = (reportPeriodId) => {
    return request({
        url: `/DeviceListSumForReportPeriod?reportPeriodId=${reportPeriodId}`,
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
        url: '/SetReportPeriodForDeviceList',
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