// Trek Media Studios Website - Complete JavaScript
// FIXED VERSION - No Errors

document.addEventListener('DOMContentLoaded', function() {
    console.log('Website loaded successfully');
    
    // ==================== NOTIFICATION SYSTEM ====================
    function showNotification(message) {
        alert(message); // Simple fix for now
    }
    
    // ==================== THEME MANAGEMENT ====================
    const themeButtons = document.querySelectorAll('.theme-btn');
    const body = document.body;
    
    // Load saved theme
    const savedTheme = localStorage.getItem('websiteTheme') || 'dark';
    body.setAttribute('data-theme', savedTheme);
    
    themeButtons.forEach(btn => {
        if (btn.getAttribute('data-theme') === savedTheme) {
            btn.classList.add('active');
        }
        
        btn.addEventListener('click', function() {
            const theme = this.getAttribute('data-theme');
            body.setAttribute('data-theme', theme);
            themeButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            localStorage.setItem('websiteTheme', theme);
            showNotification(`Theme changed to ${theme} mode`);
        });
    });
    
    // ==================== NAVIGATION ====================
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            navLinks.classList.toggle('active');
            this.innerHTML = navLinks.classList.contains('active') ? 
                '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';
        });
    }
    
    // Smooth scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                navLinks.classList.remove('active');
                if (menuToggle) menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
                
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // ==================== AUDIO PLAYER ====================
    const audioPlayer = {
        audio: null,
        isPlaying: false,
        currentAudioUrl: null,
        currentBeatTitle: '',
        
        init: function() {
            this.audio = new Audio();
            this.audio.volume = 0.7;
            
            // Player controls
            const playBtn = document.getElementById('playBtn');
            if (playBtn) {
                playBtn.addEventListener('click', () => {
                    if (!this.currentAudioUrl) {
                        showNotification('Select a beat to preview first');
                        return;
                    }
                    
                    if (this.isPlaying) {
                        this.pause();
                    } else {
                        this.play();
                    }
                });
            }
            
            // Volume control
            const volumeSlider = document.getElementById('volumeSlider');
            if (volumeSlider) {
                volumeSlider.addEventListener('input', (e) => {
                    this.audio.volume = e.target.value / 100;
                });
            }
        },
        
        play: function() {
            if (!this.currentAudioUrl) return;
            
            try {
                this.audio.play();
                this.isPlaying = true;
                const playBtn = document.getElementById('playBtn');
                if (playBtn) playBtn.innerHTML = '<i class="fas fa-pause"></i>';
            } catch (error) {
                console.log('Audio play error:', error);
            }
        },
        
        pause: function() {
            this.audio.pause();
            this.isPlaying = false;
            const playBtn = document.getElementById('playBtn');
            if (playBtn) playBtn.innerHTML = '<i class="fas fa-play"></i>';
        },
        
        loadAudio: function(url, title) {
            this.currentAudioUrl = url;
            this.currentBeatTitle = title;
            
            // Update UI
            const nowPlaying = document.getElementById('nowPlaying');
            if (nowPlaying) nowPlaying.textContent = title;
            
            const playBtn = document.getElementById('playBtn');
            if (playBtn) playBtn.innerHTML = '<i class="fas fa-play"></i>';
            
            // Load audio
            this.audio.src = url;
            this.isPlaying = false;
        }
    };
    
    // Initialize audio player
    audioPlayer.init();
    
    // ==================== BEAT MANAGEMENT ====================
    const addBeatBtn = document.getElementById('addBeatBtn');
    const beatsGrid = document.getElementById('beatsGrid');
    
    // Create beat card function WITH THUMBNAIL SUPPORT
    function createBeatCard(beat) {
        const beatCard = document.createElement('div');
        beatCard.className = 'beat-card';
        
        // Thumbnail
        const thumbnailHTML = beat.thumbnail ? 
            `<div class="beat-thumbnail">
                <img src="${beat.thumbnail}" alt="${beat.title}" onerror="this.src='https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=400&h=225&fit=crop'">
            </div>` :
            `<div class="beat-thumbnail">
                <div class="default-thumbnail">
                    <i class="fas fa-music"></i>
                    <span>${beat.genre || 'BEAT'}</span>
                </div>
            </div>`;
        
        beatCard.innerHTML = `
            ${thumbnailHTML}
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
                    <span class="price">${beat.lease.startsWith('$') ? beat.lease : '$' + beat.lease}</span>
                </div>
                <div class="price-option">
                    <span class="price-label">Exclusive</span>
                    <span class="price">${beat.exclusive.startsWith('$') ? beat.exclusive : '$' + beat.exclusive}</span>
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
        
        // Add event listeners
        const previewBtn = beatCard.querySelector('.btn-preview');
        if (previewBtn) {
            previewBtn.addEventListener('click', function() {
                const audioUrl = this.getAttribute('data-audio');
                const beatTitle = this.getAttribute('data-title');
                if (audioUrl && audioUrl !== '#') {
                    audioPlayer.loadAudio(audioUrl, beatTitle);
                    audioPlayer.play();
                }
            });
        }
        
        const buyBtn = beatCard.querySelector('.btn-buy');
        if (buyBtn) {
            buyBtn.addEventListener('click', function() {
                const beatTitle = this.getAttribute('data-title');
                openPurchaseModal(beatTitle);
            });
        }
        
        return beatCard;
    }
    
    // Load saved beats
    function loadSavedBeats() {
        if (!beatsGrid) return;
        
        const saved = localStorage.getItem('userBeats');
        if (saved) {
            try {
                const beats = JSON.parse(saved);
                beatsGrid.innerHTML = '';
                
                beats.forEach(beat => {
                    const beatCard = createBeatCard(beat);
                    beatsGrid.appendChild(beatCard);
                });
            } catch(e) {
                console.log('No saved beats');
            }
        }
    }
    
    // Save beats
    function saveCurrentBeats() {
        if (!beatsGrid) return;
        
        const beats = [];
        document.querySelectorAll('.beat-card').forEach(card => {
            beats.push({
                title: card.querySelector('.beat-title')?.textContent || '',
                genre: card.querySelector('.beat-info p:nth-child(1) strong')?.textContent || '',
                bpm: card.querySelector('.beat-info p:nth-child(2) strong')?.textContent || '',
                key: card.querySelector('.beat-info p:nth-child(3) strong')?.textContent || '',
                lease: card.querySelector('.price-option:nth-child(1) .price')?.textContent.replace('$', '') || '50',
                exclusive: card.querySelector('.price-option:nth-child(2) .price')?.textContent.replace('$', '') || '200',
                audio: card.querySelector('.btn-preview')?.getAttribute('data-audio') || '#',
                thumbnail: card.querySelector('.beat-thumbnail img')?.src || ''
            });
        });
        localStorage.setItem('userBeats', JSON.stringify(beats));
    }
    
    // Add beat functionality
    if (addBeatBtn) {
        addBeatBtn.addEventListener('click', function() {
            const title = document.getElementById('beatTitle')?.value.trim() || '';
            const genre = document.getElementById('beatGenre')?.value.trim() || '';
            const bpm = document.getElementById('beatBPM')?.value.trim() || '';
            const key = document.getElementById('beatKey')?.value.trim() || '';
            const leasePrice = document.getElementById('beatPriceLease')?.value.trim() || '50';
            const exclusivePrice = document.getElementById('beatPriceExclusive')?.value.trim() || '200';
            const audioUrl = document.getElementById('beatAudioUrl')?.value.trim() || '#';
            const thumbnailUrl = document.getElementById('beatThumbnailUrl')?.value.trim() || '';
            
            if (!title || !genre || !bpm || !key) {
                showNotification('Please fill in all required fields');
                return;
            }
            
            const newBeat = {
                title: title.toUpperCase(),
                genre: genre,
                bpm: bpm,
                key: key,
                lease: leasePrice,
                exclusive: exclusivePrice,
                audio: audioUrl,
                thumbnail: thumbnailUrl
            };
            
            if (beatsGrid) {
                const beatCard = createBeatCard(newBeat);
                beatsGrid.insertBefore(beatCard, beatsGrid.firstChild);
            }
            
            // Clear form
            ['beatTitle', 'beatGenre', 'beatBPM', 'beatKey', 'beatPriceLease', 'beatPriceExclusive', 'beatAudioUrl', 'beatThumbnailUrl'].forEach(id => {
                const el = document.getElementById(id);
                if (el) el.value = '';
            });
            
            saveCurrentBeats();
            showNotification('Beat added successfully!');
        });
    }
    
    // Load beats on start
    loadSavedBeats();
    
    // ==================== PURCHASE MODAL ====================
    function openPurchaseModal(beatTitle) {
        const modal = document.getElementById('purchaseModal');
        const modalTitle = document.getElementById('modalBeatTitle');
        
        if (modalTitle) modalTitle.textContent = beatTitle;
        if (modal) modal.style.display = 'flex';
    }
    
    const closeModal = document.querySelector('.close-modal');
    if (closeModal) {
        closeModal.addEventListener('click', function() {
            const modal = document.getElementById('purchaseModal');
            if (modal) modal.style.display = 'none';
        });
    }
    
    // ==================== CONTACT FORM ====================
    const messageForm = document.getElementById('messageForm');
    if (messageForm) {
        messageForm.addEventListener('submit', function(e) {
            e.preventDefault();
            showNotification('Email client will open. Please send the message.');
            this.reset();
        });
    }
    
    // ==================== ADMIN PANEL ====================
    const ADMIN_PASSWORD = "Mynthanda265*";
    const adminAccessBtn = document.getElementById('adminAccessBtn');
    const passwordModal = document.getElementById('passwordModal');
    const adminPanel = document.getElementById('adminPanel');
    
    // Show admin button if secret hash
    if (window.location.hash === '#nthanda' && adminAccessBtn) {
        adminAccessBtn.style.display = 'flex';
    }
    
    // Admin access
    if (adminAccessBtn) {
        adminAccessBtn.addEventListener('click', () => {
            if (passwordModal) passwordModal.style.display = 'flex';
        });
    }
    
    const submitPasswordBtn = document.getElementById('submitPassword');
    if (submitPasswordBtn) {
        submitPasswordBtn.addEventListener('click', () => {
            const password = document.getElementById('adminPassword')?.value || '';
            if (password === ADMIN_PASSWORD) {
                if (passwordModal) passwordModal.style.display = 'none';
                if (adminPanel) adminPanel.style.display = 'block';
                showNotification('Admin panel unlocked');
            } else {
                showNotification('Incorrect password');
            }
        });
    }
    
    const cancelPasswordBtn = document.getElementById('cancelPassword');
    if (cancelPasswordBtn) {
        cancelPasswordBtn.addEventListener('click', () => {
            if (passwordModal) passwordModal.style.display = 'none';
        });
    }
    
    const closeAdminBtn = document.querySelector('.close-admin');
    if (closeAdminBtn) {
        closeAdminBtn.addEventListener('click', () => {
            if (adminPanel) adminPanel.style.display = 'none';
        });
    }
    
    // Admin add beat
    const adminAddBeatBtn = document.getElementById('adminAddBeat');
    if (adminAddBeatBtn) {
        adminAddBeatBtn.addEventListener('click', () => {
            const title = document.getElementById('adminBeatTitle')?.value.trim() || '';
            const genre = document.getElementById('adminBeatGenre')?.value.trim() || '';
            const bpm = document.getElementById('adminBeatBPM')?.value.trim() || '';
            const key = document.getElementById('adminBeatKey')?.value.trim() || '';
            const lease = document.getElementById('adminBeatLease')?.value.trim() || '$50';
            const exclusive = document.getElementById('adminBeatExclusive')?.value.trim() || '$200';
            const audio = document.getElementById('adminBeatAudio')?.value.trim() || '#';
            const thumbnail = document.getElementById('adminBeatThumbnail')?.value.trim() || '';
            
            if (!title || !genre || !bpm || !key) {
                showNotification('Please fill required fields');
                return;
            }
            
            // Add to website
            const newBeat = {
                title: title.toUpperCase(),
                genre: genre,
                bpm: bpm,
                key: key,
                lease: lease.startsWith('$') ? lease.replace('$', '') : lease,
                exclusive: exclusive.startsWith('$') ? exclusive.replace('$', '') : exclusive,
                audio: audio,
                thumbnail: thumbnail
            };
            
            if (beatsGrid) {
                const beatCard = createBeatCard(newBeat);
                beatsGrid.insertBefore(beatCard, beatsGrid.firstChild);
                saveCurrentBeats();
            }
            
            // Clear form
            ['adminBeatTitle', 'adminBeatGenre', 'adminBeatBPM', 'adminBeatKey', 'adminBeatLease', 'adminBeatExclusive', 'adminBeatAudio', 'adminBeatThumbnail'].forEach(id => {
                const el = document.getElementById(id);
                if (el) el.value = '';
            });
            
            showNotification('✅ Beat added to website!');
        });
    }
    
    // Clear all beats
    const clearAllBeatsBtn = document.getElementById('clearAllBeats');
    if (clearAllBeatsBtn) {
        clearAllBeatsBtn.addEventListener('click', () => {
            if (confirm('Clear ALL beats from website?')) {
                localStorage.removeItem('userBeats');
                if (beatsGrid) beatsGrid.innerHTML = '';
                showNotification('✅ All beats cleared!');
            }
        });
    }
    
    console.log('All scripts loaded successfully');
});
