// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: purple; icon-glyph: magic;
// 1. 取得使用者輸入的航班參數（若無則預設為 CX 840）
// 提示：輸入時建議與 API 格式一致
let flightNumber = args.widgetParameter || ''

// 2. 從網路 API 抓取航班資料（請替換為你實際的 API 網址）
let url = 'https://esp-32--ICTWLW.replit.app/flight.php?flight='+flightNumber
let widgetData = null

if (flightNumber.toUpperCase() != 'OFF'){
  try {
    let req = new Request(url)
    let res = await req.loadJSON()
    console.log(res)
    
    if (res && res.success && res.data) {
      let raw = res.data
      let isDep = res.info === "departure"
      
      // 聯名航班代碼處理
      let codeShareStr = (raw.flight_no.length > 1 ? raw.flight_no[1] : "")+'  '+((raw.code_share && raw.code_share.length > 0) ? raw.code_share.join("  ") : "")
      let termText = raw.terminal || "T1"
      let statusText = (raw.status && raw.status.trim() !== "") ? raw.status : ""
      
      // 右側三行看板數據
      let infoLine1 = isDep ? `旅客登記行段：${raw.checkin || "-"}` : `泊機位：${raw.stand || "-"}`
      let infoLine2 = isDep ? `登機閘口：${raw.gate || "-"}` : `行李帶：${raw.belt || "-"} ｜ 接機大堂：${raw.hall || "-"}`
  
      widgetData = {
        isDep: isDep,
        flight: raw.flight_no[0],
        codeShare: codeShareStr,
        terminal: termText,
        fromText: isDep ? "Hong Kong to" : "Hong Kong from",
        cityText: isDep ? (raw.dest_1 || "UNKNOWN") : (raw.orig_1 || "UNKNOWN"),
        time: raw.time,
        info1: infoLine1,
        info2: infoLine2,
        status: statusText
      }
    } else {
      if (res.message){
        widgetData = {
          isDep: false,
          flight: flightNumber.slice(0,2)+" "+flightNumber.slice(2),
          codeShare: "",
          terminal: "T1",
          fromText: "Error",
          cityText: "",
          time: "",
          info1: res.message,
          info2: "",
          status: "連線失敗"
        }
      } else {
        throw new Error("Fetch Unsuccessful")
      }
    }
  } catch (e) {
    console.error(e)
    widgetData = {
      isDep: true,
      flight: flightNumber.slice(0,2)+" "+flightNumber.slice(2),
      codeShare: "",
      terminal: "T1",
      fromText: "Error",
      cityText: "",
      time: "",
      info1: "請檢查網路連線",
      info2: "或 API 網址是否正確",
      status: "連線失敗"
    }
  }
} else {
  console.log("OFF")
  widgetData = {
    isDep: true,
    flight: "CX 8100",
    codeShare: " ",
    terminal: "T2",
    fromText: "Hong Kong to",
    cityText: "Kai Tak",
    time: "15:00",
    info1: "旅客登記行段：B, C",
    info2: "登機閘口：28",
    status: "啟航 15:03"
  }
}
  
// 3. 建立 Widget 實例與邊距
let w = new ListWidget()
w.setPadding(12, 14, 12, 14)

// 4. 🌟 現代明亮雙色調漸層設定（方案一：黃色 DEP / 藍色 ARR）
let gradient = new LinearGradient()
if (widgetData.isDep) {
  // 出發 (DEP)：溫柔明亮的淡黃色至奶油白漸層
  gradient.colors = [new Color("#ebfbee"), new Color("#d3f9d8")] // 綠色 DEP
} else {
  // 抵達 (ARR)：清透冰涼的冰川藍至冷白漸層
  gradient.colors = [new Color("#e7f5ff"), new Color("#d0ebff")]
}
gradient.locations = [0,0.5,1]
w.backgroundGradient = gradient

// --- 佈局開始 ---

// 【第一層：頁首頂部資訊】
let topStack = w.addStack()
topStack.topAlignContent() // 釘在最頂端

// 左上角：航班號與灰色共用班號
let flightStack = topStack.addStack()
flightStack.layoutVertically()

let flightTextElement = flightStack.addText(widgetData.flight)
flightTextElement.font = Font.boldSystemFont(17)
flightTextElement.textColor = new Color("#1a1a1a") // 深碳灰確保明亮背景高可讀性

if (widgetData.codeShare !== "") {
  let shareTextElement = flightStack.addText(widgetData.codeShare)
  shareTextElement.font = Font.systemFont(10)
  shareTextElement.textColor = new Color("#707070")
}

topStack.addSpacer()

// 右上角：機場航廈與類型標籤 (T1 藍色 / T2 橘色)
let tagStack = topStack.addStack()
let isT2 = widgetData.terminal.toUpperCase().includes("T2")
let termBgColor = isT2 ? "#ff9500" : "#007aff"

tagStack.backgroundColor = new Color(termBgColor)
tagStack.cornerRadius = 5
tagStack.setPadding(3, 8, 3, 8)

let tagText = tagStack.addText(`${widgetData.terminal} ${widgetData.isDep ? "離港" : "抵港"}`)
tagText.font = Font.boldSystemFont(11)
tagText.textColor = Color.white()

w.addSpacer(3)

// 【第二層：主內容區改用橫向行結構，確保右側極致貼邊】
let mainContainer = w.addStack()
mainContainer.layoutVertically()

// ─── 第一行：Hong Kong to ＆ Gate/Belt ───
let row1 = mainContainer.addStack()
row1.centerAlignContent()

let timeElement = row1.addText(widgetData.time)
timeElement.font = Font.boldSystemFont(14)
timeElement.textColor = new Color("#505050")

row1.setPadding(0,0,3,0)
row1.addSpacer() // 強制推到最右側邊緣

let info1Text = row1.addText(widgetData.info1)
info1Text.font = Font.mediumSystemFont(11)
info1Text.textColor = new Color("#404040")
info1Text.rightAlignText()

// ─── 第二行：目的地城市 ＆ Aisle/Hall ───
let row2 = mainContainer.addStack()
row2.centerAlignContent()

let fromTextElement = row2.addText(widgetData.fromText)
fromTextElement.font = Font.systemFont(11)
fromTextElement.textColor = new Color("#505050")

row2.addSpacer() // 強制推到最右側邊緣

let info2Text = row2.addText(widgetData.info2)
info2Text.font = Font.mediumSystemFont(11)
info2Text.textColor = new Color("#404040")
info2Text.rightAlignText()

// ─── 第三行：空白填補 ＆ 核心航班狀態 ───
let row3 = mainContainer.addStack()
row3.bottomAlignContent()

let cityTextElement = row3.addText(widgetData.cityText)
cityTextElement.font = Font.boldSystemFont(20)
cityTextElement.textColor = new Color("#1a1a1a")

row3.addSpacer()

let statusLabel = row3.addText(widgetData.status)
statusLabel.font = Font.boldSystemFont(17)
statusLabel.rightAlignText()

// 根據狀態智慧標色（明亮背景調高了顏色對比度）
if (widgetData.status.includes("延誤") || widgetData.status.includes("取消") || widgetData.status.includes("最後") || widgetData.status.includes("失敗") || widgetData.status.includes("截止") 
|| widgetData.status.includes("到達")) {
  statusLabel.textColor = new Color("#b71c1c") // 深警告紅
} else if (widgetData.status.includes("啟航") || widgetData.status.includes("登機") || widgetData.status.includes("著陸")) {
  statusLabel.textColor = new Color("#1b5e20") // 深成功綠
} else {
  statusLabel.textColor = new Color("#0d4790") // 深提示藍
}

w.addSpacer()

// 【第三層：頁尾】
let footerStack = w.addStack()
footerStack.centerAlignContent()

let df = new DateFormatter()
df.dateFormat = "HH:mm"
let timeStr = df.string(new Date())
let updateText = footerStack.addText(`最後更新時間：${timeStr}`)
updateText.font = Font.systemFont(10)
updateText.textColor = new Color("#606060")

footerStack.addSpacer()

let btnStack = footerStack.addStack()
btnStack.backgroundColor = new Color("#000000", 0.05) // 淺黑透明度按鈕
btnStack.cornerRadius = 4
btnStack.setPadding(3, 8, 3, 8)

let btnText = btnStack.addText("REFRESH")
btnText.font = Font.boldSystemFont(9)
btnText.textColor = new Color("#303030")

// --- 系統設定與執行 ---
let scriptName = Script.name()
w.url = `scriptable:///run/${encodeURIComponent(scriptName)}`
w.refreshAfterDate = new Date(Date.now() + 3 * 60 * 1000)

// 退回背景並回到桌面
if (config.runsInApp) {
  App.close()
}

if (config.runsInWidget) {
  if (config.widgetFamily === 'medium'){
    Script.setWidget(w)
  } else {
    Script.setWidget(new ListWidget())
  }
} else {
  w.presentMedium()
}

Script.complete()
