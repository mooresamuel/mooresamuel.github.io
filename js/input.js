import { showOverlay, handleClose, fullScreen} from './overlay.js';
import { changeCollection } from './collection.js';
import { prevSlide, nextSlide, getNextSlide, slides, currentSlide } from './slides.js';
import { toggleMenu } from './utils.js';

let startX, endX, startY, endY;

export function handleStart(e) {
    if (!e.target.closest('.blurb')) {
        e.preventDefault();
        startX = e.touches ? e.touches[0].clientX : e.clientX;
        startY = e.touches ? e.touches[0].clientY : e.clientY;
    }
}


export function handleEnd(e) {
    // if (e.target.closest('.menu')) {
    //     return;
    // }

    const screenWidth = window.innerWidth;
    const target = e.target;
    console.log('End event target:', target);

    if (target.closest('.menu')) {
        return ;
    }
    e.preventDefault();
    const menu = document.querySelector('.menu');
    if (menu.style.display === 'flex' && !target.closest('.menu')) {
        toggleMenu();
        return ;
    }
    if (target && target.closest('#change-menu-btn')) {
        console.log('Menu button clicked');
        toggleMenu();
        return ;
    }
    if (target && target.closest('.close-button')) {

            console.log('Close button clicked');
            slides[currentSlide].classList.add('hidden');
            handleClose();
            nextSlide();
            return ;
    }
    if (target && target.closest('.fullscreen-button')) {
        fullScreen();
        return ;
    }
    if (startX <= screenWidth * 0.2) {
        prevSlide();
        return;
    } else if (startX >= screenWidth * 0.8 )  {
        getNextSlide();
        return;
    }

    endX = e.changedTouches ? e.changedTouches[0].clientX : e.clientX;
    endY = e.changedTouches ? e.changedTouches[0].clientY : e.clientY;
    const xMove = endX - startX;
    const yMove = endY - startY;

    if (Math.abs(xMove) > 10 || Math.abs(yMove) > 10) {
        if (Math.abs (xMove) > Math.abs(yMove)) {
            if (startX > endX + 10) {
                prevSlide();
                return ;
            } else if (startX < endX - 10) {
                getNextSlide();
                return ;
            }
        } else if (Math.abs(yMove) > 10) {
            if (!document.querySelector('.overlay') && Math.abs(yMove) > 10) {
                if (startY > endY + 10) {
                    console.log('Swiped up');
                    changeCollection(1);
                    return ;
                } else if (startY < endY - 10) {
                    console.log('Swiped down');
                    changeCollection(-1);
                    return ;
                }
            }
        } 
    } else if (!document.querySelector('.overlay')) {
        document.querySelectorAll('.active').forEach(element => {
            element.classList.add('hidden');
            // showOverlay();
            console.log('going to overlay mode');
            const overlay = document.querySelector('.overlay');
            slides.forEach (slide => slide.classList.add('paused'));
            showOverlay();
            return ;
        });
    }

        console.log('No action taken');
}
