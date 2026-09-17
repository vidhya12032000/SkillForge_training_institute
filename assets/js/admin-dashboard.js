"use strict";


/* =========================================================
   SKILLFORGE ADMIN DASHBOARD JS
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    initIcons();

    initNavigation();

    initSidebar();

    initTheme();

    initLogout();

    initQuickActions();

    initStudentModal();

    initStudentSearch();

    initGlobalSearch();

    initNotifications();

});


/* =========================================================
   LUCIDE ICONS
========================================================= */

function initIcons() {

    if (typeof lucide === "undefined") {

        console.error(
            "Lucide icons library is not loaded."
        );

        return;
    }

    lucide.createIcons();

}


/* =========================================================
   NAVIGATION
========================================================= */

function initNavigation() {

    const navLinks =
        document.querySelectorAll(".nav-link");

    const sections =
        document.querySelectorAll(".dashboard-section");

    const pageTitle =
        document.getElementById("pageTitle");

    const breadcrumbText =
        document.getElementById("breadcrumbText");


    const titles = {

        dashboard: "Dashboard",

        students: "Students",

        courses: "Courses",

        instructors: "Instructors",

        batches: "Batches",

        payments: "Payments",

        attendance: "Attendance",

        certificates: "Certificates",

        blog: "Blog",

        messages: "Messages",

        settings: "Settings"

    };


    function showSection(sectionName) {

        if (
            !sectionName ||
            !document.getElementById(sectionName)
        ) {

            sectionName = "dashboard";

        }


        sections.forEach(section => {

            section.classList.remove("active");

        });


        const target =
            document.getElementById(sectionName);


        if (target) {

            target.classList.add("active");

        }


        navLinks.forEach(link => {

            link.classList.toggle(
                "active",
                link.dataset.section === sectionName
            );

        });


        const title =
            titles[sectionName] || "Dashboard";


        if (pageTitle) {

            pageTitle.textContent = title;

        }


        if (breadcrumbText) {

            breadcrumbText.textContent = title;

        }


        if (
            window.location.hash.replace("#", "") !==
            sectionName
        ) {

            history.replaceState(
                null,
                "",
                `#${sectionName}`
            );

        }


        closeSidebar();

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    }


    navLinks.forEach(link => {

        link.addEventListener("click", event => {

            event.preventDefault();

            showSection(
                link.dataset.section
            );

        });

    });


    const initialHash =
        window.location.hash.replace("#", "");


    showSection(
        initialHash || "dashboard"
    );


    window.addEventListener(
        "hashchange",
        () => {

            const current =
                window.location.hash.replace("#", "");

            showSection(
                current || "dashboard"
            );

        }
    );

}


/* =========================================================
   SIDEBAR
========================================================= */

function initSidebar() {

    const sidebar =
        document.getElementById("sidebar");

    const overlay =
        document.getElementById("sidebarOverlay");

    const menuBtn =
        document.getElementById("menuBtn");

    const closeBtn =
        document.getElementById("sidebarClose");


    if (menuBtn) {

        menuBtn.addEventListener(
            "click",
            () => {

                sidebar?.classList.add("open");

                overlay?.classList.add("show");

            }
        );

    }


    if (closeBtn) {

        closeBtn.addEventListener(
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

}


function closeSidebar() {

    document
        .getElementById("sidebar")
        ?.classList.remove("open");


    document
        .getElementById("sidebarOverlay")
        ?.classList.remove("show");

}


/* =========================================================
   THEME
========================================================= */

function initTheme() {

    const themeButton =
        document.getElementById("themeToggle");


    if (!themeButton) return;


    const savedTheme =
        localStorage.getItem(
            "skillforge-theme"
        );


    applyTheme(
        savedTheme || "light"
    );


    themeButton.addEventListener(
        "click",
        () => {

            const current =
                document.documentElement.dataset.theme ||
                "light";


            const next =
                current === "dark"
                    ? "light"
                    : "dark";


            applyTheme(next);

        }
    );

}


function applyTheme(theme) {

    document.documentElement.dataset.theme =
        theme;


    localStorage.setItem(
        "skillforge-theme",
        theme
    );


    const icon =
        document.getElementById("themeIcon");


    if (!icon) return;


    icon.setAttribute(
        "data-lucide",
        theme === "dark"
            ? "sun"
            : "moon"
    );


    initIcons();

}


/* =========================================================
   LOGOUT
========================================================= */

function initLogout() {

    const logoutBtn =
        document.getElementById("logoutBtn");


    if (!logoutBtn) return;


    logoutBtn.addEventListener(
        "click",
        () => {

            const confirmed =
                window.confirm(
                    "Are you sure you want to logout?"
                );


            if (!confirmed) return;


            /*
             * Remove login information
             */

            localStorage.removeItem(
                "skillforge-user"
            );


            localStorage.removeItem(
                "skillforge-login-time"
            );


            /*
             * Go to login page.
             *
             * Both files are inside /pages/
             */

            window.location.replace(
                "login.html"
            );

        }
    );

}


/* =========================================================
   QUICK ACTIONS
========================================================= */

function initQuickActions() {

    const buttons =
        document.querySelectorAll(
            "[data-go]"
        );


    buttons.forEach(button => {

        button.addEventListener(
            "click",
            () => {

                const section =
                    button.dataset.go;


                if (!section) return;


                window.location.hash =
                    section;

            }
        );

    });


    const manageStudents =
        document.getElementById(
            "manageStudentsBtn"
        );


    if (manageStudents) {

        manageStudents.addEventListener(
            "click",
            () => {

                window.location.hash =
                    "students";

            }
        );

    }

}


/* =========================================================
   ADD STUDENT MODAL
========================================================= */

function initStudentModal() {

    const modal =
        document.getElementById(
            "studentModal"
        );


    const addButton =
        document.getElementById(
            "addStudentBtn"
        );


    const cancelButton =
        document.getElementById(
            "cancelModal"
        );


    const closeButton =
        document.getElementById(
            "modalClose"
        );


    const overlay =
        document.getElementById(
            "modalOverlay"
        );


    const form =
        document.getElementById(
            "studentForm"
        );


    if (!modal) return;


    function openModal() {

        modal.classList.add("show");

        modal.setAttribute(
            "aria-hidden",
            "false"
        );

        document.body.style.overflow =
            "hidden";


        setTimeout(() => {

            document
                .getElementById("studentName")
                ?.focus();

        }, 100);

    }


    function closeModal() {

        modal.classList.remove("show");

        modal.setAttribute(
            "aria-hidden",
            "true"
        );

        document.body.style.overflow =
            "";

    }


    addButton?.addEventListener(
        "click",
        openModal
    );


    cancelButton?.addEventListener(
        "click",
        closeModal
    );


    closeButton?.addEventListener(
        "click",
        closeModal
    );


    overlay?.addEventListener(
        "click",
        closeModal
    );


    document.addEventListener(
        "keydown",
        event => {

            if (
                event.key === "Escape" &&
                modal.classList.contains("show")
            ) {

                closeModal();

            }

        }
    );


    form?.addEventListener(
        "submit",
        event => {

            event.preventDefault();


            const name =
                document
                    .getElementById("studentName")
                    .value
                    .trim();


            const email =
                document
                    .getElementById("studentEmail")
                    .value
                    .trim();


            const course =
                document
                    .getElementById("studentCourse")
                    .value;


            if (!name || !email || !course) {

                showToast(
                    "Please fill all fields."
                );

                return;

            }


            form.reset();

            closeModal();


            showToast(
                `${name} added successfully.`
            );

        }
    );

}


/* =========================================================
   STUDENT SEARCH
========================================================= */

function initStudentSearch() {

    const search =
        document.getElementById(
            "studentSearch"
        );


    if (!search) return;


    search.addEventListener(
        "input",
        () => {

            const query =
                search.value
                    .trim()
                    .toLowerCase();


            const table =
                document.querySelector(
                    "#students tbody"
                );


            if (!table) return;


            const rows =
                table.querySelectorAll(
                    "tr"
                );


            rows.forEach(row => {

                const text =
                    row.textContent
                        .toLowerCase();


                row.style.display =
                    text.includes(query)
                        ? ""
                        : "none";

            });

        }
    );

}


/* =========================================================
   GLOBAL SEARCH
========================================================= */

function initGlobalSearch() {

    const search =
        document.getElementById(
            "globalSearch"
        );


    if (!search) return;


    search.addEventListener(
        "keydown",
        event => {

            if (
                event.key !== "Enter"
            ) {
                return;
            }


            const value =
                search.value
                    .trim()
                    .toLowerCase();


            if (!value) {

                showToast(
                    "Type something to search."
                );

                return;

            }


            const allStudents =
                document.querySelectorAll(
                    "#students tbody tr"
                );


            let found = false;


            allStudents.forEach(row => {

                if (
                    row.textContent
                        .toLowerCase()
                        .includes(value)
                ) {

                    found = true;

                }

            });


            window.location.hash =
                "students";


            setTimeout(() => {

                const studentSearch =
                    document.getElementById(
                        "studentSearch"
                    );


                if (studentSearch) {

                    studentSearch.value =
                        search.value;


                    studentSearch.dispatchEvent(
                        new Event("input")
                    );

                }

            }, 100);


            showToast(
                found
                    ? "Student found."
                    : "Search completed."
            );

        }
    );


    /*
     * Ctrl + K
     */

    document.addEventListener(
        "keydown",
        event => {

            if (
                (event.ctrlKey ||
                 event.metaKey) &&
                event.key.toLowerCase() === "k"
            ) {

                event.preventDefault();

                search.focus();

            }

        }
    );

}


/* =========================================================
   NOTIFICATIONS
========================================================= */

function initNotifications() {

    const button =
        document.getElementById(
            "notificationBtn"
        );


    if (!button) return;


    button.addEventListener(
        "click",
        () => {

            showToast(
                "You have 3 new notifications."
            );

        }
    );

}


/* =========================================================
   TOAST
========================================================= */

function showToast(message) {

    const toast =
        document.getElementById(
            "toast"
        );


    const toastMessage =
        document.getElementById(
            "toastMessage"
        );


    if (!toast || !toastMessage) {
        return;
    }


    toastMessage.textContent =
        message;


    toast.classList.add("show");


    clearTimeout(
        window.skillForgeToastTimer
    );


    window.skillForgeToastTimer =
        setTimeout(
            () => {

                toast.classList.remove(
                    "show"
                );

            },
            3000
        );

}


/* =========================================================
   WINDOW RESIZE
========================================================= */

window.addEventListener(
    "resize",
    () => {

        if (window.innerWidth > 850) {

            closeSidebar();

        }

    }
);