import request from '../utils/request';

/**
 * 基本情况统计
 */
export const getBasicInfoTotalForToday = () => {
    return request({
        url: '/BasicInfoTotalForToday',
        method: 'post'
    })
}

/**
 * 企业分布
 */
export const getOrgInZoneTotalList = () => {
    return request({
        url: '/OrgInZoneTotalList',
        method: 'post'
    })
}

/**
 * 近30天用电量统计
 */
export const getPETotalForAll = () => {
    return request({
        url: '/PETotalForAll?pointSum=20',
        method: 'post'
    })
}

/**
 * 故障统计
 */
export const getTotalListForAllZones = () => {
    return request({
        url: '/TotalListForAllZones',
        method: 'post'
    })
}


