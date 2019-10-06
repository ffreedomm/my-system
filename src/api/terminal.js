import request from '../utils/request';

export const queryTerminalList = (number, start, end) => {
    return request({
        url: `/QueryTerminalList?number=${number}&start=${start}&end=${end}`,
        method: 'post'
    })
}


export const queryTerminalListSum = (number) => {
    return request({
        url: `/QueryTerminalListSum?number=${number}`,
        method: 'post'
    })
}

export const addTerminal = (param) => {
    return request({
        url: `/AddTerminal?number=${param.number}&memo=${param.memo}&name=${param.name}&sendInterval=${param.sendInterval}`,
        method: 'post'
    })
}

export const updateTerminal = (param) => {
    return request({
        url: `/UpdateTerminal?terminalId=${param.id}&number=${param.number}&memo=${param.memo}&name=${param.name}&sendInterval=${param.sendInterval}`,
        method: 'post'
    })
}

export const removeTerminal = (id) => {
    return request({
        url: `/RemoveTerminal?id=${id}`,
        method: 'post'
    })
}
