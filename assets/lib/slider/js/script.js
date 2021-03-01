const body = document.querySelector('body');

mouse = 0;

body.addEventListener('mousedown', function () {
    mouse = 1;
});

body.addEventListener('mouseup', function () {
    mouse = 0;
});

$ = {};

$.slider = {
    sliderList: {},
    
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

                    let time = parseFloat(slider.getAttribute('carousel-time'));

                    $.slider.sliderList[sliderKey] = function () {
                        return setInterval(function () {
                            let index = parseInt(document.querySelector(`[data-slider-key="${sliderKey}"]`).getAttribute('data-slide-index'));
                            $.slider.selectSlider(index + 1, sliderKey);
                        }, ((time ? time : 1) * 1000));
                    };

                    $.slider.sliderList[sliderKey]['carouselFunctionCache'] = $.slider.sliderList[sliderKey]();

                }

                if (slider.getAttribute('navigate') == "true") {

                    [
                        ['previous', '⇦', 'left'],
                        ['next', '⇨', 'right']
                    ].forEach(function (item) {

                        let type = item[0];

                        let btn = document.createElement("BUTTON");
                        btn.innerHTML = item[1];
                        btn.classList.add('slider-navigate-button');
                        btn.setAttribute('type', type);
                        btn.style[item[2]] = 0;


                        if (type == "previous") {

                            _f = () => {
                                let slide = parseInt(document.querySelector(`[data-slider-key="${sliderKey}"]`).getAttribute('data-slide-index'));
                                $.slider.selectSlider((slide - 1), sliderKey);
                            };

                        } else if (type == "next") {
                            _f = () => {
                                let slide = parseInt(document.querySelector(`[data-slider-key="${sliderKey}"]`).getAttribute('data-slide-index'));
                                $.slider.selectSlider((slide + 1), sliderKey);
                            };
                        }

                        btn.addEventListener('mouseenter', function () {
                            if (mouse) {
                                _f();
                            }
                        });

                        btn.addEventListener('click', function () {
                            _f();
                        });

                        slider.appendChild(btn);
                    });

                }

            });

        } else {
            console.error('Element bulunamadı.');
        }
    },
    selectSlider: (index, key) => {

        let listItem = $.slider.sliderList[key];
        if (listItem) {
            clearInterval(listItem['carouselFunctionCache']);
            $.slider.sliderList[key]['carouselFunctionCache'] = listItem();
        }

        index = parseInt(index);

        let element = document.querySelectorAll(`[data-slider-key="${key}"][data-key]`);

        let max = (element.length / 2);
        let min = 0;
        let now = (index + 1);

        if (now > max) {
            index = 0;
        }

        if (now <= min) {
            index = (max - 1);
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
};