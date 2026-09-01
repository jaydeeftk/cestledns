const excuses = [
  "C'est le DNS.",
  "Quelqu'un a débranché le switch pour brancher la bouilloire.",
  "Le certificat a expiré cette nuit à 4h12.",
  "Le câble est croisé, mais du mauvais côté.",
  "Boucle de commutation, spanning-tree fait ce qu'il peut.",
  "Le pare-feu bloque, personne ne sait quelle règle.",
  "Le bail DHCP est parti en vacances.",
  "Ça marche sur ma machine virtuelle.",
  "Quelqu'un a poussé en production un vendredi à 17h55.",
  "MTU trop grand, les paquets se cognent dans le tunnel.",
  "Le ping vers 8.8.8.8 passe, donc ce n'est pas moi.",
  "Le groupe de sécurité autorise tout sauf ce dont on a besoin.",
  "Le NAT a mangé le port.",
  "Il y a deux serveurs DHCP sur le VLAN.",
  "Le mot de passe wifi a changé sans prévenir.",
  "C'est encore le DNS."
];

const zoneExcuse = document.getElementById('excuse');
const btnExcuse = document.getElementById('btn-excuse');
const noteExcuse = document.getElementById('excuse-note');
let derniere = -1;

noteExcuse.textContent = excuses.length + ' excuses en stock';

btnExcuse.addEventListener('click', function () {
  let i = derniere;
  while (i === derniere) {
    i = Math.floor(Math.random() * excuses.length);
  }
  derniere = i;
  zoneExcuse.textContent = excuses[i];
});

const bloc = document.querySelector('.compteur');
const affichageJours = document.getElementById('jours');
const btnReset = document.getElementById('btn-reset');

function majJours() {
  const depuis = new Date(bloc.dataset.depuis);
  const diff = Date.now() - depuis.getTime();
  const jours = Math.max(0, Math.floor(diff / 86400000));
  affichageJours.textContent = jours;
}

btnReset.addEventListener('click', function () {
  bloc.dataset.depuis = new Date().toISOString().slice(0, 10);
  majJours();
  zoneExcuse.textContent = "C'est le DNS. Compteur remis à zéro.";
});

majJours();

const questions = [
  {
    texte: "Sur quel port écoute SSH par défaut ?",
    choix: ["21", "22", "23"],
    bon: 1,
    mot: "Le 23 c'est Telnet, et Telnet ne chiffre rien."
  },
  {
    texte: "HTTPS, c'est quel port ?",
    choix: ["80", "443", "8080"],
    bon: 1,
    mot: "Le 80 est en clair, le 8080 c'est souvent le serveur de test de quelqu'un."
  },
  {
    texte: "Quel protocole distribue les adresses IP sur le réseau ?",
    choix: ["DNS", "DHCP", "ARP"],
    bon: 1,
    mot: "ARP traduit les IP en adresses MAC, ce n'est pas le même métier."
  },
  {
    texte: "À quelle couche du modèle OSI travaille un commutateur classique ?",
    choix: ["Couche 2", "Couche 3", "Couche 7"],
    bon: 0,
    mot: "Il regarde les adresses MAC. Un routeur, lui, monte en couche 3."
  },
  {
    texte: "Combien d'adresses utilisables dans un /29 ?",
    choix: ["4", "6", "8"],
    bon: 1,
    mot: "8 adresses au total, moins le réseau et le broadcast."
  }
];

const compteurQuiz = document.getElementById('quiz-compteur');
const questionQuiz = document.getElementById('quiz-question');
const choixQuiz = document.getElementById('quiz-choix');
const verdictQuiz = document.getElementById('quiz-verdict');
const suivantQuiz = document.getElementById('quiz-suivant');

let index = 0;
let score = 0;
let fini = false;

function afficherQuestion() {
  fini = false;
  const q = questions[index];
  compteurQuiz.textContent = 'Question ' + (index + 1) + ' sur ' + questions.length;
  questionQuiz.textContent = q.texte;
  verdictQuiz.textContent = '';
  suivantQuiz.hidden = true;
  choixQuiz.innerHTML = '';

  q.choix.forEach(function (texte, i) {
    const bouton = document.createElement('button');
    bouton.className = 'choix';
    bouton.textContent = texte;
    bouton.addEventListener('click', function () {
      repondre(i, bouton);
    });
    choixQuiz.appendChild(bouton);
  });
}

function repondre(i, bouton) {
  const q = questions[index];
  const boutons = choixQuiz.querySelectorAll('.choix');

  boutons.forEach(function (b, n) {
    b.disabled = true;
    if (n === q.bon) b.classList.add('bon');
  });

  if (i === q.bon) {
    score++;
    verdictQuiz.textContent = 'Bien vu. ' + q.mot;
  } else {
    bouton.classList.add('faux');
    verdictQuiz.textContent = 'Raté. ' + q.mot;
  }

  suivantQuiz.hidden = false;
  suivantQuiz.textContent = index === questions.length - 1 ? 'Voir le score' : 'Question suivante';
}

suivantQuiz.addEventListener('click', function () {
  if (fini) {
    index = 0;
    score = 0;
    fini = false;
    afficherQuestion();
    return;
  }
  index++;
  if (index < questions.length) {
    afficherQuestion();
    return;
  }
  terminer();
});

function terminer() {
  fini = true;
  compteurQuiz.textContent = 'Terminé';
  questionQuiz.textContent = score + ' bonnes réponses sur ' + questions.length;
  choixQuiz.innerHTML = '';

  const mots = [
    "Rebranche le câble et recommence.",
    "Ça sent la séance de rattrapage.",
    "Correct, sans plus.",
    "Solide.",
    "Presque parfait.",
    "Tu peux animer le prochain TP."
  ];
  verdictQuiz.textContent = mots[score];

  suivantQuiz.hidden = false;
  suivantQuiz.textContent = 'Recommencer';
}

afficherQuestion();
