import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { BookOpen, GraduationCap, Building2, Leaf, Factory, TrendingDown, CheckCircle2, PlayCircle, Loader2 } from 'lucide-react';
import { useLearningProgress } from '@/hooks/useLearningProgress';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';
import { toast } from 'sonner';

interface LearningPageProps {
  persona?: string;
  college?: string;
}

// 課程詳細內容
const lessonContents: Record<string, { sections: Array<{ title: string; content: string }> }> = {
  '什麼是碳排放？': {
    sections: [
      {
        title: '一、二氧化碳：是生命之源，也是氣候之痛',
        content: `在深入「排放」之前，我們必須先理解「碳」本身。碳是地球上最基本的生命元素，它在空氣、土壤、海洋與生物體之間不斷流動，形成穩定的「碳循環」。

在工業革命前，這套循環是平衡的：生物呼吸、火山噴發產生的二氧化碳，會被森林與海洋吸收。然而，人類在過去兩百年間，將埋藏在地底下數百萬年的「古代碳」（化石燃料：煤、石油、天然氣）挖掘出來並大量燃燒。這打破了數萬年來的能量平衡。當這些額外的氣體進入大氣，它們就像為地球蓋上了一層越來越厚的「隱形毛毯」，這就是我們所說的強化溫室效應。這層毛毯阻擋了地表長波輻射向外太空發散，使得地球像是一個不斷升溫的溫室。`
      },
      {
        title: '二、溫室氣體家族的「暖化戰力」：GWP 的管理邏輯',
        content: `雖然我們口語中常說「減碳」，但管理者必須明白，威脅氣候的「隱形殺手」不只二氧化碳一種。每一種氣體鎖住熱能的能力（科學上稱為「全球暖化潛勢」，GWP）截然不同，這也是為什麼碳管理需要一套「統一貨幣」。

以甲烷（CH₄）為例，它主要來自有機物的分解（如垃圾掩埋場、畜牧業反芻）或天然氣洩漏。雖然它在大氣中停留的時間比二氧化碳短，但在 100 年的維度下，一噸甲烷產生的增溫影響是二氧化碳的 28 倍。而半導體與電力工業中常用的六氟化硫（SF₆），其 GWP 值更是高達 23,500 以上。

這套科學邏輯告訴管理者：減碳不是只看「量」，更要看「質」。透過將不同氣體換算為二氧化碳當量（CO₂e），企業才能精準衡量各項製程對氣候的真實破壞力，並將其轉化為可管理的財務指標。`
      },
      {
        title: '三、碳排放的當代意義：從環境成本到企業資產',
        content: `在現代經濟體系中，碳排放的定義已經從「排煙」演變為一種「負面資產」。這涉及了「外部成本內部化」的轉型過程。

過去，企業排放碳是不需要付費的，這筆代價由全球環境與後代子孫承擔。但隨著《氣候變遷因應法》與歐盟 CBAM（碳邊境調整機制）的實施，碳排放正式進入了企業的會計科目。

**碳流即金流：** 當政府開始徵收碳費（如台灣預計實行的政策），每一噸排放都代表實際的營運現金支出。

**能源效率即競爭力：** 碳排放的本質是「能量的使用效率」。排放量高，通常代表能源轉換效率低下或製程老舊。因此，追求低碳排不只是為了環保，更是為了優化成本結構。`
      },
      {
        title: '四、總結：碳排放是文明進化的度量衡',
        content: `「什麼是碳排放？」它不僅是煙囪排出的廢氣，更是人類文明對能源依賴程度的度量指標。對管理入門者來說，理解碳排放的本質是為了識別「浪費」與「風險」。

透過數據化的盤查，我們能看見能量是如何在工廠與辦公室中流失，並將這些流失的氣體轉化為具體的改善方案。這是一場重新配置全球資源的革命，而「碳數據」就是這場革命中最核心的指南針。`
      }
    ]
  },
  '溫室效應原理': {
    sections: [
      {
        title: '一、能量的入與出：輻射的波長賽跑',
        content: `地球的氣候系統本質上是一個巨大的能量平衡裝置。這場平衡主要由兩種不同波長的輻射所主導：

**短波輻射（太陽能）：** 太陽表面溫度極高，其放射出的能量主要以短波形式進入大氣。由於波長短、能量強，大氣中的大多數氣體對其幾乎是「透明」的，使得太陽光能長驅直入，照射到地表並使其升溫。

**長波輻射（熱能）：** 地表吸收太陽能後，會將能量以「紅外線（長波輻射）」的形式反射回太空。與太陽能不同，長波輻射的能量較弱，極易被大氣中特定構造的氣體分子所攔截。

在自然狀態下，這兩者的入出達成平衡，使地球平均氣溫維持在適合生命生存的 15°C 左右。`
      },
      {
        title: '二、溫室氣體的分子機制：為何它們會吸熱？',
        content: `並非大氣中所有的氣體都能攔截熱能。大氣的主體——氮氣（N₂）和氧氣（O₂）——其分子構造非常簡單對稱，長波輻射（熱能）會直接穿過它們而不被吸收。

然而，溫室氣體（GHGs）（如二氧化碳 CO₂、甲烷 CH₄、水氣 H₂O）的分子結構較為複雜且不對稱。當這些分子與特定波長的長波輻射相遇時，會產生「共振運動」。這種物理現象會讓分子吸收能量並開始劇烈震動，隨後再將能量向四周散射。

這個過程就像是在大氣層中設置了無數個「微型加熱器」，將原本應該排向太空的熱能重新射回地表。這就是所謂的大氣逆輻射。氣體濃度越高，這層「熱能回收網」就越細密，留下的熱量也越多。`
      },
      {
        title: '三、自然 vs. 強化溫室效應：臨界點的跨越',
        content: `我們必須區分「自然的溫室效應」與人類活動導致的「強化溫室效應」：

**自然溫室效應：** 是地球的生命支持系統。若缺乏溫室氣體，地球將變成平均 -18°C 的冰球。

**強化溫室效應（人為）：** 工業革命後，人類大量燃燒化石燃料。以二氧化碳為例，其濃度已從工業革命前的約 280 ppm 飆升至現在超過 420 ppm。這打破了原本完美的能量帳本，導致能量「入大於出」，額外的熱能累積在海洋與大氣中，引發全球暖化。

這種不平衡導致了氣候系統的連鎖反應：冰川融化導致地表反照率降低（原本反射光能的白色冰層變為吸收熱能的深色海水），進一步加速了溫室效應的惡化。這就是管理者常聽到的「正回饋循環」。`
      },
      {
        title: '四、管理啟示：碳管理是在「管理能量風險」',
        content: `對於管理入門者而言，溫室效應原理提供了一個關鍵的洞察：碳管理本質上是對「熱能截留率」的管控。

當我們在進行 Scope 1 或 Scope 2 盤查時，實際上是在計算這間企業貢獻了多少「攔截熱能的分子」進入大氣。透過科學數據（如 GWP 值），我們能量化每一噸氣體對這場能量賽跑的影響程度。當這場賽跑失衡導致海平面上升、極端氣候損害產線時，企業的營運韌性便會直接受到衝擊。`
      }
    ]
  },
  '碳足跡計算方式': {
    sections: [
      {
        title: '一、核心概念：為什麼需要這本「環境帳單」？',
        content: `在過去，碳排放被視為與企業營運無關的「外部性」，意即排放廢氣不需支付成本。但在淨零時代，二氧化碳排放已正式成為一種「負面資產」。

「碳足跡（Carbon Footprint）」的概念就像走過沙灘留下的腳印，代表人類活動在地球上留下的溫室氣體痕跡。對管理入門者而言，碳足跡計算的本質就是一場「能源與物資的追蹤之旅」。透過數據化，我們能將抽象的環保口號，轉化為與財務報表同樣精確的環境帳本，進而判斷企業在面臨碳稅、綠色供應鏈要求時的真實競爭力。`
      },
      {
        title: '二、萬用計算公式：碳排放的「乘法法則」',
        content: `所有的碳足跡計算，不論是對象是個人、產品還是整座工廠，都遵循同一個邏輯。這是一個將「行為」轉換為「環境影響」的公式：

**活動數據 (Activity Data) × 排放係數 (Emission Factor) = 碳排放量 (CO₂e)**

**1. 活動數據：你的「行為紀錄」**
這是最基層的原始資料，通常來自於日常經營的單據。
- 常見來源：台電電費單（度）、加油發票（公升）、自來水費單（度）、天然氣收據（立方公尺）。
- 關鍵品質：在專業審核中，數據必須有「憑證」支持。沒有發票、帳單或儀表紀錄的數據被視為無效。

**2. 排放係數：資源的「碳含量轉換比率」**
這是一個轉換常數，告訴我們每單位資源會產生多少廢氣。
- 來源：通常由政府（如環境部氣候變遷署）定期發布。例如，台灣的「電力排放係數」會隨台電的能源結構（煤、氣、綠能比例）每年變動。
- 意義：假設係數為 0.495，代表你每用 1 度電，發電廠端就為你向大氣排放了 0.495 公斤的 CO₂e。

**3. 碳排放量：最終的「環境代價」**
計算結果統一使用二氧化碳當量（CO₂e）。這個單位存在的意義是為了讓不同氣體（如甲烷、冷媒）能在同一基準線上進行比較與管理。`
      },
      {
        title: '三、實作情境：從「點」到「面」的計算維度',
        content: `掌握公式後，實踐者需要區分兩種不同的計算維度，這決定了數據收集的廣度與深度。

**1. 組織碳盤查 (ISO 14064-1)：算的「面」**
這是計算「一整間公司」在特定時間（通常是一年）產生的總量。這就像是在幫企業做健康檢查，找出哪一個部門是排碳大戶。
- 直接排放：公司自己燒的油、工廠排煙、甚至冷氣冷媒洩漏。
- 間接排放：公司買來的電，以及隱藏在供應鏈中的排放（如員工通勤、差旅、垃圾處理）。

**2. 產品碳足跡 (ISO 14067)：算的「點」**
這是針對「單一產品」進行的完整旅程追蹤，稱為生命週期評估（LCA）。這是一場「從搖籃到墳墓（Cradle to Grave）」的數位化追蹤。
- 上游：原料開採與運輸產生的碳。
- 製造：工廠生產該產品耗費的電與熱。
- 下游：產品賣給消費者後，使用過程中的耗電，以及最後丟棄回收時產生的排放。`
      },
      {
        title: '四、計算過程中的挑戰與管理地雷',
        content: `初學者在操作時，最容易遇到的困難並非數學運算，而是「數據來源的真實性」與「單位統一」。

**單位陷阱：** 排放係數單位常為「公升」，但採購收據可能是「公斤」。計算前必須確認單位對齊，否則結果會出現千倍以上的誤差。

**係數版本：** 台灣與國外的電力係數不同，2023 年與 2024 年的也不同。管理者必須註明所引用的係數來源與年份，才能確保報告的公信力。

**重複計算：** 算完公司的總電費後，不可又重複算入個別產品的生產電費中，這會導致企業碳資產的錯誤估算。`
      },
      {
        title: '五、本章結語：數字是為了精準的決策',
        content: `理解了計算方式，管理者就擁有了在淨零賽局中最重要的「量尺」。

計算碳足跡的目的不是為了得到一個數字，而是為了「診斷」。只有算得出來，我們才能看見能量是如何在製程中流失，並將這些數據轉化為具體的改善方案——例如更換節能馬達、優化物流路徑或是更換綠電。這是一套幫助企業降低成本、防範風險並接軌國際標準的必備工具。`
      }
    ]
  },
  '全球暖化現況': {
    sections: [
      {
        title: '一、氣溫升高的實證：從「暖化」到「全球沸騰」',
        content: `全球暖化不再是電腦模型預測的未來，而是氣候觀測站中真實跳動的數字。根據 NASA 與 NOAA 的監測，2023 年與 2024 年相繼刷新了有史以來全球最熱年度的紀錄。

目前的全球平均氣溫，已較工業革命前（1850-1900 年）高出約 1.1°C 至 1.2°C。雖然數字看似微小，但對地球而言，這就像人體體溫長期處於發燒狀態。聯合國秘書長古特瑞斯（António Guterres）曾警示，人類已進入「全球沸騰時代（Global Boiling）」，這反映了暖化加速的急迫性。`
      },
      {
        title: '二、二氧化碳濃度的歷史斷層',
        content: `要理解現況，必須回頭看大氣中二氧化碳（CO2）濃度的變化。在過去 80 萬年的冰河期循環中，大氣中 CO2 濃度從未超過 300 ppm。然而，自工業革命大量開採化石燃料以來，這個數字直線上升。

**現況數據：** 夏威夷毛納羅亞觀測站（Mauna Loa Observatory）測得的數據，目前已穩定突破 420 ppm。

**意義：** 這代表我們正處於數百萬年來未曾見過的大氣結構中，這也是導致目前極端氣候頻率增加的根本原因。`
      },
      {
        title: '三、海平面上升與極地危機：連鎖反應的開啟',
        content: `暖化最直接的衝擊反映在極地與海洋。這不僅是「北極熊失去家園」的問題，更是關乎人類生存邊界的威脅：

**冰川消融與反照率降低：** 當北極海冰融化，深色的海水會吸收更多太陽能，進一步加速暖化（即所謂的正回饋效應）。

**熱膨脹與海平面上升：** 海水受熱後體積會膨脹，加上陸地冰川融化流入大海，全球海平面正以每年約 3.3 毫米的速度上升。

**極端氣候常態化：** 暖化的大氣能容納更多水蒸氣，導致降雨模式變得極端——要麼發生嚴重的乾旱，要麼出現毀滅性的強降雨與洪水。`
      },
      {
        title: '四、本章總結：氣候韌性是未來的核心能力',
        content: `全球暖化的現況告訴我們，減碳已經不是「選擇題」，而是「必答題」。對於管理者而言，了解暖化現況是為了進行風險管理。無論是廠房選址（考慮淹水風險）、供應鏈穩定性（考慮農作物減產），還是企業競爭力，都深受這個氣候大背景的影響。`
      }
    ]
  },
  '極端氣候事件': {
    sections: [
      {
        title: '一、從「異常」變成「常態」：統計曲線的位移',
        content: `極端氣候並非突然產生的新現象，而是發生的「頻率」與「強度」改變了。我們可以用數學上的「常態分佈」來理解：當全球平均溫度向右移動，原本罕見的熱浪會變得頻繁且致命，而原本極端的酷寒雖然變少，但一旦發生，往往伴隨著更混亂的大氣結構。

這意味著，我們過去建立的排洪設施、電網耐受度與農業耕作期，都是基於舊的統計數據。面對極端氣候，人類最大的風險在於「經驗法則失效」。`
      },
      {
        title: '二、常見的極端氣候類型與機制',
        content: `極端氣候事件並非單一發生，它們往往環環相扣：

**1. 致命熱浪與乾旱**
隨著大氣升溫，蒸發作用加劇，土地水分流失更快。這導致了長時間的乾旱，並為森林大火提供了溫床（如近年澳洲與加拿大的野火）。這種乾旱與高溫會造成電力需求暴增，同時因水力發電不足導致能源危機。

**2. 極端降雨與毀滅性洪水**
根據物理原則，空氣溫度每上升 1°C，大氣就能多容納約 7% 的水蒸氣。這就像是大氣層變成了一個巨大的海綿，一旦條件成熟，就會降下遠超排水系統負荷的暴雨。這解釋了為什麼現在的雨勢往往「時間短、強度大」，造成都市內澇與山區土石流。

**3. 熱帶氣旋（颱風/颶風）的增強**
雖然全球暖化是否增加颱風的「數量」尚無定論，但科學界一致認為它增加了颱風的「強度」。溫暖的海水提供了更多能量，使得颱風更容易演變成「強烈颱風」，並伴隨著更高、更具破壞力的風暴潮。`
      },
      {
        title: '三、極端氣候對企業與社會的衝擊',
        content: `在管理實務中，極端氣候被歸類為「實體風險 (Physical Risks)」：

**供應鏈中斷：** 2021 年台灣大旱導致半導體業面臨缺水壓力，這就是極端氣候直接衝擊產業鏈的實例。

**資產損失：** 洪水、強風造成的廠房損毀或營運中斷，直接推升了保險成本與重修支出。

**糧食安全：** 乾旱與洪災導致農作物減產，引發全球物價波動（通膨）。`
      },
      {
        title: '四、本章結語：適應與韌性的必要性',
        content: `極端氣候事件告訴我們：減緩（Mitigation）是為了避免不可回歸的災難，而調適（Adaptation）則是為了應對已經發生的衝擊。對於基礎學習者而言，理解極端氣候的成因，能幫助我們在進行個人生活或組織管理時，納入更多的「韌性思維」，從容應對不穩定的未來。`
      }
    ]
  },
  '對台灣的影響': {
    sections: [
      {
        title: '一、升溫的連鎖效應：台灣正在快速變暖',
        content: `當我們討論全球暖化時，台灣並非處於平均線，而是處於「加速區」。台灣過去百年的升溫速度約為 1.6°C，明顯高於全球平均。這並非只是冷氣開強一點就能解決的問題，升溫會直接改變台灣大氣層的「胃口」——氣溫每升高 1°C，空氣就能多吸走地表 7% 的水氣。

這導致了台灣最顯著的改變：「夏季變長，冬季消失」。極端的推估顯示，未來的台灣夏季可能長達 7 個月，而涼爽的冬天將成為老一輩口中的傳說。這種溫度的持續高位，會讓都市產生嚴重的熱島效應，使能源供應在用電尖峰時段承受巨大壓力。`
      },
      {
        title: '二、水資源的兩極化：從乾涸到淹水的瞬間',
        content: `台灣的地形陡峭，原本留水就不易，現在氣候變遷讓這件事變得更極端。雖然台灣的總雨量變化不明顯，但「下雨的天數變少了，下雨的力道變猛了」。

**乾旱常態化：** 當梅雨遲到或颱風不來，台灣就會陷入嚴重的乾旱（如 2021 年的百年大旱）。這對高度依賴水資源的半導體產業和農業來說，是致命的經營風險。

**致災性暴雨：** 因為空氣變熱後吸飽了水氣，一旦降雨，往往在短短幾小時內灌下原本一整個月的雨量。這超出了現有城市排水系統的負荷，使得原本不淹水的地區也面臨淹水威脅。`
      },
      {
        title: '三、海岸線的退縮：被包圍的國土風險',
        content: `台灣是一座海島，海平面上升對我們而言是「空間的擠壓」。由於洋流與地理位置的關係，台灣周邊海平面上升的速度可能比全球平均更快。

這對西南沿海（如彰化、雲林、嘉義）影響最深。這些地區地勢低窪，甚至有地層下陷的問題。隨著海平面升高，海水倒灌會讓耕地鹽化、無法耕種，甚至在颱風來襲時引發更嚴重的風暴潮，威脅沿海工業區與港口的設施安全。`
      },
      {
        title: '四、管理思維的轉向：從「人定勝天」到「氣候韌性」',
        content: `理解這些影響後，管理者需要將「氣候」納入經營決策。這不再是單純的環保問題，而是生存問題：

**選址與建設：** 廠房是否蓋在低窪區？建築是否具備降溫與耐澇設計？

**資源管理：** 企業是否具備高效率的廢水回收系統，以應對可能的長久旱季？

**韌性思維：** 面對越來越不穩定的氣候，我們不能再期待環境「一如往常」，而是要建立「當災害發生時，能快速復原」的能力。`
      }
    ]
  }
};

// 通用基礎教材
const basicMaterials = [
  {
    id: 'carbon-basics',
    title: '碳排放基礎概念',
    description: '了解什麼是碳排放、溫室效應與氣候變遷的關係',
    icon: Leaf,
    lessons: [
      { title: '什麼是碳排放？', duration: '15 分鐘', completed: false },
      { title: '溫室效應原理', duration: '15 分鐘', completed: false },
      { title: '碳足跡計算方式', duration: '20 分鐘', completed: false },
    ]
  },
  {
    id: 'climate-change',
    title: '氣候變遷影響',
    description: '探討氣候變遷對環境、經濟與社會的影響',
    icon: TrendingDown,
    lessons: [
      { title: '全球暖化現況', duration: '7 分鐘', completed: false },
      { title: '極端氣候事件', duration: '6 分鐘', completed: false },
      { title: '對台灣的影響', duration: '8 分鐘', completed: false },
    ]
  },
];

// 根據 persona 定義專屬教材（對應 SurveyPage 的 8 種 persona）
const personaMaterials: Record<string, {
  title: string;
  description: string;
  color: string;
  modules: Array<{
    id: string;
    title: string;
    description: string;
    icon: React.ElementType;
    lessons: Array<{ title: string; duration: string; completed: boolean }>;
  }>;
}> = {
  '領導者': {
    title: '👑 領導者學習路徑',
    description: '培養環境議題領導力，引領團隊永續發展',
    color: 'bg-amber-100 text-amber-800',
    modules: [
      {
        id: 'leadership-strategy',
        title: '永續領導策略',
        description: '如何在組織中推動永續文化',
        icon: Building2,
        lessons: [
          { title: '建立永續願景與使命', duration: '15 分鐘', completed: false },
          { title: '組織變革與永續轉型', duration: '20 分鐘', completed: false },
          { title: '跨部門永續合作機制', duration: '18 分鐘', completed: false },
          { title: '永續領導力培養', duration: '22 分鐘', completed: false },
        ]
      },
      {
        id: 'leadership-decision',
        title: '碳管理決策框架',
        description: '制定與執行減碳策略',
        icon: TrendingDown,
        lessons: [
          { title: '減碳目標設定方法', duration: '18 分鐘', completed: false },
          { title: '資源配置與優先順序', duration: '15 分鐘', completed: false },
          { title: '績效評估與改善', duration: '20 分鐘', completed: false },
        ]
      },
    ]
  },
  '研究者': {
    title: '🔬 研究者學習路徑',
    description: '深入研究碳排放數據與減碳技術',
    color: 'bg-blue-100 text-blue-800',
    modules: [
      {
        id: 'research-methods',
        title: '碳排放研究方法',
        description: '科學化的數據收集與分析',
        icon: GraduationCap,
        lessons: [
          { title: '碳排放數據收集方法', duration: '20 分鐘', completed: false },
          { title: '生命週期評估（LCA）入門', duration: '25 分鐘', completed: false },
          { title: '碳足跡計算科學方法', duration: '22 分鐘', completed: false },
          { title: '統計分析與數據視覺化', duration: '18 分鐘', completed: false },
        ]
      },
      {
        id: 'research-trends',
        title: '減碳技術研究趨勢',
        description: '最新的學術研究與技術發展',
        icon: Factory,
        lessons: [
          { title: '負碳技術研究現況', duration: '20 分鐘', completed: false },
          { title: '再生能源效率研究', duration: '18 分鐘', completed: false },
          { title: '氣候模型與預測', duration: '25 分鐘', completed: false },
        ]
      },
    ]
  },
  '政策分析員': {
    title: '📋 政策分析員學習路徑',
    description: '解讀氣候政策，掌握法規動態',
    color: 'bg-purple-100 text-purple-800',
    modules: [
      {
        id: 'policy-domestic',
        title: '國內氣候政策法規',
        description: '台灣氣候相關法規與政策',
        icon: Building2,
        lessons: [
          { title: '氣候變遷因應法解析', duration: '25 分鐘', completed: false },
          { title: '溫室氣體減量及管理法', duration: '20 分鐘', completed: false },
          { title: '台灣碳交易制度', duration: '22 分鐘', completed: false },
          { title: '企業碳揭露法規要求', duration: '18 分鐘', completed: false },
        ]
      },
      {
        id: 'policy-international',
        title: '國際碳定價機制',
        description: '全球氣候政策比較分析',
        icon: TrendingDown,
        lessons: [
          { title: 'CBAM 歐盟碳邊境調整機制', duration: '25 分鐘', completed: false },
          { title: '各國碳稅制度比較', duration: '20 分鐘', completed: false },
          { title: '國際碳市場連結', duration: '22 分鐘', completed: false },
        ]
      },
    ]
  },
  '前瞻技術愛好者': {
    title: '🚀 前瞻技術愛好者學習路徑',
    description: '探索最新減碳科技與創新解決方案',
    color: 'bg-cyan-100 text-cyan-800',
    modules: [
      {
        id: 'tech-ccus',
        title: '碳捕捉與封存技術',
        description: 'CCUS 技術原理與應用',
        icon: Factory,
        lessons: [
          { title: '碳捕捉技術原理', duration: '20 分鐘', completed: false },
          { title: '碳封存與利用方案', duration: '22 分鐘', completed: false },
          { title: '直接空氣捕捉（DAC）', duration: '18 分鐘', completed: false },
          { title: 'CCUS 商業應用案例', duration: '15 分鐘', completed: false },
        ]
      },
      {
        id: 'tech-energy',
        title: '新興能源技術',
        description: '氫能與綠色能源創新',
        icon: Leaf,
        lessons: [
          { title: '綠氫生產與應用', duration: '22 分鐘', completed: false },
          { title: '儲能技術突破', duration: '20 分鐘', completed: false },
          { title: '智慧電網與能源管理', duration: '18 分鐘', completed: false },
        ]
      },
    ]
  },
  '實踐行動家': {
    title: '💪 實踐行動家學習路徑',
    description: '從行動開始，推動社區環保改變',
    color: 'bg-orange-100 text-orange-800',
    modules: [
      {
        id: 'action-community',
        title: '社區減碳行動',
        description: '組織與推動社區環保活動',
        icon: Leaf,
        lessons: [
          { title: '如何組織社區減碳行動', duration: '18 分鐘', completed: false },
          { title: '社區能源合作社', duration: '20 分鐘', completed: false },
          { title: '在地環保倡議技巧', duration: '15 分鐘', completed: false },
          { title: '成功社區案例分析', duration: '22 分鐘', completed: false },
        ]
      },
      {
        id: 'action-advocacy',
        title: '環境倡議實務',
        description: '與政府和企業對話的方法',
        icon: Building2,
        lessons: [
          { title: '公民參與氣候政策', duration: '20 分鐘', completed: false },
          { title: '環保運動策略規劃', duration: '18 分鐘', completed: false },
          { title: '媒體溝通與公關技巧', duration: '15 分鐘', completed: false },
        ]
      },
    ]
  },
  '綠色生活實踐家': {
    title: '🌿 綠色生活實踐家學習路徑',
    description: '將永續理念融入日常生活',
    color: 'bg-green-100 text-green-800',
    modules: [
      {
        id: 'lifestyle-daily',
        title: '日常減碳實踐',
        description: '從生活中的小事做起',
        icon: Leaf,
        lessons: [
          { title: '低碳飲食與在地食材', duration: '15 分鐘', completed: false },
          { title: '綠色交通選擇指南', duration: '12 分鐘', completed: false },
          { title: '家庭節能與用電管理', duration: '18 分鐘', completed: false },
          { title: '零廢棄生活實踐', duration: '20 分鐘', completed: false },
        ]
      },
      {
        id: 'lifestyle-home',
        title: '永續居家改造',
        description: '建立環保的生活空間',
        icon: BookOpen,
        lessons: [
          { title: '居家節能改造指南', duration: '20 分鐘', completed: false },
          { title: '永續材料選購', duration: '15 分鐘', completed: false },
          { title: '室內空氣品質管理', duration: '12 分鐘', completed: false },
        ]
      },
    ]
  },
  '管理入門者': {
    title: '📊 管理入門者學習路徑',
    description: '建立碳管理基礎，踏入永續職涯',
    color: 'bg-slate-100 text-slate-800',
    modules: [
      {
        id: 'beginner-basics',
        title: '碳管理基礎概念',
        description: '永續管理的入門知識',
        icon: BookOpen,
        lessons: [
          { title: '溫室氣體與碳排放基礎', duration: '12 分鐘', completed: false },
          { title: '碳管理術語入門', duration: '10 分鐘', completed: false },
          { title: '企業碳盤查概述', duration: '15 分鐘', completed: false },
          { title: 'Scope 1/2/3 排放介紹', duration: '18 分鐘', completed: false },
        ]
      },
      {
        id: 'beginner-career',
        title: '永續職涯發展',
        description: '進入永續領域的職涯準備',
        icon: GraduationCap,
        lessons: [
          { title: '永續人才市場趨勢', duration: '15 分鐘', completed: false },
          { title: 'ISO 14064 標準入門', duration: '20 分鐘', completed: false },
          { title: '永續相關證照介紹', duration: '18 分鐘', completed: false },
        ]
      },
    ]
  },
  '自覺消費者': {
    title: '🛒 自覺消費者學習路徑',
    description: '成為負責任的消費者，用消費力量改變世界',
    color: 'bg-pink-100 text-pink-800',
    modules: [
      {
        id: 'consumer-choice',
        title: '綠色消費選擇',
        description: '如何辨識與選擇環保產品',
        icon: Leaf,
        lessons: [
          { title: '認識環保標章與認證', duration: '15 分鐘', completed: false },
          { title: '如何辨識漂綠行銷', duration: '18 分鐘', completed: false },
          { title: '低碳產品選購指南', duration: '20 分鐘', completed: false },
          { title: '永續時尚與衣物選擇', duration: '15 分鐘', completed: false },
        ]
      },
      {
        id: 'consumer-impact',
        title: '消費者影響力',
        description: '用消費推動企業改變',
        icon: TrendingDown,
        lessons: [
          { title: '消費者運動與企業責任', duration: '18 分鐘', completed: false },
          { title: '社會企業與 B 型企業', duration: '15 分鐘', completed: false },
          { title: '投資與消費的永續選擇', duration: '20 分鐘', completed: false },
        ]
      },
    ]
  },
};

// 學群專屬教材
const collegeSpecificMaterials: Record<string, {
  title: string;
  modules: Array<{
    id: string;
    title: string;
    description: string;
    icon: React.ElementType;
    lessons: Array<{ title: string; duration: string; completed: boolean }>;
  }>;
}> = {
  '工程學群': {
    title: '🔧 工程學群專屬教材',
    modules: [
      {
        id: 'green-engineering',
        title: '綠色工程設計',
        description: '永續工程設計原則與實務',
        icon: Factory,
        lessons: [
          { title: '生命週期評估 (LCA)', duration: '20 分鐘', completed: false },
          { title: '綠色製程設計', duration: '18 分鐘', completed: false },
          { title: '節能減排技術', duration: '22 分鐘', completed: false },
          { title: '循環經濟在工程的應用', duration: '25 分鐘', completed: false },
        ]
      },
    ]
  },
  '管理學群': {
    title: '📊 管理學群專屬教材',
    modules: [
      {
        id: 'sustainable-business',
        title: '永續經營管理',
        description: '企業永續發展策略與實踐',
        icon: Building2,
        lessons: [
          { title: '綠色供應鏈管理', duration: '20 分鐘', completed: false },
          { title: 'ESG 投資趨勢', duration: '15 分鐘', completed: false },
          { title: '碳資產管理', duration: '18 分鐘', completed: false },
          { title: '永續績效指標 (KPI)', duration: '22 分鐘', completed: false },
        ]
      },
    ]
  },
  '資訊學群': {
    title: '💻 資訊學群專屬教材',
    modules: [
      {
        id: 'green-it',
        title: '綠色資訊科技',
        description: 'IT 產業的永續發展',
        icon: Factory,
        lessons: [
          { title: '綠色資料中心', duration: '18 分鐘', completed: false },
          { title: 'AI 與碳足跡', duration: '15 分鐘', completed: false },
          { title: '區塊鏈碳交易', duration: '20 分鐘', completed: false },
          { title: '智慧城市減碳應用', duration: '22 分鐘', completed: false },
        ]
      },
    ]
  },
  '設計學群': {
    title: '🎨 設計學群專屬教材',
    modules: [
      {
        id: 'sustainable-design',
        title: '永續設計思維',
        description: '綠色設計原則與實踐',
        icon: Leaf,
        lessons: [
          { title: '生態設計原則', duration: '15 分鐘', completed: false },
          { title: '永續材料選用', duration: '18 分鐘', completed: false },
          { title: '包裝減量設計', duration: '12 分鐘', completed: false },
          { title: '產品生命週期設計', duration: '20 分鐘', completed: false },
        ]
      },
    ]
  },
  '其他': {
    title: '📚 通識永續教材',
    modules: [
      {
        id: 'general-sustainability',
        title: '永續發展通識',
        description: '跨領域的永續發展知識',
        icon: BookOpen,
        lessons: [
          { title: '聯合國 SDGs 介紹', duration: '15 分鐘', completed: false },
          { title: '全球永續趨勢', duration: '12 分鐘', completed: false },
          { title: '個人永續行動方案', duration: '10 分鐘', completed: false },
        ]
      },
    ]
  },
};

interface ModuleType {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  lessons: Array<{ title: string; duration: string; completed: boolean }>;
}

const LearningPage: React.FC<LearningPageProps> = ({ persona = '綠色新手', college = '其他' }) => {
  const { user } = useSupabaseAuth();
  const { progress, loading, toggleLessonComplete, isLessonCompleted, getCompletedCount } = useLearningProgress();
  const [savingLesson, setSavingLesson] = useState<string | null>(null);
  const [expandedLesson, setExpandedLesson] = useState<string | null>(null);
  const currentPersonaMaterial = personaMaterials[persona] || personaMaterials['綠色新手'];
  const collegeMaterial = collegeSpecificMaterials[college] || collegeSpecificMaterials['其他'];

  const handleToggleLesson = async (moduleId: string, lessonTitle: string) => {
    if (!user) {
      toast.error('請先登入以儲存學習進度');
      return;
    }
    
    setSavingLesson(lessonTitle);
    const { error } = await toggleLessonComplete(moduleId, lessonTitle);
    setSavingLesson(null);
    
    if (error) {
      toast.error('儲存進度失敗，請稍後再試');
    } else {
      const wasCompleted = isLessonCompleted(moduleId, lessonTitle);
      toast.success(wasCompleted ? '已取消完成標記' : '課程已完成！');
    }
  };

  const calculateProgress = (moduleId: string, lessons: Array<{ title: string }>) => {
    const completed = lessons.filter(l => isLessonCompleted(moduleId, l.title)).length;
    return (completed / lessons.length) * 100;
  };

  const renderModuleCard = (module: ModuleType, index: number) => {
    const Icon = module.icon;
    const progress = calculateProgress(module.id, module.lessons);

    return (
      <Card key={module.id} className="card-hover overflow-hidden">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Icon className="w-5 h-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-lg">{module.title}</CardTitle>
                <CardDescription className="mt-1">{module.description}</CardDescription>
              </div>
            </div>
            <Badge variant="outline" className="shrink-0">
              {module.lessons.length} 課程
            </Badge>
          </div>
          <Progress value={progress} className="mt-3 h-2" />
          <p className="text-xs text-muted-foreground mt-1">
            已完成 {Math.round(progress)}%
          </p>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible>
            <AccordionItem value={module.id} className="border-none">
              <AccordionTrigger className="py-2 text-sm hover:no-underline">
                查看課程列表
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2">
                  {module.lessons.map((lesson, lessonIndex) => {
                    const completed = isLessonCompleted(module.id, lesson.title);
                    const isSaving = savingLesson === lesson.title;
                    const lessonKey = `${module.id}-${lesson.title}`;
                    const isExpanded = expandedLesson === lessonKey;
                    const hasContent = lessonContents[lesson.title];
                    
                    return (
                      <div key={lesson.title} className="space-y-2">
                        <div
                          className={`flex items-center justify-between p-3 rounded-lg transition-colors ${
                            completed
                              ? 'bg-primary/10 border border-primary/20'
                              : 'bg-muted/50 hover:bg-muted'
                          }`}
                        >
                          <div 
                            className={`flex items-center gap-3 flex-1 ${hasContent ? 'cursor-pointer' : ''}`}
                            onClick={() => hasContent && setExpandedLesson(isExpanded ? null : lessonKey)}
                          >
                            {completed ? (
                              <CheckCircle2 className="w-5 h-5 text-primary" />
                            ) : (
                              <PlayCircle className="w-5 h-5 text-muted-foreground" />
                            )}
                            <span className={`${completed ? 'text-primary font-medium' : ''} ${hasContent ? 'hover:underline' : ''}`}>
                              {lesson.title}
                            </span>
                            {hasContent && (
                              <Badge variant="secondary" className="text-xs">
                                {isExpanded ? '收起' : '查看內容'}
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-muted-foreground">{lesson.duration}</span>
                            <Button
                              size="sm"
                              variant={completed ? "outline" : "default"}
                              disabled={isSaving || loading}
                              onClick={() => handleToggleLesson(module.id, lesson.title)}
                            >
                              {isSaving ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : completed ? (
                                '取消完成'
                              ) : (
                                '標記完成'
                              )}
                            </Button>
                          </div>
                        </div>
                        
                        {/* 課程詳細內容 - 使用 Dialog 顯示 */}
                        <Dialog open={isExpanded && !!hasContent} onOpenChange={(open) => !open && setExpandedLesson(null)}>
                          <DialogContent className="max-w-4xl max-h-[90vh] p-0">
                            <DialogHeader className="px-6 pt-6 pb-4 border-b sticky top-0 bg-background z-10">
                              <DialogTitle className="text-xl font-bold text-primary flex items-center gap-2">
                                <BookOpen className="w-6 h-6" />
                                {lesson.title}
                              </DialogTitle>
                            </DialogHeader>
                            <ScrollArea className="h-[calc(90vh-120px)] px-6 py-4">
                              <div className="space-y-8 pb-6">
                                {hasContent && lessonContents[lesson.title].sections.map((section, idx) => (
                                  <div key={idx} className="space-y-4">
                                    <h3 className="text-lg font-bold text-primary border-l-4 border-primary pl-4">
                                      {section.title}
                                    </h3>
                                    <div className="text-base text-foreground whitespace-pre-wrap leading-relaxed pl-4">
                                      {section.content.split('\n').map((paragraph, pIdx) => (
                                        <p key={pIdx} className="mb-3">
                                          {paragraph.split('**').map((part, partIdx) => 
                                            partIdx % 2 === 1 ? (
                                              <strong key={partIdx} className="text-primary font-semibold">{part}</strong>
                                            ) : (
                                              <span key={partIdx}>{part}</span>
                                            )
                                          )}
                                        </p>
                                      ))}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </ScrollArea>
                          </DialogContent>
                        </Dialog>
                      </div>
                    );
                  })}
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* 歡迎區塊 */}
      <Card className="bg-gradient-to-r from-primary/10 to-secondary/10 border-none">
        <CardContent className="py-6">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-full bg-white shadow-md">
              <GraduationCap className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-foreground">教學平台</h2>
              <p className="text-muted-foreground">
                根據您的身份「<span className="font-semibold text-primary">{persona}</span>」，我們為您準備了專屬學習內容
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="persona" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 h-12">
          <TabsTrigger value="basic" className="text-sm">
            📖 基礎教材
          </TabsTrigger>
          <TabsTrigger value="persona" className="text-sm">
            🎯 身份專屬
          </TabsTrigger>
          <TabsTrigger value="college" className="text-sm">
            🎓 學群專屬
          </TabsTrigger>
        </TabsList>

        {/* 基礎教材 */}
        <TabsContent value="basic" className="space-y-4">
          <div className="text-center py-4">
            <h3 className="text-lg font-semibold">🌍 碳排放基礎知識</h3>
            <p className="text-muted-foreground text-sm">每個人都應該了解的環保基礎</p>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {basicMaterials.map((module, index) => renderModuleCard(module, index))}
          </div>
        </TabsContent>

        {/* 身份專屬教材 */}
        <TabsContent value="persona" className="space-y-4">
          <Card className={`${currentPersonaMaterial.color} border-none`}>
            <CardContent className="py-4">
              <h3 className="text-lg font-semibold">{currentPersonaMaterial.title}</h3>
              <p className="text-sm opacity-80">{currentPersonaMaterial.description}</p>
            </CardContent>
          </Card>
          <div className="grid gap-4 md:grid-cols-2">
            {currentPersonaMaterial.modules.map((module, index) => renderModuleCard(module, index))}
          </div>
        </TabsContent>

        {/* 學群專屬教材 */}
        <TabsContent value="college" className="space-y-4">
          <Card className="bg-secondary/10 border-none">
            <CardContent className="py-4">
              <h3 className="text-lg font-semibold">{collegeMaterial.title}</h3>
              <p className="text-sm text-muted-foreground">根據您的學群背景量身打造的專業內容</p>
            </CardContent>
          </Card>
          <div className="grid gap-4 md:grid-cols-2">
            {collegeMaterial.modules.map((module, index) => renderModuleCard(module, index))}
          </div>
        </TabsContent>
      </Tabs>

      {/* 學習統計 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="w-5 h-5" />
            學習進度統計
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="p-4 rounded-lg bg-primary/10">
              <p className="text-3xl font-bold text-primary">{getCompletedCount()}</p>
              <p className="text-sm text-muted-foreground">已完成課程</p>
            </div>
            <div className="p-4 rounded-lg bg-secondary/10">
              <p className="text-3xl font-bold text-secondary">
                {currentPersonaMaterial.modules.reduce((acc, m) => acc + m.lessons.length, 0) + 
                 basicMaterials.reduce((acc, m) => acc + m.lessons.length, 0)}
              </p>
              <p className="text-sm text-muted-foreground">總課程數</p>
            </div>
            <div className="p-4 rounded-lg bg-accent/50">
              <p className="text-3xl font-bold text-accent-foreground">
                {Math.round(
                  (getCompletedCount() /
                    (currentPersonaMaterial.modules.reduce((acc, m) => acc + m.lessons.length, 0) +
                      basicMaterials.reduce((acc, m) => acc + m.lessons.length, 0))) *
                    100
                ) || 0}%
              </p>
              <p className="text-sm text-muted-foreground">完成率</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LearningPage;
