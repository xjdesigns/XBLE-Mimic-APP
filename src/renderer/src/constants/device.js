export const SERVICE = {
  id: '',
  uuid: '',
  deviceID: '',
  isPrimary: false
}

export const DESCRIPTOR = {
  id: '',
  uuid: '',
  characteristicID: '',
  characteristicUUID: '',
  serviceID: '',
  serviceUUID: '',
  deviceID: '',
  value: ''
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
  value: '',
  descriptors: [{ ...DESCRIPTOR }]
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
