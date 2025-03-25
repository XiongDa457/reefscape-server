import { networkInterfaces } from "os"
import { MatchInfo } from "./types"

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

const chars = "abcdefghijklmnopqrstuvwyzABCDEFGHIJKLMNOPQRSTUV1234567890"
export function generateCode(length: number) {
  var result = '';
  for (var i = 0; i < length; i++) result += chars[Math.floor(Math.random() * chars.length)];
  return result;
}

export async function fetchMatches(eventKey: string) {
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

  let matches: MatchInfo[] = []
  const data: any = await response.json()
  for (const match of data.matches) {
    matches.push({
      label: match.label,
      time: match.times.estimatedStartTime,
      redAlliance: match.redTeams,
      blueAlliance: match.blueTeams
    })
  }

  return matches
}
