document.addEventListener("DOMContentLoaded", () => {

    // Lucide icons
    if (typeof lucide !== "undefined") {
        lucide.createIcons();
    }

    // Theme
    initTheme();

    // RTL
    initRTL();

    // Mobile menu
    initMobileMenu();

    // Header scroll
    initHeaderScroll();

    // Scroll reveal
    initScrollReveal();

    // Counters
    initCounters();

    // FAQ
    initFAQ();

    // Back to top
    initBackToTop();

});


/* =========================================
   THEME
========================================= */

function initTheme() {

    const themeToggle = document.getElementById("themeToggle");
    const themeIcon = document.getElementById("themeIcon");

    if (!themeToggle) return;

    const savedTheme =
        localStorage.getItem("skillforge-theme");

    const systemDark =
        window.matchMedia &&
        window.matchMedia("(prefers-color-scheme: dark)").matches;

    const theme =
        savedTheme ||
        (systemDark ? "dark" : "light");

    applyTheme(theme);

    themeToggle.addEventListener("click", () => {

        const current =
            document.documentElement.getAttribute("data-theme");

        const next =
            current === "dark" ? "light" : "dark";

        applyTheme(next);

        localStorage.setItem(
            "skillforge-theme",
            next
        );

    });


    function applyTheme(theme) {

        document.documentElement.setAttribute(
            "data-theme",
            theme
        );

        themeToggle.setAttribute(
            "aria-pressed",
            String(theme === "dark")
        );

        if (themeIcon) {

            // Dark mode = show sun
            // Light mode = show moon
            themeIcon.setAttribute(
                "data-lucide",
                theme === "dark" ? "sun" : "moon"
            );

        }

        if (typeof lucide !== "undefined") {
            lucide.createIcons();
        }

    }

}


/* =========================================
   RTL
========================================= */

function initRTL() {

    const rtlToggle =
        document.getElementById("rtlToggle");

    if (!rtlToggle) return;

    const savedDirection =
        localStorage.getItem("skillforge-direction");

    const direction =
        savedDirection === "rtl"
            ? "rtl"
            : "ltr";

    applyDirection(direction);


    rtlToggle.addEventListener("click", () => {

        const current =
            document.documentElement.getAttribute("dir");

        const next =
            current === "rtl"
                ? "ltr"
                : "rtl";

        applyDirection(next);

        localStorage.setItem(
            "skillforge-direction",
            next
        );

    });


    function applyDirection(direction) {

        document.documentElement.setAttribute(
            "dir",
            direction
        );

        rtlToggle.setAttribute(
            "aria-pressed",
            String(direction === "rtl")
        );

    }

}


/* =========================================
   MOBILE MENU
========================================= */

function initMobileMenu() {

    const menuButton =
        document.getElementById("mobileMenuButton");

    const mobileNav =
        document.getElementById("mobileNav");

    if (!menuButton || !mobileNav) return;


    menuButton.addEventListener("click", () => {

        const isOpen =
            mobileNav.classList.toggle("open");

        menuButton.setAttribute(
            "aria-expanded",
            String(isOpen)
        );

        menuButton.innerHTML =
            `<i data-lucide="${isOpen ? "x" : "menu"}"></i>`;

        if (typeof lucide !== "undefined") {
            lucide.createIcons();
        }

    });


    const links =
        mobileNav.querySelectorAll("a");

    links.forEach(link => {

        link.addEventListener("click", () => {

            mobileNav.classList.remove("open");

            menuButton.setAttribute(
                "aria-expanded",
                "false"
            );

            menuButton.innerHTML =
                `<i data-lucide="menu"></i>`;

            if (typeof lucide !== "undefined") {
                lucide.createIcons();
            }

        });

    });

}


/* =========================================
   HEADER SCROLL
========================================= */

function initHeaderScroll() {

    const header =
        document.getElementById("siteHeader");

    if (!header) return;


    function updateHeader() {

        if (window.scrollY > 20) {

            header.classList.add("scrolled");

        } else {

            header.classList.remove("scrolled");

        }

    }


    window.addEventListener(
        "scroll",
        updateHeader,
        { passive: true }
    );

    updateHeader();

}


/* =========================================
   SCROLL REVEAL
========================================= */

function initScrollReveal() {

    const elements =
        document.querySelectorAll(".reveal");

    if (!elements.length) return;


    if (!("IntersectionObserver" in window)) {

        elements.forEach(element => {
            element.classList.add("active");
        });

        return;

    }


    const observer =
        new IntersectionObserver(
            entries => {

                entries.forEach(entry => {

                    if (entry.isIntersecting) {

                        entry.target.classList.add("active");

                        observer.unobserve(
                            entry.target
                        );

                    }

                });

            },
            {
                threshold: 0.1
            }
        );


    elements.forEach(element => {

        observer.observe(element);

    });

}


/* =========================================
   COUNTERS
========================================= */

function initCounters() {

    const counters =
        document.querySelectorAll(".counter");

    if (!counters.length) return;


    counters.forEach(counter => {

        counter.textContent = "0";

    });


    if (!("IntersectionObserver" in window)) {

        counters.forEach(counter => {

            counter.textContent =
                Number(counter.dataset.target)
                    .toLocaleString();

        });

        return;

    }


    const observer =
        new IntersectionObserver(
            entries => {

                entries.forEach(entry => {

                    if (!entry.isIntersecting) return;

                    animateCounter(
                        entry.target
                    );

                    observer.unobserve(
                        entry.target
                    );

                });

            },
            {
                threshold: 0.5
            }
        );


    counters.forEach(counter => {

        observer.observe(counter);

    });

}


function animateCounter(element) {

    const target =
        Number(element.dataset.target);

    const duration = 1500;

    const startTime =
        performance.now();


    function update(currentTime) {

        const elapsed =
            currentTime - startTime;

        const progress =
            Math.min(
                elapsed / duration,
                1
            );

        const eased =
            1 - Math.pow(
                1 - progress,
                3
            );

        const current =
            Math.floor(
                eased * target
            );


        element.textContent =
            current.toLocaleString();


        if (progress < 1) {

            requestAnimationFrame(update);

        } else {

            element.textContent =
                target.toLocaleString();

        }

    }


    requestAnimationFrame(update);

}


/* =========================================
   FAQ ACCORDION
========================================= */

function initFAQ() {

    const faqItems =
        document.querySelectorAll(".faq-item");

    if (!faqItems.length) return;

    faqItems.forEach(item => {

        const question =
            item.querySelector(".faq-question");

        const answer =
            item.querySelector(".faq-answer");

        if (!question || !answer) return;

        // Initial state
        item.classList.remove("open");

        question.setAttribute(
            "aria-expanded",
            "false"
        );

        question.addEventListener("click", () => {

            const isOpen =
                item.classList.contains("open");

            // Close all FAQ items
            faqItems.forEach(otherItem => {

                const otherQuestion =
                    otherItem.querySelector(".faq-question");

                otherItem.classList.remove("open");

                if (otherQuestion) {
                    otherQuestion.setAttribute(
                        "aria-expanded",
                        "false"
                    );
                }

            });

            // Open clicked FAQ
            if (!isOpen) {

                item.classList.add("open");

                question.setAttribute(
                    "aria-expanded",
                    "true"
                );

            }

        });

        // Keyboard accessibility
        question.addEventListener(
            "keydown",
            event => {

                if (
                    event.key === "Enter" ||
                    event.key === " "
                ) {
                    event.preventDefault();
                    question.click();
                }

            }
        );

    });

}


/* =========================================
   BACK TO TOP
========================================= */

function initBackToTop() {

    const button =
        document.getElementById("backToTop");

    if (!button) return;


    function updateBackToTop() {

        if (window.scrollY > 500) {

            button.classList.add("show");

        } else {

            button.classList.remove("show");

        }

    }


    window.addEventListener(
        "scroll",
        updateBackToTop,
        { passive: true }
    );


    button.addEventListener(
        "click",
        () => {

            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });

        }
    );


    updateBackToTop();

}



/* =========================================================
   SKILLFORGE COURSES PAGE
   Course-specific JavaScript only
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    initCourseSearch();
    initCourseFilters();
    initCourseWishlist();
    initCourseHeroLinks();
    initCourseURLSearch();

});


/* =========================================================
   COURSE SEARCH
========================================================= */

function initCourseSearch() {

    const searchInput = document.getElementById("courseSearch");
    const clearButton = document.getElementById("clearCourseSearch");

    if (!searchInput) return;

    searchInput.addEventListener("input", () => {

        updateCourseSearchState(searchInput);

        applyCourseFilters();

    });


    if (clearButton) {

        clearButton.addEventListener("click", () => {

            searchInput.value = "";

            updateCourseSearchState(searchInput);

            applyCourseFilters();

            searchInput.focus();

        });

    }

}


/* =========================================================
   SEARCH UI STATE
========================================================= */

function updateCourseSearchState(input) {

    const searchBox = input.closest(".course-search-box");

    if (!searchBox) return;

    if (input.value.trim()) {

        searchBox.classList.add("has-value");

    } else {

        searchBox.classList.remove("has-value");

    }

}


/* =========================================================
   COURSE FILTERS
========================================================= */

function initCourseFilters() {

    const filterButtons =
        document.querySelectorAll(".course-filter");

    if (!filterButtons.length) return;


    filterButtons.forEach(button => {

        button.addEventListener("click", () => {

            filterButtons.forEach(item => {

                item.classList.remove("active");

                item.setAttribute(
                    "aria-selected",
                    "false"
                );

            });


            button.classList.add("active");

            button.setAttribute(
                "aria-selected",
                "true"
            );


            applyCourseFilters();

        });

    });

}


/* =========================================================
   APPLY SEARCH + CATEGORY
========================================================= */

function applyCourseFilters() {

    const searchInput =
        document.getElementById("courseSearch");

    const courses =
        document.querySelectorAll(".course-card");

    const activeFilter =
        document.querySelector(".course-filter.active");

    const noResults =
        document.getElementById("coursesNoResults");

    const resultsInfo =
        document.getElementById("courseResultsInfo");


    if (!courses.length) return;


    const searchTerm =
        searchInput
            ? searchInput.value.trim().toLowerCase()
            : "";


    const selectedCategory =
        activeFilter
            ? activeFilter.dataset.filter
            : "all";


    let visibleCount = 0;


    courses.forEach(course => {

        const category =
            course.dataset.category || "";

        const title =
            course.dataset.title || "";

        const content =
            course.textContent || "";


        const searchableText =
            `${title} ${content}`.toLowerCase();


        const categoryMatches =
            selectedCategory === "all" ||
            category === selectedCategory;


        const searchMatches =
            !searchTerm ||
            searchableText.includes(searchTerm);


        const shouldShow =
            categoryMatches && searchMatches;


        if (shouldShow) {

            course.classList.remove("course-hidden");

            visibleCount++;

        } else {

            course.classList.add("course-hidden");

        }

    });


    updateCourseResultsText(
        visibleCount,
        selectedCategory,
        searchTerm
    );


    if (noResults) {

        noResults.hidden =
            visibleCount !== 0;

    }

}


/* =========================================================
   RESULTS TEXT
========================================================= */

function updateCourseResultsText(
    count,
    category,
    searchTerm
) {

    const resultsInfo =
        document.getElementById("courseResultsInfo");

    if (!resultsInfo) return;


    const categoryNames = {

        all: "all courses",

        computer: "computer basics courses",

        office: "office & Excel courses",

        accounting: "accounting courses",

        career: "career & digital courses"

    };


    let text =
        `Showing ${count} ${
            categoryNames[category] || "courses"
        }`;


    if (searchTerm) {

        text =
            `Showing ${count} course${
                count === 1 ? "" : "s"
            } matching "${searchTerm}"`;

    }


    resultsInfo.textContent = text;

}


/* =========================================================
   RESET COURSE FILTERS
========================================================= */

function initCourseReset() {

    const resetButton =
        document.getElementById("resetCourseFilters");

    if (!resetButton) return;


    resetButton.addEventListener("click", () => {

        const searchInput =
            document.getElementById("courseSearch");

        const filterButtons =
            document.querySelectorAll(".course-filter");


        if (searchInput) {

            searchInput.value = "";

            updateCourseSearchState(
                searchInput
            );

        }


        filterButtons.forEach(button => {

            const isAll =
                button.dataset.filter === "all";


            button.classList.toggle(
                "active",
                isAll
            );


            button.setAttribute(
                "aria-selected",
                String(isAll)
            );

        });


        applyCourseFilters();

        const catalog =
            document.getElementById("courseCatalog");

        if (catalog) {

            catalog.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });

        }

    });

}


/* =========================================================
   WISHLIST
========================================================= */

function initCourseWishlist() {

    const wishlistButtons =
        document.querySelectorAll(".course-wishlist");

    if (!wishlistButtons.length) return;


    let wishlist = getWishlist();


    wishlistButtons.forEach(button => {

        const card =
            button.closest(".course-card");

        if (!card) return;


        const title =
            card.dataset.title || "";


        const courseKey =
            createCourseKey(title);


        if (wishlist.includes(courseKey)) {

            setWishlistActive(
                button,
                true
            );

        }


        button.addEventListener("click", event => {

            event.preventDefault();
            event.stopPropagation();


            wishlist =
                getWishlist();


            const index =
                wishlist.indexOf(courseKey);


            if (index === -1) {

                wishlist.push(courseKey);

                setWishlistActive(
                    button,
                    true
                );

            } else {

                wishlist.splice(index, 1);

                setWishlistActive(
                    button,
                    false
                );

            }


            saveWishlist(wishlist);

        });

    });

}


/* =========================================================
   WISHLIST UI
========================================================= */

function setWishlistActive(
    button,
    active
) {

    button.classList.toggle(
        "active",
        active
    );


    const icon =
        button.querySelector("i");

    if (!icon) return;


    if (active) {

        icon.classList.remove(
            "fa-regular"
        );

        icon.classList.add(
            "fa-solid"
        );

        button.setAttribute(
            "aria-label",
            "Remove course from wishlist"
        );

        button.setAttribute(
            "title",
            "Remove from wishlist"
        );

    } else {

        icon.classList.remove(
            "fa-solid"
        );

        icon.classList.add(
            "fa-regular"
        );

        button.setAttribute(
            "aria-label",
            "Add course to wishlist"
        );

        button.setAttribute(
            "title",
            "Add to wishlist"
        );

    }

}


/* =========================================================
   WISHLIST STORAGE
========================================================= */

function getWishlist() {

    try {

        const saved =
            localStorage.getItem(
                "skillforge-wishlist"
            );


        return saved
            ? JSON.parse(saved)
            : [];

    } catch {

        return [];

    }

}


function saveWishlist(wishlist) {

    try {

        localStorage.setItem(
            "skillforge-wishlist",
            JSON.stringify(wishlist)
        );

    } catch {

        // Storage may be unavailable.
    }

}


function createCourseKey(title) {

    return title
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");

}


/* =========================================================
   HERO LINKS
========================================================= */

function initCourseHeroLinks() {

    const links =
        document.querySelectorAll(
            'a[href="#courseCatalog"]'
        );


    links.forEach(link => {

        link.addEventListener("click", event => {

            const target =
                document.getElementById(
                    "courseCatalog"
                );


            if (!target) return;


            event.preventDefault();


            target.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });

        });

    });

}


/* =========================================================
   URL SEARCH
   Example:
   courses.html?search=excel
========================================================= */

function initCourseURLSearch() {

    const params =
        new URLSearchParams(
            window.location.search
        );


    const searchTerm =
        params.get("search");


    if (!searchTerm) {

        initCourseReset();

        return;

    }


    const searchInput =
        document.getElementById(
            "courseSearch"
        );


    if (!searchInput) return;


    searchInput.value =
        searchTerm;


    updateCourseSearchState(
        searchInput
    );


    applyCourseFilters();


    initCourseReset();


    const catalog =
        document.getElementById(
            "courseCatalog"
        );


    if (catalog) {

        setTimeout(() => {

            catalog.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });

        }, 150);

    }

}


/* =========================================================
   INITIAL RESET HANDLER
========================================================= */
document.addEventListener("DOMContentLoaded", () => {

    initCourseSearch();
    initCourseFilters();
    initCourseWishlist();
    initCourseHeroLinks();
    initCourseReset();
    initCourseURLSearch();

});






/* =========================================================
   SKILLFORGE - TYPING TEST
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    initTypingTest();

});


function initTypingTest() {

    const setupCard = document.getElementById("typingSetup");
    const testCard = document.getElementById("typingTestCard");
    const resultCard = document.getElementById("typingResult");

    if (!setupCard || !testCard || !resultCard) {
        return;
    }


    /* =====================================================
       ELEMENTS
    ===================================================== */

    const startButton =
        document.getElementById("startTestButton");

    const pauseButton =
        document.getElementById("pauseTestButton");

    const resetButton =
        document.getElementById("resetTestButton");

    const tryAgainButton =
        document.getElementById("tryAgainButton");

    const typingText =
        document.getElementById("typingText");

    const typingInput =
        document.getElementById("typingInput");

    const timerElement =
        document.getElementById("timer");

    const liveWpm =
        document.getElementById("liveWpm");

    const liveAccuracy =
        document.getElementById("liveAccuracy");

    const liveErrors =
        document.getElementById("liveErrors");

    const progressBar =
        document.getElementById("typingProgressBar");

    const progressText =
        document.getElementById("typingProgressText");

    const typingProgressText =
        document.getElementById("typingProgressText");

    const testStatus =
        document.getElementById("testStatus");

    const wordCount =
        document.getElementById("wordCount");

    const resultWpm =
        document.getElementById("resultWpm");

    const resultAccuracy =
        document.getElementById("resultAccuracy");

    const resultCorrect =
        document.getElementById("resultCorrect");

    const resultErrors =
        document.getElementById("resultErrors");

    const resultMessage =
        document.getElementById("resultMessage");

    const bestScore =
        document.getElementById("bestScore");


    /* =====================================================
       STATE
    ===================================================== */

    let selectedDuration = 60;

    let selectedDifficulty = "easy";

    let currentText = "";

    let timer = null;

    let timeRemaining = selectedDuration;

    let elapsedSeconds = 0;

    let testStarted = false;

    let testPaused = false;

    let testFinished = false;


    /* =====================================================
       SAMPLE TEXT
    ===================================================== */

    const texts = {

        easy: [
            "Learning computer skills can make everyday work easier and more productive. Practice typing regularly and focus on accuracy before trying to type faster.",

            "Technology is an important part of modern life. Learning basic computer skills helps students and professionals work with more confidence.",

            "Practice makes progress. Spend a few minutes every day improving your typing speed and accuracy. Small improvements can create better results over time."
        ],

        medium: [
            "Modern workplaces require people to communicate clearly, manage information efficiently and use digital tools with confidence. Developing practical computer skills can improve productivity.",

            "Typing accurately is more important than typing quickly. When you build strong muscle memory and learn proper finger placement, your speed will gradually improve.",

            "Learning new technology requires patience and consistent practice. Instead of trying to memorize everything at once, understand each concept and apply it through practical exercises."
        ],

        hard: [
            "Successful professionals continuously improve their technical knowledge, communication skills and ability to solve problems. Consistent practice helps transform theoretical knowledge into practical expertise.",

            "Digital transformation has changed the way organizations communicate, collaborate and manage information. Employees who understand modern technology can adapt more effectively to changing workplace requirements.",

            "Efficient typing requires coordination between your eyes, brain and fingers. Maintaining accuracy while gradually increasing speed allows you to develop reliable typing habits without depending heavily on the keyboard."
        ]

    };


    /* =====================================================
       DURATION OPTIONS
    ===================================================== */

    const durationOptions =
        document.querySelectorAll(".test-option");


    durationOptions.forEach(option => {

        option.addEventListener("click", () => {

            durationOptions.forEach(item => {
                item.classList.remove("active");
            });

            option.classList.add("active");

            selectedDuration =
                Number(option.dataset.duration);

            updateTimerDisplay(selectedDuration);

        });

    });


    /* =====================================================
       DIFFICULTY OPTIONS
    ===================================================== */

    const difficultyOptions =
        document.querySelectorAll(".difficulty-option");


    difficultyOptions.forEach(option => {

        option.addEventListener("click", () => {

            difficultyOptions.forEach(item => {
                item.classList.remove("active");
            });

            option.classList.add("active");

            selectedDifficulty =
                option.dataset.difficulty;

        });

    });


    /* =====================================================
       START TEST
    ===================================================== */

    startButton.addEventListener("click", () => {

        startNewTest();

    });


    /* =====================================================
       PAUSE TEST
    ===================================================== */

    pauseButton.addEventListener("click", () => {

        if (testFinished) {
            return;
        }

        if (!testStarted) {
            return;
        }

        if (testPaused) {

            resumeTest();

        } else {

            pauseTest();

        }

    });


    /* =====================================================
       RESET TEST
    ===================================================== */

    resetButton.addEventListener("click", () => {

        resetTest();

    });


    /* =====================================================
       TRY AGAIN
    ===================================================== */

    tryAgainButton.addEventListener("click", () => {

        startNewTest();

    });


    /* =====================================================
       INPUT EVENT
    ===================================================== */

    typingInput.addEventListener("input", () => {

        if (testFinished || testPaused) {
            return;
        }


        /*
         * First character starts the timer.
         */

        if (!testStarted) {

            beginTimer();

        }


        updateTypingDisplay();

        updateLiveStats();

        updateProgress();

        checkCompletion();

    });


    /* =====================================================
       START NEW TEST
    ===================================================== */

    function startNewTest() {

        clearInterval(timer);

        testStarted = false;
        testPaused = false;
        testFinished = false;

        elapsedSeconds = 0;

        timeRemaining = selectedDuration;


        currentText =
            getRandomText(selectedDifficulty);


        typingText.innerHTML =
            createTypingCharacters(currentText);


        typingInput.value = "";

        typingInput.disabled = false;


        setupCard.hidden = true;

        resultCard.hidden = true;

        testCard.hidden = false;


        updateTimerDisplay(timeRemaining);

        updateLiveStats();

        updateProgress();


        testStatus.textContent = "Ready";

        pauseButton.innerHTML =
            '<i class="fa-solid fa-pause"></i>';

        pauseButton.setAttribute(
            "aria-label",
            "Pause test"
        );


        wordCount.textContent =
            `${currentText.trim().split(/\s+/).length} words`;


        setTimeout(() => {

            typingInput.focus();

        }, 100);

    }


    /* =====================================================
       GET RANDOM TEXT
    ===================================================== */

    function getRandomText(difficulty) {

        const list = texts[difficulty] || texts.easy;

        const randomIndex =
            Math.floor(Math.random() * list.length);

        return list[randomIndex];

    }


    /* =====================================================
       CREATE TEXT CHARACTERS
    ===================================================== */

    function createTypingCharacters(text) {

        return [...text]
            .map((character, index) => {

                const safeCharacter =
                    escapeHtml(character);

                return `
                    <span data-index="${index}">
                        ${safeCharacter}
                    </span>
                `;

            })
            .join("");

    }


    /* =====================================================
       ESCAPE HTML
    ===================================================== */

    function escapeHtml(value) {

        return value
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");

    }


    /* =====================================================
       BEGIN TIMER
    ===================================================== */

    function beginTimer() {

        if (testStarted || testPaused || testFinished) {
            return;
        }

        testStarted = true;

        testStatus.textContent = "Typing...";

        timer = setInterval(() => {

            elapsedSeconds++;

            timeRemaining--;

            updateTimerDisplay(timeRemaining);

            updateLiveStats();

            if (timeRemaining <= 0) {

                finishTest();

            }

        }, 1000);

    }


    /* =====================================================
       PAUSE
    ===================================================== */

    function pauseTest() {

        if (!testStarted || testFinished) {
            return;
        }

        clearInterval(timer);

        testPaused = true;

        typingInput.disabled = true;

        testStatus.textContent = "Paused";

        pauseButton.innerHTML =
            '<i class="fa-solid fa-play"></i>';

        pauseButton.setAttribute(
            "aria-label",
            "Resume test"
        );

    }


    /* =====================================================
       RESUME
    ===================================================== */

    function resumeTest() {

        if (!testPaused || testFinished) {
            return;
        }

        testPaused = false;

        typingInput.disabled = false;

        testStatus.textContent = "Typing...";

        pauseButton.innerHTML =
            '<i class="fa-solid fa-pause"></i>';

        pauseButton.setAttribute(
            "aria-label",
            "Pause test"
        );


        timer = setInterval(() => {

            elapsedSeconds++;

            timeRemaining--;

            updateTimerDisplay(timeRemaining);

            updateLiveStats();

            if (timeRemaining <= 0) {

                finishTest();

            }

        }, 1000);


        typingInput.focus();

    }


    /* =====================================================
       UPDATE TIMER
    ===================================================== */

    function updateTimerDisplay(seconds) {

        const safeSeconds =
            Math.max(0, seconds);

        const minutes =
            Math.floor(safeSeconds / 60);

        const remainingSeconds =
            safeSeconds % 60;

        timerElement.textContent =
            `${String(minutes).padStart(2, "0")}:${String(remainingSeconds).padStart(2, "0")}`;

    }


    /* =====================================================
       UPDATE TYPING DISPLAY
    ===================================================== */

    function updateTypingDisplay() {

        const typedText =
            typingInput.value;

        const characters =
            typingText.querySelectorAll("span");


        characters.forEach((character, index) => {

            character.classList.remove(
                "correct",
                "incorrect",
                "current"
            );


            if (index < typedText.length) {

                if (
                    typedText[index] ===
                    currentText[index]
                ) {

                    character.classList.add("correct");

                } else {

                    character.classList.add("incorrect");

                }

            }


            if (index === typedText.length) {

                character.classList.add("current");

            }

        });

    }


    /* =====================================================
       CALCULATE STATS
    ===================================================== */

    function calculateStats() {

        const typedText =
            typingInput.value;

        let correctCharacters = 0;

        let incorrectCharacters = 0;


        for (
            let index = 0;
            index < typedText.length;
            index++
        ) {

            if (
                typedText[index] ===
                currentText[index]
            ) {

                correctCharacters++;

            } else {

                incorrectCharacters++;

            }

        }


        const totalTyped =
            typedText.length;


        const accuracy =
            totalTyped > 0
                ? Math.round(
                    (correctCharacters / totalTyped) * 100
                )
                : 100;


        const minutes =
            Math.max(elapsedSeconds / 60, 1 / 60);


        const wpm =
            Math.round(
                (correctCharacters / 5) / minutes
            );


        return {
            correctCharacters,
            incorrectCharacters,
            accuracy,
            wpm,
            totalTyped
        };

    }


    /* =====================================================
       LIVE STATS
    ===================================================== */

    function updateLiveStats() {

        const stats =
            calculateStats();


        liveWpm.textContent =
            stats.wpm;


        liveAccuracy.textContent =
            `${stats.accuracy}%`;


        liveErrors.textContent =
            stats.incorrectCharacters;

    }


    /* =====================================================
       PROGRESS
    ===================================================== */

    function updateProgress() {

        if (!currentText) {
            return;
        }


        const typedLength =
            typingInput.value.length;


        const percentage =
            Math.min(
                100,
                Math.round(
                    (typedLength / currentText.length) * 100
                )
            );


        progressBar.style.width =
            `${percentage}%`;


        progressText.textContent =
            `${percentage}%`;


        if (typingProgressText) {

            typingProgressText.textContent =
                `${percentage}%`;

        }

    }


    /* =====================================================
       COMPLETION
    ===================================================== */

    function checkCompletion() {

        if (!currentText) {
            return;
        }


        if (
            typingInput.value.length >=
            currentText.length
        ) {

            finishTest();

        }

    }


    /* =====================================================
       FINISH TEST
    ===================================================== */

    function finishTest() {

        if (testFinished) {
            return;
        }


        testFinished = true;

        clearInterval(timer);


        const stats =
            calculateStats();


        typingInput.disabled = true;


        testStatus.textContent =
            "Completed";


        resultWpm.textContent =
            stats.wpm;


        resultAccuracy.textContent =
            `${stats.accuracy}%`;


        resultCorrect.textContent =
            stats.correctCharacters;


        resultErrors.textContent =
            stats.incorrectCharacters;


        resultMessage.textContent =
            getResultMessage(
                stats.wpm,
                stats.accuracy
            );


        saveBestScore(stats.wpm);

        displayBestScore();


        testCard.hidden = true;

        resultCard.hidden = false;


        resultCard.scrollIntoView({
            behavior: "smooth",
            block: "center"
        });

    }


    /* =====================================================
       RESULT MESSAGE
    ===================================================== */

    function getResultMessage(wpm, accuracy) {

        if (accuracy >= 95 && wpm >= 50) {

            return "Excellent! You have great typing speed and accuracy.";

        }


        if (accuracy >= 90 && wpm >= 35) {

            return "Great work! Keep practicing to become even faster.";

        }


        if (accuracy >= 85) {

            return "Good progress! Focus on accuracy and your speed will improve.";

        }


        return "Keep practicing. Accuracy should come first, then speed will follow.";

    }


    /* =====================================================
       BEST SCORE
    ===================================================== */

    function saveBestScore(score) {

        const storageKey =
            `skillforge-best-wpm-${selectedDifficulty}`;


        const oldScore =
            Number(
                localStorage.getItem(storageKey)
            ) || 0;


        if (score > oldScore) {

            localStorage.setItem(
                storageKey,
                String(score)
            );

        }

    }


    function displayBestScore() {

        const storageKey =
            `skillforge-best-wpm-${selectedDifficulty}`;


        const score =
            Number(
                localStorage.getItem(storageKey)
            ) || 0;


        bestScore.textContent =
            `${score} WPM`;

    }


    /* =====================================================
       RESET TEST
    ===================================================== */

    function resetTest() {

        clearInterval(timer);


        testStarted = false;
        testPaused = false;
        testFinished = false;


        elapsedSeconds = 0;

        timeRemaining =
            selectedDuration;


        typingInput.value = "";

        typingInput.disabled = true;

        typingText.innerHTML = "";


        testCard.hidden = true;

        resultCard.hidden = true;

        setupCard.hidden = false;


        updateTimerDisplay(
            selectedDuration
        );


        liveWpm.textContent = "0";

        liveAccuracy.textContent = "100%";

        liveErrors.textContent = "0";


        progressBar.style.width = "0%";

        progressText.textContent = "0%";


        testStatus.textContent = "Ready";

    }


    /* =====================================================
       INITIAL TIMER
    ===================================================== */

    updateTimerDisplay(selectedDuration);

};