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

        // Apply theme
        document.documentElement.setAttribute(
            "data-theme",
            theme
        );

        // Accessibility
        themeToggle.setAttribute(
            "aria-pressed",
            String(theme === "dark")
        );

        // Change icon
        themeToggle.innerHTML =
            theme === "dark"
                ? '<i data-lucide="sun"></i>'
                : '<i data-lucide="moon"></i>';

        // Render Lucide icon
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


document.addEventListener("DOMContentLoaded", () => {

    initBlogFilters();
    initBlogSearch();
    initBlogReset();
    initNewsletterForm();

});


/* =========================================================
   BLOG FILTER
========================================================= */

function initBlogFilters() {

    const filterButtons =
        document.querySelectorAll(".blog-filter");

    const blogCards =
        document.querySelectorAll(".blog-card");

    if (!filterButtons.length || !blogCards.length) {
        return;
    }

    filterButtons.forEach(button => {

        button.addEventListener("click", () => {

            const category =
                button.dataset.category;

            filterButtons.forEach(item => {
                item.classList.remove("active");
            });

            button.classList.add("active");

            filterBlogCards(category);

        });

    });

}


function filterBlogCards(category) {

    const blogCards =
        document.querySelectorAll(".blog-card");

    const searchInput =
        document.getElementById("blogSearch");

    const searchTerm =
        searchInput
            ? searchInput.value.trim().toLowerCase()
            : "";

    let visibleCount = 0;

    blogCards.forEach(card => {

        const cardCategory =
            card.dataset.category || "";

        const title =
            card.dataset.title ||
            card.querySelector("h3")?.textContent ||
            "";

        const matchesCategory =
            category === "all" ||
            cardCategory === category;

        const matchesSearch =
            title.toLowerCase().includes(searchTerm);

        const shouldShow =
            matchesCategory && matchesSearch;

        card.classList.toggle(
            "is-hidden",
            !shouldShow
        );

        if (shouldShow) {
            visibleCount++;
        }

    });

    updateBlogEmptyState(visibleCount);

}


/* =========================================================
   BLOG SEARCH
========================================================= */

function initBlogSearch() {

    const searchInput =
        document.getElementById("blogSearch");

    if (!searchInput) {
        return;
    }

    searchInput.addEventListener(
        "input",
        debounce(() => {

            const activeFilter =
                document.querySelector(
                    ".blog-filter.active"
                );

            const category =
                activeFilter?.dataset.category || "all";

            filterBlogCards(category);

        }, 250)
    );

}


/* =========================================================
   EMPTY STATE
========================================================= */

function updateBlogEmptyState(count) {

    const emptyState =
        document.getElementById("blogEmpty");

    if (!emptyState) {
        return;
    }

    emptyState.hidden = count !== 0;

}


/* =========================================================
   RESET
========================================================= */

function initBlogReset() {

    const resetButton =
        document.getElementById("resetBlog");

    if (!resetButton) {
        return;
    }

    resetButton.addEventListener("click", () => {

        const searchInput =
            document.getElementById("blogSearch");

        if (searchInput) {
            searchInput.value = "";
        }

        document
            .querySelectorAll(".blog-filter")
            .forEach(button => {

                button.classList.remove("active");

            });

        const allButton =
            document.querySelector(
                '.blog-filter[data-category="all"]'
            );

        allButton?.classList.add("active");

        filterBlogCards("all");

    });

}


/* =========================================================
   NEWSLETTER
========================================================= */

function initNewsletterForm() {

    const form =
        document.getElementById("newsletterForm");

    const emailInput =
        document.getElementById("newsletterEmail");

    const message =
        document.getElementById("newsletterMessage");

    if (!form || !emailInput || !message) {
        return;
    }

    form.addEventListener("submit", event => {

        event.preventDefault();

        const email =
            emailInput.value.trim();

        if (!email) {

            message.textContent =
                "Please enter your email address.";

            return;
        }

        if (!isValidEmail(email)) {

            message.textContent =
                "Please enter a valid email address.";

            return;
        }

        message.textContent =
            "Thanks for subscribing to SkillForge!";

        form.reset();

    });

}


/* =========================================================
   EMAIL VALIDATION
========================================================= */

function isValidEmail(email) {

    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

}


/* =========================================================
   DEBOUNCE
========================================================= */

function debounce(callback, delay = 250) {

    let timer;

    return (...args) => {

        clearTimeout(timer);

        timer = setTimeout(() => {
            callback(...args);
        }, delay);

    };

}

/* =========================================================
   BLOG DETAIL PAGE JS
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    initArticleTOC();
    initSmoothScroll();
    initShareButtons();
    initNewsletter();
    initArticleParams();

    if (typeof lucide !== "undefined") {
        lucide.createIcons();
    }

});


/* =========================================================
   TABLE OF CONTENTS
========================================================= */

function initArticleTOC() {

    const tocLinks = document.querySelectorAll(".toc a");

    if (!tocLinks.length) return;

    const sections = [];

    tocLinks.forEach(link => {

        const targetId = link.getAttribute("href");

        if (!targetId || !targetId.startsWith("#")) return;

        const section = document.querySelector(targetId);

        if (section) {
            sections.push({
                section,
                link
            });
        }

    });


    if (!sections.length) return;


    const updateActiveLink = () => {

        let currentSection = sections[0];

        sections.forEach(item => {

            const top = item.section.getBoundingClientRect().top;

            if (top <= 160) {
                currentSection = item;
            }

        });


        tocLinks.forEach(link => {
            link.classList.remove("active");
        });

        if (currentSection) {
            currentSection.link.classList.add("active");
        }

    };


    window.addEventListener(
        "scroll",
        updateActiveLink,
        { passive: true }
    );

    updateActiveLink();

}


/* =========================================================
   SMOOTH SCROLL
========================================================= */

function initSmoothScroll() {

    const tocLinks = document.querySelectorAll(".toc a");

    tocLinks.forEach(link => {

        link.addEventListener("click", event => {

            const targetId = link.getAttribute("href");

            if (!targetId || !targetId.startsWith("#")) {
                return;
            }

            const target = document.querySelector(targetId);

            if (!target) return;

            event.preventDefault();

            const headerOffset = 110;

            const targetPosition =
                target.getBoundingClientRect().top +
                window.scrollY -
                headerOffset;

            window.scrollTo({
                top: targetPosition,
                behavior: "smooth"
            });

            history.replaceState(
                null,
                "",
                targetId
            );

        });

    });

}


/* =========================================================
   SHARE BUTTONS
========================================================= */

function initShareButtons() {

    const shareButtons =
        document.querySelectorAll("[data-share]");

    shareButtons.forEach(button => {

        button.addEventListener("click", async () => {

            const type = button.dataset.share;

            const articleTitle =
                document.title;

            const articleUrl =
                window.location.href;


            /* Native Share */

            if (
                type === "native" &&
                navigator.share
            ) {

                try {

                    await navigator.share({
                        title: articleTitle,
                        text:
                            "Check out this article from SkillForge.",
                        url: articleUrl
                    });

                } catch (error) {

                    /*
                     User cancelled the share dialog.
                     No action required.
                    */

                }

                return;
            }


            /* Copy URL */

            if (type === "copy") {

                await copyArticleURL(articleUrl);

            }

        });

    });

}


/* =========================================================
   COPY ARTICLE URL
========================================================= */

async function copyArticleURL(url) {

    try {

        await navigator.clipboard.writeText(url);

        showBlogToast(
            "Article link copied!"
        );

    } catch (error) {

        /*
         Fallback for browsers where
         Clipboard API is unavailable.
        */

        const tempInput =
            document.createElement("input");

        tempInput.value = url;

        document.body.appendChild(tempInput);

        tempInput.select();

        document.execCommand("copy");

        tempInput.remove();

        showBlogToast(
            "Article link copied!"
        );

    }

}


/* =========================================================
   NEWSLETTER
========================================================= */

function initNewsletter() {

    const form =
        document.getElementById(
            "sidebarNewsletterForm"
        );

    const emailInput =
        document.getElementById(
            "sidebarEmail"
        );

    const message =
        document.getElementById(
            "newsletterMessage"
        );


    if (!form || !emailInput || !message) {
        return;
    }


    form.addEventListener("submit", event => {

        event.preventDefault();

        const email =
            emailInput.value.trim();


        if (!email) {

            showNewsletterMessage(
                "Please enter your email address.",
                "error"
            );

            return;
        }


        const emailPattern =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


        if (!emailPattern.test(email)) {

            showNewsletterMessage(
                "Please enter a valid email address.",
                "error"
            );

            return;
        }


        /*
         Frontend-only demo.
         Real project-la backend/API connect pannalaam.
        */

        showNewsletterMessage(
            "Subscribed successfully!",
            "success"
        );

        form.reset();

    });

}


/* =========================================================
   NEWSLETTER MESSAGE
========================================================= */

function showNewsletterMessage(
    text,
    type
) {

    const message =
        document.getElementById(
            "newsletterMessage"
        );

    if (!message) return;

    message.textContent = text;

    message.className = type;

}


/* =========================================================
   TOAST
========================================================= */

function showBlogToast(message) {

    const toast =
        document.getElementById("blogToast");

    if (!toast) return;

    toast.textContent = message;

    toast.classList.add("show");


    clearTimeout(
        window.blogToastTimer
    );


    window.blogToastTimer =
        setTimeout(() => {

            toast.classList.remove("show");

        }, 2500);

}


/* =========================================================
   URL PARAMETERS
========================================================= */

function initArticleParams() {

    const params =
        new URLSearchParams(
            window.location.search
        );

    const post =
        params.get("post");


    if (!post) return;


    /*
      Later you can use this section
      to dynamically load different
      blog articles.

      Example:

      ?post=excel
      ?post=tally
      ?post=ms-office
      ?post=typing
    */

    console.log(
        "Current blog post:",
        post
    );

}



/* =========================================================
   COURSE DETAIL PAGE JS
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    initCourseData();
    initCurriculum();
    initCourseFAQ();
    initWishlist();
    initPreview();
    initEnrollment();
    initCourseSearch();

    if (typeof lucide !== "undefined") {
        lucide.createIcons();
    }

});


/* =========================================================
   COURSE DATA
========================================================= */

const courseData = {

    "basic-computing": {
        title: "Basic Computing & Digital Skills",
        category: "Computer Fundamentals",
        description:
            "Build strong computer fundamentals and practical digital skills for everyday and office work.",
        overview:
            "Learn the essential computer concepts, file management, internet basics and digital workflows required for everyday computer usage.",
        image: "../assets/images/basicComputing.jpg",
        rating: "4.8",
        reviews: "156 reviews",
        students: "650+ students",
        duration: "6 Weeks",
        level: "Beginner",
        lessons: "24 Lessons",
        price: "₹2,999",
        oldPrice: "₹4,999",
        discount: "40% off",
        learning: [
            "Understand computer fundamentals",
            "Identify common hardware and software",
            "Manage files and folders",
            "Use internet and email effectively",
            "Improve everyday digital skills",
            "Complete practical computer exercises"
        ]
    },


    "typing": {
        title: "Typing Speed & Accuracy",
        category: "Typing Skills",
        description:
            "Improve typing speed, accuracy and keyboard confidence through structured daily practice.",
        overview:
            "Develop touch-typing skills, improve finger placement, reduce typing errors and track your WPM and accuracy through practical tests.",
        image: "../assets/images/videoframe_2867.png",
        rating: "4.9",
        reviews: "184 reviews",
        students: "800+ students",
        duration: "4 Weeks",
        level: "Beginner",
        lessons: "20 Lessons",
        price: "₹1,999",
        oldPrice: "₹3,499",
        discount: "43% off",
        learning: [
            "Learn proper finger placement",
            "Improve typing accuracy",
            "Increase words per minute",
            "Reduce common typing mistakes",
            "Practise touch typing",
            "Track typing performance"
        ]
    },


    "tally": {
        title: "Tally Prime",
        category: "Accounting Software",
        description:
            "Learn practical Tally Prime workflows used for accounting and common office tasks.",
        overview:
            "Understand Tally Prime fundamentals, company creation, ledgers, vouchers, GST basics and practical accounting workflows.",
        image: "../assets/images/tally.jpg",
        rating: "4.8",
        reviews: "132 reviews",
        students: "520+ students",
        duration: "8 Weeks",
        level: "Beginner",
        lessons: "32 Lessons",
        price: "₹3,999",
        oldPrice: "₹5,999",
        discount: "33% off",
        learning: [
            "Create and configure a company",
            "Create ledgers and groups",
            "Record accounting vouchers",
            "Understand GST basics",
            "Generate useful reports",
            "Complete practical accounting exercises"
        ]
    },


    "ms-office": {
        title: "MS Office Essentials",
        category: "MS Office",
        description:
            "Learn practical Word, Excel and PowerPoint skills for office and academic work.",
        overview:
            "Build confidence using Microsoft Word, Excel and PowerPoint through practical tasks and real-world examples.",
        image: "../assets/images/msoffice.jpg",
        rating: "4.8",
        reviews: "201 reviews",
        students: "900+ students",
        duration: "8 Weeks",
        level: "Beginner",
        lessons: "30 Lessons",
        price: "₹3,499",
        oldPrice: "₹5,499",
        discount: "36% off",
        learning: [
            "Create professional Word documents",
            "Format documents efficiently",
            "Work with Excel spreadsheets",
            "Create useful PowerPoint presentations",
            "Use common productivity features",
            "Complete office-based projects"
        ]
    },


    "excel": {
        title: "Advanced Excel",
        category: "Excel & Data Skills",
        description:
            "Develop practical Excel skills including formulas, functions, data handling and reporting.",
        overview:
            "Learn practical Excel techniques that can be applied to office administration, reporting and data-related tasks.",
        image: "../assets/images/advExcel.jpg",
        rating: "4.9",
        reviews: "174 reviews",
        students: "720+ students",
        duration: "6 Weeks",
        level: "Intermediate",
        lessons: "26 Lessons",
        price: "₹3,499",
        oldPrice: "₹5,499",
        discount: "36% off",
        learning: [
            "Use advanced Excel formulas",
            "Work with lookup functions",
            "Clean and organize data",
            "Create useful reports",
            "Build charts and summaries",
            "Complete practical Excel projects"
        ]
    }

};


/* =========================================================
   GET CURRENT COURSE
========================================================= */

function getCurrentCourse() {

    const params =
        new URLSearchParams(
            window.location.search
        );

    const courseKey =
        params.get("course") || "basic-computing";

    return {
        key: courseKey,
        data:
            courseData[courseKey] ||
            courseData["basic-computing"]
    };

}


/* =========================================================
   LOAD COURSE DATA
========================================================= */

function initCourseData() {

    const current =
        getCurrentCourse();

    const course =
        current.data;


    setText(
        "courseTitle",
        course.title
    );

    setText(
        "breadcrumbCourse",
        course.title
    );

    setText(
        "courseCategory",
        course.category
    );

    setText(
        "courseDescription",
        course.description
    );

    setText(
        "overviewText",
        course.overview
    );

    setText(
        "courseRating",
        course.rating
    );

    setText(
        "courseReviews",
        course.reviews
    );

    setText(
        "courseStudents",
        course.students
    );

    setText(
        "courseDuration",
        course.duration
    );

    setText(
        "courseLevel",
        course.level
    );

    setText(
        "courseLessons",
        course.lessons
    );

    setText(
        "curriculumLessons",
        course.lessons
    );

    setText(
        "curriculumDuration",
        course.duration
    );

    setText(
        "coursePrice",
        course.price
    );

    setText(
        "courseOldPrice",
        course.oldPrice
    );

    setText(
        "courseDiscount",
        course.discount
    );


    const image =
        document.getElementById("courseImage");

    if (image) {

        image.src = course.image;

        image.alt =
            `${course.title} course`;

    }


    updateLearningOutcomes(
        course.learning
    );


    document.title =
        `${course.title} | SkillForge`;

}


/* =========================================================
   SET TEXT HELPER
========================================================= */

function setText(
    id,
    value
) {

    const element =
        document.getElementById(id);

    if (element) {
        element.textContent = value;
    }

}


/* =========================================================
   LEARNING OUTCOMES
========================================================= */

function updateLearningOutcomes(
    items
) {

    const container =
        document.getElementById(
            "learningGrid"
        );

    if (!container || !items) return;


    container.innerHTML =
        items.map(item => {

            return `
                <div class="learning-item">

                    <i data-lucide="check-circle-2"></i>

                    <span>
                        ${item}
                    </span>

                </div>
            `;

        }).join("");


    if (typeof lucide !== "undefined") {
        lucide.createIcons();
    }

}


/* =========================================================
   CURRICULUM ACCORDION
========================================================= */

function initCurriculum() {

    const moduleButtons =
        document.querySelectorAll(
            ".module-header"
        );


    moduleButtons.forEach(button => {

        button.addEventListener(
            "click",
            () => {

                const isExpanded =
                    button.getAttribute(
                        "aria-expanded"
                    ) === "true";


                /*
                 Close all modules.
                */

                moduleButtons.forEach(
                    otherButton => {

                        otherButton.setAttribute(
                            "aria-expanded",
                            "false"
                        );

                    }
                );


                /*
                 Open clicked module
                 if it was previously closed.
                */

                if (!isExpanded) {

                    button.setAttribute(
                        "aria-expanded",
                        "true"
                    );

                }

            }
        );

    });

}


/* =========================================================
   COURSE FAQ
========================================================= */

function initCourseFAQ() {

    const questions =
        document.querySelectorAll(
            ".course-faq-question"
        );


    questions.forEach(question => {

        question.addEventListener(
            "click",
            () => {

                const currentState =
                    question.getAttribute(
                        "aria-expanded"
                    ) === "true";


                questions.forEach(
                    otherQuestion => {

                        otherQuestion.setAttribute(
                            "aria-expanded",
                            "false"
                        );

                    }
                );


                if (!currentState) {

                    question.setAttribute(
                        "aria-expanded",
                        "true"
                    );

                }

            }
        );

    });

}


/* =========================================================
   WISHLIST
========================================================= */

function initWishlist() {

    const button =
        document.getElementById(
            "wishlistButton"
        );

    if (!button) return;


    const current =
        getCurrentCourse();


    const storageKey =
        `skillforge-wishlist-${current.key}`;


    const saved =
        localStorage.getItem(
            storageKey
        ) === "true";


    updateWishlistUI(
        button,
        saved
    );


    button.addEventListener(
        "click",
        () => {

            const active =
                button.classList.contains(
                    "active"
                );

            const newState =
                !active;


            localStorage.setItem(
                storageKey,
                String(newState)
            );


            updateWishlistUI(
                button,
                newState
            );


            showCourseToast(
                newState
                    ? "Course added to wishlist."
                    : "Course removed from wishlist."
            );

        }
    );

}


/* =========================================================
   WISHLIST UI
========================================================= */

function updateWishlistUI(
    button,
    active
) {

    button.classList.toggle(
        "active",
        active
    );

    button.setAttribute(
        "aria-pressed",
        String(active)
    );


    const text =
        button.querySelector("span");

    if (text) {

        text.textContent =
            active
                ? "Added to Wishlist"
                : "Add to Wishlist";

    }

}


/* =========================================================
   COURSE PREVIEW
========================================================= */

function initPreview() {

    const button =
        document.getElementById(
            "previewPlayButton"
        );

    if (!button) return;


    button.addEventListener(
        "click",
        () => {

            showCourseToast(
                "Course preview will be available soon."
            );

        }
    );

}


/* =========================================================
   ENROLLMENT
========================================================= */

function initEnrollment() {

    const button =
        document.getElementById(
            "enrollButton"
        );

    if (!button) return;


    button.addEventListener(
        "click",
        () => {

            const current =
                getCurrentCourse();


            /*
             Save selected course
             before moving to signup.
            */

            localStorage.setItem(
                "skillforge-selected-course",
                current.key
            );

        }
    );

}


/* =========================================================
   HEADER COURSE SEARCH
========================================================= */

function initCourseSearch() {

    const searchInput =
        document.querySelector(
            ".header-search input"
        );

    if (!searchInput) return;


    searchInput.addEventListener(
        "keydown",
        event => {

            if (
                event.key !== "Enter"
            ) {
                return;
            }


            const query =
                searchInput.value.trim();


            if (!query) return;


            window.location.href =
                `courses.html?search=${encodeURIComponent(query)}`;

        }
    );

}


/* =========================================================
   TOAST
========================================================= */

function showCourseToast(
    message
) {

    const toast =
        document.getElementById(
            "courseToast"
        );

    if (!toast) return;


    toast.textContent =
        message;


    toast.classList.add(
        "show"
    );


    clearTimeout(
        window.courseToastTimer
    );


    window.courseToastTimer =
        setTimeout(
            () => {

                toast.classList.remove(
                    "show"
                );

            },
            2500
        );

}



/* =========================================================
   CONTACT PAGE
========================================================= */

function initContactPage() {

    const contactForm =
        document.getElementById("contactForm");

    if (!contactForm) {
        return;
    }


    initContactForm();

    initContactFAQ();

    initMessageCounter();

    initLocationButton();

}


/* =========================================================
   CONTACT FORM
========================================================= */

function initContactForm() {

    const form =
        document.getElementById("contactForm");

    const name =
        document.getElementById("contactName");

    const email =
        document.getElementById("contactEmail");

    const phone =
        document.getElementById("contactPhone");

    const subject =
        document.getElementById("contactSubject");

    const message =
        document.getElementById("contactMessage");

    const consent =
        document.getElementById("contactConsent");

    const submitButton =
        document.getElementById("contactSubmit");


    form.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();


            clearContactErrors();


            const isValid =
                validateContactForm();


            if (!isValid) {
                return;
            }


            submitButton.disabled = true;


            const buttonText =
                submitButton.querySelector("span");


            if (buttonText) {
                buttonText.textContent =
                    "Sending...";
            }


            /*
             * Demo submission.
             *
             * Backend இல்லாததால் இப்போது
             * localStorage-ல் message save செய்கிறோம்.
             */

            const contactMessage = {

                id: Date.now(),

                name:
                    name.value.trim(),

                email:
                    email.value.trim(),

                phone:
                    phone.value.trim(),

                subject:
                    subject.value,

                message:
                    message.value.trim(),

                createdAt:
                    new Date().toISOString()

            };


            saveContactMessage(
                contactMessage
            );


            setTimeout(
                function () {

                    form.reset();

                    updateMessageCounter();

                    submitButton.disabled =
                        false;


                    if (buttonText) {

                        buttonText.textContent =
                            "Send Message";

                    }


                    showContactToast(
                        "Your message has been sent successfully."
                    );

                },
                700
            );

        }
    );

}


/* =========================================================
   VALIDATION
========================================================= */

function validateContactForm() {

    const name =
        document.getElementById("contactName");

    const email =
        document.getElementById("contactEmail");

    const phone =
        document.getElementById("contactPhone");

    const subject =
        document.getElementById("contactSubject");

    const message =
        document.getElementById("contactMessage");

    const consent =
        document.getElementById("contactConsent");


    let valid = true;


    /* -------------------------
       Name
    ------------------------- */

    if (
        name.value.trim().length < 2
    ) {

        showContactError(
            "nameError",
            "Please enter your name."
        );

        valid = false;

    }


    /* -------------------------
       Email
    ------------------------- */

    const emailPattern =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


    if (
        !emailPattern.test(
            email.value.trim()
        )
    ) {

        showContactError(
            "emailError",
            "Please enter a valid email address."
        );

        valid = false;

    }


    /* -------------------------
       Phone
    ------------------------- */

    if (phone.value.trim()) {

        const phonePattern =
            /^[0-9+\-\s()]{8,15}$/;


        if (
            !phonePattern.test(
                phone.value.trim()
            )
        ) {

            showContactError(
                "phoneError",
                "Please enter a valid phone number."
            );

            valid = false;

        }

    }


    /* -------------------------
       Subject
    ------------------------- */

    if (!subject.value) {

        showContactError(
            "subjectError",
            "Please select a subject."
        );

        valid = false;

    }


    /* -------------------------
       Message
    ------------------------- */

    if (
        message.value.trim().length < 10
    ) {

        showContactError(
            "messageError",
            "Please enter at least 10 characters."
        );

        valid = false;

    }


    /* -------------------------
       Consent
    ------------------------- */

    if (!consent.checked) {

        showContactError(
            "consentError",
            "Please agree before submitting."
        );

        valid = false;

    }


    return valid;

}


/* =========================================================
   SHOW ERROR
========================================================= */

function showContactError(
    id,
    message
) {

    const error =
        document.getElementById(id);


    if (!error) {
        return;
    }


    error.textContent =
        message;


    const parent =
        error.closest(
            ".form-group"
        );


    if (parent) {

        parent.classList.add(
            "has-error"
        );

    }

}


/* =========================================================
   CLEAR ERRORS
========================================================= */

function clearContactErrors() {

    const errors =
        document.querySelectorAll(
            "#contactForm .form-error"
        );


    errors.forEach(
        error => {

            error.textContent =
                "";

        }
    );


    const groups =
        document.querySelectorAll(
            "#contactForm .form-group"
        );


    groups.forEach(
        group => {

            group.classList.remove(
                "has-error"
            );

        }
    );

}


/* =========================================================
   MESSAGE COUNTER
========================================================= */

function initMessageCounter() {

    const message =
        document.getElementById(
            "contactMessage"
        );


    if (!message) {
        return;
    }


    message.addEventListener(
        "input",
        updateMessageCounter
    );


    updateMessageCounter();

}


function updateMessageCounter() {

    const message =
        document.getElementById(
            "contactMessage"
        );

    const counter =
        document.getElementById(
            "messageCount"
        );


    if (!message || !counter) {
        return;
    }


    counter.textContent =
        `${message.value.length} / 500`;

}


/* =========================================================
   SAVE CONTACT MESSAGE
========================================================= */

function saveContactMessage(
    contactMessage
) {

    const storageKey =
        "skillforge-contact-messages";


    const existingMessages =
        JSON.parse(
            localStorage.getItem(
                storageKey
            )
        ) || [];


    existingMessages.push(
        contactMessage
    );


    localStorage.setItem(
        storageKey,
        JSON.stringify(
            existingMessages
        )
    );

}


/* =========================================================
   CONTACT FAQ
========================================================= */

function initContactFAQ() {

    const questions =
        document.querySelectorAll(
            ".contact-faq-question"
        );


    questions.forEach(
        question => {

            question.addEventListener(
                "click",
                function () {

                    const currentState =
                        this.getAttribute(
                            "aria-expanded"
                        ) === "true";


                    /*
                     * Close all FAQ items
                     */

                    questions.forEach(
                        otherQuestion => {

                            otherQuestion.setAttribute(
                                "aria-expanded",
                                "false"
                            );

                        }
                    );


                    /*
                     * Open clicked item
                     */

                    if (!currentState) {

                        this.setAttribute(
                            "aria-expanded",
                            "true"
                        );

                    }

                }
            );

        }
    );

}


/* =========================================================
   LOCATION BUTTON
========================================================= */

function initLocationButton() {

    const button =
        document.getElementById(
            "viewLocationBtn"
        );

    const location =
        document.getElementById(
            "location"
        );


    if (!button || !location) {
        return;
    }


    button.addEventListener(
        "click",
        function (event) {

            event.preventDefault();


            location.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });

        }
    );

}


/* =========================================================
   CONTACT TOAST
========================================================= */

function showContactToast(
    message
) {

    const toast =
        document.getElementById(
            "contactToast"
        );


    if (!toast) {
        return;
    }


    toast.textContent =
        message;


    toast.classList.add(
        "show"
    );


    clearTimeout(
        window.contactToastTimer
    );


    window.contactToastTimer =
        setTimeout(
            function () {

                toast.classList.remove(
                    "show"
                );

            },
            3000
        );

}


/* =========================================================
   INITIALIZE CONTACT PAGE
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        initContactPage();

    }
);


/* =========================================================
   SKILLFORGE SIGNUP
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    const signupForm = document.getElementById("signupForm");

    if (!signupForm) return;


    /* =====================================================
       ELEMENTS
    ====================================================== */

    const fullName = document.getElementById("fullName");
    const email = document.getElementById("email");
    const phone = document.getElementById("phone");
    const course = document.getElementById("course");
    const password = document.getElementById("password");
    const confirmPassword =
        document.getElementById("confirmPassword");

    const terms = document.getElementById("terms");

    const signupMessage =
        document.getElementById("signupMessage");

    const signupSubmit =
        document.getElementById("signupSubmit");


    /* =====================================================
       ERROR ELEMENTS
    ====================================================== */

    const errors = {

        fullName:
            document.getElementById("fullNameError"),

        email:
            document.getElementById("emailError"),

        phone:
            document.getElementById("phoneError"),

        course:
            document.getElementById("courseError"),

        password:
            document.getElementById("passwordError"),

        confirmPassword:
            document.getElementById("confirmPasswordError"),

        terms:
            document.getElementById("termsError")

    };


    /* =====================================================
       LOCAL STORAGE
    ====================================================== */

    const USERS_KEY = "skillforgeUsers";


    function getUsers() {

        try {

            return JSON.parse(
                localStorage.getItem(USERS_KEY)
            ) || [];

        } catch (error) {

            return [];

        }

    }


    function saveUsers(users) {

        localStorage.setItem(
            USERS_KEY,
            JSON.stringify(users)
        );

    }


    /* =====================================================
       HELPER FUNCTIONS
    ====================================================== */

    function setError(field, message) {

        const errorElement = errors[field];

        if (errorElement) {
            errorElement.textContent = message;
        }

        const inputElement =
            document.getElementById(
                field === "terms"
                    ? "terms"
                    : field
            );

        if (inputElement) {

            const group =
                inputElement.closest(
                    ".form-group, .terms-group"
                );

            if (group) {
                group.classList.add("has-error");
                group.classList.remove("has-success");
            }

        }

    }


    function clearError(field) {

        const errorElement = errors[field];

        if (errorElement) {
            errorElement.textContent = "";
        }

        const inputElement =
            document.getElementById(
                field === "terms"
                    ? "terms"
                    : field
            );

        if (inputElement) {

            const group =
                inputElement.closest(
                    ".form-group, .terms-group"
                );

            if (group) {
                group.classList.remove("has-error");
            }

        }

    }


    function setSuccess(field) {

        const inputElement =
            document.getElementById(field);

        if (!inputElement) return;

        const group =
            inputElement.closest(".form-group");

        if (group) {

            group.classList.remove("has-error");
            group.classList.add("has-success");

        }

    }


    function showMessage(message, type) {

        signupMessage.textContent = message;

        signupMessage.className =
            `signup-message show ${type}`;

    }


    function clearMessage() {

        signupMessage.textContent = "";

        signupMessage.className =
            "signup-message";

    }


    /* =====================================================
       VALIDATION
    ====================================================== */

    function validateName() {

        const value =
            fullName.value.trim();

        clearError("fullName");

        if (!value) {

            setError(
                "fullName",
                "Please enter your full name."
            );

            return false;

        }

        if (value.length < 3) {

            setError(
                "fullName",
                "Name must contain at least 3 characters."
            );

            return false;

        }

        setSuccess("fullName");

        return true;

    }


    function validateEmail() {

        const value =
            email.value.trim().toLowerCase();

        clearError("email");

        const emailPattern =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!value) {

            setError(
                "email",
                "Please enter your email address."
            );

            return false;

        }

        if (!emailPattern.test(value)) {

            setError(
                "email",
                "Please enter a valid email address."
            );

            return false;

        }

        setSuccess("email");

        return true;

    }


    function validatePhone() {

        const value =
            phone.value.trim();

        clearError("phone");

        const phonePattern =
            /^[6-9]\d{9}$/;

        if (!value) {

            setError(
                "phone",
                "Please enter your phone number."
            );

            return false;

        }

        if (!phonePattern.test(value)) {

            setError(
                "phone",
                "Enter a valid 10-digit Indian mobile number."
            );

            return false;

        }

        setSuccess("phone");

        return true;

    }


    function validateCourse() {

        const value = course.value;

        clearError("course");

        if (!value) {

            setError(
                "course",
                "Please select a course."
            );

            return false;

        }

        setSuccess("course");

        return true;

    }


    function validatePassword() {

        const value =
            password.value;

        clearError("password");

        if (!value) {

            setError(
                "password",
                "Please create a password."
            );

            return false;

        }

        if (value.length < 8) {

            setError(
                "password",
                "Password must contain at least 8 characters."
            );

            return false;

        }

        setSuccess("password");

        return true;

    }


    function validateConfirmPassword() {

        const value =
            confirmPassword.value;

        clearError("confirmPassword");

        if (!value) {

            setError(
                "confirmPassword",
                "Please confirm your password."
            );

            return false;

        }

        if (value !== password.value) {

            setError(
                "confirmPassword",
                "Passwords do not match."
            );

            return false;

        }

        setSuccess("confirmPassword");

        return true;

    }


    function validateTerms() {

        clearError("terms");

        if (!terms.checked) {

            setError(
                "terms",
                "Please accept the Terms & Conditions."
            );

            return false;

        }

        return true;

    }


    /* =====================================================
       PASSWORD SHOW / HIDE
    ====================================================== */

    const passwordToggles =
        document.querySelectorAll(
            ".password-toggle"
        );


    passwordToggles.forEach(button => {

        button.addEventListener(
            "click",
            () => {

                const targetId =
                    button.dataset.target;

                const input =
                    document.getElementById(
                        targetId
                    );

                const icon =
                    button.querySelector("i");


                if (input.type === "password") {

                    input.type = "text";

                    button.setAttribute(
                        "aria-label",
                        "Hide password"
                    );

                    icon.setAttribute(
                        "data-lucide",
                        "eye-off"
                    );

                } else {

                    input.type = "password";

                    button.setAttribute(
                        "aria-label",
                        "Show password"
                    );

                    icon.setAttribute(
                        "data-lucide",
                        "eye"
                    );

                }


                if (window.lucide) {
                    lucide.createIcons();
                }

            }
        );

    });


    /* =====================================================
       PHONE INPUT
    ====================================================== */

    phone.addEventListener(
        "input",
        () => {

            phone.value =
                phone.value.replace(/\D/g, "");

            if (phone.value.length > 10) {

                phone.value =
                    phone.value.substring(0, 10);

            }

        }
    );


    /* =====================================================
       REAL-TIME VALIDATION
    ====================================================== */

    fullName.addEventListener(
        "blur",
        validateName
    );

    email.addEventListener(
        "blur",
        validateEmail
    );

    phone.addEventListener(
        "blur",
        validatePhone
    );

    course.addEventListener(
        "change",
        validateCourse
    );

    password.addEventListener(
        "blur",
        validatePassword
    );

    confirmPassword.addEventListener(
        "blur",
        validateConfirmPassword
    );


    /* =====================================================
       FORM SUBMIT
    ====================================================== */

    signupForm.addEventListener(
        "submit",
        event => {

            event.preventDefault();

            clearMessage();


            const isNameValid =
                validateName();

            const isEmailValid =
                validateEmail();

            const isPhoneValid =
                validatePhone();

            const isCourseValid =
                validateCourse();

            const isPasswordValid =
                validatePassword();

            const isConfirmPasswordValid =
                validateConfirmPassword();

            const isTermsValid =
                validateTerms();


            const isFormValid =
                isNameValid &&
                isEmailValid &&
                isPhoneValid &&
                isCourseValid &&
                isPasswordValid &&
                isConfirmPasswordValid &&
                isTermsValid;


            if (!isFormValid) {

                showMessage(
                    "Please correct the highlighted fields.",
                    "error"
                );

                return;

            }


            /* =============================================
               CHECK EXISTING USER
            ============================================== */

            const users =
                getUsers();

            const emailValue =
                email.value.trim().toLowerCase();


            const existingUser =
                users.find(
                    user =>
                        user.email === emailValue
                );


            if (existingUser) {

                setError(
                    "email",
                    "An account with this email already exists."
                );

                showMessage(
                    "This email is already registered. Please login instead.",
                    "error"
                );

                return;

            }


            /* =============================================
               CREATE USER
            ============================================== */

            const newUser = {

                id:
                    Date.now(),

                fullName:
                    fullName.value.trim(),

                email:
                    emailValue,

                phone:
                    phone.value.trim(),

                course:
                    course.value,

                password:
                    password.value,

                createdAt:
                    new Date().toISOString()

            };


            users.push(newUser);

            saveUsers(users);


            /* =============================================
               SUCCESS
            ============================================== */

            signupSubmit.disabled = true;

            signupSubmit.querySelector(
                "span"
            ).textContent =
                "Account Created";


            showMessage(
                "Your SkillForge account has been created successfully. Redirecting to login...",
                "success"
            );


            signupForm.reset();


            /* =============================================
               REDIRECT
            ============================================== */

            setTimeout(
                () => {

                    window.location.href =
                        "login.html";

                },
                1800
            );

        }
    );


});


/* =========================================
   SKILLFORGE LOGIN
========================================= */

/* =====================================================
   SKILLFORGE LOGIN JS
===================================================== */


document.addEventListener("DOMContentLoaded", () => {

    initLucide();

    initAdminDemo();

    initLogin();

    initPasswordToggle();

});



/* =====================================================
   LUCIDE
===================================================== */

function initLucide() {

    if (typeof lucide !== "undefined") {

        lucide.createIcons();

    }

}



/* =====================================================
   ADMIN DEMO
===================================================== */

function initAdminDemo() {

    const adminDemoBtn =
        document.getElementById("adminDemoBtn");

    const emailInput =
        document.getElementById("email");

    const passwordInput =
        document.getElementById("password");


    if (
        !adminDemoBtn ||
        !emailInput ||
        !passwordInput
    ) {

        return;

    }


    adminDemoBtn.addEventListener(
        "click",
        () => {


            /*
             * Demo Admin Credentials
             */

            emailInput.value =
                "admin@skillforge.com";

            passwordInput.value =
                "admin123";


            /*
             * Remove previous error
             */

            const message =
                document.getElementById(
                    "loginMessage"
                );

            if (message) {

                message.textContent = "";

                message.className =
                    "login-message";

            }


            /*
             * Focus Login Button
             */

            document
                .querySelector(".login-btn")
                ?.focus();


        }
    );

}



/* =====================================================
   LOGIN
===================================================== */

function initLogin() {

    const loginForm =
        document.getElementById("loginForm");


    if (!loginForm) return;


    loginForm.addEventListener(
        "submit",
        (event) => {

            event.preventDefault();


            const emailInput =
                document.getElementById("email");

            const passwordInput =
                document.getElementById("password");


            const email =
                emailInput.value.trim();

            const password =
                passwordInput.value;


            const message =
                document.getElementById(
                    "loginMessage"
                );


            /*
             * Demo Admin Credentials
             */

            const adminEmail =
                "admin@skillforge.com";

            const adminPassword =
                "admin123";


            /* ==============================
               ADMIN LOGIN
            ============================== */

            if (
                email === adminEmail &&
                password === adminPassword
            ) {


                /*
                 * Store logged-in user
                 */

                localStorage.setItem(
                    "skillforge-user",
                    JSON.stringify({
                        role: "admin",
                        email: adminEmail
                    })
                );


                /*
                 * Optional login timestamp
                 */

                localStorage.setItem(
                    "skillforge-login-time",
                    new Date().toISOString()
                );


                /*
                 * Success message
                 */

                if (message) {

                    message.textContent =
                        "Login successful! Redirecting...";

                    message.className =
                        "login-message success";

                }


                /*
                 * Redirect Admin
                 */

                setTimeout(() => {

                    window.location.href =
                        "admin/dashboard.html";

                }, 500);


                return;

            }


            /* ==============================
               INVALID LOGIN
            ============================== */

            if (message) {

                message.textContent =
                    "Invalid email or password.";

                message.className =
                    "login-message error";

            }


            passwordInput.focus();

        }
    );

}



/* =====================================================
   PASSWORD SHOW / HIDE
===================================================== */

function initPasswordToggle() {

    const toggleButton =
        document.getElementById(
            "togglePassword"
        );

    const passwordInput =
        document.getElementById(
            "password"
        );

    const passwordIcon =
        document.getElementById(
            "passwordIcon"
        );


    if (
        !toggleButton ||
        !passwordInput
    ) {

        return;

    }


    toggleButton.addEventListener(
        "click",
        () => {

            const isPassword =
                passwordInput.type === "password";


            passwordInput.type =
                isPassword
                    ? "text"
                    : "password";


            toggleButton.setAttribute(
                "aria-label",
                isPassword
                    ? "Hide password"
                    : "Show password"
            );


            if (passwordIcon) {

                passwordIcon.setAttribute(
                    "data-lucide",
                    isPassword
                        ? "eye-off"
                        : "eye"
                );

            }


            initLucide();

        }
    );

};

/* ==================================================
   BATCH FILTER
================================================== */

document.addEventListener("DOMContentLoaded", () => {

    const filterButtons =
        document.querySelectorAll(".batch-filter-btn");

    const batchCards =
        document.querySelectorAll(".batch-card");


    if (!filterButtons.length || !batchCards.length) {
        return;
    }


    filterButtons.forEach((button) => {

        button.addEventListener("click", () => {

            const selectedCategory =
                button.dataset.filter;


            /* Remove active */

            filterButtons.forEach((btn) => {

                btn.classList.remove("active");

            });


            /* Add active */

            button.classList.add("active");


            /* Filter cards */

            batchCards.forEach((card) => {

                const cardCategory =
                    card.dataset.category;


                if (
                    selectedCategory === "all" ||
                    cardCategory === selectedCategory
                ) {

                    card.classList.remove("hidden");

                } else {

                    card.classList.add("hidden");

                }

            });

        });

    });

});


/* ==================================================
   BATCH FILTER
================================================== */

document.addEventListener("DOMContentLoaded", () => {

    const filterButtons =
        document.querySelectorAll(".batch-filter-btn");

    const batchCards =
        document.querySelectorAll(".batch-card");


    if (!filterButtons.length || !batchCards.length) {
        return;
    }


    filterButtons.forEach((button) => {

        button.addEventListener("click", () => {

            const selectedCategory =
                button.dataset.filter;


            /* Remove active */

            filterButtons.forEach((btn) => {

                btn.classList.remove("active");

            });


            /* Add active */

            button.classList.add("active");


            /* Filter cards */

            batchCards.forEach((card) => {

                const cardCategory =
                    card.dataset.category;


                if (
                    selectedCategory === "all" ||
                    cardCategory === selectedCategory
                ) {

                    card.classList.remove("hidden");

                } else {

                    card.classList.add("hidden");

                }

            });

        });

    });

});



/* =========================================
   GLOBAL SEARCH
========================================= */

function initGlobalSearch() {

    const searchForm = document.querySelector(".search-form");
    const searchInput = document.getElementById("globalSearch");

    if (!searchForm || !searchInput) return;


    // Search data
    const searchItems = [

        {
            keywords: ["basic", "computing", "computer", "fundamentals"],
            url: "course-detail.html?course=basic-computing"
        },

        {
            keywords: ["ms office", "office", "word", "powerpoint"],
            url: "course-detail.html?course=ms-office"
        },

        {
            keywords: ["tally", "tally prime", "accounting", "gst"],
            url: "course-detail.html?course=tally-prime"
        },

        {
            keywords: ["excel", "advanced excel", "spreadsheet"],
            url: "course-detail.html?course=advanced-excel"
        },

        {
            keywords: ["typing", "typing skills", "speed", "accuracy"],
            url: "course-detail.html?course=typing"
        },

        {
            keywords: ["web", "web development", "html", "css", "javascript"],
            url: "course-detail.html?course=web-development"
        },

        {
            keywords: ["courses", "course"],
            url: "pages/courses.html"
        },

        {
            keywords: ["about", "about us"],
            url: "pages/about.html"
        },

        {
            keywords: ["blog", "blogs", "articles"],
            url: "pages/blog.html"
        },

        {
            keywords: ["contact", "contact us", "support"],
            url: "pages/contact.html"
        },

        {
            keywords: ["login", "sign in"],
            url: "pages/login.html"
        },

        {
            keywords: ["signup", "sign up", "register"],
            url: "pages/signup.html"
        },

        {
            keywords: ["typing test", "test typing"],
            url: "pages/typing-test.html"
        }

    ];


    searchForm.addEventListener("submit", event => {

        event.preventDefault();

        const searchTerm = searchInput.value
            .trim()
            .toLowerCase();

        // Empty search
        if (!searchTerm) {

            searchInput.focus();

            return;

        }


        // Find matching result
        const result = searchItems.find(item =>

            item.keywords.some(keyword =>
                keyword.includes(searchTerm) ||
                searchTerm.includes(keyword)
            )

        );


        // Navigate if result found
        if (result) {

            window.location.href = result.url;

        } else {

            alert(
                `No results found for "${searchInput.value.trim()}".`
            );

        }

    });

}



// ========================================
// SKILLFORGE CERTIFICATE JS
// ========================================

document.addEventListener("DOMContentLoaded", () => {

    // ----------------------------------------
    // Certificate Data
    // ----------------------------------------

    const certificateData = {
        studentName: "Vidhya M",
        courseName: "Full Stack Web Development",
        certificateId: "SF-2026-001",
        completionDate: "September 18, 2026"
    };


    // ----------------------------------------
    // Get Certificate Elements
    // ----------------------------------------

    const studentNameElement =
        document.getElementById("studentName");

    const courseNameElement =
        document.getElementById("courseName");

    const certificateIdElement =
        document.getElementById("certificateId");

    const completionDateElement =
        document.getElementById("completionDate");


    // ----------------------------------------
    // Display Certificate Data
    // ----------------------------------------

    if (studentNameElement) {
        studentNameElement.textContent =
            certificateData.studentName;
    }

    if (courseNameElement) {
        courseNameElement.textContent =
            certificateData.courseName;
    }

    if (certificateIdElement) {
        certificateIdElement.textContent =
            certificateData.certificateId;
    }

    if (completionDateElement) {
        completionDateElement.textContent =
            certificateData.completionDate;
    }


    // ----------------------------------------
    // Print Certificate
    // ----------------------------------------

    const printButton =
        document.getElementById("printCertificate");

    if (printButton) {

        printButton.addEventListener("click", () => {

            window.print();

        });

    }


    // ----------------------------------------
    // Download Certificate
    // ----------------------------------------

    const downloadButton =
        document.getElementById("downloadCertificate");

    if (downloadButton) {

        downloadButton.addEventListener("click", () => {

            alert(
                "In the print window, choose 'Save as PDF' to download your certificate."
            );

            window.print();

        });

    }


    // ----------------------------------------
    // Lucide Icons
    // ----------------------------------------

    if (typeof lucide !== "undefined") {

        lucide.createIcons();

    }

});




// =====================================================
// SKILLFORGE FACULTY PAGE
// =====================================================

document.addEventListener("DOMContentLoaded", () => {

    // -------------------------------------------------
    // Faculty Filter
    // -------------------------------------------------

    const filterButtons =
        document.querySelectorAll(".faculty-filter");

    const facultyCards =
        document.querySelectorAll(".faculty-card");


    filterButtons.forEach(button => {

        button.addEventListener("click", () => {

            const selectedCategory =
                button.dataset.filter;


            // Remove active from all buttons
            filterButtons.forEach(btn => {
                btn.classList.remove("active");
            });


            // Add active to clicked button
            button.classList.add("active");


            // Filter cards
            facultyCards.forEach(card => {

                const cardCategory =
                    card.dataset.category;


                if (
                    selectedCategory === "all" ||
                    cardCategory === selectedCategory
                ) {

                    card.classList.remove("hidden");

                } else {

                    card.classList.add("hidden");

                }

            });


            // Re-render Lucide icons
            if (typeof lucide !== "undefined") {
                lucide.createIcons();
            }

        });

    });


    // -------------------------------------------------
    // View Profile Buttons
    // -------------------------------------------------

    const profileButtons =
        document.querySelectorAll(".faculty-view-btn");


    profileButtons.forEach(button => {

        button.addEventListener("click", () => {

            const facultyName =
                button.dataset.name;

            alert(
                `${facultyName}'s profile page will be available soon.`
            );

        });

    });


    // -------------------------------------------------
    // Lucide Icons
    // -------------------------------------------------

    if (typeof lucide !== "undefined") {

        lucide.createIcons();

    }

});

document.addEventListener("DOMContentLoaded", () => {

    /* ============================
       SIDEBAR SMOOTH SCROLL
    ============================ */

    const menuLinks = document.querySelectorAll(".privacy-menu-link");

    menuLinks.forEach(link => {

        link.addEventListener("click", event => {

            event.preventDefault();

            const targetId = link.getAttribute("href");

            const targetSection = document.querySelector(targetId);

            if (targetSection) {

                targetSection.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });

            }

        });

    });


    /* ============================
       ACTIVE SECTION
    ============================ */

    const sections = document.querySelectorAll(".privacy-block");

    const observer = new IntersectionObserver(
        entries => {

            entries.forEach(entry => {

                if (entry.isIntersecting) {

                    const currentId = entry.target.id;

                    menuLinks.forEach(link => {

                        link.classList.remove("active");

                        if (
                            link.getAttribute("href") ===
                            `#${currentId}`
                        ) {
                            link.classList.add("active");
                        }

                    });

                }

            });

        },
        {
            rootMargin: "-120px 0px -60% 0px",
            threshold: 0
        }
    );


    sections.forEach(section => {
        observer.observe(section);
    });


    /* ============================
       LUCIDE ICONS
    ============================ */

    if (typeof lucide !== "undefined") {
        lucide.createIcons();
    }

});