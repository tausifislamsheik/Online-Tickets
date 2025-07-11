document.addEventListener('DOMContentLoaded', function() {
    // Constants
    const SEAT_PRICE = 550;
    const MAX_SEATS = 4;
    
    
    // DOM Elements
    const seats = document.querySelectorAll('.seat:not(.cursor-not-allowed)');
    const seatList = document.getElementById('total-ticket-list');
    const totalPriceEl = document.getElementById('total-price');
    const grandTotalEl = document.getElementById('grand-total');
    const seatCountEl = document.getElementById('seat-count');
    const couponInput = document.getElementById('coupon-input');
    const applyBtn = document.getElementById('apply-btn');
    const nextBtn = document.querySelector('#next-btn');
    const nameInput = document.querySelector('input[placeholder="Enter your name"]');
    const phoneInput = document.querySelector('input[placeholder="Enter your phone number"]');
    const emailInput = document.querySelector('input[placeholder="Enter your email id"]');
    
    // State
    let selectedSeats = [];
    let appliedDiscount = 0;
    
    // Initialize
    updateSeatList();
    validateForm(); // Initialize button state
    
    // Seat Selection
    seats.forEach(seat => {
        seat.addEventListener('click', () => {
            const seatId = seat.id;
            
            if (seat.classList.contains('bg-[#1DD100]')) {
                // Deselect seat
                seat.classList.remove('bg-[#1DD100]', 'text-white', 'selected');
                seat.classList.add('bg-[#F7F8F8]', 'text-gray-500');
                selectedSeats = selectedSeats.filter(s => s !== seatId);
            } else {
                // Check max seats
                if (selectedSeats.length >= MAX_SEATS) {
                    showToast(`You can select a maximum of ${MAX_SEATS} seats.`);
                    return;
                }
                
                // Select seat
                seat.classList.remove('bg-[#F7F8F8]', 'text-gray-500');
                seat.classList.add('bg-[#1DD100]', 'text-white', 'selected');
                selectedSeats.push(seatId);
            }
            
            updateSeatList();
            validateForm(); // Validate after seat change
        });
    });
    
    // Coupon Application
    applyBtn.addEventListener('click', () => {
        const coupon = couponInput.value.trim();
        const total = selectedSeats.length * SEAT_PRICE;
        
        if (coupon === 'COUPLE20') {
            appliedDiscount = 0.2;
            showToast('Coupon Verified', 'success');
        } else if (coupon === 'NEW15') {
            appliedDiscount = 0.15;
            showToast('Coupon Verified', 'success');
        } else {
            showToast('Invalid coupon code');
            return;
        }
        
        const discountedTotal = total - (total * appliedDiscount);
        grandTotalEl.textContent = Math.floor(discountedTotal);
        couponInput.value = '';
        applyBtn.disabled = true;
    });
    
    // Form Validation
    function validateForm() {
        const isNameValid = nameInput.value.trim() !== '';
        const isPhoneValid = phoneInput.value.trim().length >= 11;
        const hasSelectedSeats = selectedSeats.length > 0;
        
        // Enable Next button only if all conditions are met
        nextBtn.disabled = !(isNameValid && isPhoneValid && hasSelectedSeats);

        if(isNameValid && isPhoneValid && hasSelectedSeats){
            nextBtn.classList.remove('disabled')
        }else{
            nextBtn.classList.add('disabled')
        }
        
        // Visual feedback (optional)
        nameInput.style.borderColor = isNameValid ? '#1DD100' : '#ff0000';
        phoneInput.style.borderColor = isPhoneValid ? '#1DD100' : '#ff0000';
    }
    
    // Add input event listeners for real-time validation
    [nameInput, phoneInput].forEach(input => {
        input.addEventListener('input', validateForm);
    });
    
    // Update Seat List and Totals
    function updateSeatList() {
        seatList.innerHTML = '';
        
        selectedSeats.forEach(seatId => {
            const seatElement = document.createElement('div');
            seatElement.className = 'flex justify-between mt-2 text-gray-400 px-2';
            seatElement.innerHTML = `
                <p class="text-sm font-medium">${seatId}</p>
                <p class="text-sm font-medium">Economy</p>
                <p class="text-sm font-medium">${SEAT_PRICE}</p>
            `;
            seatList.appendChild(seatElement);
        });
        
        const total = selectedSeats.length * SEAT_PRICE;
        seatCountEl.textContent = selectedSeats.length;
        totalPriceEl.textContent = total;
        grandTotalEl.textContent = Math.floor(total - (total * appliedDiscount));
        
        applyBtn.disabled = selectedSeats.length === 0;
        validateForm(); // Re-validate after seat changes
    }
    
    // Booking Confirmation
    nextBtn.addEventListener('click', (e) => {
  e.preventDefault();

  if (nextBtn.disabled) return;

  Swal.fire({
    icon: 'success',
    title: `Booking Confirmed!`,
    html: `
      <div class='text-left font-inter'>
        <b>Passenger:</b> <span class='text-gray-500'>${nameInput.value}</span><br>
        <b>Phone:</b> <span class='text-gray-500'>${phoneInput.value}</span><br>
        <b>Email:</b> <span class='text-gray-500'>${emailInput.value || 'Not Provided'}</span><br>
        <b>Seats:</b> <span class='text-gray-500'>${selectedSeats.join(', ')}</span><br>
        <b>Total:</b> <span class='text-gray-500'>${grandTotalEl.textContent} BDT</span>
      </div>
    `,
    confirmButtonColor: '#1DD100',
    confirmButtonText: 'Done'
  });

  resetBooking();
});

    
    // Reset Booking
    function resetBooking() {
        // Reset selected seats
        selectedSeats.forEach(seatId => {
            const seat = document.getElementById(seatId);
            if (seat) {
                seat.classList.remove('bg-[#1DD100]', 'text-white', 'selected');
                seat.classList.add('bg-[#F7F8F8]', 'text-gray-500');
            }
        });
        
        // Reset state
        selectedSeats = [];
        appliedDiscount = 0;
        
        // Reset UI
        seatList.innerHTML = '';
        seatCountEl.textContent = '0';
        totalPriceEl.textContent = '0';
        grandTotalEl.textContent = '0';
        couponInput.value = '';
        nameInput.value = '';
        phoneInput.value = '';
        emailInput.value = '';
        
        // Reset buttons
        applyBtn.disabled = true;
        nextBtn.disabled = true;
        
        // Reset input borders (if using visual feedback)
        nameInput.style.borderColor = '';
        phoneInput.style.borderColor = '';
    }
    
});

// Buy tickets button scroll functionality

const scrollToViewMore = () =>{
    const seatSection = document.querySelector('#seat-container');
    seatSection.scrollIntoView({ behavior: 'smooth' });
};


// Toast functions
const showToast = (message, type = 'error') => {
  const toast = document.getElementById('toast');
  const toastMessage = document.getElementById('toast-message');
  
  // Set message and style based on type
  toastMessage.textContent = message;
  toast.firstElementChild.className = 
    `px-4 py-3 rounded-lg shadow-lg flex items-center animate-fade-in ${
      type === 'error' ? 'bg-red-500' : 
      type === 'success' ? 'bg-green-500' : 
      'bg-blue-500'
    } text-white`;
  
  toast.classList.remove('hidden');
  
  // Auto-hide after 5 seconds
  setTimeout(hideToast, 5000);
};

const hideToast = () => {
  document.getElementById('toast').classList.add('hidden');
};

// Example usage


const validateNumber = () => {
  const input = document.getElementById('number-input');
  const value = parseInt(input.value);
  
  if (isNaN(value)) {
    showToast("Please enter a valid number!", 'error');
    input.focus();
  } else {
    showToast("Valid number entered!", 'success');
  }
};