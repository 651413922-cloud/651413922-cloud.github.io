(function() {
    const introSail = document.getElementById('introSail');
    const doorTrans = document.getElementById('doorTransition');

    // ========================
    // 1. 主页开场：帆船远航（仅首次加载）
    // ========================
    if (introSail && document.referrer === '' && !sessionStorage.getItem('introPlayed')) {
        introSail.classList.add('active');
        sessionStorage.setItem('introPlayed', 'true');

        // 播放海浪声（可能被浏览器拦截，但不影响动画）
        const oceanAudio = new Audio('assets/audio/ocean.mp3');
        oceanAudio.volume = 0.5;
        oceanAudio.play().catch(() => {});

        // 2.6 秒后隐藏帆船，触发主页内容阶梯登场
        setTimeout(() => {
            introSail.classList.remove('active');
            document.body.classList.add('intro-stagger');
        }, 2600);
    } else if (introSail && sessionStorage.getItem('introPlayed')) {
        // 已播放过，直接隐藏该元素
        introSail.style.display = 'none';
    }

    // ========================
    // 2. 链接点击转场（当前页缩放淡出 → 转场动画 → 新页）
    // ========================
    document.addEventListener('click', function(e) {
        const link = e.target.closest('a');
        if (!link) return;
        const href = link.getAttribute('href');
        // 只处理同域下的 .html 文件
        if (!href || href.startsWith('http') || href.startsWith('#')) return;
        if (!href.endsWith('.html')) return;

        e.preventDefault();

        // 当前页面缩小 + 淡出（300ms）
        document.body.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
        document.body.style.opacity = '0';
        document.body.style.transform = 'scale(0.97)';

        let sceneElement = null;

        // 根据目标选择转场场景
        if (href === 'chat.html' && doorTrans) {
            sceneElement = doorTrans;   // 殿堂开门
        } else if (introSail) {
            sceneElement = introSail;   // 通用帆船
        }

        // 300ms 后启动转场动画
        setTimeout(() => {
            if (sceneElement) {
                // 显示遮罩并触发动画
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

                // 监听动画结束，自动跳转
                const onTransitionEnd = function() {
                    sceneElement.removeEventListener('transitionend', onTransitionEnd);
                    window.location.href = href;
                };
                sceneElement.addEventListener('transitionend', onTransitionEnd);

                // 兜底：如果 3 秒后仍未跳转（比如动画被中断），强制跳转
                setTimeout(() => {
                    if (sceneElement.classList.contains('active')) {
                        window.location.href = href;
                    }
                }, 3000);
            } else {
                // 没有对应场景元素，直接跳转
                window.location.href = href;
            }
        }, 300);
    });
})();