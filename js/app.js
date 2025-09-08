(() => {
    "use strict";
    let addWindowScrollEvent = false;
    setTimeout((() => {
        if (addWindowScrollEvent) {
            let windowScroll = new Event("windowScroll");
            window.addEventListener("scroll", (function (e) {
                document.dispatchEvent(windowScroll);
            }));
        }
    }), 0);
    let script_form = document.querySelector(".page__form");
    let tel = document.querySelector(".page__tel");
    let messagers = document.querySelector(".page__messagers");
    script_form.onsubmit = function (evt) {
        evt.preventDefault();
        messagers.innerHTML = '<a href="https://wa.me/7' + tel.value + '" target="_blank" alt="">    <img class="bottons" src="/sw/img/what.svg" alt=""></a><a href="https://t.me/+7' + tel.value + '" target="_blank" alt="">    <img class="bottons" src="/sw/img/teleg.svg" alt=""></a><a href="viber://chat?number=7' + tel.value + '" target="_blank" alt="">    <img class="bottons" src="/sw/img/viber.svg" alt=""></a>';
    };
    window["FLS"] = true;
})();