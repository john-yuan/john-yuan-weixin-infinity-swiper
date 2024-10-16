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
     * Swiper item 列表，大小固定为 3 个，其中 dataIndex 代表真实
     * 数据 list 中的下标，使用 dataIndex 时需要判断下标是否越界
     */
    swiperItems: [
      { dataIndex: 0 },
      { dataIndex: 1 },
      { dataIndex: -1 }
    ]
  },

  onSwiperChange(e) {
    const nextCurrent = e.detail.current
    const originalCurrent = this.data.swiperCurrent

    // 如果 nextCurrent 等于前一个 swiper-item 的 index 则表示向左滚动
    const goPrev = nextCurrent === (originalCurrent - 1 + 3) % 3
    
    // 如果 nextCurrent 等于后一个 swiper-item 的 index 则表示向右滚动
    const goNext = nextCurrent === (originalCurrent + 1) % 3

    const prevDataIndex = this.data.swiperItems[originalCurrent].dataIndex
    
    // 如果是第一条数据，则禁止滑动到上一个 item
    if (prevDataIndex === 0 && goPrev) {
      this.setData({ swiperCurrent: originalCurrent })
      return
    }

    // 如果是最后一条数据，则禁止滑动到下一个 item
    if ((prevDataIndex + 1) === this.data.list.length && goNext) {
      this.setData({ swiperCurrent: originalCurrent })
      return
    }

    const swiperItems = [...this.data.swiperItems]
    const swiperCurrent = e.detail.current
    const prevIndex = (swiperCurrent - 1 + 3) % 3
    const nextIndex = (swiperCurrent + 1) % 3
    const dataIndex = swiperItems[swiperCurrent].dataIndex

    // 确保 prevIndex 中的数据是 dataIndex 的上一条数据
    swiperItems[prevIndex] = { dataIndex: dataIndex - 1 }

    // 确保 nextIndex 中的数据是 dataIndex 的下一条数据
    swiperItems[nextIndex] = { dataIndex: dataIndex + 1 }

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

    let items = this.data.swiperItems.map((el) => el.dataIndex)
    let current = this.data.swiperCurrent
    let dataIndex = items[current]

    if (dataIndex === targetIndex) {
      return
    }

    while (dataIndex !== targetIndex) {
      if (dataIndex < targetIndex) {
        current = (current + 1) % 3
        dataIndex += 1
      } else {
        current = (current - 1 + 3) % 3
        dataIndex -= 1
      }
      items[(current - 1 + 3) % 3] = dataIndex - 1
      items[(current + 1) % 3] = dataIndex + 1
    }

    this.setData({ swiperDuration: 0 }, () => {
      this.setData({
        swiperCurrent: current,
        swiperItems: items.map((i) => ({ dataIndex: i })),
      }, () => {
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
