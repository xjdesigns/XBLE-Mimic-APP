export const SERVICE = {
  id: '',
  uuid: '',
  deviceID: ''
}

export const CHARACTERISTIC = {
  id: '',
  uuid: '',
  serviceID: '',
  serviceUUID: '',
  deviceID: '',
  isReadable: true,
  isWritableWithResponse: true,
  isWritableWithoutResponse: true,
  value: ''
}

export const NEW_DEVICE = {
  device: {
    name: '',
    id: '',
    localName: '',
    isConnectable: true,
    isConnected: true,
    _haveDeviceFail: false
  },
  service: [{ ...SERVICE }],
  characteristics: [{ ...CHARACTERISTIC }]
}
