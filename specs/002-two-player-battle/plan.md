# Implementation Plan: Two-Player Battle Mode

**Branch**: `002-two-player-battle` | **Date**: 2025-10-23 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/002-two-player-battle/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

實作兩人本地對戰模式，包含：
1. 雙玩家畫面與獨立控制系統
2. 垃圾行攻擊機制（消 2+ 行對對手發送灰色垃圾行）
3. 勝負判定與結果顯示
4. 連擊系統增加攻擊力

技術方法：擴充現有的 Game/GameState/Renderer 架構，新增 BattleGame 控制器協調兩個獨立的 Game 實例，實作玩家間的攻擊隊列系統。保持現有單人模式不變，透過模式選擇切換。

## Technical Context

**Language/Version**: JavaScript ES6+ (Vanilla JS)
**Primary Dependencies**:
- Vite 5.0 (build tool)
- Jest 29.7 (testing framework)
- HTML5 Canvas 2D API (rendering)

**Storage**: N/A (純前端遊戲，無需持久化)
**Testing**: Jest (unit tests), coverage threshold 80%
**Target Platform**: 現代瀏覽器 (Chrome 90+, Firefox 88+, Safari 14+)
**Project Type**: Single-page web application
**Performance Goals**:
- 60 FPS 遊戲循環
- <16ms 輸入延遲
- 兩位玩家同時運行不卡頓

**Constraints**:
- 保持現有單人模式完全不變
- 不引入外部依賴（保持 Vanilla JS）
- 測試覆蓋率維持 80% 以上
- 本地對戰（同一台電腦），不需網路功能

**Scale/Scope**:
- 新增約 5-8 個類別/模組
- 預估 800-1200 行程式碼
- 約 100-150 個新測試

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### ✅ Principle 1: Simplicity First

**Compliant**: 採用最簡單的設計 - 重用現有的 Game 和 GameState 類別，只新增一個 BattleGame 協調器。垃圾行使用現有的 Grid 機制，不需要複雜的特殊處理。

**Justification**: 組合模式（兩個 Game 實例）比重寫整個遊戲邏輯簡單得多。

### ✅ Principle 2: Test-Driven Development

**Compliant**: 所有新功能將遵循 TDD：
1. 先寫測試描述預期行為
2. 執行測試確認失敗（紅）
3. 實作最小可行程式碼（綠）
4. 重構優化（保持綠）

關鍵測試區域：
- BattleGame 協調邏輯
- 攻擊隊列系統
- 垃圾行生成與加入
- 雙玩家輸入隔離
- 勝負判定

### ✅ Principle 3: User Experience Focus

**Compliant**:
- 輸入延遲 <16ms（重用現有的即時輸入處理）
- 流暢 60 FPS（使用 requestAnimationFrame）
- 清晰的鍵位分配（WASD vs 方向鍵）
- 視覺化垃圾行（灰色方塊，明顯區分）
- 即時連擊顯示

### ✅ Principle 4: Performance by Design

**Compliant**:
- 目標 60 FPS 維持不變
- 輸入延遲 <16ms 維持不變
- 雙玩家模式下使用兩個獨立的 Game 實例，每個獨立更新（平行計算）
- Canvas 渲染優化：只重繪變化的區域（已在現有 Renderer 中實作）

**Performance Budget**:
- 單幀總時間 <16.67ms (60 FPS)
- 兩個 Game.update() 各 <5ms
- 渲染 <6ms
- 剩餘 ~1ms 緩衝

### ✅ Principle 5: Maintainable Code

**Compliant**:
- 清晰的職責分離（BattleGame 協調 / Game 個別邏輯）
- 完整的 JSDoc 註解
- 一致的命名規範（現有風格）
- 完整的單元測試
- 詳細的程式碼註解說明複雜邏輯

### Gate Status: ✅ PASS

所有憲章原則都符合。設計採用簡單的組合模式，重用現有程式碼，保持測試覆蓋，維持效能標準。

**Re-check after Phase 1**: 需在資料模型設計完成後重新確認複雜度沒有增加。

## Project Structure

### Documentation (this feature)

```text
specs/002-two-player-battle/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output - 技術研究與決策
├── data-model.md        # Phase 1 output - 資料模型設計
├── quickstart.md        # Phase 1 output - 開發者快速入門
├── contracts/           # Phase 1 output - API 契約
│   └── BattleGame.md    # BattleGame 類別介面定義
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
src/
├── models/              # 資料模型層（現有）
│   ├── GameState.js        # 現有 - 需微調支援垃圾行
│   ├── Grid.js             # 現有 - 需新增垃圾行方法
│   ├── Position.js         # 現有 - 不需修改
│   ├── Tetromino.js        # 現有 - 不需修改
│   └── GarbageLine.js      # 新增 - 垃圾行模型
│
├── game/                # 遊戲邏輯層（現有）
│   ├── Game.js             # 現有 - 需新增攻擊事件回調
│   ├── BattleGame.js       # 新增 - 對戰協調器
│   └── Logger.js           # 現有 - 可能需新增對戰事件
│
├── rendering/           # 渲染層（現有）
│   ├── Renderer.js         # 現有 - 需擴充雙畫面渲染
│   ├── BattleRenderer.js   # 新增 - 對戰畫面渲染器
│   ├── GridRenderer.js     # 現有 - 需支援垃圾行視覺
│   ├── TetrominoRenderer.js # 現有 - 不需修改
│   └── UIRenderer.js       # 現有 - 需支援雙玩家 UI
│
├── utils/               # 工具層（現有）
│   └── Constants.js        # 現有 - 需新增對戰常數
│
└── main.js              # 入口點（現有）- 需新增模式選擇

tests/
├── unit/                # 單元測試
│   ├── GarbageLine.test.js     # 新增
│   ├── BattleGame.test.js      # 新增
│   ├── Game.test.js            # 現有 - 需新增攻擊測試
│   ├── GameState.test.js       # 現有 - 需新增垃圾行測試
│   └── Grid.test.js            # 現有 - 需新增垃圾行方法測試
│
└── integration/         # 整合測試（新增）
    └── BattleFlow.test.js      # 新增 - 完整對戰流程測試
```

**Structure Decision**:

採用 **Option 1: Single project** 結構，因為這是單頁面網頁遊戲，不需要分離前後端或多平台支援。

**設計決策**：
1. **重用現有架構**：保持 models/game/rendering 三層架構不變
2. **組合模式**：BattleGame 包含兩個 Game 實例，不修改核心 Game 邏輯
3. **最小侵入**：現有類別只需小幅擴充（新增方法），不破壞現有功能
4. **新增測試目錄**：新增 `tests/integration/` 用於對戰流程的整合測試

## Complexity Tracking

> **No violations - This section is empty**

所有設計決策都符合憲章原則，無需複雜度豁免。
