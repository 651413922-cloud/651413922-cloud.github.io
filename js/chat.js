const messagesContainer = document.getElementById('chatMessages');
const userInput = document.getElementById('userInput');
const sendBtn = document.getElementById('sendBtn');
const avatarImg = document.getElementById('avatarImg');

// 添加消息到对话框
function addMessage(text, sender) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message', sender);
    messageDiv.innerHTML = `<div class="message-content">${escapeHtml(text)}</div>`;
    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// 简单防XSS转义
function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
}

// 更新虚拟形象状态
function updateAvatarExpression(state) {
    if (!avatarImg) return;
    
    // 移除原有类
    avatarImg.classList.remove('talking');
    avatarImg.style.animation = '';
    
    if (state === 'talking') {
        avatarImg.classList.add('talking');
        // 短暂延迟后移除，模拟说话结束光晕减弱
        setTimeout(() => {
            if (avatarImg.classList.contains('talking')) {
                avatarImg.classList.remove('talking');
            }
        }, 2500);
    } else if (state === 'thinking') {
        avatarImg.style.animation = 'avatarPulse 0.8s infinite';
    }
    // 其他状态保持默认
}

// 核心: 发送消息并获取AI回复
async function handleSend() {
    const message = userInput.value.trim();
    if (!message) return;

    // 显示用户消息
    addMessage(message, 'user');
    userInput.value = '';

    // 思考状态
    updateAvatarExpression('thinking');

    try {
        // 请求后端代理（/api/chat）
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message })
        });

        if (!response.ok) throw new Error('Network response was not ok');
        
        const data = await response.json();
        addMessage(data.reply, 'bot');
        updateAvatarExpression('talking');
    } catch (error) {
        addMessage('我的思绪被风吹散了，稍等片刻...', 'bot');
        updateAvatarExpression('idle');
    }
}

// 事件绑定
sendBtn.addEventListener('click', handleSend);
userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleSend();
});