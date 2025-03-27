import { networkInterfaces } from "os"
import { MatchData, MatchInfo } from "./types"
import * as sqlite3 from "sqlite3"

sqlite3.verbose()
const db = new sqlite3.Database("database.db")
db.run("CREATE TABLE IF NOT EXISTS scouters (name TEXT);")

export function initDB(event: string, setScouters: (val: string[]) => void, setMatchData: (val: MatchData[]) => void) {
  db.run(`CREATE TABLE IF NOT EXISTS ${event} (label TEXT, teamScouted TEXT, data TEXT);`)
  db.all("SELECT name FROM scouters;", (_, rows) => {
    setScouters(rows.map((val) => {
      return (val as any).name
    }))
  })
  db.all(`SELECT data FROM ${event};`, (_, rows) => {
    setMatchData(rows.map((val) => {
      return JSON.parse((val as any).data)
    }))
  })
}

export function addScouterDB(scouter: string) {
  db.run(`INSERT INTO scouters (name) VALUES('${scouter}');`)
}

export function addMatchDB(event:string, data: MatchData) {
  db.run(`INSERT INTO ${event} (label, teamScouted, data) VALUES('${data.label}', '${data.teamNumber}', '${JSON.stringify(data)}');`)
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

export async function fetchMatches(event: string) {
  const response = await fetch(`https://frc.nexus/api/v1/event/${event}`, {
    method: 'GET',
    headers: new Headers({
      'Nexus-Api-Key': process.env.NEXUS_API_KEY ? process.env.NEXUS_API_KEY : ""
    })
  })

  if (!response.ok) {
    console.error(await response.text())
    return []
  }

  let matches: MatchInfo[] = []
  const data: any = await response.json()
  for (const match of data.matches) {
    matches.push({
      label: match.label,
      times: match.times,
      redAlliance: match.redTeams,
      redScouters: ["Dalton Su", null, null],
      blueAlliance: match.blueTeams,
      blueScouters: [null, null, null],
    })
  }

  return matches
}

