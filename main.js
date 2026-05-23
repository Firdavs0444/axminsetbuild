document.addEventListener('DOMContentLoaded', () => {
    (function () {
        if (typeof emailjs !== 'undefined') {
            emailjs.init("1kSvPg7v02JrWtqYg");
        }
    })();

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

    // 1. Kodni generatsiya qilish
    function sendSmsCode() {
        let otpCode = Math.floor(100000 + Math.random() * 900000);
        localStorage.setItem('generatedCode', otpCode);
        alert(`SMS: Sizning tasdiqlash kodingiz: ${otpCode}`);
    }

    // 2. Kiritilgan kodni tekshirish
    function verifySmsCode() {
        let enteredCode = document.getElementById('smsCodeInput').value;
        let savedCode = localStorage.getItem('generatedCode');

        if (enteredCode === savedCode) {
            alert("Kod to'g'ri! Tizimga xush kelibsiz.");
            localStorage.setItem('isLoggedIn', 'true');
            updateUI();
        } else {
            alert("Xato kod kiritildi. Iltimos, qayta urinib ko'ring.");
        }
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