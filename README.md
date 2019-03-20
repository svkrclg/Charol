Installation guide:
Recommended: OS ubuntu 18.04
1. Install the metamask wallet chrome extension. It can be installed from here https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn?hl=en
2. Make a account in metamask.
3. Install Ganache for Ethereum server, it can be downloaded from here

Ubuntu: https://github.com/trufflesuite/ganache/releases/download/v1.3.0/ganache-1.3.0-x86_64.AppImage
https://github.com/trufflesuite/ganache/releases/download/v1.3.1/ganache-setup-1.3.1.exe

4. Run the Ganache and keep it running till all below steps are not completed.
5. In Ganache, click on 1st key icon of account, then copy the private key.
6. Now click on metamask extension, click top right image then click on import account and then pate there private key which you have copied from step 5.
7. In metamask extension click on main ethereum network then click on Custom RPC, after that paste “http://127.0.0.1:7545” without quote in New RPC URL placeholder then save.

8. Install truffle, for this you should have node installed in your PC
    If node.js is not installed then install it from  https://nodejs.org/en/download/
    Then run following command in terminal.
npm install -g truffle
9. Extract the file hired_in_bosch.rar.
10. Open powershell(recommended for window user) or terminal(for ubuntu) and change directory to property(in extracted folder).
i.e.,  /hired_in_bosch/property:  
11. Again in powershell or terminal run the following commands in charol directory.
	/hired_in_bosch/property: npm install
 	/hired_in_bosch/property: truffle migrate --reset
/hired_in_bosch/property: npm run dev
12. Then localhost will popup in your chrome 
13. This is our landing page.
14. Now refer to demo video


For any issues: 
Drop an mail to-
177sharmass@gmail.com
