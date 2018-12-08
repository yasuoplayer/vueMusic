<template>
    <div class="singers" >
        <h5>{{title}}</h5>
        <div class="scroll" :id="big?'':'sm'">
            <div class="scrollbox">
                <ul v-for="(item,index) in list" v-if="list.length" ref="type">
                    <li>
                        <h5 class="title">{{item.title}}</h5>
                        <ul>
                            <li v-for="(singer,index) in item.singer" class="singer"
                            @click="selectsinger(singer)">
                                <img v-lazy="singer.tx">
                                <div class="name">{{singer.name}}</div>
                            </li>
                        </ul>
                    </li>
                </ul>
            </div>
        </div>
        <div class="dots">
            <ul @touchstart="ts" @touchmove.stop.prevent="tm">
                <li v-for="(item,index) in list" v-if="list.length"
                    :class="{'active':index==Index}"
                    :data-index='index'
                    ref="dot"
                >
                {{item.title.charAt(0)}}
                </li>
            </ul>
        </div>
        <transition name="detail">
        <singerdetail v-if="isShow" :singerurl="singerurl" @noshow="closeinfo"></singerdetail>
        </transition>
    </div>
</template>

<script>
    import vue from 'vue'
    import  vueresource from 'vue-resource'
    import lz from 'vue-lazyload'
    import  BScroll from 'better-scroll'
    import singerdetail from './SingerDetail'
    vue.use(vueresource)
    vue.use(lz)
    export default {
        data:function () {
            return {
                list:[],
                Index:0,
                y:0,
                arrheight:[],
                title:'热门',
                pos:{
                    y:0,
                    y1:0,
                    y2:0
                },
                singerimg:null,
                isShow:false,
                big:true
            }
        },
        computed:{
          isbig:function () {
              this.big = this.$store.state.isbig;
            return this.$store.state.isbig;
          }
        },
        watch:{
            isbig:function()
            {
                if(this.scroll)
                {
                    this.scroll.refresh();
                }
                this.big = this.$store.state.isbig;

            },
            y:function () {
                for(var i=0;i<this.arrheight.length-1;i++)
                {
                    if(this.y>=this.arrheight[i]&&this.y<this.arrheight[i+1])
                    {
                        this.Index = i;
                        this.title = this.list[i].title;
                        if(this.title=='热')
                        {this.title='热门'}
                        break;
                    }
                }
            }
        },
        mounted:function()
        {
            let wrapper = document.querySelector('.scroll')
            let scroll = new BScroll(wrapper,{
                probeType:3,
                momentum:true,
                click:true
            });
            this.scroll = scroll;
            this.initscroll();
        },
        created:function () {
            this.$http.jsonp('https://c.y.qq.com/v8/fcg-bin/v8.fcg',{   //获取歌手数据
                params:{
                    channel:"singer",
                    page:"list",
                    key:"all_all_all",
                    pagesize:100,
                    pagenum:1,
                    g_tk:5381,
                    loginUin:0,
                    hostUin:0,
                    format:'jsonp',
                    inCharset:'utf8',
                    outCharset:'utf-8',
                    notice:0,
                    platform:'yqq',
                    needNewCode:0
                },
                jsonp:'jsonpCallback'
            }).then((res)=>{
                this.clearlist(res.body.data.list)
            })
        },

        methods:{
            closeinfo:function () {
                this.isShow = false;
            },
            clearlist:function (data) {
                var arr = [];
                var item = {
                    title:'热',
                    singer:[],
                }
                var reg = new RegExp('[a-zA-Z]')
                arr.push(item)
                for (var n=0;n<data.length;n++)
                {
                    var title = data[n].Findex;  //标志
                    var name = data[n].Fsinger_name; //名字
                    var id = data[n].Fsinger_mid;  //id
                    var tx = `https://y.gtimg.cn/music/photo_new/T001R150x150M000${id}.jpg?max_age=2592000`;
                    var isFind = false;


                    if(n<10)
                    {
                        arr[0].singer.push({
                            title:data[n].Findex,
                            name:data[n].Fsinger_name,
                            id:id = data[n].Fsinger_mid,
                            tx:`https://y.gtimg.cn/music/photo_new/T001R150x150M000${data[n].Fsinger_mid}.jpg?max_age=2592000`
                        })
                    }


                    if(!reg.test(title))
                    {
                        continue
                    }

                    for(var j=0;j<arr.length;j++)
                    {
                        if(arr[j].title==title)
                        {
                            arr[j].singer.push({
                                title:data[n].Findex,
                                name:data[n].Fsinger_name,
                                id : data[n].Fsinger_mid,
                                tx:`https://y.gtimg.cn/music/photo_new/T001R150x150M000${data[n].Fsinger_mid}.jpg?max_age=2592000`
                            })
                            isFind=true
                            break;
                        }
                    }
                    if(isFind==false)
                    {
                        var newItem ={
                            title:data[n].Findex,
                            singer:[]
                        }
                        newItem.singer.push({
                            title:data[n].Findex,
                            name:data[n].Fsinger_name,
                            id : data[n].Fsinger_mid,
                            tx:`https://y.gtimg.cn/music/photo_new/T001R150x150M000${data[n].Fsinger_mid}.jpg?max_age=2592000`
                        })
                        arr.push(newItem)
                    }
                }
                 //过滤完成

                var endarr = arr.slice(1);
                var start = arr.slice(0,1);

                endarr.sort(function (a,b) {   //排序
                    return a.title.charCodeAt(0)-b.title.charCodeAt(0)
                })
                this.list = start.concat(endarr);
                setTimeout(this.cal,20)  //异步问题
            },
            cal:function () {
                var arr = [];
                arr[0]=0;
                var h = 0;
                var hei = 0;
                var uls = this.$refs.type;
                for(var n=0;n<uls.length;n++)
                {
                    var height = uls[n].offsetHeight;
                    h+=height;
                    arr.push(h)
                }
                this.arrheight = arr;
            },
            initscroll:function () {
                this.scroll.on('scroll',(pos)=>{
                    this.y = -pos.y
                })
            },
            ts:function (e) {
                this.pos.y1 = e.touches[0].pageY
                var index = e.target.getAttribute('data-index');
                index = parseInt(index);
                this.pos.y = index;  //如果用this.Index 在移动过程中会不断累加，导致加速
                this.scroll.scrollTo(0,-this.arrheight[index],300);
            },
            tm:function (e) {
                this.pos.y2 = e.touches[0].pageY;

                var change =Math.floor((this.pos.y2-this.pos.y1)/26);
                var index = this.pos.y+change;
                var length = this.arrheight.length-2;
                if(index<0)
                {
                    index =0;
                }
                if(index>length)
                {
                    index = length;
                }
                this.Index = index;
                this.scroll.scrollTo(0,-this.arrheight[index],300);
            },
            getSinger:function(arr)
            {
                var arr1 = [];
                for (var n=0;n<arr.length;n++)
                {
                    arr1.push(arr[n].name)
                }
                return arr1.join('-');
            },
            selectsinger:function (singer) {
                this.$http.jsonp('https://c.y.qq.com/v8/fcg-bin/fcg_v8_singer_track_cp.fcg',{
                    params:{
                        g_tk: 5381,
                        loginUin: 0,
                        hostUin: 0,
                        format: 'jsonp',
                        inCharset: 'utf8',
                        outCharset: 'utf-8',
                        notice: 0,
                        platform: 'yqq',
                        needNewCode: 0,
                        order: 'listen',
                        begin: 0,
                        num: 30,
                        songstatus: 1,
                        singermid:singer.id
                    },
                    jsonp:"jsonpCallback"
                }).then((res)=>{
                    var arr = res.body.data.list
                    var songs = [];
                    for(var n=0;n<arr.length;n++)
                    {
                        var data = arr[n].musicData;
                        var item = {};
                        item.albummid=data.albummid;
                        item.albumname = data.albumname;
                        item.songmid = data.songmid;
                        item.songname = data.songname;
                        item.singer = this.getSinger(data.singer);
                        songs.push(item)
                    }
                    this.singerurl = singer.tx;
                    this.isShow = true;
                    this.$store.commit('setsongs',songs)
                })
            },

        },
        components:{
            singerdetail
        }
    }
</script>

<style scoped>
    #sm{
        height: 575px;
    }
    .scroll{
        height: 645px;
        overflow: hidden;
    }

    .dots{
        position: fixed;
        top: 50%;
        right: 20px;
        text-align: center;
        transform: translateY(-50%);
        padding: 20px 5px;
        z-index: 200;
    }
    .dots li{
        padding: 5px 0;
    }
    .dots li.active{
        color: yellow;
    }
 h5{
     background: #7B68EE;
     padding: 7px 20px;
 }

 img{
     display: block;
     width: 60px;
     height: 60px;
     float: left;
     margin-top: 10px ;
 }
.name
 {
     float: left;
     line-height: 80px;
     margin-left: 40px;
 }

 .singer{
     height: 80px;
     padding-left:20px ;
     clear: both;
 }

    .detail-enter,.detail-leave-to
    {
        left: 100%;
    }
    .detail-enter-to,.detail-leave
    {
        left: 0;
    }
    .detail-enter-active,.detail-leave-active{
        transition: .5s all;
    }

</style>
