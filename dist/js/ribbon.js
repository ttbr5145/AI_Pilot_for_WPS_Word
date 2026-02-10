//这个函数在整个wps加载项中是第一个执行的
function OnAddinLoad(ribbonUI){
    if (typeof (window.Application.ribbonUI) != "object"){
		window.Application.ribbonUI = ribbonUI
    }

    if (typeof (window.Application.Enum) != "object") { // 如果没有内置枚举值
        window.Application.Enum = WPS_Enum
    }

    // 初始化侧边栏状态
    window.Application.PluginStorage.setItem("AIPaneFlag", false)
    window.Application.PluginStorage.setItem("MaterialPaneFlag", false)
    return true
}

function OnAction(control) {
    const eleId = control.Id
    switch (eleId) {
        case "btnShowAIPane":
            {
                let tsId = window.Application.PluginStorage.getItem("aipane_id")
                if (!tsId) {
                    let tskpane = window.Application.CreateTaskPane(GetUrlPath() + "/ui/aipane.html")
                    let id = tskpane.ID
                    window.Application.PluginStorage.setItem("aipane_id", id)
                    tskpane.Visible = true
                    window.Application.PluginStorage.setItem("AIPaneFlag", true)
                } else {
                    let tskpane = window.Application.GetTaskPane(tsId)
                    tskpane.Visible = !tskpane.Visible
                    window.Application.PluginStorage.setItem("AIPaneFlag", tskpane.Visible)
                }
                break
            }
        case "btnShowMaterialPane":
            {
                let tsId = window.Application.PluginStorage.getItem("materialpane_id")
                if (!tsId) {
                    let tskpane = window.Application.CreateTaskPane(GetUrlPath() + "/ui/materialpane.html")
                    let id = tskpane.ID
                    window.Application.PluginStorage.setItem("materialpane_id", id)
                    tskpane.Visible = true
                    window.Application.PluginStorage.setItem("MaterialPaneFlag", true)
                } else {
                    let tskpane = window.Application.GetTaskPane(tsId)
                    tskpane.Visible = !tskpane.Visible
                    window.Application.PluginStorage.setItem("MaterialPaneFlag", tskpane.Visible)
                }
                break
            }
        default:
            break
    }
    return true
}


function GetImage(control) {
    const eleId = control.Id
    switch (eleId) {
        case "btnShowAIPane":
            // AI助手功能 - 使用编辑文字图标（1.svg）
            // 图标含义：AI全文润色、智能编辑，体现AI助手的核心能力
            return "images/1.svg"
        case "btnShowMaterialPane":
            // 写作模式功能 - 使用艺术字大小图标（2.svg）
            // 图标含义：文字处理、写作辅助，体现素材库的写作支持功能
            return "images/2.svg"
        default:
            // 默认图标 - 新建模板图标
            return "images/newFromTemp.svg"
    }
}


function OnGetEnabled(control) {
    return true
}


function OnGetVisible(control){
    return true
}

