import {fetchSlides} from "./slides.js";

export let collection;
export let currentCollection = 0;
let collections = [];

export function changeCollection(change) {
    console.log('Change:', change);

    fetch(`collections.json`)
    .then(response => response.json())
    .then(data => {
        console.log('Collections data length:', data.length);
        if (change === 1 || change === 0 || change === -1) {
            currentCollection -= change;
            if (currentCollection < 0) {
                currentCollection = collections.length - 1;
            } else if (currentCollection >= collections.length) {
                currentCollection = 0;
            }
        } else {
            console.log('Change:', change);
            currentCollection = data.findIndex(item => item.collection === change);
            console.log('Current collection:', currentCollection);
        }
        collections = data;
        collection = data[currentCollection].name;
        let header1Number = currentCollection - 1;
        let header3Number = currentCollection + 1;
        if (header1Number < 0) {
            header1Number = data.length - 1;
        }
        if (header3Number >= data.length) {
            header3Number = 0;
        }

        const header1 = document.querySelector('.header-1');
        const header2 = document.querySelector('.header-2');
        const header3 = document.querySelector('.header-3');
        header1.innerHTML = `
        <img src="headers/${data[header1Number].name}.png" alt="1">
        `;
        header2.innerHTML = `
        <img src="headers/${collection}.png" alt="${collection} header">
        `;
        header3.innerHTML = `
        <img src="headers/${data[header3Number].name}.png" alt="3">
        `;
        // console.log(`Changing collection to: ${collection}`);
        const galleryButton = document.querySelector('.gallery-button');
        galleryButton.innerHTML = `<img class="gallery-button" src="/headers/${data[currentCollection].collection}.png">`;
        fetchSlides(collection);
        console.log(`Changing collection to: ${collections[currentCollection].collection}`);

    });
    
}