// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 <0.9.0;

interface IMyERC20Votes {
    function getPastVotes(address account, uint256 blockNumber) external view returns (uint256);
}

contract TokenizedBallot {
    string public name = "TokenizedBallot";

    struct Proposal {
        bytes32 name;
        uint voteCount;
    }

    IMyERC20Votes public tokenContract;

    Proposal[] public proposals;

    mapping(address => uint256) public votingPowerSpent;
    uint256 public targetBlockNumber;
    uint256 public numProposals;

    event VoteCasted(address indexed from, uint indexed proposal, uint256 amount);

    constructor(bytes32[] memory proposalNames, address _tokenContract, uint256 _targetBlockNumber) {
        tokenContract = IMyERC20Votes(_tokenContract);
        targetBlockNumber = _targetBlockNumber;
        numProposals = 0;
        for (uint i = 0; i < proposalNames.length; i++) {
            proposals.push(Proposal({ name: proposalNames[i], voteCount: 0 }));
            numProposals++;
        }
    }

    function vote(uint proposal, uint256 amount) external {
        require(amount > 0, "Not Valid Voting Power Amount");
        require(votingPower(msg.sender) >= amount, "Not Enough Voting Power");

        votingPowerSpent[msg.sender] += amount;
        proposals[proposal].voteCount += amount;

        emit VoteCasted(msg.sender, proposal, amount);
    }

    function votingPower(address account) public view returns (uint256) {
        return tokenContract.getPastVotes(account, targetBlockNumber) - votingPowerSpent[account];
    }

    function winningProposal() public view returns (uint winningProposal_) {
        uint winningVoteCount = 0;
        for (uint p = 0; p < proposals.length; p++) {
            if (proposals[p].voteCount > winningVoteCount) {
                winningVoteCount = proposals[p].voteCount;
                winningProposal_ = p;
            }
        }
        return winningProposal_;
    }

    function winnerName() external view returns (bytes32 winnerName_) {
        return proposals[winningProposal()].name;
    }
}
