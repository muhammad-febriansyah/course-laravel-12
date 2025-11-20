import { route as ziggyRoute } from 'ziggy-js';
import { Ziggy } from './ziggy.js';

declare global {
    var route: typeof ziggyRoute;
    interface Window {
        Ziggy: typeof Ziggy;
    }
}

globalThis.route = ziggyRoute;
window.Ziggy = Ziggy;
