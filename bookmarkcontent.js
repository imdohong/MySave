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
    // 텍스트 정보
    document.getElementById('detailTitle').textContent = data.title;
    
    const tagEl = document.getElementById('detailTag');
    tagEl.textContent = `#${data.tag}`;
    tagEl.style.backgroundColor = data.tagColor || '#555';

    document.getElementById('detailDate').textContent = data.date;
    
    // 본문 (줄바꿈 처리 포함)
    const contentHtml = data.content ? data.content.replace(/\n/g, '<br>') : "<p>내용이 없습니다.</p>";
    document.getElementById('detailContent').innerHTML = contentHtml;

    // 이미지 처리 (이미지가 없으면 영역 숨김)
    const imageContainer = document.querySelector('.thumbnail-placeholder');
    if (data.image && data.image.trim() !== "") {
        imageContainer.style.display = 'block'; 
        imageContainer.innerHTML = `<img src="${data.image}" alt="Cover Image" style="width: 100%; height: 100%; object-fit: cover; border-radius: 12px;">`;
    } else {
        imageContainer.style.display = 'none'; // 공간 삭제
        imageContainer.innerHTML = '';
    }

    // 별표 아이콘 상태
    const starIcon = document.querySelector('#detailStarBtn i');
    updateStarUI(starIcon, data.isStarred);

    // 요약 및 메모
    document.getElementById('detailAiSummary').textContent = data.aiSummary || "작성된 요약이 없습니다.";
    document.getElementById('detailMemo').value = data.memo || "";
}

// 별표 UI 업데이트 헬퍼 함수
function updateStarUI(iconElement, isStarred) {
    if (isStarred) {
        iconElement.className = 'fa-solid fa-star';
        iconElement.style.color = '#facc15';
    } else {
        iconElement.className = 'fa-regular fa-star';
        iconElement.style.color = ''; // 기본색(회색 등)
    }
}

// 수정 모드 활성화 함수
function enableMainEditMode(currentData, allBookmarks) {
    const titleEl = document.getElementById('detailTitle');
    const contentEl = document.getElementById('detailContent');
    const backNav = document.querySelector('.back-navigation'); 

    // 편집 가능 설정
    titleEl.contentEditable = true;
    contentEl.contentEditable = true;
    
    // 편집 중임을 알리는 스타일
    const editStyle = "1px dashed #3182F6"; // 파란 점선
    
    titleEl.style.border = editStyle;
    titleEl.style.outline = "none";
    titleEl.style.padding = "5px";
    titleEl.style.borderRadius = "5px";
    
    contentEl.style.border = editStyle;
    contentEl.style.outline = "none";
    contentEl.style.padding = "10px";
    contentEl.style.borderRadius = "10px";
    
    titleEl.focus();

    // 저장 버튼 생성 (중복 생성 방지)
    if (!document.getElementById('saveMainBtn')) {
        const saveBtn = document.createElement('button');
        saveBtn.id = 'saveMainBtn';
        saveBtn.innerText = '수정 완료';
        
        // 버튼 스타일링
        Object.assign(saveBtn.style, {
            padding: '8px 16px',
            backgroundColor: '#3182F6',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: 'bold',
            boxShadow: '0 2px 5px rgba(49, 130, 246, 0.3)',
            marginLeft: 'auto' // 우측 정렬용
        });

        backNav.appendChild(saveBtn);

        // 저장 버튼 클릭 이벤트
        saveBtn.addEventListener('click', () => {
            // 날짜 갱신
            const now = new Date();
            const newDate = `${now.getFullYear()}.${String(now.getMonth() + 1).padStart(2, '0')}.${String(now.getDate()).padStart(2, '0')}`;

            // 데이터 업데이트
            currentData.title = titleEl.textContent;
            // innerText는 줄바꿈을 유지하고 HTML 태그는 제거하는 경향이 있어 innerHTML 대신 사용 고려 가능하나, 
            // 여기선 HTML 편집을 허용하므로 innerHTML 사용
            currentData.content = contentEl.innerHTML; 
            currentData.date = newDate; 
            
            // 화면 갱신
            document.getElementById('detailDate').textContent = newDate;

            // 로컬 스토리지 저장
            localStorage.setItem('bookmarks', JSON.stringify(allBookmarks));

            alert('글이 수정되었습니다.');

            // 편집 모드 종료
            titleEl.contentEditable = false;
            contentEl.contentEditable = false;
            titleEl.style.border = "none";
            contentEl.style.padding = "0";
            contentEl.style.border = "none";
            
            saveBtn.remove(); 
            localStorage.removeItem('editMode'); // 수정모드 상태 해제
        });
    }
}

function setupEventListeners(currentData, allBookmarks) {
    const backBtn = document.querySelector('.btn-back');
    if (backBtn) {
        backBtn.addEventListener('click', (e) => {
            e.preventDefault(); // a 태그 이동 막기
            
            // 어디서 왔는지 확인
            const previousPage = localStorage.getItem('previousPage');
            
            if (previousPage === 'dashboard') {
                window.location.href = 'dashboard.html';
            } else if (previousPage === 'bookmark') {
                window.location.href = 'bookmark.html';
            } else if (previousPage === 'index') {  // 👈 이 부분만 확인/추가
                window.location.href = 'index.html'; 
            } else {
                history.back();
            }
        });

    // 2. 별표(즐겨찾기) 토글
    const bookmarkBtn = document.getElementById('detailStarBtn');
    if (bookmarkBtn) {
        bookmarkBtn.addEventListener('click', () => {
            const icon = bookmarkBtn.querySelector('i');
            currentData.isStarred = !currentData.isStarred;
            
            updateStarUI(icon, currentData.isStarred);
            localStorage.setItem('bookmarks', JSON.stringify(allBookmarks));
        });
    }

    // 3. 메모 수정/저장 기능
    const editMemoBtn = document.getElementById('editMemoBtn');
    const memoText = document.getElementById('detailMemo');
    let isMemoEditing = false;

    if (editMemoBtn && memoText) {
        editMemoBtn.addEventListener('click', () => {
            if (!isMemoEditing) {
                // 편집 시작
                memoText.readOnly = false;
                memoText.focus();
                memoText.style.border = "1px solid #3182F6";
                memoText.style.padding = "8px";
                editMemoBtn.innerText = '저장하기';
                editMemoBtn.style.backgroundColor = '#4CAF50';
                editMemoBtn.style.color = 'white';
                isMemoEditing = true;
            } else {
                // 편집 저장
                memoText.readOnly = true;
                memoText.style.border = "none";
                memoText.style.padding = "10px"; // 원래 패딩 복구
                editMemoBtn.innerText = '메모 수정하기';
                editMemoBtn.style.backgroundColor = ''; // 원래 색 복구
                editMemoBtn.style.color = '';
                isMemoEditing = false;
                
                currentData.memo = memoText.value;
                localStorage.setItem('bookmarks', JSON.stringify(allBookmarks));
                alert("메모가 저장되었습니다.");
            }
        });
    }

    // 4. AI 요약 버튼
    const generateSummaryBtn = document.getElementById('generateSummaryBtn');
    if(generateSummaryBtn){
        generateSummaryBtn.addEventListener('click', () => {
            alert('AI 요약 기능은 서버 연동이 필요합니다.');
        });
    }
}};