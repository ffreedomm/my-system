import request from '../utils/request';

/**
 * 新增
 * @param {} data 
 */
export const add = (data) => {
    return request({
        url: '/AddConstructionPlan',
        method: 'post',
        data,
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    })
}

export const updateConstructionPlan = (data) => {
    return request({
        url: '/UpdateConstructionPlan',
        method: 'post',
        data,
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    })
}
