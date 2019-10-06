import request from '../utils/request';

export const queryTerminalList = (name, start, end) => {
    return request({
        url: `/QueryTerminalList?name=${name}&start=${start}&end=${end}`,
        method: 'post'
    })
}


export const queryTerminalListSum = (name) => {
    return request({
        url: `/QueryTerminalListSum?name=${name}`,
        method: 'post'
    })
}

export const addTerminal = (name) => {
    return request({
        url: `/AddTerminal?name=${name}`,
        method: 'post'
    })
}

export const updateTerminal = (param) => {
    return request({
        url: `/UpdateTerminal?tradeId=${param.id}&name=${param.name}`,
        method: 'post'
    })
}

export const removeTerminal = (id) => {
    return request({
        url: `/RemoveTerminal?id=${id}`,
        method: 'post'
    })
}
