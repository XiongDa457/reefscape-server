import { createServer } from 'http'
import { parse } from 'url'
import next from 'next'
import { networkInterfaces } from 'os'
 
function getIP() {
  const netInters = networkInterfaces()
  for (const netInter of Object.values(netInters)) {
    if (netInter == undefined) continue
    for (const net of netInter) {
      if (net.family != "IPv4" || net.internal) continue
      return net.address
    }
  }
  return ""
}

const chars = "abcdefghijklmnopqrstuvwyzABCDEFGHIJKLMNOPQRSTUV1234567890"
function generateCode(length: number) {
  var result = '';
  for (var i = 0; i < length; i++) result += chars[Math.floor(Math.random() * chars.length)];
  return result;
}

const port = 3000
const page = next({})
const handle = page.getRequestHandler()

const team = 4308
const code = generateCode(10) 

const fetchOptions: any = {
  getQR: () => { return { ip: getIP(), team: team, event: "placeholder", code: code } }
}
 
page.prepare().then(() => {
  createServer((req, res) => {
    const parsedUrl = parse(req.url!, true)

    if (parsedUrl.pathname == "/api") {
      const fetch = parsedUrl.query.fetch?.toString()
      if (fetch == undefined || fetchOptions[fetch] == undefined) res.writeHead(400, `Cannot fetch ${fetch}`)
      else res.write(JSON.stringify(fetchOptions[fetch]()))

      res.end()
    }
    else handle(req, res, parsedUrl)
  }).listen(port)
 
  console.log(`> Admin Page at http://localhost:${port}`)
})



