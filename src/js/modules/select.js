export default (element = '') =>
{
    document.addEventListener('click', e =>
    {
        let target = e.target;
        let parent = target.parentNode;
        while (target !== document)
        {
            if (target.classList.contains('select-box'))
            {
                const list = target.querySelector('.select-box__list');
                const label = target.querySelector('.select-box__label');

                if (list.classList.contains('select-box__list_active'))
                {
                    list.style.height = '';
                    list.scrollTop = 0;

                    label.classList.remove('select-box__label_open');
                    list.classList.remove('select-box__list_active');
                }
                else
                {
                    const options = list.querySelectorAll('.select-box__list__option');
                    const liHeight = options[0].clientHeight;
                    const topOffset = target.getBoundingClientRect().top + pageYOffset;
                    const bottomOffset = document.documentElement.clientHeight - target.clientHeight - (topOffset - document.body.scrollTop);

                    let height = options.length * liHeight;

                    document.querySelectorAll('.select-box__list_active').forEach(n =>
                    {
                        n.style.height = '';
                        n.classList.remove('select-box__list_active');
                        n.parentNode.querySelector('.select-box__label_open').classList.remove('select-box__label_open');
                    });

                    let direction;
                    if (bottomOffset < topOffset)
                    {
                        direction = 'top: auto; bottom';
                        if (height > topOffset - document.body.scrollTop - liHeight)
                        {
                            height = Math.floor((topOffset - document.body.scrollTop - liHeight) / liHeight) * liHeight;
                        }
                    }
                    else
                    {
                        direction = 'bottom: auto; top';
                        if (height > bottomOffset - liHeight)
                        {
                            height = Math.floor((bottomOffset - liHeight) / liHeight)  * liHeight;
                        }
                    }
                    if (height <= 0)
                    {
                        direction = 'top';
                        height = liHeight * 2;
                    }
                    list.style = `${direction}: 105%; height: ${height}px`;

                    label.classList.add('select-box__label_open');
                    list.classList.add('select-box__list_active');
                }
                return;
            }
            else if (target.classList.contains('select-box__list__option'))
            {
                const selectBox = parent.parentNode;
                selectBox.querySelector('.select-box__input').value = target.getAttribute('data-value');
                selectBox.querySelector('.select-box__label').textContent = target.textContent;
            }
            target = target.parentNode;
            parent = target.parentNode;
        }
        document.querySelectorAll('.select-box__list_active').forEach(n =>
        {
            n.style.height = '';
            n.classList.remove('select-box__list_active');
            n.parentNode.querySelector('.select-box__label_open').classList.remove('select-box__label_open');
        });
    });

    document.addEventListener('DOMContentLoaded', e =>
    {
        document.querySelectorAll('select' + element.toString()).forEach(n =>
        {
            const attr = attributive =>
            {
                let attributes = [];
                [].forEach.call(attributive, item =>
                {
                    if (!['class', 'name', 'value'].indexOf(item.name))
                    {
                        attributes.push(`${item.name}="${item.value}"`);
                    }
                });
                return attributes.toString();
            };

            const option = n.querySelectorAll('option');
            let select = '';
            if (option.length > 0)
            {
                select = `
                        <span class="select-box__label">${option[0].textContent}</span>
                        <input class="select-box__input" type="hidden" name="${n.getAttribute('name')}" value="${option[0].value}">
                        <ul class="select-box__list">`;
                for (let i = 0; i < option.length; ++i)
                {
                    option[i].classList.add('select-box__list__option');
                    select += `
                            <li class="${option[i].classList}" data-value="${option[i].value}" ${attr(option[i].attributes)}>
                                ${option[i].textContent} 
                            </li>`;
                }
                select += '</ul>';
            }
            n.classList.add('select-box');
            n.outerHTML =  `
                        <div class="${n.classList}" style="width: ${n.offsetWidth * 1.1}px" ${attr(n.attributes)}>
                            ${select} 
                        </div>`;
        });
    });
};
