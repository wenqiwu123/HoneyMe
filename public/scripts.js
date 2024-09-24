// scripts.js

document.addEventListener('DOMContentLoaded', () => {
    const cakeImages = document.querySelectorAll('.cake-image');
    const imageViewer = document.getElementById('image-viewer');
    const largeImage = document.getElementById('large-image');

    cakeImages.forEach(image => {
        image.addEventListener('click', () => {
            largeImage.src = image.src;
            imageViewer.style.display = 'flex';
        });
    });

    imageViewer.addEventListener('click', () => {
        imageViewer.style.display = 'none';
        largeImage.src = '';
    });
});