// Lenis Smooth Scroll Setup
const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    direction: 'vertical',
    gestureDirection: 'vertical',
    smooth: true,
    mouseMultiplier: 1,
    smoothTouch: false,
    touchMultiplier: 2,
    infinite: false,
})

function raf(time) {
    lenis.raf(time)
    requestAnimationFrame(raf)
}
requestAnimationFrame(raf)

// Register GSAP ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

// Custom Cursor
const cursor = document.querySelector('.cursor');
const follower = document.querySelector('.cursor-follower');
let mouseX = 0, mouseY = 0, followerX = 0, followerY = 0;

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    
    gsap.to(cursor, {
        x: mouseX,
        y: mouseY,
        duration: 0.1,
        ease: "power2.out"
    });
});

// Follower loop for smooth lag
gsap.ticker.add(() => {
    followerX += (mouseX - followerX) * 0.1;
    followerY += (mouseY - followerY) * 0.1;
    gsap.set(follower, { x: followerX, y: followerY });
});

// Magnetic Buttons
const magnetics = document.querySelectorAll('.magnetic');
magnetics.forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const h = rect.width / 2;
        
        const x = e.clientX - rect.left - h;
        const y = e.clientY - rect.top - h;

        gsap.to(btn, {
            x: x * 0.4,
            y: y * 0.4,
            duration: 0.4,
            ease: "power2.out"
        });
        
        cursor.classList.add('active');
        follower.classList.add('active');
    });

    btn.addEventListener('mouseleave', () => {
        gsap.to(btn, {
            x: 0,
            y: 0,
            duration: 0.7,
            ease: "elastic.out(1, 0.3)"
        });
        cursor.classList.remove('active');
        follower.classList.remove('active');
    });
});

// Interactive hover links
document.querySelectorAll('a').forEach(link => {
    link.addEventListener('mouseenter', () => {
        cursor.classList.add('active');
        follower.classList.add('active');
    });
    link.addEventListener('mouseleave', () => {
        cursor.classList.remove('active');
        follower.classList.remove('active');
    });
});

// Preloader Logic
const preloader = document.querySelector('.preloader');
const progressBar = document.querySelector('.progress-bar');
const progressText = document.querySelector('.progress-text');

let progress = 0;
const interval = setInterval(() => {
    progress += Math.floor(Math.random() * 10) + 1;
    if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        
        gsap.to(preloader, {
            yPercent: -100,
            duration: 1.5,
            ease: "expo.inOut",
            delay: 0.5,
            onComplete: initHeroAnimations
        });
    }
    progressBar.style.width = `${progress}%`;
    progressText.innerText = `${progress}%`;
}, 100);

// Hero Entrance Animations
function initHeroAnimations() {
    const tl = gsap.timeline();
    
    tl.from(".hero-title", {
        y: 100,
        opacity: 0,
        duration: 1,
        ease: "power4.out"
    })
    .from(".typewriter-container", {
        y: 20,
        opacity: 0,
        duration: 0.8,
        ease: "power2.out"
    }, "-=0.5")
    .from(".hero-pills .pill", {
        y: 20,
        opacity: 0,
        duration: 0.5,
        stagger: 0.1,
        ease: "back.out(1.7)"
    }, "-=0.5")
    .from(".hero-cta .btn", {
        y: 20,
        opacity: 0,
        duration: 0.5,
        stagger: 0.1
    }, "-=0.5")
    .from(".social-links a", {
        scale: 0,
        opacity: 0,
        duration: 0.5,
        stagger: 0.1,
        ease: "back.out(2)"
    }, "-=0.5");
}

// Typewriter Effect
const typedTextSpan = document.querySelector(".typewriter-text");
const textArray = ["Cloud Architect", "AI/ML Engineer", "Full-Stack Dev", "Software Engineer"];
const typingDelay = 100;
const erasingDelay = 50;
const newTextDelay = 2000;
let textArrayIndex = 0;
let charIndex = 0;

function type() {
  if (charIndex < textArray[textArrayIndex].length) {
    typedTextSpan.textContent += textArray[textArrayIndex].charAt(charIndex);
    charIndex++;
    setTimeout(type, typingDelay);
  } else {
    setTimeout(erase, newTextDelay);
  }
}

function erase() {
  if (charIndex > 0) {
    typedTextSpan.textContent = textArray[textArrayIndex].substring(0, charIndex - 1);
    charIndex--;
    setTimeout(erase, erasingDelay);
  } else {
    textArrayIndex++;
    if (textArrayIndex >= textArray.length) textArrayIndex = 0;
    setTimeout(type, typingDelay + 1100);
  }
}

setTimeout(type, newTextDelay + 1000);

// Navbar Scroll Effect
const navbar = document.querySelector('.navbar');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Scroll Animations (GSAP ScrollTrigger)
gsap.utils.toArray('.section-header').forEach(header => {
    gsap.from(header, {
        scrollTrigger: {
            trigger: header,
            start: "top 80%",
            toggleActions: "play none none reverse"
        },
        y: 50,
        opacity: 0,
        duration: 1,
        ease: "power3.out"
    });
});

gsap.utils.toArray('.glass-panel').forEach(panel => {
    gsap.from(panel, {
        scrollTrigger: {
            trigger: panel,
            start: "top 85%",
            toggleActions: "play none none reverse"
        },
        y: 50,
        opacity: 0,
        duration: 1,
        ease: "power3.out"
    });
});

// Stat Counters
const counters = document.querySelectorAll('.counter');
counters.forEach(counter => {
    ScrollTrigger.create({
        trigger: counter,
        start: "top 90%",
        onEnter: () => {
            const target = +counter.getAttribute('data-target');
            gsap.to(counter, {
                innerHTML: target,
                duration: 2,
                snap: { innerHTML: 1 },
                ease: "power1.inOut"
            });
        },
        once: true
    });
});

// Skill Bars
gsap.utils.toArray('.bar-fill').forEach(bar => {
    ScrollTrigger.create({
        trigger: bar,
        start: "top 90%",
        onEnter: () => {
            const width = bar.style.getPropertyValue('--w');
            bar.style.width = width;
        },
        once: true
    });
});

// 3D Tilt Effect for Project Cards
const tiltCards = document.querySelectorAll('.3d-tilt');
tiltCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = ((y - centerY) / centerY) * -10;
        const rotateY = ((x - centerX) / centerX) * 10;
        
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
    });
});

// GitHub Heatmap Canvas Simulation
const ghCanvas = document.getElementById('gh-heatmap');
if (ghCanvas) {
    const ctx = ghCanvas.getContext('2d');
    ghCanvas.width = ghCanvas.parentElement.clientWidth - 40;
    
    const drawHeatmap = () => {
        ctx.clearRect(0, 0, ghCanvas.width, ghCanvas.height);
        const cols = Math.floor(ghCanvas.width / 14);
        const rows = 7;
        
        for(let i=0; i<cols; i++) {
            for(let j=0; j<rows; j++) {
                const intensity = Math.random();
                if (intensity > 0.8) {
                    ctx.fillStyle = '#00F5FF';
                } else if (intensity > 0.5) {
                    ctx.fillStyle = '#00FFA3';
                } else if (intensity > 0.2) {
                    ctx.fillStyle = '#6C63FF';
                } else {
                    ctx.fillStyle = 'rgba(255,255,255,0.05)';
                }
                
                ctx.fillRect(i * 14, j * 14, 10, 10);
            }
        }
    };
    
    drawHeatmap();
    window.addEventListener('resize', () => {
        ghCanvas.width = ghCanvas.parentElement.clientWidth - 40;
        drawHeatmap();
    });
}

// Three.js Background WebGL
const initWebglBg = () => {
    const canvas = document.getElementById('webgl-bg');
    if (!canvas) return;

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.z = 15;

    // Particles
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 1200;
    const posArray = new Float32Array(particlesCount * 3);

    for(let i = 0; i < particlesCount * 3; i++) {
        posArray[i] = (Math.random() - 0.5) * 40;
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    const particlesMaterial = new THREE.PointsMaterial({
        size: 0.05,
        color: 0x6C63FF,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending
    });

    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);

    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

    let mouseX = 0;
    let mouseY = 0;

    document.addEventListener('mousemove', (event) => {
        mouseX = event.clientX / window.innerWidth - 0.5;
        mouseY = event.clientY / window.innerHeight - 0.5;
    });

    const clock = new THREE.Clock();

    const tick = () => {
        const elapsedTime = clock.getElapsedTime();

        particlesMesh.rotation.y = elapsedTime * 0.05;
        particlesMesh.rotation.x = elapsedTime * 0.02;

        camera.position.x += (mouseX * 5 - camera.position.x) * 0.02;
        camera.position.y += (-mouseY * 5 - camera.position.y) * 0.02;
        camera.lookAt(scene.position);

        renderer.render(scene, camera);
        requestAnimationFrame(tick);
    }
    tick();
};

initWebglBg();

// Three.js Hero Hologram
const initHeroCanvas = () => {
    const canvas = document.getElementById('hero-canvas');
    if (!canvas) return;

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    
    const updateSize = () => {
        const parent = canvas.parentElement;
        if(parent) {
            renderer.setSize(parent.clientWidth, parent.clientHeight);
            camera.aspect = parent.clientWidth / parent.clientHeight;
            camera.updateProjectionMatrix();
        }
    };

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 100);
    camera.position.z = 5;

    const group = new THREE.Group();
    scene.add(group);

    const sGeo = new THREE.SphereGeometry(1.4, 32, 32);
    const sMat = new THREE.MeshBasicMaterial({ color: 0x6C63FF, wireframe: true, transparent: true, opacity: 0.15 });
    const sphere = new THREE.Mesh(sGeo, sMat);
    group.add(sphere);

    const tGeo1 = new THREE.TorusGeometry(2.2, 0.01, 16, 100);
    const tMat1 = new THREE.MeshBasicMaterial({ color: 0x00FFA3, transparent: true, opacity: 0.3 });
    const torus1 = new THREE.Mesh(tGeo1, tMat1);
    torus1.rotation.x = Math.PI / 2.5;
    group.add(torus1);

    const tGeo2 = new THREE.TorusGeometry(3.0, 0.01, 16, 100);
    const tMat2 = new THREE.MeshBasicMaterial({ color: 0x00F5FF, transparent: true, opacity: 0.3 });
    const torus2 = new THREE.Mesh(tGeo2, tMat2);
    torus2.rotation.y = Math.PI / 3;
    torus2.rotation.x = Math.PI / 6;
    group.add(torus2);

    updateSize();
    window.addEventListener('resize', updateSize);

    let mX = 0, mY = 0;
    document.addEventListener('mousemove', (e) => {
        mX = (e.clientX / window.innerWidth - 0.5) * 2;
        mY = (e.clientY / window.innerHeight - 0.5) * -2;
    });

    const clock = new THREE.Clock();

    const tick = () => {
        const t = clock.getElapsedTime();
        
        group.rotation.y = t * 0.2 + mX * 0.3;
        group.rotation.x = mY * 0.3;
        
        torus1.rotation.z = t * 0.5;
        torus2.rotation.z = -t * 0.3;

        renderer.render(scene, camera);
        requestAnimationFrame(tick);
    };
    tick();
};

initHeroCanvas();
