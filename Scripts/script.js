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
    const nextBtn = document.querySelector('button[class*="bg-\\[#1DD100\\]"]');
    const nameInput = document.querySelector('input[placeholder="Enter your name"]');
    const phoneInput = document.querySelector('input[placeholder="Enter your phone number"]');
    const emailInput = document.querySelector('input[placeholder="Enter your email id"]');
    
    // State
    let selectedSeats = [];
    let appliedDiscount = 0;
    
    // Initialize
    updateSeatList();
    
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
                    alert(`You can select a maximum of ${MAX_SEATS} seats.`);
                    return;
                }
                
                // Select seat
                seat.classList.remove('bg-[#F7F8F8]', 'text-gray-500');
                seat.classList.add('bg-[#1DD100]', 'text-white', 'selected');
                selectedSeats.push(seatId);
            }
            
            updateSeatList();
        });
    });
    
    // Coupon Application
    applyBtn.addEventListener('click', () => {
        const coupon = couponInput.value.trim();
        const total = selectedSeats.length * SEAT_PRICE;
        
        if (coupon === 'COUPLE20') {
            appliedDiscount = 0.2;
        } else if (coupon === 'NEW15') {
            appliedDiscount = 0.15;
        } else {
            alert('Invalid coupon code');
            return;
        }
        
        const discountedTotal = total - (total * appliedDiscount);
        grandTotalEl.textContent = Math.floor(discountedTotal);
        couponInput.value = '';
        applyBtn.disabled = true;
    });
    
    // Form Validation
    [nameInput, phoneInput].forEach(input => {
        input.addEventListener('input', validateForm);
    });
    
    function validateForm() {
        const isValid = nameInput.value.trim() !== '' &&
                      phoneInput.value.trim().length >= 10 &&
                      selectedSeats.length > 0;
        
        nextBtn.disabled = !isValid;
    }
    
    // Update Seat List and Totals
    function updateSeatList() {
        seatList.innerHTML = '';
        
        selectedSeats.forEach(seatId => {
            const seatElement = document.createElement('div');
            seatElement.className = 'flex justify-between mt-2 text-gray-400';
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
        validateForm();
    }
    
    // Booking Confirmation
    nextBtn.addEventListener('click', (e) => {
        e.preventDefault();
        
        const summary = `
            ✅ Booking Confirmed!\n\n
            🧍 Passenger: ${nameInput.value}\n
            📞 Phone: ${phoneInput.value}\n
            ✉️ Email: ${emailInput.value || 'Not Provided'}\n
            💺 Seats: ${selectedSeats.join(', ')}\n
            💳 Grand Total: BDT ${grandTotalEl.textContent}
        `;
        
        alert(summary);
        resetBooking();
    });
    
    // Reset Booking
    function resetBooking() {
        selectedSeats.forEach(seatId => {
            const seat = document.getElementById(seatId);
            if (seat) {
                seat.classList.remove('bg-[#1DD100]', 'text-white', 'selected');
                seat.classList.add('bg-[#F7F8F8]', 'text-gray-500');
            }
        });
        
        selectedSeats = [];
        appliedDiscount = 0;
        seatList.innerHTML = '';
        seatCountEl.textContent = '0';
        totalPriceEl.textContent = '0';
        grandTotalEl.textContent = '0';
        couponInput.value = '';
        nameInput.value = '';
        phoneInput.value = '';
        emailInput.value = '';
        applyBtn.disabled = true;
        nextBtn.disabled = true;
    }
});