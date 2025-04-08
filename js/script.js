// Initialize GSAP ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

// Global variables
let typedTextInstance = null;
let typedRoleInstance = null;
let currentLanguage = localStorage.getItem('preferredLanguage') || 'en';
let isTypingInProgress = false;
let canSwitchLanguage = true;

// Wait for the DOM to be fully loaded
// Scroll to top functionality
function initScrollToTop() {
    const scrollToTopBtn = document.getElementById('scroll-to-top');
    const scrollThreshold = 300; // Show button after scrolling 300px
    let isVisible = false;

    window.addEventListener('scroll', () => {
        const shouldBeVisible = window.scrollY > scrollThreshold;
        
        if (shouldBeVisible !== isVisible) {
            isVisible = shouldBeVisible;
            if (shouldBeVisible) {
                scrollToTopBtn.style.display = 'flex';
                // Force reflow
                scrollToTopBtn.offsetHeight;
                scrollToTopBtn.classList.add('visible');
            } else {
                scrollToTopBtn.classList.remove('visible');
                setTimeout(() => {
                    if (!isVisible) {
                        scrollToTopBtn.style.display = 'none';
                    }
                }, 600); // Match transition duration
            }
        }
    });

    scrollToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

document.addEventListener('DOMContentLoaded', function() {
    // Initialize animations
    initHeroAnimations();
    initScrollAnimations();
    
    // Initialize language and theme toggles
    initLanguageToggle();
    initThemeToggle();
    
    // Initialize navigation highlighting
    initNavHighlighting();
    
    // Initialize scroll to top
    initScrollToTop();
    
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
    const roleString = currentLanguage === 'fr' ? 'Data Science | NLP / TAL | Machine Learning | IA | Linguistique' : 'Data Science | NLP | Machine Learning | AI | Linguistics';
    
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
                    
                    // Handle special case for timeline section
                    if (section.id === 'experience') {
                        // Make timeline structure visible immediately
                        const timeline = section.querySelector('.timeline');
                        if (timeline) timeline.classList.add('visible');
                        
                        // Setup scroll handler for timeline items
                        const timelineItems = section.querySelectorAll('.timeline-item');
                        const timelineLine = section.querySelector('.timeline-line');
                        
                        // Initial setup - timeline line at 0 height
                        if (timelineLine) {
                            timelineLine.style.height = '0';
                            // Ensure the timeline container has proper z-index for masking
                            const timelineContainer = section.querySelector('.timeline-container');
                            if (timelineContainer) {
                                timelineContainer.style.zIndex = '10';
                            }
                        }
                        
                        // Add scroll handler to show items gradually
                        const handleTimelineScroll = () => {
                            const windowHeight = window.innerHeight;
                            let lastVisibleIndex = -1;
                            
                            // Check each item's visibility
                            timelineItems.forEach((item, index) => {
                                const itemRect = item.getBoundingClientRect();
                                const isVisible = itemRect.top < windowHeight * 0.8 && itemRect.bottom > 0;
                                
                                if (isVisible) {
                                    item.classList.add('visible');
                                    lastVisibleIndex = index;
                                } else if (itemRect.top > windowHeight) {
                                    item.classList.remove('visible');
                                }
                            });
                            
                            // Update line height based on visible items
                            if (timelineLine && lastVisibleIndex >= 0) {
                                const firstDot = section.querySelector('.timeline-dot');
                                const lastDot = section.querySelector('.timeline-item:last-child .timeline-dot');
                                
                                if (firstDot && lastDot) {
                                    const firstDotRect = firstDot.getBoundingClientRect();
                                    const lastDotRect = lastDot.getBoundingClientRect();
                                    const totalHeight = lastDotRect.top - firstDotRect.top;
                                    const progress = (lastVisibleIndex + 1) / timelineItems.length;
                                    
                                    // Set height based on actual dot positions
                                    const targetHeight = totalHeight * progress;
                                    timelineLine.style.height = `${targetHeight}px`;
                                }
                            } else {
                                timelineLine.style.height = '0';
                            }
                        };
                        
                        // Initial check
                        handleTimelineScroll();
                        
                        // Add scroll listener
                        window.addEventListener('scroll', handleTimelineScroll);
                    }
                    
                    // Handle special case for projects section - slower animation
                    if (section.id === 'projects') {
                        const transitionDelay = 400;
                        
                        // Animate child items with staggered delay
                        const items = section.querySelectorAll('.animate-item');
                        items.forEach((item, index) => {
                            setTimeout(() => {
                                item.classList.add('visible');
                            }, transitionDelay + (index * 150));
                        });
                    } else {
                        // Default animation for other sections
                        const transitionDelay = 200;
                        
                        // Animate child items with staggered delay
                        const items = section.querySelectorAll('.animate-item');
                        items.forEach((item, index) => {
                            setTimeout(() => {
                                item.classList.add('visible');
                            }, transitionDelay + (index * 100));
                        });
                    }
                }
            } else {
                // Remove visible class if section is not in viewport
                section.classList.remove('visible');
                
                // Reset timeline line height if it's the experience section
                if (section.id === 'experience') {
                    const timelineLine = section.querySelector('.timeline-line');
                    if (timelineLine) {
                        timelineLine.style.height = '0';
                    }
                }
                
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
        });
        
        card.addEventListener('mouseleave', () => {
            gsap.to(card, {
                y: 0,
                scale: 1,
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
                duration: 0.2,
                ease: 'power2.out'
            });
        });
    });
    
    // Update the language toggle functionality to handle cards without buttons
    function updateProjectCard(card, prefix, translations) {
        card.querySelector('h3').textContent = translations[prefix + '-title'];
        card.querySelector('p').textContent = translations[prefix + '-desc'];
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
        'nav-experience': 'Experience',
        'nav-resume': 'Resume',
        'nav-contact': 'Contact',
        'hero-title': 'Hi! I\'m',
        'hero-role': 'Data Science | NLP | Machine Learning | AI | Linguistics ',
        'hero-description': 'I specialize in Natural Language Processing, and build solutions that understand and generate human language.',
        'projects-title': 'Projects',
        'project1-title': 'COMPREVE',
        'project1-desc': 'Django-based web application designed for analyzing Twitch chat messages. It provides tools for uploading, searching, filtering, and analyzing chat data.',
        'project2-title': 'Pink AI',
        'project2-desc': 'Interface that allows users to experiment with language models by adjusting LLM parameters for a customized experience. Built with Streamlit, it enables fine-tuning settings like temperature, top-k, and top-p to control response behavior.',
        'project3-title': 'Toxic Comment Classification',
        'project3-desc': 'DistilBERT, GRU, and LSTM models to detect and classify toxic comments in online discussions, with evaluation through error analysis and visualizations.',
        'project4-title': 'SMS Spam Detection',
        'project4-desc': 'Multinomial-Gaussian-Bernoulli Naive Bayes, XGBoost, Random Forest, and Decision Tree models are used to distinguish between spam and legitimate messages, with methods to handle class imbalance and improve performance.',
        'project5-title': 'Fake News Detection',
        'project5-desc': 'Logistic regression and naive bayes approaches to identify and flag potentially false news articles.',
        'project6-title': 'Lyrics Generator',
        'project6-desc': 'Bi-LSTM and embedding models to predict and generate song lyrics based on an initial input sequence with categorical cross-entropy loss.',
        'project7-title': 'Sentiment analysis',
        'project7-desc': 'Multiple machine learning models, including RNN, TFIDF, and MLP, are trained and compared for sentiment analysis on both films and tweets.',
        'project8-title': 'BTC Predictor',
        'project8-desc': 'The XGBoost model is updated daily with fresh data for accurate bitcoin predictions, featuring data processing, model training, and visualization via a Streamlit dashboard.',
        'project9-title': 'Image Classification',
        'project9-desc': 'Deep learning model using PyTorch to classify images through transfer learning. By leveraging pre-trained neural networks, it efficiently classifies 102 flower species with optimized training time and improved accuracy.',
        'resume-title': 'Resume',
        'resume-description': 'Click here to download my resume.',
        'resume-button': 'Download',
        'footer-text': 'All rights reserved',
        'developed-by': 'Developed by rey-dal'
    };
    
    // French translations 
    const frTranslations = {
        'nav-home': 'Accueil',
        'nav-projects': 'Projets',
        'nav-experience': 'Expérience',
        'nav-resume': 'CV',
        'nav-contact': 'Contact',
        'hero-title': 'Bonjour ! Je suis',
        'hero-role': 'Data Science | NLP / TAL | Machine Learning | IA | Linguistique',
        'hero-description': 'Je me spécialise dans le traitement du langage naturel et construis des solutions qui comprennent et génèrent le langage humain.',
        'projects-title': 'Projets',
        'project1-title': 'COMPREVE',
        'project1-desc': 'Application web basée sur Django conçue pour analyser les chats Twitch. Elle fournit des outils pour télécharger, rechercher, filtrer et analyser les données.',
        'project2-title': 'Pink AI',
        'project2-desc': 'Interface développée avec Streamlit, permettant d\'expérimenter avec des modèles de langues en ajustant des paramètres LLM tels que la température, top-k et top-p pour une expérience personnalisée.',
        'project3-title': 'Classification de commentaires toxiques',
        'project3-desc': 'Le DistilBERT, GRU, et LSTM pour détecter et classifier les commentaires toxiques dans les discussions en ligne, avec une évaluation par l\'analyse des erreurs et des visualisations.',
        'project4-title': 'Détection de spam SMS',
        'project4-desc': 'Le Multinomial-Gaussian-Bernoulli Naive Bayes, XGBoost, Random Forest et Decision Tree sont utilisés pour distinguer les messages spam des messages légitimes, avec des méthodes pour gérer le déséquilibre des classes et améliorer la performance.',
        'project5-title': 'Détection de fausses nouvelles',
        'project5-desc': 'La régression logistique et les approches bayésiennes naïves pour identifier et signaler les articles potentiellement faux.',
        'project6-title': 'Générateur de paroles',
        'project6-desc': 'Le Bi-LSTM et d\'encodage pour prédire et générer des paroles de chanson à partir d\'une séquence d\'entrée initiale avec la perte d\'entropie croisée catégorielle.',
        'project7-title': 'Analyse de sentiment',
        'project7-desc': 'Plusieurs modèles d\'apprentissage automatique, dont RNN, TFIDF et MLP, sont entraînés et comparés pour l\'analyse de sentiment sur les films et les tweets.',
        'project8-title': 'BTC Predictor',
        'project8-desc': 'Le modèle XGBoost est mis à jour quotidiennement avec de nouvelles données pour des prédictions précises sur le Bitcoin, comprenant le traitement des données, l\'entraînement du modèle et la visualisation via un tableau de bord Streamlit.',
        'project9-title': 'Classification d\'images',
        'project9-desc': 'La classification d\'images utilisant le deep learning avec PyTorch et l\'apprentissage par transfert pour classifier 102 espèces de fleurs avec un entraînement optimisé et une meilleure précision.',
        'resume-title': 'CV',
        'resume-description': 'Cliquez pour télécharger mon CV.',
        'resume-button': 'Télécharger',
        'footer-text': 'Tous droits réservés',
        'developed-by': 'Développé par rey-dal',
        // Experience section translations
        'exp-master2-title': 'Master 2, Industries de la Langue',
        'exp-master2-school': 'Université Grenoble Alpes, France',
        'exp-master2-desc': 'Formation en traitement automatique des langues (TAL), apprentissage automatique et programmation.',
        'exp-master2-date': 'Septembre 2024 – Présent',
        'exp-master1-title': 'Master 1, Technologies des Langues',
        'exp-master1-school': 'Université de Turin, Italie',
        'exp-master1-date': 'Septembre 2023 – Juillet 2024',
        'exp-nlp-title': 'Ingénieure TAL / NLP',
        'exp-nlp-company': 'Steerway & LORIA, Nancy, France',
        'exp-nlp-desc': 'Optimisation des modèles de langue d\'un assistant de codage via la quantification et le pruning.',
        'exp-nlp-date': 'Mars 2025 – Présent',
        'exp-projet-title': 'Projet Pro',
        'exp-projet-company': 'UR ReSO, Université de Montpellier Paul-Valéry, Montpellier, France',
        'exp-projet-desc': 'Développement d\'un site web d\'exploration de corpus lié aux violences en ligne sur Twitch',
        'exp-projet-date': 'Décembre 2024 – Mars 2025',
        'exp-ai-title': 'Intelligence Artificielle & Machine Learning Team',
        'exp-ai-company': 'DiaspUra, Paris, France',
        'exp-ai-desc': 'Conception, développement et gestion d\'une solution d\'IA conversationnelle.',
        'exp-ai-date': 'Janvier 2024 – Juin 2024'
    };
    
    // Set active language button based on saved preference
    languageBtns.forEach(btn => {
        // First remove active class from all buttons
        btn.classList.remove('active');
        // Then add it only to the selected one
        if (btn.getAttribute('data-lang') === currentLanguage) {
            btn.classList.add('active');
        }
    });
    
    // Apply saved language on page load
    if (currentLanguage === 'fr') {
        updateLanguageContent(frTranslations);
    }
    
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
            
            // Save language preference to localStorage
            localStorage.setItem('preferredLanguage', lang);
            
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
        
    function updateLanguageContent(translations) {
        // Clean up any existing typing instances
        cleanupTypingInstances();
        
        // Update header navigation texts
        document.querySelector('header nav ul li:nth-child(1) a').textContent = translations['nav-home'];
        document.querySelector('header nav ul li:nth-child(2) a').textContent = translations['nav-projects'];
        document.querySelector('header nav ul li:nth-child(3) a').textContent = translations['nav-experience'];
        document.querySelector('header nav ul li:nth-child(4) a').textContent = translations['nav-resume'];
        document.querySelector('header nav ul li:nth-child(5) a').textContent = translations['nav-contact'];
        
        // Update footer navigation texts
        document.querySelector('footer nav ul li:nth-child(1) a').textContent = translations['nav-home'];
        document.querySelector('footer nav ul li:nth-child(2) a').textContent = translations['nav-projects'];
        document.querySelector('footer nav ul li:nth-child(3) a').textContent = translations['nav-experience'];
        document.querySelector('footer nav ul li:nth-child(4) a').textContent = translations['nav-resume'];
        document.querySelector('footer nav ul li:nth-child(5) a').textContent = translations['nav-contact'];

        // Update descriptions
        const descriptions = document.querySelectorAll('.contact-description');
        descriptions.forEach(desc => {
            if (desc.closest('#projects')) {
                desc.textContent = currentLanguage === 'en'
                    ? 'My personal and academic projects.'
                    : 'Mes projets personnels et académiques.';
            } else if (desc.closest('#experience')) {
                desc.textContent = currentLanguage === 'en'
                    ? 'My academic and professional experience.'
                    : 'Mon expérience académique et professionnelle.';
            } else if (desc.closest('#resume')) {
                desc.textContent = currentLanguage === 'en'
                    ? 'Click here to download my resume.'
                    : 'Cliquez pour télécharger mon CV.';
            } else if (desc.closest('#contact')) {
                desc.textContent = currentLanguage === 'en'
                    ? 'Feel free to reach out for collaborations, questions, or just to say hello!'
                    : 'N\'hésitez pas à me contacter pour des collaborations, des questions ou simplement pour dire bonjour !';
            }
        });

        // Update contact form placeholders
        if (document.getElementById('name')) {
            document.getElementById('name').placeholder = currentLanguage === 'en' ? 'Name' : 'Nom, Prénom';
        }
        if (document.getElementById('email')) {
            document.getElementById('email').placeholder = 'Email';
        }
        if (document.getElementById('message')) {
            document.getElementById('message').placeholder = 'Message';
        }
        if (document.querySelector('.submit-btn')) {
            document.querySelector('.submit-btn').textContent = currentLanguage === 'en' ? 'Send' : 'Envoyer';
        }
        
        // Prepare hero section for new typing
        const heroTitle = document.querySelector('#hero h1');
        if (heroTitle) {
            heroTitle.innerHTML = translations['hero-title'] + ' <span class="highlight" id="typed-text"></span>';
        }
        
        // Set up subtitle element - ensure it has fixed width to prevent text jumping
        const subtitle = document.querySelector('#hero .subtitle');
        if (subtitle) {
            // Set minimum width to prevent content shifting
            subtitle.style.minWidth = '300px';
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
        
        // Restart typing animation after language switch
        setTimeout(() => {
            startTypingAnimation();
        }, 100);
        
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
        // Update experience section
        const experienceTitle = document.querySelector('#experience h2');
        if (experienceTitle) {
            experienceTitle.textContent = translations['nav-experience'];
        }
        
        // Update experience timeline items
        const timelineItems = document.querySelectorAll('#experience .timeline-item');
        if (timelineItems.length >= 5) {
            // Master 2
            updateExperienceItem(timelineItems[0], {
                title: currentLanguage === 'en' ? 'Master 2, Linguistic Data Sciences' : translations['exp-master2-title'],
                school: currentLanguage === 'en' ? 'Grenoble Alpes University, France' : translations['exp-master2-school'],
                desc: currentLanguage === 'en' ? 'Advanced studies in natural language processing (NLP), machine learning, and programming.' : translations['exp-master2-desc'],
                date: currentLanguage === 'en' ? 'September 2024 - Current' : translations['exp-master2-date']
            });
            
            // Master 1
            updateExperienceItem(timelineItems[1], {
                title: currentLanguage === 'en' ? 'Master 1, Language Technologies' : translations['exp-master1-title'],
                school: currentLanguage === 'en' ? 'University of Turin, Italy' : translations['exp-master1-school'],
                desc: currentLanguage === 'en' ? 'Formation in natural language processing (NLP), machine learning, and programming.' : translations['exp-master1-desc'],
                date: currentLanguage === 'en' ? 'September 2023 - July 2024' : translations['exp-master1-date']
            });
            
            // NLP Engineer
            updateExperienceItem(timelineItems[2], {
                title: currentLanguage === 'en' ? 'NLP Engineer' : translations['exp-nlp-title'],
                school: currentLanguage === 'en' ? 'Steerway & LORIA, Nancy, France' : translations['exp-nlp-company'],
                desc: currentLanguage === 'en' ? 'Optimizing a code assistant\'s language models through quantization and pruning.' : translations['exp-nlp-desc'],
                date: currentLanguage === 'en' ? 'March 2025 - Current' : translations['exp-nlp-date']
            });
            
            // Projet Pro
            updateExperienceItem(timelineItems[3], {
                title: currentLanguage === 'en' ? 'Professional Project' : translations['exp-projet-title'],
                school: currentLanguage === 'en' ? 'UR ReSO, Université de Montpellier Paul-Valéry, Montpellier, France' : translations['exp-projet-company'],
                desc: currentLanguage === 'en' ? 'Development of a corpus exploration website related to online violence on Twitch.' : translations['exp-projet-desc'],
                date: currentLanguage === 'en' ? 'December 2024 - March 2025' : translations['exp-projet-date']
            });
            
            // AI & ML Team
            updateExperienceItem(timelineItems[4], {
                title: currentLanguage === 'en' ? 'Artificial Intelligence & Machine Learning Team' : translations['exp-ai-title'],
                school: currentLanguage === 'en' ? 'DiaspUra, Paris, France' : translations['exp-ai-company'],
                desc: currentLanguage === 'en' ? 'Design, development, and management of a conversational AI solution.' : translations['exp-ai-desc'],
                date: currentLanguage === 'en' ? 'January 2024 - June 2024' : translations['exp-ai-date']
            });
        }

        // Update resume section
        document.querySelector('#resume h2').textContent = translations['resume-title'];
        document.querySelector('#resume p').textContent = translations['resume-description'];
        document.querySelector('#resume .resume-button').textContent = translations['resume-button'];
        
        // Update footer
        document.querySelector('footer .copyright').innerHTML = '&copy; <span id="current-year">' + new Date().getFullYear() + '</span> Reyhan Dalaman. ' + translations['footer-text'] + '.';
        document.querySelector('footer .developed-by a').innerHTML = translations['developed-by'] + ' <i class="fas fa-heart heart-icon"></i>';
        
        // Typing animation is already started earlier in the function
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
    
    // Helper function to update experience timeline items
    function updateExperienceItem(item, content) {
        if (!item) return;
        
        const titleEl = item.querySelector('h3');
        const schoolEl = item.querySelector('h4');
        const descEl = item.querySelector('p:not(.timeline-date)');
        const dateEl = item.querySelector('.timeline-date');
        
        if (titleEl) titleEl.textContent = content.title;
        if (schoolEl) schoolEl.textContent = content.school;
        if (descEl) descEl.textContent = content.desc;
        if (dateEl) dateEl.textContent = content.date;
    }
}

// Initialize theme toggle functionality
function initThemeToggle() {
    const themeBtns = document.querySelectorAll('.theme-btn');
    const htmlElement = document.documentElement;
    
    // Set active theme button based on saved preference
    const savedTheme = localStorage.getItem('preferredTheme') || 'light';
    htmlElement.setAttribute('data-theme', savedTheme);
    themeBtns.forEach(btn => {
        // First remove active class from all buttons
        btn.classList.remove('active');
        // Then add it only to the selected one
        if (btn.getAttribute('data-theme') === savedTheme) {
            btn.classList.add('active');
        }
    });
    
    themeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all buttons
            themeBtns.forEach(b => b.classList.remove('active'));
            
            // Add active class to clicked button
            btn.classList.add('active');
            
            // Get theme
            const theme = btn.getAttribute('data-theme');
            
            // Save theme preference to localStorage
            localStorage.setItem('preferredTheme', theme);
            
            // Update theme
            htmlElement.setAttribute('data-theme', theme);
        });
    });
}

// Handle contact form submission
function handleSubmit(event) {
    if (event) {
        event.preventDefault();
    }
    
    const form = document.getElementById('contactForm');
    const submitButton = form.querySelector('.submit-btn');
    const originalButtonText = submitButton.textContent;
    
    // Get form data
    const formData = {
        name: document.getElementById('name').value.trim(),
        email: document.getElementById('email').value.trim(),
        message: document.getElementById('message').value.trim()
    };
    
    // Validate form data
    if (!formData.name || !formData.email || !formData.message) {
        return false;
    }
    
    // Disable button and show loading state
    submitButton.disabled = true;
    submitButton.textContent = currentLanguage === 'fr' ? 'Envoi en cours... Un instant !' : 'Sending... Please wait !';
    
    // Send form data to Formspree
    fetch('https://formspree.io/f/xnnpogqg', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
    })
    .then(response => response.json())
    .then(data => {
        // Show success message
        submitButton.textContent = currentLanguage === 'fr' ? 'Envoyé!' : 'Sent!';
        form.reset();
        
        // Reset button after 2 seconds
        setTimeout(() => {
            submitButton.disabled = false;
            submitButton.textContent = originalButtonText;
        }, 2000);
    })
    .catch(error => {
        // Show error message
        submitButton.textContent = currentLanguage === 'fr' ? 'Erreur' : 'Error';
        console.error('Error:', error);
        
        // Reset button after 2 seconds
        setTimeout(() => {
            submitButton.disabled = false;
            submitButton.textContent = originalButtonText;
        }, 2000);
    });
    
    return false;
}

// Initialize form handling when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', handleSubmit);
    }
});