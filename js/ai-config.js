// AI配置文件

// ChatAnywhere API配置
// 不要把真实 API Key 提交到仓库：可直接在侧边栏“设置”里填写，或临时写入下方 apiKey 字段。
// Key 申请地址：https://chatanywhere.tech
const AI_CONFIG = {
    provider: 'chatanywhere',
    chatanywhere: {
        apiKey: '', // 在此填入自己的 ChatAnywhere API Key
        baseURL: 'https://api.chatanywhere.tech/v1',
        model: 'gpt-5.1-2025-11-13',
        temperature: 0.7,
        maxTokens: 2000
    }
};

// 可用模型列表
const AVAILABLE_MODELS = [
    { id: 'gpt-5-nano', name: 'GPT-5 Nano(200次/日)' },
    { id: 'gpt-5-mini', name: 'GPT-5 Mini(200次/日)' },
    { id: 'deepseek-r1-250528', name: 'DeepSeek R1 2025-05-28(30次/日)' },
    { id: 'gpt-5.1-2025-11-13', name: 'GPT-5.1 2025-11-13(5次/日)' },
    { id: 'claude-opus-4-5-20251101-thinking', name: 'Claude Opus 4.5(0次/日)' },
    { id: 'gemini-2.5-pro', name: 'Gemini 2.5 Pro(0次/日)' },
    { id: 'grok-4', name: 'Grok 4(0次/日)' },
    { id: 'qwen3-max-2026-01-23', name: 'Qwen3 Max 2026-01-23(0次/日)' },
    { id: 'kimi-k2.5', name: 'Kimi K2.5(0次/日)' }
];
// 系统提示词
const SYSTEM_PROMPTS = {
    default: '你是一个专业的文档写作助手，可以帮助用户撰写、修改、润色文档内容。请使用纯文本格式输出，不要使用Markdown格式（如加粗、斜体、代码块等），不要使用特殊符号。',

    writing: '你是一个专业的写作助手，擅长各类文档的撰写，包括报告、邮件、提案等。请使用纯文本格式输出，不要使用Markdown格式（如加粗、斜体、代码块等），不要使用特殊符号。',

    editing: '你是一个专业的编辑助手，可以帮助用户修改、润色、优化文档内容，使其更加清晰、流畅、专业。请使用纯文本格式输出，不要使用Markdown格式（如加粗、斜体、代码块等），不要使用特殊符号。',

    translation: '你是一个专业的翻译助手，可以进行中英文互译，确保翻译准确、自然、符合语境。请使用纯文本格式输出，不要使用Markdown格式（如加粗、斜体、代码块等），不要使用特殊符号。',

    summarization: '你是一个专业的文档摘要助手，可以准确概括文档的核心内容和要点。请使用纯文本格式输出，不要使用Markdown格式（如加粗、斜体、代码块等），不要使用特殊符号。'
};

// 获取当前配置
function getAIConfig() {
    const provider = AI_CONFIG.provider;
    return AI_CONFIG[provider];
}

// 设置API提供商
function setAIProvider(providerName) {
    if (AI_CONFIG[providerName]) {
        AI_CONFIG.provider = providerName;
        // 保存到存储
        if (window.Application && window.Application.PluginStorage) {
            window.Application.PluginStorage.setItem('ai_provider', providerName);
        } else {
            localStorage.setItem('ai_provider', providerName);
        }
        return true;
    }
    return false;
}

// 保存API配置
function saveAIConfig(provider, config) {
    if (AI_CONFIG[provider]) {
        Object.assign(AI_CONFIG[provider], config);
        // 保存到存储
        if (window.Application && window.Application.PluginStorage) {
            window.Application.PluginStorage.setItem('ai_config', JSON.stringify(AI_CONFIG));
        } else {
            localStorage.setItem('ai_config', JSON.stringify(AI_CONFIG));
        }
        return true;
    }
    return false;
}

// 从存储加载配置
function loadAIConfig() {
    try {
        let storedConfig;
        if (window.Application && window.Application.PluginStorage) {
            storedConfig = window.Application.PluginStorage.getItem('ai_config');
        } else {
            storedConfig = localStorage.getItem('ai_config');
        }

        if (storedConfig) {
            const config = JSON.parse(storedConfig);
            Object.assign(AI_CONFIG, config);
        }

        // 加载提供商设置
        let provider;
        if (window.Application && window.Application.PluginStorage) {
            provider = window.Application.PluginStorage.getItem('ai_provider');
        } else {
            provider = localStorage.getItem('ai_provider');
        }

        if (provider && AI_CONFIG[provider]) {
            AI_CONFIG.provider = provider;
        }
    } catch (error) {
        console.error('加载AI配置失败:', error);
    }
}

// 页面加载时自动加载配置
document.addEventListener('DOMContentLoaded', loadAIConfig);
