# installRaspberry
Installation Cashless sur Raspberry
## Prérequis 
Sur le Pi : 
  PI OS Lite LEGACY
  Utilisateur = sysop
  Connection reseau Wifi ou RJ45
  SSH activé
Sur un Linux ou Mac ( pas de Windows )
  Ansible installé
  copier la clé SSH de ce poste sur le Pi :
    cd /home/userHote/.ssh ( userHote du poste Ansible )
    ssh-copy-id -i id_rsa.pub sysop@X.X.X.X ( X.X.X.X = IP du Pi)

## Clonner le projet ( sur poste Ansible)
Dans le fichier *.yml correspondant à votre config modifier :
  La premiere ligne par le nom host de votr Pi : 
    ex : hosts: Pi7P

modifier le fichier confansible.ini :

  pi7P ansible_user=sysop hostname=pi7P token=xxxxxxxxxxxx password=xxxxxxxxxxxx frontType=FPI serveur=ADRESSE DU SERVEUR protocole=http (si serveur cashless en local) https(si serveur cashless distant) nfc=acr122u-u9 ( si lecteur NFC USB , si Lecteur sur GPIO rien) rotate=3 (rotation de l'ecran : 0 Normal ,1 90°,2 180°,3 270 °)

  cela doit ressembler à ça :
  
  Pi10P ansible_user=sysop hostname=pi10P token=L€T0Ken password=ToChoseButNotTOTO;) frontType=FPI serveur=demo.cashless.tibillet.re protocole=https nfc=acr122u-u9 rotate=3

Sur le poste ansible à la racine du projet :

Pour un 7PoucesHdmi :

ansible-playbook -i confansible.ini 7PoucesHdmi.yml -K 

Pour un 10PoucesHdmi :

ansible-playbook -i confansible.ini 10PoucesHdmi.yml -K  



