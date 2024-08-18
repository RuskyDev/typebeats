document.addEventListener('DOMContentLoaded', () => {
    const display = document.getElementById('display');
    const audio = document.getElementById('audio');
    const inputField = document.getElementById('wordInput');
    const musicSelect = document.getElementById('musicSelect');
    let correctWord;
    let timeoutId;
    let gameStarted = false;
    let words = [];
    let selectedMusic = '';

    async function fetchWords() {
        try {
            const response = await fetch('./database/words.txt');
            const text = await response.text();
            return text.split('\n').map(word => word.trim()).filter(word => word.length > 0);
        } catch (error) {
            console.error('Error fetching words:', error);
            return [];
        }
    }

    function getRandomWord() {
        return words[Math.floor(Math.random() * words.length)];
    }

    function setRandomWord() {
        correctWord = getRandomWord();
        display.textContent = correctWord;
    }

    function resetGame() {
        clearTimeout(timeoutId);
        setRandomWord();
        playAudio();
        timeoutId = setTimeout(() => {
            resetGame();
        }, 5000);
    }

    function startGame() {
        gameStarted = true;
        setRandomWord();
        playAudio();
        timeoutId = setTimeout(() => {
            resetGame();
        }, 5000);
    }

    function handleUserInput(event) {
        if (event.target.value.trim() === correctWord) {
            clearTimeout(timeoutId);
            event.target.value = '';
            setRandomWord();
            timeoutId = setTimeout(() => {
                resetGame();
            }, 5000);
        }
    }

    function playAudio() {
        if (selectedMusic) {
            audio.src = `./musics/${selectedMusic}.mp3`;
            audio.currentTime = 0;
            audio.play().catch((error) => {
                console.log('Audio playback failed:', error);
            });
        }
    }

    function handleVisibilityChange() {
        if (document.hidden) {
            audio.pause();
            clearTimeout(timeoutId);
        } else {
            if (gameStarted) {
                playAudio();
                timeoutId = setTimeout(() => {
                    resetGame();
                }, 5000);
            }
        }
    }

    function handleMusicChange(event) {
        selectedMusic = event.target.value;
        if (selectedMusic) {
            fetchWords().then(fetchedWords => {
                words = fetchedWords;
                startGame();
            });
        }
    }

    function populateMusicOptions() {
        const musicFiles = [
            'Feline, The White by cranky',
            'Soviet Connection by Rockster Games'
        ];
        musicFiles.forEach(file => {
            const option = document.createElement('option');
            option.value = file;
            option.textContent = file;
            musicSelect.appendChild(option);
        });
    }

    inputField.addEventListener('input', handleUserInput);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    musicSelect.addEventListener('change', handleMusicChange);

    populateMusicOptions();

    inputField.addEventListener('paste', (event) => {
        event.preventDefault();
    });

    inputField.addEventListener('copy', (event) => {
        event.preventDefault();
    });

    inputField.addEventListener('cut', (event) => {
        event.preventDefault();
    });
});
