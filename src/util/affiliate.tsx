import axios from 'axios';
import {parse} from 'query-string';

export function parseReferral() {
    const {ref} = parse(window.location.search);

    if (ref) {
        // clear parameters
        window.history.replaceState({}, document.title, window.location.pathname);

        const previousRef = localStorage.getItem('referral');

        if (previousRef !== ref) {
            localStorage.setItem('referral', ref as string);
            axios.post('/affiliate/hit', {id: ref});
        }
    }
}
