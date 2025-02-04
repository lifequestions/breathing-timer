let timer;
let currentPhase = 0;
let currentCycle = 0;
let isRunning = false;
let currentTechnique = null;

const techniques = {
    '4-7-8': {
        phases: [
            { duration: 4, instruction: 'Inhale through your nose' },
            { duration: 7, instruction: 'Hold your breath' },
            { duration: 8, instruction: 'Exhale through your mouth' }
        ],
        totalCycles: 4
    },
    '5-5': {
        phases: [
            { duration: 5, instruction: 'Inhale' },
            { duration: 5, instruction: 'Exhale' }
        ],
        totalCycles: 60 // 10 minutes worth of cycles (30 complete breaths)
    }
};

function selectTechnique(technique) {
    currentTechnique = technique;
    
    // Hide selection UI
    document.querySelector('.technique-select').classList.add('hidden');
    document.querySelector('h2').classList.add('hidden');
    
    // Show timer UI and back button
    document.getElementById('breathingCircle').style.display = 'flex';
    document.querySelector('.timer-container').classList.add('visible');
    document.getElementById('backButton').style.display = 'block';
    
    document.getElementById('startButton').disabled = false;
}

function startTimer() {
    if (!currentTechnique || isRunning) return;
    
    isRunning = true;
    currentPhase = 0;
    currentCycle = 0;
    runPhase();
}

function stopTimer() {
    isRunning = false;
    clearTimeout(timer);
    
    // Reset and show selection UI
    document.querySelector('.technique-select').classList.remove('hidden');
    document.querySelector('h2').classList.remove('hidden');
    
    // Hide timer UI and back button
    document.getElementById('breathingCircle').style.display = 'none';
    document.querySelector('.timer-container').classList.remove('visible');
    document.getElementById('backButton').style.display = 'none';
    
    document.getElementById('timer').textContent = '0';
    
    // Reset circle state
    const circle = document.getElementById('breathingCircle');
    circle.style.transform = 'scale(1)';
    circle.style.opacity = '0.8';
}

function updateBreathingCircle(phase) {
    const circle = document.getElementById('breathingCircle');
    
    if (phase.instruction.toLowerCase().includes('inhale')) {
        circle.style.transitionDuration = `${phase.duration}s`;
        circle.style.transform = 'scale(1.5)';
        circle.style.opacity = '1';
    } else if (phase.instruction.toLowerCase().includes('exhale')) {
        circle.style.transitionDuration = `${phase.duration}s`;
        circle.style.transform = 'scale(1)';
        circle.style.opacity = '0.8';
    } else if (phase.instruction.toLowerCase().includes('hold')) {
        circle.style.transitionDuration = '0s';
        circle.style.transform = 'scale(1.5)';
        circle.style.opacity = '1';
    }
}

function runPhase() {
    if (!isRunning) return;

    const technique = techniques[currentTechnique];
    const phase = technique.phases[currentPhase];
    let timeLeft = phase.duration;

    updateBreathingCircle(phase);

    function countdown() {
        if (!isRunning) return;
        
        document.getElementById('timer').textContent = timeLeft;
        
        if (timeLeft > 0) {
            timeLeft--;
            timer = setTimeout(countdown, 1000);
        } else {
            currentPhase = (currentPhase + 1) % technique.phases.length;
            
            if (currentPhase === 0) {
                currentCycle++;
                if (currentCycle >= technique.totalCycles) {
                    stopTimer();
                    return;
                }
            }
            
            runPhase();
        }
    }

    countdown();
} 