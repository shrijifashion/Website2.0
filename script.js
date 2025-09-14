// ====== RENDER SAREES ======
function renderSarees(from = 0, to = Infinity, list = products) {
  const filtered = list.filter(item => item.price >= from && item.price <= to);
  const container = document.getElementById("filteredSarees");

  if (filtered.length === 0) {
    container.innerHTML = "<p>No sarees found.</p>";
    return;
  }

  container.innerHTML = filtered.map(item => `
    <div class="saree-item">
      <img src="${item.image}" alt="${item.name}">
      <h3>${item.name}</h3>
      <p>Price: ₹${item.price}</p>
      <p>${item.details}</p>
      <a class="whatsapp-order" target="_blank"
         href="https://wa.me/918200947518?text=${encodeURIComponent(`I want to order this saree: ${item.name} (₹${item.price})`) }">
         <img src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg">
         <span>Click to order</span>
      </a>
    </div>
  `).join('');
}

// ====== FILTER ======
function filterSarees() {
  const from = parseInt(document.getElementById('fromPrice').value) || 0;
  const to = parseInt(document.getElementById('toPrice').value) || Infinity;
  renderSarees(from, to);
}
function applyRange(from, to) {
  document.getElementById('fromPrice').value = from || "";
  document.getElementById('toPrice').value = isFinite(to) ? to : "";
  renderSarees(from, to);
}

// ====== SEARCH ======
function searchSarees() {
  const q = document.getElementById("searchBar").value.toLowerCase();
  const filtered = products.filter(p => p.name.toLowerCase().includes(q));
  renderSarees(0, Infinity, filtered);
}

// ====== SLIDER ======
let currentIndex = 0;
const track = document.getElementById("sliderTrack");

// Fill slider
track.innerHTML = products.map(item => `
  <div class="saree-card">
    <img src="${item.image}" alt="${item.name}">
    <h3>${item.name}</h3>
    <p>₹${item.price}</p>
  </div>
`).join('');

// Duplicate for infinite scroll
const cards = track.querySelectorAll(".saree-card");
const cardWidth = cards[0].offsetWidth + 20;
const total = cards.length;
track.innerHTML = track.innerHTML + track.innerHTML + track.innerHTML;
currentIndex = total;
updateSlider(false);

function slideNext() { currentIndex++; updateSlider(); }
function slidePrev() { currentIndex--; updateSlider(); }
function updateSlider(smooth = true) {
  track.style.transition = smooth ? "transform 0.5s ease" : "none";
  track.style.transform = `translateX(-${currentIndex * cardWidth}px)`;

  if (currentIndex >= total * 2) {
    setTimeout(() => { currentIndex = total; updateSlider(false); }, 500);
  }
  if (currentIndex <= total - 1) {
    setTimeout(() => { currentIndex = total; updateSlider(false); }, 500);
  }
}
setInterval(slideNext, 3000);

// ====== SWIPE (Mobile touch support) ======
let startX = 0;
track.addEventListener("touchstart", e => startX = e.touches[0].clientX);
track.addEventListener("touchend", e => {
  let diff = e.changedTouches[0].clientX - startX;
  if (diff > 50) slidePrev();
  if (diff < -50) slideNext();
});

// ====== DRAG-TO-SCROLL (Desktop hand scroll) ======
let isDown = false;
let dragStartX;
let scrollStart;

track.addEventListener("mousedown", (e) => {
  isDown = true;
  track.classList.add("dragging");
  dragStartX = e.pageX;
  scrollStart = track.scrollLeft;
  e.preventDefault();
});

track.addEventListener("mouseleave", () => {
  isDown = false;
  track.classList.remove("dragging");
});

track.addEventListener("mouseup", () => {
  isDown = false;
  track.classList.remove("dragging");
});

track.addEventListener("mousemove", (e) => {
  if (!isDown) return;
  const dx = e.pageX - dragStartX;
  track.scrollLeft = scrollStart - dx;
});

// ====== FORM SUBMIT ======
const scriptURL = "https://script.google.com/macros/s/AKfycbxV8UOrwGG5k_aGKFLOS2FICNUlYIA8cscxnDgP6i-eaGlb8QEL-wj5mNJrcUeXNII/exec"; 
const form = document.getElementById("enquiryForm");
const responseBox = document.getElementById("formResponse");

form.addEventListener("submit", e => {
  e.preventDefault();
  responseBox.style.display = "block";
  responseBox.textContent = "⏳ Sending...";
  responseBox.className = "form-response";

  const formData = new FormData(form);
  const name = formData.get("name");
  const phone = formData.get("phone");
  const saree = formData.get("saree") || "a saree";
  const message = formData.get("message") || "No message provided";

  fetch(scriptURL, { method: "POST", body: formData })
    .then(() => {
      responseBox.textContent = "✅ Your enquiry has been sent successfully!";
      responseBox.classList.add("success");

      // Open WhatsApp auto-message
      const shopNumber = "918200947518"; // Shop owner number
      const autoMsg = `Hello Shriji Fashion 🌸,
My name is ${name}.
I am interested in ${saree}.
Here is my message: ${message}.
Please contact me at ${phone}.`;

      window.open(`https://wa.me/${shopNumber}?text=${encodeURIComponent(autoMsg)}`, "_blank");

      form.reset();
      setTimeout(() => responseBox.style.display = "none", 3000);
    })
    .catch(() => {
      responseBox.textContent = "❌ Oops! Something went wrong. Please try again.";
      responseBox.classList.add("error");
    });
});

// ====== SCROLL UP BUTTON ======
const scrollBtn = document.getElementById("scrollUpBtn");

window.addEventListener("scroll", () => {
  if (document.body.scrollTop > 200 || document.documentElement.scrollTop > 200) {
    scrollBtn.classList.add("show");
  } else {
    scrollBtn.classList.remove("show");
  }
});

scrollBtn.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});
