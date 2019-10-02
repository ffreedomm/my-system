import request from '../utils/request';

export const queryTradeList = (name, start, end) => {
    return request({
        url: `/QueryTradeList?name=${name}&start=${start}&end=${end}`,
        method: 'post'
    })
}

export const  orgListForTrade = (id, startOrg, endOrg) => {
    return request({
        url: `/OrgListForTrade?tradeId=${id}&start=${startOrg}&end=${endOrg}`,
        method: 'post'
    })
}

export const orgListSumForTrade = (tradeId) => {
    return request({
        url: `/OrgListSumForTrade?tradeId=${tradeId}`,
        method: 'post'
    })
}

export const queryTradeListSum = (name) => {
    return request({
        url: `/QueryTradeListSum?name=${name}`,
        method: 'post'
    })
}

export const addTrade = (name) => {
    return request({
        url: `/AddTrade?name=${name}`,
        method: 'post'
    })
}

export const updateTrade = (param) => {
    return request({
        url: `/UpdateTrade?tradeId=${param.id}&name=${param.name}`,
        method: 'post'
    })
}

export const removeTrade = (id) => {
    return request({
        url: `/RemoveTrade?id=${id}`,
        method: 'post'
    })
}
