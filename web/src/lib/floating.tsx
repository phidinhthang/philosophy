export function floating({
  content = '👌',
  number = 1,
  duration = 10,
  repeat = 'infinite',
  direction = 'normal',
  size = 2,
} = {}) {
  const style = document.createElement('style');
  style.id = 'floating-style';

  if (!document.getElementById('floating-style')) {
    document.head.appendChild(style);
  }

  const MAX = 201;

  const styles = `
		.float-container {
			width: 100vw;
			height: 100vh;
			overflow: hidden;
			position: fixed;
			top: 0;
			left: 0;
			pointer-events: none;
		}
		.float-container div * {
			width: 1em;
			height: 1em;
		}
		@keyframes float {
			${Array.from({ length: MAX + 1 })
        .map((v, x) => ({
          percent: (x * 100) / MAX,
          width: Math.sin(x / 10) * 5,
          height: 100 + x * (-110 / MAX),
        }))
        .map(
          ({ percent, width, height }) =>
            `
						${percent}% {
							transform: translate(
								${width}vw,
								${height}vh
							);
              opacity: ${1 - Math.round(percent / 5) / 10};
						}
					`,
        )
        .join('')}
		}
	`;

  document.getElementById('floating-style')!.innerHTML = styles;

  const container = document.createElement('div');

  container.className = 'float-container';

  const _size = Array.isArray(size)
    ? Math.floor(Math.random() * (size[1] - size[0] + 1)) + size[0]
    : size;

  for (let i = 0; i < number; i++) {
    const floater = document.createElement('div');
    floater.innerHTML = content;

    floater.style.cssText = `
			position: absolute;
			left: 0;
			font-size: ${_size}em;
			transform: translateY(110vh);
			animation:
				float
				${duration}s
				linear
				${i * Math.random()}s
				${repeat}
				${direction};
			margin-left: ${Math.random() * 10 + 45}vw;
		`;

    floater.addEventListener('animationend', (e) => {
      if (e.animationName === 'float') {
        container.removeChild(floater);
      }
    });

    container.appendChild(floater);
  }

  document.body.appendChild(container);
}
