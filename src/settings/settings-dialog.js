var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { withController } from '@snar/lit';
import { customElement } from 'custom-element-decorator';
import { html, LitElement } from 'lit';
import { withStyles } from 'lit-with-styles';
import { query, state } from 'lit/decorators.js';
import { FormBuilder } from '../forms/FormBuilder.js';
import { store } from '../store.js';
import { themeStore } from '../styles/themeStore.js';
import { renderThemeElements } from '../styles/theme-elements.js';
import styles from './settings-dialog.css?inline';
import '../material/dialog-patch.js';
let F = new FormBuilder(store);
let SettingsDialog = class SettingsDialog extends LitElement {
    constructor() {
        super(...arguments);
        this.open = false;
    }
    render() {
        return html `
			<md-dialog
				?open=${this.open}
				@closed=${() => (this.open = false)}
				style="max-width:min(100vw - 18px, 400px);width:100%"
			>
				<header slot="headline" class="select-none">
					<md-icon>settings</md-icon>
					Settings
				</header>

				<form
					slot="content"
					method="dialog"
					id="form"
					class="flex flex-col gap-9"
				>
					<md-list class="p-0" style="--forms-switch-padding:initial">
						<!-- put the switches here -->
					</md-list>

					<div class="mb-5">
						<p>Theme</p>
						${renderThemeElements()}
					</div>
				</form>

				<div slot="actions">
					<md-text-button form="form" autofocus>Close</md-text-button>
				</div>
			</md-dialog>
		`;
    }
    async show() {
        if (this.dialog.open) {
            const dialogClose = new Promise((resolve) => {
                const resolveCB = () => {
                    resolve(null);
                    this.dialog.removeEventListener('closed', resolveCB);
                };
                this.dialog.addEventListener('closed', resolveCB);
            });
            this.dialog.close();
            await dialogClose;
        }
        this.open = true;
    }
    close(returnValue) {
        return this.dialog.close(returnValue);
    }
};
__decorate([
    state()
], SettingsDialog.prototype, "open", void 0);
__decorate([
    query('md-dialog')
], SettingsDialog.prototype, "dialog", void 0);
SettingsDialog = __decorate([
    customElement({ name: 'settings-dialog', inject: true }),
    withStyles(styles),
    withController(themeStore),
    withController(store)
], SettingsDialog);
export { SettingsDialog };
export const settingsDialog = (window.settingsDialog = new SettingsDialog());
