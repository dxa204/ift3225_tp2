let params;
let step;
let currentBody;

window.addEventListener(
  onclose((ev) => {
    document.getElementById("body").innerHTML = currentBody;
  })
);

function loadData() {
  step = getParametre();

  //creation du tableau de base
  let tableau = document.createElement("table");
  let tableHeader = document.createElement("thead");
  let tableBody = document.createElement("tbody");

  //header
  let tr = document.createElement("tr");

  for (let i = 0; i < 4; i++) {
    let colonne = document.createElement("th");
    tr.appendChild(colonne);
  }

  tableHeader.appendChild(tr);

  //body
  for (let i = 0; i < step; i++) {
    let rangee = document.createElement("tr");

    for (let j = 0; j < 4; j++) {
      let colonne = document.createElement("td");
      rangee.appendChild(colonne);
    }

    tableBody.append(rangee);
  }

  tableau.appendChild(tableHeader);
  tableau.appendChild(tableBody);

  tableau.setAttribute("id", "dataTable");
  afficher();
}

function getParametre() {
  const defStep = 10;
  const parts = window.location.hash.split("/");

  if (parts[1] !== "dump") {
    return defStep;
  }

  const step = parts[2] || defStep;

  return step;
}

function afficher() {
  let table = new DataTable("#dataTable", {
    pageLength: step,
  });

  let corps = document.getElementById("body");
  currentBody = corps.innerHTML;
  corps.innerHTML = "";
  document.getElementById("body").appendChild(table);
}
