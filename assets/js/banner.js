(function () {
    var bannerSlides = document.querySelectorAll('.banner-item');

    if (bannerSlides && bannerSlides.length > 1) {
        var bannerIndicators = document.querySelectorAll('.banner-controls__indicator');

        var timeout;
        startTimeout();

        function startTimeout() {
            if (timeout) clearTimeout(timeout);
            timeout = setTimeout(function () {
                changeSlide('next');
            }, 7000);
        }

        document.getElementById('banner').addEventListener('keyup', function (e) {
            const slides = document.querySelector('.banner').getAttribute('data-slides');
            const currentSlide = document.querySelector('.banner-item.active').getAttribute('data-slide');
            const activeElementSlide = document.activeElement.parentNode.parentNode.getAttribute('data-slide');
            console.log(e.key, currentSlide, activeElementSlide);
            if (e.key === 'Tab' && slides !== currentSlide && currentSlide !== (activeElementSlide || -1)) {
                changeSlide('next');
            }
        });

        document.querySelectorAll('.banner-controls__arrow--next')[0].addEventListener('click', function () {
            changeSlide('next');
        });
        document.querySelectorAll('.banner-controls__arrow--previous')[0].addEventListener('click', function () {
            changeSlide('prev');
        });

        var indicators = document.querySelectorAll('.banner-controls__indicator');
        for (var i = 0; i < indicators.length; i++) {
            indicators[i].addEventListener('click', function () {
                changeSlide(event.target.getAttribute('data-indicator'));
            });
        }
        document.querySelectorAll('.banner-item__detail').forEach(function (d) {
            d.addEventListener('mouseenter', function () {
                clearTimeout(timeout);
            });
        });
        document.querySelectorAll('.banner-item__detail').forEach(function (d) {
            d.addEventListener('mouseleave', function () {
                startTimeout();
            });
        });

        function getCurrentActiveSlideIndex() {
            return parseInt(document.querySelectorAll('.banner-item.active')[0].getAttribute('data-slide'));
        }
        function changeSlide(slideNumber) {
            if (!document.getElementById('banner').classList.contains('scroll')) {
                var currentActiveIndex = getCurrentActiveSlideIndex();
                var nextIndex = slideNumber;

                switch (slideNumber) {
                    case "next":
                        nextIndex = (currentActiveIndex + 1 > bannerSlides.length ? 1 : currentActiveIndex + 1);
                        break;
                    case "prev":
                        nextIndex = currentActiveIndex - 1 < 1 ? bannerSlides.length : currentActiveIndex - 1;
                        break;
                    default:
                        nextIndex = parseInt(nextIndex);
                }
                var currentCta = bannerSlides[currentActiveIndex - 1].querySelector('.banner-item__cta');
                var nextCta = bannerSlides[nextIndex - 1].querySelector('.banner-item__cta');
                document.querySelectorAll('.banner')[0].style.transform = 'translateX(' + ((100 / bannerSlides.length) * (nextIndex - 1) * -1) + '%)';
                bannerSlides[currentActiveIndex - 1].classList.remove('active');
                if (currentCta) {
                    currentCta.tabIndex = -1;
                }
                bannerIndicators[currentActiveIndex - 1].classList.remove('active');
                bannerSlides[nextIndex - 1].classList.add('active');
                if (nextCta) {
                    nextCta.tabIndex = 0;
                }
                bannerIndicators[nextIndex - 1].classList.add('active');
            } else {
                var scrollMax = document.getElementById('banner').scrollWidth;
                var scrollIncrement = scrollMax / bannerSlides.length;
                var scrollLeft = document.getElementById('banner').scrollLeft;
                var scrollNext = scrollLeft + scrollIncrement;
                if (scrollLeft >= Math.floor(scrollMax - scrollIncrement)) scrollNext = 0;

                document.getElementById('banner').scrollTo({
                    top: 0, left: scrollNext, behavior: 'smooth'
                });
            }
            startTimeout();
        }
    }
})();
