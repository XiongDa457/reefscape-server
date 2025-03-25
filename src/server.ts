import { createServer } from 'http'
import { parse } from 'url'
import next from 'next'
import { fetchMatches, generateCode, getIP } from './utils'
import { Server } from 'socket.io'
import { MatchInfo } from './types'

const team = "4308"
const event = "demo6271"
const code = generateCode(10) 

var matches: MatchInfo[] = []
fetchMatches(event).then((res) => { matches = res })

const port = 4308
const server = createServer()
const io = new Server(server)

io.on("connection", (socket) => {
  let scouterName = ""

  socket.on("get names", () => {
    socket.emit("names", ["Dalton Su"])
  })

  socket.on("set name", (data) => { 
    scouterName = data
  })

  socket.on("get schedule", () => {
    socket.emit("schedule", matches)
  })
})

server.listen(port)

const fetchOptions: { [key: string]: () => Promise<any> } = {
  getQR: async () => { return { ip: getIP(), port: port.toString(), team: team, event: event, code: code } },
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

