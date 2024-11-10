import { Mission } from '../types/mission.types';
import { ContractTransactionResponse } from "ethers";
import { KindToken } from '../contracts/types';

const STORAGE_PREFIX = 'kindquest_shared_';

export const MissionService = {
  createMission: async (mission: Omit<Mission, 'id' | 'participants' | 'status'>, contract: KindToken | null) => {
    if (!contract) {
      throw new Error("Contract not initialized");
    }

    try {
      // Créer la mission dans le contrat
      const tx = await contract.createMission(
        mission.title,
        mission.description,
        BigInt(Math.floor(mission.xpReward * 1e18)),
        BigInt(Math.floor(mission.xrpReward * 1e18))
      ) as ContractTransactionResponse;
      
      await tx.wait();

      // Récupérer l'ID de la mission depuis le contrat
      const missionCount = await contract.missionCount();
      const newId = Number(missionCount) - 1;

      // Sauvegarder dans le localStorage
      const missions = JSON.parse(localStorage.getItem(`${STORAGE_PREFIX}missions`) || '[]') as Mission[];
      
      const newMission: Mission = {
        ...mission,
        id: newId,
        participants: [],
        status: 'available'
      };

      missions.push(newMission);
      localStorage.setItem(`${STORAGE_PREFIX}missions`, JSON.stringify(missions));

      console.log('Mission created:', newMission);
      console.log('Updated missions:', missions);

      return {
        available: missions,
        planned: JSON.parse(localStorage.getItem(`${STORAGE_PREFIX}plannedMissions`) || '[]')
      };
    } catch (error) {
      console.error('Failed to create mission:', error);
      throw error;
    }
  },

  subscribeMission: async (missionId: number, userAddress: string, username: string, contract: KindToken | null) => {
    if (!contract) {
      throw new Error("Contract not initialized");
    }

    console.log('Subscribing to mission:', { missionId, userAddress, username });
    
    const missions = JSON.parse(localStorage.getItem(`${STORAGE_PREFIX}missions`) || '[]') as Mission[];
    const plannedMissions = JSON.parse(localStorage.getItem(`${STORAGE_PREFIX}plannedMissions`) || '[]') as Mission[];
    
    const missionIndex = missions.findIndex(m => m.id === missionId);
    
    if (missionIndex !== -1) {
      const mission = missions[missionIndex];
      let plannedMission = plannedMissions.find(m => m.id === missionId);

      if (!plannedMission) {
        plannedMission = {
          ...mission,
          status: 'planned' as const,
          participants: []
        };
        plannedMissions.push(plannedMission);
      }

      if (!plannedMission.participants.some(p => p.address === userAddress)) {
        const missionToUpdate = plannedMissions.find(m => m.id === missionId);
        if (missionToUpdate) {
          missionToUpdate.participants.push({
            address: userAddress,
            username,
            status: 'pending' as const
          });
        }
      }

      localStorage.setItem(`${STORAGE_PREFIX}plannedMissions`, JSON.stringify(plannedMissions));

      return {
        available: missions,
        planned: plannedMissions
      };
    }

    return {
      available: missions,
      planned: plannedMissions
    };
  },

  getMissions: (userAddress?: string, isAdmin: boolean = false) => {
    console.log('Getting missions for user:', userAddress, 'isAdmin:', isAdmin);
    const missions = JSON.parse(localStorage.getItem(`${STORAGE_PREFIX}missions`) || '[]') as Mission[];
    const plannedMissions = JSON.parse(localStorage.getItem(`${STORAGE_PREFIX}plannedMissions`) || '[]') as Mission[];

    console.log('Current state:', { missions, plannedMissions });

    if (userAddress && !isAdmin) {
      const availableMissions = missions.filter(mission => 
        !plannedMissions.some(pm => 
          pm.id === mission.id && 
          pm.participants.some(p => p.address === userAddress)
        )
      );

      const userPlannedMissions = plannedMissions.filter(mission =>
        mission.participants.some(p => p.address === userAddress)
      );

      return {
        available: availableMissions,
        planned: userPlannedMissions
      };
    }

    return {
      available: missions,
      planned: plannedMissions
    };
  },

  syncWithContract: async (contractMissions: any[], userAddress?: string, isAdmin: boolean = false) => {
    // Cette fonction n'est plus nécessaire si on gère tout en local
    const missions = JSON.parse(localStorage.getItem(`${STORAGE_PREFIX}missions`) || '[]') as Mission[];
    const plannedMissions = JSON.parse(localStorage.getItem(`${STORAGE_PREFIX}plannedMissions`) || '[]') as Mission[];

    return {
      available: missions,
      planned: plannedMissions
    };
  },

  clearAllMissions: () => {
    console.log('Clearing all missions from all storages...');
    
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith(STORAGE_PREFIX)) {
        console.log('Removing key:', key);
        localStorage.removeItem(key);
      }
    });

    localStorage.setItem(`${STORAGE_PREFIX}missions`, '[]');
    localStorage.setItem(`${STORAGE_PREFIX}plannedMissions`, '[]');
    
    return new Promise<{available: Mission[], planned: Mission[]}>(resolve => {
      setTimeout(() => {
        console.log('After clear - localStorage:', localStorage);
        resolve({
          available: [],
          planned: []
        });
      }, 100);
    });
  },

  addVerifier: async (contract: KindToken | null, verifierAddress: string) => {
    if (!contract) {
      throw new Error("Contract not initialized");
    }

    try {
      console.log('Adding verifier:', verifierAddress);
      const tx = await contract.addVerifier(verifierAddress) as ContractTransactionResponse;
      await tx.wait();
      console.log('Verifier added successfully');
    } catch (error) {
      console.error('Failed to add verifier:', error);
      throw error;
    }
  },

  validateParticipant: async (missionId: number, userAddress: string, contract: KindToken | null) => {
    if (!contract) {
      throw new Error("Contract not initialized");
    }

    try {
      console.log('Validating participant:', { missionId, userAddress });

      // Récupérer l'adresse du signeur (admin)
      const signer = await contract.runner?.getAddress();
      if (!signer) {
        throw new Error("No signer available");
      }

      // Vérifier si l'admin est déjà un vérificateur
      const isVerifier = await contract.verifiers(signer);
      if (!isVerifier) {
        console.log('Admin is not a verifier, adding as verifier...');
        // Ajouter l'adresse du signeur comme vérificateur
        const addTx = await contract.addVerifier(signer) as ContractTransactionResponse;
        await addTx.wait();
        console.log('Admin added as verifier');
      }

      // Appeler la fonction du contrat pour valider et envoyer les récompenses
      const tx = await contract.completeMissionForParticipant(BigInt(missionId), userAddress) as ContractTransactionResponse;
      console.log('Transaction sent:', tx.hash);
      
      // Attendre la confirmation de la transaction
      const receipt = await tx.wait();
      console.log('Transaction confirmed:', receipt);

      // Mettre à jour le statut dans le localStorage
      const plannedMissions = JSON.parse(localStorage.getItem(`${STORAGE_PREFIX}plannedMissions`) || '[]') as Mission[];
      const missionIndex = plannedMissions.findIndex(m => m.id === missionId);
      
      if (missionIndex !== -1) {
        const participantIndex = plannedMissions[missionIndex].participants.findIndex(
          p => p.address === userAddress
        );
        
        if (participantIndex !== -1) {
          plannedMissions[missionIndex].participants[participantIndex].status = 'validated';
          localStorage.setItem(`${STORAGE_PREFIX}plannedMissions`, JSON.stringify(plannedMissions));
          
          console.log('Local storage updated:', {
            mission: plannedMissions[missionIndex],
            participant: plannedMissions[missionIndex].participants[participantIndex]
          });
        }
      }

      return {
        available: JSON.parse(localStorage.getItem(`${STORAGE_PREFIX}missions`) || '[]'),
        planned: plannedMissions
      };
    } catch (error) {
      console.error('Failed to validate participant:', error);
      throw error;
    }
  },

  removeParticipant: (missionId: number, userAddress: string) => {
    const { planned } = MissionService.getMissions();
    const missionIndex = planned.findIndex(m => m.id === missionId);
    
    if (missionIndex !== -1) {
      planned[missionIndex].participants = planned[missionIndex].participants.filter(
        p => p.address !== userAddress
      );
      
      localStorage.setItem(`${STORAGE_PREFIX}plannedMissions`, JSON.stringify(planned));
    }
  }
}; 