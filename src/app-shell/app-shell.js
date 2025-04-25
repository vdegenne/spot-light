var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { withController } from '@snar/lit';
import { LitElement, html } from 'lit';
import { withStyles } from 'lit-with-styles';
import { customElement } from 'lit/decorators.js';
import { materialShellLoadingOff } from 'material-shell';
import '../spot-light.js';
import { F, store } from '../store.js';
import { renderColorPicker } from '../styles/theme-elements.js';
import { themeStore } from '../styles/themeStore.js';
import styles from './app-shell.css?inline';
let AppShell = class AppShell extends LitElement {
    firstUpdated() {
        materialShellLoadingOff.call(this);
    }
    render() {
        return html `<!-- -->
			<md-text-button class="absolute top-3 left-3 text-xl"
				>${'<spot-light></spot-light>'}</md-text-button
			>
			<spot-light
				.brightness=${store.brightness}
				.sizePx="${store.sizePx}"
				.diffusion=${store.diffusion}
				color="${themeStore.themeColor}"
			></spot-light>

			<div class="absolute inset-0 flex flex-col items-center">
				<div class="flex-1"></div>
				<div class="flex-1">
					<div class="flex flex-col gap-4">
						<div class="mb-1 flex items-center gap-4">
							Color ${renderColorPicker()}
						</div>
						${F.SLIDER('Power', 'sizePx', { min: 0, max: 9999, step: 1 })}
						${F.SLIDER('Brightness', 'brightness', {
            min: 0,
            max: 1,
            step: 0.01,
        })}
						${F.SLIDER('Diffusion', 'diffusion', { min: 0, max: 100, step: 1 })}
					</div>
				</div>
			</div>
			<!-- -->`;
    }
};
AppShell = __decorate([
    customElement('app-shell'),
    withStyles(styles),
    withController(store),
    withController(themeStore)
], AppShell);
export { AppShell };
export const app = (window.app = new AppShell());
