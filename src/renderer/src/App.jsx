import Header from './components/header'
import Core from './components/core'

// import { XBLEManager } from './mock-api'
// import { XBLEManager } from 'xble_mimic_api'

// let manager = new XBLEManager()
// setTimeout(() => {
//   manager.startDeviceScan(null, null, (error, device) => {
//     console.warn('error', error)
//     console.warn('device', device)
//     // manager.stopDeviceScan()
//     device
//       .connect()
//       .then((device) => {
//         return device.discoverAllServicesAndCharacteristics()
//       })
//       .then((res) => {
//         console.warn('Next Device', res)
//         const { device, service, characteristics } = res
//         const suuid = service[0].uuid
//         const cuuid = characteristics[0].uuid

//         manager.readCharacteristicForDevice(device.id, suuid, cuuid).then((c) => {
//           console.warn('HELLO', c)
//         })

//         manager.servicesForDevice(device.id, suuid).then((services) => {
//           console.warn('Services', services)
//         })

//         manager.descriptorsForDevice(device.id, suuid, cuuid).then((descriptors) => {
//           console.warn('descriptors', descriptors)
//         })
//       })
//   })
// }, 3000)

// console.warn('manager', manager)

// setTimeout(() => {
//   const subscription = manager.onStateChange((state) => {
//     console.warn('state', state)
//     if (state === 'PoweredOn') {
//       subscription.remove()
//       console.warn('subscription', subscription)
//     }
//   })
// }, 3000)

function App() {
  return (
    <>
      <Header />
      <Core />
    </>
  )
}

export default App
