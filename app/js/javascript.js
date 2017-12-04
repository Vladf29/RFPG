(function () {
    'use strict'
    /**
     * Отримуємо висоту сторінки(html);
     */
    let heightPage = document.documentElement.clientHeight;
    /**
     * Отримуємо ширену сторінки(html);
     */
    let widthPage = document.documentElement.clientWidth;

    /**
     * Отримуємо елементи по їх id
     */
    const container = document.getElementById("container"),
        gallery = document.getElementById("gallery"),
        containerBigImg = document.getElementById("conainer-bigImg");

    /**
     * Зміна для створення бокової панелі навігації по сторінці
     */
    const panle = document.createElement("nav");
    /**
     * Зміна v для збереження кількості прокручених px
     * Зміна currentElem містить дані якій порядковий номер елемента прокручено
     */
    let v = 0,
        currentElem = 1;

    setHeightElem();
    createPanleSide();
    effectWheel();

    /**
     * Обробочик кліка на елемент
     */
    panle.addEventListener("click", function (e) {
        let target = e.target;
        v = 0;
        v -= heightPage * (target.getAttribute("data-index"));
        container.style.top = v + "px";
        /**
         * Видаляє клас із попереднього елемента
         */
        this.children[currentElem - 1].classList.remove("panle-side__section_mode");
        currentElem = target.getAttribute("data-index") * 1 + 1;
        /**
         * Додає клас елементу
         */
        this.children[currentElem - 1].classList.add("panle-side__section_mode");
    });
    gallery.addEventListener("click", galleryBigImg);
    containerBigImg.onclick = function () {
        this.style.display = "none";
        let elemChild = containerBigImg.firstElementChild;
        elemChild.innerHTML = "";
    }

    function effectWheel() {
        /**
         * Зміна flag відображає чи widthPage менше 1240
         * Зміна flagTwo відобржає відписання від події
         */
        let flag = false,
            flagTwo = true;
        /**
         * Зміна oldHeightPage зберігає старий розмір сторінки для перевірки 
         * із теперішнім 
         */
        let oldHeightPage = heightPage;


        /**
         * Обробочик на колесико миші
         */
        document.addEventListener("wheel", eventOnWheel);

        setInterval(function () {
            widthPage = document.documentElement.clientWidth;
            heightPage = document.documentElement.clientHeight;

            if (widthPage < 1240) {
                flag = true;
                if (flag && flagTwo) {
                    container.style = "";
                    container.parentElement.scrollTop = Math.abs(v);
                    document.removeEventListener("wheel", eventOnWheel);
                    flagTwo = false;
                    return;
                }
            }
            if (flag && widthPage > 1240) {
                container.parentElement.scrollTop = 0;
                panle.children[currentElem - 1].classList.remove("panle-side__section_mode");
                currentElem = 1;
                panle.children[currentElem - 1].classList.add("panle-side__section_mode");
                document.addEventListener("wheel", eventOnWheel);
                flag = false;
                flagTwo = true;
            }
            if (oldHeightPage != heightPage && widthPage > 1240) {
                oldHeightPage = heightPage;
                v = 0;
                v = v - (heightPage * (currentElem - 1));
                container.style.top = v + "px";
                setHeightElem();
            }
        }, 600);
        /**
         * Функція для обробочика onwheel
         */
        let block = false;

        function eventOnWheel(e) {
            /**
             * if e.deltay > 0 то відображається наступний елемент з низу
             * else верхній елемент
             * якщо вони задовільняють ще і внутрішню умову
             */
            if (!block) {
                if (e.deltaY > 0) {
                    if (currentElem == container.children.length - 1) return;
                    v -= heightPage;
                    container.style.top = v + "px";
                    panle.children[currentElem - 1].classList.remove("panle-side__section_mode");
                    currentElem++;
                    panle.children[currentElem - 1].classList.add("panle-side__section_mode");
                } else {
                    if (currentElem == 1) return;
                    v += heightPage;
                    container.style.top = v + "px";
                    panle.children[currentElem - 1].classList.remove("panle-side__section_mode");
                    currentElem--;
                    panle.children[currentElem - 1].classList.add("panle-side__section_mode");
                }

                block = true;
                setTimeout(() => {
                    block = false;
                }, 900)
            }

        }

    }

    /**
     * Функція для встановлення висоти елементам
     */
    function setHeightElem() {
        for (let i = 0; i < container.children.length; i++) {
            let b = container.children[i];
            if (!b.hasAttribute("data-height")) continue;

            b.style.height = heightPage + "px";
        }
    }
    /**
     * Функція для створення бокової панелі
     */
    function createPanleSide() {
        panle.className = "panle-side";
        for (let i = 0; i < container.children.length; i++) {
            let c = document.createElement("div");
            let f = document.createElement("span");
            c.className = "panle-side__section";
            f.textContent = container.children[i].getAttribute("data-height");
            c.setAttribute("data-index", i);
            f.classList = "panle-side__info";
            c.appendChild(f);
            panle.appendChild(c);
        }
        container.insertBefore(panle, container.firstElementChild);
        panle.children[currentElem - 1].classList.add("panle-side__section_mode");
    }
    /**
     * Функція для gallery
     */
    function galleryBigImg(e) {
        if (widthPage < 700) return;

        let target = e.target;
        if (target.tagName != "IMG") return;

        containerBigImg.style.display = "flex";
        let elemChild = containerBigImg.firstElementChild;
        let createImg = document.createElement("img");
        createImg.src = target.src;
        createImg.alt = target.alt;
        elemChild.appendChild(createImg);
    }

    /*function loadImgOnScroll() {
        let allImg = document.getElementsByTagName("img");
        let colImgLoad = []
        for (let i = 0; i < allImg.length; i++) {
            if (!allImg[i].hasAttribute("data-load")) continue;
            colImgLoad.push(allImg[i]);
        
        loadImg()
        function loadImg(e) {
            for (let i = 0; i < colImgLoad.length; i++) {
                let img = colImgLoad[i];
                let coordsTop = img.getBoundingClientRect().top
                if (coordsTop - 500 < heightPage && coordsTop + 500 > 0) {
                    img.src = img.getAttribute("data-load");
                    colImgLoad.splice(i, 1);
                    i--;
                }
            }
        };
    }*/

})();