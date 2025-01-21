function randomText(){
    var text = ("ア イ ウ エ オ カ キ ク ケ コ サ シ ス セ ソ タ チ ツ テ ト ナ ニ ヌ ネ ノ ハ ヒ フ ヘ ホ マ ミ ム メ モ ヤ ユ ヨ ラ リ ル レ ロ ワ ヲ ン ガ ギ グ ゲ ゴ ザ ジ ズ ゼ ゾ ダ ヂ ヅ デ ド バ ビ ブ ベ ボ パ ピ プ ペ ポ")
    letters =text[Math.floor(Math.random() * text.length)];
    return letters;
}

function rain() {
    let cloud = document.querySelector('.cloud');
    let e = document.createElement('div');
    e.classList.add('drop');
    cloud.appendChild(e);

    let left = Math.floor(Math.random() * 300);
    let size = Math.random() * 0.9;
    let duration = Math.random() * 2;

    e.innerText = randomText();
    e.style.left = left + 'px';
    e.style.fontSize = 2 + size + 'em';
    e.style.animationDuration = 2 + duration + 's';
    e.style.color = 'rgb(62, 226, 41)';
    e.style.filter = 'drop-shadow(0 0 10px rgba(21, 214, 31, 0.8))'; 

    setTimeout(function(){
        cloud.removeChild(e);
    }, 2000);
}

setInterval(function(){
    rain()
},77);

