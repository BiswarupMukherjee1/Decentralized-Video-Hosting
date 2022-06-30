pragma solidity ^0.5.0;
//Smart contract for the application

// 1. Model the video
// 2. Store the Video
// 3. Upload the Video
// 4. List the Videos
contract DVideo {
  //public: is used to access variable outside smart contract
  uint public videoCount = 0;// Variable to store number of videos that are ever being created
  string public name = "DVideo";
  // 2. Store the Video and 4. List the Videos
  //Create id=>struct mapping
  mapping(uint => Video) public videos; //key=> value
// Here videos can be treated as a function
//Now we can list the videos using ID

  // 1. Model the video
  //Create Struct
  struct Video {
    uint id; //unique identifier for video in smart contract
    string hash;//location of IPFS hash
    string title;//youtube video title
    address author;//address of author. Wallet ethereum blockchain address. Username on blockchain.
  }

  //Create Event that allows us to know when videos are uploaded.
  event VideoUploaded(
    uint id,
    string hash,
    string title,
    address author
  );


  constructor() public {
  }
  //3. Upload the Video
  function uploadVideo(string memory _videoHash, string memory _title) public {
    // Make sure the video hash exists
    require(bytes(_videoHash).length > 0);//check certain parameters before rest of function executes. Function cant be called by empty hash

    // Make sure video title exists
    require(bytes(_title).length > 0);

    // Make sure uploader address exists
    require(msg.sender!=address(0));

    // Increment video id
    videoCount++;


    // Add video to the contract
    videos[videoCount] = Video(videoCount, _videoHash, _title, msg.sender);//msg.sender=address of person calling the function
    //msg=global variable, sender=attribute

    // Trigger an event
    emit VideoUploaded(videoCount, _videoHash, _title, msg.sender);
  }
}
