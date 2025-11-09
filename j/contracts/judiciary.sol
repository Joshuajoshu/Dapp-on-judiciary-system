// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract CourtRecords {
    struct Document {
        uint256 caseId;
        string hash;       // Document Hash (SHA-256/Keccak-256)
        uint256 timestamp; // Upload Time
        address uploader;  // Uploader Address
    }

    mapping(uint256 => Document) public documents;   // Store documents by Case ID
    mapping(address => bool) public authorizedUsers; // Track authorized users (judges, lawyers, etc.)

    uint256[] public caseIds; // ✅ Store case IDs in an array
    address public courtAdmin;  // Court Administrator (Owner)

    event DocumentStored(uint256 caseId, string docHash, address indexed uploader);
    event UserAuthorized(address indexed user);

    modifier onlyAuthorized() {
        require(authorizedUsers[msg.sender], "Access denied: Not authorized");
        _;
    }

    modifier onlyAdmin() {
        require(msg.sender == courtAdmin, "Access denied: Only court admin");
        _;
    }

    constructor() {
        courtAdmin = 0x2dba4F6548111Af11493Ca4D3bD604Dc8958CB37;  // Contract deployer is the admin
    }

    // ✅ Grant access to users (judges, lawyers, etc.)
    function addAuthorizedUser(address _user) public onlyAdmin {
        require(!authorizedUsers[_user], "User already authorized");
        authorizedUsers[_user] = true;
        emit UserAuthorized(_user);
    }

    // ✅ Store a document hash for a case (Only authorized users)
    function storeDocument(uint256 _caseId, string memory _docHash) public onlyAuthorized {
        require(bytes(documents[_caseId].hash).length == 0, "Document already exists");

        documents[_caseId] = Document({
            caseId: _caseId,
            hash: _docHash,
            timestamp: block.timestamp,
            uploader: msg.sender
        });

        caseIds.push(_caseId); // ✅ Store case ID
        emit DocumentStored(_caseId, _docHash, msg.sender);
    }

    // ✅ Fetch all stored documents (Only for admin)
    function getAllDocuments() public view onlyAdmin returns (Document[] memory) {
        uint256 totalCases = caseIds.length;
        Document[] memory docList = new Document[](totalCases);

        for (uint256 i = 0; i < totalCases; i++) {
            docList[i] = documents[caseIds[i]];
        }

        return docList;
    }

    // ✅ Verify if a document exists and matches the provided hash
    function verifyDocument(uint256 _caseId, string memory _docHash) public view returns (bool) {
        return (keccak256(abi.encodePacked(documents[_caseId].hash)) == keccak256(abi.encodePacked(_docHash)));
    }

    // ✅ Retrieve a single document (Only authorized users)
    function getDocument(uint256 _caseId) public view onlyAuthorized returns (Document memory) {
        require(bytes(documents[_caseId].hash).length > 0, "Document not found");
        return documents[_caseId];
    }
}
