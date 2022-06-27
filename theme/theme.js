

function handler (entries, observer) {
    entries.forEach(entry => {
      const id = entry.target.getAttribute('id');
      let elem = document.querySelector(`nav li a[href="#${id}"]`)
      if (entry.intersectionRatio > 0) {
        elem.parentElement.classList.add('active');
        elem.parentElement.parentElement.parentElement.classList.add('visible')
      } else {
        elem.parentElement.classList.remove('active');
        elem.parentElement.parentElement.parentElement.classList.remove('visible')
        console.log(id);
      }
    });
}
const options = {
  // 🆕 Track the actual visibility of the element
  // 🆕 =====ANSWER=====: Set a minimum delay between notifications
}


window.addEventListener('DOMContentLoaded', () => {
  const observer = new IntersectionObserver(handler, options)
  document.querySelectorAll('#content h1[id], h2[id]').forEach((section) => {
    observer.observe(section);
  });
  
});
