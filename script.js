document.addEventListener('DOMContentLoaded', function() {
    // 获取DOM元素
    const imageUpload = document.getElementById('imageUpload');
    const previewImage = document.getElementById('previewImage');
    const memeCanvas = document.getElementById('memeCanvas');
    const ctx = memeCanvas.getContext('2d');
    const editorSection = document.getElementById('editorSection');
    const topText = document.getElementById('topText');
    const middleText = document.getElementById('middleText');
    const bottomText = document.getElementById('bottomText');
    const fontSize = document.getElementById('fontSize');
    const fontSizeValue = document.getElementById('fontSizeValue');
    const fontColor = document.getElementById('fontColor');
    const generateBtn = document.getElementById('generateBtn');
    const downloadBtn = document.getElementById('downloadBtn');

    let currentImage = null;

    // 监听字体大小滑块变化
    fontSize.addEventListener('input', function() {
        fontSizeValue.textContent = this.value;
        if (currentImage) {
            drawMeme();
        }
    });

    // 监听字体颜色变化
    fontColor.addEventListener('input', function() {
        if (currentImage) {
            drawMeme();
        }
    });

    // 监听文本输入变化
    topText.addEventListener('input', function() {
        if (currentImage) {
            drawMeme();
        }
    });

    middleText.addEventListener('input', function() {
        if (currentImage) {
            drawMeme();
        }
    });

    bottomText.addEventListener('input', function() {
        if (currentImage) {
            drawMeme();
        }
    });

    // 图片上传处理
    imageUpload.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file && file.type.match('image.*')) {
            const reader = new FileReader();
            
            reader.onload = function(event) {
                previewImage.src = event.target.result;
                previewImage.onload = function() {
                    currentImage = new Image();
                    currentImage.src = event.target.result;
                    currentImage.onload = function() {
                        // 显示编辑区域
                        editorSection.style.display = 'flex';
                        
                        // 设置画布尺寸
                        memeCanvas.width = Math.min(currentImage.width, 600); // 限制最大宽度
                        memeCanvas.height = (currentImage.height * memeCanvas.width) / currentImage.width;
                        
                        // 绘制初始图像
                        drawMeme();
                    };
                };
            };
            
            reader.readAsDataURL(file);
        } else {
            alert('请选择有效的图片文件！');
        }
    });

    // 绘制表情包函数
    function drawMeme() {
        if (!currentImage) return;

        // 清除画布
        ctx.clearRect(0, 0, memeCanvas.width, memeCanvas.height);
        
        // 绘制原始图片
        ctx.drawImage(currentImage, 0, 0, memeCanvas.width, memeCanvas.height);

        // 设置文字样式
        const fontSizeVal = parseInt(fontSize.value);
        ctx.font = `bold ${fontSizeVal}px Arial`;
        ctx.fillStyle = fontColor.value;
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 3;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';

        // 绘制顶部文字
        if (topText.value.trim()) {
            drawTextWithStroke(topText.value.trim(), memeCanvas.width / 2, 10);
        }

        // 绘制中间文字
        if (middleText.value.trim()) {
            ctx.textBaseline = 'middle';
            drawTextWithStroke(middleText.value.trim(), memeCanvas.width / 2, memeCanvas.height / 2);
        }

        // 绘制底部文字
        if (bottomText.value.trim()) {
            ctx.textBaseline = 'bottom';
            drawTextWithStroke(bottomText.value.trim(), memeCanvas.width / 2, memeCanvas.height - 10);
        }
    }

    // 绘制带描边的文字
    function drawTextWithStroke(text, x, y) {
        // 绘制文字轮廓
        ctx.strokeText(text, x, y);
        // 绘制填充文字
        ctx.fillText(text, x, y);
    }

    // 生成表情包按钮点击事件
    generateBtn.addEventListener('click', function() {
        if (!currentImage) {
            alert('请先上传一张图片！');
            return;
        }
        
        drawMeme();
        alert('表情包已生成！您可以点击下载按钮保存。');
    });

    // 下载表情包按钮点击事件
    downloadBtn.addEventListener('click', function() {
        if (!currentImage) {
            alert('请先上传一张图片并生成表情包！');
            return;
        }

        // 创建临时链接下载图片
        const link = document.createElement('a');
        link.download = 'meme-' + new Date().getTime() + '.png';
        link.href = memeCanvas.toDataURL('image/png');
        link.click();
    });
});