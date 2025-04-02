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

  showSection("stakeholder-list");

  darkModeToggle.addEventListener("change", () => {
      document.body.classList.toggle("dark-mode");
      localStorage.setItem("darkMode", darkModeToggle.checked);
  });

  if (localStorage.getItem("darkMode") === "true") {
      document.body.classList.add("dark-mode");
      darkModeToggle.checked = true;
  }

  // Stakeholder Modal Handling
  const modal = document.getElementById("stakeholder-modal");
  const addStakeholderBtn = document.getElementById("add-stakeholder");
  const closeBtn = document.querySelector(".close");
  const saveStakeholderBtn = document.getElementById("save-stakeholder");
  const tableBody = document.getElementById("stakeholder-table-body");

  addStakeholderBtn.addEventListener("click", () => modal.style.display = "block");
  closeBtn.addEventListener("click", () => modal.style.display = "none");

  saveStakeholderBtn.addEventListener("click", () => {
      const name = document.getElementById("stakeholder-name").value;
      const role = document.getElementById("stakeholder-role").value;
      const contact = document.getElementById("stakeholder-contact").value;
      const influence = document.getElementById("stakeholder-influence").value;
      const interest = document.getElementById("stakeholder-interest").value;

      tableBody.innerHTML += `<tr><td>${name}</td><td>${role}</td><td>${contact}</td><td>${influence}</td><td>${interest}</td></tr>`;
      modal.style.display = "none";
  });
});
