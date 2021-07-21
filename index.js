const API_KEY = "3329a87264a9861b53ed38d8a665bdd4";

const form = document.forms[0];
const searchText = document.getElementById("search-text");
const searchButton = document.getElementById("search-button");

const statusText = searchButton.nextElementSibling;

const body = document.body;

const locationName = document.getElementById("location");
const temp = document.getElementById("temp");
const type = document.getElementById("type");
const feels = document.querySelector("#feels span");
const humidity = document.querySelector("#humidity span");

(function () {
	let vh = window.innerHeight / 100;
	document.documentElement.style.setProperty("--vh", vh);
	window.addEventListener("resize", () => {
		vh = window.innerHeight / 100;
		document.documentElement.style.setProperty("--vh", vh);
	});
})();

searchText.addEventListener("click", () => {
	searchText.value = "";
});

searchText.addEventListener("input", () => {
	if (searchText.validity.valid) {
		form.classList.remove("error");
		statusText.classList.remove("show");
		statusText.textContent = "Error Message";
	}
});

form.addEventListener("submit", (e) => {
	e.preventDefault();
	if (!searchText.validity.valid) {
		form.classList.add("error");
		statusText.textContent = searchText.validationMessage;
		statusText.classList.add("show");
	} else {
		if (searchText === document.activeElement) {
			searchText.blur();
		}
		requestWeather(searchText.value);
	}
});

async function requestWeather(query) {
	try {
		statusText.textContent = "Loading data...";
		let response = await fetch(
			`https://api.openweathermap.org/data/2.5/weather?q=${query}&APPID=${API_KEY}`,
			{ mode: "cors" }
		);
		let data;
		data = await response.json();
		if (data.cod === 200) {
			statusText.classList.remove("show");
			domUpdate(data);
		} else {
			form.classList.add("error");
			statusText.classList.add("show");
			statusText.textContent = data.message;
		}
	} catch (error) {
		form.classList.add("error");
		statusText.classList.add("show");
		statusText.textContent = error.message;
	}
}

function domUpdate(data) {
	locationName.textContent = `${data.name}, ${data.sys.country}`;
	temp.textContent = Math.round((data.main.temp * 1000 - 274.15 * 1000) / 1000);
	humidity.textContent = data.main.humidity;
	feels.textContent = Math.round(
		(data.main.feels_like * 1000 - 274.15 * 1000) / 1000
	);
	type.textContent = data.weather[0].description;
	typeUpdate(data.weather[0].icon);
	searchText.value = `${data.name}, ${data.sys.country}`;
}

function typeUpdate(code) {
	switch (code.slice(2)) {
		case "d":
			document.documentElement.classList.add("light");
			document.documentElement.classList.remove("night");
			break;
		case "n":
			document.documentElement.classList.add("night");
			document.documentElement.classList.remove("light");
			break;
	}
	switch (code.slice(0, 2)) {
		case "01":
			body.setAttribute(
				"style",
				"--url-img: url(./image-assets/clear.jpg); --bposition: 20%"
			);
			break;
		case "02":
		case "03":
		case "04":
			body.setAttribute("style", "--url-img: url(./image-assets/cloudy.jpg)");
			break;
		case "09":
			body.setAttribute(
				"style",
				"--url-img: url(./image-assets/heavy-rain.jpg); --bposition: 10%"
			);
			break;
		case "10":
			body.setAttribute(
				"style",
				"--url-img: url(./image-assets/light-rain.jpg)"
			);
			break;
		case "11":
			body.setAttribute(
				"style",
				"--url-img: url(./image-assets/thunder.jpg); --bposition: 20%"
			);
			break;
		case "13":
			body.setAttribute(
				"style",
				"--url-img: url(./image-assets/snow.jpg); --bposition: 20%"
			);
			break;
		case "50":
			body.setAttribute(
				"style",
				"--url-img: url(./image-assets/atmosphere.jpg)"
			);
			break;
	}
}

function getLocation() {
	return new Promise((resolve, reject) => {
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(
				(success) => {
					statusText.textContent = "Locating...";
					statusText.classList.add("show");
					const lat = success.coords.latitude;
					const lon = success.coords.longitude;
					const realLocation = getRealName(lat, lon);

					if (realLocation) {
						resolve(realLocation);
					}
				},
				(error) => {
					statusText.textContent = "Geolocation data could not be gathered";
					statusText.classList.add("show");
					requestWeather("London");
				}
			);
		} else {
			reject("Geolocation is not supported by your browser.");
		}
	});
}

async function getRealName(lat, lon) {
	const response = await fetch(
		`https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${API_KEY}`,
		{ mode: "cors" }
	);
	const data = await response.json();

	return data[0].name;
}

window.addEventListener("load", () => {
	getLocation()
		.then((response) => {
			statusText.classList.remove("show");
			requestWeather(response);
		})
		.catch((error) => console.log(error));
});
