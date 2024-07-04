import { useState, useEffect } from 'react'
import axios from 'axios'
import { SlButton, SlIcon, SlDialog, SlBadge } from './shoelace'

const Header = () => {
  const [open, setOpen] = useState(false)
  const [serverOpen, setServerOpen] = useState(false)
  const [serverRunning, setServerRunning] = useState(false)

  useEffect(() => {
    if (serverOpen) {
      axios
        .get('http://localhost:3000/status')
        .then(() => {
          setServerRunning(true)
        })
        .catch(() => setServerRunning(false))
    }
  }, [serverOpen])

  return (
    <>
      <header className="xble-header">
        <div className="xble-h-title">XBLE MIMIC</div>

        <div className="xble-h-actions">
          <SlButton onClick={() => setServerOpen(true)} size="small" circle>
            <SlIcon name="reception-3" />
          </SlButton>
          <SlButton onClick={() => setOpen(true)} size="small" circle>
            <SlIcon name="info-lg" />
          </SlButton>
        </div>

        <SlDialog label="Setup/Info" open={open} onSlAfterHide={() => setOpen(false)}>
          <div className="xble-cinner">
            {/* // Tuck this behind a menu of something, help icon would be cool */}
            <p className="xble-text-small">
              XBLE allows you to test locally for BLE with use of React Native and the
              react-native-ble-plx module.
            </p>
            <p className="xble-text-small">
              Make sure to install the cooresponding module which leverages HTTPS and Websockets to
              mimic the BLE connections, since BLE you need a physical device.
            </p>
          </div>

          <div className="xble-cinner">
            <div className="xble-code-block">
              <code>
                <pre>npm i xble-mock-api</pre>
              </code>
            </div>
          </div>

          <SlButton slot="footer" variant="primary" onClick={() => setOpen(false)}>
            Close
          </SlButton>
        </SlDialog>

        <SlDialog label="Server" open={serverOpen} onSlAfterHide={() => setServerOpen(false)}>
          <div className="xble-cinner">
            <SlBadge variant={serverRunning ? 'primary' : 'danger'}>
              {serverRunning ? 'Connected' : 'Not Connected'}
            </SlBadge>
          </div>

          <div>The server is {serverRunning ? 'Connected' : 'Not Connected'} to port 3000.</div>

          <SlButton slot="footer" variant="primary" onClick={() => setServerOpen(false)}>
            Close
          </SlButton>
        </SlDialog>
      </header>
    </>
  )
}

export default Header
