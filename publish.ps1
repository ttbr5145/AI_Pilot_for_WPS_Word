# AI Pilot for WPS Word 发布脚本 (PowerShell版本)
# 用法: .\publish.ps1 [-Version "1.0.0"]

param(
    [string]$Version = "1.0.0"
)

# 颜色定义函数
function Write-ColorOutput {
    param(
        [string]$Message,
        [string]$Color = "White"
    )
    Write-Host $Message -ForegroundColor $Color
}

# 启用错误终止
$ErrorActionPreference = "Stop"

Write-ColorOutput "🚀 开始发布 AI Pilot for WPS Word v$Version" "Blue"
Write-ColorOutput "========================================" "Blue"

try {
    # 1. 代码质量检查
    Write-ColorOutput "🔍 执行代码质量检查..." "Yellow"
    npm run lint
    if ($LASTEXITCODE -ne 0) {
        Write-ColorOutput "❌ 代码检查失败，请修复后再发布" "Red"
        exit 1
    }
    Write-ColorOutput "✅ 代码检查通过" "Green"

    # 2. 清理旧构建
    Write-ColorOutput "🧹 清理旧构建文件..." "Yellow"
    if (Test-Path "dist") {
        Remove-Item -Recurse -Force "dist"
    }
    Write-ColorOutput "✅ 清理完成" "Green"

    # 3. 构建生产版本
    Write-ColorOutput "🏗️  构建生产版本..." "Yellow"
    npm run build
    
    # 检查构建是否成功
    if (-not (Test-Path "dist")) {
        Write-ColorOutput "❌ 构建失败，dist目录不存在" "Red"
        exit 1
    }
    Write-ColorOutput "✅ 构建成功" "Green"

    # 4. 验证关键文件
    Write-ColorOutput "📋 验证关键文件..." "Yellow"
    $RequiredFiles = @(
        "dist\manifest.xml",
        "dist\ribbon.xml",
        "dist\main.js",
        "dist\index.html",
        "dist\js\aipane.js",
        "dist\js\ai-config.js",
        "dist\ui\aipane.html",
        "dist\ui\materialpane.html"
    )

    $MissingFiles = @()
    foreach ($file in $RequiredFiles) {
        if (-not (Test-Path $file)) {
            $MissingFiles += $file
        }
    }

    if ($MissingFiles.Count -gt 0) {
        Write-ColorOutput "❌ 缺少以下必需文件:" "Red"
        foreach ($file in $MissingFiles) {
            Write-ColorOutput "  - $file" "Red"
        }
        exit 1
    }
    Write-ColorOutput "✅ 所有必需文件存在" "Green"

    # 5. 创建发布包
    Write-ColorOutput "📦 创建发布包..." "Yellow"
    $PackageName = "ai-pilot-wps-addon-v$Version.zip"
    
    # 使用PowerShell的压缩功能
    Compress-Archive -Path "dist\*" -DestinationPath $PackageName -Force
    
    Write-ColorOutput "✅ 发布包创建成功: $PackageName" "Green"

    # 6. 显示包信息
    Write-ColorOutput "" "White"
    Write-ColorOutput "📋 发布包信息:" "Blue"
    $PackageInfo = Get-Item $PackageName
    Write-ColorOutput "文件名: $PackageName" "White"
    Write-ColorOutput "文件大小: $($PackageInfo.Length / 1KB) KB" "White"
    
    # 统计文件数量
    $FileCount = (Get-ChildItem -Recurse "dist" | Measure-Object).Count
    Write-ColorOutput "文件数量: $FileCount 个文件" "White"

    # 7. 验证包内容
    Write-ColorOutput "" "White"
    Write-ColorOutput "🔍 验证包内容..." "Yellow"
    Expand-Archive -Path $PackageName -DestinationPath "temp_extract" -Force
    Get-ChildItem -Recurse "temp_extract" | Select-Object FullName | Select-Object -First 10
    Remove-Item -Recurse -Force "temp_extract"

    Write-ColorOutput "" "White"
    Write-ColorOutput "🎉 发布准备完成！" "Green"
    Write-ColorOutput "" "White"
    Write-ColorOutput "下一步操作:" "Blue"
    Write-ColorOutput "1. 测试加载项功能" "White"
    Write-ColorOutput "2. 准备发布文档" "White"
    Write-ColorOutput "3. 上传到发布渠道" "White"
    Write-ColorOutput "" "White"
    Write-ColorOutput "💡 提示: 可以使用以下命令进行快速测试:" "Yellow"
    Write-ColorOutput "   npm run dev  # 启动开发服务器" "White"
    Write-ColorOutput "" "White"

} catch {
    Write-ColorOutput "❌ 发布过程中出现错误: $($_.Exception.Message)" "Red"
    exit 1
}