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
		ctx.fillStyle = `rgba(255, 241, 194, ${Math.random()})`;
		/* ctx.fillStyle = 'rgb(255, 241, 194)'; */
		ctx.fill();
	}
};

const loadCanvas = (width = 1) => {
	const canvas = document.querySelectorAll('.js-stars');
	canvas.forEach(element => {
		element.width = document.documentElement.clientWidth * width;
		element.height = document.documentElement.clientHeight;
		ctx = element.getContext('2d');
		drawStars(ctx);
	});
};

document.addEventListener('DOMContentLoaded', function() {
	loadCanvas();
});
