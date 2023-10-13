'use strict';

///////////////////////////////////////
// Modal window

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');
const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');
const nav = document.querySelector('.nav')


const openModal = function () {
    modal.classList.remove('hidden');
    overlay.classList.remove('hidden');
};

const closeModal = function () {
    modal.classList.add('hidden');
    overlay.classList.add('hidden');
};

for (let i = 0; i < btnsOpenModal.length; i++)
    btnsOpenModal[i].addEventListener('click', openModal);

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
        closeModal();
    }
});






btnScrollTo.addEventListener("click", (e) => {
    const s1coords = section1.getBoundingClientRect();
    // window.scrollTo({
    //     left:s1coords.left,
    //     top:s1coords.top+window.scrollY,
    //     behavior:'smooth',
    // })
    section1.scrollIntoView({ behavior: 'smooth' });
})


// document.querySelectorAll('.nav__link').forEach((el)=>{
//     el.addEventListener('click',(e)=>{
//         e.preventDefault();
//         const id=el.getAttribute('href');
//         // console.log(id);
//         document.querySelector(id).scrollIntoView({behavior:'smooth'});
//     })
// })

document.querySelector('.nav__links').addEventListener('click', (e) => {
    e.preventDefault();
    if (e.target.classList.contains('nav__link')) {
        const id = e.target.getAttribute('href');
        document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
    }
})

// tabs.forEach(t =>t.addEventListener('click',()=>console.log("hello")));

tabsContainer.addEventListener('click', (e) => {
    const clicked = e.target.closest('.operations__tab');
    if (!clicked) return;

    tabs.forEach(t => t.classList.remove('operations__tab--active'));
    tabsContent.forEach(t => t.classList.remove('operations__content--active'));


    clicked.classList.add('operations__tab--active');

    document.querySelector(`.operations__content--${clicked.dataset.tab}`).classList.add('operations__content--active')
})

const handleHover = function (e) {
    // console.log(e.target,this)
    if (e.target.classList.contains('nav__link')) {
        const link = e.target;
        const siblings = link.closest('.nav').querySelectorAll('.nav__link')
        const logo = link.closest('.nav').querySelector('img');

        siblings.forEach(el => {
            if (el !== link) el.style.opacity = this;
        });
        logo.style.opacity = this;
    }
}

nav.addEventListener('mouseover', handleHover.bind(0.5))
nav.addEventListener('mouseout', handleHover.bind(1))


const header = document.querySelector('.header');
const navHeight = nav.getBoundingClientRect().height;


const stickyNav = (entries) => {
    const [entry] = entries;
    if (!entry.isIntersecting) nav.classList.add('sticky');
    else nav.classList.remove('sticky');
}

const headerObserver = new IntersectionObserver(stickyNav, {
    root: null,
    threshold: 0,
    rootMargin: `-${navHeight}px`,
})

headerObserver.observe(header);

const allSections = document.querySelectorAll('.section');

const revealSection = (entries, observer) => {
    const [entry] = entries;
    if (!entry.isIntersecting) return;
    entry.target.classList.remove('section--hidden');
    observer.unobserve(entry.target)
}
const sectionObserver = new IntersectionObserver(revealSection, {
    root: null,
    threshold: 0.15,
});

allSections.forEach(section => {
    sectionObserver.observe(section);
    section.classList.add('section--hidden');

});


const imgTargets = document.querySelectorAll('img[data-src]')

const loading = (entries, observer) => {
    const [entry] = entries;
    if (!entry.isIntersecting) return;
    entry.target.src = entry.target.dataset.src;
    entry.target.addEventListener('load', () => {
        entry.target.classList.remove('lazy-img');
    })
    observer.unobserve(entry.target);
}
const imgObserver = new IntersectionObserver(loading, {
    root: null,
    threshold: 0,
    rootMargin: `200px`,
});

imgTargets.forEach(img => imgObserver.observe(img))



const slider = () => {
    const slides = document.querySelectorAll('.slide');
    const btnLeft = document.querySelector('.slider__btn--left');
    const btnRight = document.querySelector('.slider__btn--right');
    const dotContainer = document.querySelector('.dots')
    let curSlide = 0;
    const maxSlide = slides.length;

    const goToSlide = (slide) => {
        slides.forEach((s, i) => s.style.transform = `translateX(${100 * (i - slide)}%)`);
    }


    const createDots = () => {
        slides.forEach((_, i) => {
            dotContainer.insertAdjacentHTML('beforeend', `<button class="dots__dot" data-slide="${i}"></button>`)
        })
    }

    const activateDot = (slide) => {
        document.querySelectorAll('.dots__dot')
            .forEach(dot => dot.classList.remove('dots__dot--active'));

        document.querySelector(`.dots__dot[data-slide="${slide}"]`)
            .classList.add('dots__dot--active');
    }

    const nextSlide = () => {
        if (curSlide === maxSlide - 1) curSlide = 0;
        else curSlide++;
        goToSlide(curSlide);
        activateDot(curSlide);
    }
    const prevSlide = () => {
        if (curSlide === 0) curSlide = maxSlide - 1;
        else curSlide--;
        goToSlide(curSlide);
        activateDot(curSlide);
    }

    const init = () => {
        goToSlide(0);
        createDots();
        activateDot(0);

    }
    init();
    btnRight.addEventListener('click', nextSlide)
    btnLeft.addEventListener('click', prevSlide)

    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') prevSlide();
        e.key === 'ArrowRight' && nextSlide();
    })

    dotContainer.addEventListener('click', (e) => {
        if (e.target.classList.contains('dots__dot')) {
            const { slide } = e.target.dataset;
            goToSlide(slide);
            activateDot(slide);

        }
    })
}
slider();