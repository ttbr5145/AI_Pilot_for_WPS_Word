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
            // AI对话功能 - 使用聊天对话图标（chat_v2.svg）
            // 图标含义：对话交流、AI聊天，完美匹配AI对话功能
            return "images/chat_v2.svg"
        case "btnShowMaterialPane":
            // 素材库功能 - 使用创意灯泡图标（idea.svg）
            // 图标含义：创意灵感、素材收集，完美匹配素材库功能
            return "images/idea.svg"
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

