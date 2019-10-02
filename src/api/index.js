import request from '../utils/request';

export const getNewCheckCode = () => {
    return request({
        url: '/GetNewCheckCode',
        method: 'post'
    })
}

export const loginForUser = (data) => {
    return request({
        url: `/LoginForUser?code=${data.code}&name=${data.name}&password=${data.password}&sessionId=${data.sessionId}`,
        method: 'post',
    })
}

export const updatePassword = (userId, oldPassword, newPassword) => {
    return request({
        url: `/UpdatePasswordForUser?userId=${userId}&oldPassword=${oldPassword}&newPassword=${newPassword}`,
        method: 'post',
    })
}

