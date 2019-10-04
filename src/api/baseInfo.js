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

export const queryOrgList = (name, start, end) => {
    return request({
        url: `/QueryOrgList?name=${name}&start=${start}&end=${end}`,
        method: 'post'
    })
}

export const allDeviceListForOrg = (orgId, start, end) => {
    return request({
        url: `/AllDeviceListForOrg?orgId=${orgId}&start=${start}&end=${end}`,
        method: 'post'
    })
}

export const allDeviceListSumForOrg = (orgId) => {
  return request({
      url: `/AllDeviceListSumForOrg?orgId=${orgId}`,
      method: 'post'
  })
}

export const removeOrg = (orgId) => {
    return request({
        url: `/RemoveOrg?orgId=${orgId}`,
        method: 'post'
    })
}

export const totalListForTradeList = (ids, tradeTime) => {
    return request({
        url: `/TotalListForTradeList?ids=${ids}&startTime=${tradeTime[0]}&endTime=${tradeTime[1]}`,
        method: 'post'
    })
}

export const addOrg = (param) => {
    return request({
        url: `/AddOrg?name=${param.name}&parentOrgId=${param.parentOrgId}&property=${param.property}&
              legalPerson=${param.legalPerson}&legalCode=${param.legalCode}&address=${param.address}&
              population=${param.population}&contact=${param.contact}&phone=${param.phone}&
              tradeId=${param.tradeId}&zoneId=${param.zoneId}`,
        method: 'post'
    })
}

export const updateOrg = (param) => {
    return request({
        url: `/UpdateOrg?orgId=${param.id}&name=${param.name}&parentOrgId=${param.parentOrgId}&property=${param.property}&
              legalPerson=${param.legalPerson}&legalCode=${param.legalCode}&address=${param.address}&
              population=${param.population}&contact=${param.contact}&phone=${param.phone}&
              tradeId=${param.tradeId}&zoneId=${param.zoneId}`,
        method: 'post'
    })
}
