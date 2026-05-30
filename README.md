# FIDP Lite: Flight Information Display Portal (Widget Edition)
<img alt="App Preview Medium" src="https://github.com/user-attachments/assets/3f374bba-9de7-494a-99b3-8e9dde4447e4" width="49%">
<img alt="App Preview Medium" src="https://github.com/user-attachments/assets/af83c8da-4e5e-434c-8b5c-8f4fa6ec479d" width="49%"><br>

FIDP (Flight Information Display Portal) Lite 是一個基於 Scriptable App 開發的 iOS 桌面小工具 (Widget)。作為 FIDP 網頁版專案的延伸，此工具整合了香港國際機場的官方 RESTful API 以及自建 API 服務，讓您可以在 iPhone 桌面上快速追蹤抵港或離港航班的最新動態。

## 主要功能
* **航班追蹤**：支援追蹤單一特定航班，或在不輸入參數的情況下隨機顯示近期的航班資訊。
* **智慧佈局與色彩**：
  * 🟢 **離港航班 (Departure)**：溫和的淡綠色漸層背景。
  * 🔵 **抵港航班 (Arrival)**：清爽的冰川藍漸層背景。
* **詳盡資訊**：顯示航班編號或聯名航班編號、客運大樓 (T1/T2)、目的地/出發地、預定時間、旅客登記行段、登機閘口、行李帶、接機大堂及即時航班狀態。
* **狀態警示色**：根據航班即時狀態（如：延誤、取消、最後召集、已啟航等）自動調整字體顏色，重要資訊一目了然。

## 安裝方法 (使用 Scriptable APP)
<a href="https://apps.apple.com/us/app/scriptable/id1405459188">
  <img width="150" alt="Scriptable APP" src="https://github.com/user-attachments/assets/6e5de8fe-4ef0-4bfc-9ba0-3aac615695ee">
  <img height="100" alt="image" src="https://github.com/user-attachments/assets/b540eab1-ca54-484a-9532-f1d3e8471282">
</a><br>

1. 在 App Store 下載並安裝 **Scriptable** App。
2. 複製本專案中的 `FIDP Lite.js` 程式碼。
3. 打開 Scriptable，點擊右上方的「+」號，貼上程式碼並將其命名為「FIDP Lite」。
4. 回到 iOS 主畫面，長按桌面並新增 Scriptable 小工具。
5. 點擊進入小工具編輯模式，將 `Script` 選擇為「FIDP Lite」。

> [!Tip]
> 為了呈現最完整的排版與資訊，本小工具僅支援 **中 (Medium)** 尺寸。

## 自定義航班追蹤 (Parameter 設定)
您可以透過設定小工具的參數 (Parameter) 來決定顯示的航班：

1. 長按桌面上的 FIDP Lite 小工具，選擇【編輯小工具】。
2. 在 `Parameter` 欄位中：
   * **追蹤特定航班**：輸入航班號碼（例如：`CX840` 或 `UO132`）。
   * **隨機航班**：留空不填，系統將自動隨機抽取一班近期的航班顯示。
   * **離線測試模式**：輸入 `OFF`，可載入一筆靜態測試數據。
3. 點擊空白處完成編輯。

> [!Caution]
> ### 重要注意事項
> * 受限於 iOS 對桌面小工具背景重新整理頻率的嚴格限制，小工具上顯示的數據**未必是當刻的實時數據**。
> * 在確認航班資訊（特別是登機閘口或最後召集等重要資訊）前，**請務必核對小工具左下角的「最後更新時間」**。您可以直接點擊 Widget 來手動觸發腳本重新執行並更新數據。

## 資料來源
本專案使用自建 API 服務，背後對接 [香港國際機場 (HKIA) 開放數據 (Open Data)](https://data.gov.hk/en-data/dataset/aahk-team1-flight-info) 提供的 RESTful API。

## 免責聲明
* 本專案為個人學術與技術展示用途，與香港機場管理局或任何航空公司無官方合作關係。
* 小工具提供的航班時間、閘口、狀態等資訊僅供參考。因網路延遲、API 異常或 iOS 系統限制導致的資訊延誤，開發者恕不負責。強烈建議旅客在機場時，以客運大樓內的航班顯示螢幕 (FIDS) 資訊為準。

## 授權條款
本專案採用 [MIT License](LICENSE) 授權。您可以自由使用、修改與分享，但請保留原作者聲明。
