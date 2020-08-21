pragma solidity >= 0.5.0;


contract Proof {
    struct FileDetails {
        uint timestamp;
        string owner;
        string filename;
    }

    mapping (string => FileDetails) files;

    event LogFileAddedStatus(bool status, uint timestamp, string owner, string filename, string fileHash);

    //this is used to store the owner of file at the block timestamp
    function set(string memory owner, string memory filename, string memory fileHash) public {
        //There is no proper way to check if a key already exists or not therefore we are checking for default value i.e., all bits are 0
        if(files[fileHash].timestamp == 0) {
            files[fileHash] = FileDetails(block.timestamp, owner, filename);

            //we are triggering an event so that the frontend of our app knows that the file's existence and ownership details have been stored
            emit LogFileAddedStatus(true, block.timestamp, owner, filename, fileHash);
        } else {
            //this tells to the frontend that file's existence and ownership details couldn't be stored because the file's details had already been stored earlier
            emit LogFileAddedStatus(false, block.timestamp, owner, filename, fileHash);
        }
    }

    //this is used to get file information
    function get(string memory fileHash) public view returns (uint, string memory ) {
        return (files[fileHash].timestamp, files[fileHash].owner, fies[fileHash].filename);
    }
}