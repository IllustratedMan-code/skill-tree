

function handler(entries, observer) {
  entries.forEach(entry => {
    const id = entry.target.getAttribute('id');
    let elem = document.querySelector(`nav li a[href="#${id}"]`)
    if (entry.intersectionRatio > 0) {
      elem.parentElement.classList.add('active');
      elem.parentElement.parentElement.parentElement.classList.add('visible')
    } else {
      elem.parentElement.classList.remove('active');
      elem.parentElement.parentElement.parentElement.classList.remove('visible')
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
  populate_themes()
  cookie = document.cookie
  let regex = /theme=([\w-^;]*)/
  let theme = cookie.match(regex)
  if (theme === null) {
    setTheme("nord")
  } else {
    setTheme(theme[1])
  }

});


document.querySelectorAll('#TOC > ul > li').forEach((elem) => {
  if (elem.querySelector('ul')) {
    let b = document.createElement("button");
    b.innerHTML = "<svg width='10' height='10' viewBox='0 0 100 100'> <path d='M0 100 L100 50 L0 0 Z'/><svg/>";
    b.onclick = function () {
      if (b.parentElement.classList.contains("visible")) {
        b.parentElement.classList.remove("visible");
      } else {
        b.parentElement.classList.add("visible");
      }
    };
    elem.prepend(b);
  }
})
async function populate_themes() {
  const response = await fetch('./base16/base16.json');
  const themes = await response.json();
  for (const name in themes) {
    let option = document.createElement("option")
    option.value = name;
    option.innerHTML = name;
    document.getElementById("theme").appendChild(option);
  }
}
async function setTheme(theme_name) {
  const response = await fetch('./base16/base16.json');
  const themes = await response.json();
  const theme = themes[theme_name]
  let root = document.documentElement;
  root.style.setProperty("--color0", "#" + theme["base00"])
  root.style.setProperty("--color1", "#" + theme["base01"])
  root.style.setProperty("--color2", "#" + theme["base02"])
  root.style.setProperty("--color3", "#" + theme["base03"])
  root.style.setProperty("--color4", "#" + theme["base04"])
  root.style.setProperty("--color5", "#" + theme["base05"])
  root.style.setProperty("--color6", "#" + theme["base06"])
  root.style.setProperty("--color7", "#" + theme["base07"])
  root.style.setProperty("--color8", "#" + theme["base08"])
  root.style.setProperty("--color9", "#" + theme["base09"])
  root.style.setProperty("--color10", "#" + theme["base0A"])
  root.style.setProperty("--color11", "#" + theme["base0B"])
  root.style.setProperty("--color12", "#" + theme["base0C"])
  root.style.setProperty("--color13", "#" + theme["base0D"])
  root.style.setProperty("--color14", "#" + theme["base0E"])
  root.style.setProperty("--color15", "#" + theme["base0F"])
  document.cookie = `theme=${theme_name}; SameSite=Strict`
  document.getElementById("theme").value = theme_name
}
