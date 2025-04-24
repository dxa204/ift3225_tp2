//variables globales
let mot = ""; //Mot a definir
let params; //parametres (lg, time)
let tempsAlloue; //Temps alloue au joeur/temps restant
let login;
let score;
let termine;

function loadJeu2() {
  params = getParametres();
  document.getElementById("body").style.display = inline;

  //get joueur logged
  fetch("gamers.php/session")
    .then((response) => response.json())
    .then((data) => {
      login = data.login;
      document.getElementById("affichageNomJoueur").textContent = login;
    });

  //get score du joueur logged
  fetch("gamers.php/gamers/" + login)
    .then((response) => response.json())
    .then((data) => {
      score = data.score;
      document.getElementById("scoreJoueur").textContent = score;
    });

  //get mot aléatoire
  fetch("definitions.php/word/lang/" + lang)
    .then((response) => response.json())
    .then((data) => {
      mot = data.mot;
      document.getElementById("definition").textContent = mot;
    });

  addEventListener("input", (e) => validateInput(e.target.value));
  lancerMinuterie();
}

//get parametres dans URL
function getParametres() {
  //default params
  const defaultParams = {
    lang: "en",
    tempsAlloue: 60,
  };

  //get params
  const parts = window.location.hash.split("/");

  //verification
  if (parts[1] !== "jeu" || parts[2] !== "def") {
    return defaultParams;
  }

  //si present dans url, sinon default
  const lang = parts[3] || defaultParams.lang;
  const tempsAlloue = parts[4] || defaultParams.tempsAlloue;

  return { lang, tempsAlloue };
}

function lancerMinuterie() {
  setInterval(() => {
    tempsAlloue--;
    document.getElementById("tempsRestant").textContent = `${tempsAlloue}s`;

    if (tempsAlloue <= 0) {
      terminerPartie(false);
    }
  }, 1000);
}

function validateInput(e) {
  if (!(e.length < 5 || e.length > 200)) {
    alert("Les définitions entrées doivent être entre 5 et 200 caractères");
  }

  fetch("definitions.php/word/mot")
    .then((resultat) => resultat.json())
    .then((data) => {
      let definitions = data.defs;

      definitions.forEach((el) => {
        if (el === e) {
          alert("définition déja existante");
        }
      });
    });

  insererDefinition(e);

  //augmenter points
  score += 5;
  affichage();
}

function affichage() {
  document.getElementById("affichageScore").textContent = score;
  document.getElementById("entreeLettre").textContent = "";
}

function insererDefinition(e) {
  fetch("definitions.php/word/mot/" + login + "/" + mot + "/" + e, {
    method: "POST",
    Headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      source: login,
      mot: mot,
      definition: e,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      alert(data);
    });
}

function terminerPartie(gagne) {
  document.getElementById("entreeLettre").textContent = "";
  document.getElementById("tempsRestant").textContent = "";

  if (!gagne) {
    alert("Temps ecoule");
  }

  insertNewScore();
}

function insertNewScore() {
  fetch("gamers.php/add/score/" + score + "/" + login, {
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
