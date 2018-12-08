<template>
        <div class="singerdetail" ref="scroll" @touchstart.stop="ts" @touchmove.stop="tm" :id="big?'':'sm'" >
            <div class="bigscroll"  >
                <div class="topImg" ref="topImg">
                    <div class="top-content">
                        <div class="info">
                            <img :src="singerurl" alt="">
                            <div class="name">{{singerName}}</div>
                        </div>
                        <div class="bt" @click="play">播放全部 </div>
                    </div>
                </div>
                <div class="scroll" ref="scroll1"  :id="big?'':'smm'">
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
                </div>
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
                songs:[],
                singerurl:null,
                singerName:null,
                scrollx:{
                    x1:0,
                    x2:0,
                },
                big:true,
                y:0,
                y1:0
            }
        },
        created:function () {
            this.songs = this.$store.state.songs;
            this.big = this.$store.state.isbig;
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
            y:function(n)
            {
                if(n>-160)
                {
                    this.$nextTick(()=>{
                        this.scroll1.scrollTo(0,0);
                        this.scroll1.disable();
                    })

                }
                else
                {
                    this.$nextTick(()=>{
                        this.scroll.refresh();
                        this.scroll1.enable();
                    })
                }
            },
            y1:function(n1)
            {
              if(n1<0)
              {
                  this.$nextTick(()=>{
                      this.scroll.scrollTo(0,-160);
                      this.scroll.disable();
                  })

              }
              else
              {
                  this.$nextTick(()=>{
                      this.scroll.refresh();
                      this.scroll.enable();
                  })

              }
            },
            isbig:function()
            {
                this.big = this.$store.state.isbig;
                this.$nextTick(()=>{
                    this.scroll.refresh();
                    this.scroll1.refresh();
                })
            },
            singerurl:function () {
                this.$refs.topImg.style.backgroundImage=`url(${this.singerurl})`
                this.initscroll();
            }
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
                this.singerurl = this.$store.state.hotimg
            },
            getFirstName:function () {
                this.singerName = this.$store.state.singer

            },
            initscroll:function () {
                var scroll = this.$refs.scroll;  //最大的
                this.scroll = new BScroll(scroll,{
                    scrollY:false,
                    scrollY:true,
                    click:true,
                    momentum:true,
                    bounce:false,
                    probeType:3,
                    startY:0
                })
                var scroll1 = this.$refs.scroll1;  //小的
                this.scroll1 = new BScroll(scroll1,{
                    scrollY:false,
                    scrollY:true,
                    click:true,
                    bounce:false,
                    momentum:true,
                    probeType:3,
                    startY:0,
                });
                this.setscroll();
            },
            setscroll:function () {
                this.scroll.on('scroll',(pos)=>{   //最外层（图片+歌曲列表）
                    this.y = pos.y;
                })

                this.scroll1.on('scroll',(pos)=>{   //里层 (歌曲列表)
                    this.y1 = pos.y;
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
        height: 619px;
    }
      .singerdetail{
      position: absolute;
      top: 0;
      left:0;
      height: 763px;
      width: 100%;
      z-index: 10;
      overflow: hidden;
      background: white;
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