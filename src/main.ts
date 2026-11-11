import "./style.css";
import { countryList } from "./data";
import type { CountryType } from "./types";

document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
<div id="container">

  <div class="banner">
    <h2>Where in the world?</h2>
    <div class="mode-options">
      <span class="moon-icon"> 
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120">
          <path
          d="M96.484,92.7c-27.499,0-49.792-22.294-49.792-49.794c0-15.768,7.338-29.815,18.777-38.938 C35.655,5.082,11.823,29.588,11.823,59.674c0,30.794,24.965,55.757,55.759,55.757c19.959,0,37.459-10.493,47.311-26.262 C109.195,91.441,102.99,92.7,96.484,92.7z"
          />
        </svg>
      </span>
      <span class="dark-mode">Dark Mode</span>
    </div>
  </div>

  <div id="main-cards" class="current">
    <div class="search-and-filter">

      <form>
        <span>⌕</span>
        <input id="search" placeholder="Search for a country..."/>
      </form>

      <div class="filter-area">
        <button id="filter-btn">
          <span>Filter By Region</span> 
          <span id="filter-down">&#10095;</span>
        </button>
        <span id="regions"></span>
      </div>

    </div>

    <div class="cards-layout"></div>

  </div>

  <div id="main-details">
    <button id="go-back"><span>&larr;</span> Back</button>
    <div class="detail-container"></div>
  </div>

  <div id="main-empty">
    <h1>No Countries Found</h1>
  </div>

</div>
`;

//grabs the card loyout so the proper cards be displayed, including default data, filtered regions, searching for a country
const cardsLayout = document.querySelector(".cards-layout")!;
//main area that includes search bar , filter, and cards displayed. gets hidden get user selects a card
const mainCards = document.querySelector("#main-cards");
//for detailed card of any country
const detailedCard = document.querySelector("#main-details");
//for when there are no search results for what user typed
const emptyResult = document.querySelector("#main-empty");

//set up for when user clicks on any country, value gets used to create detailed card later on
let selectedCountry = null;

//when page loads up, function is called with the given data.  function is reused when user is searching for a country
function displayCountries(countries: CountryType[]) {
  //clears up any previous cards, so when user types,
  cardsLayout.innerHTML = "";

  countries.forEach((country) => {
    const cardContainer = document.createElement("div");
    cardContainer.classList.add("card-container");

    cardContainer.addEventListener("click", () => {
      //when user clicks on any card, selectedCountry gets set that specific country, them main cards are hidden so a detailed card for that country can be displayed
      selectedCountry = country;
      createDetails(selectedCountry);
      mainCards?.classList.toggle("hide");
      detailedCard?.classList.toggle("current");
    });

    const cardflagCont = document.createElement("div");
    cardflagCont.classList.add("card-flag-cont");

    const cardFlag = document.createElement("img");
    cardFlag.classList.add("card-flag");

    const cardInfo = document.createElement("div");
    cardInfo.classList.add("card-info");

    const cardName = document.createElement("h3");
    cardName.classList.add("card-name");

    const cardDescription = document.createElement("div");
    cardDescription.classList.add("card-desc");

    const cardPop = document.createElement("span");
    cardPop.classList.add("card-title");

    const cardRegion = document.createElement("span");
    cardRegion.classList.add("card-title");

    const cardCapital = document.createElement("span");
    cardCapital.classList.add("card-title");

    cardFlag.src = `${country.flag}`;
    cardFlag.alt = `flag of ${country.name}`;

    cardName.innerHTML = `${country.name}`;

    const popValue = new Intl.NumberFormat("en-US").format(
      Number(country.population),
    );

    cardPop.innerHTML = `Population: <p>${popValue}</>`;

    const regionValue = `${country.region}`;
    cardRegion.innerHTML = `Region: <p>${regionValue}</p>`;

    cardDescription.append(cardPop, cardRegion);
    //not all countries have captials, so it'll only be added if a country has one. gets appended this late so it can match with the design
    if (country.capital) {
      const capitalValue = `${country.capital}`;
      cardCapital.innerHTML = `Capital: <p>${capitalValue}</p>`;
      cardDescription.append(cardCapital);
    }

    cardInfo.append(cardName, cardDescription);

    cardflagCont.append(cardFlag);

    cardContainer.append(cardflagCont, cardInfo);

    cardsLayout.append(cardContainer);
  });
}

//adds all the unqie regions to a filter
const regionList = document.querySelector("#regions")!;
let regionTags: string[] = [];

function getRegions(countries: CountryType[]) {
  countries.forEach((element) => {
    if (!regionTags.includes(element.region)) {
      regionTags.push(element.region);
    }
  });

  //organizes regions in alphabetical order
  regionTags.sort((a, b) =>
    a.toLocaleLowerCase().localeCompare(b.toLocaleLowerCase()),
  );

  regionTags.forEach((x) => {
    const regionName = document.createElement("p");
    regionName.classList.add("region-name");
    regionName.textContent = x;
    const chosenRegion = regionName.textContent;
    //when a region is clicked, the initial data and the chosen region get passed to the filtercountries function
    //once it has found all suitable countries, only those will be displayed
    regionName.addEventListener("click", () => {
      const updateCountries = filterCountries(countryList, chosenRegion);
      displayCountries(updateCountries);
    });

    regionList.append(regionName);
  });
}

const filterBtn = document.querySelector<HTMLButtonElement>("#filter-btn")!;

//when filter in clicked, it'll open up the region list
filterBtn.addEventListener("click", () => {
  regionList.classList.toggle("active");
});

const containerBody = document.querySelector("body")!;
const modetheme = document.querySelector(".mode-options")!;

//when dark mode div is clicked on, checks if current theme is dark, if so then theme will be set to light,
// theme is then applied to the bodym then saved in local storage
modetheme.addEventListener("click", () => {
  const newTheme = theme === "dark" ? "light" : "dark";
  containerBody.setAttribute("data-theme", newTheme);
  localStorage.setItem("data-theme", newTheme);
});

let theme = localStorage.getItem("data-theme");

//checks for any theme, if no theme exists then the default will be set to dark
if (theme) {
  containerBody.setAttribute("data-theme", theme);
} else {
  containerBody.setAttribute("data-theme", "dark");
  localStorage.setItem("data-theme", "dark");
}

//accepts an array of data and a region string,
function filterCountries(countries: CountryType[], region: string) {
  return countries.filter((country) => {
    return country.region === region;
  });
}

const detailContainer = document.querySelector(".detail-container")!;
//create a detailed card whatever country a user clicked on

function createDetails(country: CountryType) {
  detailContainer.innerHTML = "";

  const detailImgDiv = document.createElement("div");
  detailImgDiv.classList.add("detail-img-div");

  const detailFlag = document.createElement("img");
  detailFlag.classList.add("detail-flag");

  detailImgDiv.append(detailFlag);

  const detailInfoDiv = document.createElement("div");
  detailInfoDiv.classList.add("detail-info-div");

  const detailList = document.createElement("div");
  detailList.classList.add("detail-list");

  const detailName = document.createElement("h2");
  detailName.classList.add("detail-name");

  const detailLeftTop = document.createElement("div");
  detailLeftTop.classList.add("detail-L-T");

  const detailNativeName = document.createElement("span");
  detailNativeName.classList.add("test28");

  const detailPop = document.createElement("span");
  detailPop.classList.add("test28");

  const detailRegion = document.createElement("span");
  detailRegion.classList.add("test28");

  const detailSubRegion = document.createElement("span");
  detailSubRegion.classList.add("test28");

  const detailCapital = document.createElement("span");
  detailCapital.classList.add("test28");

  const detailRightBottom = document.createElement("div");
  detailRightBottom.classList.add("detail-R-B");

  const detailDomain = document.createElement("span");
  detailDomain.classList.add("test28");

  const detailcurrencies = document.createElement("span");
  detailcurrencies.classList.add("test28");

  const detailLanguages = document.createElement("span");
  detailLanguages.classList.add("test28");
  detailLanguages.textContent = "Languages: ";

  const detailBorderDiv = document.createElement("div");
  detailBorderDiv.classList.add("border-div");

  const detailBorderP = document.createElement("p");
  detailBorderP.classList.add("test28");

  const detailBorderUl = document.createElement("ul");

  detailFlag.src = `${country.flag}`;
  detailFlag.alt = `flag of ${country.name}`;

  detailName.innerHTML = `${country.name}`;

  const nativeNameValue = `${country.nativeName}`;

  detailNativeName.innerHTML = `Native Name: <span>${nativeNameValue}</span>`;

  const popValue = new Intl.NumberFormat("en-US").format(
    Number(country.population),
  );

  detailPop.innerHTML = `Population: <span class="test2">${popValue}</span>`;

  const regionValue = `${country.region}`;

  detailRegion.innerHTML = `Region: <span class="test2">${regionValue}</span>`;

  const subRegionValue = `${country.subregion}`;

  detailSubRegion.innerHTML = `Sub Region: <span>${subRegionValue}</span>`;

  detailLeftTop.append(
    detailNativeName,
    detailPop,
    detailRegion,
    detailSubRegion,
  );

  detailRightBottom.append(detailDomain, detailcurrencies, detailLanguages);
  detailList.append(detailLeftTop, detailRightBottom);
  detailInfoDiv.append(detailName, detailList);
  detailContainer.append(detailImgDiv, detailInfoDiv);

  //if a country has a captial it'l be added towards the end
  if (country.capital) {
    const capitalValue = `${country.capital}`;
    detailCapital.innerHTML = `Capital: <span>${capitalValue}</span>`;
    detailLeftTop.append(detailCapital);
  }

  detailcurrencies.textContent = "Currencies: ";

  country.currencies?.forEach((element, index) => {
    const span = document.createElement("span");

    span.textContent =
      element.name +
      (index < (country.currencies?.length ?? 0) - 1 ? ", " : "");
    detailcurrencies.append(span);
  });

  detailDomain.textContent = "Top Level Domain: ";

  country.topLevelDomain.forEach((element) => {
    const span = document.createElement("span");

    span.textContent = element;
    detailDomain.append(span);
  });

  country.languages.forEach((l, index) => {
    const span = document.createElement("span");

    span.textContent =
      l.name + (index < country.languages.length - 1 ? ", " : "");
    detailLanguages.append(span);
  });

  detailBorderP.textContent = "Border Countries: ";

  //if a country shares a border, it'll look into the inital data and find the alpha3code matches with the picked countries' borders alpha3codes
  if (country.borders) {
    country.borders?.forEach((b) => {
      const borderCountry = countryList.find((name) => name.alpha3Code === b);

      //once a county is found, a li will be created and the value will the country's name which then gets appended to the ul
      if (borderCountry) {
        const li = document.createElement("li");
        li.textContent = borderCountry.name;
        detailBorderUl.append(li);
      }
    });

    detailBorderDiv.append(detailBorderP, detailBorderUl);
    detailInfoDiv.append(detailBorderDiv);
  }

  detailedCard?.append(detailContainer);
}

const goBackBtn = document.querySelector<HTMLButtonElement>("#go-back")!;

//the go back button which is initially hidden along side with the detailed card but active when a country is selected,
// now when user clicks on go back, the main cards are now active and the detailed card is hidden/removed
//finally selectedCountry becomes null so a new country can be later added
goBackBtn.addEventListener("click", () => {
  mainCards?.classList.toggle("hide");
  detailedCard?.classList.toggle("current");
  selectedCountry = null;
});

const search = document.querySelector<HTMLInputElement>("#search");

search?.addEventListener("input", updateSearch);

let searchedCounties: CountryType[] = [];

//takes the input value
//empty result message gets hidden incase user keeps on typing and card loyout gets displayed
function updateSearch(e: Event) {
  const input = (e.target as HTMLInputElement).value.toLowerCase();

  emptyResult?.classList.remove("active");
  cardsLayout?.classList.remove("hide");

  //filers out countrues that do not match wuth the input value
  //the rest are added to an array which will be used later
  searchedCounties = countryList.filter((c) =>
    c.name.toLowerCase().startsWith(input),
  );

  //if there are no mathces, empty message will be displayed and card layput gets hidden so message is all there's left on screen
  //if there are matches, the array from above will then be passed to the displayCountries function which creates the layout
  if (searchedCounties.length === 0) {
    emptyResult?.classList.add("active");
    cardsLayout?.classList.add("hide");
  } else {
    displayCountries(searchedCounties);
  }
}

displayCountries(countryList);
getRegions(countryList);

