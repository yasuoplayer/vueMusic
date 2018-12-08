<template>
        <div class="singerdetail" ref="scroll" @touchstart.stop="ts" @touchmove.stop="tm" :id="big?'':'sm'" >
            <div class="bigscroll"  >
                <!--顶部图片-->
                <div class="topImg" ref="topImg">
                    <div class="top-content">
                        <div class="info">
                            <img :src="singerurl" alt="">
                            <div class="name">{{singerName}}</div>
                        </div>
                        <div class="bt" @click="play">播放全部 </div>
                    </div>
                </div>
                    <!--歌曲列表-->
                    <div class="songs">
                        <div class="songnum">共{{songNum}}首歌曲</div>
                        <ul>
                            <li v-for="(item,index) in songs" :key="index" @click="selectmusic(index,item)">
                                <div class="index">{{index+1}}</div>
                                <div class="songinfo">
                                    <p class="singer">{{item.songname}}</p>
                                    <p>{{item.singer}}</p>
                                </div>
                            </li>
                        </ul>
                    </div>
                    <!--歌曲列表结束-->
            </div>
        </div>
</template>

<script>
    import vue from  'vue';
    import  vueresource from 'vue-resource';
    import BScroll from 'better-scroll'
    export default {
        data:function () {
            return {
                songs:'',
                fistImgUrl:null,
                singerName:null,
                scrollx:{
                    x1:0,
                    x2:0,
                },
                big:true,
            }
        },
        props:[
          'singerurl'
        ],
        created:function () {
            this.songs = this.$store.state.songs;
            this.big = this.$store.state.isbig
            this.getFirstUrl();
            this.getFirstName();
        },
        computed:{
          songNum:function () {
              return this.songs.length;
          },
            isbig:function () {
              this.big = this.$store.state.isbig;
              return this.$store.state.isbig
            }
        },
        watch:{
            songs:function(n)
            {
                this.$nextTick(()=>{
                    this.initscroll()
                    if(this.scroll)
                    {
                        this.scroll.refresh()
                    }
                })
            },
            isbig:function()
            {
                this.big = this.$store.state.isbig;
            },
            fistImgUrl:function () {
                this.$refs.topImg.style.backgroundImage=`url(${this.fistImgUrl})`;
            }
        },
        mounted()
        {
            this.initscroll()
        },
        methods:{
            selectmusic:function(index,song)
            {
                this.$store.commit('setcurrentindex',index)
                this.$store.commit('setcurrentsong',song)
                this.$store.commit('setplay',true)
            },
            play:function()
            {
                this.$store.commit('setsongs',this.songs)
                this.$store.commit('setplay',true)
            },
            getFirstUrl:function () {
                var id = this.songs[0].albummid;
                this.fistImgUrl = `https://y.gtimg.cn/music/photo_new/T002R300x300M000${id}.jpg?max_age=2592000`
            },
            getFirstName:function () {
                this.singerName = this.songs[0].singer;

            },
            initscroll:function () {
                var scroll = this.$refs.scroll;  //最大的
                this.scroll = new BScroll(scroll,{
                    click:true,
                    momentum:true,
                    bounce:false,
                    mouseWheel: {
                        speed: 20,
                        invert: false,
                        easeTime: 300
                    }
                })
            },
            ts:function (e) {
                this.scrollx.x1 = e.touches[0].clientX;
            },
            tm:function (e) {
                this.scrollx.x2 = e.touches[0].clientX;
                if(this.scrollx.x2-this.scrollx.x1>80)
                {
                    this.$emit('noshow')
                }
            }
        }
    }
</script>

<style scoped>
    #sm
    {
        height: 693px !important;
    }

    #smm
    {
        height: 442px;
    }
      .singerdetail{
      position: absolute;
      top: 0;
      left:0;
      height: 763px;
      width: 100%;
      z-index: 300;
      overflow: hidden;
      background: white;
  }
    .bigscroll{
        position: relative;
        top: 0;
        left: 0;
        z-index: 400;
    }
    .topImg{
        position: relative;
        height: 250px;
        width: 100%;
        background-position:0 0;
        background-size:100% 500px;
        background-repeat:no-repeat;
        overflow: hidden;
    }
    .topImg:after
    {
        content: "";
        width:100%;
        height:100%;
        position: absolute;
        left:0;
        top:0;
        background: inherit;
        filter: blur(10px);
        z-index: 2;
    }
    .top{
        height: 250px;
        width: 100%;
    }

    .top-content
    {
        position: relative;
        z-index: 3;

    }

    .info
    {
        height: 120px;
        width: 100%;
        margin-top: 40px;
    }
  .top-content .info img{
      float: left;
      width: 120px;
      height: 120px;
      margin-left: 50px;
  }
  .top-content .info .name{
      float: left;
      line-height: 120px;
      margin-left: 20px;
  }
  .top-content .bt{
      background: limegreen;
      width: 200px;
      height: 50px;
      line-height:50px ;
      position: relative;
      left: 50%;
      transform: translateX(-50%);
      top: 20px;
      border-radius: 20px;
      text-align: center;
  }

    .songnum{
        padding: 0 20px;
        height: 40px;
        line-height: 40px;
    }

    .scroll{
        height: 679px;
        overflow: hidden;
    }

    .songs{
        position: relative;
        color:#333;
    }

    ul li{
        display: flex;
        height: 70px;
        padding: 0 10px;
    }

  ul li .index{
      flex: 2;
      text-align: center;
      line-height: 50px;
  }
  ul li .songinfo{
      flex:8
  }
  ul li .songinfo p.singer{
      height: 30px;
      line-height: 30px;
      font-size: 18px;

  }
  ul li .songinfo p{
      height: 20px;
      line-height: 20px;
      font-size: 16px;
      overflow: hidden;
      text-overflow:ellipsis;
      white-space: nowrap;
  }

</style>
