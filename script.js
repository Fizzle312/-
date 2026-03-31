const ADMIN_PASSWORD = "1";

function resetBuilderSelections() {
    selectedBuilder = { gpu: null, cpu: null, ram: null, storage: null, pcCase: null };
    updateBuilderUI();
    const fb = document.getElementById('builderFeedback');
    if (fb) { fb.textContent = ''; fb.className = 'feedback'; }
}

function initTheme() {
    const savedTheme = localStorage.getItem('turboPcTheme');
    if (savedTheme === 'light') document.body.classList.add('theme-light');
}

function toggleTheme() {
    if (document.body.classList.contains('theme-light')) {
        document.body.classList.remove('theme-light');
        localStorage.setItem('turboPcTheme', 'dark');
        showToast('🌙 Темная тема');
    } else {
        document.body.classList.add('theme-light');
        localStorage.setItem('turboPcTheme', 'light');
        showToast('☀️ Светлая тема');
    }
}

let products = {
    main: [
        { id: 'kiz9k', name: 'Серия "KIZ9K"', price: 52230, specs: 'RTX 2060, i5-12400F, 16GB', description: 'Базовая конфигурация KIZ9K' },
        { id: 'thunder', name: 'Серия "THUNDER"', price: 102354, specs: 'RTX 3060, i5-12400F, 16GB', description: 'Мощная серия THUNDER' },
        { id: 'custom', name: 'Собери свой ПК', price: null, specs: 'Индивидуальная сборка', description: 'Соберите компьютер под свои задачи' }
    ],
    gaming: [
        { id: 'kiz9k_1', name: 'KIZ9K number 1', price: 52230, specs: 'RTX 2060, Intel Core i5-12400F, 16GB DDR4, 512GB SSD', description: 'Начальный уровень', image: '' },
        { id: 'kiz9k_2', name: 'KIZ9K number 2', price: 65800, specs: 'RTX 3060, Intel Core i5-12400F, 16GB DDR4, 1TB SSD', description: 'Средний уровень', image: '' },
        { id: 'kiz9k_pro', name: 'KIZ9K PRO', price: 89990, specs: 'RTX 5060, AMD Ryzen 7 7700, 32GB DDR5, 1TB NVMe', description: 'Профессиональный уровень', image: '' },
        { id: 'thunder_1', name: 'THUNDER', price: 102354, specs: 'RTX 3060, Intel Core i5-12400F, 16GB DDR4, 1TB SSD', description: 'Мощная сборка', image: '' },
        { id: 'thunder_x', name: 'THUNDER X', price: 119990, specs: 'RTX 4060, Intel Core i7-14700F, 32GB DDR5, 1TB NVMe', description: 'Экстремальная мощность', image: '' },
        { id: 'thunder_ultra', name: 'THUNDER ULTRA', price: 149500, specs: 'RTX 5070, AMD Ryzen 7 7800X3D, 64GB DDR5, 2TB NVMe', description: 'Флагманская модель', image: '' }
    ],
    catalog: [
        { id: 'cpu_i9', name: 'Intel Core i9-14900K', price: 48990, category: 'Комплектующие', description: 'Флагманский процессор', image: '' },
        { id: 'mat_3d', name: 'Премиум коврик 3D', price: 3990, category: 'Аксессуары', description: 'Игровой коврик', image: '' },
        { id: 'rgb_kit', name: 'RIZUKYUN RGB Kit', price: 12500, category: 'Кастомизация', description: 'Набор RGB подсветки', image: '' }
    ]
};

let cart = [];
let selectedBuilder = { gpu: null, cpu: null, ram: null, storage: null, pcCase: null };

const gpuList = ['RTX 2060', 'RTX 3060', 'RTX 4060', 'RTX 4060 TI', 'RTX 5060 TI', 'RTX 5070', 'RTX 5080'];
const cpuList = ['Intel-core i5 12400F', 'AMD Ryzen 5 5600', 'AMD Ryzen 7 5700x', 'AMD Ryzen 7 7700', 'Intel-core i5-14400F', 'Intel-core i7-14700F', 'AMD Ryzen 7 7800X3D'];
const ramList = ['16 GB', '32 GB', '48 GB', '64 GB'];
const storageList = ['256 GB', '512 GB', '1 TB', '2 TB'];
const caseList = ['MIDI-Tower Black', 'MIDI-Tower White', 'Full Tower RGB', 'Compact mATX', 'Glass Panoramic'];

function getComponentPrice(type, value) {
    const prices = {
        gpu: { 'RTX 2060': 15900, 'RTX 3060': 23900, 'RTX 4060': 32900, 'RTX 4060 TI': 41900, 'RTX 5060 TI': 52900, 'RTX 5070': 68900, 'RTX 5080': 98900 },
        cpu: { 'Intel-core i5 12400F': 11900, 'AMD Ryzen 5 5600': 10900, 'AMD Ryzen 7 5700x': 16900, 'AMD Ryzen 7 7700': 23900, 'Intel-core i5-14400F': 15900, 'Intel-core i7-14700F': 32900, 'AMD Ryzen 7 7800X3D': 42900 },
        ram: { '16 GB': 4500, '32 GB': 7900, '48 GB': 11900, '64 GB': 14900 },
        storage: { '256 GB': 2900, '512 GB': 3900, '1 TB': 5900, '2 TB': 9900 },
        case: { 'MIDI-Tower Black': 4200, 'MIDI-Tower White': 4500, 'Full Tower RGB': 8900, 'Compact mATX': 3800, 'Glass Panoramic': 6700 }
    };
    return prices[type]?.[value] || 0;
}

function calcTotalBuildPrice() {
    let total = 0;
    if (selectedBuilder.gpu) total += getComponentPrice('gpu', selectedBuilder.gpu);
    if (selectedBuilder.cpu) total += getComponentPrice('cpu', selectedBuilder.cpu);
    if (selectedBuilder.ram) total += getComponentPrice('ram', selectedBuilder.ram);
    if (selectedBuilder.storage) total += getComponentPrice('storage', selectedBuilder.storage);
    if (selectedBuilder.pcCase) total += getComponentPrice('case', selectedBuilder.pcCase);
    return total;
}

function getBuildSpecString() {
    const parts = [];
    if (selectedBuilder.gpu) parts.push(`🎮 ${selectedBuilder.gpu}`);
    if (selectedBuilder.cpu) parts.push(`💻 ${selectedBuilder.cpu}`);
    if (selectedBuilder.ram) parts.push(`🧠 ${selectedBuilder.ram}`);
    if (selectedBuilder.storage) parts.push(`💾 ${selectedBuilder.storage}`);
    if (selectedBuilder.pcCase) parts.push(`🖥️ ${selectedBuilder.pcCase}`);
    return parts.length ? parts.join(' • ') : '❌ Ничего не выбрано';
}

function loadData() {
    const storedProducts = localStorage.getItem('turboPcProducts');
    if (storedProducts) products = JSON.parse(storedProducts);
    const storedCart = localStorage.getItem('turboPcCart');
    if (storedCart) cart = JSON.parse(storedCart);
}

function saveProducts() { localStorage.setItem('turboPcProducts', JSON.stringify(products)); }
function saveCart() { localStorage.setItem('turboPcCart', JSON.stringify(cart)); }

function addToCart(name, price, specs = '', image = '') {
    const existing = cart.find(i => i.name === name && i.specs === specs);
    if (existing) { existing.quantity++; } else { cart.push({ name, price, quantity: 1, specs, image }); }
    saveCart();
    showToast(`✨ "${name}" добавлен в корзину`);
    updateCartCounter();
}

function removeFromCart(index) {
    cart.splice(index, 1);
    saveCart();
    const cartModal = document.getElementById('cartModal');
    if (cartModal && cartModal.classList.contains('active')) renderCartModal();
    updateCartCounter();
}

function clearCart() {
    if (cart.length > 0 && confirm('Очистить всю корзину?')) {
        cart = [];
        saveCart();
        const cartModal = document.getElementById('cartModal');
        if (cartModal && cartModal.classList.contains('active')) renderCartModal();
        updateCartCounter();
    }
}

function updateCartCounter() {
    const countSpan = document.getElementById('cartCount');
    if (countSpan) countSpan.textContent = cart.reduce((sum, i) => sum + i.quantity, 0);
}

function showToast(message) {
    const toast = document.createElement('div');
    toast.style.cssText = `position:fixed;bottom:20px;right:20px;background:rgba(160,100,255,0.9);backdrop-filter:blur(10px);color:white;padding:12px 24px;border-radius:40px;z-index:2000;animation:slideIn 0.3s ease;font-weight:500;`;
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 2500);
}

function goToGamingPage(series) {
    showSection('gaming');
    setTimeout(() => {
        const targetId = series === 'KIZ9K' ? 'kiz9kSection' : 'thunderSection';
        const el = document.getElementById(targetId);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
}

function openBuilderModal() {
    const modal = document.getElementById('builderModal');
    if (modal) { modal.classList.add('active'); document.body.style.overflow = 'hidden'; updateBuilderUI(); }
}

function closeBuilderModal() {
    const modal = document.getElementById('builderModal');
    if (modal) { modal.classList.remove('active'); document.body.style.overflow = 'auto'; resetBuilderSelections(); }
}

function updateBuilderUI() {
    function renderOptions(containerId, list, type) {
        const container = document.getElementById(containerId);
        if (!container) return;
        container.innerHTML = '';
        list.forEach(val => {
            const btn = document.createElement('button');
            btn.className = `option-btn ${selectedBuilder[type] === val ? 'selected' : ''}`;
            btn.textContent = val;
            btn.onclick = () => { selectedBuilder[type] = val; updateBuilderUI(); };
            container.appendChild(btn);
        });
    }
    renderOptions('gpuOptionsBuilder', gpuList, 'gpu');
    renderOptions('cpuOptionsBuilder', cpuList, 'cpu');
    renderOptions('ramOptionsBuilder', ramList, 'ram');
    renderOptions('storageOptionsBuilder', storageList, 'storage');
    renderOptions('caseOptionsBuilder', caseList, 'pcCase');
    const specSpan = document.getElementById('buildSpecSummary');
    if (specSpan) specSpan.textContent = getBuildSpecString();
    const totalSpan = document.getElementById('totalBuildPrice');
    if (totalSpan) totalSpan.textContent = calcTotalBuildPrice().toLocaleString() + ' ₽';
}

function addCustomBuild() {
    if (!selectedBuilder.gpu || !selectedBuilder.cpu || !selectedBuilder.ram || !selectedBuilder.storage || !selectedBuilder.pcCase) {
        const fb = document.getElementById('builderFeedback');
        if (fb) { fb.textContent = '⚠️ Пожалуйста, выберите ВСЕ компоненты!'; fb.className = 'feedback error'; setTimeout(() => { if (fb) fb.textContent = ''; }, 3000); }
        return;
    }
    const total = calcTotalBuildPrice();
    const specDetail = `${selectedBuilder.gpu}, ${selectedBuilder.cpu}, ${selectedBuilder.ram}, ${selectedBuilder.storage}, корпус: ${selectedBuilder.pcCase}`;
    addToCart('✨ Кастомный ПК', total, specDetail, '');
    const fb = document.getElementById('builderFeedback');
    if (fb) { fb.textContent = `✨ ПК добавлен в корзину! Цена: ${total.toLocaleString()}₽`; fb.className = 'feedback success'; setTimeout(() => { if (fb) fb.textContent = ''; }, 3000); }
}

function openAdminSecret() {
    const passwordModal = document.createElement('div');
    passwordModal.className = 'modal active';
    passwordModal.style.display = 'flex';
    const modalContent = document.createElement('div');
    modalContent.className = 'modal-content password-modal';
    const modalHeader = document.createElement('div');
    modalHeader.className = 'modal-header';
    const title = document.createElement('h2');
    title.textContent = '🔐 Вход в админ-панель';
    const closeBtn = document.createElement('button');
    closeBtn.className = 'close-modal';
    closeBtn.textContent = '✕';
    closeBtn.onclick = () => passwordModal.remove();
    modalHeader.appendChild(title);
    modalHeader.appendChild(closeBtn);
    const contentDiv = document.createElement('div');
    contentDiv.style.padding = '20px 0';
    const infoText = document.createElement('p');
    infoText.textContent = 'Введите пароль для доступа к админ-панели';
    const passwordInput = document.createElement('input');
    passwordInput.type = 'password';
    passwordInput.id = 'adminPasswordInput';
    passwordInput.className = 'password-input';
    passwordInput.placeholder = 'Пароль';
    passwordInput.autocomplete = 'off';
    const buttonDiv = document.createElement('div');
    buttonDiv.style.cssText = 'display:flex;gap:12px;justify-content:center;margin-top:20px;';
    const loginBtn = document.createElement('button');
    loginBtn.className = 'btn-primary';
    loginBtn.textContent = 'Войти';
    const cancelBtn = document.createElement('button');
    cancelBtn.className = 'btn-secondary';
    cancelBtn.textContent = 'Отмена';
    cancelBtn.onclick = () => passwordModal.remove();
    buttonDiv.appendChild(loginBtn);
    buttonDiv.appendChild(cancelBtn);
    const errorDiv = document.createElement('div');
    errorDiv.id = 'passwordError';
    errorDiv.style.cssText = 'color:#fca5a5;margin-top:12px;font-size:0.9rem;';
    contentDiv.appendChild(infoText);
    contentDiv.appendChild(passwordInput);
    contentDiv.appendChild(buttonDiv);
    contentDiv.appendChild(errorDiv);
    modalContent.appendChild(modalHeader);
    modalContent.appendChild(contentDiv);
    passwordModal.appendChild(modalContent);
    document.body.appendChild(passwordModal);
    const checkPassword = () => {
        if (passwordInput.value === ADMIN_PASSWORD) {
            passwordModal.remove();
            window.location.hash = 'admin';
            renderAdminPanelInApp();
        } else {
            errorDiv.textContent = '❌ Неверный пароль! Попробуйте еще раз.';
            passwordInput.value = '';
            passwordInput.focus();
        }
    };
    loginBtn.onclick = checkPassword;
    passwordInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') checkPassword(); });
}

function renderAdminPanel() {
    const container = document.getElementById('app');
    container.innerHTML = '';
    const adminPanel = document.createElement('div');
    adminPanel.className = 'admin-panel';
    const adminHeader = document.createElement('div');
    adminHeader.className = 'admin-header';
    const headerContainer = document.createElement('div');
    headerContainer.className = 'container';
    const headerTop = document.createElement('div');
    headerTop.style.cssText = 'display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:16px;';
    const title = document.createElement('h1');
    title.style.cssText = 'background:linear-gradient(135deg,#e9d5ff,#c084fc);-webkit-background-clip:text;background-clip:text;color:transparent;';
    title.textContent = '🔧 Админ-панель Turbo-PC';
    const exitBtn = document.createElement('button');
    exitBtn.className = 'btn-secondary';
    exitBtn.textContent = '🏠 Вернуться в магазин';
    exitBtn.onclick = exitAdmin;
    const adminThemeBtn = document.createElement('div');
    adminThemeBtn.className = 'theme-toggle-btn';
    adminThemeBtn.innerHTML = '🌓 Тема';
    adminThemeBtn.onclick = toggleTheme;
    headerTop.appendChild(title);
    headerTop.appendChild(adminThemeBtn);
    headerTop.appendChild(exitBtn);
    const adminNav = document.createElement('div');
    adminNav.className = 'admin-nav';
    adminNav.style.marginTop = '20px';
    const mainLink = document.createElement('a');
    mainLink.textContent = 'Главная';
    mainLink.onclick = () => showAdminSection('main');
    mainLink.classList.add('active');
    mainLink.setAttribute('data-section', 'main');
    const gamingLink = document.createElement('a');
    gamingLink.textContent = 'Игровые ПК';
    gamingLink.onclick = () => showAdminSection('gaming');
    gamingLink.setAttribute('data-section', 'gaming');
    const catalogLink = document.createElement('a');
    catalogLink.textContent = 'Каталог';
    catalogLink.onclick = () => showAdminSection('catalog');
    catalogLink.setAttribute('data-section', 'catalog');
    adminNav.appendChild(mainLink);
    adminNav.appendChild(gamingLink);
    adminNav.appendChild(catalogLink);
    headerContainer.appendChild(headerTop);
    headerContainer.appendChild(adminNav);
    adminHeader.appendChild(headerContainer);
    const contentContainer = document.createElement('div');
    contentContainer.className = 'container';
    const adminContent = document.createElement('div');
    adminContent.id = 'adminContent';
    contentContainer.appendChild(adminContent);
    adminPanel.appendChild(adminHeader);
    adminPanel.appendChild(contentContainer);
    container.appendChild(adminPanel);
    window.adminNavLinks = { mainLink, gamingLink, catalogLink };
    showAdminSection('main');
}

function showAdminSection(section) {
    if (window.adminNavLinks) {
        Object.values(window.adminNavLinks).forEach(link => link.classList.remove('active'));
        if (section === 'main') window.adminNavLinks.mainLink.classList.add('active');
        else if (section === 'gaming') window.adminNavLinks.gamingLink.classList.add('active');
        else if (section === 'catalog') window.adminNavLinks.catalogLink.classList.add('active');
    }
    const content = document.getElementById('adminContent');
    if (!content) return;
    if (section === 'main') renderMainAdmin(content);
    else if (section === 'gaming') renderProductsAdmin('gaming', 'Игровые компьютеры', true, content);
    else if (section === 'catalog') renderProductsAdmin('catalog', 'Каталог товаров', true, content);
}

function renderMainAdmin(container) {
    container.innerHTML = '';
    const productForm = document.createElement('div');
    productForm.className = 'product-form';
    const formTitle = document.createElement('h3');
    formTitle.style.cssText = 'margin-bottom:20px;color:#c084fc;';
    formTitle.textContent = '➕ Добавить товар на главную';
    productForm.appendChild(formTitle);
    productForm.appendChild(createFormGroup('Название', 'text', 'mainName', 'Например: Серия "XYZ"'));
    productForm.appendChild(createFormGroup('Цена (от)', 'number', 'mainPrice', '52230'));
    productForm.appendChild(createFormGroup('Характеристики', 'text', 'mainSpecs', 'RTX 4060, i7, 32GB'));
    const addBtn = document.createElement('button');
    addBtn.className = 'btn-primary';
    addBtn.textContent = '➕ Добавить';
    addBtn.onclick = addMainProduct;
    productForm.appendChild(addBtn);
    const listTitle = document.createElement('h3');
    listTitle.className = 'admin-list-title';
    listTitle.textContent = '📦 Товары на главной';
    container.appendChild(productForm);
    container.appendChild(listTitle);
    renderProductTable(products.main, 'main', false, container);
}

function renderProductsAdmin(type, title, hasImage, container) {
    container.innerHTML = '';
    const productForm = document.createElement('div');
    productForm.className = 'product-form';
    const formTitle = document.createElement('h3');
    formTitle.style.cssText = 'margin-bottom:20px;color:#c084fc;';
    formTitle.textContent = `➕ Добавить товар в ${title}`;
    productForm.appendChild(formTitle);
    productForm.appendChild(createFormGroup('Название', 'text', `${type}Name`, 'Название товара'));
    productForm.appendChild(createFormGroup('Цена (₽)', 'number', `${type}Price`, 'Цена'));
    productForm.appendChild(createFormGroup('Характеристики / Описание', 'textarea', `${type}Specs`, 'Подробное описание'));
    if (hasImage) {
        const imageGroup = createFormGroup('URL изображения (ссылка на фото)', 'text', `${type}Image`, 'https://example.com/computer.jpg');
        const imageHint = document.createElement('small');
        imageHint.style.cssText = 'color:#a78bfa;display:block;margin-top:5px;';
        imageHint.textContent = 'Вставьте ссылку на изображение компьютера';
        imageGroup.appendChild(imageHint);
        productForm.appendChild(imageGroup);
    }
    const addBtn = document.createElement('button');
    addBtn.className = 'btn-primary';
    addBtn.textContent = '➕ Добавить';
    addBtn.onclick = () => addProduct(type);
    productForm.appendChild(addBtn);
    const listTitle = document.createElement('h3');
    listTitle.className = 'admin-list-title';
    listTitle.textContent = '📦 Список товаров';
    container.appendChild(productForm);
    container.appendChild(listTitle);
    renderProductTable(products[type], type, hasImage, container);
}

function createFormGroup(labelText, inputType, id, placeholder) {
    const group = document.createElement('div');
    group.className = 'form-group';
    const label = document.createElement('label');
    label.textContent = labelText;
    let input;
    if (inputType === 'textarea') { input = document.createElement('textarea'); input.rows = 2; }
    else { input = document.createElement('input'); input.type = inputType; }
    input.id = id;
    input.placeholder = placeholder;
    group.appendChild(label);
    group.appendChild(input);
    return group;
}

function renderProductTable(items, type, hasImage, container) {
    if (!items || items.length === 0) {
        const emptyMsg = document.createElement('p');
        emptyMsg.className = 'admin-empty-msg';
        emptyMsg.textContent = 'Нет товаров';
        container.appendChild(emptyMsg);
        return;
    }
    const tableWrapper = document.createElement('div');
    tableWrapper.className = 'admin-table-wrapper';
    const table = document.createElement('table');
    table.className = 'admin-table';
    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');
    if (hasImage) { const th = document.createElement('th'); th.textContent = 'Изображение'; headerRow.appendChild(th); }
    ['Название', 'Цена', 'Характеристики', 'Действия'].forEach(t => {
        const th = document.createElement('th'); th.textContent = t; headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);
    table.appendChild(thead);
    const tbody = document.createElement('tbody');
    items.forEach((item, idx) => {
        const row = document.createElement('tr');
        if (hasImage) {
            const td = document.createElement('td');
            if (item.image) { const img = document.createElement('img'); img.src = item.image; img.style.cssText = 'width:60px;height:60px;object-fit:cover;border-radius:8px;'; td.appendChild(img); }
            else { td.textContent = 'Нет фото'; td.className = 'admin-td-nophoto'; }
            row.appendChild(td);
        }
        const tdName = document.createElement('td'); tdName.className = 'admin-td-name'; tdName.textContent = item.name;
        const tdPrice = document.createElement('td'); tdPrice.className = 'admin-td-price'; tdPrice.textContent = item.price ? item.price + '₽' : 'Индивидуально';
        const tdSpecs = document.createElement('td'); tdSpecs.className = 'admin-td-specs'; tdSpecs.textContent = item.specs || item.description || '-';
        const tdActions = document.createElement('td'); tdActions.className = 'admin-actions';
        const editBtn = document.createElement('button'); editBtn.className = 'btn-secondary'; editBtn.style.background = 'rgba(160,100,255,0.3)'; editBtn.textContent = '📷'; editBtn.onclick = () => editProductImage(type, idx);
        const deleteBtn = document.createElement('button'); deleteBtn.className = 'btn-danger'; deleteBtn.textContent = '🗑️'; deleteBtn.onclick = () => deleteProduct(type, idx);
        tdActions.appendChild(editBtn); tdActions.appendChild(deleteBtn);
        row.appendChild(tdName); row.appendChild(tdPrice); row.appendChild(tdSpecs); row.appendChild(tdActions);
        tbody.appendChild(row);
    });
    table.appendChild(tbody);
    tableWrapper.appendChild(table);
    container.appendChild(tableWrapper);
}

window.editProductImage = function (type, index) {
    const newImageUrl = prompt('Введите URL изображения для этого товара:', products[type][index].image || '');
    if (newImageUrl !== null) { products[type][index].image = newImageUrl; saveProducts(); showAdminSection(type); showToast('✨ Изображение обновлено'); }
};

function addMainProduct() {
    const nameInput = document.getElementById('mainName');
    const priceInput = document.getElementById('mainPrice');
    const specsInput = document.getElementById('mainSpecs');
    if (!nameInput || !nameInput.value) { alert('Введите название'); return; }
    products.main.push({ id: Date.now().toString(), name: nameInput.value, price: parseInt(priceInput.value), specs: specsInput.value, description: specsInput.value });
    saveProducts(); showAdminSection('main'); showToast('✨ Товар добавлен');
}

function addProduct(type) {
    const nameInput = document.getElementById(`${type}Name`);
    const priceInput = document.getElementById(`${type}Price`);
    const specsInput = document.getElementById(`${type}Specs`);
    const imageInput = document.getElementById(`${type}Image`);
    if (!nameInput || !nameInput.value || !priceInput || !priceInput.value) { alert('Заполните название и цену'); return; }
    products[type].push({ id: Date.now().toString(), name: nameInput.value, price: parseInt(priceInput.value), specs: specsInput.value, description: specsInput.value, image: imageInput ? imageInput.value : '' });
    saveProducts(); showAdminSection(type); showToast('✨ Товар добавлен');
}

function deleteProduct(type, index) {
    if (confirm('Удалить товар?')) { products[type].splice(index, 1); saveProducts(); showAdminSection(type); showToast('🗑️ Товар удален'); }
}

function exitAdmin() { window.location.hash = ''; renderMainSite(); }

function renderMainSite() {
    const app = document.getElementById('app');
    app.innerHTML = '';
    const container = document.createElement('div');
    container.className = 'container';

    const navbar = document.createElement('div');
    navbar.className = 'navbar';
    const logo = document.createElement('div');
    logo.className = 'logo';
    logo.textContent = '✨ TURBO-PC';
    const navLinks = document.createElement('ul');
    navLinks.className = 'nav-links';
    const navItems = ['Главная', 'Игровые ПК', 'Каталог', 'Услуги', 'Поддержка'];
    const navSections = ['main', 'gaming', 'catalog', 'services', 'support'];
    navItems.forEach((item, idx) => {
        const li = document.createElement('li');
        li.textContent = item;
        li.onclick = () => showSection(navSections[idx]);
        navLinks.appendChild(li);
    });
    const cartIcon = document.createElement('div');
    cartIcon.className = 'cart-icon';
    cartIcon.innerHTML = '🛒 Корзина (<span id="cartCount">0</span>)';
    cartIcon.onclick = openCartModal;
    const themeBtn = document.createElement('div');
    themeBtn.className = 'theme-toggle-btn';
    themeBtn.innerHTML = '🌓 Тема';
    themeBtn.onclick = toggleTheme;
    navbar.appendChild(logo);
    navbar.appendChild(navLinks);
    navbar.appendChild(cartIcon);
    navbar.appendChild(themeBtn);

    // Поисковая строка
    const searchWrapper = document.createElement('div');
    searchWrapper.className = 'search-bar-wrapper';
    const searchInner = document.createElement('div');
    searchInner.className = 'search-bar-inner';
    const searchIcon = document.createElement('span');
    searchIcon.textContent = '🔍';
    searchIcon.style.fontSize = '1.1rem';
    const searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.id = 'globalSearchInput';
    searchInput.placeholder = 'Поиск по игровым ПК и каталогу...';
    searchInput.autocomplete = 'off';
    const clearSearchBtn = document.createElement('span');
    clearSearchBtn.textContent = '✕';
    clearSearchBtn.style.cssText = 'cursor:pointer;color:#a78bfa;font-size:1rem;display:none;';
    clearSearchBtn.id = 'clearSearchBtn';
    clearSearchBtn.onclick = () => { searchInput.value = ''; clearSearchBtn.style.display = 'none'; hideSearchResults(); };
    searchInner.appendChild(searchIcon);
    searchInner.appendChild(searchInput);
    searchInner.appendChild(clearSearchBtn);
    const searchDropdown = document.createElement('div');
    searchDropdown.className = 'search-results-dropdown';
    searchDropdown.id = 'searchDropdown';
    searchWrapper.appendChild(searchInner);
    searchWrapper.appendChild(searchDropdown);
    searchInput.addEventListener('input', () => {
        const q = searchInput.value.trim();
        clearSearchBtn.style.display = q ? 'inline' : 'none';
        if (q.length >= 1) performSearch(q); else hideSearchResults();
    });
    searchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') { searchInput.value = ''; clearSearchBtn.style.display = 'none'; hideSearchResults(); }
    });
    document.addEventListener('click', (e) => { if (!searchWrapper.contains(e.target)) hideSearchResults(); });

    container.appendChild(navbar);
    container.appendChild(searchWrapper);

    const mainContent = document.createElement('div');
    mainContent.id = 'mainContent';
    const hero = document.createElement('div');
    hero.className = 'hero';
    const heroTitle = document.createElement('h1');
    heroTitle.textContent = '10 лет на рынке';
    const heroText = document.createElement('p');
    heroText.textContent = 'Безупречный сервис для вашего ПК';
    hero.appendChild(heroTitle);
    hero.appendChild(heroText);
    const sectionTitle1 = createSectionTitle('✨ Игровые компьютеры');
    const mainProductsGrid = document.createElement('div');
    mainProductsGrid.id = 'mainProductsGrid';
    mainProductsGrid.className = 'cards-grid';
    const sectionTitle2 = createSectionTitle('🛠 Услуги');
    const servicesGrid = document.createElement('div');
    servicesGrid.className = 'cards-grid';
    [{ title: 'Обслуживание', desc: 'Полная диагностика, чистка и замена термоинтерфейса' }, { title: 'Кастомизация', desc: 'Индивидуальный стайлинг, покраска, подсветка' }, { title: 'Апгрейд', desc: 'Апгрейд железа до последнего поколения' }].forEach(s => servicesGrid.appendChild(createProductCard(s.title, s.desc)));
    const footer = document.createElement('footer');
    footer.innerHTML = 'Turbo-PC<br>Copyright © 2016-2026';
    const adminBtn = document.createElement('div');
    adminBtn.style.marginTop = '10px';
    const adminLink = document.createElement('button');
    adminLink.style.cssText = 'background:none;border:none;color:#a78bfa;font-size:0.7rem;cursor:pointer;';
    adminLink.textContent = '🔧 Админ-панель';
    adminLink.onclick = openAdminSecret;
    adminBtn.appendChild(adminLink);
    footer.appendChild(adminBtn);
    mainContent.appendChild(hero);
    mainContent.appendChild(sectionTitle1);
    mainContent.appendChild(mainProductsGrid);
    mainContent.appendChild(sectionTitle2);
    mainContent.appendChild(servicesGrid);
    mainContent.appendChild(createSupportLinks());
    mainContent.appendChild(footer);

    const gamingSection = document.createElement('div');
    gamingSection.id = 'gamingSection';
    gamingSection.style.display = 'none';
    const kiz9kSection = document.createElement('div');
    kiz9kSection.id = 'kiz9kSection';
    kiz9kSection.className = 'series-section';
    const kiz9kTitle = document.createElement('h3');
    kiz9kTitle.textContent = '🎮 Игровые компьютеры серии "KIZ9K"';
    const kiz9kGrid = document.createElement('div');
    kiz9kGrid.id = 'kiz9kGrid';
    kiz9kGrid.className = 'cards-grid';
    kiz9kSection.appendChild(kiz9kTitle);
    kiz9kSection.appendChild(kiz9kGrid);
    const thunderSection = document.createElement('div');
    thunderSection.id = 'thunderSection';
    thunderSection.className = 'series-section';
    const thunderTitle = document.createElement('h3');
    thunderTitle.textContent = '⚡ Игровые компьютеры серии "THUNDER"';
    const thunderGrid = document.createElement('div');
    thunderGrid.id = 'thunderGrid';
    thunderGrid.className = 'cards-grid';
    thunderSection.appendChild(thunderTitle);
    thunderSection.appendChild(thunderGrid);
    const backToMainBtn = document.createElement('button');
    backToMainBtn.className = 'btn-secondary';
    backToMainBtn.textContent = '← На главную';
    backToMainBtn.onclick = scrollToMain;
    gamingSection.appendChild(kiz9kSection);
    gamingSection.appendChild(thunderSection);
    gamingSection.appendChild(backToMainBtn);

    const catalogSection = document.createElement('div');
    catalogSection.id = 'catalogSection';
    catalogSection.style.display = 'none';
    catalogSection.appendChild(createSectionTitle('📀 Каталог'));
    const catalogItems = document.createElement('div');
    catalogItems.id = 'catalogItems';
    catalogSection.appendChild(catalogItems);
    const catalogBackBtn = document.createElement('button');
    catalogBackBtn.className = 'btn-secondary';
    catalogBackBtn.textContent = '← На главную';
    catalogBackBtn.onclick = scrollToMain;
    catalogSection.appendChild(catalogBackBtn);

    const servicesSection = document.createElement('div');
    servicesSection.id = 'servicesSection';
    servicesSection.style.display = 'none';
    servicesSection.appendChild(createSectionTitle('🔧 Услуги'));
    const servicesGridFull = document.createElement('div');
    servicesGridFull.className = 'cards-grid';
    [{ title: 'Обслуживание', desc: 'Диагностика, чистка, замена термоинтерфейса', price: 'от 2500₽' }, { title: 'Кастомизация', desc: 'Индивидуальный стайлинг, покраска, подсветка', price: 'от 5000₽' }, { title: 'Апгрейд', desc: 'Обновление железа до последнего поколения', price: 'расчет по желанию' }].forEach(s => servicesGridFull.appendChild(createProductCard(s.title, `${s.desc}<br><span style="color:#c084fc;">${s.price}</span>`)));
    const servicesBackBtn = document.createElement('button');
    servicesBackBtn.className = 'btn-secondary';
    servicesBackBtn.textContent = '← На главную';
    servicesBackBtn.onclick = scrollToMain;
    servicesSection.appendChild(servicesGridFull);
    servicesSection.appendChild(servicesBackBtn);

    const supportSection = document.createElement('div');
    supportSection.id = 'supportSection';
    supportSection.style.display = 'none';
    supportSection.appendChild(createSectionTitle('📞 Поддержка'));
    supportSection.appendChild(createSupportLinks());
    const supportBackBtn = document.createElement('button');
    supportBackBtn.className = 'btn-secondary';
    supportBackBtn.textContent = '← На главную';
    supportBackBtn.onclick = scrollToMain;
    supportSection.appendChild(supportBackBtn);

    container.appendChild(mainContent);
    container.appendChild(gamingSection);
    container.appendChild(catalogSection);
    container.appendChild(servicesSection);
    container.appendChild(supportSection);
    container.appendChild(createCartModal());
    container.appendChild(createBuilderModal());
    app.appendChild(container);

    renderMainProducts();
    renderGamingLists();
    renderCatalogList();
    updateCartCounter();
}

function createSectionTitle(text) {
    const title = document.createElement('h2');
    title.className = 'section-title';
    title.textContent = text;
    return title;
}

function createProductCard(title, content) {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.innerHTML = `<strong>${title}</strong><br>${content}`;
    return card;
}

function createSupportLinks() {
    const supportLinks = document.createElement('div');
    supportLinks.className = 'support-links';
    const col1 = document.createElement('div');
    col1.className = 'support-col';
    col1.innerHTML = '<p>📦 Служба доставки</p><p>🛠 Техническая поддержка</p><p>✅ Гарантия</p>';
    const col2 = document.createElement('div');
    col2.className = 'support-col';
    col2.innerHTML = '<p>↩️ Возврат</p><p>❓ Вопросы</p><p>💾 Драйвера и утилиты</p>';
    supportLinks.appendChild(col1);
    supportLinks.appendChild(col2);
    return supportLinks;
}

function createCartModal() {
    const modal = document.createElement('div');
    modal.id = 'cartModal';
    modal.className = 'modal';
    const modalContent = document.createElement('div');
    modalContent.className = 'modal-content';
    const modalHeader = document.createElement('div');
    modalHeader.className = 'modal-header';
    const title = document.createElement('h2');
    title.textContent = '🛒 Корзина';
    const closeBtn = document.createElement('button');
    closeBtn.className = 'close-modal';
    closeBtn.textContent = '✕';
    closeBtn.onclick = closeCartModal;
    modalHeader.appendChild(title);
    modalHeader.appendChild(closeBtn);
    const cartContent = document.createElement('div');
    cartContent.id = 'cartContent';
    const buttonDiv = document.createElement('div');
    buttonDiv.style.cssText = 'display:flex;gap:16px;margin-top:20px;justify-content:flex-end;';
    const continueBtn = document.createElement('button');
    continueBtn.className = 'btn-secondary';
    continueBtn.textContent = 'Продолжить';
    continueBtn.onclick = closeCartModal;
    const clearBtn = document.createElement('button');
    clearBtn.className = 'btn-primary';
    clearBtn.textContent = '🗑️ Очистить';
    clearBtn.style.background = 'linear-gradient(135deg, #f43f5e, #e11d48)';
    clearBtn.onclick = clearCart;
    buttonDiv.appendChild(continueBtn);
    buttonDiv.appendChild(clearBtn);
    modalContent.appendChild(modalHeader);
    modalContent.appendChild(cartContent);
    modalContent.appendChild(buttonDiv);
    modal.appendChild(modalContent);
    return modal;
}

function createBuilderModal() {
    const modal = document.createElement('div');
    modal.id = 'builderModal';
    modal.className = 'modal';
    const modalContent = document.createElement('div');
    modalContent.className = 'modal-content';
    const modalHeader = document.createElement('div');
    modalHeader.className = 'modal-header';
    const title = document.createElement('h2');
    title.textContent = '⚙️ СОБЕРИ СВОЙ ПК ПОД СВОИ ЗАДАЧИ';
    const closeBtn = document.createElement('button');
    closeBtn.className = 'close-modal';
    closeBtn.textContent = '✕';
    closeBtn.onclick = closeBuilderModal;
    modalHeader.appendChild(title);
    modalHeader.appendChild(closeBtn);
    const buildGrid = document.createElement('div');
    buildGrid.className = 'build-grid';
    [{ id: 'gpuOptionsBuilder', title: '🎮 ВЫБИРАЙ ВИДЮХУ' }, { id: 'cpuOptionsBuilder', title: '💻 ВЫБИРАЙ ПРОЦЕССОР' }, { id: 'ramOptionsBuilder', title: '🧠 Кол-во RAM' }, { id: 'storageOptionsBuilder', title: '💾 Кол-во памяти (накопитель)' }, { id: 'caseOptionsBuilder', title: '🖥️ Корпус' }].forEach(cat => {
        const div = document.createElement('div');
        div.className = 'build-category';
        const h3 = document.createElement('h3');
        h3.textContent = cat.title;
        const opts = document.createElement('div');
        opts.className = 'options-wrapper';
        opts.id = cat.id;
        div.appendChild(h3);
        div.appendChild(opts);
        buildGrid.appendChild(div);
    });
    const expertNote = document.createElement('div');
    expertNote.className = 'expert-note';
    expertNote.innerHTML = '<strong>🧠 Мнение эксперта:</strong> Для киберспорта оптимально: RTX 4060 Ti + AMD Ryzen 7 7700 + 32GB RAM + 1TB NVMe. Качественный корпус с хорошим airflow продлевает жизнь компонентам!';
    const buildSummary = document.createElement('div');
    buildSummary.className = 'build-summary';
    const specDiv = document.createElement('div');
    const specLabel = document.createElement('div');
    specLabel.style.cssText = 'font-size:0.9rem;opacity:0.8;';
    specLabel.textContent = 'Ваша сборка';
    const buildSpecSummary = document.createElement('div');
    buildSpecSummary.id = 'buildSpecSummary';
    buildSpecSummary.style.fontWeight = '500';
    buildSpecSummary.textContent = '— выберите компоненты —';
    specDiv.appendChild(specLabel);
    specDiv.appendChild(buildSpecSummary);
    const priceDiv = document.createElement('div');
    const priceLabel = document.createElement('div');
    priceLabel.style.cssText = 'font-size:0.9rem;opacity:0.8;';
    priceLabel.textContent = 'Итоговая цена';
    const totalPrice = document.createElement('div');
    totalPrice.id = 'totalBuildPrice';
    totalPrice.className = 'total-price';
    totalPrice.textContent = '0 ₽';
    priceDiv.appendChild(priceLabel);
    priceDiv.appendChild(totalPrice);
    const addToCartBtn = document.createElement('button');
    addToCartBtn.className = 'btn-primary';
    addToCartBtn.textContent = '✨ Добавить в корзину';
    addToCartBtn.onclick = addCustomBuild;
    buildSummary.appendChild(specDiv);
    buildSummary.appendChild(priceDiv);
    buildSummary.appendChild(addToCartBtn);
    const feedback = document.createElement('div');
    feedback.id = 'builderFeedback';
    feedback.className = 'feedback';
    modalContent.appendChild(modalHeader);
    modalContent.appendChild(buildGrid);
    modalContent.appendChild(expertNote);
    modalContent.appendChild(buildSummary);
    modalContent.appendChild(feedback);
    modal.appendChild(modalContent);
    return modal;
}

function renderMainProducts() {
    const container = document.getElementById('mainProductsGrid');
    if (!container) return;
    container.innerHTML = '';
    products.main.forEach(p => {
        const card = document.createElement('div');
        card.className = 'product-card';
        const title = document.createElement('div');
        title.className = 'product-title';
        title.textContent = p.name;
        const price = document.createElement('div');
        price.className = 'price';
        price.textContent = p.price ? `от ${p.price.toLocaleString()}₽` : '✨ Индивидуально';
        const button = document.createElement('button');
        if (p.name.includes('KIZ9K')) { button.textContent = 'Выбрать конфигурацию'; button.onclick = () => goToGamingPage('KIZ9K'); }
        else if (p.name.includes('THUNDER')) { button.textContent = 'Выбрать конфигурацию'; button.onclick = () => goToGamingPage('THUNDER'); }
        else if (p.name === 'Собери свой ПК') { button.textContent = 'Собрать ПК!'; button.onclick = openBuilderModal; }
        else { button.textContent = 'Выбрать конфигурацию'; button.onclick = () => addToCart(p.name, p.price, p.specs); }
        card.appendChild(title); card.appendChild(price); card.appendChild(button);
        container.appendChild(card);
    });
}

function renderGamingLists() {
    const kiz9kModels = products.gaming.filter(p => p.name.includes('KIZ9K'));
    const thunderModels = products.gaming.filter(p => p.name.includes('THUNDER'));
    const kiz9kContainer = document.getElementById('kiz9kGrid');
    const thunderContainer = document.getElementById('thunderGrid');
    if (kiz9kContainer) { kiz9kContainer.innerHTML = ''; kiz9kModels.forEach(p => kiz9kContainer.appendChild(createGamingProductCard(p))); }
    if (thunderContainer) { thunderContainer.innerHTML = ''; thunderModels.forEach(p => thunderContainer.appendChild(createGamingProductCard(p))); }
}

function createGamingProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';
    if (product.image) {
        const img = document.createElement('img');
        img.src = product.image; img.className = 'product-image'; img.alt = product.name;
        img.onerror = () => { img.style.display = 'none'; const ph = img.nextElementSibling; if (ph) ph.style.display = 'flex'; };
        card.appendChild(img);
        const placeholder = document.createElement('div');
        placeholder.className = 'product-image-placeholder'; placeholder.textContent = '🖥️ Фото не добавлено'; placeholder.style.display = 'none';
        card.appendChild(placeholder);
    } else {
        const placeholder = document.createElement('div');
        placeholder.className = 'product-image-placeholder'; placeholder.textContent = '🖥️ Фото не добавлено';
        card.appendChild(placeholder);
    }
    const title = document.createElement('div'); title.className = 'product-title'; title.textContent = product.name;
    const price = document.createElement('div'); price.className = 'price'; price.textContent = `${product.price.toLocaleString()}₽`;
    const specs = document.createElement('div'); specs.style.cssText = 'margin:12px 0;font-size:0.9rem;color:#d9c9ff;'; specs.textContent = product.specs;
    const button = document.createElement('button'); button.textContent = '✨ В корзину'; button.onclick = () => addToCart(product.name, product.price, product.specs, product.image || '');
    card.appendChild(title); card.appendChild(price); card.appendChild(specs); card.appendChild(button);
    return card;
}

function renderCatalogList() {
    const container = document.getElementById('catalogItems');
    if (!container) return;
    container.innerHTML = '';
    const grid = document.createElement('div');
    grid.className = 'cards-grid';
    products.catalog.forEach(p => {
        const card = document.createElement('div');
        card.className = 'product-card';
        if (p.image) { const img = document.createElement('img'); img.src = p.image; img.className = 'product-image'; img.alt = p.name; img.onerror = () => img.style.display = 'none'; card.appendChild(img); }
        else { const ph = document.createElement('div'); ph.className = 'product-image-placeholder'; ph.textContent = '📦 Фото не добавлено'; card.appendChild(ph); }
        const title = document.createElement('h3'); title.className = 'catalog-item-title'; title.textContent = p.name;
        const price = document.createElement('div'); price.className = 'price'; price.textContent = `${p.price.toLocaleString()}₽`;
        const desc = document.createElement('div'); desc.className = 'catalog-item-desc'; desc.textContent = p.description;
        const button = document.createElement('button'); button.textContent = '✨ В корзину'; button.onclick = () => addToCart(p.name, p.price, p.category, p.image || '');
        card.appendChild(title); card.appendChild(price); card.appendChild(desc); card.appendChild(button);
        grid.appendChild(card);
    });
    container.appendChild(grid);
}

function renderCartModal() {
    const container = document.getElementById('cartContent');
    if (!container) return;
    container.innerHTML = '';
    if (cart.length === 0) {
        const emptyDiv = document.createElement('div');
        emptyDiv.className = 'empty-cart';
        emptyDiv.innerHTML = '<h3>✨ Ваша корзина пуста</h3><p>Посмотрите предложения на главной странице</p>';
        container.appendChild(emptyDiv);
        return;
    }
    let total = 0;
    cart.forEach((item, idx) => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        const infoDiv = document.createElement('div');
        infoDiv.className = 'cart-item-info';
        if (item.image) { const img = document.createElement('img'); img.src = item.image; img.style.cssText = 'width:50px;height:50px;object-fit:cover;border-radius:8px;margin-right:12px;float:left;'; infoDiv.appendChild(img); }
        const nameStrong = document.createElement('strong'); nameStrong.className = 'cart-item-name'; nameStrong.textContent = item.name; infoDiv.appendChild(nameStrong);
        if (item.specs) { const br = document.createElement('br'); const sm = document.createElement('small'); sm.className = 'cart-item-specs'; sm.textContent = item.specs; infoDiv.appendChild(br); infoDiv.appendChild(sm); }
        const priceSpan = document.createElement('span'); priceSpan.className = 'cart-item-qty'; priceSpan.innerHTML = `<br>${item.price.toLocaleString()}₽ × ${item.quantity}`; infoDiv.appendChild(priceSpan);
        const priceDiv = document.createElement('div'); priceDiv.className = 'cart-item-price'; priceDiv.textContent = `${itemTotal.toLocaleString()}₽`;
        const removeBtn = document.createElement('button'); removeBtn.className = 'remove-btn'; removeBtn.textContent = 'Удалить'; removeBtn.onclick = () => removeFromCart(idx);
        cartItem.appendChild(infoDiv); cartItem.appendChild(priceDiv); cartItem.appendChild(removeBtn);
        container.appendChild(cartItem);
    });
    const totalDiv = document.createElement('div');
    totalDiv.className = 'cart-total';
    totalDiv.innerHTML = `💰 Итого: <span style="background:linear-gradient(135deg,#e9d5ff,#c084fc);-webkit-background-clip:text;background-clip:text;color:transparent;font-size:1.5rem;">${total.toLocaleString()}₽</span>`;
    container.appendChild(totalDiv);
}

function scrollToMain() {
    ['gamingSection','catalogSection','servicesSection','supportSection'].forEach(id => { const el = document.getElementById(id); if (el) el.style.display = 'none'; });
    const main = document.getElementById('mainContent');
    if (main) main.style.display = 'block';
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function showSection(section) {
    ['mainContent','gamingSection','catalogSection','servicesSection','supportSection'].forEach(id => { const el = document.getElementById(id); if (el) el.style.display = 'none'; });
    if (section === 'main') { const el = document.getElementById('mainContent'); if (el) el.style.display = 'block'; }
    else { const el = document.getElementById(`${section}Section`); if (el) el.style.display = 'block'; }
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function openCartModal() {
    const modal = document.getElementById('cartModal');
    if (modal) { modal.classList.add('active'); renderCartModal(); document.body.style.overflow = 'hidden'; }
}

function closeCartModal() {
    const modal = document.getElementById('cartModal');
    if (modal) { modal.classList.remove('active'); document.body.style.overflow = 'auto'; }
}

function renderAdminPanelInApp() { renderAdminPanel(); }

function performSearch(query) {
    const q = query.toLowerCase();
    const dropdown = document.getElementById('searchDropdown');
    if (!dropdown) return;
    const gamingResults = products.gaming.filter(p => p.name.toLowerCase().includes(q) || (p.specs && p.specs.toLowerCase().includes(q)) || (p.description && p.description.toLowerCase().includes(q))).map(p => ({ ...p, _section: 'gaming', _badge: '🎮 Игровые ПК' }));
    const catalogResults = products.catalog.filter(p => p.name.toLowerCase().includes(q) || (p.specs && p.specs.toLowerCase().includes(q)) || (p.description && p.description.toLowerCase().includes(q)) || (p.category && p.category.toLowerCase().includes(q))).map(p => ({ ...p, _section: 'catalog', _badge: '📀 Каталог' }));
    const results = [...gamingResults, ...catalogResults].slice(0, 8);
    dropdown.innerHTML = '';
    if (results.length === 0) {
        const noRes = document.createElement('div'); noRes.className = 'search-no-results'; noRes.textContent = 'Ничего не найдено'; dropdown.appendChild(noRes);
    } else {
        results.forEach(item => {
            const row = document.createElement('div');
            row.className = 'search-result-item';
            if (item.image) { const img = document.createElement('img'); img.src = item.image; img.className = 'search-result-img'; img.alt = item.name; img.onerror = () => img.style.display = 'none'; row.appendChild(img); }
            else { const ph = document.createElement('div'); ph.className = 'search-result-placeholder'; ph.textContent = item._section === 'gaming' ? '🖥️' : '📦'; row.appendChild(ph); }
            const info = document.createElement('div'); info.className = 'search-result-info';
            const name = document.createElement('div'); name.className = 'search-result-name'; name.textContent = item.name;
            const specs = document.createElement('div'); specs.className = 'search-result-specs'; specs.textContent = item.specs || item.description || '';
            info.appendChild(name); info.appendChild(specs);
            const price = document.createElement('div'); price.className = 'search-result-price'; price.textContent = item.price ? item.price.toLocaleString() + '₽' : '';
            const badge = document.createElement('div'); badge.className = 'search-result-badge'; badge.textContent = item._badge;
            row.appendChild(info); row.appendChild(price); row.appendChild(badge);
            row.onclick = () => {
                hideSearchResults();
                const inp = document.getElementById('globalSearchInput'); if (inp) inp.value = '';
                const clr = document.getElementById('clearSearchBtn'); if (clr) clr.style.display = 'none';
                showSection(item._section);
            };
            dropdown.appendChild(row);
        });
    }
    dropdown.classList.add('visible');
}

function hideSearchResults() {
    const dropdown = document.getElementById('searchDropdown');
    if (dropdown) dropdown.classList.remove('visible');
}

window.addToCart = addToCart;
window.removeFromCart = removeFromCart;
window.clearCart = clearCart;
window.scrollToMain = scrollToMain;
window.showSection = showSection;
window.openCartModal = openCartModal;
window.closeCartModal = closeCartModal;
window.openBuilderModal = openBuilderModal;
window.closeBuilderModal = closeBuilderModal;
window.addCustomBuild = addCustomBuild;
window.goToGamingPage = goToGamingPage;
window.openAdminSecret = openAdminSecret;
window.showAdminSection = showAdminSection;
window.addMainProduct = addMainProduct;
window.addProduct = addProduct;
window.deleteProduct = deleteProduct;
window.editProductImage = editProductImage;
window.exitAdmin = exitAdmin;

loadData();
initTheme();
renderMainSite();
