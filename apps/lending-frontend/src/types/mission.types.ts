export interface Mission {
  id: number;
  title: string;
  description: string;
  xpReward: number;
  xrpReward: number;
  active: boolean;
  status?: 'available' | 'planned' | 'completed';
  participants: {
    address: string;
    username: string;
    status: 'pending' | 'validated' | 'rejected';
  }[];
} 