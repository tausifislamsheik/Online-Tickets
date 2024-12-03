const allSeat = document.querySelectorAll('.seat');
for(const seat of allSeat){
    seat.addEventListener('click', function(e){
        console.log(e.target);
        // e.target = document.createElement()
    })
}