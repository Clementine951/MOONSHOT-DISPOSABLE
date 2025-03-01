document.addEventListener("DOMContentLoaded", () => {
    const track = document.querySelector(".carouselContent");
    // Get the original items (the ones that are in the DOM at load)
    const originalItems = Array.from(document.querySelectorAll(".carouselItem"));
    const prevBtn = document.querySelector(".prevBtn");
    const nextBtn = document.querySelector(".nextBtn");
  
    // Number of visible items at once – in your case, 3.
    const visibleCount = 3;
  
    // Clone last 'visibleCount' items and prepend them
    originalItems.slice(-visibleCount).forEach(item => {
      const clone = item.cloneNode(true);
      clone.classList.add("clone");
      track.insertBefore(clone, track.firstChild);
    });
  
    // Clone all original items and append them
    originalItems.forEach(item => {
      const clone = item.cloneNode(true);
      clone.classList.add("clone");
      track.appendChild(clone);
    });
  
    // Now get all slides (including clones)
    const slides = Array.from(document.querySelectorAll(".carouselItem"));
  
    // Set the initial index to 'visibleCount' so that the first original slide is in the center.
    let currentIndex = visibleCount;
  
    // Function to update the carousel position.
    // The parameter 'transition' (default true) controls whether the movement is animated.
    function updateCarousel(transition = true) {
      track.style.transition = transition ? "transform 0.5s ease" : "none";
      const slideWidth = slides[0].getBoundingClientRect().width;
      const gap = parseFloat(window.getComputedStyle(track).gap) || 0;
      const distance = (slideWidth + gap) * currentIndex;
      track.style.transform = `translateX(-${distance}px)`;
    }
  
    // Initialize position (without transition for instant setup)
    updateCarousel(false);
  
    // Calculate boundaries:
    // Original items start at index = visibleCount
    // and end at index = visibleCount + (number of original items) - 1.
    const firstOriginalIndex = visibleCount;
    const lastOriginalIndex = visibleCount + originalItems.length - 1;
  
    // Next button event
    nextBtn.addEventListener("click", () => {
      currentIndex++;
      updateCarousel();
      // If we've moved into the cloned area at the end...
      if (currentIndex > lastOriginalIndex) {
        // Wait for the transition to finish, then jump back without animation.
        setTimeout(() => {
          currentIndex = firstOriginalIndex;
          updateCarousel(false);
        }, 500); // must match transition duration (0.5s)
      }
    });
  
    // Prev button event
    prevBtn.addEventListener("click", () => {
      currentIndex--;
      updateCarousel();
      // If we've moved into the cloned area at the beginning...
      if (currentIndex < firstOriginalIndex) {
        setTimeout(() => {
          currentIndex = lastOriginalIndex;
          updateCarousel(false);
        }, 500);
      }
    });
  });
  