const main = document.getElementById("main");
const start = new Date();
const coords = [55.76, 37.64];
let interval;

const intervalHandler = (el) => {
  el.textContent = Math.floor((new Date() - start) / 1000) + " seconds";
};

const drawMap = () => {
  const mapEl = document.getElementById("map");
  if (!mapEl) return;

  const mapLocation = new ymaps.Map("map", {
    center: coords,
    zoom: 10,
  });

  if (mapLocation) {
    const placemark = new ymaps.Placemark(
      coords,
      {},
      {
        preset: "islands#icon",
      }
    );
    mapLocation.geoObjects.add(placemark);
    mapEl.textContent = "";
  }
};

const handleLocation = async () => {
  let page = window.location.pathname.slice(1);
  if (!page) {
    page = "activity";
  }

  const html = await fetch(`pages/${page}.html`).then((data) => data.text());
  main.innerHTML = html;

  if (page === "time") {
    const el = document.getElementById("time");
    intervalHandler(el);
    interval = setInterval(() => intervalHandler(el), 1000);
  } else {
    clearInterval(interval);
  }

  if (page === "map") {
    ymaps.ready(drawMap);
  }
};

const linkClick = (e) => {
  e.preventDefault();
  history.pushState(null, null, e.target.href);
  handleLocation();
};

const links = document.querySelectorAll("a");
links.forEach((link) => {
  link.addEventListener("click", linkClick);
});

window.addEventListener("popstate", handleLocation);
handleLocation();
