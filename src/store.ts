import {ReactiveController, state} from '@snar/lit';
import {saveToLocalStorage} from 'snar-save-to-local-storage';
import {FormBuilder} from './forms/FormBuilder.js';

@saveToLocalStorage('spot-light-demo')
export class AppStore extends ReactiveController {
	@state() color = '#ffffff';
	@state() brightness = 0.5;
	@state() sizePx = 2512;
	@state() diffusion = 63;
}

const store = new AppStore();
const F = new FormBuilder(store);
export {store, F};
