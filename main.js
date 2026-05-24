// DOM Elementlarini olish
const productContainer = document.getElementById('productContainer');
const categorySlider = document.getElementById('categorySlider');
const darkBtn = document.getElementById('darkBtn');

// Modallar elementlari
const detailsModal = document.getElementById('detailsModal');
const closeDetailsBtn = document.getElementById('closeDetailsBtn');
const signInModal = document.getElementById('signInModal');
const signUpModal = document.getElementById('signUpModal');

// Modal ichidagi ma'lumotlar elementlari
const detailsTitle = document.getElementById('detailsTitle');
const detailsCategory = document.getElementById('detailsCategory');
const detailsDesc = document.getElementById('detailsDesc');
const detailsPrice = document.getElementById('detailsPrice');

// Lightbox elementlari
const imageLightbox = document.getElementById('imageLightbox');
const lightboxImg = document.getElementById('lightboxImg');
const lightboxClose = document.querySelector('.lightbox-close');

let currentCategory = "Barchasi";

// ✅ TO'G'RILANGAN MOCK API HAVOLASI (Ortiqcha /api/v1/ olib tashlandi)
const API_URL = "https://6a0ed5a31736097c360aa960.mockapi.io/api/axminstep";

// 1. RASMNI KATTALASHTIRIB KO'RSATISH (LIGHTBOX) - Global funksiya
window.openLightbox = function(src) {
    if (lightboxImg && imageLightbox) {
        lightboxImg.src = src;
        imageLightbox.style.display = 'flex';
    }
};

// 2. MAHSULOTLARNI MOCK API'DAN YUKLASH VA KO'RSATISH FUNKSIYASI
async function loadProducts() {
    const productTableBody = document.getElementById('productTableBody');
    if (!productTableBody) return; // Agar jadval topilmasa, funksiya to'xtaydi

    try {
        const response = await fetch(API_URL);
        
        // Agar server javob bermasa yoki 404 bo'lsa
        if (!response.ok) {
            throw new Error('Serverda ma\'lumot topilmadi (404)');
        }

        const products = await response.json();

        // Xatolik oldini olish: kelgan narsa array ekanligini tekshiramiz
        if (Array.isArray(products)) {
            productTableBody.innerHTML = ''; // Jadvalni tozalash
            products.forEach((product, index) => {
                // Bu yerga o'zingizning eski dizayningizni qaytarib yozishingiz mumkin
                const row = `<tr><td>${product.id}</td><td>${product.name}</td><td>${product.price}</td></tr>`;
                productTableBody.insertAdjacentHTML('beforeend', row);
            });
        } else {
            console.error("Kutilgan ma'lumotlar massiv emas:", products);
        }

    } catch (error) {
        console.error("Yuklashda xatolik:", error);
        productTableBody.innerHTML = `<tr><td colspan="5">Ma'lumot yuklashda xatolik yuz berdi. API manzilini tekshiring!</td></tr>`;
    }
}
// 3. TAVSIF MODAL OYNASINI OCHISH
function openDetailsModal(product) {
    if (detailsTitle) detailsTitle.innerText = product.name;
    if (detailsCategory) detailsCategory.innerText = product.category;
    if (detailsDesc) detailsDesc.innerText = product.description || "Tavsif berilmagan.";
    if (detailsPrice) detailsPrice.innerText = product.price;
    
    // Eski telefon tugmasini xavfsiz tozalash
    const oldCallBtn = detailsModal ? detailsModal.querySelector('.modal-call-btn') : null;
    if (oldCallBtn) oldCallBtn.remove();

    const cleanPhone = product.phone ? product.phone.replace(/[^0-9+]/g, '') : '';
    const displayPhone = product.phone || "Kiritilmagan";

    if (product.phone && detailsDesc) {
        const callBtn = document.createElement('a');
        callBtn.className = 'modal-call-btn';
        callBtn.href = `tel:${cleanPhone}`;
        callBtn.innerText = `📞 Ega bilan bog'lanish (${displayPhone})`;
        
        // Stillarni tartibli berish
        Object.assign(callBtn.style, {
            display: 'block',
            textAlign: 'center',
            background: '#10b981',
            color: '#000',
            padding: '12px',
            borderRadius: '6px',
            fontWeight: 'bold',
            textDecoration: 'none',
            marginTop: '20px',
            transition: '0.3s'
        });

        detailsDesc.after(callBtn);
    }
    
    if (detailsModal) detailsModal.style.display = 'flex';
}

// 4. BARCHA EVENT LISTENERS (DOM to'liq yuklangach ishlaydi)
document.addEventListener('DOMContentLoaded', () => {
    
    // Mahsulotlarni ilk bor yuklash
    loadProducts();

    // Modallarni yopish logikasi
    if (closeDetailsBtn) {
        closeDetailsBtn.onclick = () => {
            if (detailsModal) detailsModal.style.display = 'none';
        };
    }

    // Kategoriya tugmalari
    if (categorySlider) {
        categorySlider.addEventListener('click', (e) => {
            if (e.target.classList.contains('cat-btn')) {
                document.querySelectorAll('.cat-btn').forEach(btn => btn.classList.remove('active'));
                e.target.classList.add('active');
                currentCategory = e.target.getAttribute('data-category');
                loadProducts();
            }
        });
    }

    // Lightbox yopish
    if (lightboxClose) {
        lightboxClose.onclick = () => {
            if (imageLightbox) imageLightbox.style.display = 'none';
        };
    }
    if (imageLightbox) {
        imageLightbox.onclick = (e) => { 
            if (e.target === imageLightbox) imageLightbox.style.display = 'none'; 
        };
    }

    // Dark / Light Mode logikasi
    if (darkBtn) {
        if (localStorage.getItem('theme') === 'dark') {
            document.body.classList.add('dark');
        }
        darkBtn.onclick = () => {
            document.body.classList.toggle('dark');
            localStorage.setItem('theme', document.body.classList.contains('dark') ? 'dark' : 'light');
        };
    }

    // Kirish va Ro'yxatdan o'tish modallari
    const signInBtn = document.getElementById('signInBtn');
    if (signInBtn && signInModal) {
        signInBtn.onclick = () => signInModal.style.display = 'flex';
    }

    const signUpBtn = document.getElementById('signUpBtn');
    if (signUpBtn && signUpModal) {
        signUpBtn.onclick = () => signUpModal.style.display = 'flex';
    }

    // Umumiy modal yopish tugmalari (X)
    document.querySelectorAll('.modal-close.close').forEach(closeBtn => {
        closeBtn.onclick = function() {
            const overlay = this.closest('.modal-overlay');
            if (overlay) overlay.style.display = 'none';
        }
    });

    // Modal tashqarisiga bosganda yopish
    window.onclick = (e) => {
        if (e.target.classList.contains('modal-overlay')) {
            e.target.style.display = 'none';
        }
    };
});