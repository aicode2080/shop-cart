class CreateData {
  constructor(g) {
    this.data = g;
    this.choose = 0;
  }
  /**
   *
   * @returns 获取总价
   */
  getTotalPrice() {
    return this.data.price * this.choose;
  }

  isChoose() {
    return this.choose > 0;
  }
  add() {
    return this.choose++;
  }
  decrease() {
    if (this.choose === 0) {
      return (this.choose = 0);
    }
    return this.choose--;
  }
}

class createUiData {
  constructor() {
    let uiGoods = [];
    for (let i = 0; i < goods.length; i++) {
      var itemGood = new CreateData(goods[i]);
      uiGoods.push(itemGood);
    }
    this.uiGoods = uiGoods;
    this.needsend = 30;
    this.delivery = 5;
  }
  getTotalPrice() {
    let sum = 0;
    for (let index = 0; index < this.uiGoods.length; index++) {
      sum += this.uiGoods[index].getTotalPrice();
    }
    return sum;
  }
  isCrossDeliveryThreshold() {
    return this.getTotalPrice() >= this.needsend;
  }
  getGoodsNumber() {
    var sum = 0;
    for (let i = 0; i < this.uiGoods.length; i++) {
      sum += this.uiGoods[i].choose;
    }
    return sum;
  }
  isChoose(index) {
    return this.uiGoods[index].choose;
  }
  hasGoodsCar() {
    return this.getGoodsNumber() > 0;
  }
  decrease(index) {
    return this.uiGoods[index].decrease();
  }
  add(index) {
    return this.uiGoods[index].add();
  }
}

class UI {
  constructor() {
    this.uiData = new createUiData();
    this.doms = {
      goodsList: document.querySelector('.goods-list'),
      deliveryPrice: document.querySelector('.footer-car-tip'),
      footerPay: document.querySelector('.footer-pay'),
      footerPayInnerSpan: document.querySelector('.footer-pay span'),
      totalPrice: document.querySelector('.footer-car-total'),
      car: document.querySelector('.footer-car'),
      badge: document.querySelector('.footer-car-badge'),
    };
    const cartRect = this.doms.car.getBoundingClientRect();
    this.target = {
      x: cartRect.left + cartRect.width / 2,
      y: cartRect.top + cartRect.height / 5,
    };
    this.createHtml();
    this.updateFooter();
    this.listenEvent();
  }
  createHtml() {
    let html = '';
    for (let index = 0; index < this.uiData.uiGoods.length; index++) {
      const item = this.uiData.uiGoods[index];
      const { data } = item;
      html += `<div class="goods-item">
          <img src="${data.pic}" alt="" class="goods-pic" />
          <div class="goods-info">
            <h2 class="goods-title">${data.title}</h2>
            <p class="goods-desc">
                ${data.desc}
            </p>
            <p class="goods-sell">
              <span>月售 ${data.sellNumber}</span>
              <span>好评率${data.favorRate}%</span>
            </p>
            <div class="goods-confirm">
              <p class="goods-price">
                <span class="goods-price-unit">￥</span>
                <span>${data.price}</span>
              </p>
              <div class="goods-btns">
                <i index="${index}" class="iconfont i-jianhao"></i>
                <span>0</span>
                <i index="${index}" class="iconfont i-jiajianzujianjiahao"></i>
              </div>
            </div>
          </div>
        </div>`;
    }
    this.doms.goodsList.innerHTML = html;
  }
  increase(index) {
    this.uiData.add(index);
    this.updateGoodsItem(index);
    this.updateFooter();
    this.jump(index);
  }
  decrease(index) {
    this.uiData.decrease(index);
    this.updateGoodsItem(index);
    this.updateFooter();
  }
  updateGoodsItem(index) {
    const itemDom = this.doms.goodsList.children[index];
    if (this.uiData.isChoose(index)) {
      itemDom.classList.add('active');
    } else {
      itemDom.classList.remove('active');
    }
    const spanText = itemDom.querySelector('.goods-btns span');
    spanText.textContent = this.uiData.uiGoods[index].choose;
  }
  updateFooter() {
    const total = this.uiData.getTotalPrice();
    this.doms.deliveryPrice.textContent = `配送费￥${this.uiData.delivery}`;
    if (this.uiData.isCrossDeliveryThreshold()) {
      this.doms.footerPay.classList.add('active');
    } else {
      this.doms.footerPay.classList.remove('active');
      let dis = this.uiData.needsend - total;
      dis = Math.round(dis);
      this.doms.footerPayInnerSpan.textContent = `还差￥${dis}元起送`;
    }
    this.doms.totalPrice.textContent = `${total.toFixed(2)}`;
    if (this.uiData.hasGoodsCar()) {
      this.doms.car.classList.add('active');
    } else {
      this.doms.car.classList.remove('active');
    }
    this.doms.badge.textContent = this.uiData.getGoodsNumber();
  }
  carAnimate() {
    this.doms.car.classList.add('animate');
  }
  // 监听各种事件
  listenEvent() {
    this.doms.car.addEventListener('animationend', function () {
      this.classList.remove('animate');
    });
  }
  jump(index) {
    const btnAdd = this.doms.goodsList.children[index].querySelector(
      '.i-jiajianzujianjiahao'
    );
    const rect = btnAdd.getBoundingClientRect();
    const start = {
      x: rect.left,
      y: rect.top,
    };
    const div = document.createElement('div');
    div.className = 'add-to-car';
    const i = document.createElement('i');
    i.className = 'iconfont i-jiajianzujianjiahao';

    div.style.transform = `translateX(${start.x}px)`;
    i.style.transform = `translateY(${start.y}px)`;
    div.appendChild(i);
    document.body.appendChild(div);
    div.clientWidth;

    // 运动到目标
    div.style.transform = `translateX(${this.target.x}px)`;
    i.style.transform = `translateY(${this.target.y}px)`;
    var that = this;
    div.addEventListener(
      'transitionend',
      function () {
        div.remove();
        that.carAnimate();
      },
      {
        once: true,
      }
    );
  }
}

const ui = new UI();
ui.doms.goodsList.addEventListener('click', (e) => {
  if (e.target.classList.contains('i-jiajianzujianjiahao')) {
    const index = e.target.getAttribute('index');
    ui.increase(index);
  } else if (e.target.classList.contains('i-jianhao')) {
    const index = e.target.getAttribute('index');
    ui.decrease(index);
  }
});

window.addEventListener('keypress', (e) => {
  if (e.code === 'Equal') {
    ui.increase(0);
  } else if (e.code === 'Minus') {
    ui.decrease(0);
  }
});
