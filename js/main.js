const mySwiper = new Swiper('.swiper-container', {
	loop: true,

	// Navigation arrows
	navigation: {
		nextEl: '.slider-button-next',
		prevEl: '.slider-button-prev',
	},
});

const buttonCart = document.querySelector('.button-cart');
const modalCart = document.querySelector('#modal-cart');
const modalClose = document.querySelector('.modal-close');
// const scrollLink = document.querySelectorAll('a.scroll-link');

// (function () {
// 	for (let i = 0; i < scrollLink.length; i++) {
// 		scrollLink[i].addEventListener('click', function (event) {
// 			event.preventDefault();
// 			const id = scrollLink[i].getAttribute('href');
// 			document.querySelector(id).scrollIntoView({
// 				behavior: 'smooth',
// 				block: 'start',
// 			})											OLD METHOD
// 		})
// 	}
// })();




const openModal = () => {
	modalCart.classList.add('show');
};

const closeModal = () => {
	modalCart.classList.remove('show');
};

modalCart.addEventListener('click', (event) => {
	const target = event.target;
	if (target.classList.contains('overlay')) {
		closeModal();
	}
});




buttonCart.addEventListener('click', openModal);
modalClose.addEventListener('click', closeModal);


{
	const scrollLinks = document.querySelectorAll('a.scroll-link');

	for (const scrollLink of scrollLinks) {
		scrollLink.addEventListener('click', function (event) {
			event.preventDefault();
			const id = scrollLink.getAttribute('href');
			document.querySelector(id).scrollIntoView({
				behavior: 'smooth',
				block: 'start',
			});
		});
	}

}
{
	const scrollLinks = document.querySelectorAll('a.scroll-link');

	for (const scrollLink of scrollLinks) {
		scrollLink.addEventListener('click', function (event) {
			event.preventDefault();
			const id = scrollLink.getAttribute('href');
			document.querySelector(id).scrollIntoView({
				behavior: 'smooth',
				block: 'start',
			});
		});
	}

}

//goods


const navigationLink = document.querySelectorAll('.navigation-link:not(.view-all)');
const longGoodsList = document.querySelector('.long-goods-list');
const viewAll = document.querySelectorAll('.view-all');
const showClothing = document.querySelector('.show-clothing');
const showAccessories = document.querySelector('.show-accessories');

const getGoods = async () => {
	const result = await fetch('db/db.json');
	if (!result.ok) {
		throw 'Error bro' + result.status
	}
	return result.json();
}

const createCard = ({ label, name, img, description, price, id }) => {
	const card = document.createElement('div');
	card.className = 'col-lg-3 col-sm-6'

	// const label = objCard.label;
	// const name = objCard.name;;		Деструктиризація іннера нижче

	// const {label,name,img,description,price} = objCard; переносим в
	// createCard замість creatrCard = (objCard);

	card.innerHTML = `
				<div class="goods-card">
				${label ? `<span class="label">${label}</span>` : ''}

					<img src="db/${img}" alt="${name}" class="goods-image">
					<h3 class="goods-title">${name}</h3>
					<p class="goods-description">${description}</p>					
					<button class="button goods-card-btn add-to-cart" data-id="${id}">
						<span class="button-price">$${price}</span>
					</button>
				</div>			
	`;		// замість ${objCard.label} і т.д в кожному $

	return card;

};

const renderCards = (data) => {
	longGoodsList.textContent = '';
	const cards = data.map(createCard)
	// cards.forEach( (card) => {		OLD METHOD
	// 	longGoodsList.append(card)
	longGoodsList.append(...cards)

	document.body.classList.add('show-goods')
};


const showAll = (event) => {
		event.preventDefault();
		getGoods().then(renderCards);
	}

	viewAll.forEach((elem)=>{
		elem.addEventListener('click', showAll);
	});


const filterCards = (field, value) => {
	getGoods()
		.then((data) => {
			const filteredGoods = data.filter((good) => {
				return good[field] === value
			})
			return filteredGoods;
		})
		.then(renderCards);
}

navigationLink.forEach(function (link) {
	link.addEventListener('click', function (event) {
		event.preventDefault();
		const field = link.dataset.field;
		const value = link.textContent;
		filterCards(field, value);
	})
})

// const thing = addEventListener('click', (event) => {
// 	const target = event.target;
// 	if (target.classList.contains('things') || target.classList.contains('more')) {
// 		event.preventDefault();
// 		getGoods().then(renderCards);
// 	}
// });									My old try with "ALL" and "View ALL"


// const check = addEventListener('click', (event) => {
// 	const target = event.target;
// 	console.log(target);
// })



// showClothing.forEach(item => {
// 	item.addEventListener('click', event => {
// 		event.preventDefault();
// 		filterCards('category', 'Clothing');
// 	});
// });
