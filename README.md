
# Blockchain Based Video Hosting

This is a decentralized video hosting and sharing website similar to youtube.

In Youtube, it is easy to censor videos. This platform, BVideo is created to address this issue.

If someone uploads a video, it cannot be taked down or deleted because the video gets stored in blockchain.

So, you can upload videos, watch and share it in browser without any worry!



## Features

- Censorship Free
- Upload Videos
- Stream videos
- Toggle between videos from the side panel
- Watch and share videos in browser



## Deployment

To run this project locally,

Step 1. Clone the project

```bash
  git clone <SSH url>
```
Step 2. Install dependencies
```bash
  npm install
```
Step 3. Compile the smart contracts, test them and deploy in blockchain.
```bash
  truffle migrate
  truffle test
```
Step 4. Run the React application
```bash
  npm run start
```


## Appendix

Please make sure you have Metamask account when running this application from your browser.
Install the Chrome extension and create an account. 
You can install Ganache to get free accounts and connect it to Metamask.

