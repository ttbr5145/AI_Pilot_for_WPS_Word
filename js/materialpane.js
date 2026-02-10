// 素材库侧边栏逻辑

let materials = [];

// 初始化加载素材
function initMaterials() {
    loadMaterials().then(data => {
        materials = data;
        renderMaterials();
    }).catch(error => {
        console.error('加载素材失败:', error);
        materials = [];
        renderMaterials();
    });
}

// 从存储加载素材
function loadMaterials() {
    return new Promise((resolve, reject) => {
        try {
            // 优先从localStorage读取（WPS调试模式下也能持久化）
            let materialsStr = localStorage.getItem('materials');

            // 如果localStorage没有，再尝试从PluginStorage读取
            if (!materialsStr && window.Application && window.Application.PluginStorage) {
                materialsStr = window.Application.PluginStorage.getItem('materials');
            }

            resolve(materialsStr ? JSON.parse(materialsStr) : []);
        } catch (error) {
            console.error('加载素材失败:', error);
            reject(error);
        }
    });
}

// 保存素材到存储
function saveMaterialsToStorage() {
    return new Promise((resolve, reject) => {
        try {
            const materialsStr = JSON.stringify(materials);

            // 同时保存到localStorage和PluginStorage，确保在任何环境下都能持久化
            localStorage.setItem('materials', materialsStr);

            if (window.Application && window.Application.PluginStorage) {
                window.Application.PluginStorage.setItem('materials', materialsStr);
            }

            console.log('素材已保存:', materials.length, '条');
            resolve();
        } catch (error) {
            console.error('保存素材失败:', error);
            reject(error);
        }
    });
}

// 渲染素材列表
function renderMaterials() {
    const container = document.getElementById('materialsContainer');
    if (!container) return;

    if (materials.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <p>暂无素材</p>
            </div>
        `;
        return;
    }

    container.innerHTML = '';
    materials.forEach(material => {
        const materialDiv = document.createElement('div');
        materialDiv.className = 'material-item';
        materialDiv.innerHTML = `
            <div class="material-content">${escapeHtml(material.content)}</div>
            <div class="material-footer">
                <span class="material-time">${material.createTime}</span>
                <div class="material-actions">
                    <button class="action-btn btn-edit" onclick="editMaterial(${material.id})">编辑</button>
                    <button class="action-btn btn-insert" onclick="insertMaterial(${material.id})">插入文档</button>
                    <button class="action-btn btn-copy" onclick="copyMaterial(${material.id})">复制</button>
                    <button class="action-btn btn-delete" onclick="deleteMaterial(${material.id})">删除</button>
                </div>
            </div>
        `;
        container.appendChild(materialDiv);
    });
}

// 显示添加素材对话框
function showAddDialog() {
    const dialog = document.getElementById('addDialog');
    const textarea = document.getElementById('materialContent');
    if (dialog && textarea) {
        textarea.value = '';
        dialog.style.display = 'flex';
        textarea.focus();
    }
}

// 关闭添加素材对话框
function closeAddDialog() {
    const dialog = document.getElementById('addDialog');
    if (dialog) {
        dialog.style.display = 'none';
    }
}

// 添加素材
function addMaterial() {
    const textarea = document.getElementById('materialInput');
    const content = textarea.value.trim();

    if (!content) return;

    const newMaterial = {
        id: Date.now(),
        content: content,
        createTime: new Date().toLocaleString()
    };

    materials.unshift(newMaterial);

    saveMaterialsToStorage().then(() => {
        renderMaterials();
        textarea.value = '';
    }).catch(error => {
        console.error('保存素材失败:', error);
    });
}

// 编辑素材
let editingMaterialId = null;

function editMaterial(id) {
    const material = materials.find(m => m.id === id);
    if (!material) return;

    editingMaterialId = id;
    const dialog = document.getElementById('editDialog');
    const textarea = document.getElementById('editMaterialContent');
    if (dialog && textarea) {
        textarea.value = material.content;
        dialog.style.display = 'flex';
        textarea.focus();
    }
}

// 关闭编辑对话框
function closeEditDialog() {
    const dialog = document.getElementById('editDialog');
    if (dialog) {
        dialog.style.display = 'none';
        editingMaterialId = null;
    }
}

// 保存编辑
function saveEditMaterial() {
    const textarea = document.getElementById('editMaterialContent');
    const content = textarea.value.trim();

    if (!content) return;

    const materialIndex = materials.findIndex(m => m.id === editingMaterialId);
    if (materialIndex === -1) return;

    materials[materialIndex].content = content;
    materials[materialIndex].createTime = new Date().toLocaleString();

    saveMaterialsToStorage().then(() => {
        renderMaterials();
        closeEditDialog();
    }).catch(error => {
        console.error('保存编辑失败:', error);
    });
}

// 删除素材
function deleteMaterial(id) {
    materials = materials.filter(m => m.id !== id);
    saveMaterialsToStorage().then(() => {
        renderMaterials();
    }).catch(error => {
        console.error('删除素材失败:', error);
    });
}

// 复制素材
function copyMaterial(id) {
    const material = materials.find(m => m.id === id);
    if (!material) return;

    navigator.clipboard.writeText(material.content).catch(err => {
        console.error('复制失败:', err);
    });
}

// 插入素材到文档
function insertMaterial(id) {
    const material = materials.find(m => m.id === id);
    if (!material) return;

    if (window.Application && window.Application.ActiveDocument) {
        try {
            const doc = window.Application.ActiveDocument;
            const selection = window.Application.Selection;

            if (selection && selection.Range) {
                selection.Range.Text = material.content;
                selection.Collapse(1);
            } else {
                doc.Range(0, 0).Text = material.content;
            }
        } catch (error) {
            console.error('插入文档失败:', error);
        }
    }
}

// 清空所有素材
function clearAllMaterials() {
    materials = [];
    saveMaterialsToStorage().then(() => {
        renderMaterials();
    }).catch(error => {
        console.error('清空素材失败:', error);
    });
}

// HTML转义函数
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    initMaterials();
});
