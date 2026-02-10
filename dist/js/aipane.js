// AI对话侧边栏逻辑

// 等待配置加载完成
if (typeof AI_CONFIG === 'undefined') {
    console.error('AI配置未加载，请确保ai-config.js在aipane.js之前加载');
}

// 消息历史
let chatHistory = [];

// 当前系统提示词
let currentSystemPrompt = typeof SYSTEM_PROMPTS !== 'undefined' ? SYSTEM_PROMPTS.default : '你是一个专业的文档写作助手，可以帮助用户撰写、修改、润色文档内容。';

// 调用AI API
async function callAI(messages) {
    const config = getAIConfig();

    if (!config.apiKey) {
        throw new Error('请先配置API Key，请点击右上角设置按钮进行配置');
    }

    // ChatAnywhere API (兼容OpenAI格式)
    const url = `${config.baseURL}/chat/completions`;
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${config.apiKey}`
    };

    // 构建消息数组（包含系统提示词）
    const apiMessages = [
        { role: 'system', content: currentSystemPrompt },
        ...messages
    ];

    const body = {
        model: config.model,
        messages: apiMessages,
        temperature: config.temperature || 0.7,
        max_tokens: config.maxTokens || 2000
    };

    const response = await fetch(url, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(body)
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error?.message || `API调用失败: ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
}

// 发送消息
async function sendMessage() {
    const userInput = document.getElementById('userInput');
    const message = userInput.value.trim();

    if (!message) return;

    // 添加用户消息到界面
    addMessageToUI('user', message);

    // 保存到历史
    chatHistory.push({
        role: 'user',
        content: message
    });

    // 清空输入框
    userInput.value = '';

    // 禁用发送按钮
    const sendBtn = document.getElementById('sendBtn');
    sendBtn.disabled = true;
    sendBtn.textContent = '思考中...';

    // 调用真实AI API
    try {
        const aiResponse = await callAI(chatHistory);
        addMessageToUI('ai', aiResponse);

        chatHistory.push({
            role: 'assistant',
            content: aiResponse
        });
    } catch (error) {
        addMessageToUI('ai', `错误: ${error.message}`);
        console.error('AI调用失败:', error);
    }

    // 恢复发送按钮
    sendBtn.disabled = false;
    sendBtn.textContent = '发送';
}

// 添加消息到UI
function addMessageToUI(type, content) {
    const chatContainer = document.getElementById('chatContainer');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}-message`;

    const contentDiv = document.createElement('div');
    contentDiv.className = 'message-content';
    contentDiv.textContent = content;

    // 为AI消息添加操作按钮
    if (type === 'ai') {
        const actionsDiv = document.createElement('div');
        actionsDiv.className = 'message-actions';

        const saveBtn = document.createElement('button');
        saveBtn.className = 'message-action-btn';
        saveBtn.textContent = '保存到素材库';
        saveBtn.onclick = () => saveToMaterials(content);

        const insertBtn = document.createElement('button');
        insertBtn.className = 'message-action-btn';
        insertBtn.textContent = '插入文档';
        insertBtn.onclick = () => insertToDocument(content);

        actionsDiv.appendChild(saveBtn);
        actionsDiv.appendChild(insertBtn);
        messageDiv.appendChild(contentDiv);
        messageDiv.appendChild(actionsDiv);
    } else {
        messageDiv.appendChild(contentDiv);
    }

    chatContainer.appendChild(messageDiv);

    // 滚动到底部
    chatContainer.scrollTop = chatContainer.scrollHeight;
}

// 清空对话历史
function clearChat() {
    chatHistory = [];
    const chatContainer = document.getElementById('chatContainer');
    chatContainer.innerHTML = `
        <div class="system-message">
            对话已清空，有什么可以帮助你的？
        </div>
    `;
}

// 保存AI回复到素材库
async function saveToMaterials(content) {
    try {
        const materials = await getMaterials();
        const newMaterial = {
            id: Date.now(),
            content: content,
            createTime: new Date().toLocaleString(),
            source: 'AI对话'
        };
        materials.unshift(newMaterial);

        if (window.Application && window.Application.PluginStorage) {
            window.Application.PluginStorage.setItem('materials', JSON.stringify(materials));
        } else {
            localStorage.setItem('materials', JSON.stringify(materials));
        }

        alert('已保存到素材库！');
    } catch (error) {
        console.error('保存到素材库失败:', error);
        alert('保存失败，请重试');
    }
}

// 插入内容到文档
function insertToDocument(content) {
    if (window.Application && window.Application.ActiveDocument) {
        try {
            const doc = window.Application.ActiveDocument;
            const selection = window.Application.Selection;

            if (selection && selection.Range) {
                selection.Range.Text = content;
                selection.Collapse(1); // 1 = wdCollapseEnd
                alert('已插入文档！');
            } else {
                doc.Range(0, 0).Text = content;
                alert('已插入文档开头！');
            }
        } catch (error) {
            console.error('插入文档失败:', error);
            alert('插入文档失败，请确保已打开文档');
        }
    } else {
        alert('请先打开一个WPS文档');
    }
}

// 显示设置对话框
function showSettings() {
    const existingDialog = document.getElementById('settingsDialog');
    if (existingDialog) {
        existingDialog.style.display = 'flex';
        return;
    }

    const config = getAIConfig();
    const dialog = document.createElement('div');
    dialog.id = 'settingsDialog';
    dialog.className = 'modal';

    // 生成模型选项HTML
    let modelOptions = '';
    if (typeof AVAILABLE_MODELS !== 'undefined') {
        modelOptions = AVAILABLE_MODELS.map(model =>
            `<option value="${model.id}" ${config.model === model.id ? 'selected' : ''}>${model.name}</option>`
        ).join('');
    }

    // 确定当前提示词类型
    let currentPromptType = 'default';
    for (const key of Object.keys(SYSTEM_PROMPTS)) {
        if (SYSTEM_PROMPTS[key] === currentSystemPrompt) {
            currentPromptType = key;
            break;
        }
    }

    dialog.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>AI配置</h3>
                <button class="close-btn" onclick="closeSettings()">&times;</button>
            </div>
            <div class="modal-body">
                <div class="form-group">
                    <label>API Key</label>
                    <input type="password" id="apiKeyInput" value="${config.apiKey || ''}" placeholder="ChatAnywhere API Key">
                </div>
                <div class="form-group">
                    <label>模型</label>
                    <select id="modelSelect">
                        ${modelOptions}
                    </select>
                </div>
                <div class="form-group">
                    <label>系统提示词</label>
                    <select id="promptSelect" onchange="onPromptSelectChange()">
                        <option value="default">默认助手</option>
                        <option value="writing">写作助手</option>
                        <option value="editing">编辑助手</option>
                        <option value="translation">翻译助手</option>
                        <option value="summarization">摘要助手</option>
                        <option value="custom">自定义助手</option>
                    </select>
                </div>
                <div class="form-group" id="customPromptGroup" style="display: ${currentPromptType === 'custom' ? 'block' : 'none'}">
                    <label>自定义提示词</label>
                    <textarea id="customPromptInput" placeholder="输入自定义系统提示词">${currentPromptType === 'custom' ? currentSystemPrompt : ''}</textarea>
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn-secondary" onclick="closeSettings()">取消</button>
                <button class="btn-primary" onclick="saveSettings()">保存</button>
            </div>
        </div>
    `;
    document.body.appendChild(dialog);
}

// 关闭设置对话框
function closeSettings() {
    const dialog = document.getElementById('settingsDialog');
    if (dialog) {
        dialog.remove();
    }
}

// 系统提示词选择变化处理
function onPromptSelectChange() {
    const promptSelect = document.getElementById('promptSelect');
    const customPromptGroup = document.getElementById('customPromptGroup');
    const customPromptInput = document.getElementById('customPromptInput');
    
    const selectedValue = promptSelect.value;
    
    // 当选择"自定义助手"时显示自定义提示词输入框
    if (selectedValue === 'custom') {
        customPromptGroup.style.display = 'block';
        // 如果是第一次选择自定义，给一个默认提示
        if (!customPromptInput.value) {
            customPromptInput.placeholder = '请输入自定义的系统提示词，例如：你是一个专业的法律文书助手...';
        }
    } else {
        // 隐藏自定义提示词输入框
        customPromptGroup.style.display = 'none';
        // 如果选择了预设提示词，自动填充对应的提示词内容
        if (SYSTEM_PROMPTS[selectedValue]) {
            currentSystemPrompt = SYSTEM_PROMPTS[selectedValue];
        }
    }
}

// 更新系统提示词
function updateSystemPrompt() {
    const promptType = document.getElementById('promptSelect').value;
    const customPromptInput = document.getElementById('customPromptInput');

    if (SYSTEM_PROMPTS[promptType]) {
        customPromptInput.value = SYSTEM_PROMPTS[promptType];
    }
}

// 保存设置
function saveSettings() {
    const apiKey = document.getElementById('apiKeyInput').value.trim();
    const model = document.getElementById('modelSelect').value.trim();
    const customPrompt = document.getElementById('customPromptInput').value.trim();

    if (!apiKey) {
        alert('请输入API Key');
        return;
    }

    const config = {
        apiKey: apiKey,
        model: model
    };

    // 保存配置
    saveAIConfig('chatanywhere', config);

    // 保存自定义提示词
    if (customPrompt !== SYSTEM_PROMPTS.default) {
        currentSystemPrompt = customPrompt;
    }

    alert('配置已保存！');
    closeSettings();
}

// 监听回车键发送
document.addEventListener('DOMContentLoaded', function() {
    const userInput = document.getElementById('userInput');
    if (userInput) {
        userInput.addEventListener('keydown', function(e) {
            // Shift+Enter 换行，Enter 发送消息
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
            }
        });
    }
});

// 获取素材库数据（用于后续版本中从AI对话保存素材）
function getMaterials() {
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
            console.error('获取素材库失败:', error);
            reject(error);
        }
    });
}

// 保存素材到素材库（用于后续版本中从AI对话保存素材）
function saveMaterial(content) {
    return new Promise(async (resolve, reject) => {
        try {
            const materials = await getMaterials();
            const newMaterial = {
                id: Date.now(),
                content: content,
                createTime: new Date().toLocaleString()
            };
            materials.push(newMaterial);

            const materialsStr = JSON.stringify(materials);

            // 同时保存到localStorage和PluginStorage
            localStorage.setItem('materials', materialsStr);

            if (window.Application && window.Application.PluginStorage) {
                window.Application.PluginStorage.setItem('materials', materialsStr);
            }

            resolve(newMaterial);
        } catch (error) {
            console.error('保存素材失败:', error);
            reject(error);
        }
    });
}
