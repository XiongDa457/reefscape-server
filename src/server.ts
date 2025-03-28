import { createServer } from 'http'
import { parse } from 'url'
import next from 'next'
import { addMatchData, addScheduleInfo, addScouter, fetchMatches, getIP, getScheduleFor, getScouters, initDB } from './utils'
import { Server } from 'socket.io'
import { MatchData } from './types'

const team = "4308"
const event = "demo6271"

initDB(event) 
function updateSchedule() {
  fetchMatches().then((res) => {
    for (const match of res) {
      addScheduleInfo({
        label: match.label,
        times: match.times,
        redAlliance: match.redTeams,
        blueAlliance: match.blueTeams,
      })
    }
  })
}
updateSchedule()
setInterval(updateSchedule, 9e4)

const port = 4308
const server = createServer()
const io = new Server(server)

io.on("connection", (socket) => {
  let scouterName = ""

  socket.on("get names", () => {
    getScouters((val) => {
      socket.emit("names", val)
    })
  })

  socket.on("set name", (data) => { 
    scouterName = data
    addScouter(data)
  })

  socket.emit("get name")

  socket.on("get schedule", () => {
    getScheduleFor(scouterName, (val) => {
      socket.emit("schedule", val.map((item) => {
        const data = JSON.parse(item.data)

        var ind = data.redScouters.indexOf(scouterName)
        var red = true
        if (ind == -1) {
          ind = data.blueScouters.indexOf(scouterName)
          red = false
        }

        return {
          label: data.label,
          times: data.times,
          redAlliance: data.redAlliance,
          blueAlliance: data.blueAlliance,
          scoutedTeam: (red ? data.redAlliance : data.blueAlliance)[ind],
          scouted: (red ? data.redScouted : data.blueScouted)[ind],
        }
      }))
    })
  })

  socket.on("upload", (val: MatchData) => addMatchData(val))
})

server.listen(port)

const fetchOptions: { [key: string]: () => Promise<any> } = {
  getQR: async () => { return { ip: getIP(), port: port.toString(), team: team, event: event } },
}
 
const page = next({})
const handle = page.getRequestHandler()

page.prepare().then(() => {
  createServer((req, res) => {
    const parsedUrl = parse(req.url!, true)

    if (parsedUrl.pathname == "/api") {
      const fetch = parsedUrl.query.fetch?.toString()
      if (fetch == undefined || fetchOptions[fetch] == undefined) {
        res.writeHead(400, `Cannot fetch ${fetch}`) 
        res.end()
      }
      else {
        fetchOptions[fetch]().then((val) => {
          res.write(JSON.stringify(val))
          res.end()
        })
      }
    }
    else handle(req, res, parsedUrl)
  }).listen(3000)
 
  console.log(`> Admin Page at http://localhost:3000`)
})

