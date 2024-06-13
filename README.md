# NFC server for Laboutik terminal
## Description
This is a fork of samijuju/installRaspberry and it is part of the TiBillet project : https://tibillet.org

This repository contains :
- some fixes on labels used 
- ip module has been removed from package.json (due to severe vulnerability detected : https://github.com/indutny/node-ip/issues/150) and serveur_nfc.js methods using this module has been temporarly replaced by an api call to obtain ip.
- a new cardReaderTest.js to check in console mode if your NFC card reader works

## NFC reader wiring
For that, I suggest you to follow the DIY tutorial at https://tibillet.org/docs/category/diy