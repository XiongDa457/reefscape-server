import { createServer } from 'http'
import { parse } from 'url'
import next from 'next'
import { addMatchDB, addScouterDB, fetchMatches, getIP, initDB } from './utils'
import { Server } from 'socket.io'
import { MatchData, MatchInfo } from './types'

const team = "4308"
const event = "demo6271"

var scouters: string[] = []

var matches: MatchInfo[] = []
fetchMatches(event).then((res) => { matches = res })
setInterval(() => {
  fetchMatches(event).then((res) => { matches = res })
}, 6e4)

var scoutedMatches: MatchData[] = []

initDB(event, (val) => {scouters = val}, (val) => {scoutedMatches = val})

const port = 4308
const server = createServer()
const io = new Server(server)

io.on("connection", (socket) => {
  let scouterName = ""

  socket.on("get names", () => {
    socket.emit("names", scouters)
  })

  socket.on("set name", (data) => { 
    scouterName = data
    if (!scouters.includes(data)) {
      scouters.push(data)
      addScouterDB(data)
    }
  })

  socket.on("get schedule", () => {
    socket.emit("schedule", matches.filter((match) => {
      return match.redScouters.includes(scouterName) || match.blueScouters.includes(scouterName)
    }).map((val) => {
        var scoutedTeam: string | null = ""
        const red = val.redScouters.indexOf(scouterName)
        if (red >= 0) scoutedTeam = val.redAlliance[red]
        else scoutedTeam = val.blueAlliance[val.blueScouters.indexOf(scoutedTeam)]

        return {
          label: val.label,
          times: val.times,
          redAlliance: val.redAlliance,
          blueAlliance: val.blueAlliance,
          scoutedTeam: (scoutedTeam as string)
        }
      }))
  })

  socket.on("upload", (val: MatchData) => {
    addMatchDB(event, val)
  })
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

