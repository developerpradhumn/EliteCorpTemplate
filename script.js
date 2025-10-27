document.addEventListener('DOMContentLoaded', () => {

    const header = document.getElementById('main-header');
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const backToTopBtn = document.querySelector('.back-to-top');
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-menu a.nav-link');
    const contactForm = document.getElementById('main-contact-form');

    // --- 1. Sticky Header, Scroll Spy & Back to Top Button ---
    const handleScroll = () => {
        const scrollY = window.scrollY;

        // Sticky header
        if (header) {
            scrollY > 50 ? header.classList.add('scrolled') : header.classList.remove('scrolled');
        }

        // Back to top button
        if (backToTopBtn) {
            scrollY > 300 ? backToTopBtn.classList.add('visible') : backToTopBtn.classList.remove('visible');
        }

        // Scroll spy (active nav link)
        let currentSection = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - (header ? header.offsetHeight : 80) - 50; // Add 50px offset
            if (scrollY >= sectionTop) {
                currentSection = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            // Check if the link's href matches the current section
            // We use endsWith because href might be a full URL
            if (link.href && link.href.endsWith('#' + currentSection)) {
                link.classList.add('active');
            }
        });

        // Handle case where no section is active (e.g., at the top)
        // Check if a 'current' class exists (set by HTML) and no 'active' class is set by scroll spy
        const noActiveLink = !document.querySelector('.nav-menu a.nav-link.active');
        const currentLink = document.querySelector('.nav-menu a.nav-link.current');
        if (noActiveLink && currentLink) {
            // If at top of a page, let the 'current' class take precedence
        }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Run on load

    // Back to top click
    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // --- 2. Mobile Menu Toggle ---
    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            menuToggle.classList.toggle('active');
            document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
        });

        // Close menu when a link is clicked
        navMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                if (navMenu.classList.contains('active')) {
                    navMenu.classList.remove('active');
                    menuToggle.classList.remove('active');
                    document.body.style.overflow = '';
                }
            });
        });
    }

    // --- 3. Scroll Reveal Animation ---
    const revealElements = document.querySelectorAll('.reveal, .reveal-up, .reveal-left, .reveal-right');

    if (revealElements.length > 0) {
        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1
        });

        revealElements.forEach(el => {
            observer.observe(el);
        });
    }

    // --- 4. Testimonial Slider (Simple) ---
    const slider = document.querySelector('.testimonial-slider');
    if (slider) {
        const items = slider.querySelectorAll('.testimonial-item');
        let currentItem = 0;
        const totalItems = items.length;

        function showItem(index) {
            items.forEach(item => item.classList.remove('active'));
            items[index].classList.add('active');
        }

        function nextItem() {
            currentItem = (currentItem + 1) % totalItems;
            showItem(currentItem);
        }

        if (totalItems > 1) {
            setInterval(nextItem, 7000); // Auto-rotate every 7 seconds
        }
    }

    // --- 5. Contact Form Validation ---
    if (contactForm) {
        const nameInput = document.getElementById('name');
        const emailInput = document.getElementById('email');
        const messageInput = document.getElementById('message');

        const showError = (input, message) => {
            const formGroup = input.parentElement;
            formGroup.classList.remove('success');
            formGroup.classList.add('error');
            const errorEl = formGroup.querySelector('.error-message');
            if (errorEl) errorEl.textContent = message;
        };

        const showSuccess = (input) => {
            const formGroup = input.parentElement;
            formGroup.classList.remove('error');
            formGroup.classList.add('success');
            const errorEl = formGroup.querySelector('.error-message');
            if (errorEl) errorEl.textContent = '';
        };

        const validateEmail = (email) => {
            const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return re.test(String(email).toLowerCase());
        };

        const checkRequired = (inputs) => {
            let isFormValid = true;
            inputs.forEach(input => {
                if (input.value.trim() === '') {
                    showError(input, `${getFieldName(input)} is required`);
                    isFormValid = false;
                } else {
                    showSuccess(input);
                }
            });
            return isFormValid;
        };

        const checkEmail = (input) => {
            if (input.value.trim() !== '' && !validateEmail(input.value.trim())) {
                showError(input, 'Email is not valid');
                return false;
            }
            return true;
        };

        const getFieldName = (input) => {
            return input.id.charAt(0).toUpperCase() + input.id.slice(1);
        };

        contactForm.addEventListener('submit', (e) => {
            e.preventDefault(); // Prevent actual submission for demo

            let isRequiredValid = checkRequired([nameInput, emailInput, messageInput]);
            let isEmailValid = checkEmail(emailInput);

            if (isRequiredValid && isEmailValid) {
                // Form is valid - you would send data to a server here
                console.log('Form is valid and ready to submit');
                alert('Thank you for your message! (This is a demo)');
                contactForm.reset();
                // Remove success classes
                [nameInput, emailInput, messageInput].forEach(input => {
                    input.parentElement.classList.remove('success');
                });
            } else {
                console.log('Form is invalid');
            }
        });

        // Optional: Real-time validation
        [nameInput, emailInput, messageInput].forEach(input => {
            input.addEventListener('input', () => {
                if (input.value.trim() !== '') {
                    showSuccess(input);
                    if (input.type === 'email') {
                        checkEmail(input);
                    }
                }
            });
        });
    }

});