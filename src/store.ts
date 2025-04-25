import {ReactiveController, state} from '@snar/lit';
import {saveToLocalStorage} from 'snar-save-to-local-storage';
import {FormBuilder} from './forms/FormBuilder.js';

@saveToLocalStorage('spot-light-demo')
export class AppStore extends ReactiveController {
	@state() color = '#ffffff';
	@state() switched = true;
	@state() brightness = 0.5;
	@state() sizePx = 1844;
	@state() diffusion = 63;
	@state() angle = 60;

	toggleLight = () => {
		this.switched = !this.switched;
	};
}

const store = new AppStore();
const F = new FormBuilder(store);
export {store, F};
