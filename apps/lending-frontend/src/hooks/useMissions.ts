import { useState, useEffect } from 'react';
import { useWeb3 } from '../shared/contexts/web3-context';
import { useUser } from '../shared/contexts/user-context';
import { MissionService } from '../services/mission.service';
import { Mission } from '../types/mission.types';

export const useMissions = () => {
  const [availableMissions, setAvailableMissions] = useState<Mission[]>([]);
  const [plannedMissions, setPlannedMissions] = useState<Mission[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, isAdmin } = useUser();
  const { contract } = useWeb3();

  const fetchMissions = async () => {
    try {
      const { available, planned } = MissionService.getMissions(
        isAdmin ? undefined : user?.evmAddress,
        isAdmin
      );
      setAvailableMissions(available);
      setPlannedMissions(planned);
    } catch (error) {
      console.error('Failed to fetch missions:', error);
    } finally {
      setLoading(false);
    }
  };

  const createMission = async (mission: Omit<Mission, 'id' | 'participants' | 'status'>) => {
    const { available, planned } = await MissionService.createMission(mission, contract);
    setAvailableMissions(available);
    setPlannedMissions(planned);
  };

  const handleSubscribeMission = async (missionId: number, userAddress: string, username: string) => {
    const { available, planned } = await MissionService.subscribeMission(missionId, userAddress, username, contract);
    setAvailableMissions(available);
    setPlannedMissions(planned);
  };

  const handleValidateParticipant = async (missionId: number, userAddress: string) => {
    await MissionService.validateParticipant(missionId, userAddress, contract);
    await fetchMissions(); // Rafraîchir les missions après la validation
  };

  const clearAllMissions = async () => {
    console.log('Clearing missions from hook...');
    setLoading(true);
    
    try {
      // Attendre que la suppression soit terminée
      const result = await MissionService.clearAllMissions();
      console.log('Clear result:', result);
      
      // Réinitialiser les états locaux
      setAvailableMissions([]);
      setPlannedMissions([]);
      
      // Désactiver temporairement la synchronisation automatique
      await new Promise(resolve => setTimeout(resolve, 500));
    } catch (error) {
      console.error('Failed to clear missions:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchMissions();
    }
  }, [user]);

  return {
    availableMissions,
    plannedMissions,
    loading,
    refreshMissions: fetchMissions,
    createMission,
    subscribeMission: handleSubscribeMission,
    removeParticipant: MissionService.removeParticipant,
    validateParticipant: handleValidateParticipant,
    clearAllMissions,
  };
}; 