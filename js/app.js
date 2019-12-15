/* 
Known bugs:
Stars arent wide enough
Bigg lag
mobilen't

*/
var ENDPOINT = 'https://api.spacexdata.com/v3/launches/';
var ENDPOINTAll = 'https://api.spacexdata.com/v3/launches?sort=launch_date_utc';
let position = 0,
	positionstars = 0,
	amount,
	index_next,
	date_last;

const FULL_CIRCLE = 2 * Math.PI;
let ctx, timer, particles;

const drawStars = ctx => {
	ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
	for (let i = 0; i < 20000; i++) {
		ctx.beginPath();
		let x = Math.random() * ctx.canvas.width,
			y = Math.random() * ctx.canvas.height,
			size = Math.random() * 2;

		ctx.arc(x, y, size, 0, FULL_CIRCLE);
		ctx.fillStyle = `rgba(255, 241, 194, ${Math.random()})`;
		/* ctx.fillStyle = 'rgb(255, 241, 194)'; */
		ctx.fill();
	}
};

const loadCanvas = (width = 15) => {
	const canvas = document.querySelectorAll('.js-stars');
	canvas.forEach(element => {
		element.width = document.documentElement.clientWidth * width;
		element.height = document.documentElement.clientHeight;
		ctx = element.getContext('2d');
		drawStars(ctx);
	});
};

const getData = async function() {
	try {
		const data = await fetch(ENDPOINTAll)
			.then(r => r.json())
			.then(data => data);
		showData(data);
	} catch (error) {
		console.warn(error);
	}
};

const getRocket = (rocket_n, rocket_t, rocket_f, rocket_b) => {
	switch (rocket_n) {
		case 'Falcon 9':
			if (rocket_t == 'v1.0') {
				if (rocket_f) {
					return '<img class="c-rocketimg-out" src="img/F9_v1.0_Fi_Pa.svg"></img>';
				} else {
					return '<img class="c-rocketimg-out" src="img/F9_v1.1_Pa.svg"></img>';
				}
			} else if (rocket_t == 'v1.1') {
				if (rocket_f) {
					return '<img class="c-rocketimg-out" src="img/F9_v1.1_Fi_Pa.svg"></img>';
				} else {
					return '<img class="c-rocketimg-out" src="img/F9_v1.1_Pa.svg"></img>';
				}
			} else if (rocket_t == 'v1.2') {
				if (rocket_f) {
					return '<img class="c-rocketimg-out" src="img/F9_v1.2_Fi_Pa.svg"></img>';
				} else {
					return '<img class="c-rocketimg-out" src="img/F9_v1.2_Pa.svg"></img>';
				}
			} else {
				if (rocket_f) {
					return '<img class="c-rocketimg-out" src="img/F9_B5_Fi_Pa.svg"></img>';
				} else {
					return '<img class="c-rocketimg-out" src="img/F9_B5_Pa.svg"></img>';
				}
			}

		case 'Falcon Heavy':
			if (rocket_b == 5) {
				return '<img class="c-rocketimg-out" src="img/FH_B5_Fi_Pa.svg"></img>';
			} else {
				return '<img class="c-rocketimg-out" src="img/FH_Fi_Pa.svg"></img>';
			}

		case 'Falcon 1':
			return '<img class="c-rocketimg-out" src="img/F1.svg"></img>';

		default:
			return '<img class="c-rocketimg-out" src="img/F9_v1.2_Fi_Pa.svg"></img>';
	}
};

const showTimer = function(time, i) {
	var interval = setInterval(function() {
		var now = new Date(),
			distance = time - now.getTime(),
			distance_passed = now - date_last,
			distance_tot = time - date_last,
			days = Math.floor(distance / (1000 * 60 * 60 * 24)),
			dhours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
			hours = Math.floor(distance / (1000 * 60 * 60)),
			minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
			seconds = Math.floor((distance % (1000 * 60)) / 1000),
			passed = Math.round((distance_passed / distance_tot) * 100);
		document.querySelector(`.js-timeline${i}`).style.width = `${passed}%`;

		if (hours > 48) {	
			document.querySelector(`.js-countdown${i}`).innerHTML = days + ' days, ' + dhours + ' hours and </br>' + minutes + ' minutes';
		} else {
			if(seconds != 0){
				document.querySelector(`.js-countdown${i}`).innerHTML = hours + ' hours, ' + minutes + ' minutes and </br>' + seconds + ' seconds ';
			}else{
				document.querySelector(`.js-countdown${i}`).innerHTML = hours + ' hours and </br>' + minutes + ' minutes';
			}
			
		}
	}, 1000);
};

const showData = function(data) {
	var i = 0;

	data.forEach(element => {
		var reusedtext,
			rocketimg,
			link,
			datetime = new Date(element.launch_date_utc),
			location = element.launch_site.site_name_long,
			rocket_n = element.rocket.rocket_name,
			rocket_t = element.rocket.rocket_type,
			rocket_f = element.rocket.first_stage.cores[0].gridfins,
			rocket_b = element.rocket.first_stage.cores[0].block,
			orbit = element.rocket.second_stage.payloads[0].orbit_params.reference_system,
			position = element.rocket.second_stage.payloads[0].orbit_params.regime,
			reused = element.rocket.second_stage.payloads[0].reused,
			mission = element.mission_name,
			vidlink = element.links.video_link,
			imglink = element.links.flickr_images,
			missionnr = element.flight_number,
			details = element.details,
			payload = element.rocket.second_stage.payloads.payload_id,
			client = element.rocket.second_stage.payloads.customers,
			nationality = element.rocket.second_stage.payloads[0].nationality,
			manufacturer = element.rocket.second_stage.payloads[0].manufacturer,
			payload_type = element.rocket.second_stage.payloads[0].payload_type;

		if (datetime < new Date().getTime()) {
			switch (missionnr) {
				case 1:
					missionnr = '1st';
					break;
				case 2:
					missionnr = '2nd';
					break;
				case 3:
					missionnr = '3rd';
					break;
				default:
					missionnr += 'th';
			}

			if (reused) {
				reusedtext = 'reused';
			} else {
				reusedtext = 'brand new';
			}

			if (vidlink != null) {
				link = `<p class="c-link">Watch <a href="${vidlink}">here</a></p>`;
			} else {
				link = '';
			}

			rocketimg = getRocket(rocket_n, rocket_t, rocket_f, rocket_b);
			date_last = datetime;

			imglink1 = imglink[Math.floor(Math.random() * imglink.length)];
			imglink2 = imglink[Math.floor(Math.random() * imglink.length)];
			if (imglink1 == imglink2)
			{imglink2 = imglink[Math.floor(Math.random() * imglink.length)];}

			var HTML = `
			<div class="c-content">
				<img class="c-logo" src="img/logo-white.svg"></img>
				${rocketimg}
				<div class="c-form">
					<p class="c-title">The ${missionnr} mission was ${mission}</p>
					<p class="c-details">"${details}"</p>
					<div class="c-textarea">
						<p>The payload was ${payload} in a ${reusedtext} ${rocket_n} for ${client}</p>
						<p>This mission launched from ${location}</p>
					</div>
					<div style="display:flex;">
						<a href="${imglink1}" class="c-img_left"><img src="${imglink1}"></img></a>
						<a href="${imglink2}" class="c-img_right"><img src="${imglink2}"></img></a>
					</div>
				</div>
			</div>`;

			document.querySelector('.c-container').innerHTML += HTML;
		} else {
			if (reused) {
				reusedtext = 'reused';
			} else {
				reusedtext = 'brand new';
			}

			if (vidlink != null) {
				link = `<p class="c-link">Watch <a href="${vidlink}">here</a></p>`;
			} else {
				link = '';
			}

			if (index_next == null) {
				index_next = i;
			} else {
			}

			progression = rocketimg = getRocket(rocket_n, rocket_t, rocket_f, rocket_b);

			var HTML = `
			<div class="c-content">
				<img class="c-logo" src="img/logo-white.svg"></img>
				${rocketimg}
				<div class="c-form">
					<div title="Timer may deviate if launch date is not confirmed yet and placed on the 1st of the planned month.">
						<p class="c-title">Upcoming mission ${missionnr} is ${mission} and launches in</p>
					</div>
					<p title="Timer may deviate if launch date is not confirmed yet and placed on the 1st of the planned month." class="c-countdown js-countdown${i}"></p>
					<div>
						<div class="c-timeline">
							<p class="c-timeline_text_past">Last launch</p>
							<p class="c-timeline_text_next">This launch</p>
						</div>
						<div class="c-timeline-bar">
							<div class="c-timeline_passed js-timeline${i}"></div>
							<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" style="transform: translate(-12px, -7px) scale(1.5);"><path d="M0 0h24v24H0z" fill="none"/><path fill="SLATEGRAY" d="M7.41 18.59L8.83 20 12 16.83 15.17 20l1.41-1.41L12 14l-4.59 4.59zm9.18-13.18L15.17 4 12 7.17 8.83 4 7.41 5.41 12 10l4.59-4.59z"/></svg>
						</div>
					</div>
					<div class="c-textarea">
						<p class="c-rocketkind">In a ${reusedtext} ${rocket_n}</p>
						<p class="c-orbit">Going into a ${orbit} ${position} orbit</p>
						<p class="c-orbit">The payload is a ${payload_type} made by ${manufacturer} in ${nationality}</p>
						<p class="c-date">Launchdate is ${datetime.toLocaleDateString('nl-BE')} at ${datetime.toLocaleTimeString('nl-BE')} in your local timezone</p>
						<p class="c-launchloc">At ${location}</p>
						${link}
					</div>
				</div>
			</div>`;

			document.querySelector('.c-container').innerHTML += HTML;
			showTimer(datetime, i);
		}
		i++;
		amount++;
	});

	loadCanvas();
	document.querySelectorAll('.c-hidden').forEach(element => {
		element.classList.remove('c-hidden');
	});
	document.querySelector('.c-loading').style.display = 'none';

	position = index_next * 100 * -1;
	document.querySelector('.c-container').style.transform = `translateX(${position}vw)`;
};

/* aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa fix da knop hide als het moet */

const init = function() {
	document.querySelector('.c-button-right').addEventListener('click', function() {
		position -= 100;
		positionstars -= 32;
		if (index_next >= amount) {
			document.querySelector('.c-button-right').style.display = 'none';
		} else {
			document.querySelector('.c-button-right').style.display = 'block';
		}
		document.querySelector('.c-container').style.transform = `translateX(${position}vw)`;
		document.querySelector('.js-stars').style.transform = `translateX(${positionstars}vw)`;
	});
	document.querySelector('.c-button-left').addEventListener('click', function() {
		position += 100;
		positionstars += 32;
		if (index_next <= amount) {
			document.querySelector('.c-button-left').style.display = 'none';
		} else {
			document.querySelector('.c-button-left').style.display = 'block';
		}
		document.querySelector('.c-container').style.transform = `translateX(${position}vw)`;
		document.querySelector('.js-stars').style.transform = `translateX(${positionstars}vw)`;
	});
	getData();
};

document.addEventListener('DOMContentLoaded', function() {
	init();
});
