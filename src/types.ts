export type MatchInfo = {
  label: string
  times: {[key: string] : number}

  redAlliance: (string | null)[]
  redScouters: (string | null)[]

  blueAlliance: (string | null)[]
  blueScouters: (string | null)[]
}
export enum ActionType {
  LEAVE,
  INTAKE_CORAL,
  DROP_CORAL,
  SCORE_L1,
  SCORE_L2,
  SCORE_L3,
  SCORE_L4,
  MISS_CORAL,
  INTAKE_ALGAE,
  DROP_ALGAE,
  SCORE_NET,
  MISS_NET,
  SCORE_PROCESSOR
}

export type Action = {
  type: ActionType
  time: number
}

export type BargeT = "no_attempt" | "parked" | "shallow_fail" | "shallow_success" | "deep_fail" | "deep_success"
export type RoleT = "offense" | "defense" | "feeder" | "immobile"
export type DriverAbilityT = 1 | 2 | 3 | 4 | 5
export type CoralPickupT = "none" | "ground" | "station" | "both"
export type AlgaePickupT = "none" | "ground" | "reef" | "both"
export type MatchResultT = "win" | "loss" | "tie"
export type PenaltyT = "none" | "yellow" | "red"

export type PostGame = {
  bargeResult: BargeT

  role: RoleT
  driverAbility: DriverAbilityT
  traversesShallowCage: boolean

  coralPickup: CoralPickupT
  algaePickup: AlgaePickupT
  clearsReef: boolean

  matchResult: MatchResultT
  autoRP: boolean
  coralRP: boolean
  bargeRP: boolean

  coopertitionPoint: boolean

  penaltiesForOpponent: number
  penaltyCard: PenaltyT

  notes: string
}

export type MatchData = {
  label: string
  teamNumber: string,
  alliance: "red" | "blue"

  autoActions: Action[]
  teleopActions: Action[]
  postGame: PostGame
}

