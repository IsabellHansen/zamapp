// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

contract PrivacyPad is Ownable, ReentrancyGuard {
    using SafeERC20 for IERC20;

    struct Project {
        uint256 id;
        address projectOwner;
        string name;
        string description;
        uint256 softCap;
        uint256 hardCap;
        uint256 totalRaised;
        uint256 startTime;
        uint256 endTime;
        uint256 minContribution;
        uint256 maxContribution;
        address tokenAddress;
        bool isActive;
        bool isFinalized;
        mapping(address => uint256) contributions;
        mapping(address => bool) hasContributed;
        address[] contributors;
    }

    struct PublicProjectInfo {
        uint256 id;
        address projectOwner;
        string name;
        string description;
        uint256 softCap;
        uint256 hardCap;
        uint256 totalRaised;
        uint256 startTime;
        uint256 endTime;
        uint256 minContribution;
        uint256 maxContribution;
        address tokenAddress;
        bool isActive;
        bool isFinalized;
        uint256 contributorCount;
    }

    mapping(uint256 => Project) private projects;
    uint256 public projectCounter;
    uint256 public platformFeePercentage = 250; // 2.5%
    uint256 public constant FEE_DENOMINATOR = 10000;
    
    address public feeRecipient;

    event ProjectCreated(
        uint256 indexed projectId,
        address indexed owner,
        string name,
        uint256 softCap,
        uint256 hardCap,
        uint256 startTime,
        uint256 endTime
    );

    event ContributionMade(
        uint256 indexed projectId,
        address indexed contributor,
        uint256 amount
    );

    event ProjectFinalized(
        uint256 indexed projectId,
        bool successful,
        uint256 totalRaised
    );

    event FundsWithdrawn(
        uint256 indexed projectId,
        address indexed recipient,
        uint256 amount
    );

    constructor() Ownable(msg.sender) {
        feeRecipient = msg.sender;
    }

    modifier validProject(uint256 _projectId) {
        require(_projectId > 0 && _projectId <= projectCounter, "Invalid project ID");
        _;
    }

    modifier onlyProjectOwner(uint256 _projectId) {
        require(projects[_projectId].projectOwner == msg.sender, "Not project owner");
        _;
    }

    function createProject(
        string memory _name,
        string memory _description,
        uint256 _softCap,
        uint256 _hardCap,
        uint256 _startTime,
        uint256 _endTime,
        uint256 _minContribution,
        uint256 _maxContribution,
        address _tokenAddress
    ) external returns (uint256) {
        require(bytes(_name).length > 0, "Name cannot be empty");
        require(_softCap > 0, "Soft cap must be greater than 0");
        require(_hardCap >= _softCap, "Hard cap must be >= soft cap");
        require(_startTime > block.timestamp, "Start time must be in future");
        require(_endTime > _startTime, "End time must be after start time");
        require(_minContribution > 0, "Min contribution must be > 0");
        require(_maxContribution >= _minContribution, "Max contribution must be >= min contribution");

        projectCounter++;
        Project storage newProject = projects[projectCounter];
        
        newProject.id = projectCounter;
        newProject.projectOwner = msg.sender;
        newProject.name = _name;
        newProject.description = _description;
        newProject.softCap = _softCap;
        newProject.hardCap = _hardCap;
        newProject.startTime = _startTime;
        newProject.endTime = _endTime;
        newProject.minContribution = _minContribution;
        newProject.maxContribution = _maxContribution;
        newProject.tokenAddress = _tokenAddress;
        newProject.isActive = true;
        newProject.isFinalized = false;

        emit ProjectCreated(
            projectCounter,
            msg.sender,
            _name,
            _softCap,
            _hardCap,
            _startTime,
            _endTime
        );

        return projectCounter;
    }

    function contribute(uint256 _projectId) 
        external 
        payable 
        nonReentrant 
        validProject(_projectId) 
    {
        Project storage project = projects[_projectId];
        
        require(project.isActive, "Project not active");
        require(block.timestamp >= project.startTime, "Project not started");
        require(block.timestamp <= project.endTime, "Project ended");
        require(msg.value >= project.minContribution, "Below minimum contribution");
        require(msg.value <= project.maxContribution, "Above maximum contribution");
        require(project.totalRaised + msg.value <= project.hardCap, "Exceeds hard cap");

        uint256 currentContribution = project.contributions[msg.sender];
        require(currentContribution + msg.value <= project.maxContribution, "Total contribution exceeds max");

        if (!project.hasContributed[msg.sender]) {
            project.contributors.push(msg.sender);
            project.hasContributed[msg.sender] = true;
        }

        project.contributions[msg.sender] += msg.value;
        project.totalRaised += msg.value;

        emit ContributionMade(_projectId, msg.sender, msg.value);
    }

    function finalizeProject(uint256 _projectId) 
        external 
        validProject(_projectId) 
        onlyProjectOwner(_projectId) 
    {
        Project storage project = projects[_projectId];
        require(project.isActive, "Project not active");
        require(block.timestamp > project.endTime || project.totalRaised >= project.hardCap, "Cannot finalize yet");
        require(!project.isFinalized, "Already finalized");

        project.isFinalized = true;
        project.isActive = false;

        bool successful = project.totalRaised >= project.softCap;

        emit ProjectFinalized(_projectId, successful, project.totalRaised);
    }

    function withdrawFunds(uint256 _projectId) 
        external 
        nonReentrant 
        validProject(_projectId) 
        onlyProjectOwner(_projectId) 
    {
        Project storage project = projects[_projectId];
        require(project.isFinalized, "Project not finalized");
        require(project.totalRaised >= project.softCap, "Soft cap not reached");
        require(project.totalRaised > 0, "No funds to withdraw");

        uint256 platformFee = (project.totalRaised * platformFeePercentage) / FEE_DENOMINATOR;
        uint256 projectAmount = project.totalRaised - platformFee;

        project.totalRaised = 0;

        (bool success1, ) = payable(feeRecipient).call{value: platformFee}("");
        require(success1, "Platform fee transfer failed");

        (bool success2, ) = payable(msg.sender).call{value: projectAmount}("");
        require(success2, "Project fund transfer failed");

        emit FundsWithdrawn(_projectId, msg.sender, projectAmount);
    }

    function refund(uint256 _projectId) 
        external 
        nonReentrant 
        validProject(_projectId) 
    {
        Project storage project = projects[_projectId];
        require(project.isFinalized, "Project not finalized");
        require(project.totalRaised < project.softCap, "Soft cap was reached");
        
        uint256 contribution = project.contributions[msg.sender];
        require(contribution > 0, "No contribution found");

        project.contributions[msg.sender] = 0;

        (bool success, ) = payable(msg.sender).call{value: contribution}("");
        require(success, "Refund failed");
    }

    function getProjectInfo(uint256 _projectId) 
        external 
        view 
        validProject(_projectId) 
        returns (PublicProjectInfo memory) 
    {
        Project storage project = projects[_projectId];
        
        return PublicProjectInfo({
            id: project.id,
            projectOwner: project.projectOwner,
            name: project.name,
            description: project.description,
            softCap: project.softCap,
            hardCap: project.hardCap,
            totalRaised: project.totalRaised,
            startTime: project.startTime,
            endTime: project.endTime,
            minContribution: project.minContribution,
            maxContribution: project.maxContribution,
            tokenAddress: project.tokenAddress,
            isActive: project.isActive,
            isFinalized: project.isFinalized,
            contributorCount: project.contributors.length
        });
    }

    function getContribution(uint256 _projectId, address _contributor) 
        external 
        view 
        validProject(_projectId) 
        returns (uint256) 
    {
        return projects[_projectId].contributions[_contributor];
    }

    function getContributors(uint256 _projectId) 
        external 
        view 
        validProject(_projectId) 
        returns (address[] memory) 
    {
        return projects[_projectId].contributors;
    }

    function setPlatformFee(uint256 _newFeePercentage) external onlyOwner {
        require(_newFeePercentage <= 1000, "Fee cannot exceed 10%");
        platformFeePercentage = _newFeePercentage;
    }

    function setFeeRecipient(address _newRecipient) external onlyOwner {
        require(_newRecipient != address(0), "Invalid recipient");
        feeRecipient = _newRecipient;
    }

    function emergencyWithdraw() external onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No funds to withdraw");
        
        (bool success, ) = payable(owner()).call{value: balance}("");
        require(success, "Emergency withdrawal failed");
    }

    receive() external payable {
        revert("Direct payments not accepted");
    }
}