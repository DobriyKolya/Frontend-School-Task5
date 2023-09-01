class CountdownTimer extends HTMLElement {
    constructor() {
        super();

        // Создаем Shadow DOM
        this.attachShadow({ mode: 'open' });

        // Инициализация атрибутов и свойств
        this.seconds = this.getAttribute('seconds') || 0;
        this.endTime = this.getAttribute('to-time') || '';
        this.isRunning = false;
        this.intervalId = null;

        // Создаем структуру элемента
        this.shadowRoot.innerHTML = `
            <style>
                button {
                    background-color: #333;
                    color: #fff;
                    padding: 5px 10px;
                    border: none;
                    border-radius: 5px;
                    cursor: pointer;
                    font-size: 1.3rem;
                }

                button:hover {
                    background-color: #555;
                }

                .controls {
                  display: flex;
                  gap: 1rem;
                  align-items: center;
                  text-align: center;
                  justify-content: center;
                }

                input[type="time"] {
                    padding: 5px;
                    border: 1px solid #ccc;
                    border-radius: 5px;

                }

                .setTimer{
                    gap: 2rem;
                    display: flex;
                    align-items: center;
                    text-align: center;
                    justify-content: center;
                }

                #timer{
                  font-size: 5rem;
                  margin-bottom: 5rem;
                }
            </style>

            <div class= "setTimer">
                <input type="time" id="timeInput" step="1" value="00:00:00">
                <button id="setTime">Set Time</button>
            </div>

            <div id="timer"></div>
            <div class="controls">
                <button id="start">Start</button>
                <button id="pause">Pause</button>
                <button id="reset">Reset</button>
            </div>
        `;

        // Получаем ссылки на элементы
        this.timerDisplay = this.shadowRoot.querySelector('#timer');
        this.startButton = this.shadowRoot.querySelector('#start');
        this.pauseButton = this.shadowRoot.querySelector('#pause');
        this.resetButton = this.shadowRoot.querySelector('#reset');
        this.timeInput = this.shadowRoot.querySelector('#timeInput');
        this.setTimeButton = this.shadowRoot.querySelector('#setTime');


        // Добавляем обработчики событий кнопок
        this.startButton.addEventListener('click', () => this.startTimer());
        this.pauseButton.addEventListener('click', () => this.pauseTimer());
        this.resetButton.addEventListener('click', () => this.resetTimer());
        this.setTimeButton.addEventListener('click', () => this.setTimer());
    }

    connectedCallback() {
        this.updateDisplay();
    }

    disconnectedCallback() {
        clearInterval(this.intervalId);
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name === 'seconds') {
            this.seconds = parseInt(newValue, 10);
            this.updateDisplay();
        }
        if (name === 'to-time') {
            this.endTime = newValue;
            this.updateDisplay();
        }
    }

    static get observedAttributes() {
        return ['seconds', 'to-time'];
    }

    updateDisplay() {
        if (this.endTime) {
            const now = new Date();
            const endTime = new Date(this.endTime);
            this.seconds = Math.max(Math.floor((endTime - now) / 1000), 0);
        }

        const hours = Math.floor(this.seconds / 3600);
        const minutes = Math.floor((this.seconds % 3600) / 60);
        const seconds = this.seconds % 60;

        const timerText = `${hours > 0 ? hours + ':' : ''}${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;

        this.timerDisplay.textContent = timerText;

        // Проверка на завершение таймера
        if (this.seconds === 0) {
            this.dispatchEvent(new Event('endtimer'));
        }
    }

    setTimer(){
      const timeString = this.timeInput.value;
      // Разберем строку времени на часы, минуты и секунды
      const [hours, minutes, seconds] = timeString.split(':').map(Number);

      if (!isNaN(hours) && !isNaN(minutes) && !isNaN(seconds)) {
          // Пересчитаем время в секундах
          this.seconds = hours * 3600 + minutes * 60 + seconds;
          this.endTime = ''; // Очистим значение endTime
          this.updateDisplay(); // Обновим отображение
      } else {
          alert('Invalid time format! Use HH:MM:SS.');
      }
    }

    startTimer() {
        if (!this.isRunning) {
            this.intervalId = setInterval(() => {
                if (this.seconds > 0) {
                    this.seconds--;
                    this.updateDisplay();
                }
            }, 1000);

            this.isRunning = true;
        }
    }

    pauseTimer() {
        if (this.isRunning) {
            clearInterval(this.intervalId);
            this.isRunning = false;
        }
    }

    resetTimer() {
        clearInterval(this.intervalId);
        this.isRunning = false;
        this.seconds = this.getAttribute('seconds') || 0;
        this.updateDisplay();
    }
}

customElements.define('countdown-timer', CountdownTimer);
