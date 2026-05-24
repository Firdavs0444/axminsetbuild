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

// 1. MAHSULOTLARNI YUKLASH VA KO'RSATISH FUNKSIYASI
function loadProducts() {
    // Admin panel bilan bir xil default mahsulotlar strukturasi (Telefon raqamli variant)
    const defaultProducts = [
        { id: '#101', name: "Premium Kovka Darvoza", category: "Qurilish", price: "Kelishuv asosida", phone: "+998 90 123 45 67", description: "Yuqori sifatli qalin metalldan tayyorlangan chidamli darvoza va uning mustahkam konstruksiyasi.", image: "https://picsum.photos/id/10/400/300", status: 'Sotuvda' },
        { id: '#102', name: "iPhone 16 Pro Max", category: "Texnika & Gadjetlar", price: "1200$", phone: "+998 93 777 77 77", description: "Yangi avlod flagman smartfoni, 256GB xotira va drayv imkoniyatlari bilan.", image: "https://picsum.photos/id/15/400/300", status: 'Sotuvda' }
    ];

    const products = JSON.parse(localStorage.getItem('adminProducts')) || defaultProducts;
    productContainer.innerHTML = '';

    // Filtr qilish (Kategoriya bo'yicha)
    const filteredProducts = products.filter(product => {
        if (currentCategory === "Barchasi") return true;
        
        // HTML data-category qiymatlarini admin paneldagi haqiqiy nomlarga tekshirish
        if (currentCategory === "Qurilish" && product.category === "Qurilish") return true;
        if (currentCategory === "Texnika" && product.category === "Texnika & Gadjetlar") return true;
        if (currentCategory === "Avto" && product.category === "Avto / Detaling") return true;
        if (currentCategory === "IT" && product.category === "IT va Dasturlash") return true;
        if (currentCategory === "Biznes" && product.category === "Biznes & Tender") return true;
        if (currentCategory === "Talim" && product.category === "Ta'lim & Kurslar") return true;
        
        return false;
    });

    if (filteredProducts.length === 0) {
        productContainer.innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: var(--text-muted); padding: 40px 0;">Bu kategoriyada hozircha mahsulot yo'q.</p>`;
        return;
    }

    filteredProducts.forEach((product, idx) => {
        // Faqat sotuvda bor mahsulotlarni chiqarish (Admin o'chirib qo'ymagan bo'lsa)
        if (product.status === 'Tugagan') return;

        const card = document.createElement('div');
        card.className = 'card1';
        card.innerHTML = `
            <div class="card-img-wrapper">
                <img src="${product.image}" class="card-img" alt="${product.name}" onclick="openLightbox('${product.image}')">
            </div>
            <div class="card-info">
                <h3 class="card-title">${product.name}</h3>
                <p class="card-price">${product.price}</p>
                <a class="more-link">
                    <button class="card-text">Ko'proq...</button>
                </a>
            </div>
        `;

        // "Ko'proq..." tugmasi bosilganda modal tavsif oynasini ochish
        card.querySelector('.more-link').addEventListener('click', (e) => {
            e.preventDefault();
            openDetailsModal(product);
        });

        productContainer.appendChild(card);
    });
}

// 2. TAVSIF MODAL OYNASINI OCHISH (TELEFON TUGMASI BILAN)
function openDetailsModal(product) {
    detailsTitle.innerText = product.name;
    detailsCategory.innerText = product.category;
    detailsDesc.innerText = product.description || "Tavsif berilmagan.";
    detailsPrice.innerText = product.price;
    
    // Mavjud eski telefon tugmasi bo'lsa uni o'chiramiz (takrorlanib ketmasligi uchun)
    const oldCallBtn = detailsModal.querySelector('.modal-call-btn');
    if (oldCallBtn) oldCallBtn.remove();

    // Telefon raqamidan faqat raqamlarni ajratib olish (tel: ishlashi uchun)
    const cleanPhone = product.phone ? product.phone.replace(/[^0-9+]/g, '') : '';
    const displayPhone = product.phone || "Kiritilmagan";

    // Yangi "Bog'lanish" tugmasini yaratish
    if (product.phone) {
        const callBtn = document.createElement('a');
        callBtn.className = 'modal-call-btn';
        callBtn.href = `tel:${cleanPhone}`;
        callBtn.innerText = `📞 Ega bilan bog'lanish (${displayPhone})`;
        
        // CSS stillarini tugmaga berish (Dizaynga moslab)
        callBtn.style.display = 'block';
        callBtn.style.textAlign = 'center';
        callBtn.style.background = '#10b981';
        callBtn.style.color = '#000';
        callBtn.style.padding = '12px';
        callBtn.style.borderRadius = '6px';
        callBtn.style.fontWeight = 'bold';
        callBtn.style.textDecoration = 'none';
        callBtn.style.marginTop = '20px';
        callBtn.style.transition = '0.3s';

        // Tugmani modal ichidagi ma'lumotlar qismiga (pastiga) qo'shish
        // Eslatma: detailsDesc'dan keyin yoki modal-content ichiga joylashtiriladi
        detailsDesc.after(callBtn);
    }
    
    detailsModal.style.display = 'flex';
}

// Modallarni yopish logikasi
if(closeDetailsBtn) {
    closeDetailsBtn.onclick = () => detailsModal.style.display = 'none';
}

// 3. KATEGORIYA TUGMALARINI BOSILISHINI BOSHQARISH
if (categorySlider) {
    categorySlider.addEventListener('click', (e) => {
        if (e.target.classList.contains('cat-btn')) {
            document.querySelectorAll('.cat-btn').forEach(btn => btn.classList.remove('active'));
            element = e.target;
            element.classList.add('active');
            
            currentCategory = element.getAttribute('data-category');
            loadProducts();
        }
    });
}

// 4. RASMNI KATTALASHTIRIB KO'RSATISH (LIGHTBOX)
function openLightbox(src) {
    lightboxImg.src = src;
    imageLightbox.style.display = 'flex';
}

if(lightboxClose) {
    lightboxClose.onclick = () => imageLightbox.style.display = 'none';
}
if(imageLightbox) {
    imageLightbox.onclick = (e) => { if(e.target === imageLightbox) imageLightbox.style.display = 'none'; };
}

// 5. FON REJIMINI O'ZGARTIRISH (DARK / LIGHT MODE)
if (darkBtn) {
    if (localStorage.getItem('theme') === 'dark') {
        document.body.classList.add('dark');
    }
    darkBtn.onclick = () => {
        document.body.classList.toggle('dark');
        localStorage.setItem('theme', document.body.classList.contains('dark') ? 'dark' : 'light');
    };
}

// 6. AVTO-KIRISH TUGMALARI MODALLARI (Xavfsiz tekshiruvlar bilan)
const signInBtn = document.getElementById('signInBtn');
if (signInBtn) {
    signInBtn.onclick = () => signInModal.style.display = 'flex';
}

const signUpBtn = document.getElementById('signUpBtn');
if (signUpBtn) {
    signUpBtn.onclick = () => signUpModal.style.display = 'flex';
}

document.querySelectorAll('.modal-close.close').forEach(closeBtn => {
    closeBtn.onclick = function() {
        this.closest('.modal-overlay').style.display = 'none';
    }
});

window.onclick = (e) => {
    if (e.target.classList.contains('modal-overlay')) {
        e.target.style.display = 'none';
    }
};

// Sahifa yuklanganda ishga tushirish
document.addEventListener('DOMContentLoaded', () => {
    loadProducts();
});