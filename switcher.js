// Function to switch visible containers
function switchTo(containerId) {
    // Hide all containers
    const containers = document.querySelectorAll('.container');
    containers.forEach(container => container.classList.remove('active'));
    // Show the target container
    const target = document.getElementById(containerId);
    if (target) {
      target.classList.add('active');
    } else {
      console.error(`Container with ID "${containerId}" not found.`);
    }
  }
  