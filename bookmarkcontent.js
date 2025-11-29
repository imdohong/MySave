document.addEventListener('DOMContentLoaded', () => {
    const currentId = localStorage.getItem('currentBookmarkId');
    const bookmarks = JSON.parse(localStorage.getItem('bookmarks'));
    const isEditMode = localStorage.getItem('editMode') === 'true'; 

    if (!currentId || !bookmarks) {
        alert('잘못된 접근입니다.');
        window.location.href = 'bookmark.html';
        return;
    }

    const currentData = bookmarks.find(item => item.id == currentId);

    if (!currentData) {
        alert('존재하지 않는 게시글입니다.');
        window.location.href = 'bookmark.html';
        return;
    }

    renderDetail(currentData);

    if (isEditMode) {
        enableMainEditMode(currentData, bookmarks);
    }

    setupEventListeners(currentData, bookmarks);
});

function renderDetail(data) {
    document.getElementById('detailTitle').textContent = data.title;
    
    const tagEl = document.getElementById('detailTag');
    tagEl.textContent = `#${data.tag}`;
    tagEl.style.backgroundColor = data.tagColor || '#555';

    document.getElementById('detailDate').textContent = data.date;
    document.getElementById('detailContent').innerHTML = data.content || "<p>내용이 없습니다.</p>";

    const starIcon = document.querySelector('#detailStarBtn i');
    if (data.isStarred) {
        starIcon.className = 'fa-solid fa-star';
        starIcon.style.color = '#facc15';
    } else {
        starIcon.className = 'fa-regular fa-star';
        starIcon.style.color = '#facc15';
    }

    document.getElementById('detailAiSummary').textContent = data.aiSummary || "작성된 요약이 없습니다.";
    document.getElementById('detailMemo').value = data.memo || "";
}

function enableMainEditMode(currentData, allBookmarks) {
    const titleEl = document.getElementById('detailTitle');
    const contentEl = document.getElementById('detailContent');
    const backNav = document.querySelector('.back-navigation'); 

    titleEl.contentEditable = true;
    contentEl.contentEditable = true;
    
    titleEl.style.border = "1px dashed #3182F6";
    titleEl.style.padding = "5px";
    titleEl.style.borderRadius = "5px";
    
    contentEl.style.border = "1px dashed #3182F6";
    contentEl.style.padding = "10px";
    contentEl.style.borderRadius = "10px";
    
    titleEl.focus();

    if (!document.getElementById('saveMainBtn')) {
        const saveBtn = document.createElement('button');
        saveBtn.id = 'saveMainBtn';
        saveBtn.innerText = '수정 완료';
        
        saveBtn.style.padding = '8px 16px';
        saveBtn.style.backgroundColor = '#3182F6';
        saveBtn.style.color = '#fff';
        saveBtn.style.border = 'none';
        saveBtn.style.borderRadius = '8px';
        saveBtn.style.cursor = 'pointer';
        saveBtn.style.fontSize = '14px';
        saveBtn.style.fontWeight = 'bold';
        saveBtn.style.boxShadow = '0 2px 5px rgba(49, 130, 246, 0.3)';

        backNav.appendChild(saveBtn);

        saveBtn.addEventListener('click', () => {
            const newTitle = titleEl.textContent;
            const newContent = contentEl.innerHTML;

            // [추가됨] 현재 날짜 구하기 (YYYY.MM.DD 형식)
            const now = new Date();
            const year = now.getFullYear();
            const month = String(now.getMonth() + 1).padStart(2, '0');
            const day = String(now.getDate()).padStart(2, '0');
            const newDate = `${year}.${month}.${day}`;

            // 데이터 업데이트 (제목, 내용, 날짜)
            currentData.title = newTitle;
            currentData.content = newContent;
            currentData.date = newDate; 
            
            // 화면의 날짜도 즉시 업데이트
            document.getElementById('detailDate').textContent = newDate;

            localStorage.setItem('bookmarks', JSON.stringify(allBookmarks));

            alert('글이 수정되었습니다.');

            titleEl.contentEditable = false;
            contentEl.contentEditable = false;
            titleEl.style.border = "none";
            contentEl.style.border = "none";
            titleEl.style.padding = "0";
            contentEl.style.padding = "0";
            
            saveBtn.remove(); 
            localStorage.removeItem('editMode');
        });
    }
}

function setupEventListeners(currentData, allBookmarks) {
    const bookmarkBtn = document.getElementById('detailStarBtn');
    bookmarkBtn.addEventListener('click', () => {
        const icon = bookmarkBtn.querySelector('i');
        currentData.isStarred = !currentData.isStarred;
        
        if (currentData.isStarred) {
            icon.className = 'fa-solid fa-star';
        } else {
            icon.className = 'fa-regular fa-star';
        }
        localStorage.setItem('bookmarks', JSON.stringify(allBookmarks));
    });

    const editMemoBtn = document.getElementById('editMemoBtn');
    const memoText = document.getElementById('detailMemo');
    let isMemoEditing = false;

    editMemoBtn.addEventListener('click', () => {
        if (!isMemoEditing) {
            memoText.readOnly = false;
            memoText.focus();
            memoText.style.border = "1px solid #3182F6";
            memoText.style.padding = "8px";
            editMemoBtn.textContent = '저장하기';
            isMemoEditing = true;
        } else {
            memoText.readOnly = true;
            memoText.style.border = "none";
            memoText.style.padding = "0";
            editMemoBtn.textContent = '메모 수정하기';
            isMemoEditing = false;
            
            currentData.memo = memoText.value;
            localStorage.setItem('bookmarks', JSON.stringify(allBookmarks));
            alert("메모가 저장되었습니다.");
        }
    });

    const generateSummaryBtn = document.getElementById('generateSummaryBtn');
    if(generateSummaryBtn){
        generateSummaryBtn.addEventListener('click', () => {
            alert('AI 요약 기능은 서버 연동이 필요합니다.');
        });
    }
}