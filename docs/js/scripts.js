(function() {
  document.addEventListener('DOMContentLoaded', () => {
    const leniwiec = new Leniwiec(document.querySelectorAll('.leniwiec'), {
      threshold: 0.5,
    });

    const progressive = new Leniwiec(document.querySelectorAll('.js-progressive'), {
      threshold: 0.5,
      onLoad: (target, src) => {
        target.querySelector('.js-big').style.backgroundImage = `url(${src})`;
      }
    });

    const imagesList = document.querySelector('.js-images-list');
    const button = document.querySelector('.js-load-more');

    button.addEventListener('click', () => {
      for (let i = 13; i <= 21; i++) {
        const div = document.createElement('div');
        div.setAttribute('data-background-image', `./images/${i}.jpg`);

        imagesList.appendChild(div);
        leniwiec.observe(div);
        button.remove();
      }
    });
  });
}())
