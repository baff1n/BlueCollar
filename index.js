// Скрываем бургер-меню при клике вне области меню.
document.addEventListener('mouseup', function (e) {
	const mobileMenu = document.querySelector('.mobile__menu');
	const burgerCheckbox = document.querySelector('.burger-checkbox');
	if (!mobileMenu || !burgerCheckbox) return;

	if (!mobileMenu.contains(e.target)) {
		burgerCheckbox.checked = false;
	}
});

// Настройка оболочки Яндекс карты (карта "оживает" только после клика внутри неё,
// чтобы не перехватывать скролл страницы).
document.addEventListener('click', (e) => {
	const mapWrapper = document.querySelector('.contacts__map');
	if (!mapWrapper) return;
	mapWrapper.classList.toggle('is-active', mapWrapper.contains(e.target));
});

// Кнопка скролла страницы вверх
const btnUp = {
	el: document.querySelector('.btn-up'),
	show() {
		this.el.classList.remove('btn-up_hide');
	},
	hide() {
		this.el.classList.add('btn-up_hide');
	},
	init() {
		if (!this.el) return;

		window.addEventListener('scroll', () => {
			const scrollY = window.scrollY || document.documentElement.scrollTop;
			scrollY > 800 ? this.show() : this.hide();
		}, { passive: true });

		this.el.addEventListener('click', () => {
			window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
		});
	}
};

btnUp.init();

// Форма обратной связи — отправка через FormBold.
// Работает даже без JS (обычный POST на action), но с JS отправляем через
// fetch с Accept: application/json — FormBold в этом случае не делает редирект
// на свою страницу, а возвращает JSON, и мы показываем статус прямо на странице.
const contactForm = document.getElementById('contactForm');
const formStatus = document.getElementById('formStatus');

if (contactForm) {
	contactForm.addEventListener('submit', async (e) => {
		e.preventDefault();

		const submitBtn = contactForm.querySelector('.form__btn');
		submitBtn.disabled = true;
		if (formStatus) {
			formStatus.textContent = 'Отправка...';
			formStatus.classList.remove('form__status--error', 'form__status--success');
		}

		try {
			const response = await fetch(contactForm.action, {
				method: 'POST',
				body: new FormData(contactForm),
				headers: { Accept: 'application/json' }
			});

			if (!response.ok) throw new Error('Request failed');

			if (formStatus) {
				formStatus.textContent = 'Спасибо! Ваша заявка отправлена, мы свяжемся с вами в ближайшее время.';
				formStatus.classList.add('form__status--success');
			}
			contactForm.reset();
		} catch (err) {
			if (formStatus) {
				formStatus.textContent = 'Не удалось отправить форму. Попробуйте ещё раз или напишите на info@sintez-elektro.ru.';
				formStatus.classList.add('form__status--error');
			}
		} finally {
			submitBtn.disabled = false;
		}
	});
}
