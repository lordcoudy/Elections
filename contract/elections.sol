// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.24;
import "@openzeppelin/contracts/utils/Strings.sol";

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
    uint public votesCount = 0; // Общее количество отданных голосов

    bool electionsEnd = false; // Флаг, указывающий, закончились ли выборы

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
     * @dev Функция для голосования за кандидата.
     * @param _candidateId ID кандидата, за которого голосуют.
     */
    function vote (uint _candidateId) public {
        require(!voters[msg.sender]);
        require(_candidateId > 0 && _candidateId <= candidatesCount);
        voters[msg.sender] = true;
        candidates[_candidateId].voteCount ++;
        votesCount ++;
    }
    
    /**
     * @dev Функция для начала второго тура.
     */
    function startSecondTour() public restricted anyVotes {
        minVotesId = 1;
        minPercentage = 100;
        for (uint i = 1; i <= candidatesCount; i++)
        {
            uint percentage = getPercentage(i);
            if (percentage < minPercentage)
            {
                minPercentage = percentage;
                minVotesId = i;
            }
        }
        delete candidates[minVotesId];
        candidatesCount--;
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