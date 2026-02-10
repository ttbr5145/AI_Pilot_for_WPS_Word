// 素材库面板逻辑

// 全局变量
let materials = [];
let editingMaterialId = null;

// 获取素材库数据
async function getMaterials() {
    try {
        // 优先从localStorage读取（WPS调试模式下也能持久化）
        let materialsStr = localStorage.getItem('materials');

        // 如果localStorage没有，再尝试从PluginStorage读取
        if (!materialsStr && window.Application && window.Application.PluginStorage) {
            materialsStr = window.Application.PluginStorage.getItem('materials');
        }

        return materialsStr ? JSON.parse(materialsStr) : [];
    } catch (error) {
        console.error('获取素材库失败:', error);
        return [];
    }
}

// 保存素材到存储
async function saveMaterials(materialsData) {
    try {
        const materialsStr = JSON.stringify(materialsData);

        // 同时保存到localStorage和PluginStorage
        localStorage.setItem('materials', materialsStr);

        if (window.Application && window.Application.PluginStorage) {
            window.Application.PluginStorage.setItem('materials', materialsStr);
        }

        return true;
    } catch (error) {
        console.error('保存素材失败:', error);
        return false;
    }
}

// 显示素材列表
async function displayMaterials() {
    try {
        materials = await getMaterials();
        const container = document.getElementById('materialsList');
        
        if (!container) return;
        
        if (materials.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <p>暂无素材</p>
                    <p style="font-size: 12px; margin-top: 8px;">点击右上角 "+" 按钮添加素材</p>
                </div>
            `;
            return;
        }
        
        container.innerHTML = materials.map(material => `
            <div class="material-item" data-id="${material.id}">
                <div class="material-content">${escapeHtml(material.content)}</div>
                <div class="material-meta">
                    <span class="material-time">${material.createTime}</span>
                    <div class="material-actions">
                        <button class="action-btn edit-btn" onclick="editMaterial(${material.id})" title="编辑素材">编辑</button>
                        <button class="action-btn insert-btn" onclick="insertMaterial(${material.id})" title="插入到文档">插入</button>
                        <button class="action-btn copy-btn" onclick="copyMaterial(${material.id})" title="复制到剪贴板">复制</button>
                        <button class="action-btn delete-btn" onclick="deleteMaterialConfirm(${material.id})" title="删除素材">删除</button>
                    </div>
                </div>
            </div>
        `).join('');
    } catch (error) {
        console.error('显示素材失败:', error);
    }
}

// 显示添加素材对话框
function showAddDialog() {
    const dialog = document.getElementById('addDialog');
    const textarea = document.getElementById('materialInput');
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
async function addMaterial() {
    const textarea = document.getElementById('materialInput');
    const content = textarea.value.trim();

    if (!content) {
        alert('请输入素材内容');
        return;
    }

    try {
        const materials = await getMaterials();
        const newMaterial = {
            id: Date.now(),
            content: content,
            createTime: new Date().toLocaleString()
        };
        
        materials.unshift(newMaterial); // 添加到开头
        
        const success = await saveMaterials(materials);
        if (success) {
            closeAddDialog();
            displayMaterials();
        } else {
            alert('保存失败，请重试');
        }
    } catch (error) {
        console.error('添加素材失败:', error);
        alert('添加失败，请重试');
    }
}

// 编辑素材
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
async function saveEditMaterial() {
    const textarea = document.getElementById('editMaterialContent');
    const content = textarea.value.trim();

    if (!content) {
        alert('请输入素材内容');
        return;
    }

    if (editingMaterialId === null) return;

    try {
        const materials = await getMaterials();
        const materialIndex = materials.findIndex(m => m.id === editingMaterialId);
        
        if (materialIndex === -1) return;

        materials[materialIndex].content = content;
        materials[materialIndex].createTime = new Date().toLocaleString();

        const success = await saveMaterials(materials);
        if (success) {
            closeEditDialog();
            displayMaterials();
        } else {
            alert('保存失败，请重试');
        }
    } catch (error) {
        console.error('保存编辑失败:', error);
        alert('保存失败，请重试');
    }
}

// 删除素材确认
function deleteMaterialConfirm(id) {
    if (confirm('确定要删除这个素材吗？')) {
        deleteMaterial(id);
    }
}

// 删除素材
async function deleteMaterial(id) {
    try {
        const materials = await getMaterials();
        const filteredMaterials = materials.filter(material => material.id !== id);
        
        const success = await saveMaterials(filteredMaterials);
        if (success) {
            displayMaterials();
        } else {
            alert('删除失败，请重试');
        }
    } catch (error) {
        console.error('删除素材失败:', error);
        alert('删除失败，请重试');
    }
}

// 复制素材到剪贴板
async function copyMaterial(id) {
    try {
        const materials = await getMaterials();
        const material = materials.find(m => m.id == id);
        if (material) {
            await navigator.clipboard.writeText(material.content);
            // 可以添加复制成功的提示
        }
    } catch (error) {
        console.error('复制失败:', error);
        alert('复制失败');
    }
}

// 插入素材到文档
async function insertMaterial(id) {
    try {
        const materials = await getMaterials();
        const material = materials.find(m => m.id == id);
        
        if (material && window.Application && window.Application.ActiveDocument) {
            const doc = window.Application.ActiveDocument;
            const selection = window.Application.Selection;
            
            if (selection && selection.Range) {
                selection.Range.Text = material.content;
                selection.Collapse(1); // 1 = wdCollapseEnd
            } else {
                doc.Range(0, 0).Text = material.content;
            }
        }
    } catch (error) {
        console.error('插入文档失败:', error);
        alert('插入文档失败');
    }
}

// HTML转义函数
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    displayMaterials();
    
    // 添加回车键支持
    const addInput = document.getElementById('materialInput');
    if (addInput) {
        addInput.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' && e.ctrlKey) {
                addMaterial();
            }
        });
    }
    
    const editInput = document.getElementById('editMaterialContent');
    if (editInput) {
        editInput.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' && e.ctrlKey) {
                saveEditMaterial();
            }
        });
    }
});

