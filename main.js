document.addEventListener('DOMContentLoaded', () => {
    (function () {
        if (typeof emailjs !== 'undefined') {
            emailjs.init("1kSvPg7v02JrWtqYg");
        }
    })();

    // --- TOVARLARNI DOIMIY SAQLASH (VERCEL UCHUN OPTIMIZATSIYA) ---
    const defaultProducts = [
        { id: 1, name: "Premium Kovka Darvoza", price: "Kelishuv asosida", image: "./assets/Без названия.png" },
        { id: 2, name: "Zamonaviy Panjara", price: "1 200 000 so'm / m²", image: "./assets/Без названия.png" },
        { id: 3, name: "Sifatli Naves", price: "Kelishuv asosida", image: "./assets/Без названия.png" }
    ];

    if (!localStorage.getItem('adminProducts')) {
        localStorage.setItem('adminProducts', JSON.stringify(defaultProducts));
    }

    const container = document.getElementById('productContainer');
    
    // Tovalarni ekranga chiqarish funksiyasi
    function renderProducts() {
        if (!container) return;
        
        const products = JSON.parse(localStorage.getItem('adminProducts')) || [];
        container.innerHTML = '';

        if (products.length === 0) {
            container.innerHTML = `<p style="color: #888; text-align: center; width: 100%; grid-column: 1/-1; font-size: 18px;">Hozircha mahsulotlar mavjud emas.</p>`;
        } else {
            products.forEach((product, index) => {
                const cardHTML = `
                    <div class="card1" style="animation-delay: ${index * 0.08}s;">
                        <div class="card-img-wrapper">
                            <img src="${product.image || './assets/Без названия.png'}" class="card-img" alt="${product.name}">
                        </div>
                        <div class="card-info">
                            <h3 class="card-title">${product.name}</h3>
                            <p class="card-price">${product.price}</p>
                            <a href="#" class="more-link">
                                <span class="card-text">Ko'proq</span>
                            </a>
                        </div>
                    </div>
                `;
                container.insertAdjacentHTML('beforeend', cardHTML);
            });
        }
    }

    // Tovalarni darhol chizamiz
    renderProducts();

    // "Ko'proq" tugmasini tekshirish (Event Delegation)
    if (container) {
        container.addEventListener('click', (event) => {
            const targetLink = event.target.closest('.more-link');
            if (targetLink) {
                event.preventDefault();
                const isLogged = localStorage.getItem('isLoggedIn') === 'true';

                if (!isLogged) {
                    alert("Iltimos, avval ro'yxatdan o'ting yoki tizimga kiring!");
                } else {
                    console.log("Ruxsat berildi. Mahsulot tafsilotlari.");
                }
            }
        });
    }

    // ------------------------------------------------------------
    // 🔥 YANGI: RASMNI FULL-SCREEN (LIGHTBOX) REJIMIDA OCHISH LOGIKASI
    // ------------------------------------------------------------
    const lightbox = document.getElementById('imageLightbox');
    const lightboxImg = document.getElementById('lightboxImg');
    const lightboxClose = document.querySelector('.lightbox-close');

    if (container && lightbox && lightboxImg) {
        // Event Delegation orqali kartadagi rasm bosilganini aniqlaymiz
        container.addEventListener('click', (event) => {
            const clickedImg = event.target.closest('.card-img');
            if (clickedImg) {
                lightbox.style.display = 'flex'; // Fullscreen oynani ochish
                lightboxImg.src = clickedImg.src; // Bosilgan rasm manzilini o'tkazish
                document.body.style.overflow = 'hidden'; // Orqa fon skroll bo'lmaydi
            }
        });
    }

    // Modalni "X" (Yopish) tugmasi bosilganda yopish
    if (lightboxClose) {
        lightboxClose.addEventListener('click', () => {
            lightbox.style.display = 'none';
            document.body.style.overflow = 'auto'; // Skrollni joyiga qaytarish
        });
    }

    // Modalni qora fon (bo'sh joy) bosilganda ham yopish
    if (lightbox) {
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                lightbox.style.display = 'none';
                document.body.style.overflow = 'auto';
            }
        });
    }

    // ------------------------------------------------------------
    // 🔥 YANGI: KATEGORIYA TUGMALARINING ACTIVE HOLATI (SLIDER)
    // ------------------------------------------------------------
    const catButtons = document.querySelectorAll('.cat-btn');
    catButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Avvalgi active tugmadan klassni olib tashlaymiz
            document.querySelector('.cat-btn.active')?.classList.remove('active');
            // Bosilgan tugmaga active klassini qo'shamiz
            btn.classList.add('active');
            
            console.log(`${btn.textContent} toifasi tanlandi.`);
            // Kelajakda toifaga qarab filterlash logikasini shu yerga ulashingiz mumkin
        });
    });

    // ------------------------------------------------------------
    // ESKI SIGN-IN, SIGN-UP VA DIZAYN ELEMENTLARI LOGIKASI
    // ------------------------------------------------------------
    const about = document.querySelector('.txt1');
    const phone = document.querySelector('.txt2');
    const jaloba = document.querySelector('.txt3');
    const modeBtn = document.getElementById('darkBtn');

    const signUpBtn = document.getElementById('signUpBtn');
    const signInBtn = document.getElementById('signInBtn');
    const logOutBtn = document.getElementById('logOutBtn');

    const signUpModal = document.getElementById('signUpModal');
    const signInModal = document.getElementById('signInModal');
    const closeBtns = document.querySelectorAll('.close');

    // Tugma holatlarini boshqarish funksiyasi
    function updateUI() {
        const isLogged = localStorage.getItem('isLoggedIn') === 'true';
        if (isLogged) {
            if (signInBtn) signInBtn.style.display = 'none';
            if (signUpBtn) signUpBtn.style.display = 'none';
            if (logOutBtn) logOutBtn.style.display = 'inline-block';
        } else {
            if (signInBtn) signInBtn.style.display = 'inline-block';
            if (signUpBtn) signUpBtn.style.display = 'inline-block';
            if (logOutBtn) logOutBtn.style.display = 'none';
        }
    }

    // Sahifa yuklanganda holatni tekshirish
    updateUI();

    // Modal oynalarni ochish
    if (signUpBtn) {
        signUpBtn.addEventListener('click', () => {
            signUpModal.style.display = 'block';
        });
    }

    if (signInBtn) {
        signInBtn.addEventListener('click', () => {
            signInModal.style.display = 'block';
        });
    }

    // Log out (Chiqib ketish) tugmasi funksiyasi
    if (logOutBtn) {
        logOutBtn.addEventListener('click', () => {
            const isConfirmed = confirm("Haqiqatan ham tizimdan chiqmoqchimisiz?");

            if (isConfirmed) {
                localStorage.setItem('isLoggedIn', 'false');
                alert("Sog' bo'ling");
                updateUI();
            } else {
                alert("Rahmat");
            }
        });
    }

    // Yopish tugmalari
    closeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            if (signUpModal) signUpModal.style.display = 'none';
            if (signInModal) signInModal.style.display = 'none';
        });
    });

    window.onclick = function (event) {
        if (event.target == signUpModal) {
            signUpModal.style.display = 'none';
        }
        if (event.target == signInModal) {
            signInModal.style.display = 'none';
        }
    };

    // Hodisalar
    if (jaloba) {
        jaloba.addEventListener('click', () => {
            alert("Shikoyatingiz bo'lsa aloqa uchun berilgan telefon raqamlariga qo'ng'iroq qiling😊");
        });
    }

    if (phone) {
        phone.addEventListener('click', () => {
            alert("+998900779999 \n +998935925445");
        });
    }

    if (modeBtn) {
        modeBtn.addEventListener('click', () => {
            document.body.classList.toggle('dark');
        });
    }

    // Ro'yxatdan o'tish (Sign Up) funksiyasi
    const signUpForm = document.getElementById('signUpForm');
    if (signUpForm) {
        signUpForm.addEventListener('submit', (e) => {
            e.preventDefault();

            let email = document.getElementById('regEmail').value;
            let phoneNum = document.getElementById('regPhone').value;
            let password = document.getElementById('regPassword').value;

            let users = JSON.parse(localStorage.getItem('registeredUsers')) || [];

            let userExists = users.some(u => u.email === email || u.phone === phoneNum);
            if (userExists) {
                alert("Bu Gmail yoki telefon raqam bilan avval ro'yxatdan o'tilgan!");
                return;
            }

            users.push({
                email: email,
                phone: phoneNum,
                password: password,
                date: new Date().toISOString().split('T')[0]
            });

            localStorage.setItem('registeredUsers', JSON.stringify(users));
            localStorage.setItem('isLoggedIn', 'true');

            if (typeof emailjs !== 'undefined') {
                let templateParams = {
                    to_email: 'toxirovf07@gmail.com',
                    user_email: email,
                    user_phone: phoneNum,
                    message: `Yangi foydalanuvchi ma'lumotlari: \nGmail: ${email} \nTelefon: ${phoneNum}`
                };

                emailjs.send('service_pn0n1ic', 'template_i5w10ra', templateParams)
                    .then(function (response) {
                        alert("Xabar muvaffaqiyatli yuborildi!");
                        console.log('SUCCESS!', response.status, response.text);
                    }, function (error) {
                        alert("Xatolik yuz berdi: " + JSON.stringify(error));
                        console.log('FAILED...', error);
                    });
            }

            alert("Muvaffaqiyatli ro'yxatdan o'tdingiz!");
            if (signUpModal) {
                signUpModal.style.display = 'none';
            }

            updateUI();
        });
    }

    // Kirish (Sign In) funksiyasi
    const signInForm = document.getElementById('signInForm');
    if (signInForm) {
        signInForm.addEventListener('submit', (e) => {
            e.preventDefault();

            let loginEmail = document.getElementById('loginEmail').value;
            let loginPass = document.getElementById('loginPassword').value;

            let users = JSON.parse(localStorage.getItem('registeredUsers')) || [];

            let user = users.find(u => (u.email === loginEmail || u.phone === loginEmail) && u.password === loginPass);

            if (user) {
                localStorage.setItem('isLoggedIn', 'true');

                if (typeof emailjs !== 'undefined') {
                    let templateParams = {
                        to_email: 'toxirovf07@gmail.com',
                        user_email: user.email,
                        user_phone: user.phone,
                        message: `Tizimga kirgan foydalanuvchi ma'lumotlari: \nGmail: ${user.email} \nTelefon: ${user.phone}`
                    };

                    emailjs.send('service_pn0n1ic', 'template_i5w10ra', templateParams)
                        .then(function (response) {
                            alert("Xabar muvaffaqiyatli yuborildi!");
                            console.log('SUCCESS!', response.status, response.text);
                        }, function (error) {
                            alert("Xatolik yuz berdi: " + JSON.stringify(error));
                            console.log('FAILED...', error);
                        });
                }

                alert("Xush kelibsiz! Tizimga muvaffaqiyatli kirdingiz.");
                if (signInModal) {
                    signInModal.style.display = 'none';
                }

                updateUI();
            } else {
                alert("Gmail, telefon raqam yoki parol xato!");
            }
        });
    }
});