var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { ReactiveController } from '@snar/lit';
import { ColorMode, ThemeManager } from 'lit-with-styles';
import { state } from 'snar';
import { saveToLocalStorage } from 'snar-save-to-local-storage';
let ThemeStore = class ThemeStore extends ReactiveController {
    constructor() {
        super(...arguments);
        this.colorMode = ColorMode.SYSTEM;
        /**
         * When changing the following default value, we also have
         * to make sure to provide the tokens on start,
         * and also 'theme-color' meta tag in html header.
         * Material default theme seed is '#6750A4'
         */
        this.themeColor = '#6750A4';
    }
    async updated(changed) {
        if (changed.has('colorMode')) {
            ThemeManager.mode = this.colorMode;
        }
        const { themeFromSourceColor, applyTheme } = await import('@vdegenne/material-color-helpers');
        const theme = themeFromSourceColor(this.themeColor, 
        // ThemeManager.appliedColorScheme === 'dark',
        ThemeManager.preferredColorScheme === 'dark', 'vibrant', 0);
        applyTheme(document, theme);
    }
    toggleMode() {
        const currentScheme = ThemeManager.appliedColorScheme;
        const oppositeMode = currentScheme === 'dark' ? ColorMode.LIGHT : ColorMode.DARK;
        const preferredTheme = ThemeManager.preferredColorScheme;
        this.colorMode =
            preferredTheme !== undefined
                ? preferredTheme === oppositeMode
                    ? ColorMode.SYSTEM
                    : oppositeMode
                : oppositeMode;
    }
};
__decorate([
    state()
], ThemeStore.prototype, "colorMode", void 0);
__decorate([
    state()
], ThemeStore.prototype, "themeColor", void 0);
ThemeStore = __decorate([
    saveToLocalStorage('sfc:theme')
], ThemeStore);
export const themeStore = (window.themeStore = new ThemeStore());
window
    .matchMedia('(prefers-color-scheme: dark)')
    .addEventListener('change', () => themeStore.requestUpdate());
ThemeManager.init();
