// Initialize GSAP ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

// Global variables for typed instances
let typedTextInstance = null;
let typedRoleInstance = null;
let currentLanguage = 'en'; // Track current language
let isTypingInitialized = false; // Track if typing is initialized

// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize animations
    initHeroAnimations();
    initScrollAnimations();
    
    // Initialize language and theme toggles
    initLanguageToggle();
    initThemeToggle();
    
    // Initialize navigation highlighting
    initNavHighlighting();
    
    // Update current year in footer
    document.getElementById('current-year').textContent = new Date().getFullYear();
});

// Initialize hero section animations
function initHeroAnimations() {
    // Make hero section visible immediately
    const heroSection = document.querySelector('#hero');
    heroSection.classList.add('visible');
    
    // Animate hero items with staggered delay
    const heroItems = heroSection.querySelectorAll('.animate-item');
    heroItems.forEach((item, index) => {
        setTimeout(() => {
            item.classList.add('visible');
        }, 300 + (index * 200));
    });
    
    // Initialize typing animation for name
    setTimeout(() => {
        initTypedAnimations();
    }, 500);
}

// Function to initialize or reinitialize typed animations
function initTypedAnimations() {
    // Prevent multiple initializations
    if (isTypingInitialized) {
        console.log("Typing already initialized, not reinitializing");
        return;
    }
    
    isTypingInitialized = true;
    console.log("Initializing typing animations");
    
    // First completely destroy previous instances if they exist
    if (typedTextInstance) {
        try {
            typedTextInstance.destroy();
        } catch (e) {
            console.error("Error destroying typedTextInstance:", e);
        }
        typedTextInstance = null;
    }
    
    if (typedRoleInstance) {
        try {
            typedRoleInstance.destroy();
        } catch (e) {
            console.error("Error destroying typedRoleInstance:", e);
        }
        typedRoleInstance = null;
    }
    
    // Reference to elements we need to animate
    const typedTextElement = document.getElementById('typed-text');
    const typedRoleElement = document.getElementById('typed-role');
    
    // Safety check - if elements don't exist, don't try to initialize
    if (!typedTextElement || !typedRoleElement) {
        console.error("Typed elements not found in DOM");
        isTypingInitialized = false;
        return;
    }
    
    // Clear any existing content
    typedTextElement.innerHTML = '';
    typedRoleElement.innerHTML = '';
    
    // Set name string based on language
    const nameString = 'Reyhan Dalaman';
    
    // Set role string based on language
    let roleString = currentLanguage === 'fr' ? 'Ingénieure TAL/NLP' : 'NLP Engineer';
    
    // Wait a moment for DOM to stabilize
    setTimeout(() => {
        // Initialize typing animation for name with no delay
        try {
            typedTextInstance = new Typed('#typed-text', {
                strings: [nameString],
                typeSpeed: 100,
                backSpeed: 50,
                startDelay: 0, // No delay
                showCursor: true,
                cursorChar: '|',
                loop: false,
                loopCount: 0,
                backDelay: 1500,
                smartBackspace: false
            });
            
            // Initialize typing animation for role after name is complete
            setTimeout(() => {
                try {
                    typedRoleInstance = new Typed('#typed-role', {
                        strings: [roleString],
                        typeSpeed: 80,
                        backSpeed: 40,
                        startDelay: 0, // No delay
                        backDelay: 1500,
                        loop: false,
                        loopCount: 0,
                        showCursor: true,
                        cursorChar: '',
                        smartBackspace: false
                    });
                } catch (e) {
                    console.error("Error initializing role typing:", e);
                }
            }, 0);
        } catch (e) {
            console.error("Error initializing name typing:", e);
        }
        
        // Allow re-initialization after animations complete
        setTimeout(() => {
            isTypingInitialized = false;
        }, 0);
    }, 0);
}

// Scroll animations for sections and elements
function initScrollAnimations() {
    // Animate sections when they come into view
    const sections = document.querySelectorAll('.animate-section');
    
    // Set up section visibility
    updateSectionVisibility();
    
    // Listen for scroll events to update section visibility
    window.addEventListener('scroll', updateSectionVisibility);
    
    function updateSectionVisibility() {
        sections.forEach(section => {
            const sectionTop = section.getBoundingClientRect().top;
            const sectionBottom = section.getBoundingClientRect().bottom;
            const windowHeight = window.innerHeight;
            
            // Check if section is in viewport
            if (sectionTop < windowHeight * 0.7 && sectionBottom > 0) {
                // Add visible class if not already added
                if (!section.classList.contains('visible')) {
                    section.classList.add('visible');
                    
                    // Animate child items with staggered delay
                    const items = section.querySelectorAll('.animate-item');
                    items.forEach((item, index) => {
                        setTimeout(() => {
                            item.classList.add('visible');
                        }, 200 + (index * 100));
                    });
                }
            } else {
                // Remove visible class if section is not in viewport
                section.classList.remove('visible');
                
                // Remove visible class from child items
                const items = section.querySelectorAll('.animate-item');
                items.forEach(item => {
                    item.classList.remove('visible');
                });
            }
        });
    }
    
    // Project cards hover effect enhancement
    const projectCards = document.querySelectorAll('.project-card');
    
    projectCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            gsap.to(card, {
                y: -10,
                scale: 1.02,
                boxShadow: '0 15px 30px rgba(0, 0, 0, 0.1)',
                duration: 0.5,
                ease: 'back.out(1.7)'
            });
            
            // Animate the line at the top
            const line = card.querySelector('::before') || card;
            gsap.to(line, {
                scaleX: 1,
                duration: 0.5,
                ease: 'power2.out'
            });
        });
        
        card.addEventListener('mouseleave', () => {
            gsap.to(card, {
                y: 0,
                scale: 1,
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
                duration: 0.5,
                ease: 'power2.out'
            });
        });
    });
    
    // Resume button animation enhancement
    const resumeButton = document.querySelector('.resume-button');
    
    if (resumeButton) {
        resumeButton.addEventListener('mouseenter', () => {
            gsap.to(resumeButton, {
                y: -5,
                boxShadow: '0 10px 20px rgba(0, 0, 0, 0.1)',
                backgroundColor: '#49e4a3',
                duration: 0.5,
                ease: 'back.out(1.7)'
            });
        });
        
        resumeButton.addEventListener('mouseleave', () => {
            gsap.to(resumeButton, {
                y: 0,
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
                backgroundColor: '#49e4a3',
                duration: 0.5,
                ease: 'power2.out'
            });
        });
    }
    
    // Logo animation
    const logo = document.querySelector('.logo');
    
    if (logo) {
        logo.addEventListener('mouseenter', () => {
            gsap.to(logo, {
                rotation: 10,
                scale: 1.1,
                duration: 0.5,
                ease: 'back.out(1.7)'
            });
        });
        
        logo.addEventListener('mouseleave', () => {
            gsap.to(logo, {
                rotation: 0,
                scale: 1,
                duration: 0.5,
                ease: 'power2.out'
            });
        });
    }
    
    // Social links animation enhancement
    const socialLinks = document.querySelectorAll('.social-links a');
    
    socialLinks.forEach(link => {
        link.addEventListener('mouseenter', () => {
            gsap.to(link, {
                y: -5,
                scale: 1.2,
                color: '#49e4a3',
                duration: 0.5,
                ease: 'back.out(1.7)'
            });
        });
        
        link.addEventListener('mouseleave', () => {
            gsap.to(link, {
                y: 0,
                scale: 1,
                color: '#64748b',
                duration: 0.5,
                ease: 'power2.out'
            });
        });
    });
}

// Initialize navigation highlighting based on scroll position
function initNavHighlighting() {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('nav ul li a');
    
    window.addEventListener('scroll', () => {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (window.pageYOffset >= sectionTop - 200) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').substring(1) === current) {
                link.classList.add('active');
            }
        });
    });
    
    // Smooth scrolling for navigation links
    navLinks.forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                // Smooth scroll to target
                window.scrollTo({
                    top: targetElement.offsetTop - 100,
                    behavior: 'smooth'
                });
                
                // Update active class
                navLinks.forEach(link => link.classList.remove('active'));
                this.classList.add('active');
            }
        });
    });
}

// Initialize language toggle functionality
function initLanguageToggle() {
    const languageBtns = document.querySelectorAll('.language-btn');
    let isChangingLanguage = false; // Flag to prevent multiple rapid changes
    
    // English translations
    const enTranslations = {
        'nav-home': 'Home',
        'nav-projects': 'Projects',
        'nav-resume': 'Resume',
        'hero-title': 'Hi! I\'m',
        'hero-subtitle': 'I\'m an',
        'hero-role': 'NLP Engineer',
        'hero-description': 'I specialize in Natural Language Processing, and build solutions that understand and generate human language.',
        'projects-title': 'Projects',
        'project1-title': 'Pink AI',
        'project1-desc': 'PINK AI is an interface that allows users to experiment with language models by adjusting LLM parameters for a customized experience. Built with Streamlit, it enables fine-tuning settings like temperature, top-k, and top-p to control response behavior.',
        'project2-title': 'COMPREVE',
        'project2-desc': 'COMPREVE is a Django-based web application designed for analyzing Twitch chat messages. It provides tools for uploading, searching, filtering, and analyzing chat data.',
        'project3-title': 'Image Classification',
        'project3-desc': 'This project implements a deep learning model using PyTorch to classify images through transfer learning. By leveraging pre-trained neural networks, it efficiently classifies 102 flower species with optimized training time and improved accuracy.',
        'project4-title': 'Toxic Comment Classification',
        'project4-desc': 'Project utilizing DistilBERT, GRU, and LSTM models to detect and classify toxic comments in online discussions, with evaluation through error analysis and visualizations.',
        'project5-title': 'Lyrics Generator',
        'project5-desc': 'Lyrics generator using Bi-LSTM and embedding models to predict and generate song lyrics based on an initial input sequence with categorical cross-entropy loss.',
        'project6-title': 'Fake News Detection',
        'project6-desc': 'Machine learning system using logistic regression and naive bayes approaches to identify and flag potentially false news articles.',
        'view-project': 'View',
        'resume-title': 'Resume',
        'resume-description': 'Check out my resume for more details on my experience and skills.',
        'resume-button': 'Download Resume',
        'footer-text': 'All rights reserved'
    };
    
    // French translations
    const frTranslations = {
        'nav-home': 'Accueil',
        'nav-projects': 'Projets',
        'nav-resume': 'CV',
        'hero-title': 'Bonjour ! <br> Je suis',
        'hero-subtitle': '',
        'hero-role': 'Ingénieure TAL/NLP',
        'hero-description': 'Je me spécialise dans le traitement du langage naturel et construis des solutions qui comprennent et génèrent le langage humain.',
        'projects-title': 'Projets',
        'project1-title': 'Pink AI',
        'project1-desc': 'PINK AI est une interface développée avec Streamlit, permettant d\'expérimenter avec des modèles de langues en ajustant des paramètres LLM tels que la température, top-k et top-p pour une expérience personnalisée.',
        'project2-title': 'COMPREVE',
        'project2-desc': 'COMPREVE est une application web basée sur Django conçue pour analyser les chats Twitch. Elle fournit des outils pour télécharger, rechercher, filtrer et analyser les données.',
        'project3-title': 'Classification d\'images',
        'project3-desc': 'Projet de classification d\'images utilisant le deep learning avec PyTorch et l\'apprentissage par transfert pour classifier 102 espèces de fleurs avec un entraînement optimisé et une meilleure précision.',
        'project4-title': 'Classification de commentaires toxiques',
        'project4-desc': 'Projet utilisant les modèles DistilBERT, GRU et LSTM pour détecter et classifier les commentaires toxiques dans les discussions en ligne, avec une évaluation par l\'analyse des erreurs et des visualisations.',
        'project5-title': 'Générateur de paroles',
        'project5-desc': 'Générateur de paroles utilisant des modèles Bi-LSTM et d\'encodage pour prédire et générer des paroles de chanson à partir d\'une séquence d\'entrée initiale avec la perte d\'entropie croisée catégorielle.',
        'project6-title': 'Détection de fausses nouvelles',
        'project6-desc': 'Système d\'apprentissage automatique utilisant la régression logistique et les approches bayésiennes naïves pour identifier et signaler les articles potentiellement faux.',
        'view-project': 'Voir',
        'resume-title': 'CV',
        'resume-description': 'Consultez mon CV pour en savoir plus sur mon expérience et mes compétences.',
        'resume-button': 'Télécharger CV',
        'footer-text': 'Tous droits réservés'
    };
    
    languageBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Get language
            const lang = btn.getAttribute('data-lang');
            
            // Don't do anything if it's already the current language
            if (lang === currentLanguage || isChangingLanguage) {
                return;
            }
            
            // Set flag to prevent multiple rapid changes
            isChangingLanguage = true;
            
            // Update current language
            currentLanguage = lang;
            console.log("Changing language to:", lang);
            
            // Update active button display
            languageBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Update content based on language
            if (lang === 'en') {
                updateLanguage(enTranslations);
            } else if (lang === 'fr') {
                updateLanguage(frTranslations);
            }
        });
    });
    
    function updateLanguage(translations) {
        console.log("Updating language content");
        
        // Clear any existing typing animation timeouts
        clearTimeout(window.typingTimeout);
        clearTimeout(window.roleTypingTimeout);
        
        // Update navigation
        document.querySelector('nav ul li:nth-child(1) a').textContent = translations['nav-home'];
        document.querySelector('nav ul li:nth-child(2) a').textContent = translations['nav-projects'];
        document.querySelector('nav ul li:nth-child(3) a').textContent = translations['nav-resume'];
        
        // Update hero section - completely recreate the elements to avoid stale references
        const heroTitle = document.querySelector('#hero h1');
        if (heroTitle) {
            // Create the content without typed animation spans first
            heroTitle.innerHTML = translations['hero-title'] + ' <span class="highlight" id="typed-text"></span>';
        }
        
        const subtitle = document.querySelector('#hero .subtitle');
        if (subtitle) {
            subtitle.innerHTML = translations['hero-subtitle'] + ' <span id="typed-role"></span>';
        }
        
        const description = document.querySelector('#hero .description');
        if (description) {
            description.textContent = translations['hero-description'];
        }
        
        // Update projects section
        document.querySelector('#projects h2').textContent = translations['projects-title'];
        
        // Update project cards
        const projectCards = document.querySelectorAll('.project-card');
        if (projectCards.length >= 6) {
            projectCards[0].querySelector('h3').textContent = translations['project1-title'];
            projectCards[0].querySelector('p').textContent = translations['project1-desc'];
            projectCards[0].querySelector('.project-link').textContent = translations['view-project'];
            
            projectCards[1].querySelector('h3').textContent = translations['project2-title'];
            projectCards[1].querySelector('p').textContent = translations['project2-desc'];
            projectCards[1].querySelector('.project-link').textContent = translations['view-project'];
            
            projectCards[2].querySelector('h3').textContent = translations['project3-title'];
            projectCards[2].querySelector('p').textContent = translations['project3-desc'];
            projectCards[2].querySelector('.project-link').textContent = translations['view-project'];
            
            projectCards[3].querySelector('h3').textContent = translations['project4-title'];
            projectCards[3].querySelector('p').textContent = translations['project4-desc'];
            projectCards[3].querySelector('.project-link').textContent = translations['view-project'];
            
            projectCards[4].querySelector('h3').textContent = translations['project5-title'];
            projectCards[4].querySelector('p').textContent = translations['project5-desc'];
            projectCards[4].querySelector('.project-link').textContent = translations['view-project'];
            
            projectCards[5].querySelector('h3').textContent = translations['project6-title'];
            projectCards[5].querySelector('p').textContent = translations['project6-desc'];
            projectCards[5].querySelector('.project-link').textContent = translations['view-project'];
        }
        
        // Update resume section
        document.querySelector('#resume h2').textContent = translations['resume-title'];
        document.querySelector('#resume p').textContent = translations['resume-description'];
        document.querySelector('#resume .resume-button').textContent = translations['resume-button'];
        
        // Update footer
        document.querySelector('footer p').innerHTML = '&copy; <span id="current-year">' + new Date().getFullYear() + '</span> Reyhan Dalaman. ' + translations['footer-text'] + '.';
        
        // Wait a bit for the DOM to update, then reinitialize typing
        window.typingTimeout = setTimeout(() => {
            // Ensure all previous animations are destroyed
            if (typedTextInstance) {
                try {
                    typedTextInstance.destroy();
                    typedTextInstance = null;
                } catch (e) {
                    console.error("Error destroying text typing:", e);
                }
            }
            
            if (typedRoleInstance) {
                try {
                    typedRoleInstance.destroy();
                    typedRoleInstance = null;
                } catch (e) {
                    console.error("Error destroying role typing:", e);
                }
            }
            
            // Reset initialization flag
            isTypingInitialized = false;
            
            // Restart the typing animation
            initTypedAnimations();
            
            // Reset language change flag
            isChangingLanguage = false;
        }, 1000);
    }
}

// Initialize theme toggle functionality
function initThemeToggle() {
    const themeBtns = document.querySelectorAll('.theme-btn');
    const htmlElement = document.documentElement;
    
    themeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all buttons
            themeBtns.forEach(b => b.classList.remove('active'));
            
            // Add active class to clicked button
            btn.classList.add('active');
            
            // Get theme
            const theme = btn.getAttribute('data-theme');
            
            // Update theme
            htmlElement.setAttribute('data-theme', theme);
        });
    });
}