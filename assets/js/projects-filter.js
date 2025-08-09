// const filterBtns = document.querySelectorAll('.filter-btn');
// const projects = document.querySelectorAll('.projects-card');

// filterBtns.forEach(btn => {
//   btn.addEventListener('click', () => {
//     // Si déjà actif, on stoppe pour éviter bug
//     if (btn.classList.contains('active')) return;

//     // Enlève la classe active
//     filterBtns.forEach(b => {
//       b.classList.remove('active');
//       b.style.transform = 'scale(1)';
//       b.style.transition = 'transform 0.25s ease';
//     });

//     // Active le bouton cliqué avec une legere animation
//     btn.classList.add('active');
//     btn.style.transform = 'scale(1.15)';
//     setTimeout(() => {
//       btn.style.transform = 'scale(1)';
//     }, 150);

//     const filter = btn.getAttribute('data-filter');

//     projects.forEach(project => {
//       const category = project.getAttribute('data-category');

//       if (filter === 'all' || category === filter) {

//         // Affiche avec animation douce
//         project.style.display = 'block';
//         project.style.opacity = '0';
//         project.style.transform = 'scale(0.95)';
//         project.style.transition = 'opacity 0.4s ease, transform 0.4s ease';

//         // Forcer un repaint pour que la transition marche à chaque fois
//         void project.offsetWidth;

//         project.style.opacity = '1';
//         project.style.transform = 'scale(1)';
//       } else {

//         // Cache avec fade + scale down
//         project.style.opacity = '0';
//         project.style.transform = 'scale(0.8)';
//         project.style.transition = 'opacity 0.3s ease, transform 0.3s ease';

//         setTimeout(() => {
//           project.style.display = 'none';
//         }, 300);
//       }
//     });
//   });
// });

const filterBtns = document.querySelectorAll('.filter-btn');
const projects = document.querySelectorAll('.projects-card');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    if (btn.classList.contains('active')) return;

    filterBtns.forEach(b => {
      b.classList.remove('active');
      b.style.transform = 'scale(1)';
      b.style.transition = 'transform 0.25s ease';
    });

    btn.classList.add('active');
    btn.style.transform = 'scale(1.15)';
    setTimeout(() => {
      btn.style.transform = 'scale(1)';
    }, 150);

    const filter = btn.getAttribute('data-filter');

    projects.forEach(project => {
      const category = project.getAttribute('data-category');

      // Annuler les listeners transitionend précédents
      project.removeEventListener('transitionend', project._hideListener);

      if (filter === 'all' || category === filter) {
        // Affiche immédiatement
        project.style.display = 'block';

        // Forcer repaint pour relancer l’animation
        void project.offsetWidth;

        project.style.opacity = '1';
        project.style.transform = 'scale(1)';
        project.style.transition = 'opacity 0.4s ease, transform 0.4s ease';

      } else {
        // Commence la transition pour cacher
        project.style.opacity = '0';
        project.style.transform = 'scale(0.8)';
        project.style.transition = 'opacity 0.3s ease, transform 0.3s ease';

        // Fonction de callback pour masquer après transition
        const hideAfterTransition = (e) => {
          if (e.propertyName === 'opacity') {
            project.style.display = 'none';
            project.removeEventListener('transitionend', hideAfterTransition);
            project._hideListener = null;
          }
        };

        project._hideListener = hideAfterTransition;
        project.addEventListener('transitionend', hideAfterTransition);
      }
    });
  });
});

