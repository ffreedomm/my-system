import request from '../utils/request';

/**
 * 机构信息
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


