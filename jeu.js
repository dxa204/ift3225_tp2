//get parametres dans URL
function getParametres() {
  //default params
  const defaultParams = {
    lang: "en",
    tempsAlloue: 60,
    hint: 10,
  };

  //get params
  const parts = window.location.hash.split("/");

  //verification
  if (parts[1] !== "jeu" || parts[2] !== "word") {
    return defaultParams;
  }

  //si present dans url, sinon default
  const lang = parts[3] || defaultParams.lang;
  const tempsAlloue = parts[4] || defaultParams.tempsAlloue;
  const hint = parts[5] || defaultParams.hint;

  return { lang, tempsAlloue, hint };
}

//variables globales
const params = getParametres();
let mot = "";
let score = 0;
let scoreJoueur = 0;
let affichageMot = [];
let lang = params.lang;
let tempsAlloue = params.tempsAlloue;
let hint = params.hint;
let termine = false;
let interval = null;

let progressBar = document.getElementById("points");

//get joueur that is logged
fetch("gamers.php/session")
  .then((response) => response.json())
  .then((data) => {
    login = data.login;
    pwd = data.pwd;
    document.getElementById("affichageNomJoueur").textContent = login;
  });

//get score du joueur courant
fetch("gamers.php/gamers")
  .then((response) => response.json())
  .then((data) => {
    scoreJoueur = data.score;
    document.getElementById("scoreJoueur").textContent = scoreJoueur;
  });

//récupère un mot aléatoirement
fetch("definition.php/word")
  .then((response) => response.json())
  .then((data) => {
    entreeChoisie = data[Math.floor(Math.random() * data.length)];
    mot = entreeChoisie.word.toUpperCase();
    score = mot.length * 10;
    progressBar.setAttribute("max", score);
    affichageMot = Array(mot.length).fill("__");
    ajusterAffichage();
    lancerMinuterie();
  })
  .catch(
    (error) =>
      (document.getElementById("definition").textContent =
        error + ": probleme de chargment de la définition")
  );

function ajusterAffichage() {
  //enlever section mots présente
  document.getElementById("affichageMot").textContent = "";

  //barre de progres
  progressBar.setAttribute("value", score);

  //mot
  let sectionMot = document.getElementById("affichageMot");
  affichageMot.forEach((element, index) => {
    const span = document.createElement("span");
    span.textContent = element;
    span.classList.add("entreeLettre");

    if (element === "__") {
      span.classList.add("clickable");
      span.onclick = () => gestionEntreeLettre(index);
    }

    sectionMot.appendChild(span);
    sectionMot.append(" ");
  });

  //score
  document.getElementById("affichageScore").textContent = score;

  //temps
  document.getElementById("tempsRestant").textContent = tempsAlloue;
}

//gestion du temps
function lancerMinuterie() {
  interval = setInterval(() => {
    tempsAlloue--;
    document.getElementById("tempsRestant").textContent = `${tempsAlloue}s`;

    if (tempsAlloue <= 0) {
      terminerPartie(false);
    }
  }, 1000);
}

function gestionEntreeLettre(index) {
  const lettreEntree = document
    .getElementById("entreeLettre")
    .value.toUpperCase();

  //si cest pas une letttre on fait rien
  let regex = /^[a-zA-Z]$/;
  if (!lettreEntree.match(regex)) return;

  if (mot[index] === lettreEntree) {
    affichageMot[index] = lettreEntree;
    score += 5;
  } else score -= 5;

  //remettre input value null (pour que joueur entre qqch autre)
  document.getElementById("entreeLettre").value = "";

  //afficher nouveau score/mot
  ajusterAffichage();

  //fin de la partie si mot termine
  if (affichageMot.join("") === mot) {
    finirLaPartie(true);
  }
}

function finirLaPartie(gagne) {
  termine = true;
  interval = null;
  if (gagne) {
    alert("Gagné. Bravo");
  } else alert("Perdu.");
}
