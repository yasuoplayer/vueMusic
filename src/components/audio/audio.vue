<template>
    <div class="audio"  :id="isbig?'':'small'">
        <transition name="detail">
        <div v-if="isbig">
            <div class="big" :style="backgroundImage" >
            </div>
            <div class="top">
                <div class="title"  @click.stop.prevent="big">
                    <p class="songname">{{currentsong.songname}}</p>
                    <p>{{currentsong.singer}}</p>
                </div>
                <div class="img" @touchstart="ts1" @touchmove="tm1" @touchend="te1">
                    <div class="ulbox">
                        <ul :class="islrc?'lrc':''">
                            <li>
                                <img :src="currentimg" :class="isplay?'play':'paused'"/>
                            </li>
                            <li>
                            <div class="scroll" ref="scroll">
                            <ul  v-if="lyric&&lyric.lines">
                            <li v-for="(item,index) in lyric.lines" ref="lines" :class="currentline==index?'lineactive':''" v-html="item.txt"></li>
                            </ul>
                            </div>
                            </li>
                        </ul>
                    </div>
                </div>
                <div class="dots">
                    <span   :class="islrc?'':'active'"></span>
                    <span :class="islrc?'active':''"></span>
                </div>
                <div class="progress-wrap">
                    <div class="time">{{change(currenttime)}}</div>
                    <div class="progress" ref="pro">
                        <div class="bar" ref="bar"></div>
                        <div class="pbtn" ref="btn" @touchstart.prevent="ts" @touchmove.prevent="tm" @touchend="te"></div>
                    </div>
                    <div class="time">{{change(total)}}</div>
                </div>
                <div class="btns">
                    <div class="mode" @click="changemode">
                        <span>{{getmode}}</span>
                    </div>
                    <div class="prev" @click="prev">
                        <span>上一首</span>
                    </div>
                    <div class="pl">
                        <span @click.stop.prevent="toggleplay">{{isplay?'暂停':'播放'}}</span>
                    </div>
                    <div class="next" @click="next">
                        <span>下一首</span>
                    </div>
                    <div class="colletion">
                        <span @click="toggleclick">{{iscoll?'取消':'收藏'}}</span>
                    </div>
                </div>
            </div>
        </div>
        </transition>
        <transition name="detail">
            <div class="small" v-if="!isbig"  @click.stop.prevent="small">
            <div class="simg">
                <img :src="currentimg" :class="isplay?'play':'paused'"/>
            </div>
            <div class="sinfo">
                <div><span>{{currentsong.songname}}</span> - <span>{{currentsong.singer}}</span></div>
                <div><span>{{change(currenttime)}}</span> / <span>{{change(total)}}</span>  </div>
            </div>
            <div class="sbtn">
                <span @click.stop.prevent="toggleplay" >{{isplay?'暂停':'播放'}}</span>
                <span @click.stop.prevent="toggleclick">{{iscoll?'取消':'收藏'}}</span>
            </div>
        </div>
        </transition>
        <audio :src="currenturl"  style="display: none"  ref="audio" id="audio"></audio>
    </div>
</template>

<script>
    import vueresource from 'vue-resource';
    import vue from 'vue';
    import { Base64 } from 'js-base64';
    import lyric  from 'lyric-parser';
    import BScroll from 'better-scroll';
    vue.use(vueresource)
    export default {
        data:function () {
            return{
                songs:[],
                index:0,
                currentsong:null,
                backgroundImage:null,
                currentimg:null,
                currenturl:null,
                isplay:false,
                currenttime:0,
                total:0,
                mode:0,
                istouch:false,
                toucheX:{
                    x:0,
                    x1:0,
                    x2:0,
                },
                lyricstr:null,
                lyric:null,
                currentline:0,
                isbig:true,
                islrc:false,
                toucheX1:{
                    x1:0,
                    x2:0
                },
                mysongs:[]
            }
        },
        watch:{
            gsong:function(n)
            {
              this.songs = n;
              this.index = 0;
              this.currentsong = n[0];
              this.$store.commit('setcurrentindex',0)
              this.$store.commit('setcurrentsong',n[0])
            },
            getindex:function(n)
            {
              this.index = n;
            },
            getsong:function(n)
            {
                this.currentsong = n;
            },
            isbig:function(n)
            {
                this.lyricstr =this.lyricstr;
                this.$store.commit('setisbig',n)
            },
            lyricstr:function(n)
            {
                    if(this.lyric)
                    {

                        this.lyric.stop();
                    }
                    this.lyric = new lyric(n, this.handler);
                    if(this.isbig==true)
                    {


                    this.$nextTick(()=>{
                        this.scroll = new BScroll(this.$refs.scroll,{
                        })
                    })
                    }
            },
            currenttime:function(n)
            {
                if(!this.istouch)
                {
                    if(this.$refs.bar)
                    {
                        this.$refs.bar.style.width = (this.$refs.pro.clientWidth)*(n/this.total) +'px';
                        this.$refs.btn.style.left = (this.$refs.pro.clientWidth)*(n/this.total) +'px';
                    }
                }
                if(this.lyric)
                {
                    this.lyric.play();
                    this.lyric.seek(n*1000);
                }

            },
            currentsong(n)
            {
                this.backgroundImage = `background-image:url('https://y.gtimg.cn/music/photo_new/T002R300x300M000${n.albummid}.jpg?max_age=2592000')`;
                this.currentimg = `https://y.gtimg.cn/music/photo_new/T002R300x300M000${n.albummid}.jpg?max_age=2592000`;
                this.currenturl = `http://dl.stream.qqmusic.qq.com/C400${n.songmid}.m4a?guid=7498084000&vkey=AA77A177B35CCEE5F2F3B35D98370452E05C6210F08DD0695DA6BB1804C1681156A0274EE7C2B28E95B4FB388A92AED2C999FC2054088F88&uin=0&fromtag=38`;
                this.initmusic();
                this.lyricstr = '';
                this.getlrc();
                this.iscoll=this.checkmysongs(n)
            }
            ,
            isplay(n)
            {
                if(n==true)
                {
                    this.$refs.audio.play();
                    this.$refs.audio.volume=0.5
                    if(this.lyric)
                    {
                        this.lyric.play();
                    }

                    return
                }
                this.$refs.audio.pause();
                this.lyric.stop();
            }
        },
        created:function () {
            this.isbig = this.$store.state.isbig;
            this.songs = this.$store.state.songs;
            this.index = this.$store.state.currentindex;
            this.currentsong = this.$store.state.currentsong;
            this.getcurrentsong();
            this.msongs = this.$store.state.mysongs;
            this.iscoll=this.checkmysongs(this.currentsong);
        },
        computed:{
            getmode:function () {
                var modenum = this.mode%3;
                if(modenum==0)
                {
                    return '列循'
                }
                else if(modenum==1)
                {
                    return '随机'
                }
                return '单循'
            },
            getindex:function () {

                return this.$store.state.index
            },
            getsong:function () {
                return this.$store.state.currentsong
            }
        },
        methods:{
            checkmysongs:function(song)
            {
                var msongs = this.mysongs;
                for(var n=0;n<msongs.length;n++)
                {
                    var items = msongs[n].songs;

                    for (var j=0;j<items.length;j++)
                    {
                        if(items[j].songmid==song.songmid)
                        {
                            return 1
                        }
                    }
                }
                return 0
            },
            addmysongs:function(song)
            {
                var songs = this.mysongs;
                for(var n=0;n<songs.length;n++)
                {
                    if(song.singer==songs[n].singer)
                    {
                        var ssong = songs[n].songs
                        ssong.push(song)
                        return
                    }
                }
                var singer = {
                    singer:song.singer,
                    songs:[],
                    isopen:false
                }
                singer.songs.push(song)
                songs.push(singer)
            },
            deletemysongs:function(song)
            {
                var songs = this.mysongs;
                for(var n=0;n<songs.length;n++)
                {
                    if(songs[n].singer==song.singer)
                    {
                        var ssong = songs[n].songs;
                        for (var j=0;j<ssong.length;j++)
                        {
                            if(song.songmid==ssong[j].songmid)
                            {
                                ssong.splice(j,1)
                                if(!ssong.length)
                                {
                                    songs.splice(n,1)
                                }
                                return
                            }
                        }
                    }
                }

            },
            toggleclick:function()
            {

                if(this.iscoll)
                {
                    this.deletemysongs(this.currentsong);
                }
                else
                {
                    this.addmysongs(this.currentsong)
                }
                this.$store.commit('setmysongs',this.mysongs)
                this.iscoll = !this.iscoll;

            },
            ts1:function(e)
            {
                this.toucheX1.x1 = e.touches[0].clientX;
            },
            tm1:function(e)
            {
                this.toucheX1.x2 = e.touches[0].clientX;
            },
            te1:function()
            {
              if(this.toucheX1.x2-this.toucheX1.x1>0)
              {
                  if(Math.abs(this.toucheX1.x2-this.toucheX1.x1)>50)
                  {
                      this.islrc = false;
                  }
              }
                if(this.toucheX1.x2-this.toucheX1.x1<0)
                {
                    if(Math.abs(this.toucheX1.x2-this.toucheX1.x1)>50)
                    {
                        this.islrc = true;
                    }
                }
            },
            big:function()
            {
              this.isbig = false;
              this.$store.commit('setisbig',false)
            },
            small:function()
            {
                this.isbig = true;
                this.$store.commit('setisbig',true)
            },
            handler:function({lineNum, txt}){
                this.currentline = lineNum;
                if(lineNum>3&&this.scroll)
                {
                    this.scroll.scrollToElement(this.$refs.lines[lineNum-3],500);
                }

            },
            getlrc:function()
            {
                var url = "http://localhost:8888/api/getLyric";
                var params = {
                    pcachetime:1542161532616,
                    g_tk:5381,
                    loginUin:0,
                    hostUin:0,
                    format:"jsonp",
                    inCharset:"utf8",
                    outCharset:"utf-8",
                    notice:0,
                    platform:"yqq",
                    needNewCode:0,
                    songmid:this.currentsong.songmid,
                };
                this.$http.get(url,{
                    params
                }).then((res)=>{
                    if(res.body.lyric)
                    {
                        this.lyricstr = Base64.decode(res.body.lyric)
                    }
                    else
                    {
                        this.lyricstr =''
                    }
                })
            },
            ts:function(e)
            {
                this.istouch = true;
                this.toucheX.x1 = e.touches[0].clientX;
            },
            tm:function(e)
            {
                this.toucheX.x2 = e.touches[0].clientX;
                var change = this.toucheX.x2-this.toucheX.x1;
                var width = this.$refs.bar.clientWidth+change;
                if(width<0)
                {
                    width = 0;
                }
                if(width>this.$refs.pro.clientWidth)
                {
                    width = this.$refs.pro.clientWidth;
                }
                this.$refs.bar.style.width = width +'px';
                this.$refs.btn.style.left = width +'px';
                this.toucheX.x1 = this.toucheX.x2;
                var currenttime = (width)/(this.$refs.pro.clientWidth)*this.total;
                this.currenttime = Math.floor(currenttime);

            },
            te:function()
            {
               this.istouch = false;this.$refs.audio.pause();
               this.$refs.audio.currentTime = this.currenttime;
               this.$refs.audio.play();
            },
            changemode:function()
            {
              this.mode++;
            },
            change:function(num){
                var num = Math.floor(num);
                var s = num%60<10? '0'+num%60 :num%60;
                var m = Math.floor(num/60)<10?'0'+Math.floor(num/60):Math.floor(num/60)
                return `${m}:${s}`
            },
            getcurrentsong:function () {
                this.currentsong=this.songs[this.index];
            },

            toggleplay:function () {
                this.isplay = !this.isplay;
                if(this.lyric)
                {
                    this.lyric.togglePlay()
                }
            },
            initmusic:function () {
                var that = this;
                this.$refs.audio.onloadedmetadata=function () {
                    that.total = this.duration;
                };
                this.$refs.audio.ontimeupdate = function () {
                    if(that.istouch==false)
                    {
                        that.currenttime = this.currentTime;
                    }
                }
                this.$refs.audio.onended = ()=>{
                    if(this.mode==0)
                    {
                        this.next()
                    }
                    else if(this.mode==0)
                    {
                        this.randomplay();
                    }
                    else
                    {
                        this.$refs.audio.currentTime = 0;
                    }
                }
                if(this.isplay)
                {
                    this.$refs.audio.oncanplay=()=>{
                        this.$refs.audio.play()
                    };
                }
            },
            prev:function () {
                this.index = --this.index<0?this.songs.length-1:this.index;
                this.getcurrentsong();
                console.log('prev')
            },
            next:function () {
                this.index = ++this.index>this.songs.length-1?0:this.index;
                this.getcurrentsong();
            },
            randomplay()
            {
                var next = Math.floor(Math.random()*this.songs.length);
                if(next==this.index)
                {
                    if(this.songs.length==1)
                    {
                        this.index = next;
                        this.getcurrentsong();
                        return
                    }
                    this.randomplay();
                    return
                }
                this.index = next;
                this.getcurrentsong();
            },

        }
    }
</script>

<style scoped>

    .detail-enter,.detail-leave-to
    {
        opacity: 0;
    }
    .detail-enter-to,.detail-leave
    {
        opacity: 1;
    }
    .detail-enter-active,.detail-leave-active{
        transition: .5s all;
    }
    .ulbox
    {
        width: 100%;
        height: 100%;

    }
    .ulbox>ul
    {
        position: relative;
        width: 200%;
        height: 100%;
        transition: all .5s;
    }
    .lrc{
        transform: translateX(-50%);
    }
    .ulbox>ul li
    {
        width: 50%;
        height: 100%;
        float: left;
        text-align: center;
    }

    #small{
        height: 70px;
        left: 0;
        top:693px ;
    }

    .small
    {
        position: fixed;
        bottom: 0;
        left: 0;
        width: 100%;
        z-index: 200;
        height: 70px;
        display: flex;
        background: black;
    }
    .sinfo
    {
        flex: 6;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
    .sinfo>div{
        padding: 10px;
    }
    .sbtn{
        flex: 2;
        text-align: center;
        line-height: 70px;
    }
    .sbtn>span
    {
        margin: 5px;
        padding: 5px;
    }
    .simg
    {
        text-align: center;
        flex: 2;
    }
    .small img
    {
        height: 50px;
        width: 50px;
        margin-top: 10px;
        border-radius: 50%;
    }
    .lineactive{
        color: yellow;
    }
    .scroll
    {
        height: 100%;
        width: 100%;
        overflow: hidden;
    }
    .scroll>ul
    {
        width: 100%;
    }
    .scroll>ul>li
    {
        width: 100%;
        padding: 10px;
        margin: 0 auto;
        float: none;
        height: 30px;

    }
    .audio
    {
        position: fixed;
        width: 100%;
        height: 100%;
        overflow: hidden;
        top: 0;
        left: 0;
        z-index: 999;
    }
.big{
    position: absolute;
    width: 100%;
    height: 100%;
    z-index: 20;
    top: 0;
    left: 0;
    background-repeat: no-repeat;
    background-size: 100% 100%;
    background-position: 0 0;
    transform: scale(1.1);
    filter: blur(10px);

}
.top{
    width: 100%;
    height: 100%;
    position: relative;
    z-index: 100;
}

.img
{
    margin-top: 100px;
    position: relative;
    text-align: center;
    height: 270px;
    overflow: hidden;
}
    .img img{
        width: 250px;
        height: 250px;
        border: 10px solid #ccc;
        border-radius: 50%;
        display: inline-block;
        margin: 0 auto;
    }

    .play{
        animation: move 8s linear infinite;
    }
    .paused
    {
        animation: move 8s linear infinite paused;
    }

    @keyframes move {
        from{transform: rotateZ(0deg)}
        to{transform: rotateZ(360deg)}
    }


    .title p
    {
        text-align: center;
        height: 30px;
        line-height: 30px;
        font-size: 16px;
    }

.title p.songname{
    height: 40px;
    line-height: 40px;
    font-size: 20px;
}

    .dots
    {
        margin-top: 30px;
        text-align: center;
        margin-bottom: 30px;
    }

    .dots span{
        display: inline-block;
        height: 15px;
        width: 15px;
        background: white;
        margin: 20px 10px;
        border-radius: 15px;
    }
    .dots span.active{
        width: 30px;
    }
    .progress-wrap
    {
        display: flex;
    }
    .progress-wrap .time
    {
        flex: 1;
        text-align: center;
    }
    .progress
    {
        border: 1px solid white;
        border-radius: 10px;
        position: relative;
    }

    .progress .bar
    {
        height: 100%;
        width:0px;
        float: left;
        background: yellow;
        border-radius: 10px;
    }
    .progress .pbtn
    {
        position: absolute;
        height: 30px;
        width: 30px;
        border-radius: 50%;
        background: white;
        margin-left: -15px;
        top: -7px;
        lefe:0;
    }
    .progress-wrap .progress
    {
        flex:4
    }

    .btns
    {
        display: flex;
        margin-top: 60px;
    }
    .btns>div{
        flex: 1;
        text-align: center;
        color: yellow;
    }
</style>
