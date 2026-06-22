/* ============================================================
   MAIN.JS — Kunjal B Portfolio  v3.0
   Global Network BG + Three.js + Full Interactions
   ============================================================ */

/* ================================================
   1. GLOBAL NETWORK CANVAS — ALL sections background
   ================================================ */
(function initGlobalNetwork() {
    var canvas = document.getElementById('global-network');
    if (!canvas) return;
    var ctx = canvas.getContext('2d');
    var W = window.innerWidth, H = window.innerHeight;
    var COUNT = 95, MAX_DIST = 148;
    var PALETTE = ['#6C63FF', '#00F5FF', '#00FFA3', '#A259FF', '#FFB86B'];
    var pts = [];
    var mouseX = -9999, mouseY = -9999;

    function makeP(randPos) {
        return {
            x: randPos ? Math.random() * W : (Math.random() > 0.5 ? -5 : W + 5),
            y: Math.random() * H,
            vx: (Math.random() - 0.5) * 0.30,
            vy: (Math.random() - 0.5) * 0.30,
            r: 0.8 + Math.random() * 1.5,
            a: 0.3 + Math.random() * 0.5,
            c: PALETTE[Math.floor(Math.random() * PALETTE.length)]
        };
    }

    function resize() {
        W = canvas.width = window.innerWidth;
        H = canvas.height = window.innerHeight;
    }

    function tick() {
        ctx.clearRect(0, 0, W, H);
        for (var i = 0; i < pts.length; i++) {
            var p = pts[i];
            p.x += p.vx; p.y += p.vy;
            if (p.x < -20 || p.x > W + 20 || p.y < -20 || p.y > H + 20) { pts[i] = makeP(false); continue; }
            ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fillStyle = p.c; ctx.globalAlpha = p.a; ctx.fill(); ctx.globalAlpha = 1;
        }
        for (var i = 0; i < pts.length; i++) {
            for (var j = i + 1; j < pts.length; j++) {
                var a = pts[i], b = pts[j];
                var dx = a.x - b.x, dy = a.y - b.y;
                var d = Math.sqrt(dx * dx + dy * dy);
                if (d < MAX_DIST) {
                    ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y);
                    ctx.strokeStyle = 'rgba(108,99,255,' + ((1 - d / MAX_DIST) * 0.14) + ')';
                    ctx.lineWidth = 0.7; ctx.stroke();
                }
            }
        }
        for (var i = 0; i < pts.length; i++) {
            var p = pts[i];
            var dx = p.x - mouseX, dy = p.y - mouseY;
            var d = Math.sqrt(dx * dx + dy * dy);
            if (d < 195) {
                ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(mouseX, mouseY);
                ctx.strokeStyle = 'rgba(0,245,255,' + ((1 - d / 195) * 0.28) + ')';
                ctx.lineWidth = 0.5; ctx.stroke();
            }
        }
        requestAnimationFrame(tick);
    }

    document.addEventListener('mousemove', function(e) { mouseX = e.clientX; mouseY = e.clientY; });
    resize();
    for (var i = 0; i < COUNT; i++) pts.push(makeP(true));
    window.addEventListener('resize', resize);
    requestAnimationFrame(tick);
}());

/* ================================================
   2. LENIS SMOOTH SCROLL
   ================================================ */
var lenis = new Lenis({
    duration: 1.1,
    easing: function(t) { return Math.min(1, 1.001 - Math.pow(2, -10 * t)); },
    smooth: true,
    mouseMultiplier: 1,
    touchMultiplier: 2,
});
function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
requestAnimationFrame(raf);

/* ================================================
   3. GSAP + ScrollTrigger
   ================================================ */
gsap.registerPlugin(ScrollTrigger);
lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add(function(time) { lenis.raf(time * 1000); });
gsap.ticker.lagSmoothing(0);

/* ================================================
   4. SCROLL PROGRESS BAR
   ================================================ */
var progressBar = document.getElementById('scroll-progress');
window.addEventListener('scroll', function() {
    if (!progressBar) return;
    var scrollTop = window.scrollY || document.documentElement.scrollTop;
    var docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    var pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    progressBar.style.width = pct + '%';
});

/* ================================================
   5. SMOOTH NAV LINKS (Lenis scrollTo)
   ================================================ */
document.querySelectorAll('.nav-smooth, .mobile-link').forEach(function(link) {
    link.addEventListener('click', function(e) {
        var href = link.getAttribute('href') || link.dataset.target;
        if (!href || href.charAt(0) !== '#') return;
        var target = document.querySelector(href);
        if (!target) return;
        e.preventDefault();
        lenis.scrollTo(target, { offset: -80, duration: 1.2 });
        // close mobile menu if open
        var mm = document.getElementById('mobile-menu');
        if (mm) mm.classList.remove('open');
    });
});

/* ================================================
   6. CUSTOM CURSOR
   ================================================ */
var cursor = document.getElementById('cursor');
var follower = document.getElementById('cursor-follower');
var mX = 0, mY = 0, fX = 0, fY = 0;

document.addEventListener('mousemove', function(e) {
    mX = e.clientX; mY = e.clientY;
    gsap.to(cursor, { x: mX, y: mY, duration: 0.08, ease: 'none' });
});
gsap.ticker.add(function() {
    fX += (mX - fX) * 0.12; fY += (mY - fY) * 0.12;
    gsap.set(follower, { x: fX, y: fY });
});
document.querySelectorAll('a, button, .proj-showcase-card, .hack-card, .cert-card, .ach-card, .contact-card, .gh-stat-box, .proj-duo-card').forEach(function(el) {
    el.addEventListener('mouseenter', function() { cursor.classList.add('active'); follower.classList.add('active'); });
    el.addEventListener('mouseleave', function() { cursor.classList.remove('active'); follower.classList.remove('active'); });
});

/* ================================================
   7. PRELOADER
   ================================================ */
var preloaderEl = document.getElementById('preloader');
var barEl = document.getElementById('preloader-bar');
var pctEl = document.getElementById('preloader-percent');
var pct = 0;

var pInterval = setInterval(function() {
    pct += Math.random() * 12 + 3;
    if (pct >= 100) {
        pct = 100;
        clearInterval(pInterval);
        setTimeout(function() {
            gsap.to(preloaderEl, {
                yPercent: -100, duration: 1.4, ease: 'expo.inOut',
                onComplete: function() { preloaderEl.style.display = 'none'; initHeroAnims(); }
            });
        }, 400);
    }
    if (barEl) barEl.style.width = pct + '%';
    if (pctEl) pctEl.textContent = Math.floor(pct) + '%';
}, 80);

/* ================================================
   8. HERO ANIMATIONS
   ================================================ */
function initHeroAnims() {
    var tl = gsap.timeline({ defaults: { ease: 'power4.out' } });
    tl.from('.hero-badge', { y: 20, opacity: 0, duration: 0.7 })
      .from('#name-1', { y: 80, opacity: 0, duration: 1 }, '-=0.3')
      .from('#name-2', { y: 80, opacity: 0, duration: 1 }, '-=0.7')
      .from('.hero-role', { y: 20, opacity: 0, duration: 0.7 }, '-=0.5')
      .from('.hero-desc', { y: 20, opacity: 0, duration: 0.7 }, '-=0.5')
      .from('.htag', { y: 15, opacity: 0, stagger: 0.07, duration: 0.5, ease: 'back.out(1.7)' }, '-=0.4')
      .from('.hero-actions > *', { y: 20, opacity: 0, stagger: 0.1, duration: 0.5 }, '-=0.3')
      .from('.hs-icon', { scale: 0, opacity: 0, stagger: 0.08, duration: 0.4, ease: 'back.out(2)' }, '-=0.3')
      .from('.scroll-hint', { opacity: 0, duration: 0.8 }, '-=0.2');
    gsap.from('.social-sidebar', { opacity: 0, x: -20, duration: 1, delay: 1.5 });
    startTypewriter();
}

/* ================================================
   9. TYPEWRITER
   ================================================ */
var roles = ['Cloud Architect', 'AI/ML Engineer', 'Full-Stack Dev', 'Software Engineer', 'DevOps Engineer'];
var rI = 0, cI = 0, typing = true;
var typedEl = document.getElementById('role-typed');
function typeLoop() {
    if (!typedEl) return;
    if (typing) {
        if (cI < roles[rI].length) { typedEl.textContent += roles[rI][cI++]; setTimeout(typeLoop, 95); }
        else { typing = false; setTimeout(typeLoop, 1800); }
    } else {
        if (cI > 0) { typedEl.textContent = roles[rI].substring(0, --cI); setTimeout(typeLoop, 45); }
        else { rI = (rI + 1) % roles.length; typing = true; setTimeout(typeLoop, 300); }
    }
}
function startTypewriter() { setTimeout(typeLoop, 2000); }

/* ================================================
   10. NAVBAR — scroll + active section
   ================================================ */
var navbar = document.getElementById('navbar');
var hamburger = document.getElementById('hamburger');
var mobileMenu = document.getElementById('mobile-menu');

window.addEventListener('scroll', function() {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
    var sections = document.querySelectorAll('section[id]');
    var current = '';
    sections.forEach(function(sec) {
        if (window.scrollY >= sec.offsetTop - 160) current = sec.getAttribute('id');
    });
    document.querySelectorAll('.nav-link').forEach(function(l) {
        l.classList.toggle('active', l.getAttribute('href') === '#' + current);
    });
});

if (hamburger) {
    hamburger.addEventListener('click', function() {
        mobileMenu.classList.toggle('open');
        var isOpen = mobileMenu.classList.contains('open');
        var spans = hamburger.querySelectorAll('span');
        spans[0].style.transform = isOpen ? 'rotate(45deg) translate(5px,5px)' : '';
        spans[1].style.opacity = isOpen ? '0' : '1';
        spans[2].style.transform = isOpen ? 'rotate(-45deg) translate(5px,-5px)' : '';
    });
}

/* ================================================
   11. SCROLL REVEAL
   ================================================ */
var revealObserver = new IntersectionObserver(function(entries) {
    entries.forEach(function(e) {
        if (e.isIntersecting) {
            var delay = parseFloat(e.target.dataset.delay || 0) * 100;
            setTimeout(function() { e.target.classList.add('visible'); }, delay);
        }
    });
}, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });
document.querySelectorAll('.reveal-up').forEach(function(el) { revealObserver.observe(el); });

/* ================================================
   12. COUNTER ANIMATION
   ================================================ */
function animateCounter(el, target) {
    var startTime = null;
    var duration = 2000;
    function step(time) {
        if (!startTime) startTime = time;
        var progress = Math.min((time - startTime) / duration, 1);
        var eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.floor(eased * target).toLocaleString();
        if (progress < 1) requestAnimationFrame(step);
        else el.textContent = target.toLocaleString();
    }
    requestAnimationFrame(step);
}
var achObserver = new IntersectionObserver(function(entries) {
    entries.forEach(function(e) { if (e.isIntersecting) { animateCounter(e.target, parseInt(e.target.dataset.target)); achObserver.unobserve(e.target); } });
}, { threshold: 0.5 });
document.querySelectorAll('.ach-counter').forEach(function(el) { achObserver.observe(el); });

var ghObserver = new IntersectionObserver(function(entries) {
    entries.forEach(function(e) { if (e.isIntersecting) { animateCounter(e.target, parseInt(e.target.dataset.target)); ghObserver.unobserve(e.target); } });
}, { threshold: 0.5 });
document.querySelectorAll('.gh-counter').forEach(function(el) { ghObserver.observe(el); });

/* ================================================
   13. SKILL BARS
   ================================================ */
var skillBarObserver = new IntersectionObserver(function(entries) {
    entries.forEach(function(e) {
        if (e.isIntersecting) {
            e.target.style.width = e.target.style.getPropertyValue('--w');
            skillBarObserver.unobserve(e.target);
        }
    });
}, { threshold: 0.3 });
document.querySelectorAll('.sg6-fill').forEach(function(bar) { skillBarObserver.observe(bar); });

/* ================================================
   14. EXPERIENCE TIMELINE CAROUSEL
   ================================================ */
var expCardsRow = document.getElementById('exp-cards-row');
var expPrev = document.getElementById('exp-prev');
var expNext = document.getElementById('exp-next');
var expDots = document.querySelectorAll('.exp-dot');

if (expCardsRow && expPrev && expNext) {
    var activeCardIndex = 0; // Start at the first card
    var expCards = expCardsRow.querySelectorAll('.exp-card');

    function visibleCount() { return window.innerWidth > 1100 ? 3 : (window.innerWidth > 640 ? 2 : 1); }
    function maxIndex() { return Math.max(0, expCards.length - visibleCount()); }
    
    function updateTimeline() {
        expDots.forEach(function(d, i) { d.classList.toggle('exp-dot-active', i === activeCardIndex); });
        expCards.forEach(function(card, i) { card.classList.toggle('exp-card-active', i === activeCardIndex); });
        var expIndex = Math.max(0, Math.min(activeCardIndex, maxIndex()));
        var firstCard = expCardsRow.querySelector('.exp-card');
        if (!firstCard) return;
        var cardW = firstCard.offsetWidth + 18;
        gsap.to(expCardsRow, { x: -expIndex * cardW, duration: 0.5, ease: 'power3.out' });
    }

    function navigateTimeline(dir) {
        activeCardIndex = Math.max(0, Math.min(activeCardIndex + dir, expCards.length - 1));
        updateTimeline();
    }

    expPrev.addEventListener('click', function() { navigateTimeline(-1); });
    expNext.addEventListener('click', function() { navigateTimeline(1); });

    // Make dots interactive
    expDots.forEach(function(dot, idx) {
        dot.addEventListener('click', function() {
            activeCardIndex = idx;
            updateTimeline();
        });
    });

    var touchStartX = 0;
    expCardsRow.addEventListener('touchstart', function(e) { touchStartX = e.touches[0].clientX; }, { passive: true });
    expCardsRow.addEventListener('touchend', function(e) {
        var diff = touchStartX - e.changedTouches[0].clientX;
        if (Math.abs(diff) > 50) navigateTimeline(diff > 0 ? 1 : -1);
    }, { passive: true });

    window.addEventListener('resize', function() {
        var expIndex = Math.max(0, Math.min(activeCardIndex, maxIndex()));
        var firstCard = expCardsRow.querySelector('.exp-card');
        if (!firstCard) return;
        gsap.set(expCardsRow, { x: -expIndex * (firstCard.offsetWidth + 18) });
    });
    updateTimeline();
}

/* ================================================
   15. GITHUB HEATMAP
   ================================================ */
function initGitHubHeatmap() {
    var canvas = document.getElementById('gh-heatmap');
    var monthsRow = document.getElementById('gh-months');
    if (!canvas) return;
    var WEEKS = 53, ROWS = 7, GAP = 3;
    var MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    if (monthsRow) monthsRow.innerHTML = MONTHS.map(function(m) { return '<span>' + m + '</span>'; }).join('');

    function draw() {
        var W2 = canvas.parentElement.clientWidth - 56;
        var cell = Math.min(Math.floor((W2 - (WEEKS - 1) * GAP) / WEEKS), 14);
        canvas.width = WEEKS * (cell + GAP);
        canvas.height = ROWS * (cell + GAP);
        var ctx2 = canvas.getContext('2d');
        ctx2.clearRect(0, 0, canvas.width, canvas.height);
        for (var w = 0; w < WEEKS; w++) {
            for (var d = 0; d < ROWS; d++) {
                var raw = Math.random();
                var v = raw > 0.75 ? raw : raw > 0.5 ? raw * 0.6 : raw > 0.3 ? raw * 0.35 : 0.08;
                var alpha = 0.05 + v * 0.95;
                ctx2.fillStyle = 'rgba(' + Math.floor(100 + v * 8) + ',' + Math.floor(50 + v * 50) + ',' + Math.floor(180 + v * 75) + ',' + alpha + ')';
                ctx2.beginPath();
                if (ctx2.roundRect) ctx2.roundRect(w*(cell+GAP), d*(cell+GAP), cell, cell, 3);
                else ctx2.rect(w*(cell+GAP), d*(cell+GAP), cell, cell);
                ctx2.fill();
            }
        }
    }
    draw();
    window.addEventListener('resize', draw);
}
initGitHubHeatmap();

/* ================================================
   16. SKILLS UNIVERSE CANVAS
   ================================================ */
function initSkillsUniverse() {
    var canvas = document.getElementById('skills-universe-canvas');
    if (!canvas) return;
    var ctx3 = canvas.getContext('2d');
    var W3, H3, mouseX3 = 0, mouseY3 = 0;

    var nodes = [
        { label:'React', color:'#61DAFB', size:9, orbit:110, angle:0, speed:0.008 },
        { label:'Node.js', color:'#3ECF8E', size:8, orbit:110, angle:2.3, speed:0.008 },
        { label:'Java', color:'#f89820', size:8, orbit:110, angle:4.2, speed:0.008 },
        { label:'Python', color:'#3572A5', size:8, orbit:190, angle:0.5, speed:0.005 },
        { label:'Docker', color:'#2496ED', size:9, orbit:190, angle:1.6, speed:0.005 },
        { label:'AWS', color:'#FF9900', size:8, orbit:190, angle:2.8, speed:0.005 },
        { label:'Kubernetes', color:'#326CE5', size:7, orbit:190, angle:4.0, speed:0.005 },
        { label:'ML/AI', color:'#A259FF', size:9, orbit:190, angle:5.3, speed:0.005 },
        { label:'JavaScript', color:'#F7DF1E', size:8, orbit:270, angle:0.8, speed:0.003 },
        { label:'TypeScript', color:'#3178C6', size:7, orbit:270, angle:1.9, speed:0.003 },
        { label:'Azure', color:'#0078D4', size:7, orbit:270, angle:3.1, speed:0.003 },
        { label:'GCP', color:'#4285F4', size:6, orbit:270, angle:4.5, speed:0.003 },
        { label:'CI/CD', color:'#00FFA3', size:7, orbit:270, angle:5.6, speed:0.003 },
        { label:'Git', color:'#F05032', size:7, orbit:350, angle:1.2, speed:0.002 },
        { label:'PostgreSQL', color:'#336791', size:6, orbit:350, angle:2.5, speed:0.002 },
        { label:'MongoDB', color:'#4DB33D', size:6, orbit:350, angle:4.0, speed:0.002 },
        { label:'Spring Boot', color:'#6DB33F', size:6, orbit:350, angle:5.3, speed:0.002 },
        { label:'LangChain', color:'#FFB86B', size:6, orbit:350, angle:0.3, speed:0.002 },
    ];

    function resizeU() { W3 = canvas.width = canvas.parentElement.clientWidth; H3 = canvas.height = canvas.parentElement.clientHeight; }
    canvas.parentElement.addEventListener('mousemove', function(e) { var r = canvas.getBoundingClientRect(); mouseX3 = e.clientX - r.left - W3/2; mouseY3 = e.clientY - r.top - H3/2; });
    canvas.parentElement.addEventListener('mouseleave', function() { mouseX3 = 0; mouseY3 = 0; });

    function drawNode(x, y, n) {
        var r = n.size;
        var g = ctx3.createRadialGradient(x,y,0,x,y,r*3); g.addColorStop(0,n.color+'55'); g.addColorStop(1,'transparent');
        ctx3.beginPath(); ctx3.arc(x,y,r*3,0,Math.PI*2); ctx3.fillStyle=g; ctx3.fill();
        ctx3.beginPath(); ctx3.arc(x,y,r,0,Math.PI*2); ctx3.fillStyle=n.color+'22'; ctx3.fill();
        ctx3.strokeStyle=n.color; ctx3.lineWidth=1.5; ctx3.stroke();
        ctx3.beginPath(); ctx3.arc(x,y,r*0.35,0,Math.PI*2); ctx3.fillStyle=n.color; ctx3.fill();
        ctx3.font='500 11px Inter,sans-serif'; ctx3.fillStyle='rgba(255,255,255,0.75)';
        ctx3.textAlign='center'; ctx3.textBaseline='top'; ctx3.fillText(n.label,x,y+r+5);
    }

    function animU(t) {
        requestAnimationFrame(animU);
        ctx3.clearRect(0,0,W3,H3);
        var cx = W3/2 + mouseX3*0.05, cy = H3/2 + mouseY3*0.05;
        [110,190,270,350].forEach(function(r) { ctx3.beginPath(); ctx3.arc(cx,cy,r,0,Math.PI*2); ctx3.strokeStyle='rgba(255,255,255,0.04)'; ctx3.lineWidth=1; ctx3.stroke(); });
        nodes.forEach(function(n) { n.angle+=n.speed; });
        var positions = nodes.map(function(n) { return {x:cx+Math.cos(n.angle)*n.orbit, y:cy+Math.sin(n.angle)*n.orbit, node:n}; });
        positions.forEach(function(p) { var dist=Math.hypot(p.x-cx,p.y-cy); ctx3.beginPath(); ctx3.moveTo(cx,cy); ctx3.lineTo(p.x,p.y); ctx3.strokeStyle='rgba(0,245,255,'+(0.05+(1-dist/400)*0.12)+')'; ctx3.lineWidth=0.5; ctx3.stroke(); });
        for (var i=0; i<positions.length; i++) for (var j=i+1; j<positions.length; j++) { var dx=positions[i].x-positions[j].x, dy=positions[i].y-positions[j].y, d=Math.hypot(dx,dy); if(d<120){ctx3.beginPath(); ctx3.moveTo(positions[i].x,positions[i].y); ctx3.lineTo(positions[j].x,positions[j].y); ctx3.strokeStyle='rgba(0,245,255,'+(1-d/120)*0.1+')'; ctx3.lineWidth=0.5; ctx3.stroke();} }
        positions.forEach(function(p) { drawNode(p.x,p.y,p.node); });
        var pulse=Math.sin(t*0.002)*3;
        var cg=ctx3.createRadialGradient(cx,cy,0,cx,cy,28+pulse); cg.addColorStop(0,'rgba(0,245,255,0.4)'); cg.addColorStop(1,'transparent');
        ctx3.beginPath(); ctx3.arc(cx,cy,28+pulse,0,Math.PI*2); ctx3.fillStyle=cg; ctx3.fill();
        ctx3.beginPath(); ctx3.arc(cx,cy,14,0,Math.PI*2); ctx3.fillStyle='rgba(0,245,255,0.15)'; ctx3.fill(); ctx3.strokeStyle='#00F5FF'; ctx3.lineWidth=2; ctx3.stroke();
        ctx3.beginPath(); ctx3.arc(cx,cy,5,0,Math.PI*2); ctx3.fillStyle='#00F5FF'; ctx3.fill();
        ctx3.font='bold 14px Space Grotesk,sans-serif'; ctx3.fillStyle='#fff'; ctx3.textAlign='center'; ctx3.textBaseline='bottom'; ctx3.fillText('Kunjal B',cx,cy-18);
        ctx3.font='500 11px Inter,sans-serif'; ctx3.fillStyle='#00F5FF'; ctx3.textBaseline='top'; ctx3.fillText('AI Engineer',cx,cy+20);
    }

    resizeU();
    window.addEventListener('resize', resizeU);
    requestAnimationFrame(animU);
}

var universeObserver = new IntersectionObserver(function(entries) {
    entries.forEach(function(e) { if (e.isIntersecting) { initSkillsUniverse(); universeObserver.disconnect(); } });
}, { threshold: 0.2 });
var unvCanvas = document.getElementById('skills-universe-canvas');
if (unvCanvas) universeObserver.observe(unvCanvas.parentElement);

/* ================================================
   17. WEBGL BACKGROUND (Three.js)
   ================================================ */
function initWebGL() {
    var canvas = document.getElementById('webgl-bg');
    if (!canvas || typeof THREE === 'undefined') return;
    var renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: false });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.z = 14;
    function makeParticles(count, spread, size, color) {
        var geo = new THREE.BufferGeometry();
        var pos = new Float32Array(count * 3);
        for (var i = 0; i < count * 3; i++) pos[i] = (Math.random() - 0.5) * spread;
        geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
        var mat = new THREE.PointsMaterial({ size: size, color: color, transparent: true, opacity: 0.45, blending: THREE.AdditiveBlending, depthWrite: false });
        return new THREE.Points(geo, mat);
    }
    var p1 = makeParticles(600, 40, 0.04, 0x6C63FF);
    var p2 = makeParticles(300, 35, 0.06, 0x00F5FF);
    var p3 = makeParticles(150, 30, 0.08, 0x00FFA3);
    scene.add(p1, p2, p3);
    var bgMX = 0, bgMY = 0;
    document.addEventListener('mousemove', function(e) { bgMX = e.clientX / window.innerWidth - 0.5; bgMY = e.clientY / window.innerHeight - 0.5; });
    window.addEventListener('resize', function() { camera.aspect = window.innerWidth / window.innerHeight; camera.updateProjectionMatrix(); renderer.setSize(window.innerWidth, window.innerHeight); });
    var clock = new THREE.Clock();
    (function tick() {
        var t = clock.getElapsedTime();
        p1.rotation.y = t * 0.04; p1.rotation.x = t * 0.015;
        p2.rotation.y = -t * 0.03; p2.rotation.x = t * 0.02;
        p3.rotation.z = t * 0.025;
        camera.position.x += (bgMX * 4 - camera.position.x) * 0.025;
        camera.position.y += (-bgMY * 4 - camera.position.y) * 0.025;
        camera.lookAt(scene.position);
        renderer.render(scene, camera);
        requestAnimationFrame(tick);
    }());
}
initWebGL();

/* ================================================
   18. HERO GLOBE (Three.js)
   ================================================ */
function initHeroGlobe() {
    var canvas = document.getElementById('hero-globe-canvas');
    if (!canvas || typeof THREE === 'undefined') return;
    var renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
    var W3 = window.innerWidth * 0.55, H3 = window.innerHeight;
    renderer.setSize(W3, H3);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(45, W3/H3, 0.1, 100);
    camera.position.z = 5;
    var group = new THREE.Group(); scene.add(group);
    group.add(new THREE.Mesh(new THREE.SphereGeometry(1.8,40,40), new THREE.MeshBasicMaterial({color:0x00F5FF,wireframe:true,transparent:true,opacity:0.12})));
    group.add(new THREE.Mesh(new THREE.SphereGeometry(1.2,20,20), new THREE.MeshBasicMaterial({color:0x6C63FF,wireframe:true,transparent:true,opacity:0.08})));
    function makeRing(size,rx,ry,rz,color,opacity) { var r = new THREE.Mesh(new THREE.TorusGeometry(size,0.008,16,120), new THREE.MeshBasicMaterial({color:color,transparent:true,opacity:opacity})); r.rotation.set(rx,ry,rz); return r; }
    var ring1=makeRing(2.4,Math.PI/2.5,0,0,0x00FFA3,0.5);
    var ring2=makeRing(3.1,Math.PI/6,Math.PI/3,0,0x00F5FF,0.35);
    var ring3=makeRing(2.8,0,Math.PI/4,Math.PI/5,0x6C63FF,0.25);
    group.add(ring1,ring2,ring3);
    var dot = new THREE.Mesh(new THREE.SphereGeometry(0.06,12,12), new THREE.MeshBasicMaterial({color:0x00FFA3})); scene.add(dot);
    var gMX=0, gMY=0;
    document.addEventListener('mousemove', function(e) { gMX=(e.clientX/window.innerWidth-0.5)*2; gMY=(e.clientY/window.innerHeight-0.5)*-2; });
    window.addEventListener('resize', function() { W3=window.innerWidth*0.55; H3=window.innerHeight; renderer.setSize(W3,H3); camera.aspect=W3/H3; camera.updateProjectionMatrix(); });
    var clk = new THREE.Clock();
    (function tick() {
        var t=clk.getElapsedTime();
        group.rotation.y=t*0.15+gMX*0.3; group.rotation.x=gMY*0.25;
        ring1.rotation.z=t*0.4; ring2.rotation.z=-t*0.25; ring3.rotation.y=t*0.3;
        dot.position.x=group.position.x+Math.cos(t*0.4)*2.4;
        dot.position.y=group.position.y+Math.sin(t*0.4)*2.4*Math.sin(Math.PI/2.5);
        dot.position.z=group.position.z+Math.sin(t*0.4)*2.4*Math.cos(Math.PI/2.5);
        renderer.render(scene,camera); requestAnimationFrame(tick);
    }());
}
initHeroGlobe();

/* ================================================
   19. PROJECT CARD 3D TILT
   ================================================ */
document.querySelectorAll('.proj-showcase-card, .proj-duo-card, .hack-card, .cert-card').forEach(function(card) {
    card.addEventListener('mousemove', function(e) {
        var rect = card.getBoundingClientRect();
        var x = (e.clientX - rect.left) / rect.width - 0.5;
        var y = (e.clientY - rect.top) / rect.height - 0.5;
        gsap.to(card, { rotateY: x * 6, rotateX: -y * 5, transformPerspective: 800, duration: 0.35, ease: 'power2.out' });
    });
    card.addEventListener('mouseleave', function() {
        gsap.to(card, { rotateY: 0, rotateX: 0, duration: 0.6, ease: 'elastic.out(1,0.5)' });
    });
});

/* ================================================
   20. CONTACT FORM
   ================================================ */
var contactForm = document.getElementById('contact-form');
var cfSuccess = document.getElementById('cf-success');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        var btn = contactForm.querySelector('button[type=submit]');
        btn.textContent = 'Sending...';
        btn.style.opacity = '0.7';
        setTimeout(function() {
            btn.innerHTML = 'Send Message <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>';
            btn.style.opacity = '1';
            contactForm.reset();
            if (cfSuccess) { cfSuccess.style.display = 'block'; setTimeout(function() { cfSuccess.style.display = 'none'; }, 4000); }
        }, 1500);
    });
}

/* ================================================
   21. GSAP SCROLL ANIMATIONS
   ================================================ */
gsap.utils.toArray('.section-heading').forEach(function(el) {
    gsap.from(el, { scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play none none reverse' }, y: 50, opacity: 0, duration: 1, ease: 'power3.out' });
});
gsap.utils.toArray('.about-card').forEach(function(el, i) {
    gsap.from(el, { scrollTrigger: { trigger: el, start: 'top 90%', toggleActions: 'play none none reverse' }, x: 30, opacity: 0, duration: 0.7, delay: i * 0.1, ease: 'power3.out' });
});
gsap.utils.toArray('.ach-card').forEach(function(el, i) {
    gsap.from(el, { scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play none none reverse' }, y: 40, opacity: 0, duration: 0.8, delay: i * 0.12, ease: 'power3.out' });
});
gsap.utils.toArray('.proj-showcase-card, .proj-duo-card').forEach(function(el, i) {
    if (!el.classList.contains('reveal-up')) {
        gsap.from(el, { scrollTrigger: { trigger: el, start: 'top 88%', toggleActions: 'play none none reverse' }, y: 50, opacity: 0, duration: 0.9, delay: i * 0.1, ease: 'power3.out' });
    }
});
gsap.utils.toArray('.hack-card').forEach(function(el, i) {
    if (!el.classList.contains('reveal-up')) {
        gsap.from(el, { scrollTrigger: { trigger: el, start: 'top 88%', toggleActions: 'play none none reverse' }, y: 40, opacity: 0, duration: 0.7, delay: i * 0.08, ease: 'power3.out' });
    }
});
gsap.utils.toArray('.cert-card').forEach(function(el, i) {
    if (!el.classList.contains('reveal-up')) {
        gsap.from(el, { scrollTrigger: { trigger: el, start: 'top 88%', toggleActions: 'play none none reverse' }, y: 40, opacity: 0, scale: 0.97, duration: 0.7, delay: i * 0.08, ease: 'power3.out' });
    }
});
