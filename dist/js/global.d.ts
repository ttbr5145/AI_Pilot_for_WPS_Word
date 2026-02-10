// 全局类型声明

declare const AI_CONFIG: {
    provider: string;
    chatanywhere: {
        apiKey: string;
        baseURL: string;
        model: string;
        temperature: number;
        maxTokens: number;
    };
};

declare const SYSTEM_PROMPTS: {
    default: string;
    writing: string;
    editing: string;
    translation: string;
    summarization: string;
};

declare function getAIConfig(): any;
declare function setAIProvider(providerName: string): boolean;
declare function saveAIConfig(provider: string, config: any): boolean;
declare function loadAIConfig(): void;
