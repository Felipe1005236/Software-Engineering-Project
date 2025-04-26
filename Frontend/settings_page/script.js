document.addEventListener("DOMContentLoaded", () => {
    const sidebarItems = document.querySelectorAll(".settings-sidebar li");
    const sections = document.querySelectorAll(".settings-section");
    const darkModeToggle = document.getElementById("dark-mode");
    const saveProfileBtn = document.getElementById("save-profile");
    const profilePictureInput = document.getElementById("profile-picture");
    const profilePicturePreview = document.getElementById("profile-picture-preview");
    const workModeToggle = document.getElementById("work-mode");
    const workModeLabel = document.getElementById("work-mode-label");

    function showSection(sectionId) {
        sections.forEach(section => section.style.display = "none");
        document.getElementById(sectionId).style.display = "block";
    }

    sidebarItems.forEach(item => {
        item.addEventListener("click", () => {
            sidebarItems.forEach(i => i.classList.remove("active"));
            item.classList.add("active");

            const sectionId = item.getAttribute("data-section");
            showSection(sectionId);
        });
    });

    showSection("profile");

    // Dark Mode Toggle
    darkModeToggle.addEventListener("change", () => {
        document.body.classList.toggle("dark-mode");
        localStorage.setItem("darkMode", darkModeToggle.checked);
    });

    if (localStorage.getItem("darkMode") === "true") {
        document.body.classList.add("dark-mode");
        darkModeToggle.checked = true;
    }

    // Profile Picture Preview
    profilePictureInput.addEventListener("change", function () {
        const file = this.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
                profilePicturePreview.src = e.target.result;
            };
            reader.readAsDataURL(file);
        }
    });

    // Work Mode Toggle
    workModeToggle.addEventListener("change", () => {
        workModeLabel.textContent = workModeToggle.checked ? "Remote" : "On-Site";
    });
});
