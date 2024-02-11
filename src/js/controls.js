import { disableAll, showLoad, allowAll, hideLoad } from './style.js';

const main_url = "https://latipharkat-api.my.id/api/otakudesu/"

async function getData(data) {
    showLoad();
    disableAll();
    try {
        const response = await fetch(main_url + data);
        const results = await response.json();
        allowAll();
        hideLoad();
        return results;
    } catch(err) {
        console.log(err);
    }
}

export { getData };