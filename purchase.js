
    // زر الوضع الليلي
    const btn = document.getElementById("modeBtn");
    btn.onclick = () => {
        document.body.classList.toggle("light");
        btn.innerHTML = document.body.classList.contains("light")
            ? '<i class="fa-solid fa-sun"></i>'
            : '<i class="fa-solid fa-moon"></i>';
    };

    // المودال
    const modalBackdrop = document.getElementById('modalBackdrop');
    const selectedPackInfo = document.getElementById('selectedPackInfo');
    const uidInput = document.getElementById('uidInput');
    const playerName = document.getElementById('playerName');
    const paymentMethod = document.getElementById('paymentMethod');
    const confirmBtn = document.getElementById('confirmPurchaseBtn');

    // حفظ بيانات الباقة المحددة أثناء الفتح
    let currentPack = null;

    function openPurchaseModal(cardEl) {
        // استخرج بيانات من البطاقة
        const packId = cardEl.getAttribute('data-pack-id') || '';
        const gems = cardEl.getAttribute('data-gems') || '';
        const price = cardEl.getAttribute('data-price') || '';

        currentPack = { packId, gems, price };
        selectedPackInfo.innerHTML = `الباقة: <strong>${gems} جوهرة</strong> — السعر: <strong>${price} ج.س</strong>`;
        uidInput.value = '';
        playerName.value = '';
        paymentMethod.value = '';
        modalBackdrop.style.display = 'flex';
        modalBackdrop.setAttribute('aria-hidden', 'false');

        // فوكس على الحقل
        setTimeout(()=> uidInput.focus(), 200);
    }

    function closeModal() {
        modalBackdrop.style.display = 'none';
        modalBackdrop.setAttribute('aria-hidden', 'true');
    }

    // تحقق بسيط وتنبيه محلي (بدون باكند)
    confirmBtn.addEventListener('click', () => {
        const uid = uidInput.value.trim();
        const pname = playerName.value.trim();
        const pay = paymentMethod.value;

        // تحقق: UID لازم يكون أرقام (على الأقل 5 خانات)
        if (!uid || !/^\d{5,}$/.test(uid)) {
            alert('الرجاء إدخال UID صحيح (أرقام فقط، على الأقل 5 خانات).');
            uidInput.focus();
            return;
        }
        if (!pay) {
            alert('الرجاء اختيار طريقة الدفع.');
            paymentMethod.focus();
            return;
        }
        // هنا عادة ترسل الطلب للباكند / بوابة الدفع
        // لمجرد العرض سنخزن الطلب في localStorage ونظهر رسالة نجاح
        const orders = JSON.parse(localStorage.getItem('ff_orders') || '[]');
        const order = {
            id: 'ORD' + Date.now(),
            pack: currentPack,
            uid, pname, pay,
            status: 'قيد الانتظار',
            createdAt: new Date().toISOString()
        };
        orders.push(order);
        localStorage.setItem('ff_orders', JSON.stringify(orders));

        // عرض رسالة نجاح
        alert(`تم تسجيل طلبك بنجاح!\nرقم الطلب: ${order.id}\nالـ UID: ${uid}\nالباقة: ${currentPack.gems} جوهرة\nالسعر: ${currentPack.price} ج.س\n\nسوف نتواصل معك لتأكيد الدفع والتسليم.`);
        closeModal();
    });

    // اغلاق المودال بالنقر خارج الصندوق
    modalBackdrop.addEventListener('click', function(e){
        if (e.target === modalBackdrop) closeModal();
    });

    // اختصار: فتح باقة 100+10 عند التحميل لو رغبت
    // window.addEventListener('load', ()=> {
    //     // find first card with pack id ff-110-3650 and highlight
    // });

    // يمكنك لاحقاً تعديل الكود لإرسال الطلبات للسيرفر أو ربط Stripe/PayPal/Fawry أو مزود محلي.