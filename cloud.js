function randomText(){
    var text = ("ア イ ウ エ オ カ キ ク ケ コ サ  セ  タ チ  テ ト ナ  ヌ ネ ノ ハ ヒ フ ヘ ホ マ ミ ム メ モ ヤ ユ ヨ ラ リ ル レ ロ ワ ヲ ン ガ ギ グ ゲ ゴ ザ  ズ ゼ ゾ ダ ヂ  デ ド バ ビ ブ ベ  パ ピ プ ペ ")
    letters =text[Math.floor(Math.random() * text.length)];
    return letters;
}

function rain() {
    let cloud = document.querySelector('.cloud');
    let e = document.createElement('div');
    e.classList.add('drop');
    cloud.appendChild(e);

    let left = Math.floor(Math.random() * 600);
    let size = Math.random() * 0.8;
    let duration = Math.random() * 1.2;

    e.innerText = randomText();
    e.style.left = left + 'px';
    e.style.fontSize = 1.5 + size + 'em';
    e.style.animationDuration = 1777 + duration + 'ms';
    e.style.color = 'rgba(62, 226, 41, 0.8)';
    e.style.filter = 'drop-shadow(0 0 10px rgba(21, 214, 31, 0.8))'; 

    setTimeout(function(){
        cloud.removeChild(e);
    }, 2000);
}

setInterval(function(){
    rain()
},66);

