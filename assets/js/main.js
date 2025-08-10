/*==================== EMAIL JS ====================*/
const contactForm = document.getElementById('contact-form');
const contactMessage = document.getElementById('contact-message');

const sendEmail = (e) => {
    e.preventDefault();

    emailjs.sendForm('service_825a8qv', 'template_a5xvxrm', '#contact-form', 'DlVVJJ95PuYDBnP7h')
        .then(() => {
            contactMessage.textContent = 'Message sent successfully ✅';
            setTimeout(() => {
                contactMessage.textContent = '';
            }, 5000);
            contactForm.reset();
        }, (error) => {
            contactMessage.textContent = 'Message failed to send ❌';
            console.error('EmailJS Error:', error);
        });
};

contactForm.addEventListener('submit', sendEmail);

/*==================== SHOW SCROLL UP ====================*/ 
const scrollUp = () => {
    const scrollUp = document.getElementById('scroll-up');
    if (window.scrollY >= 350) {
        scrollUp.classList.add('show-scroll');
    } else {
        scrollUp.classList.remove('show-scroll');
    }
};
window.addEventListener('scroll', scrollUp);

/*==================== SCROLL SECTIONS ACTIVE LINK ====================*/
const sections = document.querySelectorAll('section[id]');
    
const scrollActive = () => {
    const scrollY = window.pageYOffset;

    sections.forEach(current => {
        const sectionHeight = current.offsetHeight;
        const sectionTop = current.offsetTop - 58;
        const sectionId = current.getAttribute('id');

        if (sectionId && document.querySelector('.nav-list a[href*=' + sectionId + ']')) {
            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                document.querySelector('.nav-list a[href*=' + sectionId + ']').classList.add('active-link');
            } else {
                document.querySelector('.nav-list a[href*=' + sectionId + ']').classList.remove('active-link');
            }
        }
    });
};
window.addEventListener('scroll', scrollActive);

/*==================== SCROLL REVEAL ANIMATION ====================*/
const sr = ScrollReveal({
    origin: 'top',
    distance: '60px',
    duration: 2500,
    delay: 400,
    // reset: true,
});

sr.reveal(`.profile, .contact-form, .footer`);
sr.reveal(`.info`, { origin: 'left', delay: 800 });
sr.reveal(`.skills`, { origin: 'left', delay: 1000 });
sr.reveal(`.about`, { origin: 'right', delay: 1200 });
sr.reveal(`.projects-card, .services-card, .experience-card`, { interval: 100 });

/*==================== PROJECTS FILTER ====================*/
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

      project.removeEventListener('transitionend', project._hideListener);

      if (filter === 'all' || category === filter) {
        project.style.display = 'block';
        void project.offsetWidth;
        project.style.opacity = '1';
        project.style.transform = 'scale(1)';
        project.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
      } else {
        project.style.opacity = '0';
        project.style.transform = 'scale(0.8)';
        project.style.transition = 'opacity 0.3s ease, transform 0.3s ease';

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