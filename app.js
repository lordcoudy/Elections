const web3 = new Web3(Web3.givenProvider || "ws://localhost:7545");
const contractAddress = '0x2427c38B47A8eB36Baa563Ccb9bE40301E68652f'; // Replace with your contract address
const abi = [
    {
        "inputs": [],
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "name": "candidates",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "id",
                "type": "uint256"
            },
            {
                "internalType": "string",
                "name": "name",
                "type": "string"
            },
            {
                "internalType": "uint256",
                "name": "voteCount",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function",
        "constant": true
    },
    {
        "inputs": [],
        "name": "candidatesCount",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function",
        "constant": true
    },
    {
        "inputs": [],
        "name": "owner",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function",
        "constant": true
    },
    {
        "inputs": [],
        "name": "votesCount",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function",
        "constant": true
    },
    {
        "inputs": [],
        "name": "getOwner",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function",
        "constant": true
    },
    {
        "inputs": [],
        "name": "getCandidatesCount",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function",
        "constant": true
    },
    {
        "inputs": [],
        "name": "getVotesCount",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function",
        "constant": true
    },
    {
        "inputs": [],
        "name": "getElectionsEnd",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function",
        "constant": true
    },
    {
        "inputs": [
            {
                "internalType": "string",
                "name": "_name",
                "type": "string"
            }
        ],
        "name": "addCandidate",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_id",
                "type": "uint256"
            }
        ],
        "name": "getCandidate",
        "outputs": [
            {
                "internalType": "string",
                "name": "",
                "type": "string"
            }
        ],
        "stateMutability": "view",
        "type": "function",
        "constant": true
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_candidateId",
                "type": "uint256"
            }
        ],
        "name": "vote",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "startSecondTour",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "endElections",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getWinner",
        "outputs": [
            {
                "internalType": "string",
                "name": "",
                "type": "string"
            }
        ],
        "stateMutability": "view",
        "type": "function",
        "constant": true
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_candidateId",
                "type": "uint256"
            }
        ],
        "name": "getPercentage",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function",
        "constant": true
    }
];

const contract = new web3.eth.Contract(abi, contractAddress);
let accounts = [];
let metamaskBtn = document.querySelector("#metamaskBtn");
let voteBtn = document.querySelector("#voteBtn");
console.log(contract);


window.onload = async function() {
    //await connectMetamask();
    metamaskBtn.addEventListener("click",async function(){
        //check metamask is installed
        if (window.ethereum) {
            // instantiate Web3 with the injected provider
            const web3 = new Web3(window.ethereum);

            //request user to connect accounts (Metamask will prompt)
            await window.ethereum.request({ method: 'eth_requestAccounts' });

            //get the connected accounts
            accounts = await web3.eth.getAccounts();
            console.log(accounts.length);
        } else {
            alert('Please download metamask');
        }
    });

    voteBtn.addEventListener("click", function() {
        //обращение к контракту если все норм проголосовалось то:

    })

    const owner = await contract.methods.getOwner().call().then(console.log);
    const candidatesCount = await contract.methods.getCandidatesCount().call();
    const votesCount = await contract.methods.getVotesCount().call();
    const electionsEnd = await contract.methods.getElectionsEnd().call();

    document.getElementById('owner').innerText = `Owner: ${owner}`;
    document.getElementById('candidatesCount').innerText = `Candidates Count: ${candidatesCount}`;
    document.getElementById('votesCount').innerText = `Votes Count: ${votesCount}`;
    document.getElementById('electionsEnd').innerText = `Elections End: ${electionsEnd}`;

    const getCandidates = async () => {
        const candidatesDiv = document.getElementById('candidates');
        candidatesDiv.innerHTML = ''; // Clear previous candidates

        for (let i = 1; i <= candidatesCount; i++) {
            const candidate = await contract.methods.candidates(i).call();
            candidatesDiv.innerHTML += `<div>Candidate ${i}: ${candidate.name} - Votes: ${candidate.voteCount}</div>`;
        }
    };

    window.getCandidates = getCandidates;

    const addCandidate = async () => {
        const candidateName = document.getElementById('candidateName').value;
        await contract.methods.addCandidate(candidateName).send({from: web3.eth.defaultAccount});
        alert('Candidate added!');
    };

    window.addCandidate = addCandidate;

    const vote = async () => {
        const candidateId = document.getElementById('candidateId').value;
        await contract.methods.vote(candidateId).send({from: web3.eth.defaultAccount});
        alert('Voted!');
    }

    window.vote = vote;

    const endElections = async () => {
        await contract.methods.endElections().send({from: web3.eth.defaultAccount});
        document.getElementById('electionsEnd').innerText = `Elections End: ${true}`;
        alert('Elections ended!');
    };

    window.endElections = endElections;

    const getWinner = async () => {
        const winner = await contract.methods.getWinner().call();
        document.getElementById('winner').innerText = `Winner: ${winner}`;
    };

    window.getWinner = getWinner;
};
