(function() {
    const introSail = document.getElementById('introSail');
    const doorTrans = document.getElementById('doorTransition');

    // ========================
    // 1. 主页开场：帆船远航（仅首次加载）
    // ========================
    if (introSail && document.referrer === '' && !sessionStorage.getItem('introPlayed')) {
        // 显示帆船动画
        introSail.classList.add('active');
        sessionStorage.setItem('introPlayed', 'true');

        // 播放海浪声
        const oceanAudio = new Audio('assets/audio/ocean.mp3');
        oceanAudio.volume = 0.5;
        oceanAudio.play().catch(() => {});

        // 2.6 秒后隐藏帆船，并触发页面内容阶梯登场
        setTimeout(() => {
            introSail.classList.remove('active');
            document.body.classList.add('intro-stagger');
        }, 2600);
    } else if (introSail && sessionStorage.getItem('introPlayed')) {
        // 已经播放过，直接隐藏该元素
        introSail.style.display = 'none';
    }

    // ========================
    // 2. 链接点击转场（当前页缩放淡出 → 转场动画 → 跳转）
    // ========================
    document.addEventListener('click', function(e) {
        const link = e.target.closest('a');
        if (!link) return;
        const href = link.getAttribute('href');
        if (!href || href.startsWith('http') || href.startsWith('#')) return;
        if (!href.endsWith('.html')) return;

        e.preventDefault();

        // 当前页面缩小 + 淡出
        document.body.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
        document.body.style.opacity = '0';
        document.body.style.transform = 'scale(0.97)';

        let sceneElement = null;
        let delay = 300; // 等待当前页淡出的时间

        if (href === 'chat.html' && doorTrans) {
            // 殿堂开门动画
            sceneElement = doorTrans;
            delay = 2000;
        } else if (introSail) {
            // 通用帆船动画
            sceneElement = introSail;
            delay = 2600;
        }

        // 在当前页面淡出 300ms 后启动转场动画
        setTimeout(() => {
            if (sceneElement) {
                sceneElement.classList.add('active');

                // 播放对应音效
                if (href === 'chat.html') {
                    const doorSound = new Audio('assets/audio/door-open.mp3');
                    doorSound.volume = 0.7;
                    doorSound.play().catch(() => {});
                } else {
                    const oceanSound = new Audio('assets/audio/ocean.mp3');
                    oceanSound.volume = 0.5;
                    oceanSound.play().catch(() => {});
                }

                // 动画结束后跳转到目标页面
                setTimeout(() => {
                    window.location.href = href;
                }, delay);
            } else {
                // 没有对应场景元素，直接跳转
                window.location.href = href;
            }
        }, 300);
    });
})();