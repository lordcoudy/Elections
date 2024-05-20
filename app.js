const web3 = new Web3(Web3.givenProvider || "ws://localhost:7545");
const contractAddress = '0x93b903441f7E1e6d9d1b6d8CE60F18bf5426D057'; // Replace with your contract address
const abi = [
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
		"inputs": [],
		"name": "endElections",
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
		"stateMutability": "nonpayable",
		"type": "constructor"
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

function showLoader() {
    document.querySelector("body > div").style.opacity='0.6';
    document.querySelector("body > div").querySelectorAll('button').forEach(el=>el.disabled=true)
    document.querySelector(".loader").style.display='block';
}

function disableLoader() {
    document.querySelector("body > div").style.opacity='1';
    document.querySelector("body > div").querySelectorAll('button').forEach(el=>el.disabled=false)
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
                const hasVoted = await contract.methods.hasVoted().call({from: currentAccount});
                const isElectionEnd = await contract.methods.getElectionsEnd().call();

                if (!isElectionEnd) {

                    if (hasVoted) {
                        document.querySelector("body > div > div > div > div.alert.alert-primary").style.display='block';
                        return;
                    }

                    //case admin
                    if (currentAccount.split('0x')[1].toUpperCase() == owner.split('0x')[1].toUpperCase()) {
                        document.querySelector("div.row.mb-3.adminBlock").style.display='block';
                        document.querySelector("#addCandidateBtn").style.display='block';
                        document.querySelector("#endElectionBtn").style.display='block';
                        return;
                    }

                    const candidatesCount = await contract.methods.getCandidatesCount().call();
                    for (let i=1; i<=candidatesCount; i++) {

                        candidate = await contract.methods.getCandidate(i).call();
                        candidatesBlock.innerHTML+=
                        `<div class='d-flex justify-content-between'>
                            <p class='text-default fs-5 mb-0'>`+candidate+`</p><input type='checkbox' id="`+i+`">
                        </div>`;
                        document.querySelector("body > div > div:nth-child(2) > div > h2:nth-child(5)").style.display='block';
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

                } else {

                    document.querySelector("#electionEndedMsg").style.display='block';
                    const winner = await contract.methods.getWinner().call();
                    document.querySelector("#electionWinnerMsg").innerHTML+=winner;
                    document.querySelector("#electionWinnerMsg").style.display='block';
                    metamaskBtn.disabled=true;

                    const candidatesCount = await contract.methods.getCandidatesCount().call();
                    candidatesBlock.innerHTML+=
                        `<h3 style="text-align:center;">Results</h3>`;
                    for (let i=1; i<=candidatesCount; i++) {

                        candidate = await contract.methods.getCandidate(i).call();
                        percent = await contract.methods.getPercentage(i).call();

                        candidatesBlock.innerHTML+=
                        `<div class='d-flex justify-content-center'>
                            <p class='text-default fs-5 mb-0'>`+candidate+` - `+percent+` %</p>
                        </div>`;

                    }

                    //case admin
                    if (currentAccount.split('0x')[1].toUpperCase() == owner.split('0x')[1].toUpperCase()) {
                        document.querySelector("div.row.mb-3.adminBlock").style.display='block';
                        document.querySelector("#startSecondBtn").style.display='block';
                        return;
                    }
                }
            }
            
        } else {
            alert('Please download metamask');
        }
    });


    //Vote
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

    //addCandidateBtn
    document.querySelector("#addCandidateBtn").addEventListener('click',function() {
        document.querySelector("#addCandidateInptGroup").style.display='flex'; 
        document.querySelector("#addCandidateInptGroup").classList.add("animate__animated");
        document.querySelector("#addCandidateInptGroup").classList.add("animate__fadeIn");
    })

    //addCandidate (blockchain)
    document.querySelector("#enterCandidateBtn").addEventListener('click',function() {
        let candidateName = document.querySelector("#candidateNameInpt").value;
        if (candidateName != '') {
            showLoader();
            contract.methods.addCandidate(candidateName).send({from: currentAccount, gas: 200000})
                        .on('transactionHash', function(hash){
                            // Когда транзакция отправлена, вы можете выполнить дополнительные действия
                            console.log('Transaction hash:', hash);
                        })
                    .on('confirmation', function(confirmationNumber, receipt){
                            // Когда транзакция подтверждена, вы можете выполнить дополнительные действия
                            disableLoader();
                            console.log('Confirmation number:', confirmationNumber);
                        })
                    .on('error', function(err){
                            disableLoader();
                            console.log(err);
                    })
        }
    })

    //endElection
    document.querySelector("#endElectionBtn").addEventListener('click',function(){
        showLoader();
        contract.methods.endElections().send({from: currentAccount, gas: 200000})
                        .on('transactionHash', function(hash){
                            // Когда транзакция отправлена, вы можете выполнить дополнительные действия
                            console.log('Transaction hash:', hash);
                        })
                    .on('confirmation', function(confirmationNumber, receipt){
                            // Когда транзакция подтверждена, вы можете выполнить дополнительные действия
                            disableLoader();
                            window.location.reload();
                            console.log('Confirmation number:', confirmationNumber);
                        })
                    .on('error', function(err){
                            disableLoader();
                            console.log(err);
                    })
    })
    
    //startSecondTour
    document.querySelector("#startSecondBtn").addEventListener('click',function() {
        showLoader();
        contract.methods.startSecondTour().send({from: currentAccount, gas: 200000})
                        .on('transactionHash', function(hash){
                            // Когда транзакция отправлена, вы можете выполнить дополнительные действия
                            console.log('Transaction hash:', hash);
                        })
                    .on('confirmation', function(confirmationNumber, receipt){
                            // Когда транзакция подтверждена, вы можете выполнить дополнительные действия
                            disableLoader();
                            //window.location.reload();
                            console.log('Confirmation number:', confirmationNumber);
                        })
                    .on('error', function(err){
                            disableLoader();
                            console.log(err);
                    })
    })

};
