import './assets/main.css';
import './assets/color.css';
import {createApp} from 'vue';
import {createPinia} from "pinia";
import App from './App.vue';
import router from './router';
import {library} from '@fortawesome/fontawesome-svg-core';
import {FontAwesomeIcon} from '@fortawesome/vue-fontawesome';
import {
    faArrowLeftLong,
    faBarcode,
    faCartShopping, faCheck,
    faChevronDown, faChevronLeft, faChevronRight,
    faChevronUp, faCircleNotch, faPlus, faTrash,
    faUser,
    faUtensils, faXmark,
    faPoo, faFlaskVial, faPenToSquare
} from '@fortawesome/free-solid-svg-icons';
import moment from "moment";
import 'moment/locale/fr';
import {faFileLines} from "@fortawesome/free-regular-svg-icons";

library.add(
    faBarcode, faCartShopping, faUtensils, faChevronDown, faChevronUp, faChevronLeft, faChevronRight,
    faUser, faCheck, faXmark, faCircleNotch, faTrash, faPlus, faFileLines, faArrowLeftLong, faPoo,
    faFlaskVial, faPenToSquare
);

const pinia = createPinia();
const app = createApp(App);

app.use(pinia);
app.use(router);

app.component('font-awesome-icon', FontAwesomeIcon);

app.mount('#app');

moment.locale('fr', {
    months: 'janvier_février_mars_avril_mai_juin_juillet_août_septembre_octobre_novembre_décembre'.split('_'),
    monthsShort: 'janv._févr._mars_avr._mai_juin_juil._août_sept._oct._nov._déc.'.split('_'),
    monthsParseExact: true,
    weekdays: 'dimanche_lundi_mardi_mercredi_jeudi_vendredi_samedi'.split('_'),
    weekdaysShort: 'dim._lun._mar._mer._jeu._ven._sam.'.split('_'),
    weekdaysMin: 'Di_Lu_Ma_Me_Je_Ve_Sa'.split('_'),
    weekdaysParseExact: true,
    longDateFormat: {
        LT: 'HH:mm',
        LTS: 'HH:mm:ss',
        L: 'DD/MM/YYYY',
        LL: 'D MMMM YYYY',
        LLL: 'D MMMM YYYY HH:mm',
        LLLL: 'dddd D MMMM YYYY HH:mm'
    },
    calendar: {
        sameDay: '[Aujourd’hui à] LT',
        nextDay: '[Demain à] LT',
        nextWeek: 'dddd [à] LT',
        lastDay: '[Hier à] LT',
        lastWeek: 'dddd [dernier à] LT',
        sameElse: 'L'
    },
    relativeTime: {
        future: 'dans %s',
        past: 'il y a %s',
        s: 'quelques secondes',
        m: 'une minute',
        mm: '%d minutes',
        h: 'une heure',
        hh: '%d heures',
        d: 'un jour',
        dd: '%d jours',
        M: 'un mois',
        MM: '%d mois',
        y: 'un an',
        yy: '%d ans'
    },
    dayOfMonthOrdinalParse: /\d{1,2}(er|e)/,
    ordinal: function (number) {
        return number + (number === 1 ? 'er' : 'e');
    },
    meridiemParse: /PD|MD/,
    isPM: function (input) {
        return input.charAt(0) === 'M';
    },
    meridiem: function (hours, minutes, isLower) {
        return hours < 12 ? 'PD' : 'MD';
    },
    week: {
        dow: 1, // Monday is the first day of the week.
        doy: 4  // Used to determine first week of the year.
    }
});
