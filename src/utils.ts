import { networkInterfaces } from "os"
import { MatchData, MatchInfo } from "./types"
import * as sqlite3 from "sqlite3"

sqlite3.verbose()

const db = new sqlite3.Database("database.db")
var eventKey = ""

export function initDB(event: string) {
  eventKey = event
  db.run("CREATE TABLE IF NOT EXISTS scouters (name TEXT PRIMARY KEY);")
  db.run(`CREATE TABLE IF NOT EXISTS ${event} (data TEXT);`)
  db.run(`CREATE TABLE IF NOT EXISTS ${event}_schedule (label TEXT PRIMARY KEY, data TEXT);`)
}

export function addScouter(scouter: string) {
  db.run(`INSERT OR IGNORE INTO scouters (name) VALUES('${scouter}');`)
}

export function getScouters(callback: (val: string[]) => void) {
  db.all(`SELECT name FROM scouters;`, (_, rows) => {
    callback(rows.map((v: any) => v.name))
  })
}

export function addMatchData(data: MatchData) {
  db.run(`INSERT INTO ${eventKey} (data) VALUES('${JSON.stringify(data)}');`)
}

function updateSchedule(label: string, key: string, val: any) {
  if (val == undefined) return
  db.run(`UPDATE ${eventKey}_schedule SET data=json_set(data, '$.${key}', json('${JSON.stringify(val)}')) WHERE label='${label}'`)
}

export function addScheduleInfo(info: MatchInfo) {
  const key = `EXISTS(SELECT 1 FROM ${eventKey}_schedule WHERE label="${info.label}")`
  db.get(`SELECT ${key};`, (_, res: any) => {
    if (res[key] == 0) {
      info.redScouters = ["Dalton Su", null, null]
      info.blueScouters = [null, null, null]
      info.redScouted = info.blueScouted = [false, false, false]
      db.run(`INSERT INTO ${eventKey}_schedule (label, data) VALUES('${info.label}', '${JSON.stringify(info)}')`)
    }
    else {
      updateSchedule(info.label, "times", info.times)
      updateSchedule(info.label, "redScouters", info.redScouters)
      updateSchedule(info.label, "redScouted", info.redScouted)
      updateSchedule(info.label, "blueScouters", info.blueScouters)
      updateSchedule(info.label, "blueScouted", info.blueScouted)
    }
  })
}

export function getScheduleFor(scouter: string, callback: (val: any[]) => void) {
  db.all(`SELECT * FROM ${eventKey}_schedule WHERE 
              json_extract(data, '$.redScouters') LIKE '%${scouter}%' OR 
              json_extract(data, '$.blueScouters') LIKE '%${scouter}%' 
              ORDER BY json_extract(data, '$.times.estimatedStartTime') ASC;`, (_, rows) => { callback(rows) })
}

export function getIP() {
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

export async function fetchMatches() {
  const response = await fetch(`https://frc.nexus/api/v1/event/${eventKey}`, {
    method: 'GET',
    headers: new Headers({
      'Nexus-Api-Key': process.env.NEXUS_API_KEY ? process.env.NEXUS_API_KEY : ""
    })
  })
  if (!response.ok) {
    console.error(await response.text())
    return []
  }
  return ((await response.json()) as any).matches
}

