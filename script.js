const outputDiv = document.getElementById('output');
const inputField = document.getElementById('command-input');
const terminal = document.getElementById('terminal');

const commands = {
    help: "Available commands: [whoami] [projects] [skills] [contact] [clear] [sudo]",
    whoami: "I am a developer passionate about low-level systems, algorithms, and breaking things to see how they work.",
    skills: "C++ | Python | JavaScript | System Architecture | Reverse Engineering",
    projects: "1. Portfolio_Terminal (Web)\n2. Neural_Net_From_Scratch (C++)\n3. Auto_Trading_Bot (Python)",
    contact: "Email: dev@example.com | GitHub: github.com/user",
    sudo: "usage: sudo [command]\nTry: 'sudo rm -rf /' (at your own risk)"
};

// Initial Boot Sequence Text
const bootText = [
    "Initializing kernel...",
    "Loading modules...",
    "Mounting file system...",
    "Access granted.",
    "Welcome to the Portfolio Terminal. Type 'help' to begin."
];

// Function to simulate typing effect
async function typeLine(text, delay = 50) {
    const line = document.createElement('div');
    line.className = 'output-line system';
    outputDiv.appendChild(line);
    
    for (let char of text) {
        line.textContent += char;
        await new Promise(r => setTimeout(r, delay));
        terminal.scrollTop = terminal.scrollHeight;
    }
}

// Run boot sequence on load
window.onload = async () => {
    inputField.disabled = true;
    for (let line of bootText) {
        await typeLine(line, 30);
    }
    inputField.disabled = false;
    inputField.focus();
};

// Keep focus on input
document.addEventListener('click', () => {
    inputField.focus();
});

inputField.addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        const input = inputField.value.trim();
        if (input) {
            processCommand(input);
        }
        inputField.value = '';
    }
});

function processCommand(cmd) {
    // Echo the command
    const commandLine = document.createElement('div');
    commandLine.className = 'output-line';
    commandLine.innerHTML = `<span class="prompt">visitor@portfolio:~$</span> ${cmd}`;
    outputDiv.appendChild(commandLine);

    const args = cmd.split(' ');
    const mainCmd = args[0].toLowerCase();

    let response = '';
    let styleClass = '';

    // Command Logic
    if (commands[mainCmd]) {
        if (mainCmd === 'sudo') {
            if (args[1] === 'rm' && args[2] === '-rf' && args[3] === '/') {
                triggerSelfDestruct();
                return;
            } else {
                response = commands.sudo;
            }
        } else {
            response = commands[mainCmd];
        }
    } else if (mainCmd === 'clear') {
        outputDiv.innerHTML = '';
        return;
    } else {
        response = `Command not found: ${mainCmd}. Type 'help' for options.`;
        styleClass = 'error';
    }

    // Print response
    const responseLine = document.createElement('div');
    responseLine.className = `output-line ${styleClass}`;
    responseLine.innerText = response;
    outputDiv.appendChild(responseLine);

    // Auto scroll
    terminal.scrollTop = terminal.scrollHeight;
}

function triggerSelfDestruct() {
    const lines = document.createElement('div');
    lines.className = 'output-line error';
    lines.innerText = "WARNING: SYSTEM CRITICAL. DELETING ASSETS...";
    outputDiv.appendChild(lines);
    
    // Shake effect (basic CSS manipulation)
    document.body.style.animation = "shake 0.5s infinite";
    document.body.style.backgroundColor = "#330000";
    
    setTimeout(() => {
        document.body.innerHTML = "<h1 style='color:red; text-align:center; margin-top:20%'>SYSTEM FAILURE</h1><p style='color:white; text-align:center'>Refresh to reboot.</p>";
    }, 2000);
}

// Add shake animation style dynamically
const styleSheet = document.createElement("style");
styleSheet.innerText = `
@keyframes shake {
  0% { transform: translate(1px, 1px) rotate(0deg); }
  10% { transform: translate(-1px, -2px) rotate(-1deg); }
  20% { transform: translate(-3px, 0px) rotate(1deg); }
  30% { transform: translate(3px, 2px) rotate(0deg); }
  40% { transform: translate(1px, -1px) rotate(1deg); }
  50% { transform: translate(-1px, 2px) rotate(-1deg); }
  60% { transform: translate(-3px, 1px) rotate(0deg); }
  70% { transform: translate(3px, 1px) rotate(-1deg); }
  80% { transform: translate(-1px, -1px) rotate(1deg); }
  90% { transform: translate(1px, 2px) rotate(0deg); }
  100% { transform: translate(1px, -2px) rotate(-1deg); }
}`;
document.head.appendChild(styleSheet);
