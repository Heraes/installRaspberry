// initialisation
window.store = {}
const TOKEN = '$a;b2yuM5454@4!cd'
let socket = io('http://localhost:3000',{ query: { token: TOKEN} })
let etatServeur = 0

import * as ClavierVirtuel from "./clavier_virtuel.js"
window.clavierVirtuel = ClavierVirtuel

function popup(data) {
  let fondPopup = 'fond-header'
  if (data.typeMessage === 'alerte') {
    fondPopup = 'fond-alerte'
  }
  if (data.typeMessage === 'succes') {
    fondPopup = 'fond-ok'
  }
  let frag = `
    <div id="popup" class="${ fondPopup } l100p">
      <div id="popup-contenu" class="BF-col-haut" >
        ${ data.contenu }
      </div>
      <div id="popup-footer" class="BF-ligne fond-retour" onclick="let elePopup = document.querySelector('#popup');elePopup.parentNode.removeChild(elePopup)">RETOUR</div>
    </div>
  `
  let elePopup = document.querySelector('#popup')
  if (elePopup !== null) {
    elePopup.parentNode.removeChild(elePopup)
    document.body.insertAdjacentHTML('afterbegin', frag)
  } else {
    document.body.insertAdjacentHTML('afterbegin', frag)
  }
}


// messages divers
socket.on('afficherMsg', (retour) => {
  // exemple, retour = { contenu: retour, typeMessage: 'succes' }
  popup(retour)
})


// Réception tagId
socket.on('afficherMsgErreur', (retour) => {
  let data = {
    contenu: retour,
    typeMessage: 'alerte'
  }
  popup(data)
})

// Retour infos wifi
socket.on('retourInfosWifi', (fragmentHtml) => {
  // console.log('-> retourInfosWifi !!!')
  document.querySelector('#rep-info-reseau').insertAdjacentHTML('afterend', fragmentHtml)

  document.querySelector('#bt-modifier-wifi').addEventListener('click', function () {
    let contenuClass = document.querySelector('#modifier-wifi').classList.value
    if (contenuClass.indexOf('eff') !== -1 ) {
      cacherContenuFormSauf('modifier-wifi')
    } else {
      document.querySelector('#modifier-wifi').classList.add('eff')
    }
  })

  document.querySelector('#bt-valider-modifier-wifi').addEventListener('click', function () {
    let essid = document.querySelector('#essid').value
    let passePhrase = document.querySelector('#pp').value
    // console.log('essid = ',essid, '  --  passePhrase = ', passePhrase)
    socket.emit('validerModifierWifi', {essid: essid, passePhrase: passePhrase})
    effacerClavierVirtuel()
  })
})

socket.on('etatUrlServeur', (retourTestUrl) => {
  // header 307 = redirection temporaire
  // header 308 = redirection permanente
  if(retourTestUrl === '200' || retourTestUrl === '307' || retourTestUrl === '308') {
    document.querySelector('#info-serveur').style.color = "#00FF00"
    // bt lancer l'application
    etatServeur = 1
    document.querySelector('#bt-lancer-application').classList.remove('fond-pasbon')
    document.querySelector('#bt-lancer-application').classList.add('fond-ok')
  } else {
    document.querySelector('#info-serveur').style.color = "#FF0000"
    // bt lancer l'application
    etatServeur = 0
    document.querySelector('#bt-lancer-application').classList.remove('fond-ok')
    document.querySelector('#bt-lancer-application').classList.add('fond-pasbon')
  }
})

socket.on('infosTagId', (retour) => {
  document.querySelector('#nfc').innerHTML = retour
})

// message modification wifi
socket.on('modificationWifi', (retour) => {
  console.log('wifi: ',retour)
  let data = {}
  if (retour.erreur === 0) {
    document.querySelector('#etat-modifier-wifi').classList.remove('mod-wifi-erreur')
    document.querySelector('#etat-modifier-wifi').classList.add('mod-wifi-ok')
    data = { contenu: retour.msg, typeMessage: 'succes' }
  } else {
    document.querySelector('#etat-modifier-wifi').classList.remove('mod-wifi-ok')
    document.querySelector('#etat-modifier-wifi').classList.add('mod-wifi-erreur')
    document.querySelector('#modifier-wifi').classList.toggle('eff')
    data = { contenu: retour.msg, typeMessage: 'alerte' }
  }
  popup(data)
  cacherContenuFormTous()
})

// modification serveur
socket.on('modificationServeur', (retour) => {
  console.log('serveur: ',retour)
  let data = {}
  if (retour.erreur === 0) {
    document.querySelector('#etat-modifier-serveur').classList.remove('mod-serveur-erreur')
    document.querySelector('#etat-modifier-serveur').classList.add('mod-serveur-ok')
    data = {
    contenu: `
      <div class="l100p h100p BF-col">
        <h1>Modification du serveur effectuée :</h1>
        <h2>serveur = ${ retour.serveurDomaine} .</h2>
        <h2 class="coul-alerte">Vous devez redémmarer l'appareil</h2>
        <h2 class="coul-alerte">pour prendre en compte le nouveau serveur .</h2>
      </div>
    `,
      typeMessage: 'succes'
    }
    document.querySelector('#info-serveur').innerHTML = `Serveur: ${ retour.serveurDomaine }`
  } else {
    document.querySelector('#etat-modifier-serveur').classList.remove('mod-serveur-ok')
    document.querySelector('#etat-modifier-serveur').classList.add('mod-serveur-erreur')
    document.querySelector('#modifier-serveur').classList.toggle('eff')
    data = {
    contenu: `
      <h1>Erreur modification serveur !</h1>
    `,
      typeMessage: 'alerte'
    }
  }
  popup(data)
  cacherContenuFormTous()
})

function cacherContenuFormSauf(id) {
  // console.log('-> fonction cacherContenuFormSauf, id = ', id)
  let eles = document.querySelectorAll('.contenu-form')
  for (let i = 0; i < eles.length; i++) {
    let ele = eles[i]
    let idEle = ele.id
    // console.log('idEle = ', idEle)
    ele.classList.add('eff')
    if (id === idEle) {
      ele.classList.remove('eff')
    }
  }
}

function cacherContenuFormTous() {
  cacherContenuFormSauf('nimportequoi')
}

function effacerClavierVirtuel() {
  let clavier = document.querySelector('#clavier-virtuel-conteneur')
  if (clavier !== null) {
    clavier.parentNode.removeChild(clavier)
  }
}

window.addEventListener('load',function() {
  let resolution = 'Résolution: ' + document.body.clientWidth + 'x' + document.body.clientHeight
  document.querySelector('#info-resolution-ecran').innerHTML = resolution
  let urlATester = document.querySelector('#info-serveur').getAttribute('data-serveur')
  if (urlATester !== '' && urlATester !== undefined) {
    socket.emit('testerUrlServeur', urlATester)
  }
  let emplacementInfosReseau = document.querySelector('#rep-info-reseau')
  socket.emit('donnerInfosWifi', '')

})


if (document.querySelector('#bt-modifier-serveur')) {
  document.querySelector('#bt-modifier-serveur').addEventListener('click', function () {
    let contenuClass = document.querySelector('#modifier-serveur').classList.value
    if (contenuClass.indexOf('eff') !== -1 ) {
      cacherContenuFormSauf('modifier-serveur')
      effacerClavierVirtuel()
    } else {
      document.querySelector('#modifier-serveur').classList.add('eff')
    }

  })
}




if (document.querySelector('#bt-valider-modifier-serveur')) {
  document.querySelector('#bt-valider-modifier-serveur').addEventListener('click', function () {
    let serveurDomaine = document.querySelector('#serveur').value
    let user = document.querySelector('#nom-appareil').value
    let typeFront = document.querySelector('#type-front').value
    let genererMotDePasse = document.querySelector('#passe').checked
    // console.log('genererMotDePasse = ', genererMotDePasse)
    socket.emit('validerModifierServeur', {serveurDomaine: serveurDomaine, user: user, typeFront: typeFront, genererMotDePasse: genererMotDePasse})
    effacerClavierVirtuel()
  })
}

if (document.querySelector('#bt-tester-serveur')) {
  document.querySelector('#bt-tester-serveur').addEventListener('click', function () {
    let urlATester = document.querySelector('#info-serveur').getAttribute('data-serveur')
    if (urlATester !== '' && urlATester !== undefined) {
      socket.emit('testerUrlServeur', urlATester)
    }
    effacerClavierVirtuel()
  })
}

document.querySelector('#bt-lancer-application').addEventListener('click',function() {
  if (etatServeur === 1) {
    // let urlRedirection = document.querySelector('#info-serveur').getAttribute('data-url-serveur')
    // console.log(`${ new Date() } -> lancer l'application à l'url: ${ urlRedirection }`)
    // console.log('agent = ', JSON.stringify(navigator.userAgent, null, '\t'))
    //window.location = urlRedirection
    socket.emit('lancerApplication')
  }
  effacerClavierVirtuel()
})
