const greetings = document.querySelector("#typeEffekt");

const greetingsTypewriter = new Typewriter(greetings, {
    loop: true,
});

greetingsTypewriter
    .typeString('Was das für ein Join alter?!')
    .pauseFor(3000)
    .deleteAll()
    .typeString('Wir hatten halt bock....')
    .deleteAll()
    .typeString('auf rum blödeln :P')
    .pauseFor(1000)
    .deleteAll()
    .start();