<template>
    <div class="recommend" :id="big?'':'sm'">
        <div class="bigscrollbox">
            <div class="scrollbox">
                <div class="slider">
                    <div class="bannerbox" >
                        <div v-for="(item,index)  in bannerlist" class="banneritem">
                            <a :href="item.linkUrl" >
                                <img :src="item.picUrl"    class="img" ref="img">
                            </a>
                        </div>
                    </div>
                    <ul class="dots">
                        <li v-for="(item,index) in bannerlist" :class="{'active':index==sliderIndex}"></li>
                    </ul>
                </div>
                <songlist></songlist>
            </div>
        </div>
    </div>
</template>

<script>
    import vue from 'vue';
    import BScroll from 'better-scroll';
    import  VueResource from 'vue-resource';
    import songlist from './SongList'
    vue.use(VueResource)
    export default {
        data:function () {
            return {
                bannerlist:[],
                isFrist:true,
                sliderIndex:0,
                big:true
            }
        },
        components:{
            songlist
        },
        computed:{
            isbig:function () {
                this.big = this.$store.state.isbig;
                return this.big
            }
        },
        watch:{
            isbig:function () {
                if(this.scroll)
                {
                    this.scroll.refresh();
                }
                this.big = this.$store.state.isbig;
            }
        },
        created:function(){
            this.getbanner();
            this.big = this.$store.state.isbig;
        },
        destroyed:function()
        {
          clearInterval(this.go)
        },
        methods:{
            getbanner:function () {          //异步获取轮播图
                this.$http.jsonp('https://c.y.qq.com/musichall/fcgi-bin/fcg_yqqhomepagerecommend.fcg?g_tk=5381&uin=0&format=json&inCharset=utf-8&outCharset=utf-8&notice=0&platform=h5&needNewCode=1&_=1542587854712',
                    {
                        params:{
                            g_tk: 5381,
                            uin: 0,
                            format: "jsonp",
                            inCharset: "utf-8",
                            outCharset: "utf-8",
                            notice: 0,
                            platform: "h5",
                            needNewCode: 1,
                            // jsonpCallback: "banner"

                        },
                        method:'get',
                        jsonp:'jsonpCallback'
                    }

                ).then((res)=>{
                    this.bannerlist = res.body.data.slider
                    setTimeout(this.getwidth,10)
                })

            },
            initbaner:function () {        //初始化轮播图
                let wrapper = document.querySelector('.slider');
                let scroll = new BScroll(wrapper,{
                    scrollX:true,
                    scrolly:false,
                    momentum: false,
                    click:true,
                    tap:true,
                    snap:{
                        loop:true
                    }
                });

                let wrapper1 = document.querySelector('.recommend');
                let scroll1 = new BScroll(wrapper1,{
                    momentum: true,
                    click:true,
                });



                this.scroll = scroll;
                clearInterval(this.go)
                this.go = setInterval(()=>{          //开启定时器，自动轮播
                    this.scroll.next()
                },4000)
                this.scroll.on('scrollEnd',()=>{        //每次轮播之后记录下标
                    this.sliderIndex = this.scroll.getCurrentPage().pageX;
                });
            },
            getwidth:function () {

                    var imgs = this.$refs.img;
                    var clientWidth = document.documentElement.clientWidth;
                    for(var n=0;n<imgs.length;n++)
                    {
                        imgs[n].style.width=clientWidth+'px';

                    }
                    document.getElementsByClassName('slider')[0].style.width=clientWidth+'px';
                    if(this.isFrist)
                    {
                        n+=2;
                        this.isFrist=!this.isFrist
                    }
                    document.getElementsByClassName('bannerbox')[0].style.width = n*clientWidth+'px';
                    this.initbaner();
            }

        }
    }
</script>

<style scoped >
    #sm{
        height: 604px;
    }
    .recommend
    {
        height: 674px;
        overflow: hidden;
    }
    .slider{
        overflow: hidden;
        position: relative;
        width: 100%;
    }
    .banneritem
    {
        float: left;
    }

    img{
        width: 100%;
    }

    .dots{
        position: absolute;
        display: block;
        z-index: 100;
        bottom: 30px;
        text-align: center;
        left: 50%;
        transform: translateX(-50%);
    }
    .dots li{
        height: 10px;
        width: 10px;
        border-radius: 50%;
        background: white;
        display: inline-block;
        margin: 0 5px;
        border: 4px solid bisque;
    }
    .dots li.active{
        background:bisque
    }
</style>