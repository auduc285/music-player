const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
const playlist = $('.playlist');
const heading = $('header h2');
const cdThumb = $('.cd-thumb');
const audio = $('#audio');
const playBtn = $('.btn-toggle-play');
const player = $('.player');
const progress = $('#progress');
const nextBtn = $('.btn-next');
const prevBtn = $('.btn-prev');
const randomBtn = $('.btn-random');
const repeatBtn = $('.btn-repeat');
const playList = $('.playlist');
const app = {
    currenIndex: 0,
    isPlaying: false,
    isRanDom: false,
    isRepeat: false,
    songs: [
        {
            name: 'Tiếng Pháo Tiễn Người',
            singer: 'Hùng Quân',
            path: './assets/music/Tiếng Pháo Tiễn Người.mp3',
            img: './assets/img/tiengphao.jpg'
        },
        {
            name: 'Pháo Hồng',
            singer: 'Đạt Long Vinh',
            path: './assets/music/Pháo Hồng.mp3',
            img: './assets/img/phaohong.jpg'
        },
        {
            name: 'Sài Gòn Yếu Đuối Biết Dựa Vào Ai',
            singer: 'Tăng Phúc',
            path: './assets/music/Sài Gòn.mp3',
            img: './assets/img/saigon.jpg'
        },
        {
            name: 'Đã Không Yêu Thì Thôi',
            singer: 'Tăng Phúc',
            path: './assets/music/Đã Không Yêu.mp3',
            img: './assets/img/dakhongyeu.jpg'
        },
        {
            name: 'Có Lẽ Quá Khó Để Quên Một Người',
            singer: '1nG ft Nam Lee n Dblue',
            path: './assets/music/Có Lẽ Quá Khó.mp3',
            img: './assets/img/colequakho.jpg'
        },
        {
            name: 'Thu Cuối',
            singer: 'Mr.T ft Yanbi & Hằng Bingboong',
            path: './assets/music/Thu Cuối.mp3',
            img: './assets/img/thucuoi.jpg'
        },
        {
            name: 'Trước Khi Tuổi Trẻ Này Đóng Lối',
            singer: 'Ngắn x Xám x Dick',
            path: './assets/music/Trước Khi.mp3',
            img: './assets/img/truockhi.jpg'
        },
        {
            name: 'Đứa Nào Làm Em Buồn Thế',
            singer: 'Phúc Du - Hoàng Dũng',
            path: './assets/music/Đứa Nào.mp3',
            img: './assets/img/duanao.jpg'
        }
    ],
    //Hàm in list nhạc
    render: function () {
        const htmls = this.songs.map((song, index) => {
            return `
                    <div class="song ${index === this.currenIndex ? 'active' : ''}" data-index="${index}">
                        <div class="thumb"
                            style="background-image: url('${song.img}')">
                        </div>
                        <div class="body">
                            <h3 class="title">${song.name}</h3>  
                            <p class="author">${song.singer}</p>  
                        </div>   
                        <div class="option">
                            <i class="fa fa-ellipsis-h"></i>    
                        </div> 
                    </div>
                `
        })
        playlist.innerHTML = htmls.join('');
    },
    //Hàm xử lí sự kiện
    handleEnvent: function () {
        const cd = $('.cd'); //Chọc vào đĩa nhạc
        const cdWidth = cd.offsetWidth; //Lấy chiều rộng đĩa cd
        //Xử lý CD khi bấm pause / play
        const cdThumdAnimate = cdThumb.animate([
            { transform: 'rotate(360deg)' }
        ], {
            duration: 100000,
            iteration: Infinity
        })
        cdThumdAnimate.pause();
        //Xử lí đĩa CD khi di chuột
        document.onscroll = function () {
            const scrollTop = window.scrollY || document.documentElement.scrollTop;
            //Lấy độ dài khi kéo lên xuống
            const newCdWidth = cdWidth - scrollTop;
            //Khi kéo playlist lên thì CD giảm dần
            cd.style.width = newCdWidth > 0 ? newCdWidth + 'px' : 0; //Đặt chiều rộng mới cho cd
            cd.style.opacity = newCdWidth / cdWidth; //Cho CD mờ dần khi kéo lên
        }
        //Xử lý nút play
        playBtn.onclick = function () { //Khi nút play được bấm
            if (app.isPlaying) { //Nếu đang phát thì tắt
                audio.pause();
            } else {
                audio.play();
            }
        }
        //Khi bài hát được bật
        audio.onplay = function () {
            app.isPlaying = true;
            player.classList.add('playing');
            cdThumdAnimate.play();
        }
        //Khi bài hát được tắt
        audio.onpause = function () {
            app.isPlaying = false;
            player.classList.remove('playing');
            cdThumdAnimate.pause();
        }
        //Xử lý thanh thời gian
        audio.ontimeupdate = function () { //Khi bài hát đang bật
            if (audio.duration) { //Thời lượng bài hát khác 0
                const progressPersent = Math.floor(audio.currentTime / audio.duration * 100);
                //Thời gian hiện tại bài hát / tổng thời gian bài hát
                progress.value = progressPersent;
            }
        }
        //Xử lý khi kéo thời gian
        progress.onchange = function (e) {
            audio.currentTime = e.target.value * audio.duration / 100;
        }
        //Xử lý khi bấm nút chuyển bài tiếp theo
        nextBtn.onclick = function () {
            if (app.isRanDom && app.isRepeat) {
                app.playRepeat();
            } else if (app.isRanDom && !app.isRepeat) {
                app.playRanDom();
            } else if (app.isRepeat) {
                app.playRepeat();
            } else {
                app.nextSong();
                audio.play();
                app.render();
            }
        }
        //Xử lý khi bấm nút lùi bài hát
        prevBtn.onclick = function () {
            if (app.isRanDom && app.isRepeat) {
                app.playRepeat();
            } else if (app.isRanDom && !app.isRepeat) {
                app.playRanDom();
            } else if (app.isRepeat) {
                app.playRepeat();
            } else {
                app.prevSong();
                audio.play();
                app.render();
            }
        }
        //Xử lý khi bấm nút random
        randomBtn.onclick = function () {
            if (app.isRanDom) {
                app.isRanDom = false;
                this.classList.remove('active');
            } else {
                app.isRanDom = true;
                this.classList.add('active');
            }
        }
        //Xử lý chuyển bài khi bài hát kết thúc
        audio.onended = function () {
            if (app.isRanDom && app.isRepeat) {
                app.playRepeat();
            } else if (app.isRanDom && !app.isRepeat) {
                app.playRanDom();
            } else if (app.isRepeat) {
                app.playRepeat();
            } else {
                app.nextSong();
                audio.play();
                app.render();
            }
        }
        //Xử lý nút repeat
        repeatBtn.onclick = function () {
            if (app.isRepeat) {
                app.isRepeat = false;
                this.classList.remove('active');
            } else {
                app.isRepeat = true;
                this.classList.add('active');
            }
        }
        //Xử lý khi click bài hát
        playList.onclick = function (e) {
            const songNode = e.target.closest('.song:not(.active)');
            if (songNode || e.target.closest('option')) {
                if (songNode) {
                    app.currenIndex = Number(songNode.dataset.index);
                    app.loadCurrenSong();
                    app.render();
                    audio.play();
                }
            }
        }
    },
    //Hàm trả về bài hát đầu tiên
    defineProperties: function () {
        //Định nghĩa thuộc tính cho bài hát đầu tiên
        Object.defineProperty(this, "currentSong", {
            get: function () {
                return this.songs[this.currenIndex];
            }
        })
    },
    //Load bài hát hiện tại
    loadCurrenSong: function () {
        heading.textContent = this.currentSong.name;
        cdThumb.style.backgroundImage = `url('${this.currentSong.img}')`;
        audio.src = this.currentSong.path;
    },
    //Chuyển bài hát tiếp theo
    nextSong: function () {
        this.currenIndex++;
        if (this.currenIndex >= this.songs.length) {
            this.currenIndex = 0;
        }
        this.loadCurrenSong();
    },
    //Lùi bài trước đó
    prevSong: function () {
        this.currenIndex--;
        if (this.currenIndex < 0) {
            this.currenIndex = 0;
        }
        this.loadCurrenSong();
    },
    //Chức năng chuyển bài khi random
    playRanDom: function () {
        let newIndex;
        do {
            newIndex = Math.floor(Math.random() * this.songs.length);
        } while (newIndex == this.currenIndex);
        this.currenIndex = newIndex;
        this.loadCurrenSong();
        audio.play();
        app.render();
    },
    playRepeat: function () {
        let newIndex = this.currenIndex;
        this.currenIndex = newIndex;
        this.loadCurrenSong();
        audio.play();
        app.render();
    },
    start: function () {
        //Định nghĩa các thuộc tính cho Object
        this.defineProperties();
        this.handleEnvent();
        //Load bài hát hiện tại
        this.loadCurrenSong();
        this.render();
    }
}
app.start();  