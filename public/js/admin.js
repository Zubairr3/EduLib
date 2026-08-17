function logout() { localStorage.removeItem('token'); window.location.href = '/index.html'; }
function showToast(message) {
    const toast = document.getElementById('toast');
    toast.innerHTML = message;
    toast.classList.add('show');
    setTimeout(() => { toast.classList.remove('show'); }, 3000);
}

function openModal() { document.getElementById('publishModal').style.display = 'flex'; }
function closeModal() { document.getElementById('publishModal').style.display = 'none'; }
function closeEditModal() { document.getElementById('editModal').style.display = 'none'; }

function toggleHelpdesk() {
    const content = document.getElementById('helpdeskContent');
    const icon = document.getElementById('helpdeskIcon');
    if (content.style.display === 'none') {
        content.style.display = 'block';
        icon.innerText = "▲ Collapse";
    } else {
        content.style.display = 'none';
        icon.innerText = "▼ Expand";
    }
}

window.toggleReadMore = function(id) {
    const el = document.getElementById(`content-${id}`);
    const btn = el.nextElementSibling;
    if (el.classList.contains('truncate-text')) {
        el.classList.remove('truncate-text');
        btn.innerText = "Show Less";
    } else {
        el.classList.add('truncate-text');
        btn.innerText = "Read More...";
    }
}

// 🚀 THE ULTIMATE PDF FIX
window.handleFile = async function(url, action, filename) {
    try {
        showToast(`⏳ ${action === 'view' ? 'Opening' : 'Downloading'} file securely...`);
        const response = await fetch(url);
        let blob = await response.blob();

        const textCheck = await new Response(blob.slice(0, 5)).text();
        if (textCheck.startsWith('%PDF')) {
            blob = new Blob([blob], { type: 'application/pdf' });
        }

        const blobUrl = window.URL.createObjectURL(blob);

        if (action === 'view') {
            window.open(blobUrl, '_blank');
        } else {
            const a = document.createElement('a');
            a.href = blobUrl;
            a.download = filename.endsWith('.pdf') ? filename : filename + '.pdf';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        }
        setTimeout(() => window.URL.revokeObjectURL(blobUrl), 10000);
    } catch (e) {
        window.open(url, '_blank');
    }
}

function openEditModal(id) {
    const post = allPosts.find(p => p._id === id);
    if (!post) return;
    document.getElementById('editPostId').value = post._id;
    document.getElementById('editPostTitle').value = post.title;
    document.getElementById('editPostType').value = post.type;
    if (typeof editQuill !== 'undefined' && editQuill) editQuill.root.innerHTML = post.articleHtml || '';
    document.getElementById('editModal').style.display = 'flex';
}

let quill, editQuill;
if (document.getElementById('editor-container')) quill = new Quill('#editor-container', { theme: 'snow' });
if (document.getElementById('edit-editor-container')) editQuill = new Quill('#edit-editor-container', { theme: 'snow' });

const token = localStorage.getItem('token');
let allPosts = []; let currentUsername = "";
if (!token) window.location.href = '/index.html'; 
try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    currentUsername = payload.username;
    const isActuallyAdmin = (payload.isAdmin === true || payload.isAdmin === "true" || currentUsername === "MdZubair");
    if(!isActuallyAdmin) window.location.href = '/dashboard.html';
    document.getElementById('welcomeText').innerText = `Admin: ${currentUsername}`;
} catch (e) { window.location.href = '/index.html'; }

const viewSvg = `<svg class="svg-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path><circle cx="12" cy="12" r="3"></circle></svg>`;
const dlSvg = `<svg class="svg-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" x2="12" y1="15" y2="3"></line></svg>`;
const editSvg = `<svg class="svg-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"></path><path d="m15 5 4 4"></path></svg>`;
const trashSvg = `<svg class="svg-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path></svg>`;

function renderPosts(postsToRender) {
    const list = document.getElementById('postsList');
    if (!list) return;
    if (postsToRender.length === 0) {
        list.innerHTML = `<div style="text-align: center; color: #94a3b8; padding: 40px;"><h3>📭 Database is Empty</h3></div>`;
        return;
    }

    list.innerHTML = postsToRender.map(post => {
        let fileBtns = '';
        if (post.fileUrl) {
            let safeTitle = post.title.replace(/[^a-z0-9]/gi, '_').toLowerCase();
            fileBtns = `
                <button onclick="handleFile('${post.fileUrl}', 'view', '${safeTitle}')" class="btn-neutral">
                    ${viewSvg} View File
                </button>
                <button onclick="handleFile('${post.fileUrl}', 'download', '${safeTitle}')" class="btn-neutral">
                    ${dlSvg} Download File
                </button>
            `;
        }

        let articleBlock = '';
        if (post.articleHtml && post.articleHtml !== '<p><br></p>') {
            articleBlock = `
                <div class="article-content truncate-text" id="content-${post._id}">${post.articleHtml}</div>
                <button class="read-more-btn" onclick="toggleReadMore('${post._id}')">Read More...</button>
            `;
        }

        return `
            <div class="post-card" ${post.type === 'Official Notice' ? 'style="border-left-color: #d32f2f;"' : ''}>
                <h3>${post.title} <span class="badge">${post.type}</span></h3>
                <div class="meta-data">Contributed by <span class="contributor-name">${post.postedBy}</span> on ${new Date(post.createdAt).toLocaleDateString()}</div>
                ${articleBlock}
                <div class="btn-group">
                    ${fileBtns}
                    <button onclick="openEditModal('${post._id}')" class="btn-neutral">${editSvg} Admin Edit</button>
                    <button onclick="deleteResource('${post._id}')" class="btn-danger">${trashSvg} Admin Delete</button>
                </div>
            </div>
        `;
    }).join('');
}

async function loadFeed() {
    try {
        const response = await fetch('/api/books', { headers: { 'Authorization': `Bearer ${token}` } });
        allPosts = await response.json();
        renderPosts(allPosts);
    } catch (error) { showToast("⚠️ Error loading feed"); }
}

document.getElementById('uploadForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', document.getElementById('postTitle').value);
    formData.append('type', document.getElementById('postType').value);
    formData.append('articleHtml', quill ? quill.root.innerHTML : '');
    const fileInput = document.getElementById('mediaFile');
    if (fileInput.files.length > 0) formData.append('mediaFile', fileInput.files[0]);

    try {
        const response = await fetch('/api/books', { method: 'POST', headers: { 'Authorization': `Bearer ${token}` }, body: formData });
        const data = await response.json();
        if (response.ok) { 
            showToast("✅ Broadcasted!"); closeModal(); loadFeed(); e.target.reset(); if(quill) quill.setContents([]); 
        } else { showToast("❌ " + (data.error || "Broadcast failed")); }
    } catch (err) { showToast("⚠️ Network Error"); }
});

document.getElementById('editForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = document.getElementById('editPostId').value;
    const bodyObj = { title: document.getElementById('editPostTitle').value, type: document.getElementById('editPostType').value, articleHtml: editQuill ? editQuill.root.innerHTML : '' };
    try {
        const response = await fetch(`/api/books/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }, body: JSON.stringify(bodyObj) });
        const data = await response.json();
        if (response.ok) { showToast("✅ Updated!"); closeEditModal(); loadFeed(); }
        else showToast("❌ " + (data.error || "Update failed."));
    } catch (err) { showToast("⚠️ Network error"); }
});

async function deleteResource(id) {
    if (!confirm("ADMIN: Are you sure you want to permanently delete this?")) return;
    try {
        const response = await fetch(`/api/books/${id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` } });
        if (response.ok) { showToast("✅ Removed."); loadFeed(); }
        else showToast("❌ Deletion failed.");
    } catch (err) { showToast("⚠️ Network error"); }
}

async function resetUserPassword() {
    const targetUsername = document.getElementById('resetUsername').value.trim();
    const newPassword = document.getElementById('resetPassword').value.trim();
    if (!targetUsername || !newPassword) return showToast("⚠️ Fill both fields");

    if (!confirm(`Force-reset password for '${targetUsername}'?`)) return;
    try {
        const response = await fetch('/api/auth/admin-reset', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify({ targetUsername, newPassword })
        });
        const data = await response.json();
        if (response.ok) { showToast("✅ " + data.message); document.getElementById('resetUsername').value = ""; document.getElementById('resetPassword').value = ""; toggleHelpdesk(); }
        else showToast("❌ " + (data.error || "Reset failed."));
    } catch (err) { showToast("⚠️ Network Error"); }
}

loadFeed();