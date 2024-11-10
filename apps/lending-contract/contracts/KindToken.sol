// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract KindToken is ERC20, Ownable {
    mapping(address => bool) public verifiers;
    mapping(uint256 => Mission) public missions;
    mapping(uint256 => mapping(address => bool)) public hasBeenRewarded;
    uint256 public missionCount;
    

    struct Mission {
        string title;
        string description;
        uint256 xpReward;
        uint256 xrpReward;
        bool active;
    }

    event MissionCreated(uint256 indexed missionId, string title, uint256 xpReward, uint256 xrpReward);
    event MissionCompleted(uint256 indexed missionId, address indexed participant);
    event VerifierAdded(address indexed verifier);
    event VerifierRemoved(address indexed verifier);
    event TokensMinted(address indexed to, uint256 amount);
    event TokensBurned(address indexed from, uint256 amount);

    constructor() ERC20("KindQuest", "KIND") Ownable(msg.sender) {}

    // Fonction publique pour mint des tokens (seulement par le owner)
    function mint(address to, uint256 amount) external onlyOwner {
        _mint(to, amount);
        emit TokensMinted(to, amount);
    }

    // Fonction publique pour burn des tokens
    function burn(uint256 amount) external {
        require(balanceOf(msg.sender) >= amount, "Not enough tokens to burn");
        _burn(msg.sender, amount);
        emit TokensBurned(msg.sender, amount);
    }

    // Fonction pour que le owner puisse burn les tokens d'une adresse spécifique
    function burnFrom(address account, uint256 amount) external onlyOwner {
        require(balanceOf(account) >= amount, "Not enough tokens to burn");
        _burn(account, amount);
        emit TokensBurned(account, amount);
    }

    modifier onlyVerifier() {
        require(verifiers[msg.sender], "Not authorized as verifier");
        _;
    }

    function addVerifier(address _verifier) external onlyOwner {
        verifiers[_verifier] = true;
        emit VerifierAdded(_verifier);
    }

    function removeVerifier(address _verifier) external onlyOwner {
        verifiers[_verifier] = false;
        emit VerifierRemoved(_verifier);
    }

    function createMission(
        string memory _title,
        string memory _description,
        uint256 _xpReward,
        uint256 _xrpReward
    ) external onlyOwner {
        missions[missionCount] = Mission({
            title: _title,
            description: _description,
            xpReward: _xpReward,
            xrpReward: _xrpReward,
            active: true
        });

        emit MissionCreated(missionCount, _title, _xpReward, _xrpReward);
        missionCount++;
    }

    function completeMissionForParticipant(uint256 _missionId, address _participant) external onlyVerifier {
        require(missions[_missionId].active, "Mission is not active");
        require(!hasBeenRewarded[_missionId][_participant], "Participant already rewarded for this mission");

        hasBeenRewarded[_missionId][_participant] = true;
        _mint(_participant, missions[_missionId].xpReward);

        emit MissionCompleted(_missionId, _participant);
    }

    function closeMission(uint256 _missionId) external onlyOwner {
        missions[_missionId].active = false;
    }

    function isParticipantRewarded(uint256 _missionId, address _participant) external view returns (bool) {
        return hasBeenRewarded[_missionId][_participant];
    }
} 