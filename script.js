// ============================================
// Trek Media Studios - COMPLETE VERSION
// With All Requested Features from Old Version
// ============================================

// ============================================
// MOBILE AUDIO UNLOCK
// ============================================
(function() {
    // Unlock audio on first user interaction
    function unlockAudio() {
        document.body.removeEventListener('touchstart', unlockAudio);
        document.body.removeEventListener('click', unlockAudio);
        
        try {
            // Create and play a silent buffer
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            if (AudioContext) {
                const audioContext = new AudioContext();
                const buffer = audioContext.createBuffer(1, 1, 22050);
                const source = audioContext.createBufferSource();
                source.buffer = buffer;
                source.connect(audioContext.destination);
                source.start(0);
            }
        } catch(e) {
            console.log("Audio unlock failed (non-critical):", e);
        }
    }
    
    // Listen for first user interaction
    document.body.addEventListener('touchstart', unlockAudio, { once: true });
    document.body.addEventListener('click', unlockAudio, { once: true });
})();

// FIREBASE CONFIGURATION
const firebaseConfig = {
    apiKey: "AIzaSyD2tQzsNMtLOciLMokNofyCW93C06Qoj_k",
    authDomain: "trek-media-studios.firebaseapp.com",
    databaseURL: "https://trek-media-studios-default-rtdb.firebaseio.com",
    projectId: "trek-media-studios",
    storageBucket: "trek-media-studios.firebasestorage.app",
    messagingSenderId: "449193157475",
    appId: "1:449193157475:web:f9166ea800e4357d432956",
    measurementId: "G-D2J7HJ8REE"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const database = firebase.database();
const beatsRef = database.ref('beats');
const mixesRef = database.ref('mixes');
const feedbackRef = database.ref('feedback');

// ============================================
// GLOBAL VARIABLES
// ============================================
let currentAudio = null;
let isPlaying = false;
let currentBeatIndex = -1;
let beats = [];
let mixes = [];
let feedbacks = [];
const ADMIN_PASSWORD = "Mynthanda265*"; // Old admin password

// ============================================
// NOTIFICATION SYSTEM (FROM OLD VERSION)
// ============================================
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
    
    document.body.appendChild(notification);
    
    const closeBtn = notification.querySelector('.close-notification');
    closeBtn.addEventListener('click', () => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    });
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

// ============================================
// THEME MANAGEMENT (WITH LOCALSTORAGE)
// ============================================
function initThemeSwitcher() {
    const themeBtns = document.querySelectorAll('.theme-btn');
    
    // Load saved theme from localStorage
    const savedTheme = localStorage.getItem('websiteTheme') || 'dark';
    document.body.setAttribute('data-theme', savedTheme);
    
    // Set active theme button
    themeBtns.forEach(btn => {
        if (btn.getAttribute('data-theme') === savedTheme) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
    
    // Theme switching functionality
    themeBtns.forEach(button => {
        button.addEventListener('click', function() {
            const theme = this.getAttribute('data-theme');
            
            // Update theme
            document.body.setAttribute('data-theme', theme);
            
            // Update active button
            themeBtns.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Save to localStorage
            localStorage.setItem('websiteTheme', theme);
            
            // Show notification
            showNotification(`Theme changed to ${theme.charAt(0).toUpperCase() + theme.slice(1)} Mode`);
        });
    });
}

// ============================================
// NAVIGATION & MOBILE MENU
// ============================================
function initNavigation() {
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
                if (menuToggle) {
                    menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
                }
                
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
            if (menuToggle) {
                menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
            }
        }
    });
}

// ============================================
// ACTIVE NAVIGATION HIGHLIGHT (FROM OLD)
// ============================================
function initActiveNavHighlight() {
    function updateActiveNav() {
        const sections = document.querySelectorAll('section');
        const navLinks = document.querySelectorAll('.nav-links a');
        
        let currentSection = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.clientHeight;
            
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
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
    
    window.addEventListener('scroll', updateActiveNav);
    updateActiveNav();
}

// ============================================
// SCROLL ANIMATIONS (FROM OLD)
// ============================================
function initScrollAnimations() {
    const elements = document.querySelectorAll('.service-card, .beat-card, .stat, .mix-card, .feedback-item');
    
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

// ============================================
// BEAT PROTECTION (FROM OLD)
// ============================================
function initBeatProtection() {
    // 1. Disable right-click on beats and mixes
    document.addEventListener('contextmenu', function(e) {
        if (e.target.closest('.audio-player') || e.target.closest('.beat-card') || e.target.closest('.mix-card')) {
            e.preventDefault();
            showNotification('Right-click disabled to protect audio content');
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
            (e.ctrlKey && e.shiftKey && e.key === 'S') ||
            (e.ctrlKey && e.key === 'u')) {
            e.preventDefault();
            showNotification('This action is disabled');
            return false;
        }
    });
}

// ============================================
// AUDIO PLAYER WITH FADE EFFECTS (FROM OLD)
// ============================================
let audioPlayer = {
    audio: null,
    isPlaying: false,
    currentAudioUrl: null,
    currentTrackTitle: '',
    progressInterval: null,
    
    init: function() {
        this.audio = new Audio();
        this.audio.volume = 0.7;
        
        // Player controls
        const playBtn = document.getElementById('playBtn');
        const progressContainer = document.querySelector('.progress-container');
        const volumeSlider = document.getElementById('volumeSlider');
        
        // Play/Pause button
        playBtn.addEventListener('click', () => {
            if (!this.currentAudioUrl) {
                showNotification('Please select a track to preview first');
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
        
        try {
            this.audio.play();
            this.isPlaying = true;
            document.getElementById('playBtn').innerHTML = '<i class="fas fa-pause"></i>';
            showNotification(`Now playing: ${this.currentTrackTitle}`);
        } catch (error) {
            console.log('Error playing audio:', error);
            showNotification('Error playing audio. Please try again.');
        }
    },
    
    pause: function() {
        this.audio.pause();
        this.isPlaying = false;
        document.getElementById('playBtn').innerHTML = '<i class="fas fa-play"></i>';
    },
    
    stop: function() {
        this.audio.pause();
        this.audio.currentTime = 0;
        this.isPlaying = false;
        document.getElementById('playBtn').innerHTML = '<i class="fas fa-play"></i>';
        document.getElementById('progressBar').style.width = '0%';
        document.getElementById('currentTime').textContent = '0:00';
    },
    
    loadAudio: function(url, title) {
        this.currentAudioUrl = url;
        this.currentTrackTitle = title;
        
        // Update UI
        document.getElementById('nowPlaying').textContent = title;
        document.getElementById('playBtn').innerHTML = '<i class="fas fa-play"></i>';
        document.getElementById('progressBar').style.width = '0%';
        document.getElementById('currentTime').textContent = '0:00';
        document.getElementById('totalTime').textContent = '0:00';
        
        // Load the audio
        this.audio.src = url;
        this.isPlaying = false;
        
        // When audio is loaded, update total time
        this.audio.addEventListener('loadedmetadata', () => {
            document.getElementById('totalTime').textContent = this.formatTime(this.audio.duration);
        });
    },
    
    formatTime: function(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    }
};

// ============================================
// CLOUD BEAT MANAGEMENT (FIREBASE)
// ============================================
function loadBeatsFromCloud() {
    const beatsGrid = document.getElementById('beatsGrid');
    beatsGrid.innerHTML = '<div class="loading-beats"><i class="fas fa-spinner fa-spin"></i><p>Loading beats from cloud...</p></div>';
    
    beatsRef.on('value', (snapshot) => {
        beats = [];
        const data = snapshot.val();
        
        if (data) {
            // Convert object to array
            Object.keys(data).forEach(key => {
                beats.push({ id: key, ...data[key] });
            });
            
            // Sort beats by timestamp if available
            beats.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
        }
        
        updateBeatCount();
        renderBeats();
        updateAdminBeatList();
    }, (error) => {
        console.error("Firebase error:", error);
        beatsGrid.innerHTML = '<div class="loading-beats"><i class="fas fa-exclamation-triangle"></i><p>Error loading beats. Please refresh.</p></div>';
    });
}

function addBeatToCloud(beatData) {
    return beatsRef.push({
        ...beatData,
        timestamp: firebase.database.ServerValue.TIMESTAMP
    }).then(() => {
        console.log("Beat added to cloud");
        return true;
    }).catch(error => {
        console.error("Error adding beat:", error);
        showNotification('Error adding beat to cloud. Please try again.');
        return false;
    });
}

// ============================================
// MIXES MANAGEMENT (NEW FEATURE)
// ============================================
function loadMixesFromCloud() {
    const mixesGrid = document.getElementById('mixesGrid');
    mixesGrid.innerHTML = '<div class="loading-mixes"><i class="fas fa-spinner fa-spin"></i><p>Loading mixes...</p></div>';
    
    mixesRef.on('value', (snapshot) => {
        mixes = [];
        const data = snapshot.val();
        
        if (data) {
            Object.keys(data).forEach(key => {
                mixes.push({ id: key, ...data[key] });
            });
            
            mixes.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
        }
        
        updateMixCount();
        renderMixes();
        updateAdminMixList();
    });
}

function addMixToCloud(mixData) {
    return mixesRef.push({
        ...mixData,
        timestamp: firebase.database.ServerValue.TIMESTAMP
    }).then(() => {
        console.log("Mix added to cloud");
        return true;
    }).catch(error => {
        console.error("Error adding mix:", error);
        showNotification('Error adding mix to cloud. Please try again.');
        return false;
    });
}

// ============================================
// FEEDBACK MANAGEMENT (NEW FEATURE)
// ============================================
function loadFeedbackFromCloud() {
    feedbackRef.on('value', (snapshot) => {
        feedbacks = [];
        const data = snapshot.val();
        
        if (data) {
            Object.keys(data).forEach(key => {
                feedbacks.push({ id: key, ...data[key] });
            });
            
            feedbacks.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
        }
        
        updateFeedbackCount();
        renderFeedback();
        updateAdminFeedbackList();
    });
}

function addFeedbackToCloud(feedbackData) {
    return feedbackRef.push({
        ...feedbackData,
        timestamp: firebase.database.ServerValue.TIMESTAMP,
        date: new Date().toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric' 
        })
    }).then(() => {
        console.log("Feedback added to cloud");
        return true;
    }).catch(error => {
        console.error("Error adding feedback:", error);
        showNotification('Error submitting feedback. Please try again.');
        return false;
    });
}

// ============================================
// RENDERING FUNCTIONS
// ============================================
function renderBeats() {
    const beatsGrid = document.getElementById('beatsGrid');
    
    if (beats.length === 0) {
        beatsGrid.innerHTML = `
            <div class="no-beats" style="grid-column: 1/-1; text-align: center; padding: 3rem; color: var(--text-gray)">
                <i class="fas fa-music" style="font-size: 3rem; margin-bottom: 1rem;"></i>
                <h3>No Beats Available</h3>
                <p>Add your first beat using the form above!</p>
            </div>
        `;
        return;
    }
    
    beatsGrid.innerHTML = '';
    
    beats.forEach((beat, index) => {
        const thumbnailUrl = getThumbnailForBeat(beat);
        
        const beatCard = document.createElement('div');
        beatCard.className = 'beat-card';
        beatCard.innerHTML = `
            <div class="beat-thumbnail">
                ${thumbnailUrl ? 
                    `<img src="${thumbnailUrl}" alt="${beat.title}" loading="lazy">` :
                    `<div class="default-thumbnail">
                        <i class="fas fa-music"></i>
                        <span>${beat.title.substring(0, 20)}...</span>
                    </div>`
                }
            </div>
            <div class="beat-header">
                <h3 class="beat-title">${beat.title}</h3>
                <span class="beat-badge">${beat.genre}</span>
            </div>
            <div class="beat-info">
                <p><i class="fas fa-tachometer-alt"></i> <strong>BPM:</strong> ${beat.bpm}</p>
                <p><i class="fas fa-key"></i> <strong>Key:</strong> ${beat.key}</p>
                <p><i class="fas fa-calendar"></i> <strong>Added:</strong> ${new Date(beat.timestamp || Date.now()).toLocaleDateString()}</p>
            </div>
            <div class="beat-pricing">
                <div class="price-option">
                    <span class="price-label">Lease</span>
                    <div class="price">${beat.lease}</div>
                </div>
                <div class="price-option">
                    <span class="price-label">Exclusive</span>
                    <div class="price">${beat.exclusive}</div>
                </div>
            </div>
            <div class="beat-actions">
                <button class="btn-preview" data-audio="${beat.audio}" data-title="${beat.title}">
                    <i class="fas fa-play"></i> Preview
                </button>
                <button class="btn-buy" data-title="${beat.title}">
                    <i class="fas fa-shopping-cart"></i> Buy
                </button>
            </div>
        `;
        
        beatsGrid.appendChild(beatCard);
    });
    
   // Add event listeners WITH MOBILE AUTO-PLAY
document.querySelectorAll('.btn-preview').forEach(btn => {
    btn.addEventListener('click', function() {
        const audioUrl = this.getAttribute('data-audio');
        const beatTitle = this.getAttribute('data-title');
        
        // Create new audio for mobile compatibility
        const audio = new Audio(audioUrl);
        audio.volume = 0.7;
        audio.preload = 'auto';
        
        // Try to play immediately
        const playPromise = audio.play();
        
        if (playPromise !== undefined) {
            playPromise.then(() => {
                // Success! Update player
                audioPlayer.audio = audio;
                audioPlayer.isPlaying = true;
                audioPlayer.currentAudioUrl = audioUrl;
                audioPlayer.currentBeatTitle = beatTitle;
                document.getElementById('nowPlaying').textContent = beatTitle;
                document.getElementById('playBtn').innerHTML = '<i class="fas fa-pause"></i>';
                document.getElementById('progressBar').style.width = '0%';
                
                // Handle playback updates
                audio.addEventListener('timeupdate', function() {
                    if (audio.duration) {
                        const progress = (audio.currentTime / audio.duration) * 100;
                        document.getElementById('progressBar').style.width = `${progress}%`;
                        document.getElementById('currentTime').textContent = 
                            formatAudioTime(audio.currentTime);
                        document.getElementById('totalTime').textContent = 
                            formatAudioTime(audio.duration);
                    }
                });
                
                // Handle audio end
                audio.addEventListener('ended', function() {
                    audioPlayer.isPlaying = false;
                    document.getElementById('playBtn').innerHTML = '<i class="fas fa-play"></i>';
                });
                
            }).catch(error => {
                // Mobile blocked auto-play - use normal player
                console.log("Auto-play blocked, using fallback");
                audioPlayer.loadAudio(audioUrl, beatTitle);
                showNotification("Tap the play button above to listen");
            });
        } else {
            // Fallback for browsers without promise support
            audioPlayer.loadAudio(audioUrl, beatTitle);
            audioPlayer.play();
        }
    });
});

// Helper function for time formatting
function formatAudioTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}
    
    document.querySelectorAll('.btn-buy').forEach(btn => {
        btn.addEventListener('click', function() {
            const beatTitle = this.getAttribute('data-title');
            openPurchaseModal(beatTitle);
        });
    });
}

function renderMixes() {
    const mixesGrid = document.getElementById('mixesGrid');
    
    if (mixes.length === 0) {
        mixesGrid.innerHTML = `
            <div class="no-beats" style="grid-column: 1/-1; text-align: center; padding: 3rem; color: var(--text-gray)">
                <i class="fas fa-sliders-h" style="font-size: 3rem; margin-bottom: 1rem;"></i>
                <h3>No Mixes Available</h3>
                <p>Check back soon for my latest mixes!</p>
            </div>
        `;
        return;
    }
    
    mixesGrid.innerHTML = '';
    
    mixes.forEach((mix, index) => {
        const mixCard = document.createElement('div');
        mixCard.className = 'mix-card';
        mixCard.innerHTML = `
            <div class="mix-thumbnail">
                ${mix.thumbnail ? 
                    `<img src="${mix.thumbnail}" alt="${mix.title}" loading="lazy">` :
                    `<div class="mix-default-thumbnail">
                        <i class="fas fa-sliders-h"></i>
                        <span>${mix.title.substring(0, 20)}...</span>
                    </div>`
                }
            </div>
            <div class="mix-header">
                <h3 class="mix-title">${mix.title}</h3>
                <span class="mix-badge">${mix.genre}</span>
            </div>
            <div class="mix-info">
                <p><i class="fas fa-user"></i> <strong>Client:</strong> ${mix.client || 'Personal Project'}</p>
                <p><i class="fas fa-calendar"></i> <strong>Date:</strong> ${mix.date || new Date(mix.timestamp || Date.now()).toLocaleDateString()}</p>
                <p><i class="fas fa-music"></i> <strong>Type:</strong> ${mix.genre} Mix</p>
            </div>
            <div class="mix-actions">
                <button class="btn-listen" data-audio="${mix.audio}" data-title="${mix.title}">
                    <i class="fas fa-play"></i> Listen Now
                </button>
            </div>
        `;
        
        mixesGrid.appendChild(mixCard);
    });
    
       // Mixes preview with mobile auto-play
document.querySelectorAll('.btn-listen').forEach(btn => {
    btn.addEventListener('click', function() {
        const audioUrl = this.getAttribute('data-audio');
        const mixTitle = this.getAttribute('data-title');
        
        // Create new audio for mobile compatibility
        const audio = new Audio(audioUrl);
        audio.volume = 0.7;
        audio.preload = 'auto';
        
        // Try to play immediately
        const playPromise = audio.play();
        
        if (playPromise !== undefined) {
            playPromise.then(() => {
                // Success! Update player
                audioPlayer.audio = audio;
                audioPlayer.isPlaying = true;
                audioPlayer.currentAudioUrl = audioUrl;
                audioPlayer.currentBeatTitle = mixTitle;
                document.getElementById('nowPlaying').textContent = mixTitle;
                document.getElementById('playBtn').innerHTML = '<i class="fas fa-pause"></i>';
                document.getElementById('progressBar').style.width = '0%';
                
                // Handle playback updates
                audio.addEventListener('timeupdate', function() {
                    if (audio.duration) {
                        const progress = (audio.currentTime / audio.duration) * 100;
                        document.getElementById('progressBar').style.width = `${progress}%`;
                        document.getElementById('currentTime').textContent = 
                            formatAudioTime(audio.currentTime);
                        document.getElementById('totalTime').textContent = 
                            formatAudioTime(audio.duration);
                    }
                });
                
                // Handle audio end
                audio.addEventListener('ended', function() {
                    audioPlayer.isPlaying = false;
                    document.getElementById('playBtn').innerHTML = '<i class="fas fa-play"></i>';
                });
                
            }).catch(error => {
                // Mobile blocked auto-play - use normal player
                console.log("Auto-play blocked, using fallback");
                audioPlayer.loadAudio(audioUrl, mixTitle);
                showNotification("Tap the play button above to listen");
            });
        } else {
            // Fallback for browsers without promise support
            audioPlayer.loadAudio(audioUrl, mixTitle);
            audioPlayer.play();
        }
    });
});
}

function renderFeedback() {
    const feedbackDisplay = document.getElementById('feedbackDisplay');
    
    if (feedbacks.length === 0) {
        feedbackDisplay.innerHTML = `
            <div class="no-feedback" style="grid-column: 1/-1; text-align: center; padding: 2rem; color: var(--text-gray)">
                <i class="fas fa-comments" style="font-size: 2rem; margin-bottom: 1rem;"></i>
                <h4>No Feedback Yet</h4>
                <p>Be the first to share your experience!</p>
            </div>
        `;
        return;
    }
    
    feedbackDisplay.innerHTML = '';
    
    feedbacks.slice(0, 6).forEach(feedback => {
        const stars = '★'.repeat(feedback.rating) + '☆'.repeat(5 - feedback.rating);
        
        const feedbackItem = document.createElement('div');
        feedbackItem.className = 'feedback-item';
        feedbackItem.innerHTML = `
            <div class="feedback-header">
                <div class="feedback-client">
                    <i class="fas fa-user-circle"></i>
                    <div>
                        <h4>${feedback.name}</h4>
                        <span class="feedback-project">${feedback.project || 'General Feedback'}</span>
                    </div>
                </div>
                <div class="feedback-rating" title="${feedback.rating} stars">
                    ${stars}
                </div>
            </div>
            <p class="feedback-text">"${feedback.message}"</p>
            <span class="feedback-date"><i class="far fa-clock"></i> ${feedback.date || 'Recently'}</span>
        `;
        
        feedbackDisplay.appendChild(feedbackItem);
    });
}

function getThumbnailForBeat(beat) {
    if (beat.thumbnail) return beat.thumbnail;
    
    const title = beat.title.toLowerCase();
    const cleanTitle = title
        .replace(/[^a-z0-9\s]/g, '')
        .replace(/\s+/g, ' ')
        .trim()
        .split(' ')[0];
    
    const thumbnailMap = {
        'betrayal': 'https://raw.githubusercontent.com/TheGogoMaster/trek-media-studio/main/beats/Betrayal.jpg',
        'pressure': 'https://raw.githubusercontent.com/TheGogoMaster/trek-media-studio/main/beats/PRESSURE.jpg',
        'mistake': 'https://raw.githubusercontent.com/TheGogoMaster/trek-media-studio/main/beats/MISTAKE.jpg',
        'madness': 'https://raw.githubusercontent.com/TheGogoMaster/trek-media-studio/main/beats/madness_hausa%20amapiano%20type%20beat%20x%20afro%20instrumental.jpg',
        'live': 'https://raw.githubusercontent.com/TheGogoMaster/trek-media-studio/main/beats/LIVE.jpg',
        'honeymoon': 'https://raw.githubusercontent.com/TheGogoMaster/trek-media-studio/main/beats/HONEYMOON.jpg',
        'go': 'https://raw.githubusercontent.com/TheGogoMaster/trek-media-studio/main/beats/GO%20DOWN.jpg',
        'chifundo': 'https://raw.githubusercontent.com/TheGogoMaster/trek-media-studio/main/beats/CHIFUNDO.jpg'
    };
    
    return thumbnailMap[cleanTitle] || null;
}

// ============================================
// PURCHASE MODAL
// ============================================
function openPurchaseModal(beatTitle) {
    const modal = document.getElementById('purchaseModal');
    const modalTitle = document.getElementById('modalBeatTitle');
    
    modalTitle.textContent = beatTitle;
    modal.style.display = 'flex';
    
    // Update WhatsApp link
    const whatsappBtn = modal.querySelector('.btn-whatsapp');
    const encodedTitle = encodeURIComponent(beatTitle);
    whatsappBtn.href = `https://wa.me/265996017545?text=Hi%20GogoMaster,%20I%20want%20to%20purchase%20the%20beat%20"${encodedTitle}"`;
    
    // Update email link
    const emailBtn = modal.querySelector('.btn-email');
    emailBtn.href = `mailto:iloventhanda@gmail.com?subject=Beat Purchase: ${encodedTitle}`;
}

function initPurchaseModal() {
    const modal = document.getElementById('purchaseModal');
    const closeBtn = modal.querySelector('.close-modal');
    
    closeBtn.addEventListener('click', () => {
        modal.style.display = 'none';
    });
    
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });
}

// ============================================
// CONTACT FORM WITH EMAIL INTEGRATION
// ============================================
function initContactForm() {
    const messageForm = document.getElementById('messageForm');
    
    if (messageForm) {
        messageForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const name = this.querySelector('input[type="text"]').value;
            const email = this.querySelector('input[type="email"]').value;
            const service = this.querySelector('select').value;
            const message = this.querySelector('textarea').value;
            
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
}

// ============================================
// FEEDBACK FORM
// ============================================
function initFeedbackForm() {
    const feedbackForm = document.getElementById('feedbackForm');
    
    if (feedbackForm) {
        feedbackForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const feedbackData = {
                name: document.getElementById('feedbackName').value.trim(),
                project: document.getElementById('feedbackProject').value.trim(),
                rating: document.getElementById('feedbackRating').value,
                location: document.getElementById('feedbackLocation').value.trim(),
                message: document.getElementById('feedbackMessage').value.trim()
            };
            
            // Validate
            if (!feedbackData.name || !feedbackData.rating || !feedbackData.message) {
                showNotification('Please fill in all required fields');
                return;
            }
            
            // Add to cloud
            addFeedbackToCloud(feedbackData).then(success => {
                if (success) {
                    // Clear form
                    feedbackForm.reset();
                    showNotification('Thank you for your feedback!');
                }
            });
        });
    }
}

// ============================================
// ADMIN PANEL SYSTEM
// ============================================
function initAdminPanel() {
    const adminAccessBtn = document.getElementById('adminAccessBtn');
    const passwordModal = document.getElementById('passwordModal');
    const adminPanel = document.getElementById('adminPanel');
    const submitPasswordBtn = document.getElementById('submitPassword');
    const cancelPasswordBtn = document.getElementById('cancelPassword');
    const adminPasswordInput = document.getElementById('adminPassword');
    const closeAdminBtn = document.querySelector('.close-admin');
    
    // SECRET ADMIN ACCESS: Check for #nthanda URL
    if (window.location.hash === '#nthanda') {
        adminAccessBtn.style.display = 'flex';
        showNotification('🔓 Admin access unlocked! Click the lock icon.');
    }
    
    // Console command for admin access
    window.unlockAdmin = function() {
        adminAccessBtn.style.display = 'flex';
        showNotification('🔓 Admin unlocked! Click the lock icon.');
    };
    
    // Show admin access button
    adminAccessBtn.style.display = 'flex';
    
    // Admin access button click
    adminAccessBtn.addEventListener('click', () => {
        passwordModal.style.display = 'flex';
        adminPasswordInput.focus();
    });
    
    // Submit password
    submitPasswordBtn.addEventListener('click', () => {
        const password = adminPasswordInput.value.trim();
        
        if (password === ADMIN_PASSWORD) {
            passwordModal.style.display = 'none';
            adminPanel.style.display = 'block';
            adminPasswordInput.value = '';
            showNotification('Admin panel unlocked');
            
            // Load current data
            updateAdminBeatList();
            updateAdminMixList();
            updateAdminFeedbackList();
            loadAdminImages();
        } else {
            showNotification('Incorrect password');
            adminPasswordInput.value = '';
            adminPasswordInput.focus();
        }
    });
    
    // Cancel password
    cancelPasswordBtn.addEventListener('click', () => {
        passwordModal.style.display = 'none';
        adminPasswordInput.value = '';
    });
    
    // Close admin panel
    closeAdminBtn.addEventListener('click', () => {
        adminPanel.style.display = 'none';
    });
    
    // Close on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            passwordModal.style.display = 'none';
            adminPanel.style.display = 'none';
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
        }
    });
    
    // Initialize admin functions
    initAdminFunctions();
}

function initAdminFunctions() {
    // Admin add beat
    const adminAddBeatBtn = document.getElementById('adminAddBeat');
    if (adminAddBeatBtn) {
        adminAddBeatBtn.addEventListener('click', async (e) => {
            e.preventDefault();
            
            const beatData = {
                title: document.getElementById('adminBeatTitle').value.trim(),
                genre: document.getElementById('adminBeatGenre').value.trim(),
                bpm: document.getElementById('adminBeatBPM').value.trim(),
                key: document.getElementById('adminBeatKey').value.trim(),
                lease: document.getElementById('adminBeatLease').value.trim(),
                exclusive: document.getElementById('adminBeatExclusive').value.trim(),
                audio: document.getElementById('adminBeatAudio').value.trim(),
                thumbnail: document.getElementById('adminBeatThumbnail').value.trim() || null
            };
            
            if (!beatData.title || !beatData.audio) {
                showNotification('Please provide at least a beat title and audio URL');
                return;
            }
            
            const success = await addBeatToCloud(beatData);
            if (success) {
                // Clear form
                document.getElementById('adminBeatTitle').value = '';
                document.getElementById('adminBeatGenre').value = '';
                document.getElementById('adminBeatBPM').value = '';
                document.getElementById('adminBeatKey').value = '';
                document.getElementById('adminBeatLease').value = '';
                document.getElementById('adminBeatExclusive').value = '';
                document.getElementById('adminBeatAudio').value = '';
                document.getElementById('adminBeatThumbnail').value = '';
                
                showNotification('Beat added to cloud!');
            }
        });
    }
    
    // Admin add mix
    const adminAddMixBtn = document.getElementById('adminAddMix');
    if (adminAddMixBtn) {
        adminAddMixBtn.addEventListener('click', async (e) => {
            e.preventDefault();
            
            const mixData = {
                title: document.getElementById('adminMixTitle').value.trim(),
                genre: document.getElementById('adminMixGenre').value.trim(),
                client: document.getElementById('adminMixClient').value.trim(),
                date: document.getElementById('adminMixDate').value.trim(),
                audio: document.getElementById('adminMixAudio').value.trim(),
                thumbnail: document.getElementById('adminMixThumbnail').value.trim() || null
            };
            
            if (!mixData.title || !mixData.audio) {
                showNotification('Please provide at least a mix title and audio URL');
                return;
            }
            
            const success = await addMixToCloud(mixData);
            if (success) {
                // Clear form
                document.getElementById('adminMixTitle').value = '';
                document.getElementById('adminMixGenre').value = '';
                document.getElementById('adminMixClient').value = '';
                document.getElementById('adminMixDate').value = '';
                document.getElementById('adminMixAudio').value = '';
                document.getElementById('adminMixThumbnail').value = '';
                
                showNotification('Mix added to cloud!');
            }
        });
    }
    
    // Image management
    initImageManagement();
    
    // Data export/import
    initDataManagement();
}

function updateAdminBeatList() {
    const adminBeatsList = document.getElementById('adminBeatsList');
    const beatCount = document.getElementById('beatCount');
    
    if (beatCount) beatCount.textContent = beats.length;
    
    if (!adminBeatsList) return;
    
    adminBeatsList.innerHTML = '';
    
    beats.forEach((beat) => {
        const beatItem = document.createElement('div');
        beatItem.className = 'beat-item';
        beatItem.innerHTML = `
            <div class="beat-info">
                <h6>${beat.title}</h6>
                <p>${beat.genre} • ${beat.bpm} BPM • ${beat.key}</p>
            </div>
            <button class="remove-beat" data-id="${beat.id}">
                <i class="fas fa-trash"></i>
            </button>
        `;
        
        adminBeatsList.appendChild(beatItem);
    });
    
    // Add remove functionality
    document.querySelectorAll('.remove-beat').forEach(btn => {
        btn.addEventListener('click', async (e) => {
            const beatId = e.currentTarget.dataset.id;
            const beat = beats.find(b => b.id === beatId);
            
            if (beat && confirm(`Delete "${beat.title}"?`)) {
                try {
                    await beatsRef.child(beatId).remove();
                    showNotification('Beat deleted from cloud.');
                } catch (error) {
                    showNotification('Error deleting beat: ' + error.message);
                }
            }
        });
    });
}

function updateAdminMixList() {
    const adminMixesList = document.getElementById('adminMixesList');
    const mixCount = document.getElementById('mixCount');
    
    if (mixCount) mixCount.textContent = mixes.length;
    
    if (!adminMixesList) return;
    
    adminMixesList.innerHTML = '';
    
    mixes.forEach((mix) => {
        const mixItem = document.createElement('div');
        mixItem.className = 'mix-item';
        mixItem.innerHTML = `
            <div class="mix-info-admin">
                <h6>${mix.title}</h6>
                <p>${mix.genre} • ${mix.client || 'Personal'} • ${mix.date || 'N/A'}</p>
            </div>
            <button class="remove-mix" data-id="${mix.id}">
                <i class="fas fa-trash"></i>
            </button>
        `;
        
        adminMixesList.appendChild(mixItem);
    });
    
    // Add remove functionality
    document.querySelectorAll('.remove-mix').forEach(btn => {
        btn.addEventListener('click', async (e) => {
            const mixId = e.currentTarget.dataset.id;
            const mix = mixes.find(m => m.id === mixId);
            
            if (mix && confirm(`Delete "${mix.title}"?`)) {
                try {
                    await mixesRef.child(mixId).remove();
                    showNotification('Mix deleted from cloud.');
                } catch (error) {
                    showNotification('Error deleting mix: ' + error.message);
                }
            }
        });
    });
}

function updateAdminFeedbackList() {
    const adminFeedbackList = document.getElementById('adminFeedbackList');
    const feedbackCount = document.getElementById('feedbackCount');
    
    if (feedbackCount) feedbackCount.textContent = feedbacks.length;
    
    if (!adminFeedbackList) return;
    
    adminFeedbackList.innerHTML = '';
    
    feedbacks.forEach((feedback) => {
        const feedbackItem = document.createElement('div');
        feedbackItem.className = 'feedback-item-admin';
        feedbackItem.innerHTML = `
            <div class="mix-info-admin">
                <h6>${feedback.name} - ${'★'.repeat(feedback.rating)}</h6>
                <p>${feedback.project || 'General'} • ${feedback.date || 'N/A'}</p>
                <p style="font-size: 0.75rem; margin-top: 5px;">${feedback.message.substring(0, 50)}...</p>
            </div>
            <button class="remove-feedback" data-id="${feedback.id}">
                <i class="fas fa-trash"></i>
            </button>
        `;
        
        adminFeedbackList.appendChild(feedbackItem);
    });
    
    // Add remove functionality
    document.querySelectorAll('.remove-feedback').forEach(btn => {
        btn.addEventListener('click', async (e) => {
            const feedbackId = e.currentTarget.dataset.id;
            const feedback = feedbacks.find(f => f.id === feedbackId);
            
            if (feedback && confirm(`Delete feedback from "${feedback.name}"?`)) {
                try {
                    await feedbackRef.child(feedbackId).remove();
                    showNotification('Feedback deleted.');
                } catch (error) {
                    showNotification('Error deleting feedback: ' + error.message);
                }
            }
        });
    });
}

function updateBeatCount() {
    const beatCountElements = document.querySelectorAll('#beatCount');
    beatCountElements.forEach(el => {
        if (el) el.textContent = beats.length;
    });
}

function updateMixCount() {
    const mixCountElements = document.querySelectorAll('#mixCount');
    mixCountElements.forEach(el => {
        if (el) el.textContent = mixes.length;
    });
}

function updateFeedbackCount() {
    const feedbackCountElements = document.querySelectorAll('#feedbackCount');
    feedbackCountElements.forEach(el => {
        if (el) el.textContent = feedbacks.length;
    });
}

// ============================================
// IMAGE MANAGEMENT (FROM OLD)
// ============================================
function initImageManagement() {
    const adminBgUpload = document.getElementById('adminBgUpload');
    const adminProfileUpload = document.getElementById('adminProfileUpload');
    const adminSaveImagesBtn = document.getElementById('adminSaveImages');
    const adminResetImagesBtn = document.getElementById('adminResetImages');
    
    let adminCurrentBgImage = localStorage.getItem('websiteBackground') || 'https://i.imgur.com/gcs6MBM.jpeg';
    let adminCurrentProfileImage = localStorage.getItem('websiteProfile') || 'https://i.imgur.com/1TZwnGp.jpeg';
    
    // Load saved images
    function loadAdminImages() {
        const savedBg = localStorage.getItem('websiteBackground');
        const savedProfile = localStorage.getItem('websiteProfile');
        
        if (savedBg) {
            adminCurrentBgImage = savedBg;
            updateImagePreview('adminBgPreview', savedBg, 'Current Background');
        }
        
        if (savedProfile) {
            adminCurrentProfileImage = savedProfile;
            updateImagePreview('adminProfilePreview', savedProfile, 'Current Profile');
        }
    }
    
    // Update image preview
    function updateImagePreview(previewId, imageSrc, altText) {
        const previewElement = document.getElementById(previewId);
        if (previewElement) {
            previewElement.innerHTML = `
                <img src="${imageSrc}" alt="${altText}">
                <div class="preview-overlay">
                    <span>${altText}</span>
                </div>
            `;
        }
    }
    
    // Background image upload
    if (adminBgUpload) {
        adminBgUpload.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file && file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    adminCurrentBgImage = e.target.result;
                    updateImagePreview('adminBgPreview', adminCurrentBgImage, 'New Background');
                };
                reader.readAsDataURL(file);
            }
        });
    }
    
    // Profile image upload
    if (adminProfileUpload) {
        adminProfileUpload.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file && file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    adminCurrentProfileImage = e.target.result;
                    updateImagePreview('adminProfilePreview', adminCurrentProfileImage, 'New Profile');
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
                document.querySelector('#profileImage img').src = adminCurrentProfileImage;
            }
            
            showNotification('Images saved and updated on website');
        });
    }
    
    // Reset images
    if (adminResetImagesBtn) {
        adminResetImagesBtn.addEventListener('click', () => {
            adminCurrentBgImage = 'https://i.imgur.com/gcs6MBM.jpeg';
            adminCurrentProfileImage = 'https://i.imgur.com/1TZwnGp.jpeg';
            
            updateImagePreview('adminBgPreview', adminCurrentBgImage, 'Default Background');
            updateImagePreview('adminProfilePreview', adminCurrentProfileImage, 'Default Profile');
            
            showNotification('Images reset to default');
        });
    }
    
    // Initialize previews
    updateImagePreview('adminBgPreview', adminCurrentBgImage, 'Current Background');
    updateImagePreview('adminProfilePreview', adminCurrentProfileImage, 'Current Profile');
}

// ============================================
// DATA MANAGEMENT
// ============================================
function initDataManagement() {
    const exportDataBtn = document.getElementById('exportData');
    const importDataBtn = document.getElementById('importData');
    const clearAllBeatsBtn = document.getElementById('clearAllBeats');
    const exportFeedbackBtn = document.getElementById('exportFeedback');
    const clearAllFeedbackBtn = document.getElementById('clearAllFeedback');
    
    // Export beats data
    if (exportDataBtn) {
        exportDataBtn.addEventListener('click', () => {
            const exportData = {
                beats: beats,
                exportDate: new Date().toISOString(),
                totalBeats: beats.length
            };
            
            const dataStr = JSON.stringify(exportData, null, 2);
            const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
            
            const exportFileDefaultName = `trek-media-beats-${new Date().toISOString().split('T')[0]}.json`;
            
            const linkElement = document.createElement('a');
            linkElement.setAttribute('href', dataUri);
            linkElement.setAttribute('download', exportFileDefaultName);
            linkElement.click();
            
            showNotification('Beats data exported successfully');
        });
    }
    
    // Export feedback data
    if (exportFeedbackBtn) {
        exportFeedbackBtn.addEventListener('click', () => {
            const exportData = {
                feedback: feedbacks,
                exportDate: new Date().toISOString(),
                totalFeedback: feedbacks.length
            };
            
            const dataStr = JSON.stringify(exportData, null, 2);
            const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
            
            const exportFileDefaultName = `trek-media-feedback-${new Date().toISOString().split('T')[0]}.json`;
            
            const linkElement = document.createElement('a');
            linkElement.setAttribute('href', dataUri);
            linkElement.setAttribute('download', exportFileDefaultName);
            linkElement.click();
            
            showNotification('Feedback data exported successfully');
        });
    }
    
    // Import beats data
    if (importDataBtn) {
        importDataBtn.addEventListener('click', () => {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = '.json';
            
            input.onchange = async (e) => {
                const file = e.target.files[0];
                if (!file) return;
                
                const reader = new FileReader();
                reader.onload = async (e) => {
                    try {
                        const data = JSON.parse(e.target.result);
                        
                        if (confirm(`Import ${data.beats?.length || 0} beats? This will add to existing beats.`)) {
                            if (data.beats && Array.isArray(data.beats)) {
                                let imported = 0;
                                for (const beat of data.beats) {
                                    await addBeatToCloud(beat);
                                    imported++;
                                }
                                showNotification(`Successfully imported ${imported} beats to cloud!`);
                            }
                        }
                    } catch (error) {
                        showNotification('Error importing file. Make sure it\'s a valid JSON export.');
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
            if (confirm("⚠️ WARNING: This will delete ALL beats from cloud storage. Are you sure?")) {
                beatsRef.remove().then(() => {
                    showNotification("All beats cleared from cloud.");
                }).catch(error => {
                    showNotification("Error clearing beats: " + error.message);
                });
            }
        });
    }
    
    // Clear all feedback
    if (clearAllFeedbackBtn) {
        clearAllFeedbackBtn.addEventListener('click', () => {
            if (confirm("⚠️ WARNING: This will delete ALL feedback. Are you sure?")) {
                feedbackRef.remove().then(() => {
                    showNotification("All feedback cleared.");
                }).catch(error => {
                    showNotification("Error clearing feedback: " + error.message);
                });
            }
        });
    }
}

// ============================================
// INITIALIZE EVERYTHING
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    console.log("Initializing Trek Media Studios...");
    
    // Initialize all components
    initThemeSwitcher();
    initNavigation();
    initActiveNavHighlight();
    initScrollAnimations();
    initBeatProtection();
    audioPlayer.init();
    initPurchaseModal();
    initContactForm();
    initFeedbackForm();
    initAdminPanel();
    
    // Load data from cloud
    loadBeatsFromCloud();
    loadMixesFromCloud();
    loadFeedbackFromCloud();
    
    // Add welcome message
    setTimeout(() => {
        showNotification('Welcome to Trek Media Studios! 🎵');
    }, 1000);
    
    console.log("Website initialized successfully with all requested features!");

});

