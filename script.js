// Navbar scroll effect
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Initialize EmailJS (replace with your public key)
emailjs.init("zkPxG-bAZigRNtSXi");

// Dynamic content loading
const sectionsLoaded = {
    experience: false,
    projects: false,
    publications: false,
    events: false,
    collaboration: false,
    contact: false
};

// Function to load section content
async function loadSection(sectionName) {
    if (sectionsLoaded[sectionName]) return;

    try {
        const response = await fetch(`${sectionName}.html`);
        if (response.ok) {
            const html = await response.text();
            const container = document.getElementById(`${sectionName}-section`);
            if (container) {
                container.innerHTML = html;
                sectionsLoaded[sectionName] = true;

                // Re-attach contact form listener if contact section is loaded
                if (sectionName === 'contact') {
                    attachContactFormListener();
                }
            }
        }
    } catch (error) {
        console.error(`Error loading ${sectionName}:`, error);
    }
}

// Load all sections on page load
window.addEventListener('DOMContentLoaded', () => {
    loadSection('collaboration');
    loadSection('experience');
    loadSection('publications');
    loadSection('projects');
    loadSection('events');
    loadSection('contact');
});

// Smooth scrolling for navigation links
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('nav-item') || e.target.closest('.nav-item')) {
        const link = e.target.classList.contains('nav-item') ? e.target : e.target.closest('.nav-item');
        const href = link.getAttribute('href');
        
        if (href && href.startsWith('#')) {
            e.preventDefault();
            const targetId = href.substring(1);
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                updateActiveNavLink(link);
            }
        }
    }
});

// Update active navigation link
function updateActiveNavLink(activeLink) {
    document.querySelectorAll('.nav-links .nav-item').forEach(link => link.classList.remove('active'));
    activeLink.classList.add('active');
}

// Highlight active section on scroll
const sections = ['home', 'collaboration', 'experience', 'projects', 'publications', 'events', 'contact'];
let ticking = false;

window.addEventListener('scroll', () => {
    if (!ticking) {
        window.requestAnimationFrame(() => {
            highlightNavOnScroll();
            ticking = false;
        });
        ticking = true;
    }
});

function highlightNavOnScroll() {
    const scrollPosition = window.scrollY + 100;

    for (let i = sections.length - 1; i >= 0; i--) {
        const section = document.getElementById(sections[i]);
        if (section) {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                const navLink = document.querySelector(`.nav-links a[href="#${sections[i]}"]`);
                if (navLink) {
                    document.querySelectorAll('.nav-links .nav-item').forEach(link => link.classList.remove('active'));
                    navLink.classList.add('active');
                }
                break;
            }
        }
    }
}

// Contact form submission via EmailJS
function attachContactFormListener() {
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            emailjs.sendForm('service_h254vrs', 'template_3rkzthq', contactForm)
                .then(() => {
                    alert('✅ Message sent successfully!');
                    contactForm.reset();
                }, (error) => {
                    alert('❌ Failed to send message. Please try again later.');
                    console.error('EmailJS Error:', error);
                });
        });
    }
}

// Initial check for contact form (in case it's already in DOM)
attachContactFormListener();
