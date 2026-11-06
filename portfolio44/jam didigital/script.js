function updateClock() {
    const now = new Date();
    
    // Waktu
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    
    document.getElementById('hours').textContent = hours;
    document.getElementById('minutes').textContent = minutes;
    document.getElementById('seconds').textContent = seconds;
    
    // Tanggal
    const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
                    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
    
    const dayName = days[now.getDay()];
    const day = now.getDate();
    const month = months[now.getMonth()];
    const year = now.getFullYear();
    
    document.getElementById('date').textContent = 
        `${dayName}, ${day} ${month} ${year}`;
    
    // Salam
    const hour = now.getHours();
    let greeting;
    if (hour >= 5 && hour < 12) {
        greeting = '☀️ Selamat Pagi';
    } else if (hour >= 12 && hour < 15) {
        greeting = '🌤️ Selamat Siang';
    } else if (hour >= 15 && hour < 18) {
        greeting = '🌅 Selamat Sore';
    } else {
        greeting = '🌙 Selamat Malam';
    }
    document.getElementById('greeting').textContent = greeting;
}

// Update setiap detik
setInterval(updateClock, 1000);
updateClock(); // Jalankan langsung saat halaman dimuat