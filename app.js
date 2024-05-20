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
        "type": "function"
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
        "type": "function"
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
        "type": "function"
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
        "type": "function"
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
        "type": "function"
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
        "type": "function"
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
        "type": "function"
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
        "type": "function"
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
        "type": "function"
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
        "name": "hasVoted",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
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
        "type": "function"
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
        "type": "function"
    }
];

const contract = new web3.eth.Contract(abi, contractAddress);
let isConnectedMetamask = false;
let candidates = [];
let candidate;
let currentAccount;
let candidatesBlock = document.querySelector("#candidatesBlock");
let metamaskBtn = document.querySelector("#metamaskBtn");
let voteBtn = document.querySelector("#voteBtn");
console.log(contract);

function showLoader() {
    document.querySelector("body > div > div").style.opacity='0.6';
    document.querySelector(".loader").style.display='block';
}

function disableLoader() {
    document.querySelector("body > div > div").style.opacity='1';
    document.querySelector(".loader").style.display='none';
}


window.onload = async function() {
    
    //await connectMetamask();
    metamaskBtn.addEventListener("click",async function(){
        //check metamask is installed
        if (window.ethereum) {
            // instantiate Web3 with the injected provider
            const web3 = new Web3(window.ethereum);

            //request user to connect accounts (Metamask will prompt)
            try {
                const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
                currentAccount = accounts[0];
                isConnectedMetamask = true;
            } catch(err) {
                console.log(err);
                if (err.code === 4001) return
            }

            if (isConnectedMetamask) {
                metamaskBtn.disabled=true;
                const owner = await contract.methods.getOwner().call();

                if (currentAccount.split('0x')[1].toUpperCase() == owner.split('0x')[1]) {
                    document.querySelector("div.adminBlock").classList.remove('adminBlock')
                    return;
                }

                //Добавить проверку, что уже голосовал

                const candidatesCount = await contract.methods.getCandidatesCount().call();
                for (let i=1; i<=candidatesCount; i++) {

                    candidate = await contract.methods.getCandidate(i).call();
                    candidates.push({
                        name: candidate,
                        id: i
                    })
                    candidatesBlock.innerHTML+=
                    `<div class='d-flex justify-content-between'>
                        <p class='text-default fs-5 mb-0'>`+candidate+`</p><input type='checkbox' id="`+i+`">
                    </div>`;
                    document.querySelector("body > div > div > div > h2:nth-child(3)").style.display='block';
                    voteBtn.style.display='block';

                    document.querySelector("#candidatesBlock").querySelectorAll('input').forEach(function(el){
                        el.addEventListener("click",function(){
                            if (el.checked) {
                                document.querySelector("#candidatesBlock").querySelectorAll('input').forEach(function(el){
                                    el.disabled=true;
                                })
                            }
                            
                        })
                    })

                }
            }
            
        } else {
            alert('Please download metamask');
        }
    });

    voteBtn.addEventListener("click", function() {
        
        if (isConnectedMetamask) {

            document.querySelector("#candidatesBlock").querySelectorAll('input').forEach(function(el){
                if (el.checked) {
                    showLoader();
                    contract.methods.vote(el.id).send({from: currentAccount, gas: 200000})
                        .on('transactionHash', function(hash){
                            // Когда транзакция отправлена, вы можете выполнить дополнительные действия
                            console.log('Transaction hash:', hash);
                        })
                    .on('confirmation', function(confirmationNumber, receipt){
                            // Когда транзакция подтверждена, вы можете выполнить дополнительные действия
                            disableLoader();
                            document.querySelector("body > div > div > div").querySelectorAll("h2,div,button").forEach(el=>el.style.display='none')
                            document.querySelector("div.alert.alert-success").style.display='block';
                            console.log('Confirmation number:', confirmationNumber);
                        })
                    .on('error', function(err){
                            disableLoader();
                            console.log(err);
                    })
                }
            })

        }

    })

    
    const votesCount = await contract.methods.getVotesCount().call();
    const electionsEnd = await contract.methods.getElectionsEnd().call();

    // document.getElementById('owner').innerText = `Owner: ${owner}`;
    // document.getElementById('candidatesCount').innerText = `Candidates Count: ${candidatesCount}`;
    // document.getElementById('votesCount').innerText = `Votes Count: ${votesCount}`;
    // document.getElementById('electionsEnd').innerText = `Elections End: ${electionsEnd}`;

    // const getCandidates = async () => {
    //     const candidatesDiv = document.getElementById('candidates');
    //     candidatesDiv.innerHTML = ''; // Clear previous candidates

    //     for (let i = 1; i <= candidatesCount; i++) {
    //         const candidate = await contract.methods.candidates(i).call();
    //         candidatesDiv.innerHTML += `<div>Candidate ${i}: ${candidate.name} - Votes: ${candidate.voteCount}</div>`;
    //     }
    // };

    // window.getCandidates = getCandidates;

    // const addCandidate = async () => {
    //     const candidateName = document.getElementById('candidateName').value;
    //     await contract.methods.addCandidate(candidateName).send({from: web3.eth.defaultAccount});
    //     alert('Candidate added!');
    // };

    // window.addCandidate = addCandidate;

    // const vote = async () => {
    //     const candidateId = document.getElementById('candidateId').value;
    //     await contract.methods.vote(candidateId).send({from: web3.eth.defaultAccount});
    //     alert('Voted!');
    // }

    // window.vote = vote;

    // const endElections = async () => {
    //     await contract.methods.endElections().send({from: web3.eth.defaultAccount});
    //     document.getElementById('electionsEnd').innerText = `Elections End: ${true}`;
    //     alert('Elections ended!');
    // };

    // window.endElections = endElections;

    // const getWinner = async () => {
    //     const winner = await contract.methods.getWinner().call();
    //     document.getElementById('winner').innerText = `Winner: ${winner}`;
    // };

    // window.getWinner = getWinner;
};
