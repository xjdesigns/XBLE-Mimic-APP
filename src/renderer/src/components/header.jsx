import { useState } from 'react'
import { SlButton, SlIcon, SlDialog } from './shoelace'

const Header = () => {
  const [open, setOpen] = useState(false)

  return (
    <>
      <header className="xble-header">
        <div className="xble-h-title">XBLE MIMIC</div>

        <div className="xble-h-actions">
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
      </header>
    </>
  )
}

export default Header
