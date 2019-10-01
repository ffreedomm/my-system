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
 * 机构分布
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

