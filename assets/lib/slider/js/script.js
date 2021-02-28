const body = document.querySelector('body');

mouse = 0;

body.addEventListener('mousedown', function () {
    mouse = 1;
});

body.addEventListener('mouseup', function () {
    mouse = 0;
});

$ = {
    slider: {
        build: (_) => {
            let sliders = document.querySelectorAll(_);

            if (sliders) {

                sliders.forEach(function (slider, sliderIndex) {

                    let sliderKey = $.slider.getNewKey();
                    slider.setAttribute('data-slider-key', sliderKey);

                    let divs = slider.children;
                    let dots = "";

                    [...divs].forEach(function (item, index) {
                        if (item.tagName == 'DIV') {
                            let thumb = item.getAttribute('thumb');
                            if (thumb) {
                                dots +=
                                    `<span class="dot" data-key="${index}" data-slider-key="${sliderKey}">
                                    <img src="${thumb}" style="width: 100%;">
                                </span>`;
                            } else {
                                dots += `<span class="dot" data-key="${index}" data-slider-key="${sliderKey}" style="height: 20px; width: 20px; background: #ddd;"></span>`;
                            }

                            item.classList.add('item');
                            item.setAttribute("data-key", index);
                            item.setAttribute("data-slider-key", sliderKey);

                        } else {

                            if (item.classList.value.search('slider-navigate-button') >= 0) {

                                let type = item.getAttribute('type');

                                let slide = parseInt(document.querySelector(`[data-slider-key="${sliderKey}"]`).getAttribute('data-slide-index'));

                                // item.addEventListener('click', function () {
                                //     console.log("sa");
                                // });

                                if (type == "previous") {

                                    item.addEventListener('click', function () {
                                        $.slider.selectSlider((slide - 1), sliderKey);
                                    });

                                } else if (type == "next") {

                                    item.addEventListener('click', function () {
                                        $.slider.selectSlider((slide + 1), sliderKey);
                                    });

                                } else {
                                    console.error("Geçersiz button tipi!");
                                }

                            }

                        }
                    });

                    slider.innerHTML +=
                        `<div class="dots">
                            ${dots}
                        </div>`;

                    [...[...slider.children].pop().children].forEach(item => {
                        item.addEventListener('mouseenter', () => {
                            if (mouse) {
                                $.slider.selectSlider(item.getAttribute('data-key'), item.getAttribute('data-slider-key'));
                            }
                        });

                        item.addEventListener('click', () => {
                            $.slider.selectSlider(item.getAttribute('data-key'), item.getAttribute('data-slider-key'));
                        });

                    });

                    $.slider.selectSlider(0, sliderKey);

                    if (slider.getAttribute('carousel') == "true") {
                        let time = parseInt(slider.getAttribute('carousel-time'));

                        setInterval(function () {
                            let index = parseInt(document.querySelector(`[data-slider-key="${sliderKey}"]`).getAttribute('data-slide-index'));
                            $.slider.selectSlider(index + 1, sliderKey);
                        }, ((time ? time : 1) * 1000));
                    }

                });

            } else {
                console.error('Element bulunamadı.');
            }
        },
        selectSlider: (index, key) => {

            index = parseInt(index);

            let element = document.querySelectorAll(`[data-slider-key="${key}"][data-key]`);

            if ((index + 1) > (element.length / 2)) {
                index = 0;
            }

            element.forEach(item => {
                if (item.getAttribute('data-key') == index) {
                    item.classList.add('active');
                    document.querySelector(`[data-slider-key="${key}"]`).setAttribute('data-slide-index', index);
                } else {
                    item.classList.remove("active");
                }
            });

        },
        getNewKey: () => {
            return Math.random().toString(36).substring(7);
        }
    }
};