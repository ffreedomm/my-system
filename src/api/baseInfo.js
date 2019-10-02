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

export const queryZoneList = (name, start, end) => {
    return request({
        url: `/QueryZoneList?name=${name}&start=${start}&end=${end}`,
        method: 'post'
    })
}

export const queryZoneListSum = (name) => {
    return request({
        url: `/QueryZoneListSum?name=${name}`,
        method: 'post'
    })
}

export const  orgListForZone = (id, startOrg, endOrg) => {
    return request({
        url: `/OrgListForZone?zoneId=${id}&start=${startOrg}&end=${endOrg}`,
        method: 'post'
    })
}

export const orgListSumForZone = (zoneId) => {
    return request({
        url: `/OrgListSumForZone?zoneId=${zoneId}`,
        method: 'post'
    })
}

export const addZone = (name) => {
    return request({
        url: `/AddZone?name=${name}`,
        method: 'post'
    })
}

export const updateZone = (param) => {
    return request({
        url: `/UpdateZone?zoneId=${param.id}&name=${param.name}`,
        method: 'post'
    })
}

export const removeZone = (id) => {
    return request({
        url: `/RemoveZone?id=${id}`,
        method: 'post'
    })
}
