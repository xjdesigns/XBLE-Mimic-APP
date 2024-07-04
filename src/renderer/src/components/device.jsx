/* eslint-disable react/prop-types */
import {
  SlSwitch,
  SlInput,
  SlIconButton,
  SlButton,
  SlButtonGroup,
  SlSelect,
  SlOption,
  SlBadge
} from './shoelace'
import { v4 as uuidv4 } from 'uuid'
import { NEW_DEVICE, SERVICE, CHARACTERISTIC } from '../constants/device'

// TODO: add/remove service and characteristic
// Removing can be simple for the first pass, the issue will be searching all data to reset it to blank or another
const Device = ({
  data = {},
  idx = 0,
  onChange = () => {},
  onSave = () => {},
  onDelete = () => {},
  canDelete = false
}) => {
  const { device, service, characteristics } = data

  const handleDeviceUpdate = (key) => (ev) => {
    let val = ev.target.value
    const isId = key === 'id'

    if (key === 'isConnectable' || key === '_haveDeviceFail') {
      val = ev.target.checked
    }

    onChange((prevState) => {
      const devices = [...prevState.devices]
      devices[idx] = {
        ...data,
        device: {
          ...device,
          [key]: val
        }
      }
      devices[idx].service = devices[idx].service.map((c) => {
        return {
          ...c,
          deviceID: isId ? val : devices[idx].id
        }
      })
      devices[idx].characteristics = devices[idx].characteristics.map((c) => {
        return {
          ...c,
          deviceID: isId ? val : devices[idx].id
        }
      })

      return {
        ...prevState,
        devices: devices
      }
    })
  }

  const handleServiceUpdate = (key, sidx) => (ev) => {
    let val = ev.target.value

    if (key === 'isPrimary') {
      val = ev.target.checked
    }

    onChange((prevState) => {
      const devices = [...prevState.devices]
      devices[idx] = {
        ...data
      }
      devices[idx].service[sidx] = {
        ...devices[idx].service[sidx],
        [key]: val
      }

      return {
        ...prevState,
        devices: devices
      }
    })
  }

  const handleCharacteristicUpdate = (key, cidx) => (ev) => {
    let val = ev.target.value
    if (
      key === 'isReadable' ||
      key === 'isWritableWithResponse' ||
      key === 'isWritableWithoutResponse'
    ) {
      val = ev.target.checked
    }

    onChange((prevState) => {
      const devices = [...prevState.devices]
      devices[idx].characteristics[cidx] = {
        ...devices[idx].characteristics[cidx],
        [key]: val
      }

      const descriptorValues = {
        characteristicID: devices[idx].characteristics[cidx].id,
        characteristicUUID: devices[idx].characteristics[cidx].uuid,
        serviceID: devices[idx].characteristics[cidx].serviceID,
        serviceUUID: devices[idx].characteristics[cidx].serviceUUID,
        deviceID: devices[idx].characteristics[cidx].deviceID
      }

      devices[idx].characteristics[cidx].descriptors = devices[idx].characteristics[
        cidx
      ].descriptors.map((d) => {
        return {
          ...d,
          ...descriptorValues
        }
      })

      return {
        ...prevState,
        devices: devices
      }
    })
  }

  const handleCharServiceSelect = (ev, cidx) => {
    const id = ev.target.value
    const selected = service.filter((s) => s.id === id)
    const update = {
      serviceID: selected[0].id,
      serviceUUID: selected[0].uuid
    }

    onChange((prevState) => {
      const devices = [...prevState.devices]
      devices[idx].characteristics[cidx] = {
        ...devices[idx].characteristics[cidx],
        ...update
      }

      return {
        ...prevState,
        devices: devices
      }
    })
  }

  const handleDescriptorUpdate = (key, cidx, didx) => (ev) => {
    const val = ev.target.value

    onChange((prevState) => {
      const devices = [...prevState.devices]
      devices[idx].characteristics[cidx].descriptors[didx] = {
        ...devices[idx].characteristics[cidx].descriptors[didx],
        [key]: val
      }

      return {
        ...prevState,
        devices: devices
      }
    })
  }

  const generateUUID = (key, type, idx, sidx) => () => {
    const ev = {
      target: {
        value: uuidv4()
      }
    }
    if (type === 'device') {
      const deviceFn = handleDeviceUpdate(key)
      deviceFn(ev)
    }

    if (type === 'service') {
      const serviceFn = handleServiceUpdate(key, idx)
      serviceFn(ev)
    }

    if (type === 'characteristic') {
      const characteristicFn = handleCharacteristicUpdate(key, idx)
      characteristicFn(ev)
    }

    if (type === 'descriptor') {
      const descriptorFn = handleDescriptorUpdate(key, idx, sidx)
      descriptorFn(ev)
    }
  }

  const handleReset = () => {
    onChange((prevState) => {
      const devices = [...prevState.devices]
      devices[idx] = NEW_DEVICE

      return {
        ...prevState,
        devices: devices
      }
    })
  }

  const handleAddService = () => {
    onChange((prevState) => {
      const devices = JSON.parse(JSON.stringify(prevState.devices))
      const services = [...devices[idx].service]
      const newService = {
        ...SERVICE,
        deviceID: devices[idx].device.id
      }
      services.push(newService)
      devices[idx].service = services

      return {
        ...prevState,
        devices: devices
      }
    })
  }

  const handleRemoveService = (sidx) => () => {
    onChange((prevState) => {
      const devices = [...prevState.devices]
      devices[idx].service = devices[idx].service.filter((s, iidx) => {
        return sidx !== iidx
      })

      return {
        ...prevState,
        devices: devices
      }
    })
  }

  const handleAddCharacter = () => {
    onChange((prevState) => {
      const devices = JSON.parse(JSON.stringify(prevState.devices))
      const characteristics = [...devices[idx].characteristics]
      const newCharacter = {
        ...CHARACTERISTIC,
        deviceID: devices[idx].device.id
      }
      characteristics.push(newCharacter)
      devices[idx].characteristics = characteristics

      return {
        ...prevState,
        devices: devices
      }
    })
  }

  const handleRemoveCharacter = (cidx) => () => {
    onChange((prevState) => {
      const devices = [...prevState.devices]
      devices[idx].characteristics = devices[idx].characteristics.filter((c, iidx) => {
        return cidx !== iidx
      })

      return {
        ...prevState,
        devices: devices
      }
    })
  }

  return (
    <div className="xble-cinner">
      <div className="xble-cinner-sm">
        <div className="xble-flex">
          <div className="xble-flex-fill">
            <div>
              <SlInput
                label="Name"
                size="small"
                value={device.name}
                onSlInput={handleDeviceUpdate('name')}
              />
            </div>
            <div>
              <SlSwitch
                size="small"
                checked={device.isConnectable}
                onSlChange={handleDeviceUpdate('isConnectable')}
              >
                Is Connectable (ios)
              </SlSwitch>
            </div>
            <div>
              <SlSwitch
                size="small"
                checked={device.isConnected}
                onSlChange={handleDeviceUpdate('isConnected')}
              >
                Is Connected
              </SlSwitch>
            </div>
            <div>
              <SlSwitch
                size="small"
                checked={device._haveDeviceFail}
                onSlChange={handleDeviceUpdate('_haveDeviceFail')}
              >
                Have Device Fail
              </SlSwitch>
            </div>
          </div>
          <div className="xble-flex-fill">
            <div className="xble-cinner-sm">
              <div className="xble-igroup">
                <SlInput
                  label="ID"
                  size="small"
                  value={device.id}
                  onSlInput={handleDeviceUpdate('id')}
                />
                <SlIconButton
                  name="plugin"
                  label="Add Device UUID"
                  onClick={generateUUID('id', 'device')}
                />
              </div>
              <SlInput
                label="localName"
                size="small"
                value={device.localName}
                onSlInput={handleDeviceUpdate('localName')}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="xble-divider" />

      <div className="xble-cinner-sm">
        <div className="xble-flex">
          <div className="xble-flex-fill">
            <SlBadge pill>Services</SlBadge>
          </div>
          <div>
            <SlIconButton name="node-plus-fill" label="Add More" onClick={handleAddService} />
          </div>
        </div>
      </div>

      {service.map((s, idx) => {
        return (
          <div key={idx} className="xble-cinner">
            <div className="xble-cinner-sm">
              <SlBadge pill variant="neutral">
                Service ({idx})
              </SlBadge>
            </div>
            <div className="xble-cinner-sm">
              <div className="xble-flex">
                <div className="xble-flex-fill">
                  <div className="xble-igroup">
                    <SlInput
                      label="ID"
                      size="small"
                      value={s.id}
                      onSlInput={handleServiceUpdate('id', idx)}
                    />
                    <SlIconButton
                      name="plugin"
                      label="Add Service ID"
                      onClick={generateUUID('id', 'service', idx)}
                    />
                  </div>
                </div>
                <div className="xble-flex-fill">
                  <div className="xble-igroup">
                    <SlInput
                      label="UUID"
                      size="small"
                      value={s.uuid}
                      onSlInput={handleServiceUpdate('uuid', idx)}
                    />
                    <SlIconButton
                      name="plugin"
                      label="Add Service UUID"
                      onClick={generateUUID('uuid', 'service', idx)}
                    />
                  </div>
                </div>
              </div>
              <div>
                <SlSwitch
                  size="small"
                  checked={s.isPrimary}
                  onSlInput={handleServiceUpdate('isPrimary', idx)}
                >
                  Is Primary
                </SlSwitch>
              </div>
            </div>
            <div className="xble-cinner-sm">
              <SlButton
                size="small"
                onClick={handleRemoveService(idx)}
                disabled={service.length < 2}
              >
                Remove
              </SlButton>
            </div>
          </div>
        )
      })}

      <div className="xble-divider" />

      <div className="xble-cinner-sm">
        <div className="xble-flex">
          <div className="xble-flex-fill">
            <SlBadge pill>Characteristics</SlBadge>
          </div>
          <div>
            <SlIconButton name="node-plus-fill" label="Add More" onClick={handleAddCharacter} />
          </div>
        </div>
      </div>

      {characteristics.map((c, cidx) => {
        return (
          <div key={cidx} className="xble-cinner">
            <div className="xble-cinner-sm">
              <SlBadge pill variant="neutral">
                Characteristic ({cidx})
              </SlBadge>
            </div>
            <div className="xble-cinner-sm">
              <SlSelect
                label="Service"
                value={c.serviceID}
                size="small"
                onSlChange={(ev) => handleCharServiceSelect(ev, cidx)}
              >
                {service.map((s, sidx) => {
                  return (
                    <SlOption key={sidx} value={s.id}>
                      {s.id}
                    </SlOption>
                  )
                })}
              </SlSelect>
            </div>
            <div className="xble-cinner">
              <div className="xble-flex">
                <div className="xble-flex-fill">
                  <div className="xble-igroup">
                    <SlInput
                      label="ID"
                      size="small"
                      value={c.id}
                      onSlInput={handleCharacteristicUpdate('id', cidx)}
                    />
                    <SlIconButton
                      name="plugin"
                      label="Add Characteristic ID"
                      onClick={generateUUID('id', 'characteristic', cidx)}
                    />
                  </div>
                  <div>
                    <SlSwitch
                      size="small"
                      checked={c.isReadable}
                      onSlChange={handleCharacteristicUpdate('isReadable', cidx)}
                    >
                      Is Readable
                    </SlSwitch>
                  </div>
                  <div>
                    <SlSwitch
                      size="small"
                      checked={c.isWritableWithResponse}
                      onSlChange={handleCharacteristicUpdate('isWritableWithResponse', cidx)}
                    >
                      Is Writable w/ Response
                    </SlSwitch>
                  </div>
                  <div>
                    <SlSwitch
                      size="small"
                      checked={c.isWritableWithoutResponse}
                      onSlChange={handleCharacteristicUpdate('isWritableWithoutResponse', cidx)}
                    >
                      Is Writable w/o Response
                    </SlSwitch>
                  </div>
                </div>
                <div className="xble-flex-fill">
                  <div className="xble-igroup">
                    <SlInput
                      label="UUID"
                      size="small"
                      value={c.uuid}
                      onSlInput={handleCharacteristicUpdate('uuid', cidx)}
                    />
                    <SlIconButton
                      name="plugin"
                      label="Add Characteristic ID"
                      onClick={generateUUID('uuid', 'characteristic', cidx)}
                    />
                  </div>
                  <div>
                    <SlInput
                      label="Value"
                      size="small"
                      value={c.value}
                      onSlInput={handleCharacteristicUpdate('value', cidx)}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="xble-cinner-sm">
              <SlButton
                size="small"
                onClick={handleRemoveCharacter(cidx)}
                disabled={characteristics.length < 2}
              >
                Remove
              </SlButton>
            </div>

            <div className="xble-divider" />

            <div className="xble-cinner-sm">
              <div className="xble-cinner-sm">
                <div className="xble-flex">
                  <div className="xble-flex-fill">
                    <SlBadge pill>Descriptors</SlBadge>
                  </div>
                  <div>
                    <SlIconButton name="node-plus-fill" label="Add More" disabled />
                  </div>
                </div>
              </div>
              {c.descriptors.map((d, idx) => {
                return (
                  <div key={idx}>
                    <div className="xble-flex">
                      <div className="xble-flex-fill">
                        <div className="xble-igroup">
                          <SlInput
                            label="ID"
                            size="small"
                            value={d.id}
                            onSlInput={handleDescriptorUpdate('id', cidx, idx)}
                          />
                          <SlIconButton
                            name="plugin"
                            label="Add Descriptor ID"
                            onClick={generateUUID('id', 'descriptor', cidx, idx)}
                          />
                        </div>
                      </div>
                      <div className="xble-flex-fill">
                        <div className="xble-igroup">
                          <SlInput
                            label="UUID"
                            size="small"
                            value={d.uuid}
                            onSlInput={handleDescriptorUpdate('uuid', cidx, idx)}
                          />
                          <SlIconButton
                            name="plugin"
                            label="Add Descriptor UUID"
                            onClick={generateUUID('uuid', 'descriptor', cidx, idx)}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="xble-cinner">
                      <SlInput
                        label="Value"
                        size="small"
                        value={d.value}
                        onSlInput={handleDescriptorUpdate('value', cidx, idx)}
                      />
                    </div>
                    <div className="xble-divider" />
                  </div>
                )
              })}
            </div>
          </div>
        )
      })}

      <div className="xble-inner-actions">
        <SlButtonGroup>
          <SlButton disabled={!canDelete} onClick={() => onDelete(idx)}>
            Delete
          </SlButton>
          <SlButton onClick={() => handleReset()}>Reset</SlButton>
          <SlButton onClick={onSave}>Save</SlButton>
        </SlButtonGroup>
      </div>
    </div>
  )
}

export default Device
