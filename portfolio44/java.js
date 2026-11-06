
document.addEventListener('DOMContentLoaded', () => {

    // 1. SCROLL REVEAL ANIMATION
    const revealElements = document.querySelectorAll('.reveal');

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active-reveal');
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.8s cubic-bezier(0.5, 0, 0, 1)';
        revealObserver.observe(el);
    });

    const styleSheet = document.createElement('style');
    styleSheet.innerText = `
        .active-reveal {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
    `;
    document.head.appendChild(styleSheet);


    // 2. ACTIVE NAVIGATION LINK
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        let current = '';

        sections.forEach(section => {
            if (window.pageYOffset >= section.offsetTop - 150) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');

            if (link.getAttribute('href') === '#' + current) {
                link.classList.add('active');
            }
        });
    });


    // 3. SMOOTH SCROLLING
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');

            if (targetId === '#') {
                e.preventDefault();
                return;
            }

            const targetSection = document.querySelector(targetId);

            if (targetSection) {
                e.preventDefault();
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });


    // 5. FITUR SERTIFIKAT
    const items = Array.from(
        document.querySelectorAll('.certificate-item')
    );

    const modal = document.getElementById('certificateModal');
    const modalImage = document.getElementById('modalCertificateImage');
    const modalTitle = document.getElementById('modalCertificateTitle');
    const modalCategory = document.getElementById('modalCertificateCategory');
    const modalDate = document.getElementById('modalCertificateDate');
    const modalOrganizer = document.getElementById('modalCertificateOrganizer');
    const modalDescription = document.getElementById('modalCertificateDescription');
    const counter = document.getElementById('certificateCounter');
    const downloadLink = document.getElementById('downloadCertificate');

    const closeButton = document.getElementById('closeCertificate');
    const prevButton = document.getElementById('prevCertificate');
    const nextButton = document.getElementById('nextCertificate');

    let currentIndex = 0;

    const categories = {
        web: 'Web Development',
        programming: 'Programming',
        other: 'Lainnya'
    };

    // Cek apakah elemen HTML ditemukan
    if (modal && modalImage && items.length > 0) {

        function openCertificate(index) {
            currentIndex = (index + items.length) % items.length;

            const item = items[currentIndex];
            const image = item.querySelector('img');

            if (!image) return;

            modalImage.src = image.src;
            modalImage.alt = image.alt;

            if (modalTitle) {
                modalTitle.textContent =
                    item.dataset.title || `Sertifikat ${currentIndex + 1}`;
            }

            if (modalDate) {
                modalDate.textContent = item.dataset.date || '-';
            }

            if (modalOrganizer) {
                modalOrganizer.textContent = item.dataset.organizer || '-';
            }

            if (modalDescription) {
                modalDescription.textContent =
                    item.dataset.description || '-';
            }

            if (modalCategory) {
                modalCategory.textContent =
                    categories[item.dataset.category] || 'Lainnya';
            }

            if (counter) {
                counter.textContent =
                    `${currentIndex + 1} / ${items.length}`;
            }

            if (downloadLink) {
                downloadLink.href = image.src;
                downloadLink.download = `sertifikat-${currentIndex + 1}`;
            }

            modal.classList.add('show');
            document.body.style.overflow = 'hidden';
        }

        // Klik tombol LIHAT
        items.forEach((item, index) => {
            const button = item.querySelector('.view-certificate');
            const image = item.querySelector('img');

            if (button) {
                button.addEventListener('click', () => {
                    openCertificate(index);
                });
            }

            if (image) {
                image.addEventListener('click', () => {
                    openCertificate(index);
                });
            }
        });

        // FILTER KATEGORI
        document.querySelectorAll('.filter-btn').forEach(button => {
            button.addEventListener('click', function () {
                document.querySelectorAll('.filter-btn').forEach(btn => {
                    btn.classList.remove('active');
                });

                this.classList.add('active');

                const filter = this.dataset.filter;

                items.forEach(item => {
                    const matches =
                        filter === 'all' ||
                        item.dataset.category === filter;

                    item.classList.toggle('hidden', !matches);
                });
            });
        });

        // SERTIFIKAT SEBELUMNYA
        if (prevButton) {
            prevButton.addEventListener('click', () => {
                openCertificate(currentIndex - 1);
            });
        }

        // SERTIFIKAT BERIKUTNYA
        if (nextButton) {
            nextButton.addEventListener('click', () => {
                openCertificate(currentIndex + 1);
            });
        }

        // TUTUP MODAL
        function closeModal() {
            modal.classList.remove('show');
            document.body.style.overflow = '';
        }

        if (closeButton) {
            closeButton.addEventListener('click', closeModal);
        }

        modal.addEventListener('click', (event) => {
            if (event.target === modal) {
                closeModal();
            }
        });

        // KONTROL KEYBOARD
        document.addEventListener('keydown', (event) => {
            if (!modal.classList.contains('show')) return;

            if (event.key === 'Escape') closeModal();

            if (event.key === 'ArrowLeft') {
                openCertificate(currentIndex - 1);
            }

            if (event.key === 'ArrowRight') {
                openCertificate(currentIndex + 1);
            }
        });

        console.log('Fitur sertifikat berhasil dimuat!');
    } else {
        console.error(
            'Modal atau kartu sertifikat tidak ditemukan. Periksa HTML dan ID modal.'
        );
    }

});
