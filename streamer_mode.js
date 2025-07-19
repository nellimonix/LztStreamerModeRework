// ==UserScript==
// @name         LztStreamerModeRework
// @namespace    https://github.com/nellimonix/LztStreamerModeRework
// @version      1.0
// @description  Режим стримера для Lolzteam. Улучшенная и модифицированная версия!
// @author       llimonix
// @match        https://zelenka.guru/*
// @match        https://lolz.live/*
// @match        https://lzt.market/*
// @icon         https://cdn-icons-png.flaticon.com/512/18429/18429788.png
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @run-at       document-start
// ==/UserScript==

// Проверяем наши настройки
let StreamerModeSettings = GM_getValue('lzt_streamer_mode_settings', null);
if (!StreamerModeSettings) {
    const default_settings = {
        'main_page': {
            'title': 'Основное',
            'description': 'LZT Streamer Mode',
            'enabled': true
        },
        'banwords_page': {
            'banwords': [],
            'title': 'Запрещенные слова',
            'description': 'Блокировать запрещенные слова (укажите их через запятую)',
            'enabled': true
        },
        'selector_page': {
            'title': 'Настройка режима стримера',
            'general': {
                'title': 'Общие настройки',
                'balance': {
                    'selectors': [
                        'div#AccountMenu span.left',
                        '#MarketMoneyTransferForm .marketRefillBalance--Row:nth-of-type(2) .bigTextHeading',
                        '#MarketMoneyTransferForm div.MarketPopularTransfers',
                        'div.marketUserPanel div.balance-value',
                        'div.marketUserPanel a.holdPayment',
                        'div.marketUserPanel span.balanceNumber'
                    ],
                    'disabled_selectors': ['span#NavigationAccountBalance'],
                    'ignored_selectors': [],
                    'description': 'Скрывать все элементы, отображающие баланс пользователя (меню, переводы и т.д.)',
                    'enabled': true
                },
                'messages': {
                    'selectors': [
                        '#ConversationListItems',
                        'div.ng-notification div.body',
                    ],
                    'disabled_selectors': [],
                    'ignored_selectors': [],
                    'description': 'Скрывать личные сообщения, список диалогов и уведомления о новых сообщениях',
                    'enabled': true
                },
                'alerts': {
                    'selectors': [
                        'div#AlertPanels',
                        'div.account_alerts .alertGroup ol',
                        'div.liveAlert',
                        'div.imDialog',
                    ],
                    'disabled_selectors': [],
                    'ignored_selectors': [],
                    'description': 'Скрывать все уведомления, включая всплывающие',
                    'enabled': true
                }
            },
            'forum': {},
            'market': {
                'title': 'Настройки маркета',
                'viewed': {
                    'selectors': [
                        'div.marketViewedItems'
                    ],
                    'disabled_selectors': [],
                    'ignored_selectors': ['.marketMyPayments'],
                    'description': 'Скрывать блок недавно просмотренных товаров и аккаунтов',
                    'enabled': true
                },
                'payments': {
                    'selectors': [
                        'div.marketMyPayments div.wrapper'
                    ],
                    'disabled_selectors': [],
                    'ignored_selectors': ['.marketViewedItems'],
                    'description': 'Скрывать блок последних действий и историю операций',
                    'enabled': true
                },
                'orders': {
                    'selectors': [],
                    'disabled_selectors': [],
                    'ignored_selectors': [],
                    'description': 'Скрывать список купленных товаров и аккаунтов',
                    'enabled': true
                },
                'login_data': {
                    'selectors': [
                        'div.marketItemView--loginData',
                        'div.marketItemView--loginData--box',
                    ],
                    'disabled_selectors': [],
                    'ignored_selectors': [
                        '.login_details_for_arbitrators',
                        '.make_claim_seller_block',
                        '.recommendation_change_password'
                    ],
                    'description': 'Скрывать данные для входа в аккаунт: логин, пароль, email и т.п.',
                    'enabled': true
                },
                'payment_stats': {
                    'selectors': [
                        'div.paymentStats div.stats'
                    ],
                    'disabled_selectors': [],
                    'ignored_selectors': [],
                    'description': 'Скрывать сумму платежей за все время / указанный срок',
                    'enabled': true
                },
                'need_payment': {
                    'selectors': [
                        'div.need-payment div.need-payment-item'
                    ],
                    'disabled_selectors': [],
                    'ignored_selectors': [],
                    'description': 'Скрывать платежи ожидающие оплаты',
                    'enabled': true
                },
            },
            'staff': {
                'title': 'Настройки команды форума',
                'warning': 'Может затронуть некоторые обычные функции, если они используют схожие элементы',
                'all': {
                    'selectors': [],
                    'disabled_selectors': [
                        // Баланс пользователей
                        'div.userContentLinks a[href$="/payments"]',
                        'div.userContentLinks a[href$="/donate-to-forum"]',
                        // Кнопки в меню профиля
                        'a[href="account/email-blacklist"]',
                        'a[href="account/spam-words"]',
                        // Иконки тикетов, репортов и тд
                        'div.account-links a.modLink',
                        // Вспомогательные фукции в истории блокировок
                        'div.banLogs div#logs-buttons-f',
                        // Заметки команды форума
                        'ul.mainTabs a[href$="/#staff-notes"]',
                        // Настройки модератора в боковой панели
                        'div.navigationSideBar a[href="account/moderator-settings"]',
                        // Настройки персональной информации
                        'form.personalDetailsForm dl.customFieldEditscamURL',
                        'form.personalDetailsForm dl.customFieldEditlztUnbanAmount',
                        'form.personalDetailsForm dl.customFieldEditlztLikesZeroing',
                        'form.personalDetailsForm dl.customFieldEditlztAwardUserTrophy',
                        'form.personalDetailsForm dl.customFieldEditlztLikesIncreasing',
                        'form.personalDetailsForm dl.customFieldEditlztSympathyZeroing',
                        'form.personalDetailsForm dl.customFieldEditlztSympathyZeroing',
                        'form.personalDetailsForm dl.customFieldEditlztSympathyIncreasing',
                        // галочки справа у тем в разделах
                        'body label[for*="inlineModCheck-thread"]',
                        // галочки у сообщений в темах
                        '.InlineModCheck',
                        // показать удаленный контент в разделах
                        'a[href*="set-deleted-content-visibility"]',
                        // удаленные сообщения
                        '.messageList > .message.deleted',
                        // Доп. кнопки общие IP
                        'div.ipMatches a[href$="/#gauid"]',
                        'div.ipMatches a[href$="/#evercookie"]',
                        'div.ipMatches a[href$="/#fingerprints"]',
                        'div.ipMatches a[href$="/#multiple"]',
                        // Три точки в профиле пользователя
                        'div.MenuContainer a[href$="/edit"]',
                        'div.MenuContainer a[href^="spam-cleaner"]',
                        'div.MenuContainer a[href^="support-tickets/list"]',
                        'div.MenuContainer a[href^="members/quick-ban"]',
                        'div.MenuContainer a[href^="members/quick-unban"]',
                        'div.MenuContainer a[href$="/change-logs"]',
                        // Кнопки для управления комментариями
                        'div.MenuContainer a[href*="/warn"]',
                        'div.MenuContainer a[href*="/unapprove"]',
                        'div.MenuContainer a[href$="/history"]',
                        // Кнопки для управления темами
                        'div.MenuContainer a[href$="/reply-bans"]',
                        'div.MenuContainer a[href$="/user-actions"]',
                        'div.MenuContainer a[href$="/show-posts"]',
                        'div.MenuContainer a[href$="/change-starter"]',
                        'div.MenuContainer a[href$="/reply-bans"]',
                        'div.MenuContainer form[action$="/quick-update"] li:nth-child(2)',
                        'div.MenuContainer #threadViewThreadCheck',
                        // Арбиторский пульт
                        'div.decideMenuWrapper',
                        'div.quickReply div.lztClaim--members',
                        'div.pageContent div.staffClaimsStats',
                        // Быстрые кнопки для заблокированного пользователя
                        'div.profilePage a.siropuManageBan',
                        // Раздел для кураторов
                        '.nodeList .list.node911',
                        // Раздел для команды форума
                        '.nodeList .list.node434',
                        // Cписок игр и imap на маркете
                        '.marketExtraSidebarMenu:has(a[href="games"])',
                        // Маркет панель пользователя
                        'div.marketItemView--sidebarUser a[href$="/orders"]',
                        'div.marketItemView--sidebarUser a[href$="/payments"]',
                        'div.marketItemView--sidebarUser span.Tooltip',
                        // Инструменты модератора при поиске
                        'div.search_results div.Popup',
                    ],
                    'ignored_selectors': [],
                    'description': 'Скрывать функциональные элементы команды форума',
                    'enabled': false
                },
            }
        }
    }
    GM_setValue('lzt_streamer_mode_settings', default_settings);
    StreamerModeSettings = default_settings;
}

function collectSelectors(settings, mode = 'enabled') {
    const collect = (obj) => {
        if (!obj || typeof obj !== 'object' || !StreamerModeSettings.main_page.enabled) return [];
        return Object.values(obj).flatMap(value => {
            if (value.enabled && Array.isArray(value[mode === 'enabled' ? 'selectors' : 'disabled_selectors'])) {
                return value[mode === 'enabled' ? 'selectors' : 'disabled_selectors'];
            }
            return collect(value);
        });
    };
    return collect(settings);
}

// 1. Сразу добавляем CSS-блюр с плавными переходами
const selectors = collectSelectors(StreamerModeSettings, 'enabled');
const disabled_selectors = collectSelectors(StreamerModeSettings, 'disabled');

const path = window.location.pathname;
if (path === "/user/orders" || path === "/viewed") {
    selectors.push('div.MarketItems')
} else if (path === "/streamer-mode") {
    disabled_selectors.push('div.pageContent div.error-container')
}

const style = document.createElement('style');
style.textContent = `
    ${selectors.map(selector => `${selector}`).join(', ')} {filter: blur(6px);}
    ${disabled_selectors.map(selector => `${selector}`).join(', ')} {display: none !important;}

    div.bbCodeHide blockquote.hideContainer {filter: ${StreamerModeSettings.main_page?.enabled ? 'blur(6px)' : 'none'}}

    .member_tabs li a[href*="#change-logs"] {
        font-size:0px
    }

    .member_tabs li a[href*="#change-logs"]:before {
        content: "История блокировок"; font-size: 13px
    }

    .CensorStreamer {
        filter: blur(6px) !important;
        transition: filter 0.3s ease !important;
        position: relative !important;
        pointer-events: none !important;
    }

    .CensorStreamer:hover {
        filter: blur(4px) !important;
    }

    .CensorStreamerClicked {
        filter: none !important;
        pointer-events: auto !important;
    }

    .CensorStreamer::before {
        content: '' !important;
        position: absolute !important;
        top: 0 !important;
        left: 0 !important;
        right: 0 !important;
        bottom: 0 !important;
        z-index: 9999 !important;
        cursor: pointer !important;
        pointer-events: auto !important;
        background: transparent !important;
    }

    .CensorStreamerClicked::before {
        display: none !important;
    }
`;
document.head.appendChild(style);

// 2. Ждём, пока появится XenForo
const win = typeof unsafeWindow !== 'undefined' ? unsafeWindow : window;

Object.defineProperty(win, 'XenForo', {
    configurable: true,
    set(value) {
        delete win.XenForo;
        win.XenForo = value;

        if (typeof win.XenForo.register === 'function') {
            try {
                initBlurFeature();
            } catch (error) {
                console.error('Ошибка при вызове initBlurFeature:', error);
            }
        }
    }
});

// 3. Инициализация блюра через XenForo
function initBlurFeature() {
    // Основная функция
    XenForo.applyBlurCustom = function(element, ignoredSelectors = [], index = null) {
        let el = element instanceof jQuery ? element[0] : element;
        if (!el || typeof el.classList === 'undefined') return;

        const isIgnored = (target) =>
        ignoredSelectors.some((selector) => target.matches(selector));

        if (isIgnored(el)) {
            el.style.filter = "none"
            return; // Не применяем блюр к игнорируемым элементам
        }

        // Проверяем, не обработан ли уже элемент
        if (el.classList.contains("CensorStreamer") || el.classList.contains("CensorStreamerClicked")) return;

        // Добавляем класс для блюра
        el.classList.add("CensorStreamer");

        // Обработчик клика для снятия блюра
        const handleClick = (event) => {
            // Проверяем, что клик был по overlay (::before элементу)
            if (event.target === el) {
                event.preventDefault();
                event.stopPropagation();

                // Снимаем блюр и делаем элемент кликабельным
                el.classList.remove("CensorStreamer");
                el.classList.add("CensorStreamerClicked");

                // Удаляем обработчики, так как блюр снят
                el.removeEventListener("click", handleClick);
            }
        };

        // Добавляем обработчик клика
        el.addEventListener("click", handleClick);
    };

    function registerSelectors(section) {
        if (!section.enabled) return;
        const { selectors = [], ignored_selectors = [] } = section;
        selectors.forEach(sel => {
            XenForo.register(sel, function() {
                XenForo.applyBlurCustom(this, ignored_selectors);
            });
        });
    }

    function registerBlurForSelectorPage(settings) {
        const { selector_page } = settings;
        if (!selector_page || !settings.main_page?.enabled) return;
        Object.values(selector_page).forEach(section => {
            Object.values(section).forEach(category => {
                registerSelectors(category);
            });
        });

        // Специфическая логика для сообщений
        if (selector_page.general?.messages?.enabled) {
            XenForo.register('li.conversationItem', function() {
                const container = this.closest('ol');
                XenForo.applyBlurCustom(container);
            });
        }

        // Логика для MarketItems
        const marketEnabled = selector_page.market?.viewed?.enabled || selector_page.market?.orders?.enabled;
        if (marketEnabled) {
            XenForo.register('div.MarketItems', function() {
                const path = window.location.pathname;
                if ((path === "/user/orders" && selector_page.market?.orders?.enabled) ||
                    (path === "/viewed" && selector_page.market?.viewed?.enabled)) {
                    XenForo.applyBlurCustom(this);
                }
            });
        }

        // Секретный вопрос
        XenForo.register('input[name="secret_answer"]', function() {
            let el = this instanceof jQuery ? this[0] : this;
            el.setAttribute('type', 'password');
        });

        // Хайды
        XenForo.register('div.bbCodeHide', function() {
            let el = this instanceof jQuery ? this[0] : this;

            const quote = el.querySelector('div.quote');
            const quoteContainer = el.querySelector('blockquote.hideContainer');
            const attribution = el.querySelector('aside div.attribution.type');

            if (quote && quoteContainer && attribution) {
                XenForo.applyBlurCustom(quoteContainer);
            } else {
                quoteContainer.style.filter = "none"
            }
        });
    }

    const banWordsList = StreamerModeSettings?.banwords_page?.banwords

    XenForo.applyCensorCustom = function(element, banwords = []) {
        let el = element instanceof jQuery ? element[0] : element;
        if (!el || typeof el.classList === 'undefined') return;

        const regex = new RegExp(banWordsList.map(word => word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|'), 'gi');

        function censorText(text) {
            return text.replace(regex, match => '*'.repeat(match.length));
        }

        function censorNode(node) {
            if (node.nodeType === Node.TEXT_NODE) {
                const censored = censorText(node.nodeValue);
                if (node.nodeValue !== censored) {
                    node.nodeValue = censored;
                }
            } else if (node.nodeType === Node.ELEMENT_NODE) {
                for (let child of node.childNodes) {
                    censorNode(child);
                }
            }
        }
        censorNode(el);
    };

    registerBlurForSelectorPage(StreamerModeSettings);

    if (StreamerModeSettings?.banwords_page?.enabled && StreamerModeSettings?.main_page?.enabled) {
        const selectors = [
            'div.messageContent', 'div.commentContent', 'div.pageContent div.titleBar',
            '.threadLastPost', '.discussionListItem', 'li.Alert', ' div.liveAlert',
            'ul li.conversationItem', '#page_current_info', '.userStatus',
            'div.ng-notification div.body'
        ]
        selectors.forEach(sel => {
            XenForo.register(sel, function() {
                XenForo.applyCensorCustom(this, banWordsList);
            });
        });
        XenForo.register('ol li.conversationItem', function() {
            const container = this.querySelector('.Content');
            XenForo.applyCensorCustom(container);
        });
        XenForo.register('ul li.conversationItem', function() {
            const container = this.querySelector('.Content');
            XenForo.applyCensorCustom(container);
        });
    }

    const publicTabs = document.querySelector('ul.account-links');
    const newItem = document.createElement('li');
    newItem.classList.add('navTab');
    newItem.innerHTML = `
      <a href="/streamer-mode" class="navLink">
        <div class="counter-container">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#888" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" xmlns="http://www.w3.org/2000/svg">
            <path d="M23 7l-7 5 7 5V7z"/>
            <rect x="1" y="5" width="15" height="14" rx="2" ry="2"/>
          </svg>
        </div>
      </a>
    `;

    publicTabs.prepend(newItem);


    if (path === "/streamer-mode") {
        document.title = 'LZT Streamer Mode [made ❤︎ llimonix]';
        const settingsRoot = document.querySelector('div#headerMover div.pageContent');
        const htmlTree = buildStreamerModeSettings(StreamerModeSettings);
        settingsRoot.appendChild(htmlTree);
        buildBanwordsInputStyle();
        document.getElementById('lzt_streamer_mode_save')?.addEventListener('click', lzt_streamer_mode_save);
        document.getElementById('lzt_streamer_mode_reset')?.addEventListener('click', function () {
            GM_deleteValue('lzt_streamer_mode_settings');
            location.reload();
        });
    }
}

function lzt_streamer_mode_save() {
    // Клонируем текущие настройки
    const updatedSettings = structuredClone(StreamerModeSettings);

    document.querySelectorAll('div.lztStreamerMode input[type="checkbox"]').forEach(checkbox => {
        const path = checkbox.id.replace('lzt_sm_', '')

        if (!path) return;

        const keys = path.split('.'); // Разбиваем путь по точкам
        let current = updatedSettings;

        // Идем по иерархии ключей
        for (let i = 0; i < keys.length - 1; i++) {
            const key = keys[i];
            if (!(key in current)) {
                console.warn(`Путь не найден: ${key} в ${path}`);
                return;
            }
            current = current[key];

        }

        const lastKey = keys[keys.length - 1];
        if (lastKey in current) {
            current[lastKey].enabled = checkbox.checked;
        } else {
            console.warn(`Ключ ${lastKey} не найден в ${path}`);
        }
    });

    // Получение банвордов
    const banwordElements = document.querySelectorAll('.lzt_sm_input_banword .word');
    const banwords = Array.from(banwordElements)
    .map(el => el.textContent.trim())
    .filter(word => word.length > 0);

    if (updatedSettings.banwords_page) {
        updatedSettings.banwords_page.banwords = banwords;
    } else {
        console.warn('banwords_page отсутствует в настройках');
    }

    // Сохраняем
    GM_setValue('lzt_streamer_mode_settings', updatedSettings);
    XenForo.alert('[LZT Streamer Mode] Настройки сохранены', '', 5000)
    console.log('[LZT Streamer Mode] Настройки сохранены');
}

function buildBanwordsInputStyle() {
    const container = document.querySelector('.lzt_sm_input');
    const input = document.getElementById('lzt_sm_banwords_input');
    const existingWords = new Set();

    // Создание тега
    function addWordTag(word) {
        const trimmed = word.trim();
        if (!trimmed || existingWords.has(trimmed.toLowerCase())) return;

        const tag = document.createElement('div');
        tag.className = 'lzt_sm_input_banword';

        const span = document.createElement('span');
        span.className = 'word';
        span.textContent = trimmed;

        const remove = document.createElement('div');
        remove.className = 'remove_word';
        remove.textContent = '×';

        remove.addEventListener('click', () => {
            tag.remove();
            existingWords.delete(trimmed.toLowerCase());
        });

        tag.appendChild(span);
        tag.appendChild(remove);
        container.insertBefore(tag, input);
        existingWords.add(trimmed.toLowerCase());
    }

    // Обработка Enter и запятой
    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ',' || e.code === "Space") {
            e.preventDefault();
            const parts = input.value.split(',');
            parts.forEach(word => addWordTag(word));
            input.value = '';
        } else if (e.key === 'Backspace' && input.value === '') {
            const tags = container.querySelectorAll('.lzt_sm_input_banword');
            if (tags.length > 0) {
                const lastTag = tags[tags.length - 1];
                const word = lastTag.querySelector('.word').textContent;
                existingWords.delete(word.toLowerCase());
                lastTag.remove();
            }
        }
    });

    // Обработка вставки текста
    input.addEventListener('paste', function (e) {
        e.preventDefault();
        const paste = (e.clipboardData || window.clipboardData).getData('text');
        const parts = paste.split(',');
        parts.forEach(word => addWordTag(word));
        input.value = '';
    });
}

function buildStreamerModeSettings(settings) {
    const container = document.createElement('div');
    container.className = 'container';

    const mainContentBlock = document.createElement('div');
    mainContentBlock.className = 'mainContentBlock';
    container.appendChild(mainContentBlock);

    const lztStreamerMode = document.createElement('div');
    lztStreamerMode.className = 'lztStreamerMode';
    mainContentBlock.appendChild(lztStreamerMode);

    const title = document.createElement('div');
    title.className = 'lzt_sm_title';
    title.style.borderRadius = '10px 10px 0 0';
    title.style.margin = '0';
    title.textContent = 'LZT Streamer Mode [made ❤︎ llimonix]';
    lztStreamerMode.appendChild(title);

    for (const [pageKey, page] of Object.entries(settings)) {
        const dl = document.createElement('dl');
        dl.className = 'ctrlUnit_blocks';

        const heading = document.createElement('div');
        heading.className = 'textHeading';
        heading.textContent = page.title || 'Без названия';
        dl.appendChild(heading);

        if (pageKey === 'main_page') {
            const div = document.createElement('div');

            const label = document.createElement('label');

            const input = document.createElement('input');
            input.type = 'checkbox';
            input.id = `lzt_sm_${pageKey}`;
            input.checked = page.enabled;

            label.appendChild(input);
            label.appendChild(document.createTextNode(' ' + (page.description || key)));
            div.appendChild(label);
            dl.appendChild(div);
            lztStreamerMode.appendChild(dl);
            continue;
        }

        if (pageKey === 'banwords_page') {

            const div = document.createElement('div');

            const label = document.createElement('label');

            const input = document.createElement('input');
            input.type = 'checkbox';
            input.id = `lzt_sm_${pageKey}`;
            input.checked = page.enabled;

            label.appendChild(input);
            label.appendChild(document.createTextNode(' ' + (page.description || key)));
            div.appendChild(label);
            dl.appendChild(div);

            const dd = document.createElement('dd');
            dd.style.margin = '15px 0 0';

            // Контейнер для ввода и тегов
            const inputContainer = document.createElement('div');
            inputContainer.className = 'lzt_sm_input';

            const textInput = document.createElement('input');
            textInput.type = 'text';
            textInput.id = 'lzt_sm_banwords_input';
            textInput.className = 'lzt_sm_input';

            inputContainer.appendChild(textInput);
            dd.appendChild(inputContainer);
            dl.appendChild(dd);

            lztStreamerMode.appendChild(dl);

            // Загрузить слова из page.banwords (массив слов)
            const existingWords = new Set(); // для исключения дублей
            const renderBanwordTag = (word) => {
                if (!word || existingWords.has(word)) return;
                existingWords.add(word);

                const wordTag = document.createElement('div');
                wordTag.className = 'lzt_sm_input_banword';

                const span = document.createElement('span');
                span.className = 'word';
                span.textContent = word;

                const removeBtn = document.createElement('div');
                removeBtn.className = 'remove_word';
                removeBtn.textContent = '×';
                removeBtn.onclick = () => {
                    wordTag.remove();
                    existingWords.delete(word);
                };

                wordTag.appendChild(span);
                wordTag.appendChild(removeBtn);

                inputContainer.insertBefore(wordTag, textInput);
            };

            // подгрузка из конфига
            if (Array.isArray(page.banwords)) {
                page.banwords.forEach(renderBanwordTag);
            }

            continue;
        }

        const dd = document.createElement('dd');
        const ul = document.createElement('ul');

        for (const [sectionKey, section] of Object.entries(page)) {
            if (['title', 'description', 'enabled'].includes(sectionKey)) continue;

            if (!section || Object.keys(section).length === 0) continue;
            const li = document.createElement('li');
            const desc = document.createElement('div');
            desc.className = 'lzt_sm_description';
            desc.textContent = section.title || sectionKey;
            li.appendChild(desc);

            const checkboxDiv = document.createElement('div');
            checkboxDiv.className = 'checkbox_streamer';

            if (section.warning) {
                const label = document.createElement('label');
                label.className = 'warningText';
                label.appendChild(document.createTextNode(' ' + (section.warning || sectionKey)));
                checkboxDiv.appendChild(label);
            }

            for (const [key, item] of Object.entries(section)) {
                if (['title', 'description', 'enabled'].includes(key)) continue;
                if (!item.selectors) continue;

                const label = document.createElement('label');

                const input = document.createElement('input');
                input.type = 'checkbox';
                input.id = `lzt_sm_${pageKey}.${sectionKey}.${key}`;
                input.checked = item.enabled;

                label.appendChild(input);
                label.appendChild(document.createTextNode(' ' + (item.description || key)));
                checkboxDiv.appendChild(label);
            }

            li.appendChild(checkboxDiv);
            ul.appendChild(li);
        }

        dd.appendChild(ul);
        dl.appendChild(dd);
        lztStreamerMode.appendChild(dl);
    }

    // Кнопки
    const btnDl = document.createElement('dl');
    btnDl.className = 'ctrlUnit_blocks_button_save';

    const btnDd = document.createElement('dd');
    btnDd.innerHTML = `
    <div style="display: flex; flex-direction: row; gap: 8px; flex-wrap: wrap;">
      <button class="button primary" id="lzt_streamer_mode_save">Сохранить изменения</button>
      <button class="button" id="lzt_streamer_mode_reset">Сбросить настройки</button>
    </div>`;

    btnDl.appendChild(btnDd);
    mainContentBlock.appendChild(btnDl);

    const style = document.createElement('style');
    style.textContent = `
    .lztStreamerMode .lzt_sm_description {
        margin: 0 0 10px;
        color: #949494;
    }
    input.lzt_sm_input {
        height: 38px;
        line-height: 38px;
        padding-left: 4px;
        border: 0;
        color: rgb(214, 214, 214);
        flex-grow: 1;
        background: none;
        width: 100px;
    }
    div.lzt_sm_input {
        font-size: 13px;
        color: #d6d6d6;
        border: 0 none #000;
        box-sizing: border-box;
        padding: 4px 8px;
        cursor: text;
        line-height: 34px;
        border-radius: 8px;
        outline: none;
        display: flex;
        flex-wrap: wrap;
        height: unset !important;
        background: none;
        box-shadow: 0 0 0 1px #323232;
    }
    .lztStreamerMode .textHeading {
        margin: 0 0 10px;
    }
    .lzt_sm_title {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 20px;
        font-size: 16px;
        font-weight: 600;
        border-bottom: 1px solid #242424;
        margin: -10px -10px 16px -10px;
        width: 100%;
        box-sizing: border-box;
    }
    .mainContentBlock {
        background-color: #1c1c1c;
        border-radius: 10px;
        vertical-align: top;
        margin: 10px auto;
        zoom: 1;
    }
    .ctrlUnit_blocks {
        border-bottom: 1px solid rgb(36, 36, 36);
        padding: 20px 20px 16px 20px;
    }
    .ctrlUnit_blocks_button {
        border-bottom: 1px solid rgb(36, 36, 36);
        padding: 20px 0px 20px 20px;
    }
    .lztStreamerMode .ctrlUnit_blocks label {
        margin: 0 20px 0 0;
        white-space: nowrap;
    }
    .ctrlUnit_blocks>dd>*>li {
        margin: 5px 0 14px;
        padding-left: 1px;
    }
    .ctrlUnit_blocks_button_save {
        padding: 20px 0px 20px 20px;
    }
    .checkbox_streamer {
        display: flex;
        gap: 8px;
        flex-direction: column;
        flex-wrap: wrap;
    }

    .lzt_sm_input_banword {
        border-radius: 6px;
        display: inline-flex;
        gap: 5px;
        padding: 4px 8px;
        align-items: center;
        margin: 5px 5px 5px 0;
        height: 20px;
        line-height: 20px;
        background-color: #2d2d2d;
    }

    .lzt_sm_input_banword span.word {
        height: 100%;
        width: 100%;
        display: flex;
        align-items: center;
        font-weight: 600;
    }

    .lzt_sm_input_banword div.remove_word {
        font-size: 19px;
        color: #999;
        cursor: pointer;
        margin-left: 2px;
    }`;
    mainContentBlock.appendChild(style);

    return container;
}
