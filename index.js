const API_KEY = "3329a87264a9861b53ed38d8a665bdd4";

async function requestWeather(query) {
	// let response = await fetch(
	// 	`https://api.openweathermap.org/data/2.5/weather?q=${query}&APPID=${API_KEY}`
	// );
	let response = await fetch(`./test.json`);
	const data = await response.json();
	console.log(data);
	console.log(data.name + ",", data.sys.country);
}

requestWeather("lohaghat");
