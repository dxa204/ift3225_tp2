//générer la page de départ
function generatePage() {
  var login, pwd, score, mot;

  fetch("defintions.php/word")
    .then((response) => response.json())
    .then((data) => {
      //choix d'un mot
      mot = data[Math.floor(Math.random() * data.lenth)];

      //insertion dans le document
      document.getElementById("definition").textContent = mot.definition;

      //calcul du score alloue
      score = mot.length * 10;

      //initialiser avec bon nombre de lettres
      var l = mot.length;
      for (let i = 0; i < l; i++) {
        let g = document.createElementWith("td");
        g.setAttribute("id", "lettre{i}");
        g.textContent = "_";
        document.getElementById("longueur").appendChild();
      }
    })
    .catch((error) => {
      document.getElementById("definition").textContent =
        "erreur: chargement impossible";
    });

  //initialisation du temps
  document.getElementById("tempsRestant").textContent = temps;
  lancerMinuterie(temps);

  //initialisation du joueur
  fetch("gamers.php/session")
    .then((response) => response.json)
    .then((data) => {
      login = data.login;
      pwd = data.pwd;
    });

  fetch("gamers.php/gamers")
    .then((response) => response.json)
    .then((data) => {
      score = data.score;
    });

  document.getElementById("joueur").textContent = login;
  document.getElementById("scoreJoueur").textContent = score;
}

//gestion du temps
function lancerMinuterie(temps) {
  if (tempsRestant <= temps - 10) {
  }
}
