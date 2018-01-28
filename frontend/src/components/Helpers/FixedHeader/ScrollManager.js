class ScrollManager {
  constructor (callbacks) {
    this.callbacks = callbacks

    this.scrollContainerEl = null
    this.scrollPosition = null
  }

  init (scrollContainerEl) {
    this.scrollContainerEl = scrollContainerEl
    this.scrollContainerEl.addEventListener('scroll', this.onScroll.bind(this))
  }

  onScroll () {
    const scrollPosition = this.scrollContainerEl.scrollTop
    this.scrollPosition = scrollPosition
    // console.log(scrollPosition)
    if (this.scrollPosition > 0) {
      this.callbacks.inside()
    } else {
      this.callbacks.reachedStart()
    }
  }

  scrollToTop () {
    this.scrollContainerEl.scrollTop = 0
  }

  destroy () {
    this.scrollContainerEl.removeEventListener('scroll', this.onScroll)
  }
}

export default ScrollManager
