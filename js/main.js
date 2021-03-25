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
const longGoodsList = document.querySelector('.long-goods-list');
const viewAll = document.querySelectorAll('.view-all');
const showClothing = document.querySelectorAll('.show-clothing');
const showAccessories = document.querySelectorAll('.show-accessories');
const scrollLinks = document.querySelectorAll('a.scroll-link');
const cartTableGoods = document.querySelector('.cart-table__goods');
const cardTableTotal = document.querySelector('.card-table__total');

const getGoods = async () => {
	const result = await fetch('db/db.json');
	if (!result.ok) {
		throw 'Error bro' + result.status
	}
	return result.json();
}

const cart = {
	cartGoods: [],
	renderCart(){
		cartTableGoods.textContent = '';
		this.cartGoods.forEach(({id,name,price,count})=>{
			const trGood = document.createElement('tr');
			trGood.className = 'cart-item';
			trGood.dataset.id = id;

			trGood.innerHTML = `
					<td>${name}</td>
					<td>${price}</td>
					<td><button class="cart-btn-minus">-</button></td>
					<td>${count}</td>
					<td><button class="cart-btn-plus">+</button></td>
					<td>${price * count}</td>
					<td><button class="cart-btn-delete">x</button ></td>
			`;
			cartTableGoods.append(trGood);
			});

			const totalPrice = this.cartGoods.reduce((sum,item) => {
				return sum + (item.price * item.count);
			}, 0);
			cardTableTotal.textContent = totalPrice + '$';
	},
	
	deleteGood(id){
		this.cartGoods = this.cartGoods.filter(item => id !== item.id);
		this.renderCart();
	},	
	minusGood(id){
		for (const item of this.cartGoods){
			if (item.id === id){
				if (item.count <= 1){
					this.deleteGood(id)
				} else {
					item.count--;
				}
				break;
			}
		}
		this.renderCart();
	}, 
	plusGood(id){
		for (const item of this.cartGoods){
			if (item.id === id){
				item.count++;
				break;
			}
		}
		this.renderCart();
	},
	addCartGoods(id){
		const goodItem = this.cartGoods.find( item => item.id === id);
		if(goodItem) {
			this.plusGood(id);
		} else {
			getGoods()
				.then(data => data.find(item => item.id === id))
				.then(({id, name,price}) => {
					this.cartGoods.push({
						id,
						name,
						price,
						count: 1
					});
				}); 
		}
	},
}

document.body.addEventListener('click', event => {
	const addToCart = event.target.closest('.add-to-cart');
	if (addToCart){
		cart.addCartGoods(addToCart.dataset.id);
	}
})

cartTableGoods.addEventListener('click', event => {
	const target = event.target;
	if (target.classList.contains('cart-btn-delete')) {
		const id = target.closest('.cart-item').dataset.id;
		cart.deleteGood(id);
	};
	if (target.classList.contains('cart-btn-minus')){
		const id = target.closest('.cart-item').dataset.id;
		cart.minusGood(id);
	}
	if (target.classList.contains('cart-btn-plus')){
		const id = target.closest('.cart-item').dataset.id;
		cart.plusGood(id);
	}
});

const openModal = () => {
	cart.renderCart();
	modalCart.classList.add('show');
	
};

const closeModal = () => {
	modalCart.classList.remove('show');
	
};

buttonCart.addEventListener('click', openModal);
modalClose.addEventListener('click', closeModal);

{
	for (const scrollLink of scrollLinks) {
		scrollLink.addEventListener('click', (event) => {
			event.preventDefault();
			const id = scrollLink.getAttribute('href');
			document.querySelector(id).scrollIntoView({
				behavior: 'smooth',
				block: 'start',
			});
		});
	}
}

const navigationLink = document.querySelectorAll('.navigation-link:not(.view-all)');

modalCart.addEventListener('click', (event) => {
	const target = event.target;
	if (target.classList.contains('overlay')) {
		closeModal();
	}
});

const createCard = ({ label, name, img, description, price, id }) => {
	const card = document.createElement('div');
	card.className = 'col-lg-3 col-sm-6'

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
	`;	
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

viewAll.forEach((elem) => {
	elem.addEventListener('click', showAll);
});

const filterCards = (field, value) => {
	getGoods()
		.then(data => data.filter(good => good[field] === value))
		.then(renderCards);
};

navigationLink.forEach(function (link) {
	link.addEventListener('click', event => {
		event.preventDefault();
		const field = link.dataset.field;
		const value = link.textContent;
		filterCards(field, value);
	})
})

showAccessories.forEach(item => {
	item.addEventListener('click', event => {
		event.preventDefault();
		filterCards('category', 'Accessories');
	})
})

showClothing.forEach(item => {
	item.addEventListener('click', event => {
		event.preventDefault();
		filterCards('category', 'Clothing');
	})
})