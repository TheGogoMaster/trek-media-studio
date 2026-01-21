// Trek Media Studios Website - Complete JavaScript

// Sync admin beats to website - DISABLED to keep user beats
function syncBeatsToWebsite() {
    console.log('Beat sync disabled - user beats preserved');
    return; // Function stops here - doesn't clear user beats
}

document.addEventListener('DOMContentLoaded', function() {
    // ==================== NOTIFICATION SYSTEM ====================
    function showNotification(message) {
        // Remove existing notification
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }
        
        // Create new notification
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.innerHTML = `
            <span>${message}</span>
            <button class="close-notification">&times;</button>
        `;
        
        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, var(--accent-red), #ff5500);
            color: white;
            padding: 15px 20px;
            border-radius: 10px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 15px;
            z-index: 3000;
            box-shadow: 0 5px 20px rgba(0, 0, 0, 0.4);
            animation: slideIn 0.3s ease;
            max-width: 350px;
            font-weight: 500;
        `;
        
        const closeBtn = notification.querySelector('.close-notification');
        closeBtn.style.cssText = `
            background: none;
            border: none;
            color: white;
            font-size: 1.5rem;
            cursor: pointer;
            padding: 0;
            line-height: 1;
            transition: transform 0.2s;
        `;
        
        closeBtn.addEventListener('click', () => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        });
        
        closeBtn.addEventListener('mouseover', () => {
            closeBtn.style.transform = 'scale(1.2)';
        });
        
        closeBtn.addEventListener('mouseout', () => {
            closeBtn.style.transform = 'scale(1)';
        });
        
        document.body.appendChild(notification);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.style.animation = 'slideOut 0.3s ease';
                setTimeout(() => notification.remove(), 300);
            }
        }, 5000);
    }
    
    // Add CSS animations for notifications
    const notificationStyle = document.createElement('style');
    notificationStyle.textContent = `
        @keyframes slideIn {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        @keyframes slideOut {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(100%);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(notificationStyle);
    
    // ==================== THEME MANAGEMENT ====================
    const themeButtons = document.querySelectorAll('.theme-btn');
    const body = document.body;
    
    // Load saved theme from localStorage
    const savedTheme = localStorage.getItem('websiteTheme') || 'dark';
    body.setAttribute('data-theme', savedTheme);
    
    // Set active theme button
    themeButtons.forEach(btn => {
        if (btn.getAttribute('data-theme') === savedTheme) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
    
    // Theme switching functionality
    themeButtons.forEach(button => {
        button.addEventListener('click', function() {
            const theme = this.getAttribute('data-theme');
            
            // Update theme
            body.setAttribute('data-theme', theme);
            
            // Update active button
            themeButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Save to localStorage
            localStorage.setItem('websiteTheme', theme);
            
            // Show notification
            showNotification(`Theme changed to ${theme.charAt(0).toUpperCase() + theme.slice(1)} Mode`);
        });
    });
    
    // ==================== NAVIGATION ====================
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    // Mobile menu toggle
    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            navLinks.classList.toggle('active');
            this.innerHTML = navLinks.classList.contains('active') ? 
                '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';
        });
    }
    
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                // Close mobile menu if open
                navLinks.classList.remove('active');
                menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
                
                // Smooth scroll to target
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.navbar') && navLinks.classList.contains('active')) {
            navLinks.classList.remove('active');
            menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
        }
    });
    
    // ==================== AUDIO PLAYER ====================
    const audioPlayer = {
        audio: null,
        isPlaying: false,
        currentAudioUrl: null,
        currentBeatTitle: '',
        progressInterval: null,
        
        init: function() {
            this.audio = new Audio();
            this.audio.volume = 0.7;
            
            // Player controls
            const playBtn = document.getElementById('playBtn');
            const progressBar = document.getElementById('progressBar');
            const progressContainer = document.querySelector('.progress-container');
            const volumeSlider = document.getElementById('volumeSlider');
            const currentTimeEl = document.getElementById('currentTime');
            const totalTimeEl = document.getElementById('totalTime');
            
            // Play/Pause button
            playBtn.addEventListener('click', () => {
                if (!this.currentAudioUrl) {
                    showNotification('Please select a beat to preview first');
                    return;
                }
                
                if (this.isPlaying) {
                    this.pause();
                } else {
                    this.play();
                }
            });
            
            // Progress bar click
            progressContainer.addEventListener('click', (e) => {
                if (!this.currentAudioUrl || !this.audio.duration) return;
                
                const rect = progressContainer.getBoundingClientRect();
                const pos = (e.clientX - rect.left) / rect.width;
                this.audio.currentTime = pos * this.audio.duration;
            });
            
            // Volume control
            volumeSlider.addEventListener('input', (e) => {
                this.audio.volume = e.target.value / 100;
            });
            
            // Audio ended
            this.audio.addEventListener('ended', () => {
                this.stop();
            });
            
            // Initialize progress update
            this.startProgressUpdate();
        },
        
        startProgressUpdate: function() {
            this.progressInterval = setInterval(() => {
                if (this.audio && this.audio.duration) {
                    const progressPercent = (this.audio.currentTime / this.audio.duration) * 100;
                    document.getElementById('progressBar').style.width = `${progressPercent}%`;
                    
                    document.getElementById('currentTime').textContent = 
                        this.formatTime(this.audio.currentTime);
                    document.getElementById('totalTime').textContent = 
                        this.formatTime(this.audio.duration);
                }
            }, 100);
        },
        
        play: function() {
            if (!this.currentAudioUrl) return;
            
            // For demo purposes, simulate audio
            this.isPlaying = true;
            document.getElementById('playBtn').innerHTML = '<i class="fas fa-pause"></i>';
            
            // In a real implementation, you would play actual audio:
            // this.audio.play();
            
            // Simulate audio playback for demo
            showNotification(`Now playing: ${this.currentBeatTitle}`);
        },
        
        pause: function() {
            this.isPlaying = false;
            document.getElementById('playBtn').innerHTML = '<i class="fas fa-play"></i>';
            
            // In a real implementation:
            // this.audio.pause();
        },
        
        stop: function() {
            this.isPlaying = false;
            document.getElementById('playBtn').innerHTML = '<i class="fas fa-play"></i>';
            document.getElementById('progressBar').style.width = '0%';
            document.getElementById('currentTime').textContent = '0:00';
            
            // In a real implementation:
            // this.audio.pause();
            // this.audio.currentTime = 0;
        },
        
        loadAudio: function(url, title) {
            this.currentAudioUrl = url;
            this.currentBeatTitle = title;
            
            // Update UI
            document.getElementById('nowPlaying').textContent = title;
            document.getElementById('playBtn').innerHTML = '<i class="fas fa-play"></i>';
            document.getElementById('progressBar').style.width = '0%';
            document.getElementById('currentTime').textContent = '0:00';
            document.getElementById('totalTime').textContent = '0:30';
            
            this.isPlaying = false;
        },
        
        formatTime: function(seconds) {
            const mins = Math.floor(seconds / 60);
            const secs = Math.floor(seconds % 60);
            return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
        }
    };
    
    // Initialize audio player
    audioPlayer.init();
    
    // ==================== BEAT MANAGEMENT ====================
    const addBeatBtn = document.getElementById('addBeatBtn');
    const beatsGrid = document.getElementById('beatsGrid');
    
    // Load saved beats on page load
    function loadSavedBeats() {
        const saved = localStorage.getItem('userBeats');
        if (saved) {
            try {
                const beats = JSON.parse(saved);
                beatsGrid.innerHTML = '';
                
                beats.forEach(beat => {
                    const beatCard = document.createElement('div');
                    beatCard.className = 'beat-card';
                    beatCard.innerHTML = `
                        <div class="beat-header">
                            <span class="beat-badge">MY BEAT</span>
                            <h3 class="beat-title">${beat.title}</h3>
                        </div>
                        <div class="beat-info">
                            <p><i class="fas fa-music"></i> Genre: <strong>${beat.genre}</strong></p>
                            <p><i class="fas fa-tachometer-alt"></i> BPM: <strong>${beat.bpm}</strong></p>
                            <p><i class="fas fa-key"></i> Key: <strong>${beat.key}</strong></p>
                        </div>
                        <div class="beat-pricing">
                            <div class="price-option">
                                <span class="price-label">Lease</span>
                                <span class="price">${beat.lease}</span>
                            </div>
                            <div class="price-option">
                                <span class="price-label">Exclusive</span>
                                <span class="price">${beat.exclusive}</span>
                            </div>
                        </div>
                        <div class="beat-actions">
                            <button class="btn-preview" data-audio="${beat.audio || '#'}" data-title="${beat.title}">
                                <i class="fas fa-play-circle"></i> Preview
                            </button>
                            <button class="btn-buy" data-title="${beat.title}">
                                <i class="fas fa-shopping-cart"></i> Purchase
                            </button>
                        </div>
                    `;
                    beatsGrid.appendChild(beatCard);
                });
            } catch(e) {
                console.log('No saved beats found');
            }
        }
    }
    
    // Load saved beats instead of example beats
    loadSavedBeats();
    
    // Add beat functionality
    if (addBeatBtn) {
        addBeatBtn.addEventListener('click', function() {
            const title = document.getElementById('beatTitle').value.trim();
            const genre = document.getElementById('beatGenre').value.trim();
            const bpm = document.getElementById('beatBPM').value.trim();
            const key = document.getElementById('beatKey').value.trim();
            const leasePrice = document.getElementById('beatPriceLease').value.trim() || '50';
            const exclusivePrice = document.getElementById('beatPriceExclusive').value.trim() || '200';
            const audioUrl = document.getElementById('beatAudioUrl').value.trim() || '#';
            
            // Basic validation
            if (!title || !genre || !bpm || !key) {
                showNotification('Please fill in all required fields: Title, Genre, BPM, and Key');
                return;
            }
            
            // Create new beat card
            const beatCard = document.createElement('div');
            beatCard.className = 'beat-card';
            beatCard.innerHTML = `
                <div class="beat-header">
                    <span class="beat-badge">NEW</span>
                    <h3 class="beat-title">${title.toUpperCase()}</h3>
                </div>
                <div class="beat-info">
                    <p><i class="fas fa-music"></i> Genre: <strong>${genre}</strong></p>
                    <p><i class="fas fa-tachometer-alt"></i> BPM: <strong>${bpm}</strong></p>
                    <p><i class="fas fa-key"></i> Key: <strong>${key}</strong></p>
                </div>
                <div class="beat-pricing">
                    <div class="price-option">
                        <span class="price-label">Lease</span>
                        <span class="price">$${leasePrice}</span>
                    </div>
                    <div class="price-option">
                        <span class="price-label">Exclusive</span>
                        <span class="price">$${exclusivePrice}</span>
                    </div>
                </div>
                <div class="beat-actions">
                    <button class="btn-preview" data-audio="${audioUrl}" data-title="${title}">
                        <i class="fas fa-play-circle"></i> Preview
                    </button>
                    <button class="btn-buy" data-title="${title}">
                        <i class="fas fa-shopping-cart"></i> Purchase
                    </button>
                </div>
            `;
            
            // Add to grid at the beginning
            beatsGrid.insertBefore(beatCard, beatsGrid.firstChild);
            
            // Clear form
            document.getElementById('beatTitle').value = '';
            document.getElementById('beatGenre').value = '';
            document.getElementById('beatBPM').value = '';
            document.getElementById('beatKey').value = '';
            document.getElementById('beatPriceLease').value = '';
            document.getElementById('beatPriceExclusive').value = '';
            document.getElementById('beatAudioUrl').value = '';
            
            // SAVE beats to localStorage
            saveCurrentBeats();
            
            // Show success message
            showNotification('Beat added and saved!');
        });
    }
    
    // Function to save ALL current beats
    function saveCurrentBeats() {
        const beats = [];
        document.querySelectorAll('.beat-card').forEach(card => {
            beats.push({
                title: card.querySelector('.beat-title').textContent,
                genre: card.querySelector('.beat-info p:nth-child(1) strong').textContent,
                bpm: card.querySelector('.beat-info p:nth-child(2) strong').textContent,
                key: card.querySelector('.beat-info p:nth-child(3) strong').textContent,
                lease: card.querySelector('.price-option:nth-child(1) .price').textContent,
                exclusive: card.querySelector('.price-option:nth-child(2) .price').textContent,
                audio: card.querySelector('.btn-preview').getAttribute('data-audio') || '#'
            });
        });
        localStorage.setItem('userBeats', JSON.stringify(beats));
    }
    
    // Beat preview and purchase functionality
    document.addEventListener('click', function(e) {
        // Preview button
        if (e.target.closest('.btn-preview')) {
            const button = e.target.closest('.btn-preview');
            const beatTitle = button.getAttribute('data-title');
            const audioUrl = button.getAttribute('data-audio');
            
            audioPlayer.loadAudio(audioUrl, beatTitle);
            audioPlayer.play();
        }
        
        // Buy button
        if (e.target.closest('.btn-buy')) {
            const button = e.target.closest('.btn-buy');
            const beatTitle = button.getAttribute('data-title');
            
            openPurchaseModal(beatTitle);
        }
    });
    
    // ==================== PURCHASE MODAL ====================
    const purchaseModal = document.getElementById('purchaseModal');
    const closeModal = document.querySelector('.close-modal');
    
    function openPurchaseModal(beatTitle) {
        document.getElementById('modalBeatTitle').textContent = beatTitle;
        
        // Update WhatsApp link with beat title
        const whatsappBtn = document.querySelector('.btn-whatsapp');
        const encodedTitle = encodeURIComponent(`Hi GogoMaster, I want to purchase the beat "${beatTitle}" - Please send me pricing and licensing details.`);
        whatsappBtn.href = `https://wa.me/265996017545?text=${encodedTitle}`;
        
        // Update Email link with beat title
        const emailBtn = document.querySelector('.btn-email');
        const encodedSubject = encodeURIComponent(`Beat Purchase: ${beatTitle}`);
        emailBtn.href = `mailto:iloventhanda@gmail.com?subject=${encodedSubject}&body=Hi%20GogoMaster,%0D%0A%0D%0AI%20would%20like%20to%20purchase%20the%20beat%20"${encodeURIComponent(beatTitle)}".%0D%0A%0D%0APlease%20send%20me%20the%20pricing%20and%20licensing%20details.%0D%0A%0D%0AThanks!`;
        
        purchaseModal.style.display = 'flex';
    }
    
    function closePurchaseModal() {
        purchaseModal.style.display = 'none';
    }
    
    if (closeModal) {
        closeModal.addEventListener('click', closePurchaseModal);
    }
    
    // Close modal when clicking outside
    window.addEventListener('click', function(e) {
        if (e.target === purchaseModal) {
            closePurchaseModal();
        }
    });
    
    // Close modal with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && purchaseModal.style.display === 'flex') {
            closePurchaseModal();
        }
    });
    
    // ==================== CONTACT FORM ====================
    const messageForm = document.getElementById('messageForm');
    
    if (messageForm) {
        messageForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form values
            const name = this.querySelector('input[type="text"]').value;
            const email = this.querySelector('input[type="email"]').value;
            const service = this.querySelector('select').value;
            const message = this.querySelector('textarea').value;
            
            // Service names mapping
            const serviceNames = {
                'beat': 'Beat Purchase',
                'mixing': 'Mixing/Mastering',
                'recording': 'Studio Recording',
                'lessons': 'Production Lessons',
                'other': 'Other Inquiry'
            };
            
            const serviceText = serviceNames[service] || 'General Inquiry';
            
            // Create mailto link
            const mailtoLink = `mailto:iloventhanda@gmail.com?subject=${encodeURIComponent(`${serviceText} - ${name}`)}&body=${encodeURIComponent(
`Name: ${name}
Email: ${email}
Service: ${serviceText}

Message:
${message}

---`
            )}`;
            
            // Open email client
            window.location.href = mailtoLink;
            
            // Reset form
            this.reset();
            
            // Show confirmation
            showNotification('Your email client will open. Please send the message to complete.');
        });
    }
    
    // ==================== ENHANCEMENTS ====================
    
    // 1. Active Navigation Highlight
    function updateActiveNav() {
        const sections = document.querySelectorAll('section');
        const navLinks = document.querySelectorAll('.nav-links a');
        
        let currentSection = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.clientHeight;
            
            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                currentSection = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSection}`) {
                link.classList.add('active');
            }
        });
    }
    
    // 2. Scroll Animations
    function initScrollAnimations() {
        const elements = document.querySelectorAll('.service-card, .beat-card, .stat');
        
        elements.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            el.style.transition = 'all 0.5s ease';
        });
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, { threshold: 0.1 });
        
        elements.forEach(el => observer.observe(el));
    }
    
    // Initialize enhancements
    window.addEventListener('scroll', updateActiveNav);
    initScrollAnimations();
    updateActiveNav();
    
    // ==================== BEAT PROTECTION ==================== 
    // 1. Disable right-click on beats
    document.addEventListener('contextmenu', function(e) {
        if (e.target.closest('.audio-player') || e.target.closest('.beat-card')) {
            e.preventDefault();
            showNotification('Right-click disabled to protect beats');
        }
    });
    
    // 2. Disable keyboard save shortcuts
    document.addEventListener('keydown', function(e) {
        // Block F12 (Developer Tools)
        if (e.key === 'F12') {
            e.preventDefault();
            showNotification('Developer Tools disabled');
            return false;
        }
        
        if ((e.ctrlKey && e.key === 's') || 
            (e.ctrlKey && e.shiftKey && e.key === 'S')) {
            e.preventDefault();
            showNotification('This action is disabled');
            return false;
        }
    });
    
    // ==================== ADMIN PANEL SYSTEM ====================
    const ADMIN_PASSWORD = "Mynthanda265*"; // You can change this password
    
    // Elements
    const adminAccessBtn = document.getElementById('adminAccessBtn');
    const passwordModal = document.getElementById('passwordModal');
    const adminPanel = document.getElementById('adminPanel');
    const adminPasswordInput = document.getElementById('adminPassword');
    const submitPasswordBtn = document.getElementById('submitPassword');
    const cancelPasswordBtn = document.getElementById('cancelPassword');
    const closeAdminBtn = document.querySelector('.close-admin');
    
    // Admin Beat Management
    const adminBeatTitle = document.getElementById('adminBeatTitle');
    const adminBeatGenre = document.getElementById('adminBeatGenre');
    const adminBeatBPM = document.getElementById('adminBeatBPM');
    const adminBeatKey = document.getElementById('adminBeatKey');
    const adminBeatLease = document.getElementById('adminBeatLease');
    const adminBeatExclusive = document.getElementById('adminBeatExclusive');
    const adminBeatAudio = document.getElementById('adminBeatAudio');
    const adminAddBeatBtn = document.getElementById('adminAddBeat');
    const adminBeatsList = document.getElementById('adminBeatsList');
    const beatCountSpan = document.getElementById('beatCount');
    
    // Admin Image Management
    const adminBgUpload = document.getElementById('adminBgUpload');
    const adminProfileUpload = document.getElementById('adminProfileUpload');
    const adminBgPreview = document.getElementById('adminBgPreview');
    const adminProfilePreview = document.getElementById('adminProfilePreview');
    const adminSaveImagesBtn = document.getElementById('adminSaveImages');
    const adminResetImagesBtn = document.getElementById('adminResetImages');
    
    // Data Management
    const exportDataBtn = document.getElementById('exportData');
    const importDataBtn = document.getElementById('importData');
    const clearAllBeatsBtn = document.getElementById('clearAllBeats');
    
    // Current admin data
    let adminCurrentBgImage = 'https://i.imgur.com/gcs6MBM.jpeg';
    let adminCurrentProfileImage = 'https://i.imgur.com/1TZwnGp.jpeg';
    let adminBeats = [];
    
    // Load saved admin data
    function loadAdminData() {
        // Load beats from localStorage
        const savedBeats = localStorage.getItem('adminBeats');
        if (savedBeats) {
            adminBeats = JSON.parse(savedBeats);
        }
        
        // Load images from localStorage
        const savedBg = localStorage.getItem('websiteBackground');
        const savedProfile = localStorage.getItem('websiteProfile');
        
        if (savedBg) {
            adminCurrentBgImage = savedBg;
            updateImagePreview(adminBgPreview, savedBg, 'Current Background');
        }
        
        if (savedProfile) {
            adminCurrentProfileImage = savedProfile;
            updateImagePreview(adminProfilePreview, savedProfile, 'Current Profile');
        }
        
        updateBeatList();
        updateBeatCount();
    }
    
    // Save beats to localStorage
    function saveAdminBeats() {
        localStorage.setItem('adminBeats', JSON.stringify(adminBeats));
    }
    
    // Update beats list display
    function updateBeatList() {
        adminBeatsList.innerHTML = '';
        
        adminBeats.forEach((beat, index) => {
            const beatItem = document.createElement('div');
            beatItem.className = 'beat-item';
            beatItem.innerHTML = `
                <div class="beat-info">
                    <h6>${beat.title}</h6>
                    <p>
                        <span>${beat.genre}</span> | 
                        <span>${beat.bpm} BPM</span> | 
                        <span>${beat.key}</span>
                    </p>
                </div>
                <button class="remove-beat" data-index="${index}">
                    <i class="fas fa-times"></i>
                </button>
            `;
            adminBeatsList.appendChild(beatItem);
        });
        
        // Add event listeners to remove buttons
        document.querySelectorAll('.remove-beat').forEach(btn => {
            btn.addEventListener('click', function() {
                const index = parseInt(this.getAttribute('data-index'));
                adminBeats.splice(index, 1);
                saveAdminBeats();
                updateBeatList();
                updateBeatCount();
                showNotification('Beat removed from admin panel');
            });
        });
    }
    
    // Update beat count
    function updateBeatCount() {
        beatCountSpan.textContent = adminBeats.length;
    }
    
    // Update image preview
    function updateImagePreview(previewElement, imageSrc, altText) {
        if (previewElement) {
            previewElement.innerHTML = `
                <img src="${imageSrc}" alt="${altText}">
                <div class="preview-overlay">
                    <span>${altText}</span>
                </div>
            `;
        }
    }
    
    // Password authentication
    if (adminAccessBtn) {
        adminAccessBtn.addEventListener('click', () => {
            passwordModal.style.display = 'flex';
            adminPasswordInput.focus();
        });
    }
    
    if (submitPasswordBtn) {
        submitPasswordBtn.addEventListener('click', () => {
            const enteredPassword = adminPasswordInput.value.trim();
            
            if (enteredPassword === ADMIN_PASSWORD) {
                passwordModal.style.display = 'none';
                adminPanel.style.display = 'block';
                adminPasswordInput.value = '';
                showNotification('Admin panel unlocked');
                
                // Load current data
                loadAdminData();
            } else {
                showNotification('Incorrect password');
                adminPasswordInput.value = '';
                adminPasswordInput.focus();
            }
        });
    }
    
    if (cancelPasswordBtn) {
        cancelPasswordBtn.addEventListener('click', () => {
            passwordModal.style.display = 'none';
            adminPasswordInput.value = '';
        });
    }
    
    if (closeAdminBtn) {
        closeAdminBtn.addEventListener('click', () => {
            adminPanel.style.display = 'none';
            // DON'T sync - keep user beats
        });
    }
    
    // Close modal with Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            if (passwordModal.style.display === 'flex') {
                passwordModal.style.display = 'none';
                adminPasswordInput.value = '';
            }
            if (adminPanel.style.display === 'block') {
                adminPanel.style.display = 'none';
                // DON'T sync - keep user beats
            }
        }
    });
    
    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === passwordModal) {
            passwordModal.style.display = 'none';
            adminPasswordInput.value = '';
        }
        if (e.target === adminPanel) {
            adminPanel.style.display = 'none';
            // DON'T sync - keep user beats
        }
    });
    
    // Add beat functionality
    if (adminAddBeatBtn) {
        adminAddBeatBtn.addEventListener('click', () => {
            const title = adminBeatTitle.value.trim();
            const genre = adminBeatGenre.value.trim();
            const bpm = adminBeatBPM.value.trim();
            const key = adminBeatKey.value.trim();
            const lease = adminBeatLease.value.trim() || '$50';
            const exclusive = adminBeatExclusive.value.trim() || '$200';
            const audio = adminBeatAudio.value.trim() || '#';
            
            if (!title || !genre || !bpm || !key) {
                showNotification('Please fill in all required fields');
                return;
            }
            
            const newBeat = {
                title,
                genre,
                bpm,
                key,
                lease: lease.startsWith('$') ? lease : `$${lease}`,
                exclusive: exclusive.startsWith('$') ? exclusive : `$${exclusive}`,
                audio
            };
            
            adminBeats.unshift(newBeat); // Add to beginning
            saveAdminBeats();
            updateBeatList();
            updateBeatCount();
            
            // Clear form
            adminBeatTitle.value = '';
            adminBeatGenre.value = '';
            adminBeatBPM.value = '';
            adminBeatKey.value = '';
            adminBeatLease.value = '';
            adminBeatExclusive.value = '';
            adminBeatAudio.value = '';
            
            showNotification('Beat added to admin panel');
        });
    }
    
    // Image upload functionality
    if (adminBgUpload) {
        adminBgUpload.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file && file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    adminCurrentBgImage = e.target.result;
                    updateImagePreview(adminBgPreview, adminCurrentBgImage, 'New Background');
                };
                reader.readAsDataURL(file);
            }
        });
    }
    
    if (adminProfileUpload) {
        adminProfileUpload.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file && file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    adminCurrentProfileImage = e.target.result;
                    updateImagePreview(adminProfilePreview, adminCurrentProfileImage, 'New Profile');
                };
                reader.readAsDataURL(file);
            }
        });
    }
    
    // Save images
    if (adminSaveImagesBtn) {
        adminSaveImagesBtn.addEventListener('click', () => {
            if (adminCurrentBgImage) {
                localStorage.setItem('websiteBackground', adminCurrentBgImage);
                document.querySelector('.hero-bg').style.backgroundImage = `url('${adminCurrentBgImage}')`;
            }
            
            if (adminCurrentProfileImage) {
                localStorage.setItem('websiteProfile', adminCurrentProfileImage);
                document.getElementById('profileImage').innerHTML = `
                    <img src="${adminCurrentProfileImage}" alt="The GogoMaster">
                    <div class="profile-badge">
                        <i class="fas fa-certificate"></i> PRO
                    </div>
                `;
            }
            
            showNotification('Images saved and updated on website');
        });
    }
    
    // Reset images
    if (adminResetImagesBtn) {
        adminResetImagesBtn.addEventListener('click', () => {
            adminCurrentBgImage = 'https://i.imgur.com/gcs6MBM.jpeg';
            adminCurrentProfileImage = 'https://i.imgur.com/1TZwnGp.jpeg';
            
            updateImagePreview(adminBgPreview, adminCurrentBgImage, 'Default Background');
            updateImagePreview(adminProfilePreview, adminCurrentProfileImage, 'Default Profile');
            
            showNotification('Images reset to default');
        });
    }
    
    // Export data
    if (exportDataBtn) {
        exportDataBtn.addEventListener('click', () => {
            const data = {
                beats: adminBeats,
                backgroundImage: adminCurrentBgImage,
                profileImage: adminCurrentProfileImage,
                exportDate: new Date().toISOString()
            };
            
            const dataStr = JSON.stringify(data, null, 2);
            const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
            
            const exportFileDefaultName = `trek-media-data-${new Date().toISOString().slice(0,10)}.json`;
            
            const linkElement = document.createElement('a');
            linkElement.setAttribute('href', dataUri);
            linkElement.setAttribute('download', exportFileDefaultName);
            linkElement.click();
            
            showNotification('Data exported successfully');
        });
    }
    
    // Import data
    if (importDataBtn) {
        importDataBtn.addEventListener('click', () => {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = '.json';
            
            input.onchange = e => {
                const file = e.target.files[0];
                const reader = new FileReader();
                
                reader.onload = event => {
                    try {
                        const data = JSON.parse(event.target.result);
                        
                        if (data.beats) {
                            adminBeats = data.beats;
                            saveAdminBeats();
                            updateBeatList();
                            updateBeatCount();
                        }
                        
                        if (data.backgroundImage) {
                            adminCurrentBgImage = data.backgroundImage;
                            updateImagePreview(adminBgPreview, adminCurrentBgImage, 'Imported Background');
                        }
                        
                        if (data.profileImage) {
                            adminCurrentProfileImage = data.profileImage;
                            updateImagePreview(adminProfilePreview, adminCurrentProfileImage, 'Imported Profile');
                        }
                        
                        showNotification('Data imported successfully');
                    } catch (error) {
                        showNotification('Error importing file. Invalid format.');
                    }
                };
                
                reader.readAsText(file);
            };
            
            input.click();
        });
    }
    
    // Clear all beats
    if (clearAllBeatsBtn) {
        clearAllBeatsBtn.addEventListener('click', () => {
            if (confirm('Are you sure you want to clear ALL beats? This cannot be undone.')) {
                adminBeats = [];
                saveAdminBeats();
                updateBeatList();
                updateBeatCount();
                showNotification('All beats cleared');
            }
        });
    }
    
    // Load admin data when page loads
    setTimeout(loadAdminData, 1000);
    
    // Initialize previews
    updateImagePreview(adminBgPreview, adminCurrentBgImage, 'Current Background');
    updateImagePreview(adminProfilePreview, adminCurrentProfileImage, 'Current Profile');
    
    // ==================== PAGE LOAD ANIMATION ====================
    // Add fade-in animation on page load
    window.addEventListener('load', function() {
        document.body.style.opacity = '0';
        document.body.style.transition = 'opacity 0.5s ease';
        
        setTimeout(() => {
            document.body.style.opacity = '1';
        }, 100);
        
        // Show welcome message
        setTimeout(() => {
            showNotification('Welcome to Trek Media Studios! 🎵');
        }, 1000);
    });
    
    // ========== SECRET ADMIN ACCESS ==========
    // Check for #nthanda when page loads
    if (window.location.hash === '#nthanda') {
        const adminBtn = document.querySelector('.admin-access-btn');
        if (adminBtn) {
            adminBtn.style.display = 'flex';
        }
    }
    
    // Console command
    window.unlockAdmin = function() {
        const adminBtn = document.querySelector('.admin-access-btn');
        if (adminBtn) {
            adminBtn.style.display = 'flex';
            alert('🔓 Admin unlocked! Click the lock icon.');
        }
    };
});
