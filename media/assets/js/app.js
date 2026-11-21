const API = "http://localhost:3000/countries";
const app = document.querySelector("#app");

const medals = ["gold", "silver", "bronze"];
const medalNames = {
  gold: "GOLD",
  silver: "SLIVER",
  bronze: "BRONZE",
};

let countries = [];

function link(url, text, className = "", htmlCode = "") {
  return `<a href="#/${url}" class="${className}">${htmlCode}${text}</a>`;
}

function buttonBack(url = "") {
  return `<a href="#/${url}" class="back-link"><img src="../images/ico-prev.svg" /></a>`;
}

function total(data) {
  return medals.reduce((sum, medal) => sum + Number(data[medal] || 0), 0);
}

function flag(name) {
  if (name === "United Kingdom") name = "UnitedKingdom";
  return `./assets/images/flags/${name}.png`;
}

function disciplineImage(name) {
  return `./assets/images/disciplines/${name.replaceAll(" ", "")}.svg`;
}

function medalImage(type) {
  return `./assets/images/medals/${type}.png`;
}

function findCountry(name) {
  return countries.find((country) => country.name === name);
}

function findDiscipline(country, name) {
  return country?.disciplines.find((item) => item.name === name);
}

function medalCards(data, clickable = false, countryName = "") {
  console.log(data);
  return medals
    .map((type) => {
      let tag = clickable ? "a" : "div";
      let href = clickable
        ? `href="#/country/${encodeURIComponent(countryName)}/medals/${type}"`
        : "";

      return `
      <${tag} class="medal-card" ${href}>
        <img src="${medalImage(type)}" style="width: 30px; margin: 10px;" alt="${medalNames[type]}">
        <span>Medals</span>
      </${tag}>
    `;
    })
    .join("");
}

function homePage() {
  return `
    <main class="page" style="gap: 35px;">
      <img src="../images/logo-white.png" />
      <img src="../images/frame.png" />
      <nav class="menu">
        ${link("countries", "Countries", "button", "<img src='../images/ico-countries.svg' />")}
        ${link("disciplines", "Disciplines", "button", "<img src='../images/ico-disciplines.svg' />")}
      </nav>
    </main>
  `;
}

function countriesPage() {
  return `
    <main class="page">
      ${buttonBack()}
      <img src="../images/logo-sm-white.png" />
      <h1>Countries</h1>

      <section class="list">
        ${countries
          .map((country) =>
            link(
              `country/${encodeURIComponent(country.name)}`,
              `
            <img src="${flag(country.name)}" alt="Флаг ${country.name}">
            <span>${country.name}</span>
          `,
              "list-item",
            ),
          )
          .join("")}
      </section>
    </main>
  `;
}

function countryPage(name) {
  const country = findCountry(name);

  return `
    <main class="page">
      ${buttonBack(`countries`)}
      <img src="../images/logo-sm-white.png" />

      <header class="country-heading">
        <h1>${country.name}</h1>
        <img src="${flag(country.name)}" style="" alt="Флаг ${country.name}">
        <table class="medal-table">
    <thead>
      <tr>
        <th>GOLD</th>
        <th>SILVER</th>
        <th>BRONZE</th>
        <th>TOTAL</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>${country.medals.gold}</td>
        <td>${country.medals.silver}</td>
        <td>${country.medals.bronze}</td>
        <td>${country.medals.gold + country.medals.silver + country.medals.bronze}</td>
      </tr>
    </tbody>
  </table>
      </header>

      <section class="medal-grid">
        ${medalCards(country.medals, true, country.name)}
      </section>
    </main>
  `;
}

function countryMedalsPage(name, type) {
  const country = findCountry(name);

  const disciplines = country.disciplines
    .filter((item) => item[type] > 0)
    .sort((a, b) => b[type] - a[type]);

  return `
    <main class="page">
      ${buttonBack(`country/${encodeURIComponent(name)}`)}
      

      <header class="country-heading">
        <h1>${country.name}</h1>
        <img src="${flag(country.name)}" alt="${country.name}">
      </header>

      <section class="medal-heading">
        <h2>${medalNames[type]}: ${country.medals[type]}</h2>
      </section>

      <table class="medal-table" style="transform: scale(0.9);">
        <thead>
          <tr>
            <th>Discipline</th>
            <th>Medals</th>
          </tr>
        </thead>
        <tbody>
          ${disciplines
            .map(
              (item) => `
            <tr>
              <td>${item.name}</td>
              <td>${item[type]}</td>
            </tr>
          `,
            )
            .join("")}
        </tbody>
      </table>

    </main>
  `;
}

function disciplinesPage() {
  const disciplines = [];

  countries.forEach((country) => {
    country.disciplines.forEach((item) => {
      if (!disciplines.some((d) => d.name === item.name)) {
        disciplines.push(item);
      }
    });
  });

  disciplines.sort((a, b) => a.name.localeCompare(b.name));

  return `
    <main class="page disciplines-page">
      ${buttonBack()}
      <img src="../images/logo-sm-white.png" alt="Logo" /><br/><br/>
      <h1>Disciplines</h1>

      <section class="list disciplines-list">
        ${disciplines
          .map((item) =>
            link(
              `discipline/${encodeURIComponent(item.name)}`,
              `
              <img class="discipline-image" src="${disciplineImage(item.name)}" alt="${item.name}">
              <span>${item.name}</span>
              `,
              "list-item",
            ),
          )
          .join("")}
      </section>
    </main>
  `;
}

function disciplineCountriesPage(name) {
  const participating = [];

  countries.forEach((country) => {
    const discipline = findDiscipline(country, name);

    if (discipline) {
      participating.push({ country, discipline });
    }
  });

  participating.sort((a, b) => total(b.discipline) - total(a.discipline));

  return `
    <main class="page">
      ${buttonBack(`disciplines`)}
      <img src="../images/logo-sm-white.png" alt="Logo" /><br/><br/>

      <header class="discipline-heading">
        <h1 style="margin: 0; padding: 0;">${name}</h1>
        <img src="${disciplineImage(name)}" alt="${name}">
      </header>

      <table class="countries-medal-table">
        <thead>
          <tr>
            <th>COUNTRY</th>
            <th>MEDALS</th>
          </tr>
        </thead>
        <tbody>
          ${participating
            .map(
              (item) => `
            <tr>
              <td>
                ${link(
                  `discipline/${encodeURIComponent(name)}/${encodeURIComponent(item.country.name)}`,
                  item.country.name,
                  "country-table-link",
                )}
              </td>
              <td>${total(item.discipline)}</td>
            </tr>
          `,
            )
            .join("")}
        </tbody>
      </table>
    </main>
  `;
}

function disciplineCountryPage(name, countryName) {
  const country = findCountry(countryName);

  const discipline = findDiscipline(country, name);

  const totalMedals = total(discipline);

  return `
    <main class="page">
      ${buttonBack(`discipline/${encodeURIComponent(name)}`)}
      <img src="../images/logo-sm-white.png" alt="Logo" /><br/><br/>

      <header class="discipline-heading">
        <h1>${name}</h1>
        <img src="${disciplineImage(name)}" alt="${name}">
        <h2>${country.name}</h2>
        
      </header>

      <table class="medal-table discipline-medal-table">
        <thead>
          <tr>
            <th>GOLD</th>
            <th>SILVER</th>
            <th>BRONZE</th>
            <th>TOTAL</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>${discipline.gold}</td>
            <td>${discipline.silver}</td>
            <td>${discipline.bronze}</td>
            <td>${totalMedals}</td>
          </tr>
        </tbody>
      </table>
    </main>
  `;
}

function render() {
  const parts = decodeURI(location.hash.slice(1)).split("/").filter(Boolean);

  const page = parts[0];
  const name = parts[1];
  const third = parts[2];
  const fourth = parts[3];

  if (!page) {
    app.innerHTML = homePage();
  } else if (page === "countries" && !name) {
    app.innerHTML = countriesPage();
  } else if (page === "country" && name && third === "medals") {
    app.innerHTML = countryMedalsPage(name, fourth);
  } else if (page === "country" && name) {
    app.innerHTML = countryPage(name);
  } else if (page === "disciplines") {
    app.innerHTML = disciplinesPage();
  } else if (page === "discipline" && name && third) {
    app.innerHTML = disciplineCountryPage(name, third);
  } else if (page === "discipline" && name) {
    app.innerHTML = disciplineCountriesPage(name);
  }
}

fetch(API)
  .then((response) => response.json())
  .then((data) => {
    countries = data;
    render();
    window.addEventListener("hashchange", render);
  });
