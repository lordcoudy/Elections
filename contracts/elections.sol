// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.13;
/**
 * @title Голосование
 * @dev Реализует простую систему голосования.
 */
contract Voting {
    // Структура для деталей кандидата
    struct Candidate {
        uint id; // ID кандидата
        string name; // Имя кандидата
        uint voteCount; // Количество голосов за кандидата
    }

    address public owner; // Владелец контракта
    mapping(uint => Candidate) public candidates; // Сопоставление от ID кандидата к структуре Кандидата
    uint public candidatesCount; // Общее количество кандидатов

    mapping(address => bool) private voters; // Сопоставление для отслеживания, голосовал ли уже адрес
    address[] private votersAddress;
    uint public votesCount = 0; // Общее количество отданных голосов

    bool electionsEnd = false; // Флаг, указывающий, закончились ли выборы

    uint[] private minVotesId;
    mapping (uint => uint) minPercentages;

    // Модификатор для ограничения доступа к функции владельцем контракта
    modifier restricted() {
        require(msg.sender == owner);
        _;
    }

    modifier anyVotes() {
        require(votesCount > 0);
        _;
    }

    /**
     * @dev Конструктор, инициализирующий контракт.
     */
    constructor () {
        owner = msg.sender;
        addCandidate("John Wick");
        addCandidate("Neo");
        addCandidate("Keanu Reeves");
    }

    /**
     * @dev Функция для получения владельца контракта.
     * @return Адрес владельца контракта.
     */
    function getOwner() public view returns (address) {
        return owner;
    }

    /**
     * @dev Функция для получения общего количества кандидатов.
     * @return Общее количество кандидатов.
     */
    function getCandidatesCount() public view returns (uint) {
        return candidatesCount;
    }

    /**
     * @dev Функция для получения общего количества отданных голосов.
     * @return Общее количество отданных голосов.
     */
    function getVotesCount() public view returns (uint) {
        return votesCount;
    }

    /**
     * @dev Функция для проверки, закончились ли выборы.
     * @return Булево значение, указывающее, закончились ли выборы.
     */
    function getElectionsEnd() public view returns (bool) {
        return electionsEnd;
    }

    /**
     * @dev Функция для добавления нового кандидата.
     * @param _name Имя кандидата.
     */
    function addCandidate (string memory _name) public restricted {
        candidatesCount ++;
        candidates[candidatesCount] = Candidate(candidatesCount, _name, 0);
    }

    /**
    * @dev Функция для получения имени кандидата по ID.
    * @param _id ID кандидата.
    * @return Имя кандидата.
    */
    function getCandidate (uint _id) public view returns (string memory)
    {
        return candidates[_id].name;
    }

    /**
     * @dev Функция для голосования за кандидата.
     * @param _candidateId ID кандидата, за которого голосуют.
     */
    function vote (uint _candidateId) public {
        require(!voters[msg.sender]);
        require(_candidateId > 0 && _candidateId <= candidatesCount);
        votersAddress.push(msg.sender);
        voters[msg.sender] = true;
        candidates[_candidateId].voteCount ++;
        votesCount ++;
    }

    function hasVoted() public view returns (bool) {
        return voters[msg.sender];
    }

    /**
     * @dev Функция для начала второго тура.
     */
    function startSecondTour() public restricted anyVotes {
        minVotesId.push(1);
        uint minPercentage = 100;
        minPercentages[0] = minPercentage;
        for (uint i = 1; i <= candidatesCount; i++)
        {
            uint percentage = getPercentage(i);
            if (percentage < minPercentage)
            {
                minPercentage = percentage;
                minVotesId[0] = i;
                minPercentages[0] = minPercentage;
            }
            else if (percentage == minPercentage)
            {
                minVotesId.push(i);
                uint j = 1;
                minPercentages[j] = minPercentage;
                j++;
            }
        }
        for (uint i = 0; i < minVotesId.length; i++)
        {
            if (minPercentages[0] == minPercentages[i])
            {
                delete candidates[minVotesId[i]];
                candidatesCount--;
            }
        }
        for (uint i = 0; i < votersAddress.length; i++)
        {
            voters[votersAddress[i]] = false;
            votersAddress.pop();
        }
        electionsEnd = false;
    }

    /**
     * @dev Функция для завершения выборов.
     */
    function endElections() public restricted anyVotes {
        electionsEnd = true;
    }

    /**
     * @dev Функция для получения победителя выборов.
     * @return Имя победившего кандидата.
     */
    function getWinner() public view returns (string memory) {
        require(electionsEnd);
        uint maxVotes = 0;
        uint winnerId = 0;
        for (uint i = 1; i <= candidatesCount; i++) {
            if (candidates[i].voteCount > maxVotes) {
                maxVotes = candidates[i].voteCount;
                winnerId = i;
            }
        }
        return candidates[winnerId].name;
    }

    /**
     * @dev Функция для получения процента голосов у кандидата
     * @param _candidateId ID кандидата
     * @return Процент голосов у кандидата
     */
    function getPercentage(uint _candidateId) public view returns (uint) {
        require(_candidateId > 0 && _candidateId <= candidatesCount);
        return candidates[_candidateId].voteCount * 100 / votesCount;
    }
}