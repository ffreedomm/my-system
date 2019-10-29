import request from '../utils/request';

/**
 * 企业信息
 */
export const getQueryOrgList = (data) => {
    return request({
        url: '/QueryOrgList',
        method: 'post',
        data
    })
}

/**
 * 列表信息
 */
export const getAllTerminalTotalListForOrg = (orgId) => {
    return request({
        url: '/AllTerminalTotalListForOrg?orgId='+orgId,
        method: 'post'
    })
}

/**
 * 地图标点查询
 */
export const getAllDeviceListForOrg = (orgId) => {
    return request({
        url: '/AllDeviceListForOrg?orgId='+orgId,
        method: 'post'
    })
}

/**
 * 饼图数据
 * @param {} orgId 
 */
export const getTerminalTotalListForOrgOrChild = (orgId) => {
    return request({
        url: '/TerminalTotalListForOrgOrChild?orgId='+orgId,
        method: 'post'
    })
}

/**
 * 设备报警处理
 * @param {} orgId 
 */
export const getTerminalAlertTotalInFaultStatus = () => {
    return request({
        url: '/TerminalAlertTotalInFaultStatus',
        method: 'post'
    })
}

/**
 * 点击地图时统计
 */
export const getTerminalRecordListForDevice = (data) => {
    return request({
        url: '/TerminalRecordListForDevice?deviceId='+data.deviceId+'&start=1&end=10',
        method: 'post'
    })
}

export const getTotalListForDeviceList = (ids) => {
    return request({
        url: '/TotalListForDeviceList?ids='+ids,
        method: 'post'
    })
}

export const QueryUnhandledTerminalAlertListInFaultStatus = (hours) => {
    return request({
        url: '/QueryUnhandledTerminalAlertListInFaultStatus?hours='+hours,
        method: 'post'
    })
}

export const HandleTerminalAlertInFaultStatusForUser = (data) => {
    return request({
        url: '/QueryUnhandledTerminalAlertListInFaultStatus',
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








