// si problême de droit
// sudo chown root:gpio /dev/gpiomem
// sudo chmod g+rw /dev/gpiomem
// sudo usermod -a -G gpio $USER
// sudo usermod -a -G spi $USER
// sudo usermod -a -G netdev $USER

"use strict"
// const event = require('events')
const EventEmitter = require('node:events')
const Mfrc522 = require("mfrc522-rpi")
const SoftSPI = require("rpi-softspi")

const vma405Emitter = new EventEmitter()
vma405Emitter.emit('msgVma405', 'scanning...')

const softSPI = new SoftSPI({
  clock: 23, // pin number of SCLK
  mosi: 19, // pin number of MOSI
  miso: 21, // pin number of MISO
  client: 24 // pin number of CS
});

// GPIO 24 can be used for buzzer bin (PIN 18), Reset pin is (PIN 22).
// const mfrc522 = new Mfrc522(softSPI).setResetPin(22).setBuzzerPin(18);
const mfrc522 = new Mfrc522(softSPI).setResetPin(22)

setInterval(function() {
  //# reset card
  mfrc522.reset();

  // Scan for cards
  let response = mfrc522.findCard();
  if (!response.status) {
    // console.log("No Card");
    return;
  }

  // Get the UID of the card
  response = mfrc522.getUid();
  if (!response.status) {
    vma405Emitter.emit('msgVma405', 'UID Scan Erro')
    return;
  }

  // If we have the UID, continue
  const uid = response.data;
  let resultat = ''
  for(let i=0; i < 4; i++){
    let lettre = uid[i].toString(16).toUpperCase()
    if(uid[i].toString(16).length === 1) {
      resultat += '0' + lettre
    } else {
      resultat += lettre
    }
  }
  // resultat
  vma405Emitter.emit('tagId',resultat)

  // Stop
  mfrc522.stopCrypto();
}, 500);

module.exports = vma405Emitter
