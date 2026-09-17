/* =========================================================
   SKILLFORGE STUDENT DASHBOARD JS
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* -----------------------------------------------------
       INITIALIZE
    ----------------------------------------------------- */

    initIcons();
    initStudentData();
    initNavigation();
    initSidebar();
    initTheme();
    initLogout();
    initSearch();
    initQuickActions();
    initNotifications();
    initProfile();
    initSupport();
    initClassButtons();
    initActivityRange();

});


/* =========================================================
   1. LUCIDE ICONS
========================================================= */

function initIcons() {

    if (typeof lucide !== "undefined") {

        lucide.createIcons();

    } else {

        console.warn("Lucide library not loaded.");

    }

}


/* =========================================================
   2. STUDENT DATA
========================================================= */

function initStudentData() {

    const storedUser =
        localStorage.getItem("skillforge-user");

    if (!storedUser) {
        return;
    }

    try {

        const user =
            JSON.parse(storedUser);

        /*
         * Only use student data here.
         * Admin users should not be treated as students.
         */

        if (user.role && user.role !== "student") {
            return;
        }

        const name =
            user.name || "Student";

        const firstName =
            name.split(" ")[0];

        const email =
            user.email || "student@skillforge.com";


        /* Sidebar */

        const sidebarName =
            document.getElementById(
                "sidebarStudentName"
            );

        if (sidebarName) {
            sidebarName.textContent = name;
        }


        /* Header */

        const headerName =
            document.getElementById(
                "headerStudentName"
            );

        if (headerName) {
            headerName.textContent = name;
        }


        /* Welcome */

        const welcomeName =
            document.getElementById(
                "welcomeStudentName"
            );

        if (welcomeName) {
            welcomeName.textContent = firstName;
        }


        /* Profile */

        const profileName =
            document.getElementById(
                "profileStudentName"
            );

        if (profileName) {
            profileName.textContent = name;
        }


        /*
         * Optional email update
         */

        const profileEmail =
            document.querySelector(
                ".profile-placeholder p"
            );

        if (profileEmail) {
            profileEmail.textContent = email;
        }


        /* Avatar initials */

        const initials =
            getInitials(name);

        document
            .querySelectorAll(
                ".student-avatar, .header-avatar, .large-avatar"
            )
            .forEach(avatar => {

                avatar.textContent = initials;

            });


    } catch (error) {

        console.error(
            "Invalid student data:",
            error
        );

    }

}


/* =========================================================
   3. GET INITIALS
========================================================= */

function getInitials(name) {

    if (!name) {
        return "ST";
    }

    const words =
        name.trim().split(/\s+/);

    if (words.length === 1) {

        return words[0]
            .substring(0, 2)
            .toUpperCase();

    }

    return (
        words[0][0] +
        words[words.length - 1][0]
    ).toUpperCase();

}


/* =========================================================
   4. NAVIGATION
========================================================= */

function initNavigation() {

    const navLinks =
        document.querySelectorAll(
            ".student-nav-link"
        );

    const sections =
        document.querySelectorAll(
            ".student-section"
        );

    const pageTitle =
        document.getElementById("pageTitle");

    const pageSubtitle =
        document.getElementById("pageSubtitle");


    const subtitles = {

        dashboard:
            "Welcome back! Here's your learning overview.",

        courses:
            "Track and continue all your enrolled courses.",

        classes:
            "View your upcoming and completed classes.",

        typing:
            "Improve your typing speed and accuracy.",

        progress:
            "Monitor your learning performance.",

        certificates:
            "View and download your earned certificates.",

        payments:
            "View your payment history and invoices.",

        notifications:
            "Stay updated with SkillForge announcements.",

        profile:
            "Manage your personal information."

    };


    function showSection(sectionId) {

        const targetSection =
            document.getElementById(sectionId);

        if (!targetSection) {
            return;
        }


        /* Hide all */

        sections.forEach(section => {

            section.classList.remove("active");

        });


        /* Show target */

        targetSection.classList.add("active");


        /* Active nav */

        navLinks.forEach(link => {

            const linkSection =
                link.dataset.section;

            link.classList.toggle(
                "active",
                linkSection === sectionId
            );

        });


        /* Page title */

        const activeLink =
            document.querySelector(
                `.student-nav-link[data-section="${sectionId}"]`
            );

        if (
            pageTitle &&
            activeLink
        ) {

            pageTitle.textContent =
                activeLink.dataset.title ||
                "Dashboard";

        }


        /* Subtitle */

        if (pageSubtitle) {

            pageSubtitle.textContent =
                subtitles[sectionId] ||
                "Continue your learning journey.";

        }


        /* Close mobile sidebar */

        closeSidebar();


        /* Scroll top */

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    }


    /* Nav click */

    navLinks.forEach(link => {

        link.addEventListener(
            "click",
            event => {

                event.preventDefault();

                const sectionId =
                    link.dataset.section;

                if (!sectionId) {
                    return;
                }

                showSection(sectionId);

                /*
                 * Update URL hash
                 */

                history.replaceState(
                    null,
                    "",
                    `#${sectionId}`
                );

            }
        );

    });


    /*
     * Dashboard buttons
     */

    document
        .querySelectorAll(
            "[data-action]"
        )
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    const sectionId =
                        button.dataset.action;

                    if (!sectionId) {
                        return;
                    }

                    showSection(sectionId);

                    history.replaceState(
                        null,
                        "",
                        `#${sectionId}`
                    );

                }
            );

        });


    /*
     * Load section from URL
     */

    const hash =
        window.location.hash
            .replace("#", "");

    if (
        hash &&
        document.getElementById(hash)
    ) {

        showSection(hash);

    } else {

        showSection("dashboard");

    }


    /*
     * Browser back / forward
     */

    window.addEventListener(
        "hashchange",
        () => {

            const newHash =
                window.location.hash
                    .replace("#", "");

            if (
                newHash &&
                document.getElementById(newHash)
            ) {

                showSection(newHash);

            }

        }
    );

}


/* =========================================================
   5. SIDEBAR
========================================================= */

function initSidebar() {

    const sidebar =
        document.getElementById(
            "studentSidebar"
        );

    const overlay =
        document.getElementById(
            "sidebarOverlay"
        );

    const menuButton =
        document.getElementById(
            "mobileMenuBtn"
        );

    const closeButton =
        document.getElementById(
            "sidebarClose"
        );


    if (!sidebar) {
        return;
    }


    function openSidebar() {

        sidebar.classList.add("open");

        if (overlay) {
            overlay.classList.add("active");
        }

        document.body.style.overflow =
            "hidden";

    }


    function closeSidebar() {

        sidebar.classList.remove("open");

        if (overlay) {
            overlay.classList.remove("active");
        }

        document.body.style.overflow =
            "";

    }


    if (menuButton) {

        menuButton.addEventListener(
            "click",
            openSidebar
        );

    }


    if (closeButton) {

        closeButton.addEventListener(
            "click",
            closeSidebar
        );

    }


    if (overlay) {

        overlay.addEventListener(
            "click",
            closeSidebar
        );

    }


    /*
     * ESC closes sidebar
     */

    document.addEventListener(
        "keydown",
        event => {

            if (
                event.key === "Escape" &&
                sidebar.classList.contains("open")
            ) {

                closeSidebar();

            }

        }
    );


    /*
     * Close when resizing to desktop
     */

    window.addEventListener(
        "resize",
        () => {

            if (window.innerWidth > 850) {

                closeSidebar();

            }

        }
    );

}


/* =========================================================
   6. GLOBAL SIDEBAR CLOSE HELPER
========================================================= */

function closeSidebar() {

    const sidebar =
        document.getElementById(
            "studentSidebar"
        );

    const overlay =
        document.getElementById(
            "sidebarOverlay"
        );

    if (sidebar) {

        sidebar.classList.remove("open");

    }

    if (overlay) {

        overlay.classList.remove("active");

    }

    document.body.style.overflow = "";

}


/* =========================================================
   7. DARK / LIGHT MODE
========================================================= */

function initTheme() {

    const themeToggle =
        document.getElementById(
            "themeToggle"
        );

    const themeIcon =
        document.getElementById(
            "themeIcon"
        );

    if (!themeToggle) {
        return;
    }


    const savedTheme =
        localStorage.getItem(
            "skillforge-student-theme"
        );


    /*
     * Existing saved theme
     */

    if (savedTheme === "dark") {

        document.body.classList.add("dark");

    } else {

        document.body.classList.remove("dark");

    }


    updateThemeIcon();


    themeToggle.addEventListener(
        "click",
        () => {

            document.body.classList.toggle(
                "dark"
            );

            const isDark =
                document.body.classList.contains(
                    "dark"
                );


            localStorage.setItem(
                "skillforge-student-theme",
                isDark
                    ? "dark"
                    : "light"
            );


            updateThemeIcon();

            showToast(
                isDark
                    ? "Dark mode enabled"
                    : "Light mode enabled"
            );

        }
    );


    function updateThemeIcon() {

        if (!themeIcon) {
            return;
        }

        const isDark =
            document.body.classList.contains(
                "dark"
            );

        themeIcon.setAttribute(
            "data-lucide",
            isDark
                ? "sun"
                : "moon"
        );

        if (
            typeof lucide !== "undefined"
        ) {

            lucide.createIcons();

        }

    }

}


/* =========================================================
   8. LOGOUT
========================================================= */

function initLogout() {

    const logoutButton =
        document.getElementById(
            "studentLogout"
        );

    if (!logoutButton) {
        return;
    }


    logoutButton.addEventListener(
        "click",
        () => {

            const confirmed =
                window.confirm(
                    "Are you sure you want to logout?"
                );

            if (!confirmed) {
                return;
            }


            /*
             * Remove login session
             */

            localStorage.removeItem(
                "skillforge-user"
            );

            localStorage.removeItem(
                "skillforge-login-time"
            );


            /*
             * Optional student-specific data
             */

            localStorage.removeItem(
                "skillforge-student-theme"
            );


            /*
             * Go back to login
             */

            window.location.replace(
                "login.html"
            );

        }
    );

}


/* =========================================================
   9. SEARCH
========================================================= */

function initSearch() {

    const searchInput =
        document.getElementById(
            "dashboardSearch"
        );

    if (!searchInput) {
        return;
    }


    /*
     * Ctrl + K
     */

    document.addEventListener(
        "keydown",
        event => {

            if (
                (event.ctrlKey || event.metaKey) &&
                event.key.toLowerCase() === "k"
            ) {

                event.preventDefault();

                searchInput.focus();

            }

        }
    );


    /*
     * Enter search
     */

    searchInput.addEventListener(
        "keydown",
        event => {

            if (
                event.key !== "Enter"
            ) {
                return;
            }


            const query =
                searchInput.value
                    .trim()
                    .toLowerCase();


            if (!query) {

                showToast(
                    "Please enter something to search."
                );

                return;

            }


            /*
             * Basic dashboard search
             */

            const searchableElements =
                document.querySelectorAll(
                    ".course-progress-item, .class-item, .achievement"
                );


            let found = false;


            searchableElements.forEach(
                element => {

                    const text =
                        element.textContent
                            .toLowerCase();

                    if (
                        text.includes(query)
                    ) {

                        element.scrollIntoView({
                            behavior: "smooth",
                            block: "center"
                        });

                        element.style.outline =
                            "2px solid var(--primary)";

                        setTimeout(
                            () => {

                                element.style.outline =
                                    "";

                            },
                            1800
                        );

                        found = true;

                    }

                }
            );


            if (found) {

                showToast(
                    `Found results for "${query}"`
                );

            } else {

                showToast(
                    `No results found for "${query}"`
                );

            }

        }
    );

}


/* =========================================================
   10. QUICK ACTIONS
========================================================= */

function initQuickActions() {

    const buttons =
        document.querySelectorAll(
            ".quick-actions button"
        );

    buttons.forEach(button => {

        button.addEventListener(
            "click",
            () => {

                const action =
                    button.dataset.action;


                if (action === "typing") {

                    showToast(
                        "Opening Typing Practice..."
                    );

                }

                else if (action === "courses") {

                    showToast(
                        "Opening My Courses..."
                    );

                }

                else if (action === "certificates") {

                    showToast(
                        "Opening Certificates..."
                    );

                }

                else if (action === "profile") {

                    showToast(
                        "Opening your profile..."
                    );

                }

            }
        );

    });

}


/* =========================================================
   11. NOTIFICATIONS
========================================================= */

function initNotifications() {

    const notificationButton =
        document.getElementById(
            "notificationBtn"
        );

    if (!notificationButton) {
        return;
    }


    notificationButton.addEventListener(
        "click",
        () => {

            showToast(
                "You have 3 new notifications."
            );

        }
    );

}


/* =========================================================
   12. PROFILE BUTTON
========================================================= */

function initProfile() {

    const profileButton =
        document.getElementById(
            "profileBtn"
        );

    if (!profileButton) {
        return;
    }


    profileButton.addEventListener(
        "click",
        () => {

            const profileNav =
                document.querySelector(
                    '.student-nav-link[data-section="profile"]'
                );

            if (profileNav) {

                profileNav.click();

            }

        }
    );

}


/* =========================================================
   13. SUPPORT BUTTON
========================================================= */

function initSupport() {

    const supportButton =
        document.getElementById(
            "supportBtn"
        );

    if (!supportButton) {
        return;
    }


    supportButton.addEventListener(
        "click",
        () => {

            showToast(
                "Support request opened."
            );

        }
    );

}


/* =========================================================
   14. CLASS JOIN BUTTONS
========================================================= */

function initClassButtons() {

    const joinButtons =
        document.querySelectorAll(
            ".join-btn"
        );

    joinButtons.forEach(button => {

        button.addEventListener(
            "click",
            () => {

                showToast(
                    "Class joining feature will be connected soon."
                );

            }
        );

    });

}


/* =========================================================
   15. ACTIVITY RANGE
========================================================= */

function initActivityRange() {

    const select =
        document.getElementById(
            "activityRange"
        );

    if (!select) {
        return;
    }


    select.addEventListener(
        "change",
        () => {

            const selected =
                select.value;

            showToast(
                `Showing ${selected.toLowerCase()} activity`
            );

        }
    );

}


/* =========================================================
   16. TOAST
========================================================= */

let toastTimer;


function showToast(message) {

    const toast =
        document.getElementById(
            "studentToast"
        );

    const toastMessage =
        document.getElementById(
            "studentToastMessage"
        );

    if (!toast || !toastMessage) {
        return;
    }


    toastMessage.textContent =
        message;


    toast.classList.add(
        "show"
    );


    clearTimeout(toastTimer);


    toastTimer =
        setTimeout(
            () => {

                toast.classList.remove(
                    "show"
                );

            },
            2500
        );

}