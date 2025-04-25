import {html} from 'lit';
import {themeStore} from './themeStore.js';
import '@vdegenne/material-color-helpers/elements.js';
import type {
	ColorModePicker,
	ColorPicker,
} from '@vdegenne/material-color-helpers/elements.js';
import '@material/web/labs/segmentedbuttonset/outlined-segmented-button-set.js';
import '@material/web/labs/segmentedbutton/outlined-segmented-button.js';
import '@material/web/icon/icon.js';

export function renderColorModePicker() {
	return html`
		<color-mode-picker
			.value=${themeStore.colorMode}
			@select=${(event: Event) => {
				const target = event.target as ColorModePicker;
				themeStore.colorMode = target.value as typeof themeStore.colorMode;
			}}
			icon-only
		></color-mode-picker>
	`;
}

export function renderColorPicker() {
	return html`
		<color-picker
			.value=${themeStore.themeColor}
			@input=${(event: Event) => {
				const target = event.target as ColorPicker;
				themeStore.themeColor = target.value;
			}}
		></color-picker>
	`;
}

export function renderThemeElements() {
	return html`
		<div style="display:flex;align-items:center;gap:18px;">
			${renderColorPicker()} ${renderColorModePicker()}
		</div>
	`;
}
