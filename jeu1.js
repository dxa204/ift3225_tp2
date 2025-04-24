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
let params;
let mot = "";
let score = 0;
let scoreJoueur = 0;
let affichageMot = [];
let lang = params.lang;
let tempsAlloue = params.tempsAlloue;
let hint = params.hint;
let termine = false;
let interval = null;
let hintInterval = null;

let progressBar = document.getElementById("points");

function loadJeu1() {
  params = getParametres();
  document.getElementById("body").style.display = inline;

  //get joueur that is logged
  fetch("gamers.php/session")
    .then((response) => response.json())
    .then((data) => {
      login = data.login;
      document.getElementById("affichageNomJoueur").textContent = login;
    });

  //get score du joueur courant
  fetch("gamers.php/gamers/" + login)
    .then((response) => response.json())
    .then((data) => {
      scoreJoueur = data.score;
      document.getElementById("scoreJoueur").textContent = scoreJoueur;
    });

  //récupère un mot aléatoirement
  fetch("definitions.php/word/lang" + lang)
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
}

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

    if ((tempsAlloue = tempsAlloue - hint)) {
      afficherIndice();
      lancerHintPeriodiques();
    }

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

  score = score + scoreJoueur;
  updateScore();
}

function updateScore() {
  fetch("gamers.php/add/score/" + scoreTotal + "/" + login, {
    method: "POST",
    Headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      score: score,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      alert(data);
    });
}

function afficherIndice() {
  //mettre ampoule
  let image = document.createElement("img");
  image.setAttribute("src", "bulb.jpg");
  document.getElementById("ampoule").appendChild(image);

  //demander au user sil veux hint
  const choix = confirm("Voulez-vous des suggestions (-20 points)?");

  if (choix) {
    document.getElementById("ampoule").style.display = none;
    document.getElementById("suggestions").style.display = inline;
    score -= 20;
  } else {
    document.getElementById("ampoule").style.display = none;
  }
}

function lancerHintPeriodiques() {
  hintInterval = setInterval(() => {
    systemeDevineLettre();
  }, hint * 1000);
}

function systemeDevineLettre() {
  affichageMot.forEach((element, index) => {
    if (element === "__") {
      affichageMot[index] === mot[index];
      score -= 10;
      ajusterAffichage();

      if (affichageMot.join("") === mot) {
        terminerPartie(true);
      } else return;
    }
  });
}
