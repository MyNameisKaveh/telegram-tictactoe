document.addEventListener('DOMContentLoaded', () => {
    const cells = document.querySelectorAll('.cell');
    const statusArea = document.getElementById('status-area');
    const restartButton = document.getElementById('restart-button');
    const tg = window.Telegram.WebApp; // دسترسی به API تلگرام

    let board = ['', '', '', '', '', '', '', '', ''];
    let currentPlayer = 'X';
    let gameActive = true;

    // این تابع مهم است و به تلگرام اطلاع می‌دهد که وب‌اپ آماده است
    // مطمئن شوید که telegram-web-app.js در HTML شما لود شده باشد
    if (tg) {
        tg.ready();
    } else {
        console.error("Telegram WebApp API not found. Make sure telegram-web-app.js is included.");
    }


    const winningConditions = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // ردیف‌ها
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // ستون‌ها
        [0, 4, 8], [2, 4, 6]             // قطرها
    ];

    const handleCellClick = (event) => {
        const clickedCell = event.target;
        const clickedCellIndex = parseInt(clickedCell.getAttribute('data-index'));

        if (board[clickedCellIndex] !== '' || !gameActive) {
            return;
        }

        board[clickedCellIndex] = currentPlayer;
        clickedCell.textContent = currentPlayer;
        clickedCell.classList.add(currentPlayer.toLowerCase()); // برای استایل‌دهی به X و O

        checkResult();
    };

    const checkResult = () => {
        let roundWon = false;
        for (let i = 0; i < winningConditions.length; i++) {
            const winCondition = winningConditions[i];
            let a = board[winCondition[0]];
            let b = board[winCondition[1]];
            let c = board[winCondition[2]];

            if (a === '' || b === '' || c === '') {
                continue;
            }
            if (a === b && b === c) {
                roundWon = true;
                break;
            }
        }

        if (roundWon) {
            statusArea.textContent = `بازیکن ${currentPlayer} برنده شد! 🎉`;
            gameActive = false;
            // مثال: ارسال نتیجه به بات (اختیاری)
            // if (tg) tg.sendData(`winner:${currentPlayer}`);
            return;
        }

        if (!board.includes('')) {
            statusArea.textContent = 'بازی مساوی شد! 😐';
            gameActive = false;
            // مثال: ارسال نتیجه به بات (اختیاری)
            // if (tg) tg.sendData("draw");
            return;
        }

        switchPlayer();
    };

    const switchPlayer = () => {
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        statusArea.textContent = `نوبت بازیکن ${currentPlayer}`;
    };

    const restartGame = () => {
        board = ['', '', '', '', '', '', '', '', ''];
        gameActive = true;
        currentPlayer = 'X';
        statusArea.textContent = `نوبت بازیکن ${currentPlayer}`;
        cells.forEach(cell => {
            cell.textContent = '';
            cell.classList.remove('x', 'o');
        });
    };

    cells.forEach(cell => cell.addEventListener('click', handleCellClick));
    restartButton.addEventListener('click', restartGame);

    // تنظیم اولیه
    statusArea.textContent = `نوبت بازیکن ${currentPlayer}`;

    // (اختیاری) اگر می‌خواهید با دکمه اصلی تلگرام کاری انجام دهید
    // if (tg) {
    //     tg.MainButton.setText("بستن بازی");
    //     tg.MainButton.show();
    //     tg.MainButton.onClick(() => {
    //         tg.close();
    //     });
    // }
});
