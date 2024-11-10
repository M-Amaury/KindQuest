export interface Mission {
  id: number;
  date: string;
  time?: string;
  address?: string;
  xrp: number;
  kind: number;
  status?: "planned" | "validated" | "not-validated";
}

export const currentMissions: Mission[] = [
  {
    id: 1,
    date: "Monday 11 Novembre",
    time: "5 PM - 8 PM",
    address: "84 rue Beaubourg, 75003 Paris",
    xrp: 3,
    kind: 8
  },
  // ... autres missions actuelles
];

export const plannedMissions: Mission[] = [
  {
    id: 6,
    date: "Saturday 20 November",
    time: "5 PM - 8 PM",
    address: "84 rue Beaubourg, 75003 Paris",
    xrp: 3,
    kind: 8,
    status: "planned"
  },
  // ... autres missions planifiées
];

export const historyMissions: Mission[] = [
  {
    id: 8,
    date: "Sunday 10 November",
    xrp: 2,
    kind: 5,
    status: "validated"
  },
  // ... autres missions historiques
]; 