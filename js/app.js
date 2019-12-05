var ENDPOINT = 'https://api.spacexdata.com/v3/launches/';
let position = 0;
const FULL_CIRCLE = 2 * Math.PI;
let ctx, timer, particles;

const drawStars = ctx => {
	ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
	for (let i = 0; i < 1000; i++) {
		ctx.beginPath();
		let x = Math.random() * ctx.canvas.width,
			y = Math.random() * ctx.canvas.height,
			size = Math.random() * 2;

		ctx.arc(x, y, size, 0, FULL_CIRCLE);
		ctx.fillStyle = 'rgb(255, 241, 194)';
		ctx.fill();
	}
};

const loadCanvas = () => {
	const canvas = document.querySelectorAll('.js-stars');

	canvas.forEach(element => {
		element.width = document.documentElement.clientWidth;
		element.height = document.documentElement.clientHeight;
		ctx = element.getContext('2d');
		drawStars(ctx);
	});
	/* let timer = setInterval(() => {
		drawStars(ctx);
	}, 1000); */
};

const fetchData = function(end) {
	return fetch(end)
		.then(r => r.json())
		.then(data => data);
};

const getData = async function(end) {
	try {
		const data = await fetchData(end);
		showdata(data);
	} catch (error) {
		console.warn(error);
	}
};

/* utc = gmt */
/* document.querySelector('.js-button-AllTime').addEventListener('click', AllTime); */
const showdata = function(data) {
	var datetime = new Date(data.launch_date_utc);
	var location = data.launch_site.site_name_long;
	var rocket = data.rocket.rocket_name;
	var orbit = data.rocket.second_stage.payloads[0].orbit_params.reference_system;
	var distance = data.rocket.second_stage.payloads[0].orbit_params.regime;
	var reused = data.rocket.second_stage.payloads[0].reused;
	var mission = data.mission_name;

	console.log(datetime, location, rocket, orbit, distance, reused, mission);

	document.querySelector('.js-mission').innerHTML = mission;
	document.querySelector('.js-launchloc').innerHTML = location;
	if (reused) {
		document.querySelector('.js-reused').innerHTML = 'reused';
	} else {
		document.querySelector('.js-reused').innerHTML = 'brand new';
	}

	document.querySelector('.js-orbit').innerHTML = orbit;
	document.querySelector('.js-position').innerHTML = distance;
	document.querySelector('.js-rocket').innerHTML = rocket;
	showTimer(datetime);

	document.querySelector('.js-date').innerHTML = ''.concat(datetime.toLocaleDateString(), ' at ', datetime.toLocaleTimeString());
};

const showTimer = function(time) {
	var x = setInterval(function() {
		var now = new Date().getTime();
		var distance = time - now;

		var hours = Math.floor(distance / (1000 * 60 * 60));
		var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
		var seconds = Math.floor((distance % (1000 * 60)) / 1000);

		document.querySelector('.js-countdown').innerHTML = hours + ' hours, ' + minutes + ' minutes and ' + seconds + ' seconds ';
	}, 1000);
};

const Next = function() {
	console.log('Getting next');
	getData(ENDPOINT.concat('next'));
};

const Last = function() {
	console.log('Getting last');
	getData(ENDPOINT.concat('last'));
};

const Upcomming = function() {
	console.log('Getting upcomming');
	getData(ENDPOINT.concat('upcomming'));
};

const init = function() {
	document.querySelector('.c-button-right').addEventListener('click', function() {
		position -= 100;
		document.querySelector('.c-container').style.transform = `translateX(${position}vw)`;
	});
	document.querySelector('.c-button-left').addEventListener('click', function() {
		position += 100;
		document.querySelector('.c-container').style.transform = `translateX(${position}vw)`;
	});
	getData(ENDPOINT.concat('next'));
};

document.addEventListener('DOMContentLoaded', function() {
	init();
	loadCanvas();
});
