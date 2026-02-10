#!/bin/bash

# AI Pilot for WPS Word 发布脚本
# 用法: ./publish.sh [版本号]

set -e  # 遇到错误立即退出

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 默认版本号
DEFAULT_VERSION="1.0.0"

# 获取版本号参数
VERSION=${1:-$DEFAULT_VERSION}

echo -e "${BLUE}🚀 开始发布 AI Pilot for WPS Word v${VERSION}${NC}"
echo "========================================"

# 1. 代码质量检查
echo -e "${YELLOW}🔍 执行代码质量检查...${NC}"
npm run lint || {
    echo -e "${RED}❌ 代码检查失败，请修复后再发布${NC}"
    exit 1
}

# 2. 清理旧构建
echo -e "${YELLOW}🧹 清理旧构建文件...${NC}"
rm -rf dist/
echo -e "${GREEN}✅ 清理完成${NC}"

# 3. 构建生产版本
echo -e "${YELLOW}🏗️  构建生产版本...${NC}"
npm run build

# 检查构建是否成功
if [ ! -d "dist" ]; then
    echo -e "${RED}❌ 构建失败，dist目录不存在${NC}"
    exit 1
fi

echo -e "${GREEN}✅ 构建成功${NC}"

# 4. 验证关键文件
echo -e "${YELLOW}📋 验证关键文件...${NC}"
REQUIRED_FILES=(
    "dist/manifest.xml"
    "dist/ribbon.xml"
    "dist/main.js"
    "dist/index.html"
    "dist/js/aipane.js"
    "dist/js/ai-config.js"
    "dist/ui/aipane.html"
    "dist/ui/materialpane.html"
)

MISSING_FILES=()
for file in "${REQUIRED_FILES[@]}"; do
    if [ ! -f "$file" ]; then
        MISSING_FILES+=("$file")
    fi
done

if [ ${#MISSING_FILES[@]} -gt 0 ]; then
    echo -e "${RED}❌ 缺少以下必需文件:${NC}"
    for file in "${MISSING_FILES[@]}"; do
        echo "  - $file"
    done
    exit 1
fi

echo -e "${GREEN}✅ 所有必需文件存在${NC}"

# 5. 创建发布包
echo -e "${YELLOW}📦 创建发布包...${NC}"
PACKAGE_NAME="ai-pilot-wps-addon-v${VERSION}.zip"
cd dist/
zip -r "../${PACKAGE_NAME}" ./*
cd ..

echo -e "${GREEN}✅ 发布包创建成功: ${PACKAGE_NAME}${NC}"

# 6. 显示包信息
echo ""
echo -e "${BLUE}📋 发布包信息:${NC}"
echo "文件名: ${PACKAGE_NAME}"
echo "文件大小: $(du -h "${PACKAGE_NAME}" | cut -f1)"
echo "文件数量: $(unzip -l "${PACKAGE_NAME}" | wc -l) 个文件"

# 7. 验证包内容
echo ""
echo -e "${YELLOW}🔍 验证包内容...${NC}"
unzip -l "${PACKAGE_NAME}" | head -20

echo ""
echo -e "${GREEN}🎉 发布准备完成！${NC}"
echo ""
echo -e "${BLUE}下一步操作:${NC}"
echo "1. 测试加载项功能"
echo "2. 准备发布文档"
echo "3. 上传到发布渠道"
echo ""
echo -e "${YELLOW}💡 提示: 可以使用以下命令进行快速测试:${NC}"
echo "   npm run dev  # 启动开发服务器"
echo ""