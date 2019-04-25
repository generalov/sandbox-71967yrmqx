import $ from 'jquery'
import './styles.css'

const header = {
  selector: '.StickyHeader',

  getSize() {
    return $(this.selector).height() + 20
  },

  setTitle(currentSection) {
    $(this.selector)
      .find('p')
      .html($(currentSection).html())
  }
}

const toc = {
  selector: '.Menu',

  highlightMenuItem(link) {
    $(link)
      .closest(this.selector)
      .find('.Menu-item.is-current')
      .removeClass('is-current')
    $(link)
      .closest('.Menu-item')
      .addClass('is-current')
  },

  findById(id) {
    return $(toc.selector).find(`.Menu-item [href="#${id}"]`)
  }
}

const doc = {
  selector: 'html, body',

  scrollToElement(elem) {
    const scrollTop = $(elem).offset().top - header.getSize()
    $(this.selector)
      .stop(true, false)
      .animate({ scrollTop }, 350)
  },

  calcCurrentSection() {
    return $('h2')
      .toArray()
      .map(e => [e.getBoundingClientRect().top, e])
      .reduce((min, val) =>
        val[0] <= header.getSize() && val[0] > min[0] ? val : min
      )[1]
  }
}

function onTocClick(e) {
  e.preventDefault()
  const currentMenuLink = $(e.target)
  const currentSection = $(currentMenuLink.attr('href'))

  toc.highlightMenuItem(currentMenuLink)
  doc.scrollToElement(currentSection)
  header.setTitle(currentSection)
}

function onDocumentScroll(e) {
  const currentSection = doc.calcCurrentSection()
  const currentMenuLink = toc.findById(currentSection.id)

  toc.highlightMenuItem(currentMenuLink)
  header.setTitle(currentSection)
}

$(() => {
  $().off('.ns')
  $(toc.selector).on('click.ns', '.Menu-item a', onTocClick)
  $(window).on('scroll.ns', onDocumentScroll)
})
