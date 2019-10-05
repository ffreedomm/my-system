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
