document.querySelectorAll('.bouton').forEach(button => {
    button.addEventListener('click', () => {
        const additionalExamples = button.nextElementSibling;
        if (additionalExamples.style.display === 'none') {
            additionalExamples.style.display = 'block';
        } else {
            additionalExamples.style.display = 'none';
        }
    });
});