var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { ReactiveController, state } from '@snar/lit';
import { saveToLocalStorage } from 'snar-save-to-local-storage';
import { FormBuilder } from './forms/FormBuilder.js';
let AppStore = class AppStore extends ReactiveController {
    constructor() {
        super(...arguments);
        this.color = '#ffffff';
        this.brightness = 0.5;
        this.sizePx = 2512;
        this.diffusion = 63;
    }
};
__decorate([
    state()
], AppStore.prototype, "color", void 0);
__decorate([
    state()
], AppStore.prototype, "brightness", void 0);
__decorate([
    state()
], AppStore.prototype, "sizePx", void 0);
__decorate([
    state()
], AppStore.prototype, "diffusion", void 0);
AppStore = __decorate([
    saveToLocalStorage('spot-light-demo')
], AppStore);
export { AppStore };
const store = new AppStore();
const F = new FormBuilder(store);
export { store, F };
