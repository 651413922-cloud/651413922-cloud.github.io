(function() {
    const introSail = document.getElementById('introSail');
    const doorTrans = document.getElementById('doorTransition');

    // 主页开场帆船动画（仅首次加载）
    if (introSail && document.referrer === '' && !sessionStorage.getItem('introPlayed')) {
        introSail.classList.add('active');
        sessionStorage.setItem('introPlayed', 'true');

        // 尝试播放海浪声（可能被浏览器拦截）
        const oceanAudio = new Audio('assets/audio/ocean.mp3');
        oceanAudio.volume = 0.5;
        oceanAudio.play().catch(() => {});

        setTimeout(() => {
            introSail.classList.remove('active');
        }, 2600);
    } else if (introSail && sessionStorage.getItem('introPlayed')) {
        // 如果已经播放过，隐藏该元素
        introSail.style.display = 'none';
    }

    // 全局拦截链接点击，实现转场动画
    document.addEventListener('click', function(e) {
        const link = e.target.closest('a');
        if (!link) return;
        const href = link.getAttribute('href');
        if (!href || href.startsWith('http') || href.startsWith('#')) return;
        if (!href.endsWith('.html')) return;

        e.preventDefault();

        let sceneElement = null;
        let delay = 2600; // 默认动画时长
        let audio = null;

        if (href === 'chat.html' && doorTrans) {
            // 聊天页：殿堂开门
            sceneElement = doorTrans;
            delay = 2000;
            audio = new Audio('assets/audio/door-open.mp3');
            audio.volume = 0.7;
        } else if (introSail) {
            // 其他页面：通用帆船动画
            sceneElement = introSail;
            audio = new Audio('assets/audio/ocean.mp3');
            audio.volume = 0.5;
        }

        if (sceneElement) {
            sceneElement.classList.add('active');
            if (audio) audio.play().catch(() => {});

            setTimeout(() => {
                window.location.href = href;
            }, delay);
        } else {
            // 没有对应场景元素，直接跳转
            window.location.href = href;
        }
    });
})();