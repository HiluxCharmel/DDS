/* ================================
   ORGANIGRAMME.JS - INTERACTIONS DE OUF 🚀
   JavaScript ultra-interactif pour la page organigramme
   ================================ */

document.addEventListener('DOMContentLoaded', function() {
    console.log('%c🏢 Organigramme DDS-O chargé!', 'color: #1a5f7a; font-size: 18px; font-weight: bold;');
    initOrganigramme();
});

// ================================
// INITIALISATION PRINCIPALE
// ================================
function initOrganigramme() {
    createFloatingParticles();
    initScrollRevealAnimations();
    init3DCardTilt();
    initInteractiveCards();
    initZoomControls();
    initSearchFeature();
    initPrintButton();
    initTooltips();
    initStatsCounter();
    initKeyboardNavigation();
    initExportButton();
    
    console.log('%c✨ Toutes les animations activées!', 'color: #57a773; font-size: 14px;');
}

// ================================
// PARTICULES FLOTTANTES 🌟
// ================================
function createFloatingParticles() {
    const orgChart = document.querySelector('.org-chart');
    if (!orgChart) return;
    
    const particleCount = 20;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'floating-particle';
        
        const size = Math.random() * 5 + 2;
        const x = Math.random() * 100;
        const y = Math.random() * 100;
        const delay = Math.random() * 5;
        const duration = Math.random() * 10 + 10;
        
        particle.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            background: radial-gradient(circle, rgba(26, 95, 122, 0.4) 0%, transparent 70%);
            border-radius: 50%;
            left: ${x}%;
            top: ${y}%;
            animation: floatUpDown ${duration}s ease-in-out infinite;
            animation-delay: ${delay}s;
            pointer-events: none;
            z-index: 0;
        `;
        
        orgChart.appendChild(particle);
    }
}

// ================================
// ANIMATIONS AU SCROLL 📜
// ================================
function initScrollRevealAnimations() {
    const elements = document.querySelectorAll('.org-box, .zone-card, .legend');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    elements.forEach(el => observer.observe(el));
}

// ================================
// EFFET 3D TILT SUR LES CARTES 🎨
// ================================
function init3DCardTilt() {
    const cards = document.querySelectorAll('.org-box, .zone-card');
    
    cards.forEach(card => {
        card.addEventListener('mousemove', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 12;
            const rotateY = (centerX - x) / 12;
            
            this.style.transform = `
                perspective(1000px) 
                rotateX(${-rotateX}deg) 
                rotateY(${rotateY}deg) 
                translateY(-15px) 
                scale(1.05)
            `;
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = '';
        });
    });
}

// ================================
// CARTES INTERACTIVES CLIQUABLES 🎯
// ================================
function initInteractiveCards() {
    const orgBoxes = document.querySelectorAll('.org-box');
    
    orgBoxes.forEach(box => {
        // Click pour expand
        box.addEventListener('click', function(e) {
            e.stopPropagation();
            toggleCardExpansion(this);
        });
        
        // Double-click pour infos détaillées
        box.addEventListener('dblclick', function(e) {
            e.preventDefault();
            showDetailModal(this);
        });
    });
    
    // Fermer les cartes expandées en cliquant ailleurs
    document.addEventListener('click', function() {
        document.querySelectorAll('.org-box.expanded').forEach(box => {
            box.classList.remove('expanded');
        });
    });
}

function toggleCardExpansion(card) {
    const isExpanded = card.classList.contains('expanded');
    
    // Fermer toutes les autres
    document.querySelectorAll('.org-box.expanded').forEach(box => {
        if (box !== card) {
            box.classList.remove('expanded');
        }
    });
    
    if (isExpanded) {
        card.classList.remove('expanded');
    } else {
        card.classList.add('expanded');
        card.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
}

function showDetailModal(card) {
    const title = card.querySelector('.org-title')?.textContent || 'Détails';
    const name = card.querySelector('.org-name')?.textContent || '';
    const email = card.querySelector('.org-contact span')?.textContent || '';
    
    alert(`📋 ${title}\n\n👤 ${name}\n✉️ ${email}\n\n(Double-cliquez pour voir les détails)`);
}

// ================================
// CONTRÔLES DE ZOOM 🔍
// ================================
function initZoomControls() {
    const zoomControls = document.createElement('div');
    zoomControls.className = 'zoom-controls';
    zoomControls.innerHTML = `
        <button class="zoom-btn zoom-in" title="Zoom avant" aria-label="Zoom avant">
            <ion-icon name="add-outline"></ion-icon>
        </button>
        <button class="zoom-btn zoom-reset" title="Réinitialiser" aria-label="Réinitialiser zoom">
            <ion-icon name="refresh-outline"></ion-icon>
        </button>
        <button class="zoom-btn zoom-out" title="Zoom arrière" aria-label="Zoom arrière">
            <ion-icon name="remove-outline"></ion-icon>
        </button>
    `;
    
    document.body.appendChild(zoomControls);
    
    // Styles inline
    const style = document.createElement('style');
    style.textContent = `
        .zoom-controls {
            position: fixed;
            right: 30px;
            bottom: 30px;
            display: flex;
            flex-direction: column;
            gap: 10px;
            z-index: 1000;
            background: white;
            padding: 12px;
            border-radius: 16px;
            box-shadow: 0 8px 30px rgba(0,0,0,0.15);
            animation: fadeInUp 0.5s ease-out;
        }
        .zoom-btn {
            width: 48px;
            height: 48px;
            border: none;
            background: linear-gradient(135deg, var(--primary-teal), var(--primary-green));
            color: white;
            border-radius: 12px;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.3s ease;
            font-size: 24px;
        }
        .zoom-btn:hover {
            transform: scale(1.1);
            box-shadow: 0 6px 20px rgba(26, 95, 122, 0.4);
        }
        .zoom-btn:active {
            transform: scale(0.95);
        }
        .zoom-btn ion-icon {
            font-size: 28px;
        }
    `;
    document.head.appendChild(style);
    
    let currentZoom = 1;
    const minZoom = 0.5;
    const maxZoom = 1.5;
    const zoomStep = 0.1;
    
    const orgChart = document.querySelector('.org-chart .container');
    
    // Zoom in
    zoomControls.querySelector('.zoom-in').addEventListener('click', () => {
        currentZoom = Math.min(currentZoom + zoomStep, maxZoom);
        applyZoom();
    });
    
    // Zoom out
    zoomControls.querySelector('.zoom-out').addEventListener('click', () => {
        currentZoom = Math.max(currentZoom - zoomStep, minZoom);
        applyZoom();
    });
    
    // Reset
    zoomControls.querySelector('.zoom-reset').addEventListener('click', () => {
        currentZoom = 1;
        applyZoom();
    });
    
    // Zoom avec la molette (Ctrl + scroll)
    document.addEventListener('wheel', (e) => {
        if (e.ctrlKey) {
            e.preventDefault();
            currentZoom = e.deltaY < 0 
                ? Math.min(currentZoom + zoomStep, maxZoom)
                : Math.max(currentZoom - zoomStep, minZoom);
            applyZoom();
        }
    }, { passive: false });
    
    function applyZoom() {
        if (orgChart) {
            orgChart.style.transform = `scale(${currentZoom})`;
            orgChart.style.transition = 'transform 0.3s ease';
        }
    }
}

// ================================
// RECHERCHE DYNAMIQUE 🔎
// ================================
function initSearchFeature() {
    const searchBar = document.createElement('div');
    searchBar.className = 'org-search-bar';
    searchBar.innerHTML = `
        <input type="text" 
               id="orgSearch" 
               placeholder="Rechercher un service ou une personne..."
               aria-label="Rechercher dans l'organigramme">
        <ion-icon name="search-outline"></ion-icon>
    `;
    
    document.body.appendChild(searchBar);
    
    const style = document.createElement('style');
    style.textContent = `
        .org-search-bar {
            position: fixed;
            top: 100px;
            right: 30px;
            z-index: 1000;
            background: white;
            padding: 12px 20px;
            border-radius: 30px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.15);
            display: flex;
            align-items: center;
            gap: 12px;
            animation: fadeInUp 0.5s ease-out 0.2s backwards;
        }
        .org-search-bar input {
            border: none;
            outline: none;
            font-size: 15px;
            width: 220px;
            font-family: var(--font-body);
        }
        .org-search-bar ion-icon {
            font-size: 22px;
            color: var(--primary-teal);
        }
        .org-box.highlighted {
            outline: 4px solid var(--accent-coral) !important;
            outline-offset: 4px;
            animation: pulseGlow 1s ease-in-out infinite !important;
        }
    `;
    document.head.appendChild(style);
    
    const input = searchBar.querySelector('input');
    
    input.addEventListener('input', function(e) {
        const searchTerm = e.target.value.toLowerCase().trim();
        const boxes = document.querySelectorAll('.org-box');
        
        boxes.forEach(box => {
            const text = box.textContent.toLowerCase();
            if (searchTerm && text.includes(searchTerm)) {
                box.classList.add('highlighted');
                // Scroll vers le premier résultat
                if (boxes[0] === box) {
                    box.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            } else {
                box.classList.remove('highlighted');
            }
        });
    });
}

// ================================
// BOUTON D'IMPRESSION 🖨️
// ================================
function initPrintButton() {
    const printBtn = document.createElement('button');
    printBtn.className = 'print-btn';
    printBtn.innerHTML = '<ion-icon name="print-outline"></ion-icon>';
    printBtn.title = 'Imprimer l\'organigramme';
    printBtn.setAttribute('aria-label', 'Imprimer');
    
    document.body.appendChild(printBtn);
    
    const style = document.createElement('style');
    style.textContent = `
        .print-btn {
            position: fixed;
            right: 30px;
            top: 190px;
            width: 56px;
            height: 56px;
            border: none;
            background: linear-gradient(135deg, var(--primary-teal), var(--primary-green));
            color: white;
            border-radius: 50%;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 26px;
            box-shadow: 0 6px 25px rgba(26, 95, 122, 0.3);
            z-index: 1000;
            transition: all 0.3s ease;
            animation: fadeInUp 0.5s ease-out 0.4s backwards;
        }
        .print-btn:hover {
            transform: scale(1.15) rotate(5deg);
            box-shadow: 0 8px 30px rgba(26, 95, 122, 0.5);
        }
        .print-btn:active {
            transform: scale(0.95);
        }
    `;
    document.head.appendChild(style);
    
    printBtn.addEventListener('click', function() {
        window.print();
    });
}

// ================================
// TOOLTIPS INFORMATIFS 💬
// ================================
function initTooltips() {
    const boxes = document.querySelectorAll('.org-box');
    
    boxes.forEach(box => {
        box.addEventListener('mouseenter', function(e) {
            const title = this.querySelector('.org-title');
            if (title) {
                showTooltip(this, title.textContent);
            }
        });
        
        box.addEventListener('mouseleave', function() {
            hideTooltip();
        });
    });
}

let currentTooltip = null;

function showTooltip(element, text) {
    hideTooltip();
    
    const tooltip = document.createElement('div');
    tooltip.className = 'org-tooltip';
    tooltip.textContent = text;
    tooltip.style.cssText = `
        position: fixed;
        background: rgba(26, 95, 122, 0.95);
        color: white;
        padding: 10px 18px;
        border-radius: 10px;
        font-size: 14px;
        pointer-events: none;
        z-index: 10000;
        box-shadow: 0 6px 20px rgba(0,0,0,0.25);
        animation: fadeInUp 0.2s ease;
        backdrop-filter: blur(10px);
    `;
    
    document.body.appendChild(tooltip);
    
    const rect = element.getBoundingClientRect();
    const tooltipRect = tooltip.getBoundingClientRect();
    
    tooltip.style.left = rect.left + (rect.width / 2) - (tooltipRect.width / 2) + 'px';
    tooltip.style.top = rect.top - tooltipRect.height - 12 + window.scrollY + 'px';
    
    currentTooltip = tooltip;
}

function hideTooltip() {
    if (currentTooltip) {
        currentTooltip.remove();
        currentTooltip = null;
    }
}

// ================================
// COMPTEUR ANIMÉ POUR LES STATS 📊
// ================================
function initStatsCounter() {
    const statElements = document.querySelectorAll('.zone-info p');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateNumbers(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    statElements.forEach(el => observer.observe(el));
}

function animateNumbers(element) {
    const text = element.textContent;
    const matches = text.match(/\d+/g);
    
    if (!matches) return;
    
    matches.forEach(match => {
        const target = parseInt(match);
        const duration = 2000;
        const steps = 60;
        const increment = target / steps;
        let current = 0;
        
        const interval = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(interval);
            }
            
            const newText = text.replace(match, Math.floor(current).toString());
            element.textContent = newText;
        }, duration / steps);
    });
}

// ================================
// NAVIGATION AU CLAVIER ⌨️
// ================================
function initKeyboardNavigation() {
    const boxes = Array.from(document.querySelectorAll('.org-box'));
    let currentIndex = 0;
    
    document.addEventListener('keydown', function(e) {
        if (boxes.length === 0) return;
        
        switch(e.key) {
            case 'ArrowDown':
            case 'ArrowRight':
                e.preventDefault();
                currentIndex = (currentIndex + 1) % boxes.length;
                focusBox(boxes[currentIndex]);
                break;
            case 'ArrowUp':
            case 'ArrowLeft':
                e.preventDefault();
                currentIndex = (currentIndex - 1 + boxes.length) % boxes.length;
                focusBox(boxes[currentIndex]);
                break;
            case 'Enter':
                e.preventDefault();
                if (boxes[currentIndex]) {
                    toggleCardExpansion(boxes[currentIndex]);
                }
                break;
            case 'Escape':
                document.querySelectorAll('.org-box.expanded').forEach(box => {
                    box.classList.remove('expanded');
                });
                break;
        }
    });
    
    function focusBox(box) {
        box.focus();
        box.scrollIntoView({ behavior: 'smooth', block: 'center' });
        
        // Effet visuel temporaire
        box.style.outline = '3px solid var(--accent-coral)';
        box.style.outlineOffset = '5px';
        
        setTimeout(() => {
            box.style.outline = '';
            box.style.outlineOffset = '';
        }, 1000);
    }
    
    // Rendre les boxes focusables
    boxes.forEach(box => {
        box.setAttribute('tabindex', '0');
    });
}

// ================================
// BOUTON D'EXPORT 💾
// ================================
function initExportButton() {
    const exportBtn = document.createElement('button');
    exportBtn.className = 'export-btn';
    exportBtn.innerHTML = '<ion-icon name="download-outline"></ion-icon>';
    exportBtn.title = 'Télécharger l\'organigramme';
    exportBtn.setAttribute('aria-label', 'Télécharger');
    
    document.body.appendChild(exportBtn);
    
    const style = document.createElement('style');
    style.textContent = `
        .export-btn {
            position: fixed;
            right: 30px;
            top: 260px;
            width: 56px;
            height: 56px;
            border: none;
            background: linear-gradient(135deg, var(--accent-coral), var(--accent-warm));
            color: white;
            border-radius: 50%;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 26px;
            box-shadow: 0 6px 25px rgba(212, 82, 110, 0.3);
            z-index: 1000;
            transition: all 0.3s ease;
            animation: fadeInUp 0.5s ease-out 0.6s backwards;
        }
        .export-btn:hover {
            transform: scale(1.15) rotate(-5deg);
            box-shadow: 0 8px 30px rgba(212, 82, 110, 0.5);
        }
        .export-btn:active {
            transform: scale(0.95);
        }
    `;
    document.head.appendChild(style);
    
    exportBtn.addEventListener('click', async function() {
        try {
            // Créer un blob avec le contenu HTML
            const orgChart = document.querySelector('.org-chart');
            const blob = new Blob([orgChart.innerHTML], { type: 'text/html' });
            
            // Créer un lien de téléchargement
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'organigramme-dds-o.html';
            a.click();
            URL.revokeObjectURL(url);
            
            // Notification
            showNotification('✅ Organigramme téléchargé!');
        } catch (err) {
            console.error('Erreur export:', err);
            showNotification('❌ Erreur lors du téléchargement');
        }
    });
}

function showNotification(message) {
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 30px;
        left: 50%;
        transform: translateX(-50%);
        background: rgba(26, 95, 122, 0.95);
        color: white;
        padding: 15px 30px;
        border-radius: 12px;
        font-size: 16px;
        font-weight: 600;
        box-shadow: 0 6px 25px rgba(0,0,0,0.2);
        z-index: 10001;
        animation: fadeInUp 0.3s ease;
        backdrop-filter: blur(10px);
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(-50%) translateY(-20px)';
        notification.style.transition = 'all 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// ================================
// GESTION DES ERREURS
// ================================
window.addEventListener('error', function(e) {
    console.error('Erreur organigramme:', e.message);
});

// ================================
// LOG DE SUCCÈS
// ================================
console.log('%c✨ Organigramme interactif prêt!', 'color: #57a773; font-size: 16px; font-weight: bold;');
console.log('%c💡 Raccourcis clavier:', 'color: #1a5f7a; font-size: 14px;');
console.log('  → Flèches: Naviguer entre les cartes');
console.log('  → Entrée: Développer/réduire');
console.log('  → Échap: Fermer toutes les cartes');
console.log('  → Ctrl + Molette: Zoomer');
