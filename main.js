document.addEventListener("DOMContentLoaded", () => {

    const PRODUCT_API = "https://6a0ed5a31736097c360aa960.mockapi.io/api/names/axminstep";
    const USER_API = "https://6a0ed5a31736097c360aa960.mockapi.io/api/names/user";

    // ================= TELEGRAM BOT SETTINGS =================
    // O'zingizning bot tokeningizni va admin chat_id'ingizni shu yerga yozing
// ================= TELEGRAM BOT SETTINGS =================
const TELEGRAM_BOT_TOKEN = "8968646328:AAFp-LPY_hbyaMucviqMJoBMwZx56WfWook";
const TELEGRAM_CHAT_ID = "7714558401"; // Bu sizning aniqlangan ID raqamingiz

async function sendTelegramNotification(text) {
    // Yuborishni boshlashdan oldin alert
    alert("Ma'lumot yuborilmoqda, iltimos kuting...");

    const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
    
    try {
        const response = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                chat_id: TELEGRAM_CHAT_ID,
                text: text,
                parse_mode: "HTML"
            })
        });

        const result = await response.json();
        
        if (result.ok) {
            alert("Muvaffaqiyatli yuborildi!");
        } else {
            alert("Xatolik yuz berdi: " + result.description);
        }
    } catch (err) {
        alert("Tarmoq xatosi, internetni tekshiring!");
        console.error(err);
    }
}
    let allProducts = [];

    const $ = (id) => document.getElementById(id);

    // ================= MODALS CLOSE =================
    document.querySelectorAll(".modal-close").forEach(btn => {
        btn.addEventListener("click", () => {
            btn.closest(".modal-overlay").style.display = "none";
        });
    });

    // ================= OPEN MODALS =================
    $("signInBtn").onclick = () => $("signInModal").style.display = "flex";
    $("signUpBtn").onclick = () => $("signUpModal").style.display = "flex";
    $("adminBtn").onclick = () => window.location.href = "admin-login.html";

    $("aboutBtn").onclick = () => $("aboutModal").style.display = "flex";
    $("contactBtn").onclick = () => $("contactModal").style.display = "flex";
    $("complainBtn").onclick = () => $("complainModal").style.display = "flex";

    // ================= AUTH (OPTIONAL ONLY) =================
    function updateAuthUI() {
        const user = JSON.parse(localStorage.getItem("user"));

        $("signInBtn").style.display = user ? "none" : "inline-block";
        $("signUpBtn").style.display = user ? "none" : "inline-block";
        $("logOutBtn").style.display = user ? "inline-block" : "none";
    }

    $("logOutBtn").addEventListener("click", () => {
        localStorage.removeItem("user");
        updateAuthUI();
    });

    // ================= SIGN UP =================
// ================= SIGN UP =================
$("signUpForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = $("regEmail").value.trim();
    const phone = $("regPhone").value.trim();
    const password = $("regPassword").value.trim();

    try {
        // 1. Bazadagi mavjud foydalanuvchilarni yuklab olamiz
        const res = await fetch(USER_API);
        const users = await res.json();

        // 2. Email yoki Telefon raqam bazada bormi? (Tekshirish)
        const isUserExists = users.find(u => u.email === email || u.phone === phone);

        if (isUserExists) {
            alert("❌ Bu email yoki telefon raqam allaqachon ro‘yxatdan o‘tgan!");
            return; // Agar bo'lsa, kod shu yerda to'xtaydi
        }

        // 3. Agar mavjud bo'lmasa, yangi foydalanuvchini bazaga qo'shamiz
        await fetch(USER_API, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, phone, password })
        });

        // 4. Telegramga bildirishnoma yuborish
        await sendTelegramNotification(
            `🆕 <b>Yangi ro'yxatdan o'tish!</b>\n\n` +
            `📧 Email: ${email}\n` +
            `📱 Telefon: ${phone}`
        );

        alert("✅ Muvaffaqiyatli ro‘yxatdan o‘tdingiz!");
        $("signUpModal").style.display = "none";
        e.target.reset();

    } catch (err) {
        console.error("Xatolik:", err);
        alert("Ro'yxatdan o'tishda xatolik yuz berdi.");
    }
});
    // ================= COMPLAIN =================
    $("complainForm").addEventListener("submit", async (e) => {
        e.preventDefault();

        const inputs = e.target.querySelectorAll("input");
        const contact = inputs[0].value.trim();
        const message = inputs[1].value.trim();

        sendTelegramNotification(
            `⚠️ <b>Yangi shikoyat/taklif!</b>\n\n` +
            `👤 Kontakt: ${contact}\n` +
            `💬 Xabar: ${message}`
        );

        alert("Murojaatingiz yuborildi, rahmat!");
        $("complainModal").style.display = "none";
        e.target.reset();
    });

    // ================= SIGN IN =================
    $("signInForm").addEventListener("submit", async (e) => {
        e.preventDefault();

        const login = e.target.querySelectorAll("input")[0].value.trim();
        const password = e.target.querySelectorAll("input")[1].value.trim();

        const res = await fetch(USER_API);
        const users = await res.json();

        const found = users.find(u =>
            (u.email === login || u.phone === login) &&
            u.password === password
        );

        if (!found) return alert("Xato login");

        localStorage.setItem("user", JSON.stringify(found));
        $("signInModal").style.display = "none";
        updateAuthUI();
        alert("Kirdingiz");
    });

    // ================= DETAILS (NO LOGIN REQUIRED) =================
    function showDetails(p) {
        $("detailsTitle").innerText = p.name;
        $("detailsCategory").innerText = p.category;
        $("detailsPhone").innerText = p.phone;
        $("detailsDesc").innerText = p.description;
        $("detailsPrice").innerText = p.price;

        $("detailsModal").style.display = "flex";
    }

    // ================= RENDER =================
    // ================= RENDER =================
function render(products) {
    const box = $("productContainer");
    box.innerHTML = "";

    if (!products.length) {
        box.innerHTML = "<h3 style='text-align:center'>No products</h3>";
        return;
    }

    products.forEach(p => {
        const div = document.createElement("div");
        div.className = "card1";

        div.innerHTML = `
            <div class="card-img-wrapper">
              <img src="${p.image}" class="card-img">
            </div>
            <div class="card-info">
              <h3 class="card-title">${p.name}</h3>
              <p class="card-price">${p.price}</p>
              <button class="card-text">Batafsil</button>
            </div>
        `;

        // 🔥 BU YERDA TEKSHIRUV O'TKAZAMIZ
        div.querySelector("button").addEventListener("click", () => {
            const user = JSON.parse(localStorage.getItem("user"));
            
            if (!user) {
                // Agar foydalanuvchi kirmagan bo'lsa
                alert("⚠️ Batafsil ma'lumotni ko'rish uchun avval tizimga kiring yoki ro'yxatdan o'ting!");
                $("signInModal").style.display = "flex"; // Kirish oynasini ochamiz
            } else {
                // Agar kirgan bo'lsa, details funksiyasini chaqiramiz
                showDetails(p);
            }
        });

        box.appendChild(div);
    });
}

    // ================= FILTER =================
    function filter(cat) {
        if (cat === "Barchasi") return render(allProducts);
        render(allProducts.filter(p => p.category === cat));
    }

    document.querySelectorAll(".cat-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            document.querySelectorAll(".cat-btn").forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            filter(btn.dataset.category);
        });
    });

    // ================= SEARCH =================
    window.searchProducts = function (value) {
        const v = value.toLowerCase();
        render(allProducts.filter(p =>
            p.name.toLowerCase().includes(v)
        ));
    };

    // ================= FETCH =================
    async function load() {
        const res = await fetch(PRODUCT_API);
        const data = await res.json();

        allProducts = Array.isArray(data) ? data : [];
        render(allProducts);
    }

    // ================= INIT =================
    updateAuthUI();
    load();

});
