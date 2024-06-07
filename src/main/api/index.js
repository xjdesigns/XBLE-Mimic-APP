import express from 'express'
import expressWs from 'express-ws'
import cors from 'cors'
import fs from 'fs'
import path from 'path'
const port = 3000
let server

export const API = {
  app: express(),

  startApi() {
    this.app.use(cors())
    this.app.options('*', cors())
    expressWs(this.app)

    // Routes
    this.app.get('/permissionRequest', (req, res) => {
      getFile('savefile.json', (data) => {
        const { permissionRequest } = data
        res.send(permissionRequest)
      })
    })

    this.app.ws('/state', (ws) => {
      ws.on('message', (msg) => {
        if (msg.includes('ws:close')) {
          ws.close()
        } else {
          getFile('savefile.json', (data) => {
            const { initialState, endState } = data
            if (msg.includes('ws:initial')) {
              ws.send(initialState)
            } else {
              ws.send(endState)
            }
          })
        }
      })
    })

    this.app.ws('/startDeviceScan', (ws) => {
      ws.on('message', (msg) => {
        if (msg.includes('ws:close')) {
          ws.close()
        } else {
          getFile('savefile.json', (data) => {
            const { devices } = data
            ws.send(JSON.stringify(devices))
          })
        }
      })
    })

    this.app.get('/device', (req, res) => {
      const deviceId = req.query.deviceId

      getFile('savefile.json', (data) => {
        const { devices } = data
        const device = devices.filter((d) => d?.device?.id === deviceId)
        const output = device.length > 0 ? device[0] : {}
        res.send(output)
      })
    })

    server = this.app.listen(port, () => {
      console.log(`BLE MOCK listening on port ${port}`)
    })
  },

  closeApi() {
    server.close()
  }
}

function getFile(fileName, fn) {
  fs.readFile(path.join(__dirname, `../../resources/${fileName}`), 'utf8', (err, data) => {
    if (err) {
      console.warn('err', err)
      throw new Error()
    }
    const parsed = JSON.parse(data)
    // TODO: Change to return the data and handle per each call
    // We will always call for the file, then each call can do what is needed
    fn && fn(parsed)
  })
}
