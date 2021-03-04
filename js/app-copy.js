/* 
Known bugs:
Stars arent wide enough  ----------  at css fix container and star container at same time sithout display flex
Bigg lag
mobilen't

*/
var ENDPOINT = 'https://api.spacexdata.com/v3/launches/';
var ENDPOINTAll = 'https://api.spacexdata.com/v3/launches?sort=launch_date_utc';
let position = 0,
	positionstars = 0,
	amount = 0,
	index_next,
	date_last;

let ctx, timer, particles, button_right, button_left;

const drawStars = (ctx) => {
	ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
	for (let i = 0; i < 1300; i++) {
		ctx.beginPath();
		let x = Math.random() * ctx.canvas.width,
			y = Math.random() * ctx.canvas.height,
			size = Math.random() * 2;

		ctx.arc(x, y, size, 0, 2 * Math.PI);
		ctx.fillStyle = `rgba(255, 241, 194, ${Math.random()})`;
		ctx.fill();
	}
};

const loadCanvas = (amount) => {
	// make 1 screen pattern of stars for process efficiency
	const patternCanvas = document.querySelector('.js-starpattern');
	const patternContext = patternCanvas.getContext('2d');

	patternCanvas.width = document.documentElement.clientWidth;
	patternCanvas.height = document.documentElement.clientHeight;

	drawStars(patternContext);
	dataUrl = patternCanvas.toDataURL();

	/*
	const canvas = document.querySelector('.js-starcanvas');
	canvas.width = document.documentElement.clientWidth * amount;
	canvas.height = document.documentElement.clientHeight;

	ctx = canvas.getContext('2d');
	pattern = ctx.createPattern(patternCanvas, 'repeat');
	ctx.fillStyle = pattern;

	ctx.fillRect(0, 0, canvas.width, canvas.height);

	canvas.create;
	*/

	container_stars = document.querySelector('.c-container-stars');
	container_stars.style.width = `${document.documentElement.clientWidth * (amount / 2.8)}px`;
	container_stars.style.background = 'url(' + dataUrl + ')';
};

document.addEventListener('touchstart', handleTouchStart, false);
document.addEventListener('touchmove', handleTouchMove, false);

var xDown = null;
var yDown = null;

function getTouches(evt) {
	return (
		evt.touches || evt.originalEvent.touches // browser API
	); // jQuery
}

function handleTouchStart(evt) {
	const firstTouch = getTouches(evt)[0];
	xDown = firstTouch.clientX;
	yDown = firstTouch.clientY;
}

function handleTouchMove(evt) {
	if (!xDown || !yDown) {
		return;
	}

	var xUp = evt.touches[0].clientX;
	var yUp = evt.touches[0].clientY;

	var xDiff = xDown - xUp;
	var yDiff = yDown - yUp;

	if (Math.abs(xDiff) > Math.abs(yDiff)) {
		/*most significant*/
		if (xDiff > 0) {
			position -= 100;
			positionstars -= 32;
			document.querySelector('.c-container').style.transform = `translateX(${position}vw)`;
			document.querySelector('.js-starpattern').style.transform = `translateX(${positionstars}vw)`;
		} else {
			position += 100;
			positionstars += 32;
			document.querySelector('.c-container').style.transform = `translateX(${position}vw)`;
			document.querySelector('.js-starpattern').style.transform = `translateX(${positionstars}vw)`;
		}
	} else {
		if (yDiff > 0) {
			/* up swipe */
		} else {
			/* down swipe */
		}
	}
	/* reset values */
	xDown = null;
	yDown = null;
}

const getData = async function () {
	try {
		const data = await fetch(ENDPOINTAll)
			.then((r) => r.json())
			.then((data) => data);

		var json = JSON.stringify(data);
		sessionStorage.setItem('data', json);
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

const showTimer = function (time, i) {
	var interval = setInterval(function () {
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

		if (days > 5) {
			document.querySelector(`.js-countdown${i}`).innerHTML = days + ' days';
		} else if (hours > 48) {
			if (minutes != 0) {
				document.querySelector(`.js-countdown${i}`).innerHTML = days + ' days, ' + dhours + ' hours and </br>' + minutes + ' minutes';
			} else {
				document.querySelector(`.js-countdown${i}`).innerHTML = days + ' days, ' + dhours + ' hours';
			}
		} else {
			if (seconds != 0) {
				document.querySelector(`.js-countdown${i}`).innerHTML = hours + ' hours, ' + minutes + ' minutes and </br>' + seconds + ' seconds ';
			} else {
				document.querySelector(`.js-countdown${i}`).innerHTML = hours + ' hours and </br>' + minutes + ' minutes';
			}
		}
	}, 1000);
};

function truncate(str, n, useWordBoundary) {
	if (str.length <= n) {
		return str;
	}
	const subString = str.substr(0, n - 1); // the original check
	return (useWordBoundary ? subString.substr(0, subString.lastIndexOf(' ')) : subString) + ' &hellip;';
}

const showData = function (data) {
	var i = 0;

	data.forEach((element) => {
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
			payload = element.rocket.second_stage.payloads[0].payload_id,
			client = element.rocket.second_stage.payloads[0].customers[0],
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

			var HTML = `
			<div class="c-content">
				<img class="c-logo" src="img/logo-white.svg"></img>
				${rocketimg}
				<div class="c-form">
					<p class="c-title">The ${missionnr} mission was ${mission}</p>`;

			if (details != null) {
				HTML += `
				<p class="c-details" title="${details}">"${truncate(details, 250)}"</p>
				`;
			}

			HTML += `
					<div class="c-textarea">
						<p>The payload was ${payload} in a ${reusedtext} ${rocket_n} for ${client}</p>
						<p>This mission launched from ${location}</p>
					</div>`;

			var imglink1, imglink2;
			if (imglink.length != 0) {
				imglink1 = imglink[Math.floor(Math.random() * imglink.length)];
				HTML += `
					<div style="display:flex;">
						<a href="${imglink1}" class="c-img_center c-img"><img src="${imglink1}"></img></a>
					</div>`;
			}

			HTML += `
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
							<svg class="c-timeline-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M0 0h24v24H0z" fill="none"/><path fill="SLATEGRAY" d="M7.41 18.59L8.83 20 12 16.83 15.17 20l1.41-1.41L12 14l-4.59 4.59zm9.18-13.18L15.17 4 12 7.17 8.83 4 7.41 5.41 12 10l4.59-4.59z"/></svg>
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
	if (index_next == null) {
		index_next = i-4
	}

	loadCanvas(amount);
	document.querySelectorAll('.c-hidden').forEach((element) => {
		element.classList.remove('c-hidden');
	});
	document.querySelector('.c-loading').style.display = 'none';

	position = index_next * 100 * -1;
	positionstars = index_next * 33 * -1;
	document.querySelector('.c-container').style.transform = `translateX(${position}vw)`;
	document.querySelector('.c-container-stars').style.transform = `translateX(${positionstars}vw)`;
};

const hideButtons = () => {
	if ((position / 100) * -1 < amount - 1 && (position / 100) * -1 > 0) {
		button_right.style.display = 'block';
		button_left.style.display = 'block';
	} else if ((position / 100) * -1 >= amount - 1) {
		button_right.style.display = 'none';
	} else if ((position / 100) * -1 <= 0) {
		button_left.style.display = 'none';
	}
};

const init = function () {
	button_right = document.querySelector('.c-button-right');
	button_left = document.querySelector('.c-button-left');

	button_right.addEventListener('click', function () {
		position -= 100;
		positionstars -= 33;
		hideButtons();

		document.querySelector('.c-container').style.transform = `translateX(${position}vw)`;
		document.querySelector('.c-container-stars').style.transform = `translateX(${positionstars}vw)`;
	});
	button_left.addEventListener('click', function () {
		position += 100;
		positionstars += 33;
		hideButtons();

		document.querySelector('.c-container').style.transform = `translateX(${position}vw)`;
		document.querySelector('.c-container-stars').style.transform = `translateX(${positionstars}vw)`;
	});
};

document.addEventListener('DOMContentLoaded', function () {
	init();

	let data = sessionStorage.getItem('data');
	if (data == null) {
		getData();
	} else {
		showData(JSON.parse(data));
	}
});
