import {cquerySelector} from 'html-vision';
// import {getThemeStore} from './imports.js';

window.addEventListener('keydown', async (event: KeyboardEvent) => {
	// console.log(event)
	if (event.altKey || event.ctrlKey) {
		return;
	}

	const target = event.composedPath()[0] as Element;
	if (['TEXTAREA', 'INPUT'].includes(target.tagName)) {
		return;
	}

	const button = cquerySelector(`[key="${event.key}"]`);
	if (button) {
		button?.click();
		return;
	}

	// switch (event.key) {
	// 	case 'd':
	// 		(await getThemeStore()).toggleMode();
	// 		break;
	// }
});

export {};
