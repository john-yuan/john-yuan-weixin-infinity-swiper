function mockList(length) {
  const list = []

  for (let i = 0; i < length; i += 1) {
    list.push({ content: 'List item ' + (i + 1)})
  }

  return list
}

const SWIPER_DURATION = 300

Page({
  data: {
    /**
     * 真实数据列表
     */
    list: mockList(10000),

    /**
     * 用于控制 swiper 滑动动画时长
     */
    swiperDuration: SWIPER_DURATION,

    /**
     * 用于记录当前所在滑块的 index
     */
    swiperCurrent: 0,

    /**
     * Swiper item 列表，大小固定为 3 个，数组中的元素代表真实数据 list 中
     * 的下标 itemIndex，使用 itemIndex 时需要判断下标是否越界
     */
    swiperItems: [0, 1, -1]
  },

  onSwiperChange(e) {
    const nextCurrent = e.detail.current
    const originalCurrent = this.data.swiperCurrent

    // 如果 nextCurrent 等于前一个 swiper-item 的 index 则表示向左滚动
    const goPrev = nextCurrent === (originalCurrent - 1 + 3) % 3

    // 如果 nextCurrent 等于后一个 swiper-item 的 index 则表示向右滚动
    const goNext = nextCurrent === (originalCurrent + 1) % 3

    const prevItemIndex = this.data.swiperItems[originalCurrent]
    
    // 如果是第一条数据，则禁止滑动到上一个 item
    if (prevItemIndex === 0 && goPrev) {
      this.setData({ swiperCurrent: originalCurrent })
      return
    }

    // 如果是最后一条数据，则禁止滑动到下一个 item
    if (prevItemIndex === (this.data.list.length - 1) && goNext) {
      this.setData({ swiperCurrent: originalCurrent })
      return
    }

    const swiperItems = [...this.data.swiperItems]
    const swiperCurrent = e.detail.current
    const prevIndex = (swiperCurrent - 1 + 3) % 3
    const nextIndex = (swiperCurrent + 1) % 3
    const itemIndex = swiperItems[swiperCurrent]

    // 确保前面的 swiper-item 的数据是 itemIndex 的前一条数据
    swiperItems[prevIndex] = itemIndex - 1

    // 确保后面的 siwper-item 的数据是 itemIndex 的后一条数据
    swiperItems[nextIndex] = itemIndex + 1

    this.setData({ swiperCurrent, swiperItems })
  },

  /**
   * 跳转到指定的位置
   * 
   * @param targetIndex {number} 目标位置的下标
   */
  swipeTo(targetIndex) {
    if (typeof targetIndex !== 'number' || isNaN(targetIndex)) {
      return
    }

    if (targetIndex < 0 || targetIndex >= this.data.list.length) {
      return
    }

    let swiperItems = [...this.data.swiperItems]
    let swiperCurrent = this.data.swiperCurrent
    let itemIndex = swiperItems[swiperCurrent]

    if (itemIndex === targetIndex) {
      return
    }

    while (itemIndex !== targetIndex) {
      if (itemIndex < targetIndex) {
        swiperCurrent = (swiperCurrent + 1) % 3
        itemIndex += 1
      } else {
        swiperCurrent = (swiperCurrent - 1 + 3) % 3
        itemIndex -= 1
      }
      swiperItems[(swiperCurrent - 1 + 3) % 3] = itemIndex - 1
      swiperItems[(swiperCurrent + 1) % 3] = itemIndex + 1
    }

    this.setData({ swiperDuration: 0 }, () => {
      this.setData({ swiperItems, swiperCurrent }, () => {
        this.setData({ swiperDuration: SWIPER_DURATION })
      })
    })
  },

  swipeTest1() {
    this.swipeTo(4)
  },

  swipeTest2() {
    this.swipeTo(4999)
  },

  swipeTest3() {
    this.swipeTo(9994)
  }
})
