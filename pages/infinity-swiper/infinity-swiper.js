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
     * Swiper item 列表，大小固定为 3 个，其中 dataIndex 代表真实数据 list 中的下标
     */
    swiperItems: [
      { dataIndex: 0 },
      { dataIndex: 1 },
      { dataIndex: 2 }
    ],

    /**
     * 用于记录当前的 swiper 位置
     */
    swiperCurrent: 0,

    /**
     * 滑动动画时长
     */
    swiperDuration: SWIPER_DURATION
  },

  onSwiperChange(e) {
    const nextCurrent = e.detail.current
    const prevCurrent = this.data.swiperCurrent

    // 检测滑动方向
    const goPrev = nextCurrent === ((prevCurrent + 3 - 1) % 3)
    const goNext = nextCurrent === ((prevCurrent + 1) % 3)

    const prevDataIndex = this.data.swiperItems[prevCurrent].dataIndex
    
    // 如果是第一条数据，则禁止滑动到上一个 item
    if (prevDataIndex === 0 && goPrev) {
      this.setData({ swiperCurrent: prevCurrent })
      return
    }

    // 如果是最后一条数据，则禁止滑动到下一个 item
    if ((prevDataIndex + 1) === this.data.list.length && goNext) {
      this.setData({ swiperCurrent: prevCurrent })
      return
    }

    let swiperItems = this.data.swiperItems

    const swiperCurrent = e.detail.current
    const prevIndex = (swiperCurrent + 3 - 1) % 3
    const nextIndex = (swiperCurrent + 1) % 3
    const dataIndex = swiperItems[swiperCurrent].dataIndex

    // 确保 prevIndex 中的数据是 dataIndex 的上一条数据
    if (swiperItems[prevIndex].dataIndex !== (dataIndex - 1)) {
      swiperItems = [...swiperItems]
      swiperItems[prevIndex] = { dataIndex: dataIndex - 1 }
    }

    // 确保 nextIndex 中的数据是 dataIndex 的下一条数据
    if (swiperItems[nextIndex].dataIndex !== (dataIndex + 1)) {
      swiperItems = [...swiperItems]
      swiperItems[nextIndex] = { dataIndex: dataIndex + 1 }
    }

    this.setData({ swiperCurrent, swiperItems })
  },

  swipeTo(target) {
    if (typeof target !== 'number' || isNaN(target)) {
      return
    }

    if (target < 0 || target >= this.data.list.length) {
      return
    }

    let items = this.data.swiperItems.map((el) => el.dataIndex)
    let current = this.data.swiperCurrent
    let dataIndex = items[current]

    if (dataIndex === target) {
      return
    }

    while (dataIndex !== target) {
      if (dataIndex < target) {
        current = (current + 1) % 3
        dataIndex += 1
      } else {
        current = (current + 3 - 1) % 3
        dataIndex -= 1
      }

      items[(current + 3 - 1) % 3] = dataIndex - 1
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
