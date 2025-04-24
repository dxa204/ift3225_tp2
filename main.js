window.addEventListener("DOMContentLoaded", () => {
  const currentPath = window.location.hash;

  if (currentPath.includes("word")) {
    loadJeu1();
  } else if (currentPath.includes("def")) {
    loadJeu2();
  } else if (currentPath.includes("dump")) {
    loadData();
  } else if (currentPath.includes("doc")) {
    loadDoc();
  } else {
    alert("wrong path");
  }
});
