const cursor = document.getElementById('cursor');
const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%^&*";

// 1. Custom Cursor Movement
document.addEventListener('mousemove', e => {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';
});

// 2. The Hacker Text Scramble Effect
// Target everything with class 'glitch' or 'project-item'
const targets = document.querySelectorAll('.glitch, .project-item');

targets.forEach(target => {
    target.addEventListener('mouseenter', event => {
        
        // Scale cursor up on hover
        cursor.style.width = '80px';
        cursor.style.height = '80px';

        // Start Scramble
        let iteration = 0;
        const originalText = target.dataset.value; 
        
        // If it's a project item, we are targeting the .p-name child
        const textElement = target.classList.contains('project-item') 
            ? target.querySelector('.p-name') 
            : target;

        clearInterval(textElement.interval);

        textElement.interval = setInterval(() => {
            textElement.innerText = originalText
                .split("")
                .map((letter, index) => {
                    if(index < iteration) {
                        return originalText[index];
                    }
                    return letters[Math.floor(Math.random() * 26)];
                })
                .join("");
            
            if(iteration >= originalText.length){ 
                clearInterval(textElement.interval);
            }
            
            iteration += 1 / 3; // Controls speed of decode
        }, 30);
    });

    target.addEventListener('mouseleave', () => {
        cursor.style.width = '20px';
        cursor.style.height = '20px';
    });
});
