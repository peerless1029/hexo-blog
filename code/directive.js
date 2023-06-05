import Vue from 'vue';

function log(...rest) {
    console.log('=>', ...rest);
}

// mock埋点
function track(...rest) {
    log('track', ...rest);
}

// 节流
Vue.directive('throttle', {
    bind: (el, binding) => {
        let throttleTime = binding.value;
        if (!throttleTime) throttleTime = 2000;
        let cbFun;
        el.addEventListener('click', event => {
            if (!cbFun) { // 第一次执行
                cbFun = setTimeout(() => {
                    cbFun = null;
                }, throttleTime);
            } else {
                event && event.stopImmediatePropagation();
            }
        }, true);
    },
});

// 复制
Vue.directive('copy', {
    bind(el, { value }) {
        el.$value = value;
        el.handler = () => {
            if (!el.$value) {
                log('无复制内容');
                return;
            }
            const textarea = document.createElement('textarea');
            textarea.readOnly = 'readonly';
            textarea.style.position = 'absolute';
            textarea.style.left = '-9999px';
            textarea.value = el.$value;
            document.body.appendChild(textarea);
            textarea.select();
            const result = document.execCommand('Copy');
            if (result) {
                log('复制成功，复制内容为：', el.$value);
            }
            document.body.removeChild(textarea);
        };
        el.addEventListener('click', el.handler);
    },
    componentUpdated: (el, { value }) => {
        el.$value = value;
    },
    unbind: (el) => {
        el.removeEventListener('click', el.handler);
    },
});

// 拖拽
Vue.directive('drag', {
    inserted: (el) => {
        el.ontouchstart = function(e) {
            let disX = e.touches[0].pageX - el.offsetLeft;
            let disY = e.touches[0].pageY - el.offsetTop;
            document.ontouchmove = function(e) {
                let x = e.touches[0].pageX - disX;
                let y = e.touches[0].pageY - disY;
                let maxX = document.body.clientWidth - parseInt(window.getComputedStyle(el).width);
                let maxY = document.body.clientHeight - parseInt(window.getComputedStyle(el).height);

                if (x < 0) x = 0;
                if (x > maxX) x = maxX;
                if (y < 0) y = 0;
                if (y > maxY) y = maxY;

                el.style.position = 'fixed';
                el.style.left = x + 'px';
                el.style.top = y + 'px';
            };
            document.ontouchend = function() {
                document.ontouchmove = document.ontouchend = null;
            };
        };
    },
});

// 埋点
Vue.directive('track', {
    bind: (el, binding) => {
        const { value, modifiers, arg = '' } = binding;
        const { click = false, exposure = false, delay = false } = modifiers;
        if (!arg) {
            console.warn('=>请检查埋点参数');
            return;
        }
        if (exposure) {   // 点击事件埋点
            setTimeout(() => {
                track({
                    page_id: arg || 'activity_page',
                }, 'exposure');
            }, delay ? 2000 : 0);
        } else { // 曝光埋点
            el.addEventListener('click', () => {
                setTimeout(() => {
                    track({
                        page_id: arg || 'activity_page',
                        event_id: value,
                    }, 'click');
                }, delay ? 1000 : 0);
            });
        }
    },
});

// 图片懒加载
const LazyLoad = {
    // install方法
    install(options) {
        // 代替图片的loading图
        let defaultSrc = options.default;
        Vue.directive('lazy', {
            bind(el, binding) {
                LazyLoad.init(el, binding.value, defaultSrc);
            },
            inserted(el) {
                // 兼容处理
                if ('IntersectionObserver' in window) {
                    LazyLoad.observe(el);
                } else {
                    LazyLoad.listenerScroll(el);
                }
            },
        });
    },
    // 初始化
    init(el, val, def) {
        // data-src 储存真实src
        el.setAttribute('data-src', val);
        el.setAttribute('src', def);
    },
    // 利用IntersectionObserver监听el
    observe(el) {
        let io = new IntersectionObserver(entries => {
            let realSrc = el.dataset.src;
            if (entries[0].isIntersecting) {
                if (realSrc) {
                    el.src = realSrc;
                    el.removeAttribute('data-src');
                }
            }
        });
        io.observe(el);
    },
    // 监听scroll事件
    listenerScroll(el) {
        let handler = LazyLoad.throttle(LazyLoad.load, 300);
        LazyLoad.load(el);
        window.addEventListener('scroll', () => {
            handler(el);
        });
    },
    // 加载图片
    load(el) {
        let windowHeight = document.documentElement.clientHeight;
        let elTop = el.getBoundingClientRect().top;
        let elBtm = el.getBoundingClientRect().bottom;
        let realSrc = el.dataset.src;
        if (elTop - windowHeight < 0 && elBtm > 0) {
            if (realSrc) {
                el.src = realSrc;
                el.removeAttribute('data-src');
            }
        }
    },
    // 节流
    throttle(fn, delay) {
        let timer;
        let prevTime;
        return function(...args) {
            let currTime = Date.now();
            let context = this;
            if (!prevTime) prevTime = currTime;
            clearTimeout(timer);

            if (currTime - prevTime > delay) {
                prevTime = currTime;
                fn.apply(context, args);
                clearTimeout(timer);
                return;
            }

            timer = setTimeout(function() {
                prevTime = Date.now();
                timer = null;
                fn.apply(context, args);
            }, delay);
        };
    },
};

LazyLoad.install({
    default: 'https://obs-cdn.52tt.com/tt/fe-moss/web/loading/20230421174650_95985446.gif', // 默认图片封面
});

// 无限滚动加载
Vue.directive('scrollBottom', {
    bind: (el, binding) => {
        el.onscroll = () => {
            let isTrigger = false;
            if (el.scrollHeight - el.clientHeight <= el.scrollTop) {
                if (isTrigger) return;
                isTrigger = true;
                setTimeout(() => {
                    binding.value();
                    isTrigger = false;
                }, 500);
            }
        };
    },
});



