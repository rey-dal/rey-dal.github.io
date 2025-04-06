// Initialize GSAP ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

// Global variables for typed instances
let typedTextInstance = null;
let typedRoleInstance = null;
let currentLanguage = 'en'; // Track current language
let isTypingInProgress = false; // Track if typing animation is in progress
let canSwitchLanguage = true; // Flag to control language switching

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
        startTypingAnimation();
    }, 500);
}

// Function to handle typing animations - IMPROVED to show name and role simultaneously
function startTypingAnimation() {
    if (isTypingInProgress) {
        return; // Don't start new typing if already in progress
    }
    
    isTypingInProgress = true;
    canSwitchLanguage = false; // Disable language switching during typing
    
    // Clean up previous instances first
    cleanupTypingInstances();
    
    // Get elements
    const typedTextElement = document.getElementById('typed-text');
    const typedRoleElement = document.getElementById('typed-role');
    
    // Safety check
    if (!typedTextElement || !typedRoleElement) {
        console.error("Typed elements not found in DOM");
        isTypingInProgress = false;
        canSwitchLanguage = true;
        return;
    }
    
    // Clear existing content
    typedTextElement.innerHTML = '';
    typedRoleElement.innerHTML = '';
    
    // Name is the same in both languages
    const nameString = 'Reyhan Dalaman';
    
    // Role is different based on language
    // Fixed: Changed French version to use "IA" instead of "AI"
    const roleString = currentLanguage === 'fr' ? 'Data Science | NLP / TAL | Machine Learning | IA ' : 'Data Science | NLP | Machine Learning | AI ';
    
    // Start name and role typing simultaneously
    typedTextInstance = new Typed('#typed-text', {
        strings: [nameString],
        typeSpeed: 70,
        backSpeed: 100,
        startDelay: 0,
        showCursor: true,
        cursorChar: '|',
        loop: false,
        onComplete: function() {
            // Re-enable language switching after name completes
            // But keep isTypingInProgress until both are done
            canSwitchLanguage = true;
        }
    });
    
    // Start role typing at the same time
    typedRoleInstance = new Typed('#typed-role', {
        strings: [roleString],
        typeSpeed: 70,
        backSpeed: 40,
        startDelay: 0, // Start at the same time
        showCursor: true,
        cursorChar: '',
        loop: false,
        onComplete: function() {
            // Both animations are complete
            isTypingInProgress = false;
        }
    });
    
    // Make description animate-in right after typing starts
    const description = document.querySelector('#hero .description');
    if (description) {
        // Add animation class
        description.classList.add('fade-in');
    }
}

// Clean up typing instances - IMPROVED to better handle interruptions
function cleanupTypingInstances() {
    // Destroy text instance if it exists
    if (typedTextInstance) {
        try {
            typedTextInstance.destroy();
        } catch (e) {
            console.error("Error destroying typedTextInstance:", e);
        }
        typedTextInstance = null;
    }
    
    // Destroy role instance if it exists
    if (typedRoleInstance) {
        try {
            typedRoleInstance.destroy();
        } catch (e) {
            console.error("Error destroying typedRoleInstance:", e);
        }
        typedRoleInstance = null;
    }
    
    // Reset typing status to ensure language switching works
    isTypingInProgress = false;
    canSwitchLanguage = true;
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
                    
                    // Handle special case for projects section - slower animation
                    const isProjectsSection = section.id === 'projects';
                    const transitionDelay = isProjectsSection ? 400 : 200;
                    
                    // Animate child items with staggered delay
                    const items = section.querySelectorAll('.animate-item');
                    items.forEach((item, index) => {
                        setTimeout(() => {
                            item.classList.add('visible');
                        }, transitionDelay + (index * (isProjectsSection ? 150 : 100)));
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
                y: -5,
                scale: 1,
                boxShadow: '0 15px 30px rgba(0, 0, 0, 0.1)',
                duration: 0.2,
                ease: 'back.out(1.7)'
            });
            
            // Animate the line at the top
            gsap.to(card, {
                '--before-scale': 1,
                duration: 0.5,
                ease: 'power2.out'
            });
            
            // Highlight the title
            const title = card.querySelector('h3');
            if (title) {
                gsap.to(title, {
                    color: 'var(--primary-color)',
                    duration: 0.3
                });
            }
        });
        
        card.addEventListener('mouseleave', () => {
            gsap.to(card, {
                y: 0,
                scale: 1,
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
                duration: 0.2,
                ease: 'power2.out'
            });
            
            // Animate the line back
            gsap.to(card, {
                '--before-scale': 0,
                duration: 0.5,
                ease: 'power2.out'
            });
            
            // Return title to original color
            const title = card.querySelector('h3');
            if (title) {
                gsap.to(title, {
                    color: 'var(--text-color)',
                    duration: 0.3
                });
            }
        });
    });
    
    // Update the language toggle functionality to handle cards without buttons
    function updateProjectCard(card, prefix, translations) {
        card.querySelector('h3').textContent = translations[prefix + '-title'];
        card.querySelector('p').textContent = translations[prefix + '-desc'];
    }
    
    // Resume button animation enhancement
    const resumeButton = document.querySelector('.resume-button');
    
    if (resumeButton) {
        resumeButton.addEventListener('mouseenter', () => {
            gsap.to(resumeButton, {
                y: -5,
                boxShadow: '0 10px 20px rgba(0, 0, 0, 0.1)',
                backgroundColor: '#ffb3c1',
                duration: 0,
                ease: 'back.out(1.7)'
            });
        });
        
        resumeButton.addEventListener('mouseleave', () => {
            gsap.to(resumeButton, {
                y: 0,
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
                backgroundColor: '#ffb3c1',
                duration: 0.0,
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
                color: '#ffb3c1',
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

// Initialize language toggle functionality - IMPROVED to handle immediate language switching
function initLanguageToggle() {
    const languageBtns = document.querySelectorAll('.language-btn');
    
    // English translations
    const enTranslations = {
        'nav-home': 'Home',
        'nav-projects': 'Projects',
        'nav-resume': 'Resume',
        'hero-title': 'Hi! I\'m',
        'hero-role': 'Data Science | NLP | Machine Learning | AI ',
        'hero-description': 'I specialize in Natural Language Processing, and build solutions that understand and generate human language.',
        'projects-title': 'Projects',
        'project1-title': 'Pink AI',
        'project1-desc': 'Interface that allows users to experiment with language models by adjusting LLM parameters for a customized experience. Built with Streamlit, it enables fine-tuning settings like temperature, top-k, and top-p to control response behavior.',
        'project2-title': 'COMPREVE',
        'project2-desc': 'Django-based web application designed for analyzing Twitch chat messages. It provides tools for uploading, searching, filtering, and analyzing chat data.',
        'project3-title': 'Image Classification',
        'project3-desc': 'Deep learning model using PyTorch to classify images through transfer learning. By leveraging pre-trained neural networks, it efficiently classifies 102 flower species with optimized training time and improved accuracy.',
        'project4-title': 'Toxic Comment Classification',
        'project4-desc': 'DistilBERT, GRU, and LSTM models to detect and classify toxic comments in online discussions, with evaluation through error analysis and visualizations.',
        'project5-title': 'Lyrics Generator',
        'project5-desc': 'Bi-LSTM and embedding models to predict and generate song lyrics based on an initial input sequence with categorical cross-entropy loss.',
        'project6-title': 'Fake News Detection',
        'project6-desc': 'Logistic regression and naive bayes approaches to identify and flag potentially false news articles.',
        'project7-title': 'BTC Predictor',
        'project7-desc': 'The XGBoost model is updated daily with fresh data for accurate bitcoin predictions, featuring data processing, model training, and visualization via a Streamlit dashboard.',
        'project8-title': 'SMS Spam Detection',
        'project8-desc': 'Multinomial-Gaussian-Bernoulli Naive Bayes, XGBoost, Random Forest, and Decision Tree models are used to distinguish between spam and legitimate messages, with methods to handle class imbalance and improve performance.',
        'project9-title': 'Sentiment analysis',
        'project9-desc': 'Multiple machine learning models, including RNN, TFIDF, and MLP, are trained and compared for sentiment analysis on both films and tweets.',
        'view-project': 'View',
        'resume-title': 'Resume',
        'resume-description': 'Check out my resume for more details on my experience and skills.',
        'resume-button': 'Download Resume',
        'footer-text': 'All rights reserved'
    };
    
    // French translations - FIXED: Changed AI to IA for French version
    const frTranslations = {
        'nav-home': 'Accueil',
        'nav-projects': 'Projets',
        'nav-resume': 'CV',
        'hero-title': 'Bonjour ! Je suis',
        'hero-role': 'Data Science | NLP / TAL | Machine Learning | IA ',
        'hero-description': 'Je me spécialise dans le traitement du langage naturel et construis des solutions qui comprennent et génèrent le langage humain.',
        'projects-title': 'Projets',
        'project1-title': 'Pink AI',
        'project1-desc': 'Interface développée avec Streamlit, permettant d\'expérimenter avec des modèles de langues en ajustant des paramètres LLM tels que la température, top-k et top-p pour une expérience personnalisée.',
        'project2-title': 'COMPREVE',
        'project2-desc': 'Application web basée sur Django conçue pour analyser les chats Twitch. Elle fournit des outils pour télécharger, rechercher, filtrer et analyser les données.',
        'project3-title': 'Classification d\'images',
        'project3-desc': 'La classification d\'images utilisant le deep learning avec PyTorch et l\'apprentissage par transfert pour classifier 102 espèces de fleurs avec un entraînement optimisé et une meilleure précision.',
        'project4-title': 'Classification de commentaires toxiques',
        'project4-desc': 'Le DistilBERT, GRU, et LSTM pour détecter et classifier les commentaires toxiques dans les discussions en ligne, avec une évaluation par l\'analyse des erreurs et des visualisations.',
        'project5-title': 'Générateur de paroles',
        'project5-desc': 'Le Bi-LSTM et d\'encodage pour prédire et générer des paroles de chanson à partir d\'une séquence d\'entrée initiale avec la perte d\'entropie croisée catégorielle.',
        'project6-title': 'Détection de fausses nouvelles',
        'project6-desc': 'La régression logistique et les approches bayésiennes naïves pour identifier et signaler les articles potentiellement faux.',
        'project7-title': 'BTC Predictor',
        'project7-desc': 'Le modèle XGBoost est mis à jour quotidiennement avec de nouvelles données pour des prédictions précises sur le Bitcoin, comprenant le traitement des données, l\'entraînement du modèle et la visualisation via un tableau de bord Streamlit.',
        'project8-title': 'Détection de spam SMS',
        'project8-desc': 'Le Multinomial-Gaussian-Bernoulli Naive Bayes, XGBoost, Random Forest et Decision Tree sont utilisés pour distinguer les messages spam des messages légitimes, avec des méthodes pour gérer le déséquilibre des classes et améliorer la performance.',
        'project9-title': 'Analyse de sentiment',
        'project9-desc': 'Plusieurs modèles d\'apprentissage automatique, dont RNN, TFIDF et MLP, sont entraînés et comparés pour l\'analyse de sentiment sur les films et les tweets.',
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
            
            // Force language switch even if typing is in progress
            // This is the key change - we now immediately allow language switching
            
            // Clean up typing instances to stop any current animations
            cleanupTypingInstances();
            
            // Update current language
            currentLanguage = lang;
            
            // Update active button display
            languageBtns.forEach(b => {
                b.classList.remove('active');
                b.classList.remove('pending');
            });
            btn.classList.add('active');
            
            // Update content based on language
            const translations = lang === 'en' ? enTranslations : frTranslations;
            updateLanguageContent(translations);
        });
    });
    
    // Remove the interval check for pending language changes since we now switch immediately
    
    function updateLanguageContent(translations) {
        // Clean up any existing typing instances
        cleanupTypingInstances();
        
        // Update navigation texts
        document.querySelector('nav ul li:nth-child(1) a').textContent = translations['nav-home'];
        document.querySelector('nav ul li:nth-child(2) a').textContent = translations['nav-projects'];
        document.querySelector('nav ul li:nth-child(3) a').textContent = translations['nav-resume'];
        
        // Prepare hero section for new typing
        const heroTitle = document.querySelector('#hero h1');
        if (heroTitle) {
            heroTitle.innerHTML = translations['hero-title'] + ' <span class="highlight" id="typed-text"></span>';
        }
        
        // Set up subtitle element - ensure it has fixed width to prevent text jumping
        const subtitle = document.querySelector('#hero .subtitle');
        if (subtitle) {
            // Set minimum width to prevent content shifting
            subtitle.style.minWidth = currentLanguage === 'fr' ? '300px' : '300px'; 
            subtitle.innerHTML = '<span id="typed-role"></span>';
        }
        
        // Update hero description with animation
        const description = document.querySelector('#hero .description');
        if (description) {
            // First remove old animation classes
            description.classList.remove('fade-in');
            
            // Force a reflow (repaint) before adding the class again
            void description.offsetWidth;
            
            // Set content
            description.textContent = translations['hero-description'];
            
            // Apply consistent layout and add animation
            description.style.maxWidth = '600px';
            description.style.display = 'block';
            description.classList.add('fade-in');
        }
        
        // Update projects section with smooth animation
        const projectsTitle = document.querySelector('#projects h2');
        if (projectsTitle) {
            gsap.to(projectsTitle, {
                opacity: 0, 
                duration: 0.3,
                onComplete: () => {
                    projectsTitle.textContent = translations['projects-title'];
                    gsap.to(projectsTitle, {opacity: 1, duration: 0.3});
                }
            });
        }
        
        // Update project cards
        const projectCards = document.querySelectorAll('.project-card');
        if (projectCards.length >= 6) {
            updateProjectCard(projectCards[0], 'project1', translations);
            updateProjectCard(projectCards[1], 'project2', translations);
            updateProjectCard(projectCards[2], 'project3', translations);
            updateProjectCard(projectCards[3], 'project4', translations);
            updateProjectCard(projectCards[4], 'project5', translations);
            updateProjectCard(projectCards[5], 'project6', translations);
            updateProjectCard(projectCards[6], 'project7', translations);
            updateProjectCard(projectCards[7], 'project8', translations);
            updateProjectCard(projectCards[8], 'project9', translations);
        }
        
        // Update resume section
        document.querySelector('#resume h2').textContent = translations['resume-title'];
        document.querySelector('#resume p').textContent = translations['resume-description'];
        document.querySelector('#resume .resume-button').textContent = translations['resume-button'];
        
        // Update footer
        document.querySelector('footer p').innerHTML = '&copy; <span id="current-year">' + new Date().getFullYear() + '</span> Reyhan Dalaman. ' + translations['footer-text'] + '.';
        
        // Start typing animation immediately
        setTimeout(() => {
            startTypingAnimation();
        }, 100);
    }
    
    // Helper function to update project cards
    function updateProjectCard(card, prefix, translations) {
        // Directly update the content without animation
        card.querySelector('h3').textContent = translations[prefix + '-title'];
        card.querySelector('p').textContent = translations[prefix + '-desc'];
        
        // Find and update the project link if it exists
        const projectLink = card.querySelector('.project-link');
        if (projectLink) {
            projectLink.textContent = translations['view-project'];
        }
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