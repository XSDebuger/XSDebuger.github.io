---
title: 使用Tkinter开发基于Jieba的剧情分词工具
date: 2020/03/30
author: Zjm
location: Hangzhou
tags:
    - Python
    - Tkinter
    - NLP
---


# 使用Tkinter开发基于Jieba的剧情分词工具

先上个成果图吧：

![UI界面](https://github.com/KXXH/KR_plot_analysis/raw/master/img/tool_ui_1.png)

## 实现的功能

- 共现矩阵的生成和导出——帮助生成关系图
- 频繁模式的识别和导出——帮助分析人物关系
- 词频的统计和导出
- 分词和导出
- 角色和别名识别（人工录入）

## 用Tk写GUI真的反人类



Tk和一大波有着悠久历史的GUI框架，布局文件和业务逻辑代码不分。想来想去最好的办法是用类和继承来封装控件，不过一开始就只打算做个小工具，所以没有做类的封装。结果搞得十分头大，全局变量一堆，UI逻辑代码就奔着400行去了，唉，还是太年轻了😂。有机会再重构吧。

![UI整体结构](./plot_tool_ui_1.png)

在Tk中，只有三种布局方式，pack，place和grid。其中，pack只能选择飘到某一边，place只能根据绝对位置进行定位，二者都不如grid灵活。不过，通过pack和Frame组合，也能起到不错的效果。我们这里使用grid布局，使用Frame整合较小的部件，以方便布局。蓝色的Frame是文字编辑区域，使用`Notebook`组件实现标签切换。每个标签下有一个`Text`，显示文字内容。

实际上这三个Tag之间是有联系的，当切换到分句或者分词时，应该**根据填入的剧情去刷新分句和分词的内容**。但是`Notebook`组件的唯一事件——`<<NotebookTabChanged>>`携带的参数似乎并不能真实反映选中激活的Tag。因此不得不使用比较Low的办法，手动在获得事件回调时，获取当前激活的Tag，进行比较：

```python
def tab_switch_callback(event):
    index = main_ntb.index(main_ntb.select())
    if index == 0:
        pass
    elif index == 1:
        text = plot_text.get("1.0", END)
        mt.set_text(text)
        refresh_splited_text()
    elif index == 2:
        text = plot_text.get("1.0", END)
        mt.set_text(text)
        refresh_cut_text()
...
main_ntb.bind("<<NotebookTabChanged>>", tab_switch_callback)

```

当然每次点击就发送文本给分词器开销未免太大，特别是在文本较长的情况下。因此我使用了一些缓存，每次对分词器调用`set_text`方法时，会先比对发送来的文本与已有文本是否一致。如果一致则忽略，否则，积极修改分句结果（因为分句使用正则表达式，效率还是比较高的），惰性修改分词结果（清除分词结果缓存，下次调用分词方法时重新生成）。

@flowstart

st=>start: 开始
e=>end: 结束
cache_cond=>condition: Cut结果为空？
cut=>operation: 生成分词信息
store=>operation: 保存到Cut结果
return=>operation: 返回Cut结果

st->cache_cond
cache_cond(no)->cut->store->return->e
cache_cond(yes)->return->e
@flowend

```python
    def set_text(self, text):
        text = text.strip()
        if self.text != text:
            self.text = text
            self._split_text()
            self._cache_expired()  # 缓存过期
```

## 关于分词词典和名称处理

分词词典是一定要做的，因为通常的剧情介绍中都含有大量的人名，而人名在分词中是有一定概率被切开的。同时，我们也要处理各种指向同一个人的别称。NLP中有“共指消解”也是类似于这一目的。但是目前在中文领域共指消解的效果并不是十分理想，因此我们还是选用了手动录入别称的办法。

我们在分词器中使用了两个字典来保存这一组信息。其中一组称为“名称字典”，保存的Key是角色的*正式名称*（出现在共现矩阵等位置的名称），value是角色的别名的*集合*。该部分用于直观地管理一个角色拥有的多个别名。另一组称之为“倒排名称字典”，类似于搜索引擎中的倒排索引的究极简化版。这一部分保存的是别名→角色名的映射，用于替换角色的别名。当需要分词时，我们用两组字典的Key的集合的并集作为分词字典。

@flowstart
st=>start: 开始
gen_dict=>operation: 生成分词字典
import_dict=>operation: 导入分词器
cut=>operation: 分词
replace=>operation: 将角色别名替换为角色正式名称
filter=>operation: 过滤掉停用词
diff=>operation: 求结果和分词字典的交集
e=>end: 结束

st->gen_dict->import_dict->cut->replace->filter->diff->e
e=>end: 结束
@flowend

经过上述操作就可以得到每行出现的角色。

```python
    def names_by_sentence(self, drop_empty=False):
        cut_result = self.cut()
        words_dict = self._generate_words_dict()
        for line in cut_result:
            #替换角色名
            word_set = set(self.reversed_name_dict.get(
                word) or word for word in line)
            #过滤停用词
            word_set_without_stopwords = set(filter(
                lambda word: word not in self.STOPWORDS, word_set))
            #取剩余结果和角色名字典的交集
            name_set = word_set_without_stopwords & words_dict
            if drop_empty and not name_set:
                continue
            yield name_set
```



## 关于共现矩阵

稍微找了一下，也没有看到方便的共现矩阵库，于是自己写了一个很~~简陋~~简单的实现。整体的复杂度还是挺高的，利用了`itertools.combinations`这一魔法迭代器，即：对于每行提取出的角色集合，生成他们的所有长度为2的组合。对于每一个组合，我们计算其出现了一次。由于共现矩阵应该是比较稀疏的，因此使用`defaultdict`，可以比较方便地抽象这一种情形（当然，`Counter`也可以。但是`Counter`只能对元组计数，如果只是统计角色对的出现次数是没有任何问题，而且能把代码写得更加简洁，不过我们想要的是矩阵，`Counter`的Key是元组，需要多一层转换。）

```python
    def co_present(self):
        res = defaultdict(lambda: defaultdict(int))
        for name_set in self.names_by_sentence():
            for name1, name2 in combinations(name_set, 2):
                res[name1][name2] += 1
                res[name2][name1] += 1
        return res

```

## 遗憾

- ~~目前，还需要先选中角色，点击【选中角色】，才能选中该角色，编辑和查看其对应的别名。实际上这一步是赘余的、误导性的、破坏用户体验的。可以使用事件侦听处理掉。~~目前已使用事件侦听处理。
- 没有使用面向对象的方式处理GUI。这是最大的痛点，后期维护上比较困难。
- 使用Tk！Tk确实还是有很大的制约性的，各种控件的回调比较不自由，虽然可以通过事件侦听解决，但是可能会使得一些上下文相关的代码四散在各处（包括新建UI对象、UI的config、UI的variable设置、UI渲染都有各自的函数），在阅读代码时可能会有困难。