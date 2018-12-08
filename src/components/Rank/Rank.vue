<template>
    <div class="rank" :id="isbig?'':'sm'" ref="rank">
        <ul v-if="hotlist.length">
            <li v-for="(item,index) in hotlist" @click="select(item.id,item.topTitle,item.picUrl)">
                <div class="img">
                    <img :src="item.picUrl" alt="">
                </div>
                <div class="hot">
                    <p>{{item.topTitle}}</p>
                    <ul class="songlist" type="decimal">
                        <li v-for="(song,index) in item.songList">
                            {{index}}.
                            <span>{{song.songname}}</span>
                            -
                            <span>{{song.singername}}</span>
                        </li>
                    </ul>
                </div>
            </li>
        </ul>
        <transition name="fade">
            <ranklist v-if="isselect" @noshow="close"></ranklist>
        </transition>

    </div>
</template>

<script>
    import vueresource from 'vue-resource';
    import BScroll from 'better-scroll'
    import ranklist from './Ranklist'
    export default {
        data:function () {
            return {
                hotlist:[],
                isbig:true,
                songlist:[],
                title:'',
                img:'',
                isselect:false
            }
        },
        components:{
            ranklist
        },
        computed:{
            big:function () {
                return this.$store.state.isbig;
            }
        },
        watch:{
            songlist:function(n)
            {
                this.$store.commit('sethotimg',this.img)
              this.$store.commit('setsinger',this.title)
              this.$store.commit('setsongs',n)
                this.isselect = true;
            },
          big:function () {
              this.isbig = this.$store.state.isbig;
              this.getscroll();
              if(this.scroll)
              {
                  this.scroll.refresh();
              }

          },
          hotlist:function () {
                this.$nextTick(()=>{
                    this.getscroll();
                })
            }
        },
        created:function () {
            this.getrank();
            this.isbig = this.$store.state.isbig
        },
        methods:{
            close:function()
            {
                this.isselect = false;
            },
            select:function(id,title,url)
            {
                this.title = title;
                this.img = url;
                this.$http.get(`http://localhost:8888/api/getranksong?id=${id}`).then(
                    (res)=> {
                        var list = res.body.songlist;
                        this.clearlist(list);
                    }
                )
            },
            clearlist:function(list)
            {
                var arr = [];
                for(var n=0;n<list.length;n++)
                {
                    var im = list[n].data;
                    var item ={
                        albummid:im.albummid,
                        albumname:im.albumname,
                        singer:this.getsinger(im.singer),
                        songmid:im.songmid,
                        songname:im.songname
                    };
                    arr.push(item)

                }
                this.songlist = arr;
            },
            getsinger:function(arr)
            {
                var newArr =[];
              for(var n=0;n<arr.length;n++)
              {
                newArr.push(arr[n].name);
              }
              return newArr.join('-');
            },
            getscroll:function()
            {
              var scroll = new BScroll(this.$refs.rank,{
                  click:true
              })
                this.scroll = scroll;
            },
            getrank:function () {
                this.$http.get('http://localhost:8888/api/getrank')
                    .then((res)=>{
                        this.hotlist = res.body.data.topList;
                    })
            }
        }
    }
</script>

<style scoped>
    .fade-enter,.fade-leave-to{
        left:100%;
        opacity: 0;
    }
    .fade-enter-to,.fade-leave
    {
        left: 0;
        opacity: 1;
    }
    .fade-enter-active,.fade-leave-active{
        transition: all .5s;
    }

    .rank
    {
        height: 675px;
        overflow: hidden;
    }
    #sm
    {
        height: 605px;
    }
    .rank>ul
    {
        width: 100%;
        display: block;
    }
    .rank>ul>li
    {
        padding: 20px 30px;
        display: flex;
        height: 100px;
        overflow: hidden;
    }
    .rank ul li .img{
        flex: 2;
    }
    .rank ul li .hot
    {
        flex:5;
        padding: 5px 20px;
    }
    .hot p
    {
        font-size: 20px;
    }
    .hot ul li
    {
        width: 320px;
        padding: 5px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
    img
    {
        height: 100px;
        width: 100px;
    }
</style>