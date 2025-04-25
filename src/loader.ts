// This needs to be before anything else
// because it sets a shared stylesheet used by
// elements' construtor.
import './styles/themeStore.js';
import './styles/shared.js';

import '@material/web/all.js';

import {app} from './app-shell/app-shell.js';
document.querySelector<HTMLElement>('material-shell').appendChild(app);
/** or Firebase */
// import "./firebase/onAuthStateChanged.js";

import './global-listeners.js';

// import './gamepad.js';

app.updateComplete.then(() => {});
