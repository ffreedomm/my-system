import request from '../utils/request';

/**
 * 分页查询
 * @param {} data 
 */
export const queryList = (data) => {
    return request({
        url: '/QueryUserNoticeList',
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
 * 查询总数
 * @param {} name 
 */
export const queryTotal = (data) => {
    return request({
        url: '/QueryUserNoticeListSum',
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
        url: '/AddUserNotice',
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
        url: '/UpdateUserNotice',
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
        url: '/RemoveUserNotice?id='+id,
        method: 'post'
    })
}

export const queryUsers = () => {
    return request({
        url: '/QueryUserList',
        method: 'post'
    })
}
