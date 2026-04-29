(function() {
    const introSail = document.getElementById('introSail');
    const doorTrans = document.getElementById('doorTransition');

    // ========================
    // 1. 主页开场：帆船远航（仅首次加载）
    // ========================
    if (introSail && document.referrer === '' && !sessionStorage.getItem('introPlayed')) {
        introSail.classList.add('active');
        sessionStorage.setItem('introPlayed', 'true');

        const oceanAudio = new Audio('assets/audio/ocean.mp3');
        oceanAudio.volume = 0.5;
        oceanAudio.play().catch(() => {});

        setTimeout(() => {
            introSail.classList.remove('active');
            document.body.classList.add('intro-stagger');
        }, 2600);
    } else if (introSail && sessionStorage.getItem('introPlayed')) {
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
        let animationTime = 2000; // 默认 2 秒后跳转（殿堂开门动画时长）

        if (href === 'chat.html' && doorTrans) {
            sceneElement = doorTrans;
            animationTime = 2000; // 门动画 1s，但等淡出 0.3s + 门开 1s 后还有金光，给足 2s
        } else if (introSail) {
            sceneElement = introSail;
            animationTime = 2600; // 帆船动画总时长
        }

        setTimeout(() => {
                if (sceneElement) {
                // 克隆遮罩并挂载到根节点（html），避免 body 的 opacity/transform 隐藏遮罩
                const floating = sceneElement.cloneNode(true);
                floating.id = sceneElement.id + '-floating';
                document.documentElement.appendChild(floating);
                // 确保浏览器识别初始样式——强制重绘后再激活类，保证 transition 生效
                void floating.offsetWidth;
                // 激活克隆遮罩
                floating.classList.add('active');

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

                // 监听门或帆船的 transitionend/animationend 事件，以便在动画结束时立即跳转
                let jumped = false;
                const doJump = () => {
                    if (!jumped) {
                        jumped = true;
                        // 清理克隆遮罩
                        try { if (floating && floating.parentNode) floating.parentNode.removeChild(floating); } catch (e) {}
                        window.location.href = href;
                    }
                };

                if (href === 'chat.html') {
                    const doorLeft = floating.querySelector('.door-left');
                    const doorRight = floating.querySelector('.door-right');
                    let remaining = 0;
                    if (doorLeft) remaining++;
                    if (doorRight) remaining++;
                    if (remaining === 0) {
                        doJump();
                    } else {
                        const onPartEnd = () => {
                            remaining--;
                            if (remaining <= 0) doJump();
                        };
                        if (doorLeft) doorLeft.addEventListener('transitionend', onPartEnd, { once: true });
                        if (doorRight) doorRight.addEventListener('transitionend', onPartEnd, { once: true });
                    }
                } else {
                    const sailboat = floating.querySelector('.sailboat-icon');
                    if (sailboat) {
                        sailboat.addEventListener('animationend', doJump, { once: true });
                    }
                }

                // 兜底定时器：如果事件没触发，强制在 animationTime 后跳转
                setTimeout(doJump, animationTime);
            } else {
                window.location.href = href;
            }
        }, 300);
    });
})();