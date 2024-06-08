import { useState, useEffect } from 'react'
import {
  SlSwitch,
  SlSelect,
  SlOption,
  SlSpinner,
  SlIconButton,
  SlDialog,
  SlButton
} from './shoelace'
import Device from './device'
import Panel from './panel'
import { STATES } from '../constants'
import { NEW_DEVICE } from '../constants/device'
// import { MOCK } from '../mock'

const Core = () => {
  const [data, setData] = useState(null)
  const [appHasLoaded, setAppHasLoaded] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (!appHasLoaded) {
      setAppHasLoaded(true)
      window.electron.ipcRenderer.send('APP_IS_READY')
    }
  }, [appHasLoaded])

  useEffect(() => {
    if (!data) {
      window.electron.ipcRenderer.once('APP_LOADED', (_, args) => {
        if (args && !data) {
          setData(args)
        } else {
          window.electron.ipcRenderer.removeAllListeners('APP_IS_READY')
          window.electron.ipcRenderer.removeAllListeners('APP_LOADED')
        }
      })
    }
  }, [data])

  // NOTE: On save it takes a quick second but for the API we need to make calls for websockets
  const handleSave = (saveData) => {
    const newData = saveData || data
    window.electron.ipcRenderer.send('SAVE_FILE', newData)
  }

  const handleAddDevice = () => {
    const devices = [...data.devices]
    devices.push(NEW_DEVICE)
    setData((prevState) => {
      return {
        ...prevState,
        devices
      }
    })
  }

  const handleDeleteDevice = (didx) => {
    let newData
    const devices = [...data.devices].filter((_, idx) => didx !== idx)

    setData((prevState) => {
      newData = {
        ...prevState,
        devices
      }
      handleSave(newData)

      return newData
    })
  }

  const handlePermissions = (ev) => {
    let newData
    setData((prevState) => {
      newData = {
        ...prevState,
        permissionRequest: ev.target.checked
      }
      handleSave(newData)

      return newData
    })
  }

  const handleStateChange = (ev, key) => {
    let newData
    setData((prevState) => {
      newData = {
        ...prevState,
        [key]: ev.target.value
      }
      handleSave(newData)

      return newData
    })
  }

  return (
    <div className="xble-core">
      {!data && (
        <div>
          <SlSpinner />
          <div>Loading...</div>
        </div>
      )}

      {data && (
        <>
          <div className="xble-cinner">
            <div className="xble-flex">
              <div className="xble-flex-fill">
                <SlSwitch checked={data?.permissionRequest} onSlChange={handlePermissions}>
                  Allow Permissions
                </SlSwitch>
              </div>
              <div>
                <SlIconButton name="filetype-json" label="code" onClick={() => setOpen(true)} />
              </div>
            </div>
          </div>

          <div className="xble-cinner">
            <div className="xble-flex">
              <div className="xble-flex-fill">
                <SlSelect
                  label="Initial State"
                  value={data?.initialState}
                  onSlChange={(ev) => handleStateChange(ev, 'initialState')}
                >
                  {STATES.map((s) => {
                    return (
                      <SlOption key={s.value} value={s.value}>
                        {s.label}
                      </SlOption>
                    )
                  })}
                </SlSelect>
              </div>
              <div className="xble-flex-fill">
                <SlSelect
                  label="End State"
                  value={data?.endState}
                  onSlChange={(ev) => handleStateChange(ev, 'endState')}
                >
                  {STATES.map((s) => {
                    return (
                      <SlOption key={s.value} value={s.value}>
                        {s.label}
                      </SlOption>
                    )
                  })}
                </SlSelect>
              </div>
            </div>
          </div>

          <div className="xble-divider"></div>

          <div className="xble-inner-actions">
            <SlIconButton name="plus" label="Add Device" onClick={handleAddDevice} />
          </div>

          {data?.devices.map((d, idx) => {
            return (
              <Panel
                key={`${d.device.id}-${idx}`}
                title={`Device (${d?.device?.name || 'n/a'})`}
                open={idx === 0}
              >
                <Device
                  data={d}
                  idx={idx}
                  onChange={setData}
                  onSave={() => handleSave()}
                  onDelete={handleDeleteDevice}
                  canDelete={data.devices.length > 1}
                />
              </Panel>
            )
          })}

          {data && (
            <SlDialog label="Data Debug" open={open} onSlAfterHide={() => setOpen(false)}>
              <div className="xble-cinner">
                <div className="xble-code-block">
                  <code>
                    <pre>{JSON.stringify(data, null, ' ')}</pre>
                  </code>
                </div>
              </div>

              <SlButton slot="footer" variant="primary" onClick={() => setOpen(false)}>
                Close
              </SlButton>
            </SlDialog>
          )}
        </>
      )}
    </div>
  )
}

export default Core
