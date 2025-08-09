// On récupère les boutons et les projets
const filterBtns = document.querySelectorAll('.filter-btn');
const projects = document.querySelectorAll('.projects-card');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    // On enlève la classe active à tous
    filterBtns.forEach(b => b.classList.remove('active'));
    // On active le bouton cliqué
    btn.classList.add('active');

    const filter = btn.getAttribute('data-filter');

    projects.forEach(project => {
      const category = project.getAttribute('data-category');

      // Show all ou filtre précis
      if (filter === 'all' || category === filter) {
        project.style.display = 'block';
        // Petite animation pour la vibe
        project.style.opacity = '1';
        project.style.transform = 'scale(1)';
        project.style.transition = 'all 0.3s ease';
      } else {
        // On cache en douceur
        project.style.opacity = '0';
        project.style.transform = 'scale(0.95)';
        project.style.transition = 'all 0.3s ease';
        setTimeout(() => {
          project.style.display = 'none';
        }, 300);
      }
    });
  });
});
