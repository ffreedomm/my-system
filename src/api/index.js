import request from '../utils/request';

export const getNewCheckCode = () => {
    return request({
        url: '/GetNewCheckCode',
        method: 'post'
    })
}

export const checkCodeImage = (sessionId) => {
    return request({
        url: '/CheckCodeImage?id='+sessionId,
        method: 'post'
    })
}

