// TODO: Split file into server, client and common actions.
export const MACHINE_ONLINE = 'machine:online'
export const MACHINE_OFFLINE = 'machine:offline'
export const MACHINE_STATUS = 'machine:status'
export const MACHINE_ERROR = 'machine:error'
export const MACHINE_DISPLAY = 'machine:display'
export const MACHINE_TEXT = 'machine:text'
export const MACHINE_PREVIEW = 'machine:preview'
export const MACHINE_SUBSCRIBE = 'server/machine:subscribe'
export const MACHINE_UNSUBSCRIBE = 'server/machine:unsubscribe'
export const MACHINE_COMMAND = 'server/machine:command'


export function machineOnline(uuid, host) {
  return {
    type: MACHINE_ONLINE,
    uuid,
    host
  }
}

export function machineOffline(uuid) {
  return {
    type: MACHINE_OFFLINE,
    uuid
  }
}

export function machineSubscribe(uuid) {
  return {
    type: MACHINE_SUBSCRIBE,
    uuid
  }
}

export function machineUnsubscribe(uuid) {
  return {
    type: MACHINE_UNSUBSCRIBE,
    uuid
  }
}

export function machineCommand(uuid, ...args) {
  return {
    type: MACHINE_COMMAND,
    arguments: args
  }
}


