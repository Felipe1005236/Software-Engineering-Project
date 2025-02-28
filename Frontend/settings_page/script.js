document.addEventListener("DOMContentLoaded", () => {
  const sidebarItems = document.querySelectorAll(".settings-sidebar li");
  const sections = document.querySelectorAll(".settings-section");
  const darkModeToggle = document.getElementById("dark-mode");

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

  // Show first section by default
  showSection("profile");

  // Dark mode toggle functionality
  darkModeToggle.addEventListener("change", () => {
      document.body.classList.toggle("dark-mode");

      // Save preference to local storage
      localStorage.setItem("darkMode", darkModeToggle.checked);
  });

  // Load dark mode preference on page load
  if (localStorage.getItem("darkMode") === "true") {
      document.body.classList.add("dark-mode");
      darkModeToggle.checked = true;
  }
});
