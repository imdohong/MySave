document.addEventListener('DOMContentLoaded', () => {

    // 1. URL, Title, Selection 자동 채우기
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const currentTab = tabs[0];
        document.getElementById('pageTitle').value = currentTab.title;
        document.getElementById('pageUrl').value = currentTab.url;

        chrome.scripting.executeScript({
            target: { tabId: currentTab.id },
            func: () => window.getSelection().toString()
        }, (results) => {
            if (results && results[0] && results[0].result) {
                document.getElementById('selectedText').value = results[0].result;
            }
        });
    });

    // 2. 태그 (Select Box 기능)
    const tagSelect = document.getElementById('tagSelect');
    const tagContainer = document.getElementById('tagContainer');
    let tags = [];

    // 저장된 태그 목록을 불러와 Select Option으로 추가
    chrome.storage.local.get(['myTagList'], (result) => {
        const savedTagList = result.myTagList || []; // [{id, name, color...}, ...]
        
        savedTagList.forEach(tagObj => {
            const option = document.createElement('option');
            option.value = tagObj.name;
            option.text = tagObj.name;
            tagSelect.appendChild(option);
        });
    });

    // 태그 선택 시 추가
    tagSelect.addEventListener('change', (e) => {
        const selectedValue = e.target.value;
        if (selectedValue && !tags.includes(selectedValue)) {
            tags.push(selectedValue);
            renderTags();
        }
        // 선택 후 다시 기본값(placeholder)으로 돌림
        e.target.value = "";
    });

    function renderTags() {
        tagContainer.innerHTML = '';
        tags.forEach((tag, idx) => {
            const chip = document.createElement('div');
            chip.className = 'tag-chip';
            chip.innerHTML = `#${tag} <i class="fa-solid fa-xmark" data-idx="${idx}"></i>`;
            tagContainer.appendChild(chip);
        });

        // 삭제 아이콘 이벤트
        document.querySelectorAll('.tag-chip i').forEach(icon => {
            icon.addEventListener('click', (e) => {
                tags.splice(e.target.dataset.idx, 1);
                renderTags();
            });
        });
    }

    // 3. 리마인드
    const toggleBtn = document.getElementById('reminderToggle');
    const reminderOptions = document.getElementById('reminderOptions');
    const dateInput = document.getElementById('reminderDate');
    const calendarTrigger = document.getElementById('calendarTrigger');
    const dateDisplay = document.getElementById('dateDisplay');
    const quickBtns = document.querySelectorAll('.quick-btn');

    function updateDateDisplay(dateStr) {
        if(!dateStr) {
            dateDisplay.innerText = "직접 날짜 / 시간 선택하기";
            calendarTrigger.style.borderColor = "";
            calendarTrigger.style.backgroundColor = "";
            return;
        }
        const dateObj = new Date(dateStr);
        const month = dateObj.getMonth() + 1;
        const day = dateObj.getDate();
        const hour = dateObj.getHours().toString().padStart(2, '0');
        const min = dateObj.getMinutes().toString().padStart(2, '0');
        dateDisplay.innerText = `${month}월 ${day}일 ${hour}:${min}`;
        
        calendarTrigger.style.borderColor = "rgba(52, 84, 130, 1)";
        calendarTrigger.style.backgroundColor = "rgba(52, 82, 130, 0.11)";
    }

    toggleBtn.addEventListener('change', (e) => {
        if (e.target.checked) {
            reminderOptions.style.display = 'block';
        } else {
            reminderOptions.style.display = 'none';
            dateInput.value = '';
            quickBtns.forEach(btn => btn.classList.remove('active'));
            updateDateDisplay(null);
        }
    });

    calendarTrigger.addEventListener('click', () => {
        try { dateInput.showPicker(); } catch (err) { dateInput.focus(); dateInput.click(); }
    });

    dateInput.addEventListener('change', () => {
        quickBtns.forEach(b => b.classList.remove('active'));
        updateDateDisplay(dateInput.value);
    });

    function formatDateTime(date) {
        const offset = date.getTimezoneOffset() * 60000;
        return (new Date(date - offset)).toISOString().slice(0, 16);
    }
    
    function setQuickDate(daysToAdd, hour) {
        const d = new Date();
        d.setDate(d.getDate() + daysToAdd);
        d.setHours(hour, 0, 0, 0);
        return d;
    }

    document.getElementById('btnTomorrow').addEventListener('click', function() {
        applyQuickDate(setQuickDate(1, 9), this.id);
    });
    document.getElementById('btnWeekend').addEventListener('click', function() {
        const d = new Date();
        const day = d.getDay();
        const dist = 6 - day + (day === 6 ? 7 : 0);
        d.setDate(d.getDate() + dist);
        d.setHours(10, 0, 0, 0);
        applyQuickDate(d, this.id);
    });
    document.getElementById('btnNextWeek').addEventListener('click', function() {
        const d = new Date();
        const day = d.getDay();
        const dist = 8 - day;
        d.setDate(d.getDate() + dist);
        d.setHours(9, 0, 0, 0);
        applyQuickDate(d, this.id);
    });

    function applyQuickDate(dateObj, btnId) {
        const formatted = formatDateTime(dateObj);
        dateInput.value = formatted;
        updateDateDisplay(formatted);
        quickBtns.forEach(b => b.classList.remove('active'));
        document.getElementById(btnId).classList.add('active');
    }

    // 4. 저장하기
    document.getElementById('saveBtn').addEventListener('click', () => {
        const newBookmark = {
            id: Date.now(),
            url: document.getElementById('pageUrl').value,
            title: document.getElementById('pageTitle').value,
            text: document.getElementById('selectedText').value,
            memo: document.getElementById('memo').value,
            tags: tags,
            reminder: toggleBtn.checked,
            reminderDate: toggleBtn.checked ? dateInput.value : null,
            date: new Date().toLocaleDateString(),
            isStarred: false
        };

        chrome.storage.local.get(['myBookmarks'], (result) => {
            const bookmarks = result.myBookmarks || [];
            bookmarks.unshift(newBookmark);
            chrome.storage.local.set({ myBookmarks: bookmarks }, () => {
                document.getElementById('statusMsg').innerText = "✅ 저장되었습니다!";
                setTimeout(() => window.close(), 1000);
            });
        });
    });
});