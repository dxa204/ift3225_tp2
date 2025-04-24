let currentBody;

function loadDoc() {
  corps = document.getElementById("body");

  //creation du html a placer
  currentBody = corps.innerHTML;
  corps.innerHTML = "";
  document.getElementById("body").innerHTML =
    "<h1>Services REST<h1><div>ADMIN: acces aux donnees des joueurs et des definitions</div></n><div>DEFINITIONS: acces a la liste des definitions de la collection</div></n><div>GAMERS: ajout, login ou logout par le user</div></n><h1>Routes de lapplication client</h1><div>JEU/WORD/LG/TIME/HINT: jeu ou lon devine un mot pour accumuler des points selon la langue, le temps, et le temps de devinette entres</div></n><div>JEU/DEF/LG/TIME: jeu dajout de definitions pour un mot avec une langue et un temps entres</div></n><div>DUMP/STEP: visualisation dune table contenant la collection de definitions</div></n><div>DOC: cette page ci</div>";
}
