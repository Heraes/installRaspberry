// Importation du module mfrc522-rpi
import * as pkgMfrc522 from "@efesoroglu/mfrc522-rpi"
import * as pkgRpiSoftspi from "rpi-softspi"

const Mfrc522 = pkgMfrc522.default 
const SoftSPI = pkgRpiSoftspi.default

const softSPI = new SoftSPI({
    clock: 23, // pin number of SCLK
    mosi: 19, // pin number of MOSI
    miso: 21, // pin number of MISO
    client: 24 // pin number of CS
  });

// Configuration du lecteur MFRC522
const mfrc522Reader = new Mfrc522(softSPI).setResetPin(22)

console.log('---> Console NFC Card Reader test')
// Boucle de scan
setInterval(() => {
  // Réinitialisation du lecteur
  mfrc522Reader.reset();

  // Recherche de cartes NFC
  let response = mfrc522Reader.findCard();
  if (!response.status) {
    console.log("No card detected");
    return;
  }

  // Lecture de l'UID de la carte
  response = mfrc522Reader.getUid();
  if (!response.status) {
    console.log("Unable to read card UID");
    return;
  }

  // Affichage de l'UID de la carte
  const uid = response.data;
  console.log(`Card detected, UID: ${uid[0].toString(16)}:${uid[1].toString(16)}:${uid[2].toString(16)}:${uid[3].toString(16)}`);

  // Arrêt de la cryptographie
  mfrc522Reader.stopCrypto();
}, 500);
