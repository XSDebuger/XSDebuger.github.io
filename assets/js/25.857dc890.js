(window.webpackJsonp=window.webpackJsonp||[]).push([[25],{399:function(_,v,t){"use strict";t.r(v);var d=t(5),a=Object(d.a)({},(function(){var _=this,v=_.$createElement,t=_._self._c||v;return t("ContentSlotsDistributor",{attrs:{"slot-key":_.$parent.slotKey}},[t("h1",{attrs:{id:"一个数据库增量同步的简单实现"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#一个数据库增量同步的简单实现"}},[_._v("#")]),_._v(" 一个数据库增量同步的简单实现")]),_._v(" "),t("blockquote",[t("p",[_._v("最初的想法要从上学期结束前，我开始设计去哪吃饭系统开始说起。那时候我还没了解到"),t("code",[_._v("localStorage")]),_._v("和"),t("code",[_._v("indexedDB")]),_._v("，因此想当然地认为要实现数据的持久化存储只能再搭建一个简单的后端。趁着放假，我又仔细思考了一下原来的设计，决定还是加上"),t("code",[_._v("indexedDB")]),_._v("，在前端实现数据的持久化，这样以后做PWA也方便。")])]),_._v(" "),t("h2",{attrs:{id:"核心目标"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#核心目标"}},[_._v("#")]),_._v(" 核心目标")]),_._v(" "),t("ul",[t("li",[_._v("首先，利用"),t("code",[_._v("localStorage")]),_._v("和"),t("code",[_._v("indexedDB")]),_._v("，可以在前端缓存下数据库，在网络条件允许时再尝试上传至后端数据库，应用即可完全脱离后端运行。")]),_._v(" "),t("li",[_._v("后端数据库需要能够合并来自不同设备的记录，并保持各个设备在同步后保持一致的状态。")]),_._v(" "),t("li",[_._v("冲突处理：不同设备可能提交对同一记录不同的更改，后端在理想情况下应当针对这种冲突行为提出警告。但由于这种情况较少发生，并且在项目中不对数据完整性作严格的要求，因此这里采用了最后修改时间作为合并标准，较晚修改的记录将覆盖较早修改的记录。")])]),_._v(" "),t("h2",{attrs:{id:"数据库设计"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#数据库设计"}},[_._v("#")]),_._v(" 数据库设计")]),_._v(" "),t("h3",{attrs:{id:"前端部分"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#前端部分"}},[_._v("#")]),_._v(" 前端部分")]),_._v(" "),t("p",[_._v("前端使用"),t("code",[_._v("localStorag")]),_._v("存储"),t("code",[_._v("last_sync")]),_._v("字段，该字段保存当前客户端的上次同步时间（时间戳形式）。")]),_._v(" "),t("p",[_._v("其余数据使用"),t("code",[_._v("indexedDB")]),_._v("存储，如下表所示：")]),_._v(" "),t("table",[t("thead",[t("tr",[t("th",[_._v("字段名")]),_._v(" "),t("th",[_._v("描述")])])]),_._v(" "),t("tbody",[t("tr",[t("td",[_._v("id")]),_._v(" "),t("td",[_._v("记录的唯一标识符，下面详细说明")])]),_._v(" "),t("tr",[t("td",[_._v("last_modified")]),_._v(" "),t("td",[_._v("记录最后修改时间")])]),_._v(" "),t("tr",[t("td",[_._v("status")]),_._v(" "),t("td",[_._v("记录状态(0-正常/1-删除)")])]),_._v(" "),t("tr",[t("td",[_._v("...")]),_._v(" "),t("td",[_._v("实际payload")])])])]),_._v(" "),t("p",[_._v("其中id为记录提供了全局唯一的标识，形式为UUID。")]),_._v(" "),t("hr"),_._v(" "),t("p",[t("strong",[_._v("不提供该字段会怎样？")])]),_._v(" "),t("p",[_._v("不提供该字段，对于前端来说影响不大。因为有"),t("code",[_._v("last_modified")]),_._v("字段的存在，修改依然可以正常地被推送到后端数据库。但是后端数据库仍然需要一组主键来定位后续的修改操作。但是如果主键依赖于后端数据库的生成，就需要区分新增和修改两种操作：")]),_._v(" "),t("ul",[t("li",[t("em",[_._v("前端的新增操作在同步时不需要传输主键，后端收到后为其分配一个主键，发送给前端，前端收到后修改数据库中主键为返回值，并移除新建标记")])]),_._v(" "),t("li",[_._v("修改操作需要传输主键，后端根据主键找到对应记录进行修改即可")])]),_._v(" "),t("p",[_._v("这样操作可能会导致前端具有许多不明确主键的记录，不如直接使用uuid创建全局唯一标识符作为id更为优雅。")]),_._v(" "),t("p",[t("strong",[_._v("为什么要用UUID？")])]),_._v(" "),t("p",[_._v("假设这里使用自增的方式生成id，那么不同的终端在使用时可能会产生相同的id，在同步时会认为是同一个记录，从而产生覆盖等现象。")]),_._v(" "),t("h3",{attrs:{id:"后端部分"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#后端部分"}},[_._v("#")]),_._v(" 后端部分")]),_._v(" "),t("p",[_._v("后端使用"),t("code",[_._v("SQLite")]),_._v("数据库存储，如下表所示：")]),_._v(" "),t("table",[t("thead",[t("tr",[t("th",[_._v("字段名")]),_._v(" "),t("th",[_._v("描述")])])]),_._v(" "),t("tbody",[t("tr",[t("td",[_._v("id")]),_._v(" "),t("td",[_._v("记录唯一标识符，同前端定义")])]),_._v(" "),t("tr",[t("td",[_._v("last_modified")]),_._v(" "),t("td",[_._v("最后修改时间，同前端定义")])]),_._v(" "),t("tr",[t("td",[_._v("status")]),_._v(" "),t("td",[_._v("记录状态，同前端定义")])]),_._v(" "),t("tr",[t("td",[_._v("last_push")]),_._v(" "),t("td",[_._v("最后推送时间，即该记录在后端的修改时间")])]),_._v(" "),t("tr",[t("td",[_._v("…")]),_._v(" "),t("td",[_._v("实际payload")])])])]),_._v(" "),t("p",[t("strong",[_._v("为什么要新增"),t("code",[_._v("last_push")]),_._v("字段？")])]),_._v(" "),t("p",[_._v("因为可能存在如下情况：")]),_._v(" "),t("table",[t("thead",[t("tr",[t("th",[_._v("时间")]),_._v(" "),t("th",[_._v("A终端")]),_._v(" "),t("th",[_._v("B终端")]),_._v(" "),t("th",[_._v("备注")])])]),_._v(" "),t("tbody",[t("tr",[t("td",[_._v("1")]),_._v(" "),t("td",[_._v("修改记录1")]),_._v(" "),t("td"),_._v(" "),t("td",[_._v("A最后修改时间=1")])]),_._v(" "),t("tr",[t("td",[_._v("2")]),_._v(" "),t("td"),_._v(" "),t("td",[_._v("同步")]),_._v(" "),t("td",[_._v("B最后同步时间=2")])]),_._v(" "),t("tr",[t("td",[_._v("3")]),_._v(" "),t("td",[_._v("同步")]),_._v(" "),t("td"),_._v(" "),t("td",[_._v("A最后同步时间=3")])]),_._v(" "),t("tr",[t("td",[_._v("4")]),_._v(" "),t("td"),_._v(" "),t("td",[_._v("同步")]),_._v(" "),t("td",[_._v("应拉取1-3的信息，但如果缺少"),t("code",[_._v("last_push")]),_._v("，会导致拉取为3的信息")])])])]),_._v(" "),t("p",[_._v("简单地说，后端需要处理==在上一次同步后同步上来的信息==而不是==修改时间在上一次同步后的信息==，这是因为修改信息和同步操作不一定发生在同一时刻。")]),_._v(" "),t("hr"),_._v(" "),t("p",[_._v("未完待续")])])}),[],!1,null,null,null);v.default=a.exports}}]);